// ============================================================
// MainGameFlow — 游戏状态协调器（常驻单例）
//
// 持有 InventorySystem、OrderManager、DressUpManager 的全局引用，
// 确保其余 UI 组件可以通过静态 getInstance() 获取这些系统实例。
// 本节点挂载后即设为持久化节点（场景切换不销毁）。
// ============================================================

import { _decorator, Component, director } from 'cc';
import { InventorySystem } from '../../../../src/systems/inventory/InventorySystem';
import { OrderManager } from '../../../../src/systems/order/OrderManager';
import { DressUpManager } from '../../../../src/systems/dressup/DressUpManager';

const { ccclass, property } = _decorator;

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

        // 设为常驻节点，场景切换不销毁
        director.addPersistRootNode(this.node);

        // 初始化三大核心系统
        this.inventorySystem = new InventorySystem();
        this.orderManager = new OrderManager(this.inventorySystem);
        this.dressUpManager = new DressUpManager();

        console.log('[MainGameFlow] 初始化完成，三大系统已就绪。');
    }

    onDestroy(): void {
        // 清理单例引用，避免野指针
        if (MainGameFlow._instance === this) {
            MainGameFlow._instance = null;
        }
    }
}
