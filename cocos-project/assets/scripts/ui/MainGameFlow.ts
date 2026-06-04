// ============================================================
// MainGameFlow — 游戏状态协调器（常驻单例）
//
// 持有 InventorySystem、OrderManager、DressUpManager 的全局引用，
// 确保其余 UI 组件可以通过静态 getInstance() 获取这些系统实例。
// 本节点挂载后即设为持久化节点（场景切换不销毁）。
// ============================================================

import { _decorator, Button, Canvas, Camera, Component, Node, Vec3, director } from 'cc';
import { InventorySystem } from '../systems/inventory/InventorySystem';
import { OrderManager } from '../systems/order/OrderManager';
import { DressUpManager } from '../systems/dressup/DressUpManager';
import { eventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import type { ElementType } from '../core/types';

const { ccclass, property } = _decorator;

type SceneKey = 'match' | 'shop' | 'dress';
type SceneName = 'MatchScene' | 'ShopScene' | 'DressScene';

const SCENE_BY_KEY: Record<SceneKey, SceneName> = {
    match: 'MatchScene',
    shop: 'ShopScene',
    dress: 'DressScene',
};

/**
 * 游戏全局主流程协调器。
 *
 * 职责：
 * - 生命周期：场景加载 → 常驻不销毁
 * - 初始化三大核心系统：背包、订单、换装
 * - 对外暴露单例 getInstance() 供所有 UI 面板使用
 *
 * 用法：在首个场景的根节点上挂载此组件即可。
 */
@ccclass('MainGameFlow')
export class MainGameFlow extends Component {
    // ---- 静态单例 ----

    /** 静态单例引用 */
    private static _instance: MainGameFlow | null = null;

    /**
     * 获取 MainGameFlow 单例。
     * 必须在场景中已存在挂载了此组件的节点后调用。
     *
     * @returns MainGameFlow 唯一实例
     * @throws 若尚未初始化则抛出错误
     */
    static getInstance(): MainGameFlow {
        if (!MainGameFlow._instance) {
            throw new Error('[MainGameFlow] 尚未初始化！请确保场景中含有 MainGameFlow 组件节点。');
        }
        return MainGameFlow._instance;
    }

    // ---- 系统引用 ----

    /** 全局背包系统 */
    public inventorySystem!: InventorySystem;

    /** 全局订单管理器 */
    public orderManager!: OrderManager;

    /** 全局换装管理器 */
    public dressUpManager!: DressUpManager;

    private unlockedOutfitLevel: number = 1;

    // ==========================================================
    // 生命周期
    // ==========================================================

    onLoad(): void {
        // 防止重复创建实例
        if (MainGameFlow._instance) {
            console.warn('[MainGameFlow] 已存在单例实例，销毁当前节点。');
            this.node.destroy();
            return;
        }

        // 注册为单例
        MainGameFlow._instance = this;

        this.configureSceneCamera();

        // 设为常驻节点，场景切换不销毁
        director.addPersistRootNode(this.node);

        // 初始化三大核心系统
        this.inventorySystem = new InventorySystem();
        this.orderManager = new OrderManager(this.inventorySystem);
        this.dressUpManager = new DressUpManager();

        console.log('[MainGameFlow] 初始化完成，三大系统已就绪。');

        eventBus.on(GameEvent.MATCH_CLEARED, this.onMatchCleared);
        this.prepareCurrentScene();
    }

    public getUnlockedOutfitLevel(): number {
        return this.unlockedOutfitLevel;
    }

    public registerMatchLevelClear(): number {
        if (this.unlockedOutfitLevel < 5) {
            this.unlockedOutfitLevel += 1;
            console.log(`[MainGameFlow] Outfit level unlocked: ${this.unlockedOutfitLevel}`);
        }

        return this.unlockedOutfitLevel;
    }

    private onMatchCleared = (payload: { clearedItems?: Array<{ type: ElementType; count: number }> }): void => {
        for (const item of payload.clearedItems ?? []) {
            if (item.count > 0) {
                this.inventorySystem.addItem(item.type, item.count);
            }
        }
    };

    private prepareCurrentScene(): void {
        this.configureSceneCamera();
        this.bindBottomButtons();
        this.updateBottomButtonState();
    }

    private configureSceneCamera(): void {
        const scene = director.getScene?.() ?? this.node.parent;
        const cameraNode = scene?.getChildByName('Main Camera');
        const canvasNode = scene?.getChildByName('Canvas');
        const camera = cameraNode?.getComponent(Camera);
        const canvas = canvasNode?.getComponent(Canvas);

        if (!cameraNode || !camera || !canvas) {
            console.warn('[MainGameFlow] Main Camera or Canvas missing; 2D render setup skipped.');
            return;
        }

        cameraNode.setPosition(new Vec3(640, 360, 1000));
        (cameraNode as any).setRotationFromEuler?.(0, 0, 0);
        (camera as any).projection = (Camera as any).ProjectionType?.ORTHO ?? 0;
        (camera as any).orthoHeight = 360;
        (canvas as any).cameraComponent = camera;
        (canvas as any).alignCanvasWithScreen = true;
    }

    private bindBottomButtons(): void {
        const canvas = this.findCanvasNode();
        const bottomBar = canvas?.getChildByName('BottomBar');
        if (!bottomBar) {
            console.warn('[MainGameFlow] BottomBar not found; bottom navigation skipped.');
            return;
        }

        this.bindButton(bottomBar.getChildByName('BtnMatch'), this.onMatchClicked, 'BtnMatch');
        this.bindButton(bottomBar.getChildByName('BtnShop'), this.onShopClicked, 'BtnShop');
        this.bindButton(bottomBar.getChildByName('BtnDress'), this.onDressClicked, 'BtnDress');
    }

    private bindButton(buttonNode: Node | null, handler: () => void, debugName: string): void {
        if (!buttonNode) {
            console.warn(`[MainGameFlow] ${debugName} not found.`);
            return;
        }

        const button = buttonNode.getComponent(Button) ?? buttonNode.addComponent(Button);
        button.interactable = true;
        button.target = buttonNode;

        button.node.off(Button.EventType.CLICK, handler, this);
        button.node.on(Button.EventType.CLICK, handler, this);
    }

    private onMatchClicked(): void {
        this.loadGameScene('match');
    }

    private onShopClicked(): void {
        this.loadGameScene('shop');
    }

    private onDressClicked(): void {
        this.loadGameScene('dress');
    }

    private loadGameScene(key: SceneKey): void {
        const sceneName = SCENE_BY_KEY[key];
        const currentScene = director.getScene();
        const currentSceneName = currentScene?.name ?? (currentScene as any)?._name;

        if (currentSceneName === sceneName) {
            this.prepareCurrentScene();
            return;
        }

        const loadScene = (director as any).loadScene as (name: string, onLaunched?: () => void) => void;
        loadScene.call(director, sceneName, () => this.prepareCurrentScene());
        setTimeout(() => this.prepareCurrentScene(), 0);
        setTimeout(() => this.prepareCurrentScene(), 100);
    }

    private updateBottomButtonState(): void {
        const canvas = this.findCanvasNode();
        const bottomBar = canvas?.getChildByName('BottomBar');
        if (!bottomBar) {
            return;
        }

        const currentScene = director.getScene();
        const currentSceneName = currentScene?.name ?? (currentScene as any)?._name;
        const activeKey = (Object.keys(SCENE_BY_KEY) as SceneKey[])
            .find((key) => SCENE_BY_KEY[key] === currentSceneName);

        const buttonMap: Record<SceneKey, string> = {
            match: 'BtnMatch',
            shop: 'BtnShop',
            dress: 'BtnDress',
        };

        for (const key of Object.keys(buttonMap) as SceneKey[]) {
            const buttonNode = bottomBar.getChildByName(buttonMap[key]);
            buttonNode?.setScale(key === activeKey ? new Vec3(1.08, 1.08, 1) : new Vec3(1, 1, 1));
        }
    }

    private findCanvasNode(): Node | null {
        const scene = director.getScene();
        return scene?.getChildByName('Canvas') ?? this.node.parent?.getChildByName('Canvas') ?? null;
    }

    onDestroy(): void {
        eventBus.off(GameEvent.MATCH_CLEARED, this.onMatchCleared);

        // 清理单例引用，避免野指针
        if (MainGameFlow._instance === this) {
            MainGameFlow._instance = null;
        }
    }
}
