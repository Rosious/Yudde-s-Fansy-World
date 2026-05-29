// ============================================================
// CellComponent — 三消棋盘单个棋子组件（Cocos Creator 3.x）
//
// 挂在 cellPrefab 上，负责：
// - 显示棋子精灵图
// - 处理点击事件并通知父节点 Match3GridComponent
// ============================================================

import { _decorator, Component, Sprite, Node, EventTouch } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 单个棋子组件。
 *
 * 每个 CellComponent 代表棋盘上的一个棋子，
 * 持有自己的行列坐标，点击时通知父节点进行交互处理。
 */
@ccclass('CellComponent')
export class CellComponent extends Component {
    /** 棋子精灵（在编辑器中绑定） */
    @property({ type: Sprite, tooltip: '棋子精灵组件' })
    sprite: Sprite | null = null;

    /** 棋子所在行号 */
    row: number = 0;

    /** 棋子所在列号 */
    col: number = 0;

    // ==========================================================
    // 生命周期
    // ==========================================================

    onLoad(): void {
        // 注册触摸事件
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy(): void {
        // 清理触摸事件监听
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // ==========================================================
    // 公共方法
    // ==========================================================

    /**
     * 初始化棋子数据。
     *
     * 设置棋子的行列坐标和节点名称，方便调试时在场景树中识别。
     *
     * @param row - 行号
     * @param col - 列号
     * @param cellType - 棋子类型（ElementType 枚举值字符串）
     */
    setup(row: number, col: number, cellType: string): void {
        this.row = row;
        this.col = col;
        this.node.name = `Cell_${row}_${col}_${cellType}`;
    }

    // ==========================================================
    // 事件处理
    // ==========================================================

    /**
     * 触摸结束事件处理。
     *
     * 通过字符串获取父节点上的 Match3GridComponent 组件，
     * 并调用其 onCellClicked 方法传递当前棋子的行列坐标。
     * 使用字符串方式避免循环引用问题。
     *
     * @param _event - 触摸事件对象（此处未使用）
     */
    private onTouchEnd(_event: EventTouch): void {
        // 通过字符串名获取组件，避免与 Match3GridComponent 产生循环 import
        const grid = this.node.parent?.getComponent('Match3GridComponent');
        if (grid) {
            (grid as any).onCellClicked(this.row, this.col);
        }
    }
}
