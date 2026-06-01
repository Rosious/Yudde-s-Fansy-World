// ============================================================
// Match3GridComponent — 三消棋盘主组件（Cocos Creator 3.x）
//
// 挂在棋盘根节点上，负责：
// - 初始化三消引擎并生成棋盘
// - 渲染棋子网格
// - 处理玩家点击与交换交互
// - 级联消除动画循环
// ============================================================

import {
    _decorator,
    Component,
    Node,
    Prefab,
    instantiate,
    Vec3,
    Color,
    Sprite,
    SpriteFrame,
    UITransform,
    Graphics,
    tween,
    resources,
    CCFloat,
    CCInteger,
} from 'cc';
import { Match3Engine } from '../systems/match3/Match3Engine';
import { ElementType, SpecialType, GameEvent } from '../types';
import type { Cell, GridConfig } from '../types';
import { eventBus } from '../core/EventBus';
import { CellComponent } from './CellComponent';

const { ccclass, property } = _decorator;

/**
 * 三消棋盘主组件。
 *
 * 交互流程：
 * 1. onLoad 时创建 Match3Engine，初始化棋盘并渲染
 * 2. 玩家点击棋子 → onCellClicked 处理选中/交换逻辑
 * 3. 交换合法 → 级联消除动画循环
 * 4. 交换非法 → 取消选中，恢复原状态
 */
@ccclass('Match3GridComponent')
export class Match3GridComponent extends Component {
    // ---- @property 属性（在编辑器中绑定） ----

    /** 棋子预制体（需挂载 CellComponent） */
    @property({ type: Prefab, tooltip: '棋子预制体（需挂载 CellComponent 和 Sprite）' })
    cellPrefab: Prefab | null = null;

    /** 单个棋子大小（像素） */
    @property({ type: CCFloat, tooltip: '单个棋子边长（像素）' })
    cellSize: number = 80;

    /** 棋盘行数 */
    @property({ type: CCInteger, tooltip: '棋盘行数' })
    rows: number = 8;

    /** 棋盘列数 */
    @property({ type: CCInteger, tooltip: '棋盘列数' })
    cols: number = 8;

    // ---- 私有成员 ----

    /** 三消引擎实例 */
    private engine!: Match3Engine;

    /** 棋盘子节点二维数组 cellNodes[row][col] */
    private cellNodes: (Node | null)[][] = [];

    /** 当前选中的棋子行号（-1 表示无选中） */
    private selectedRow: number = -1;

    /** 当前选中的棋子列号（-1 表示无选中） */
    private selectedCol: number = -1;

    /** 是否正在处理消除动画（防止连点） */
    private isProcessing: boolean = false;

    /** 当前正在执行的 Tween 动画引用（用于取消） */
    private selectedTween: ReturnType<typeof tween> | null = null;

    // ==========================================================
    // 生命周期
    // ==========================================================

    onLoad(): void {
        // 构建棋盘配置
        const config: GridConfig = {
            rows: this.rows,
            cols: this.cols,
            elementTypes: [
                ElementType.LINE,
                ElementType.BUTTON,
                ElementType.SCISSORS,
                ElementType.TAPE,
                ElementType.SEWING,
            ],
        };

        // 创建三消引擎并初始化棋盘
        this.engine = new Match3Engine(config);
        const grid = this.engine.initGrid();
        this.renderGrid(grid);

        // 监听棋盘稳定事件
        eventBus.on(GameEvent.GRID_STABLE, this.onGridStable);
    }

    onDestroy(): void {
        // 清理事件监听
        eventBus.off(GameEvent.GRID_STABLE, this.onGridStable);
        // 停止所有 Tween 动画
        this.cancelSelectionTween();
    }

    // ==========================================================
    // 棋盘渲染
    // ==========================================================

    /**
     * 根据棋盘数据渲染整个网格。
     *
     * 首次调用时为每个 cell 从预制体创建节点，
     * 后续调用时复用已有节点并更新其显示。
     *
     * @param grid - 棋盘数据二维数组
     */
    renderGrid(grid: Cell[][]): void {
        // 确保 cellNodes 数组已初始化
        if (this.cellNodes.length === 0) {
            for (let r = 0; r < this.rows; r++) {
                this.cellNodes[r] = [];
            }
        }

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = grid[r]?.[c];
                if (!cell) continue;

                let node = this.cellNodes[r]?.[c] ?? null;

                // 首次创建节点
                if (!node) {
                    const createdNode = this.createCellNode();
                    createdNode.parent = this.node;
                    if (!this.cellNodes[r]) {
                        this.cellNodes[r] = [];
                    }
                    this.cellNodes[r][c] = createdNode;
                    node = createdNode;
                }

                if (node) {
                    // 设置位置：x = col * cellSize，y = -row * cellSize（棋盘原点在左上角）
                    const originX = -((this.cols - 1) * this.cellSize) / 2;
                    const originY = ((this.rows - 1) * this.cellSize) / 2;
                    node.setPosition(new Vec3(originX + c * this.cellSize, originY - r * this.cellSize, 0));

                    // 更新棋子精灵显示
                    this.updateCellSprite(node, cell);

                    // 更新 CellComponent 数据
                    const cellComp = this.ensureCellComponent(node);
                    cellComp.setup(r, c, cell.type);
                }
            }
        }
    }

    private createCellNode(): Node {
        if (this.cellPrefab) {
            return instantiate(this.cellPrefab);
        }

        const node = new Node('Cell');
        const transform = node.addComponent(UITransform);
        const size = Math.max(12, this.cellSize - 8);
        transform.setContentSize(size, size);
        node.addComponent(Graphics);
        node.addComponent(CellComponent);
        return node;
    }

    private ensureCellComponent(node: Node): CellComponent {
        let transform = node.getComponent(UITransform);
        if (!transform) {
            transform = node.addComponent(UITransform);
        }

        const size = Math.max(12, this.cellSize - 8);
        transform.setContentSize(size, size);

        let cellComp = node.getComponent(CellComponent);
        if (!cellComp) {
            cellComp = node.addComponent(CellComponent);
        }

        return cellComp;
    }

    /**
     * 根据 cell 数据更新单个节点的精灵显示。
     *
     * 通过 resources.load 动态加载对应棋子类型的 SpriteFrame，
     * 路径格式为 'textures/{ElementType}/spriteFrame'。
     * 特殊道具棋子通过颜色叠加方式高亮标记。
     *
     * @param node - 棋子节点
     * @param cell - 棋子数据
     */
    updateCellSprite(node: Node, cell: Cell): void {
        const sprite = node.getComponent(Sprite);
        // 根据棋子类型动态加载对应精灵帧
        if (!cell.type) {
            if (sprite) {
                sprite.spriteFrame = null;
                sprite.color = new Color(255, 255, 255, 0);
            }
            node.getComponent(Graphics)?.clear();
            return;
        }

        this.drawFallbackCell(node, cell);

        if (!sprite) return;

        const path = this.getElementTexturePath(cell.type);
        resources.load(path, SpriteFrame, (err, spriteFrame) => {
            if (!err && spriteFrame && sprite.isValid) {
                sprite.spriteFrame = spriteFrame;
                node.getComponent(Graphics)?.clear();
            }
        });

        // 特殊道具高亮：通过颜色叠加标记
        if (cell.special !== SpecialType.NONE) {
            const highlightColor = this.getSpecialColor(cell.special);
            sprite.color = highlightColor;
        } else {
            sprite.color = new Color(255, 255, 255, 255);
        }
    }

    /**
     * 获取特殊道具对应的高亮颜色。
     *
     * @param special - 特殊道具类型
     * @returns 对应颜色
     */
    private drawFallbackCell(node: Node, cell: Cell): void {
        const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
        const size = Math.max(12, this.cellSize - 8);
        const half = size / 2;

        graphics.clear();
        graphics.fillColor = this.getElementColor(cell.type);
        graphics.rect(-half, -half, size, size);
        graphics.fill();
        graphics.lineWidth = cell.special !== SpecialType.NONE ? 5 : 2;
        graphics.strokeColor = cell.special !== SpecialType.NONE
            ? this.getSpecialColor(cell.special)
            : new Color(255, 255, 255, 220);
        graphics.rect(-half, -half, size, size);
        graphics.stroke();
    }

    private getElementColor(type: ElementType): Color {
        switch (type) {
            case ElementType.LINE:
                return new Color(231, 76, 60, 255);
            case ElementType.BUTTON:
                return new Color(52, 152, 219, 255);
            case ElementType.SCISSORS:
                return new Color(46, 204, 113, 255);
            case ElementType.TAPE:
                return new Color(241, 196, 15, 255);
            case ElementType.SEWING:
                return new Color(155, 89, 182, 255);
            default:
                return new Color(149, 165, 166, 255);
        }
    }

    private getElementTexturePath(type: ElementType): string {
        switch (type) {
            case ElementType.LINE:
                return 'textures/line/spriteFrame';
            case ElementType.BUTTON:
                return 'textures/button/spriteFrame';
            case ElementType.SCISSORS:
                return 'textures/scissors/spriteFrame';
            case ElementType.TAPE:
                return 'textures/tape/spriteFrame';
            case ElementType.SEWING:
                return 'textures/sewing/spriteFrame';
            default:
                return 'textures/line/spriteFrame';
        }
    }

    private getSpecialColor(special: SpecialType): Color {
        switch (special) {
            case SpecialType.SHUTTLE:
                return new Color(255, 215, 0, 255);   // 金色（飞梭）
            case SpecialType.IRON:
                return new Color(255, 99, 71, 255);    // 番茄红（魔法熨斗）
            case SpecialType.RAINBOW:
                return new Color(0, 255, 255, 255);    // 青色（彩虹布）
            default:
                return new Color(255, 255, 255, 255);
        }
    }

    // ==========================================================
    // 点击交互
    // ==========================================================

    /**
     * 棋子点击事件处理（由 CellComponent 调用）。
     *
     * 交互逻辑：
     * - 无选中棋子 → 选中当前棋子，播放呼吸动画
     * - 同一棋子再次点击 → 取消选中
     * - 不同棋子点击 → 尝试交换，交换有效则进入消除流程，无效则取消选中
     * - 正在处理消除动画中 → 忽略点击
     *
     * @param row - 被点击棋子的行号
     * @param col - 被点击棋子的列号
     */
    onCellClicked(row: number, col: number): void {
        // 动画进行中，忽略点击
        if (this.isProcessing) return;

        // 无选中棋子 → 选中当前棋子
        if (this.selectedRow === -1 || this.selectedCol === -1) {
            this.selectCell(row, col);
            return;
        }

        // 点击同一棋子 → 取消选中
        if (this.selectedRow === row && this.selectedCol === col) {
            this.deselectCell();
            return;
        }

        // 点击不同棋子 → 尝试交换
        this.trySwap(this.selectedRow, this.selectedCol, row, col);
    }

    /**
     * 选中棋子并播放呼吸动画。
     *
     * @param row - 行号
     * @param col - 列号
     */
    private selectCell(row: number, col: number): void {
        this.selectedRow = row;
        this.selectedCol = col;

        const node = this.cellNodes[row]?.[col];
        if (!node) return;

        // 取消之前的选中动画
        this.cancelSelectionTween();

        // 播放呼吸缩放动画（放大→缩小循环）
        this.selectedTween = tween(node)
            .to(0.3, { scale: new Vec3(1.15, 1.15, 1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 取消棋子选中状态并停止动画。
     */
    private deselectCell(): void {
        // 恢复选中棋子缩放
        if (this.selectedRow >= 0 && this.selectedCol >= 0) {
            const node = this.cellNodes[this.selectedRow]?.[this.selectedCol];
            if (node) {
                node.setScale(new Vec3(1, 1, 1));
            }
        }

        this.cancelSelectionTween();
        this.selectedRow = -1;
        this.selectedCol = -1;
    }

    /**
     * 停止选中动画 Tween。
     */
    private cancelSelectionTween(): void {
        if (this.selectedTween) {
            this.selectedTween.stop();
            this.selectedTween = null;
        }
    }

    /**
     * 尝试交换两个棋子。
     *
     * 调用引擎 swap 方法验证交换是否合法（相邻且产生消除）。
     * 若合法则进入消除流程，否则播放抖动提示并取消选中。
     *
     * @param r1 - 第一格行号
     * @param c1 - 第一格列号
     * @param r2 - 第二格行号
     * @param c2 - 第二格列号
     */
    private trySwap(r1: number, c1: number, r2: number, c2: number): void {
        const grid = this.engine.getGrid();
        const result = this.engine.swap(grid, r1, c1, r2, c2);

        // 取消原选中状态
        this.deselectCell();

        if (result.valid) {
            // 交换有效 → 渲染新棋盘并进入消除流程
            this.renderGrid(result.grid);
            this.processMatches(result.grid);
        } else {
            // 交换无效 → 抖动提示，棋盘不变
            this.shakeCell(r1, c1);
            this.shakeCell(r2, c2);
        }
    }

    /**
     * 格子抖动动画（提示非法操作）。
     *
     * @param row - 行号
     * @param col - 列号
     */
    private shakeCell(row: number, col: number): void {
        const node = this.cellNodes[row]?.[col];
        if (!node) return;

        const originalPos = node.getPosition();
        tween(node)
            .to(0.05, { position: new Vec3(originalPos.x + 5, originalPos.y, 0) })
            .to(0.05, { position: new Vec3(originalPos.x - 5, originalPos.y, 0) })
            .to(0.05, { position: new Vec3(originalPos.x + 5, originalPos.y, 0) })
            .to(0.05, { position: new Vec3(originalPos.x - 5, originalPos.y, 0) })
            .to(0.05, { position: originalPos })
            .start();
    }

    // ==========================================================
    // 消除流程（级联动画）
    // ==========================================================

    /**
     * 级联消除处理循环。
     *
     * 逐轮调用引擎的 findMatches → clearMatches → dropAndFill，
     * 每轮之间插入延迟以实现可视化级联消除动画效果。
     * 直到棋盘完全稳定（无新的匹配组）。
     *
     * 注意：不用引擎的 step() 一步到位的做法，
     * 而是手动逐轮推进，以便在每轮之间 renderGrid 更新显示。
     *
     * @param grid - 当前棋盘数据
     */
    private async processMatches(grid: Cell[][]): Promise<void> {
        this.isProcessing = true;
        let currentGrid = grid;
        let cascades = 0;
        const MAX_CASCADES = 100; // 安全上限

        while (cascades < MAX_CASCADES) {
            // 查找当前棋盘上的所有匹配组
            const matches = this.engine.findMatches(currentGrid);
            if (matches.length === 0) {
                // 无匹配组 → 棋盘稳定
                break;
            }

            cascades++;

            // 发射 MATCH_FOUND 事件
            eventBus.emit(GameEvent.MATCH_FOUND, matches);

            // 清除匹配棋子（生成特殊道具）
            currentGrid = this.engine.clearMatches(currentGrid, matches);
            this.renderGrid(currentGrid);

            // 等待 150ms 观看消除效果
            await this.delay(150);

            // 重力下落 + 顶部补充新棋子
            currentGrid = this.engine.dropAndFill(currentGrid);
            this.renderGrid(currentGrid);

            // 等待 150ms 观看下落效果
            await this.delay(150);
        }

        // 发射棋盘稳定事件
        eventBus.emit(GameEvent.GRID_STABLE, currentGrid);

        this.isProcessing = false;
    }

    /**
     * 异步延迟工具。
     *
     * @param ms - 延迟毫秒数
     * @returns Promise
     */
    private delay(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    // ==========================================================
    // 事件回调
    // ==========================================================

    /**
     * 棋盘稳定事件回调。
     *
     * 当 GRID_STABLE 事件触发时，重新渲染棋盘以同步最新状态。
     *
     * @param grid - 稳定后的棋盘数据
     */
    private onGridStable = (grid: Cell[][]): void => {
        // 同步渲染最新棋盘状态
        this.renderGrid(grid);
    };
}
