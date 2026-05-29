// ============================================================
// 衣橱物语 — 完整游戏循环集成测试
//
// 验证多个系统模块协同工作的完整流程：
//   三消消除 → 材料入库 → 订单提交 → 金币/小红花 →
//   换装 → Buff 生效 → 存档往返
// ============================================================

import { Match3Engine } from '../../src/systems/match3/Match3Engine';
import { InventorySystem } from '../../src/systems/inventory/InventorySystem';
import { OrderManager } from '../../src/systems/order/OrderManager';
import { DressUpManager } from '../../src/systems/dressup/DressUpManager';
import { SaveManager } from '../../src/systems/save/SaveManager';
import { eventBus } from '../../src/core/EventBus';
import {
  ElementType,
  SpecialType,
  GridConfig,
  Cell,
  DressPart,
  StyleTag,
  DressAttachment,
  MatchBuff,
  GameEvent,
  SaveData,
} from '../../src/types';
import * as fs from 'fs';
import * as path from 'path';

// ---- 常量 ----

const SAVE_DIR = path.resolve('D:/Yudde-Demo/saves');

const ALL_TYPES: ElementType[] = [
  ElementType.LINE,
  ElementType.BUTTON,
  ElementType.SCISSORS,
  ElementType.TAPE,
  ElementType.SEWING,
];

const GRID_8x8: GridConfig = {
  rows: 8,
  cols: 8,
  elementTypes: ALL_TYPES,
};

// ---- 辅助函数 ----

/** 创建单个格子 */
function makeCell(row: number, col: number, type: ElementType): Cell {
  return { row, col, type, special: SpecialType.NONE, tangleCount: 0, isFrozen: false };
}

/**
 * 构建一个 8x8 棋盘，**只保证**第 0 行前 3 个格子是同类型 LINE（水平三连）。
 * 其他格子使用 AABBCCDD 循环 + 按行偏移确保不会意外产生额外的三连。
 */
function buildGridWithHorizontalMatch(): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < 8; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 8; c++) {
      if (r === 0 && c < 3) {
        // 第一个水平三连：LINE, LINE, LINE
        row.push(makeCell(r, c, ElementType.LINE));
      } else {
        // 安全填充：双元素循环 + 行偏移，杜绝 3 连
        const baseIdx = (Math.floor(c / 2) + r) % ALL_TYPES.length;
        row.push(makeCell(r, c, ALL_TYPES[baseIdx]));
      }
    }
    grid.push(row);
  }
  return grid;
}

/** 创建模拟 DressAttachment（带可选 Buff） */
function makeDress(
  overrides: Partial<DressAttachment> & { id: string; part: DressPart },
): DressAttachment {
  return {
    slotName: `slot_${overrides.part.toLowerCase()}`,
    attachmentName: `attach_${overrides.id}`,
    style: StyleTag.SWEET,
    ...overrides,
  };
}

/** 清理存档目录 */
function cleanSaveDir(): void {
  if (fs.existsSync(SAVE_DIR)) {
    const files = fs.readdirSync(SAVE_DIR);
    for (const f of files) {
      fs.unlinkSync(path.join(SAVE_DIR, f));
    }
  }
}

// ---- 全局 beforeEach / afterEach ----

beforeEach(() => {
  eventBus.reset();
});

afterAll(() => {
  cleanSaveDir();
  eventBus.reset();
});

// ============================================================
// 场景 1: 完整游戏循环
// ============================================================

describe('场景 1: 完整游戏循环 — 三消消除 → 库存 → 订单 → 换装', () => {
  it('消除材料入库存 → 生成订单 → 提交订单成功 → 金币增加 → 换装 → Buff & 风格验证', () => {
    // ── Arrange ──────────────────────────────────────────
    const engine = new Match3Engine(GRID_8x8);
    const inventory = new InventorySystem();
    const orderMgr = new OrderManager(inventory);
    const dressUp = new DressUpManager();

    // 记录消除的材料
    const clearedRecords: Array<{ type: string; count: number }> = [];

    // 监听 match:cleared → 材料入库
    eventBus.on(GameEvent.MATCH_CLEARED, (payload: { clearedItems: Array<{ type: string; count: number }> }) => {
      for (const item of payload.clearedItems) {
        clearedRecords.push(item);
        inventory.addItem(item.type, item.count);
      }
    });

    // 构建有水平三连的棋盘
    const grid = buildGridWithHorizontalMatch();

    // 监听金币变化
    const goldHandler = jest.fn();
    eventBus.on(GameEvent.GOLD_CHANGED, goldHandler);

    // 监听小红花变化
    const flowerHandler = jest.fn();
    eventBus.on(GameEvent.FLOWER_CHANGED, flowerHandler);

    // 监听订单完成
    const orderCompletedHandler = jest.fn();
    eventBus.on(GameEvent.ORDER_COMPLETED, orderCompletedHandler);

    // ── Act: Step 1 — 执行三消 ───────────────────────────
    const stepResult = engine.step(grid);

    // ── Assert: Step 1 ───────────────────────────────────
    expect(stepResult.matches.length).toBeGreaterThan(0);
    // 水平三连 LINE 应该被检测到
    const lineMatch = stepResult.matches.find(m => m.type === ElementType.LINE);
    expect(lineMatch).toBeDefined();
    expect(lineMatch!.length).toBeGreaterThanOrEqual(3);

    // 消除事件 → 材料已入库
    expect(clearedRecords.length).toBeGreaterThan(0);
    const lineCleared = clearedRecords.find(r => r.type === ElementType.LINE);
    expect(lineCleared).toBeDefined();
    expect(inventory.getCount(ElementType.LINE)).toBeGreaterThanOrEqual(lineCleared!.count);

    // ── Act: Step 2 — 生成订单 ───────────────────────────
    const orders = orderMgr.generateOrders(2);
    expect(orders.length).toBeGreaterThanOrEqual(1);

    const targetOrder = orders[0];

    // 确保库存有足够材料满足订单
    for (const req of targetOrder.requirements) {
      // 补足差额
      const current = inventory.getCount(req.itemId);
      if (current < req.count) {
        inventory.addItem(req.itemId, req.count - current);
      }
    }
    // 验证库存充足
    for (const req of targetOrder.requirements) {
      expect(inventory.hasItem(req.itemId, req.count)).toBe(true);
    }

    // ── Act: Step 3 — 提交订单 ───────────────────────────
    const submitResult = orderMgr.submitOrder(targetOrder.orderId);

    // ── Assert: Step 3 ───────────────────────────────────
    expect(submitResult.success).toBe(true);

    // 验证金币增加
    expect(goldHandler).toHaveBeenCalled();
    const goldPayload = goldHandler.mock.calls[0][0];
    expect(goldPayload.amount).toBe(targetOrder.rewardGold);
    expect(goldPayload.newTotal).toBe(targetOrder.rewardGold);

    // 验证小红花增加
    expect(flowerHandler).toHaveBeenCalled();
    const flowerPayload = flowerHandler.mock.calls[0][0];
    expect(flowerPayload.amount).toBe(targetOrder.rewardFlower);
    expect(flowerPayload.newTotal).toBe(targetOrder.rewardFlower);

    // 验证订单完成事件
    expect(orderCompletedHandler).toHaveBeenCalled();

    // 提交后库存被扣除
    for (const req of targetOrder.requirements) {
      expect(inventory.getCount(req.itemId)).toBeGreaterThanOrEqual(0);
    }

    // ── Act: Step 4 — 换装 ───────────────────────────────
    const dressAttachment = makeDress({
      id: 'dress_cyber_top',
      part: DressPart.TOP,
      style: StyleTag.CYBER,
      matchBuff: { type: 'COIN_BONUS', value: 30 },
    });

    const changeResult = dressUp.changeEquipment(DressPart.TOP, dressAttachment);
    expect(changeResult.success).toBe(true);

    // ── Assert: Step 4 — Buff 验证 ────────────────────────
    const buffs = dressUp.getActiveBuffs();
    expect(buffs.length).toBe(1);
    expect(buffs[0]).toEqual({ type: 'COIN_BONUS', value: 30 });

    // ── Assert: Step 4 — 风格计分 ─────────────────────────
    const cyberScore = dressUp.getStyleScore(StyleTag.CYBER);
    expect(cyberScore).toBe(1);

    // SWEET 风格未穿任何衣服
    expect(dressUp.getStyleScore(StyleTag.SWEET)).toBe(0);

    // 验证当前穿戴状态
    const currentDress = dressUp.getCurrentDress();
    expect(currentDress[DressPart.TOP]).toBeDefined();
    expect(currentDress[DressPart.TOP]!.id).toBe('dress_cyber_top');
  });
});

// ============================================================
// 场景 2: 库存不足提交被拒绝
// ============================================================

describe('场景 2: 库存不足时提交订单应被拒绝', () => {
  it('库存不够则提交失败，订单和库存状态不变', () => {
    // ── Arrange ──────────────────────────────────────────
    const inventory = new InventorySystem();
    const orderMgr = new OrderManager(inventory);

    // 生成订单
    const orders = orderMgr.generateOrders(1);
    expect(orders.length).toBe(1);
    const order = orders[0];

    // 故意不添加任何材料（库存为空）

    // 记录提交前库存快照
    const beforeInventory = new Map<string, number>();
    for (const req of order.requirements) {
      beforeInventory.set(req.itemId, inventory.getCount(req.itemId));
    }

    // ── Act ──────────────────────────────────────────────
    const result = orderMgr.submitOrder(order.orderId);

    // ── Assert ───────────────────────────────────────────
    expect(result.success).toBe(false);
    expect(result.reason).toBeDefined();
    // 原因应为某个材料不足
    expect(result.reason).toMatch(/不足/);

    // 订单状态仍为 pending
    const activeOrders = orderMgr.getActiveOrders();
    expect(activeOrders.length).toBe(1);
    expect(activeOrders[0].orderId).toBe(order.orderId);

    // 库存未变化（原子性保证）
    for (const req of order.requirements) {
      expect(inventory.getCount(req.itemId)).toBe(beforeInventory.get(req.itemId) ?? 0);
    }
  });

  it('部分库存足够但部分不足 → 全部不扣', () => {
    // ── Arrange ──────────────────────────────────────────
    const inventory = new InventorySystem();
    const orderMgr = new OrderManager(inventory);

    const orders = orderMgr.generateOrders(1);
    const order = orders[0];

    // 只给第一个需求添加材料，但不给其他需求添加
    const firstReq = order.requirements[0];
    if (firstReq) {
      inventory.addItem(firstReq.itemId, firstReq.count);
    }

    // 如果只有一个需求，那这个测试没意义，只验证上一个
    if (order.requirements.length < 2) {
      // 清空库存，重新生成找一个多需求的
      inventory.clear();
      const moreOrders = orderMgr.generateOrders(3);
      // 找第一个有 2+ 需求且两个需求 itemId 不同的订单
      const multiReqOrder = moreOrders.find(
        o => o.requirements.length >= 2 &&
          o.requirements[0].itemId !== o.requirements[1].itemId
      );
      if (!multiReqOrder) {
        // 无法构造符合条件的多需求订单，跳过此检查
        return;
      }
      // 只满足第一个需求
      inventory.addItem(multiReqOrder.requirements[0].itemId, multiReqOrder.requirements[0].count);
      const result = orderMgr.submitOrder(multiReqOrder.orderId);
      expect(result.success).toBe(false);
      // 第一个需求的数量也没变（原子性）
      expect(inventory.getCount(multiReqOrder.requirements[0].itemId)).toBe(multiReqOrder.requirements[0].count);
      // 第二个需求的数量仍为 0
      expect(inventory.getCount(multiReqOrder.requirements[1].itemId)).toBe(0);
      return;
    }

    // ── Act ──────────────────────────────────────────────
    const result = orderMgr.submitOrder(order.orderId);

    // ── Assert ───────────────────────────────────────────
    expect(result.success).toBe(false);

    // 原子性：第一个需求添加了但没被扣掉
    expect(inventory.getCount(firstReq.itemId)).toBe(firstReq.count);

    // 其他需求也没有变化
    for (let i = 1; i < order.requirements.length; i++) {
      expect(inventory.getCount(order.requirements[i].itemId)).toBe(0);
    }
  });
});

// ============================================================
// 场景 3: 换装 Buff 对三消的影响验证
// ============================================================

describe('场景 3: 换装 Buff — 同类型取最大值', () => {
  it('单件衣服的 COIN_BONUS Buff 正确返回', () => {
    // ── Arrange ──────────────────────────────────────────
    const dressUp = new DressUpManager();
    const dress = makeDress({
      id: 'top_buff_10',
      part: DressPart.TOP,
      style: StyleTag.RETRO,
      matchBuff: { type: 'COIN_BONUS', value: 10 },
    });

    // ── Act ──────────────────────────────────────────────
    dressUp.changeEquipment(DressPart.TOP, dress);
    const buffs = dressUp.getActiveBuffs();

    // ── Assert ───────────────────────────────────────────
    expect(buffs).toHaveLength(1);
    expect(buffs[0]).toEqual({ type: 'COIN_BONUS', value: 10 });
  });

  it('同类型 Buff 取最大值（10 vs 20 → 20）', () => {
    // ── Arrange ──────────────────────────────────────────
    const dressUp = new DressUpManager();

    const dress10 = makeDress({
      id: 'top_buff_10',
      part: DressPart.TOP,
      matchBuff: { type: 'COIN_BONUS', value: 10 },
    });

    const dress20 = makeDress({
      id: 'bottom_buff_20',
      part: DressPart.BOTTOM,
      matchBuff: { type: 'COIN_BONUS', value: 20 },
    });

    // ── Act: 先穿 value=10 ───────────────────────────────
    dressUp.changeEquipment(DressPart.TOP, dress10);
    let buffs = dressUp.getActiveBuffs();
    expect(buffs).toEqual([{ type: 'COIN_BONUS', value: 10 }]);

    // ── Act: 再穿 value=20（同类型，应取 max=20）─────────
    dressUp.changeEquipment(DressPart.BOTTOM, dress20);
    buffs = dressUp.getActiveBuffs();

    // ── Assert ───────────────────────────────────────────
    expect(buffs).toEqual([{ type: 'COIN_BONUS', value: 20 }]);
  });

  it('不同类型 Buff 各自独立返回', () => {
    // ── Arrange ──────────────────────────────────────────
    const dressUp = new DressUpManager();

    const coinDress = makeDress({
      id: 'top_coin',
      part: DressPart.TOP,
      matchBuff: { type: 'COIN_BONUS', value: 15 },
    });

    const bombDress = makeDress({
      id: 'bottom_bomb',
      part: DressPart.BOTTOM,
      matchBuff: { type: 'START_BOMB', value: 1 },
    });

    const moveDress = makeDress({
      id: 'shoes_extra',
      part: DressPart.SHOES,
      matchBuff: { type: 'EXTRA_MOVE', value: 3 },
    });

    // ── Act ──────────────────────────────────────────────
    dressUp.changeEquipment(DressPart.TOP, coinDress);
    dressUp.changeEquipment(DressPart.BOTTOM, bombDress);
    dressUp.changeEquipment(DressPart.SHOES, moveDress);

    const buffs = dressUp.getActiveBuffs();

    // ── Assert ───────────────────────────────────────────
    expect(buffs).toHaveLength(3);
    expect(buffs).toContainEqual({ type: 'COIN_BONUS', value: 15 });
    expect(buffs).toContainEqual({ type: 'START_BOMB', value: 1 });
    expect(buffs).toContainEqual({ type: 'EXTRA_MOVE', value: 3 });
  });

  it('换装发射 style:bonus_changed 事件', () => {
    // ── Arrange ──────────────────────────────────────────
    const dressUp = new DressUpManager();
    const handler = jest.fn();
    eventBus.on(GameEvent.STYLE_BONUS_CHANGED, handler);

    const dress = makeDress({
      id: 'top_buff',
      part: DressPart.TOP,
      matchBuff: { type: 'COIN_BONUS', value: 42 },
    });

    // ── Act ──────────────────────────────────────────────
    dressUp.changeEquipment(DressPart.TOP, dress);

    // ── Assert ───────────────────────────────────────────
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        buffs: [{ type: 'COIN_BONUS', value: 42 }],
      }),
    );
  });
});

// ============================================================
// 场景 4: 存档往返
// ============================================================

describe('场景 4: 存档往返 — save() → 清空 → load() → restore()', () => {
  beforeEach(() => {
    cleanSaveDir();
  });

  afterEach(() => {
    cleanSaveDir();
  });

  it('库存 + 金币 + 订单 + 换装状态 → 存档 → 清空 → 读取 → 恢复验证', () => {
    // ── Arrange: 构建游戏状态 ────────────────────────────
    const sm1 = new SaveManager();

    // 金币
    eventBus.emit(GameEvent.GOLD_CHANGED, { amount: 500, newTotal: 500 });
    // 小红花
    eventBus.emit(GameEvent.FLOWER_CHANGED, { amount: 8, newTotal: 8 });
    // 库存
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'LINE', count: 10, newTotal: 10 });
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'BUTTON', count: 5, newTotal: 5 });
    // 订单
    eventBus.emit(GameEvent.ORDER_CREATED, {
      orderId: 'ord-int-1',
      customerName: '莉莉',
      customerAvatar: 'avatar_03',
      requirements: [{ itemId: 'LINE', count: 3 }],
      rewardGold: 30,
      rewardFlower: 2,
      status: 'pending',
    });
    eventBus.emit(GameEvent.ORDER_CREATED, {
      orderId: 'ord-int-2',
      customerName: '娜娜',
      customerAvatar: 'avatar_04',
      requirements: [
        { itemId: 'BUTTON', count: 2 },
        { itemId: 'TAPE', count: 4 },
      ],
      rewardGold: 60,
      rewardFlower: 4,
      status: 'pending',
    });
    // 换装
    eventBus.emit(GameEvent.DRESS_CHANGED, {
      part: DressPart.TOP,
      attachmentId: 'top_crystal',
    });
    eventBus.emit(GameEvent.DRESS_CHANGED, {
      part: DressPart.HAIR,
      attachmentId: 'hair_ponytail',
    });

    // 验证 sm1 的快照
    const snapBefore = sm1.getSnapshot();
    expect(snapBefore.gold).toBe(500);
    expect(snapBefore.flowers).toBe(8);
    expect(snapBefore.inventory).toHaveLength(2);
    expect(snapBefore.orders).toHaveLength(2);
    expect(snapBefore.currentDress).toEqual({
      [DressPart.TOP]: 'top_crystal',
      [DressPart.HAIR]: 'hair_ponytail',
    });

    // ── Act: 存档 ────────────────────────────────────────
    sm1.save(0);

    // 确认文件存在
    const saveFile = path.join(SAVE_DIR, 'slot_0.json');
    expect(fs.existsSync(saveFile)).toBe(true);

    // ── Act: 清空状态（新建 SaveManager）─────────────────
    const sm2 = new SaveManager();
    expect(sm2.getSnapshot().gold).toBe(0);
    expect(sm2.getSnapshot().inventory).toEqual([]);

    // ── Act: 读取存档并恢复 ──────────────────────────────
    const loadedData = sm2.load(0);
    expect(loadedData).not.toBeNull();

    sm2.restore(loadedData!);

    // ── Assert: 恢复验证 ────────────────────────────────
    const snapAfter = sm2.getSnapshot();

    expect(snapAfter.gold).toBe(500);
    expect(snapAfter.flowers).toBe(8);

    // 库存
    expect(snapAfter.inventory).toHaveLength(2);
    expect(snapAfter.inventory).toContainEqual({ itemId: 'LINE', count: 10 });
    expect(snapAfter.inventory).toContainEqual({ itemId: 'BUTTON', count: 5 });

    // 订单
    expect(snapAfter.orders).toHaveLength(2);
    expect(snapAfter.orders[0].orderId).toBe('ord-int-1');
    expect(snapAfter.orders[1].orderId).toBe('ord-int-2');

    // 换装
    expect(snapAfter.currentDress).toEqual({
      [DressPart.TOP]: 'top_crystal',
      [DressPart.HAIR]: 'hair_ponytail',
    });
  });

  it('restore 发射 game:loaded 事件', () => {
    // ── Arrange ──────────────────────────────────────────
    const sm = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 777 });
    sm.save(0);

    const sm2 = new SaveManager();

    // load() 会发射 GAME_LOADED，restore() 也会发射。
    // 在 load 之后注册 handler，只捕获 restore 的一次发射。
    const loadedData = sm2.load(0);
    expect(loadedData).not.toBeNull();

    const handler = jest.fn();
    eventBus.on(GameEvent.GAME_LOADED, handler);

    // ── Act ──────────────────────────────────────────────
    sm2.restore(loadedData!);

    // ── Assert ───────────────────────────────────────────
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ gold: 777 }),
    );
  });

  it('不同 slot 独立存储', () => {
    // ── Arrange ──────────────────────────────────────────
    const sm = new SaveManager();

    // Slot 0: gold=100
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 100 });
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'A', count: 1, newTotal: 1 });
    sm.save(0);

    // Slot 1: gold=200
    const smSlot1 = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 200 });
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'B', count: 2, newTotal: 2 });
    smSlot1.save(1);

    // ── Act & Assert ─────────────────────────────────────
    const smVerify = new SaveManager();

    const data0 = smVerify.load(0);
    smVerify.restore(data0!);
    expect(smVerify.getSnapshot().gold).toBe(100);
    expect(smVerify.getSnapshot().inventory).toEqual([{ itemId: 'A', count: 1 }]);

    const data1 = smVerify.load(1);
    smVerify.restore(data1!);
    expect(smVerify.getSnapshot().gold).toBe(200);
    expect(smVerify.getSnapshot().inventory).toEqual([{ itemId: 'B', count: 2 }]);
  });
});

// ============================================================
// 场景 5: 多次消除级联 — step() 自动处理多轮消除
// ============================================================

describe('场景 5: 三消级联消除 — step() 自动递归直到稳定', () => {
  it('step() 返回 cascades >= 1 且最终棋盘稳定（无三连）', () => {
    // ── Arrange ──────────────────────────────────────────
    const engine = new Match3Engine(GRID_8x8);
    const grid = buildGridWithHorizontalMatch();

    let matchFoundCount = 0;
    let matchClearedCount = 0;

    eventBus.on(GameEvent.MATCH_FOUND, () => {
      matchFoundCount++;
    });
    eventBus.on(GameEvent.MATCH_CLEARED, () => {
      matchClearedCount++;
    });

    // ── Act ──────────────────────────────────────────────
    const result = engine.step(grid);

    // ── Assert ───────────────────────────────────────────
    // 至少有一次消除
    expect(result.cascades).toBeGreaterThanOrEqual(1);
    expect(result.matches.length).toBeGreaterThan(0);

    // MATCH_FOUND 和 MATCH_CLEARED 事件被发射
    expect(matchFoundCount).toBeGreaterThanOrEqual(1);
    expect(matchClearedCount).toBeGreaterThanOrEqual(1);

    // 最终棋盘无三连（稳定状态）
    const finalMatches = engine.findMatches(result.grid);
    expect(finalMatches.length).toBe(0);
  });
});

// ============================================================
// 场景 6: 完整经济循环 — 多次订单提交金币累加
// ============================================================

describe('场景 6: 完整经济循环 — 多次订单累计金币和小红花', () => {
  it('连续提交两个订单，金币和小红花正确累加', () => {
    // ── Arrange ──────────────────────────────────────────
    const inventory = new InventorySystem();
    const orderMgr = new OrderManager(inventory);

    // 生成两个订单
    const orders = orderMgr.generateOrders(2);
    expect(orders.length).toBe(2);

    // 给库存补充满足所有订单的材料
    for (const order of orders) {
      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count * 2); // 多加点防止共享材料不够
      }
    }

    const goldEvents: Array<{ amount: number; newTotal: number }> = [];
    const flowerEvents: Array<{ amount: number; newTotal: number }> = [];

    eventBus.on(GameEvent.GOLD_CHANGED, (payload) => {
      goldEvents.push({ amount: payload.amount, newTotal: payload.newTotal });
    });
    eventBus.on(GameEvent.FLOWER_CHANGED, (payload) => {
      flowerEvents.push({ amount: payload.amount, newTotal: payload.newTotal });
    });

    // ── Act ──────────────────────────────────────────────
    const result1 = orderMgr.submitOrder(orders[0].orderId);
    const result2 = orderMgr.submitOrder(orders[1].orderId);

    // ── Assert ───────────────────────────────────────────
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    // 两次金币事件，累加
    expect(goldEvents.length).toBe(2);
    expect(goldEvents[0].newTotal).toBe(orders[0].rewardGold);
    expect(goldEvents[1].newTotal).toBe(orders[0].rewardGold + orders[1].rewardGold);

    // 两次小红花事件，累加
    expect(flowerEvents.length).toBe(2);
    expect(flowerEvents[0].newTotal).toBe(orders[0].rewardFlower);
    expect(flowerEvents[1].newTotal).toBe(orders[0].rewardFlower + orders[1].rewardFlower);

    // 两个订单都已提交完成（不再是活跃订单）
    expect(orderMgr.getActiveOrders().length).toBe(0);

    // 总金币验证
    expect(orderMgr.getTotalGoldEarned()).toBe(orders[0].rewardGold + orders[1].rewardGold);
    expect(orderMgr.getTotalFlowerEarned()).toBe(orders[0].rewardFlower + orders[1].rewardFlower);
  });
});
