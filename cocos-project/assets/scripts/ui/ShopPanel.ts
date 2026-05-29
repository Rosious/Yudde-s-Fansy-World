// ============================================================
// ShopPanel — 店铺订单面板（Cocos Creator 3.x Component）
//
// 挂在店铺场景根节点上，负责：
// - 展示当前活跃订单列表
// - 显示金币/小红花数量
// - 订单提交交互
// ============================================================

import {
    _decorator,
    Component,
    Node,
    Label,
    Button,
    Prefab,
    instantiate,
    Sprite,
    resources,
    Color,
} from 'cc';
import { MainGameFlow } from './MainGameFlow';
import { OrderManager } from '../../../../src/systems/order/OrderManager';
import { InventorySystem } from '../../../../src/systems/inventory/InventorySystem';
import { eventBus } from '../../../../src/core/EventBus';
import { GameEvent } from '../../../../src/types';
import type { Order, OrderRequirement } from '../../../../src/types';

const { ccclass, property } = _decorator;

/**
 * 店铺订单面板。
 *
 * 交互流程：
 * 1. 玩家进入店铺场景，面板自动生成 4 个随机订单
 * 2. 每个订单卡片显示顾客名、需求材料、奖励
 * 3. 点击"提交"按钮 → 检查库存 → 扣除材料 → 获得奖励
 * 4. 订单完成后刷新列表，经济标签同步更新
 */
@ccclass('ShopPanel')
export class ShopPanel extends Component {
    // ---- @property 属性（在编辑器中绑定） ----

    /** 订单卡片预制体（需包含 NameLabel、RequirementLabel、RewardLabel、SubmitBtn 子节点） */
    @property({ type: Prefab, tooltip: '订单卡片预制体' })
    orderCardPrefab: Prefab | null = null;

    /** 订单列表滚动容器的 content 节点 */
    @property({ type: Node, tooltip: '订单列表容器节点' })
    orderListContainer: Node | null = null;

    /** 金币数量标签 */
    @property({ type: Label, tooltip: '金币数量标签' })
    goldLabel: Label | null = null;

    /** 小红花数量标签 */
    @property({ type: Label, tooltip: '小红花数量标签' })
    flowerLabel: Label | null = null;

    // ---- 私有成员 ----

    /** 订单管理器引用（来自 MainGameFlow 单例） */
    private orderManager!: OrderManager;

    /** 背包系统引用 */
    private inventorySystem!: InventorySystem;

    // ==========================================================
    // 生命周期
    // ==========================================================

    onLoad(): void {
        // 从全局协调器获取系统实例
        const mgf = MainGameFlow.getInstance();
        this.inventorySystem = mgf.inventorySystem;
        this.orderManager = mgf.orderManager;

        // 初始化经济标签
        this.updateGoldLabel(0);
        this.updateFlowerLabel(0);

        // 监听订单完成事件 → 刷新列表
        eventBus.on(GameEvent.ORDER_COMPLETED, this.onOrderCompleted);

        // 监听金币变化事件 → 更新标签
        eventBus.on(GameEvent.GOLD_CHANGED, this.onGoldChanged);

        // 监听小红花变化事件 → 更新标签
        eventBus.on(GameEvent.FLOWER_CHANGED, this.onFlowerChanged);

        // 初次进入：生成 4 个订单
        this.orderManager.generateOrders(4);
        this.refreshOrders();
    }

    onDestroy(): void {
        // 清理事件监听，防止内存泄漏
        eventBus.off(GameEvent.ORDER_COMPLETED, this.onOrderCompleted);
        eventBus.off(GameEvent.GOLD_CHANGED, this.onGoldChanged);
        eventBus.off(GameEvent.FLOWER_CHANGED, this.onFlowerChanged);
    }

    // ==========================================================
    // 订单列表刷新
    // ==========================================================

    /**
     * 刷新订单列表。
     *
     * 清空当前列表容器，重新遍历活跃订单并生成卡片。
     * 如果没有活跃订单，列表为空。
     */
    refreshOrders(): void {
        if (!this.orderListContainer || !this.orderCardPrefab) {
            console.warn('[ShopPanel] orderListContainer 或 orderCardPrefab 未绑定！');
            return;
        }

        // 清空旧卡片
        this.orderListContainer.removeAllChildren();

        // 获取当前活跃订单
        const activeOrders = this.orderManager.getActiveOrders();
        if (activeOrders.length === 0) {
            console.log('[ShopPanel] 当前无活跃订单。');
            return;
        }

        // 为每个订单创建卡片
        for (const order of activeOrders) {
            this.createOrderCard(order);
        }
    }

    /**
     * 根据订单数据创建一个订单卡片节点，添加到列表容器中。
     *
     * 卡片结构（子节点名约定）：
     * - NameLabel:     顾客名称
     * - RequirementLabel: 需求文本，如 "红线团 x3  纽扣 x2"
     * - RewardLabel:   奖励文本，如 "金币+30  花+4"
     * - SubmitBtn:     提交按钮
     *
     * @param order - 订单数据
     */
    private createOrderCard(order: Order): void {
        const cardNode = instantiate(this.orderCardPrefab!);
        cardNode.parent = this.orderListContainer;

        // ---- 顾客名称 ----
        const nameLabel = cardNode.getChildByName('NameLabel')?.getComponent(Label);
        if (nameLabel) {
            nameLabel.string = order.customerName;
        }

        // ---- 需求文本 ----
        const reqLabel = cardNode.getChildByName('RequirementLabel')?.getComponent(Label);
        if (reqLabel) {
            reqLabel.string = this.formatRequirements(order.requirements);
        }

        // ---- 奖励文本 ----
        const rewardLabel = cardNode.getChildByName('RewardLabel')?.getComponent(Label);
        if (rewardLabel) {
            rewardLabel.string = `金币+${order.rewardGold}  花+${order.rewardFlower}`;
            rewardLabel.color = new Color(255, 215, 0); // 金色
        }

        // ---- 提交按钮 ----
        const submitBtn = cardNode.getChildByName('SubmitBtn')?.getComponent(Button);
        if (submitBtn) {
            submitBtn.node.on(Button.EventType.CLICK, () => {
                this.onSubmitOrder(order.orderId);
            }, this);
        }
    }

    /**
     * 将需求数组格式化为可读文本。
     *
     * 材料 ID → 中文名映射：
     * LINE → 红线团, BUTTON → 纽扣, SCISSORS → 剪刀, TAPE → 皮尺, SEWING → 缝纫机
     *
     * @param requirements - 订单需求列表
     * @returns 格式化文本，如 "红线团 x3  纽扣 x2"
     */
    private formatRequirements(requirements: OrderRequirement[]): string {
        const nameMap: Record<string, string> = {
            LINE: '红线团',
            BUTTON: '纽扣',
            SCISSORS: '剪刀',
            TAPE: '皮尺',
            SEWING: '缝纫机',
        };

        return requirements
            .map((req) => `${nameMap[req.itemId] ?? req.itemId} x${req.count}`)
            .join('  ');
    }

    // ==========================================================
    // 订单提交
    // ==========================================================

    /**
     * 提交指定订单。
     *
     * 调用 OrderManager.submitOrder，根据结果弹窗提示：
     * - success → 弹出"完成！"
     * - fail → 弹出"材料不足"（或具体原因）
     *
     * @param orderId - 要提交的订单 ID
     */
    private onSubmitOrder(orderId: string): void {
        const result = this.orderManager.submitOrder(orderId);

        if (result.success) {
            console.log(`[ShopPanel] 订单 ${orderId} 提交成功！`);
            this.showToast('完成！');
        } else {
            console.warn(`[ShopPanel] 订单 ${orderId} 提交失败: ${result.reason}`);
            this.showToast(result.reason === '订单不存在' ? '订单已失效' : '材料不足');
        }
    }

    // ==========================================================
    // 事件回调
    // ==========================================================

    /**
     * 订单完成事件回调（由 ORDER_COMPLETED 事件触发）。
     * 刷新订单列表以移除已完成的订单。
     */
    private onOrderCompleted = (): void => {
        this.refreshOrders();
    };

    private onGoldChanged = (payload: { amount: number; newTotal: number }): void => {
        this.updateGoldLabel(payload.newTotal);
    };

    private onFlowerChanged = (payload: { amount: number; newTotal: number }): void => {
        this.updateFlowerLabel(payload.newTotal);
    };

    // ==========================================================
    // UI 更新
    // ==========================================================

    /** 更新金币标签显示 */
    private updateGoldLabel(value: number): void {
        if (this.goldLabel) {
            this.goldLabel.string = `金币: ${value}`;
        }
    }

    /** 更新小红花标签显示 */
    private updateFlowerLabel(value: number): void {
        if (this.flowerLabel) {
            this.flowerLabel.string = `花: ${value}`;
        }
    }

    // ==========================================================
    // 简易提示
    // ==========================================================

    /**
     * 弹出简易文字提示（Console 版实现，生产环境可替换为 UI Toast）。
     *
     * @param message - 提示文字
     */
    private showToast(message: string): void {
        console.log(`[ShopPanel] Toast: ${message}`);
        // 生产环境中可替换为：
        // 1. 创建一个 Toast Label 节点
        // 2. 使用 Tween 做淡入淡出动画
        // 3. 动画结束后销毁节点
    }
}
