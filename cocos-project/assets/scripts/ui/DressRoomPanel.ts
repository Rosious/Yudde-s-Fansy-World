// ============================================================
// DressRoomPanel — 换装房间面板（Cocos Creator 3.x Component）
//
// 挂在换装场景根节点上，负责：
// - 部位 Tab 切换（头发/上衣/下装/鞋子/配饰）
// - 服装列表展示与点击换装
// - 娃预览图更新
// - 风格计分与 Buff 效果显示
// ============================================================

import {
    _decorator,
    Component,
    Node,
    Label,
    Button,
    Sprite,
    Prefab,
    instantiate,
    resources,
    SpriteFrame,
    Color,
    Vec3,
} from 'cc';
import { MainGameFlow } from './MainGameFlow';
import { DressUpManager } from '../../../../src/systems/dressup/DressUpManager';
import { eventBus } from '../../../../src/core/EventBus';
import { DressPart, StyleTag, GameEvent } from '../../../../src/types';
import type { DressAttachment } from '../../../../src/types';

const { ccclass, property } = _decorator;

type CatalogDressAttachment = DressAttachment & {
    isFullDress?: boolean;
};

/**
 * 换装房间面板。
 *
 * 交互流程：
 * 1. 玩家点击顶部 Tab 切换部位
 * 2. 右侧列表展示该部位所有可用服装
 * 3. 点击某件服装 → 娃模型即时更新
 * 4. 底部显示当前风格计分和 Buff
 */
@ccclass('DressRoomPanel')
export class DressRoomPanel extends Component {
    // ---- @property 属性（在编辑器中绑定） ----

    /** 娃预览 Sprite（简化版预览，生产环境建议用 Spine） */
    @property({ type: Sprite, tooltip: '娃预览图 Sprite' })
    dollPreview: Sprite | null = null;

    /** 部位 Tab 按钮容器（含 5 个子节点：HAIR/TOP/BOTTOM/SHOES/ACCESSORY） */
    @property({ type: Node, tooltip: '部位 Tab 容器节点' })
    tabContainer: Node | null = null;

    /** 服装列表容器（ScrollView 的 content 节点） */
    @property({ type: Node, tooltip: '服装列表容器节点' })
    itemListContainer: Node | null = null;

    /** 服装列表项预制体 */
    @property({ type: Prefab, tooltip: '服装列表项预制体（含 Label、Sprite、Button）' })
    itemPrefab: Prefab | null = null;

    /** 风格计分标签 */
    @property({ type: Label, tooltip: '风格计分标签' })
    styleScoreLabel: Label | null = null;

    /** Buff 效果标签 */
    @property({ type: Label, tooltip: 'Buff 效果标签' })
    buffLabel: Label | null = null;

    // ---- 私有成员 ----

    /** 换装管理器引用（来自 MainGameFlow 单例） */
    private dressUpManager!: DressUpManager;

    /** 当前选中的部位 */
    private currentPart: DressPart = DressPart.HAIR;

    /** 服装目录（所有可用服装数据） */
    private catalog: CatalogDressAttachment[] = [];

    // ==========================================================
    // 生命周期
    // ==========================================================

    onLoad(): void {
        // 从全局协调器获取系统实例
        const mgf = MainGameFlow.getInstance();
        this.dressUpManager = mgf.dressUpManager;

        // 初始化服装目录（每个部位至少 2 件）
        this.initCatalog();

        // 绑定 Tab 按钮事件
        this.initTabs();

        // 默认显示 HAIR 部位
        this.switchTab(DressPart.HAIR);

        // 监听换装事件 → 自动刷新预览和 Buff 显示
        eventBus.on(GameEvent.DRESS_CHANGED, this.onDressChanged);

        // 初始化预览
        this.refreshDollPreview();
        this.refreshBuffDisplay();
    }

    onDestroy(): void {
        // 清理事件监听
        eventBus.off(GameEvent.DRESS_CHANGED, this.onDressChanged);
    }

    // ==========================================================
    // 服装目录初始化
    // ==========================================================

    /**
     * 初始化内置服装目录。
     *
     * 每个部位至少 2 件衣服，覆盖 4 种风格。
     * 部分衣服带有三消 Buff（COIN_BONUS / START_BOMB / EXTRA_MOVE）。
     */
    private initCatalog(): void {
        this.catalog = [
            // ---- 头发 ----
            {
                id: 'hair_01',
                part: DressPart.HAIR,
                slotName: 'hair',
                attachmentName: 'hair_sweet_pink',
                style: StyleTag.SWEET,
                matchBuff: { type: 'COIN_BONUS', value: 10 },
            },
            {
                id: 'hair_02',
                part: DressPart.HAIR,
                slotName: 'hair',
                attachmentName: 'hair_cyber_neon',
                style: StyleTag.CYBER,
            },
            {
                id: 'hair_03',
                part: DressPart.HAIR,
                slotName: 'hair',
                attachmentName: 'hair_retro_curl',
                style: StyleTag.RETRO,
            },

            // ---- 上衣 ----
            {
                id: 'top_01',
                part: DressPart.TOP,
                slotName: 'top',
                attachmentName: 'top_sweet_lace',
                style: StyleTag.SWEET,
                matchBuff: { type: 'START_BOMB', value: 1 },
            },
            {
                id: 'top_02',
                part: DressPart.TOP,
                slotName: 'top',
                attachmentName: 'top_cute_hoodie',
                style: StyleTag.CUTE,
                matchBuff: { type: 'COIN_BONUS', value: 15 },
            },
            {
                id: 'top_03',
                part: DressPart.TOP,
                slotName: 'top',
                attachmentName: 'top_cyber_jacket',
                style: StyleTag.CYBER,
                isFullDress: false,
            },

            // ---- 下装 ----
            {
                id: 'bottom_01',
                part: DressPart.BOTTOM,
                slotName: 'bottom',
                attachmentName: 'bottom_sweet_skirt',
                style: StyleTag.SWEET,
            },
            {
                id: 'bottom_02',
                part: DressPart.BOTTOM,
                slotName: 'bottom',
                attachmentName: 'bottom_retro_pants',
                style: StyleTag.RETRO,
                matchBuff: { type: 'EXTRA_MOVE', value: 3 },
            },
            {
                id: 'bottom_03',
                part: DressPart.BOTTOM,
                slotName: 'bottom',
                attachmentName: 'bottom_cute_shorts',
                style: StyleTag.CUTE,
            },

            // ---- 鞋子 ----
            {
                id: 'shoes_01',
                part: DressPart.SHOES,
                slotName: 'shoes',
                attachmentName: 'shoes_sweet_maryjane',
                style: StyleTag.SWEET,
            },
            {
                id: 'shoes_02',
                part: DressPart.SHOES,
                slotName: 'shoes',
                attachmentName: 'shoes_cyber_boots',
                style: StyleTag.CYBER,
                matchBuff: { type: 'COIN_BONUS', value: 5 },
            },
            {
                id: 'shoes_03',
                part: DressPart.SHOES,
                slotName: 'shoes',
                attachmentName: 'shoes_retro_heels',
                style: StyleTag.RETRO,
            },

            // ---- 配饰 ----
            {
                id: 'acc_01',
                part: DressPart.ACCESSORY,
                slotName: 'accessory',
                attachmentName: 'acc_sweet_bow',
                style: StyleTag.SWEET,
            },
            {
                id: 'acc_02',
                part: DressPart.ACCESSORY,
                slotName: 'accessory',
                attachmentName: 'acc_cute_cat_ears',
                style: StyleTag.CUTE,
                matchBuff: { type: 'EXTRA_MOVE', value: 2 },
            },
            {
                id: 'acc_03',
                part: DressPart.ACCESSORY,
                slotName: 'accessory',
                attachmentName: 'acc_cyber_goggles',
                style: StyleTag.CYBER,
            },
        ];
    }

    // ==========================================================
    // Tab 初始化
    // ==========================================================

    /**
     * 为 tabContainer 中的每个子节点绑定点击事件。
     *
     * 子节点命名约定：HAIR / TOP / BOTTOM / SHOES / ACCESSORY。
     * 根据子节点名称匹配对应的 DressPart 枚举值。
     */
    private initTabs(): void {
        if (!this.tabContainer) return;

        const partMap: Record<string, DressPart> = {
            HAIR: DressPart.HAIR,
            TOP: DressPart.TOP,
            BOTTOM: DressPart.BOTTOM,
            SHOES: DressPart.SHOES,
            ACCESSORY: DressPart.ACCESSORY,
        };

        for (const child of this.tabContainer.children) {
            const part = partMap[child.name];
            if (!part) continue;

            const btn = child.getComponent(Button);
            if (btn) {
                btn.node.on(Button.EventType.CLICK, () => {
                    this.switchTab(part);
                }, this);
            }
        }
    }

    // ==========================================================
    // Tab 切换
    // ==========================================================

    /**
     * 切换到指定部位 Tab。
     *
     * 更新当前选中状态，清空并重新填充服装列表。
     *
     * @param part - 目标部位
     */
    switchTab(part: DressPart): void {
        this.currentPart = part;

        // 更新 Tab 高亮状态
        this.updateTabHighlight(part);

        // 清空当前列表
        if (this.itemListContainer) {
            this.itemListContainer.removeAllChildren();
        }

        // 筛选该部位的服装并创建列表项
        const items = this.catalog.filter((att) => att.part === part);
        for (const attachment of items) {
            this.createItemButton(attachment);
        }
    }

    /**
     * 更新 Tab 按钮的高亮显示。
     *
     * 当前选中的 Tab 按钮颜色变亮，其余恢复默认。
     *
     * @param activePart - 当前选中的部位
     */
    private updateTabHighlight(activePart: DressPart): void {
        if (!this.tabContainer) return;

        const partMap: Record<string, DressPart> = {
            HAIR: DressPart.HAIR,
            TOP: DressPart.TOP,
            BOTTOM: DressPart.BOTTOM,
            SHOES: DressPart.SHOES,
            ACCESSORY: DressPart.ACCESSORY,
        };

        for (const child of this.tabContainer.children) {
            const part = partMap[child.name];
            if (!part) continue;

            const label = child.getComponentInChildren(Label);
            if (label) {
                label.color = part === activePart
                    ? new Color(255, 255, 255) // 选中：白色
                    : new Color(120, 120, 120); // 未选中：灰色
            }
        }
    }

    // ==========================================================
    // 服装列表项创建
    // ==========================================================

    /**
     * 创建一个服装列表按钮。
     *
     * 如果 itemPrefab 已绑定，使用预制体实例化；
     * 否则动态创建一个简单节点。
     *
     * 按钮显示服装名称 + 风格标签，点击后触发换装。
     *
     * @param attachment - 服装附件数据
     */
    private createItemButton(attachment: CatalogDressAttachment): void {
        if (!this.itemListContainer) return;

        let itemNode: Node;

        if (this.itemPrefab) {
            // 使用预制体
            itemNode = instantiate(this.itemPrefab);
        } else {
            // 动态创建简易节点（无预制体时的后备方案）
            itemNode = new Node('Item_' + attachment.id);
            itemNode.addComponent(Button);
            const labelComp = itemNode.addComponent(Label);
            labelComp.string = `${attachment.id} [${attachment.style}]`;
            labelComp.fontSize = 20;
            labelComp.color = new Color(255, 255, 255);
        }

        itemNode.parent = this.itemListContainer;

        // 设置显示文本
        const label = itemNode.getComponentInChildren(Label);
        if (label) {
            const styleNames: Record<string, string> = {
                SWEET: '甜美',
                RETRO: '复古',
                CYBER: '赛博',
                CUTE: '可爱',
            };
            const styleName = styleNames[attachment.style] ?? attachment.style;
            label.string = `${attachment.id} [${styleName}]`;
            // 若带 Buff 则追加标记
            if (attachment.matchBuff) {
                label.string += ` ★B`;
            }
        }

        // 绑定点击事件
        const btn = itemNode.getComponent(Button);
        if (btn) {
            btn.node.on(Button.EventType.CLICK, () => {
                this.onItemClick(attachment);
            }, this);
        }
    }

    // ==========================================================
    // 换装交互
    // ==========================================================

    /**
     * 点击服装列表项 → 执行换装。
     *
     * 调用 DressUpManager.changeEquipment，成功后自动触发
     * DRESS_CHANGED 事件 → onDressChanged 回调刷新预览和 Buff。
     *
     * @param attachment - 选中的服装附件
     */
    private onItemClick(attachment: CatalogDressAttachment): void {
        const result = this.dressUpManager.changeEquipment(attachment.part, attachment);

        if (result.success) {
            console.log(`[DressRoomPanel] 换装成功: ${attachment.id}`);
            if (result.replaced) {
                console.log(`[DressRoomPanel]   替换了旧装: ${result.replaced.id}`);
            }
        }
    }

    // ==========================================================
    // 预览刷新
    // ==========================================================

    /**
     * 根据当前穿戴状态刷新娃预览图。
     *
     * 按部位顺序叠加（HAIR → TOP → BOTTOM → SHOES → ACCESSORY）。
     * 简化版实现：通过 resources.load 加载各部位对应的 SpriteFrame。
     *
     * 生产环境建议使用 Spine 骨骼动画代替 Sprite 叠加。
     */
    refreshDollPreview(): void {
        if (!this.dollPreview) return;

        const currentDress = this.dressUpManager.getCurrentDress();

        // 部位叠层顺序（后渲染的在上层）
        const partOrder: DressPart[] = [
            DressPart.SHOES,
            DressPart.BOTTOM,
            DressPart.TOP,
            DressPart.ACCESSORY,
            DressPart.HAIR,
        ];

        // 尝试加载第一个有效部位的精灵帧作为预览
        // （简化版：显示最后一个已穿戴部位对应的精灵）
        for (let i = partOrder.length - 1; i >= 0; i--) {
            const part = partOrder[i];
            const attachment = currentDress[part];
            if (attachment) {
                // 尝试从 resources 加载对应精灵帧
                const path = `dress_preview/${attachment.id}`;
                resources.load(path, SpriteFrame, (err, spriteFrame) => {
                    if (!err && spriteFrame && this.dollPreview) {
                        this.dollPreview.spriteFrame = spriteFrame;
                    }
                });
                return;
            }
        }

        // 无穿戴 → 显示默认素体
        resources.load('dress_preview/default', SpriteFrame, (err, sf) => {
            if (!err && sf && this.dollPreview) {
                this.dollPreview.spriteFrame = sf;
            }
        });
    }

    /**
     * 刷新 Buff 和风格计分显示。
     *
     * - buffLabel: 当前生效的三消 Buff 列表
     * - styleScoreLabel: 四种风格的当前得分
     */
    refreshBuffDisplay(): void {
        // ---- Buff 显示 ----
        if (this.buffLabel) {
            const buffs = this.dressUpManager.getActiveBuffs();
            if (buffs.length === 0) {
                this.buffLabel.string = '当前无 Buff';
            } else {
                const buffNames: Record<string, string> = {
                    COIN_BONUS: '金币加成',
                    START_BOMB: '开局炸弹',
                    EXTRA_MOVE: '额外步数',
                };
                const lines = buffs.map(
                    (b) => `${buffNames[b.type] ?? b.type}: +${b.value}`
                );
                this.buffLabel.string = 'Buff: ' + lines.join(' | ');
            }
        }

        // ---- 风格计分 ----
        if (this.styleScoreLabel) {
            const styles: StyleTag[] = [
                StyleTag.SWEET,
                StyleTag.RETRO,
                StyleTag.CYBER,
                StyleTag.CUTE,
            ];
            const styleNames: Record<string, string> = {
                SWEET: '甜美',
                RETRO: '复古',
                CYBER: '赛博',
                CUTE: '可爱',
            };

            const lines = styles.map((s) => {
                const score = this.dressUpManager.getStyleScore(s);
                return `${styleNames[s]}: ${score}`;
            });
            this.styleScoreLabel.string = '风格计分: ' + lines.join(' | ');
        }
    }

    // ==========================================================
    // 事件回调
    // ==========================================================

    /**
     * 换装事件回调（由 DRESS_CHANGED 事件触发）。
     * 自动刷新娃预览和 Buff/计分显示。
     */
    private onDressChanged = (): void => {
        this.refreshDollPreview();
        this.refreshBuffDisplay();
    };
}
