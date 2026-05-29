// ============================================================
// SaveManager 测试 — TDD: 先写测试，确认失败后实现
// ============================================================

import { SaveManager } from '../../src/systems/save/SaveManager';
import { eventBus } from '../../src/core/EventBus';
import { GameEvent } from '../../src/types';
import type { SaveData, Order, InventoryItem } from '../../src/types';
import { DressPart, StyleTag } from '../../src/types';
import * as fs from 'fs';
import * as path from 'path';

// ---- helpers ----

const saveDir = path.resolve('D:/Yudde-Demo/saves');

/** 确保测试环境干净：删除存档文件、重置 EventBus */
function setUp() {
  eventBus.reset();
  if (fs.existsSync(saveDir)) {
    const files = fs.readdirSync(saveDir);
    for (const f of files) {
      fs.unlinkSync(path.join(saveDir, f));
    }
  }
}

/** 辅助：创建一个简单订单 */
function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    orderId: 'ord-1',
    customerName: '小红',
    customerAvatar: 'avatar_01.png',
    requirements: [{ itemId: 'thread', count: 3 }],
    rewardGold: 100,
    rewardFlower: 1,
    status: 'pending',
    ...overrides,
  };
}

// ============================================================
// 1. getSnapshot 初始状态
// ============================================================

describe('SaveManager — getSnapshot 初始状态', () => {
  beforeEach(setUp);

  it('初始 snapshot 各项均为默认值', () => {
    const sm = new SaveManager();
    const snap = sm.getSnapshot();

    expect(snap.gold).toBe(0);
    expect(snap.flowers).toBe(0);
    expect(snap.inventory).toEqual([]);
    expect(snap.orders).toEqual([]);
    expect(snap.currentDress).toEqual({});
    expect(snap.dollMood).toBe(0);
    expect(snap.dollAffection).toBe(0);
    expect(snap.matchLevel).toBe(0);
  });
});

// ============================================================
// 2. 事件驱动：监听 gold:changed
// ============================================================

describe('SaveManager — 事件驱动 gold:changed', () => {
  beforeEach(setUp);

  it('gold:changed 事件后 snapshot.gold 更新', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 500 });
    expect(sm.getSnapshot().gold).toBe(500);
  });

  it('连续 gold:changed 事件累积最新值', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 100 });
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 250 });
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 0 });
    expect(sm.getSnapshot().gold).toBe(0);
  });
});

// ============================================================
// 3. 事件驱动：监听 flower:changed
// ============================================================

describe('SaveManager — 事件驱动 flower:changed', () => {
  beforeEach(setUp);

  it('flower:changed 事件后 snapshot.flowers 更新', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.FLOWER_CHANGED, { newTotal: 10 });
    expect(sm.getSnapshot().flowers).toBe(10);
  });
});

// ============================================================
// 4. 事件驱动：监听 item:added / item:removed
// ============================================================

describe('SaveManager — 事件驱动 item:added / item:removed', () => {
  beforeEach(setUp);

  it('item:added 后 inventory 中出现新物品', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'thread', count: 5, newTotal: 5 });
    const inventory = sm.getSnapshot().inventory;
    expect(inventory).toEqual([{ itemId: 'thread', count: 5 }]);
  });

  it('同一物品多次 item:added 走通 newTotal 更新', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'button', count: 3, newTotal: 3 });
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'button', count: 2, newTotal: 5 });
    const inventory = sm.getSnapshot().inventory;
    expect(inventory).toEqual([{ itemId: 'button', count: 5 }]);
  });

  it('item:removed 减少数量到 0 时从列表移除', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'scissors', count: 5, newTotal: 5 });
    eventBus.emit(GameEvent.ITEM_REMOVED, { itemId: 'scissors', count: 5, newTotal: 0 });
    expect(sm.getSnapshot().inventory).toEqual([]);
  });

  it('item:removed 减少数量后 newTotal > 0 保留物品', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'tape', count: 10, newTotal: 10 });
    eventBus.emit(GameEvent.ITEM_REMOVED, { itemId: 'tape', count: 3, newTotal: 7 });
    const inventory = sm.getSnapshot().inventory;
    expect(inventory).toEqual([{ itemId: 'tape', count: 7 }]);
  });

  it('多个不同物品的增删各自独立', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'a', count: 2, newTotal: 2 });
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'b', count: 3, newTotal: 3 });
    eventBus.emit(GameEvent.ITEM_REMOVED, { itemId: 'a', count: 1, newTotal: 1 });
    const inventory = sm.getSnapshot().inventory;
    expect(inventory).toContainEqual({ itemId: 'a', count: 1 });
    expect(inventory).toContainEqual({ itemId: 'b', count: 3 });
    expect(inventory.length).toBe(2);
  });
});

// ============================================================
// 5. 事件驱动：监听 order:created
// ============================================================

describe('SaveManager — 事件驱动 order:created', () => {
  beforeEach(setUp);

  it('order:created 后 orders 追加', () => {
    const sm = new SaveManager();
    const order = makeOrder();
    eventBus.emit(GameEvent.ORDER_CREATED, order);
    expect(sm.getSnapshot().orders).toEqual([order]);
  });

  it('多个 order:created 依次追加', () => {
    const sm = new SaveManager();
    const o1 = makeOrder({ orderId: 'ord-1' });
    const o2 = makeOrder({ orderId: 'ord-2' });
    eventBus.emit(GameEvent.ORDER_CREATED, o1);
    eventBus.emit(GameEvent.ORDER_CREATED, o2);
    expect(sm.getSnapshot().orders.length).toBe(2);
  });
});

// ============================================================
// 6. 事件驱动：监听 dress:changed
// ============================================================

describe('SaveManager — 事件驱动 dress:changed', () => {
  beforeEach(setUp);

  it('dress:changed 后 currentDress 更新', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.DRESS_CHANGED, {
      part: DressPart.TOP,
      attachmentId: 'top_lace_01',
    });
    expect(sm.getSnapshot().currentDress).toEqual({
      [DressPart.TOP]: 'top_lace_01',
    });
  });

  it('多次 dress:changed 累积不同部位', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.DRESS_CHANGED, {
      part: DressPart.HAIR,
      attachmentId: 'hair_ponytail',
    });
    eventBus.emit(GameEvent.DRESS_CHANGED, {
      part: DressPart.SHOES,
      attachmentId: 'shoes_maryjane',
    });
    expect(sm.getSnapshot().currentDress).toEqual({
      [DressPart.HAIR]: 'hair_ponytail',
      [DressPart.SHOES]: 'shoes_maryjane',
    });
  });

  it('同一部位再次 dress:changed 覆盖旧值', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.DRESS_CHANGED, {
      part: DressPart.BOTTOM,
      attachmentId: 'skirt_01',
    });
    eventBus.emit(GameEvent.DRESS_CHANGED, {
      part: DressPart.BOTTOM,
      attachmentId: 'skirt_02',
    });
    expect(sm.getSnapshot().currentDress).toEqual({
      [DressPart.BOTTOM]: 'skirt_02',
    });
  });
});

// ============================================================
// 7. 文件 save / load 往返
// ============================================================

describe('SaveManager — save / load 往返', () => {
  beforeEach(setUp);

  it('save(0) 写入文件，load(0) 读取一致', () => {
    const sm = new SaveManager();

    // 模拟一些状态变化
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 999 });
    eventBus.emit(GameEvent.FLOWER_CHANGED, { newTotal: 5 });
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'ribbon', count: 2, newTotal: 2 });
    eventBus.emit(GameEvent.DRESS_CHANGED, { part: DressPart.ACCESSORY, attachmentId: 'acc_bow' });

    sm.save(0);

    const loaded = sm.load(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.gold).toBe(999);
    expect(loaded!.flowers).toBe(5);
    expect(loaded!.inventory).toEqual([{ itemId: 'ribbon', count: 2 }]);
    expect(loaded!.currentDress).toEqual({ [DressPart.ACCESSORY]: 'acc_bow' });
  });

  it('save() 不传 slot 默认使用 slot=0', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 111 });
    sm.save(); // 不带参数
    const loaded = sm.load(0);
    expect(loaded!.gold).toBe(111);
  });

  it('不同 slot 独立存储', () => {
    const sm1 = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 100 });
    sm1.save(1);

    const sm2 = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 200 });
    sm2.save(2);

    expect(sm2.load(1)!.gold).toBe(100);
    expect(sm2.load(2)!.gold).toBe(200);
  });

  it('load 不存在的文件返回 null', () => {
    const sm = new SaveManager();
    const loaded = sm.load(99);
    expect(loaded).toBeNull();
  });

  it('save 时发射 game:saved 事件', () => {
    const sm = new SaveManager();
    const savedHandler = jest.fn();
    eventBus.on(GameEvent.GAME_SAVED, savedHandler);

    sm.save(0);
    expect(savedHandler).toHaveBeenCalledTimes(1);
  });

  it('load 时发射 game:loaded 事件', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 42 });
    sm.save(0);

    const loadedHandler = jest.fn();
    eventBus.on(GameEvent.GAME_LOADED, loadedHandler);

    sm.load(0);
    expect(loadedHandler).toHaveBeenCalledTimes(1);
    // 事件参数包含 SaveData
    expect(loadedHandler).toHaveBeenCalledWith(
      expect.objectContaining({ gold: 42 }),
    );
  });
});

// ============================================================
// 8. restore — 从数据恢复状态
// ============================================================

describe('SaveManager — restore 恢复状态', () => {
  beforeEach(setUp);

  it('restore 后用 getSnapshot 获取恢复后的数据', () => {
    const sm = new SaveManager();

    const data: SaveData = {
      gold: 500,
      flowers: 3,
      inventory: [{ itemId: 'silk', count: 10 }],
      orders: [],
      currentDress: { [DressPart.TOP]: 'top_star' },
      dollMood: 80,
      dollAffection: 60,
      matchLevel: 5,
    };

    sm.restore(data);
    const snap = sm.getSnapshot();

    expect(snap.gold).toBe(500);
    expect(snap.flowers).toBe(3);
    expect(snap.inventory).toEqual([{ itemId: 'silk', count: 10 }]);
    expect(snap.currentDress).toEqual({ [DressPart.TOP]: 'top_star' });
    expect(snap.dollMood).toBe(80);
    expect(snap.dollAffection).toBe(60);
    expect(snap.matchLevel).toBe(5);
  });

  it('restore 发射 game:loaded 事件', () => {
    const sm = new SaveManager();
    const handler = jest.fn();
    eventBus.on(GameEvent.GAME_LOADED, handler);

    const data: SaveData = {
      gold: 100,
      flowers: 1,
      inventory: [],
      orders: [],
      currentDress: {},
      dollMood: 0,
      dollAffection: 0,
      matchLevel: 1,
    };

    sm.restore(data);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ gold: 100 }));
  });

  it('restore 覆盖已有状态', () => {
    const sm = new SaveManager();

    // 先产生一些状态
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 999 });
    eventBus.emit(GameEvent.ITEM_ADDED, { itemId: 'old', count: 1, newTotal: 1 });

    // restore 覆盖
    const data: SaveData = {
      gold: 50,
      flowers: 0,
      inventory: [],
      orders: [],
      currentDress: {},
      dollMood: 0,
      dollAffection: 0,
      matchLevel: 0,
    };
    sm.restore(data);

    expect(sm.getSnapshot().gold).toBe(50);
    expect(sm.getSnapshot().inventory).toEqual([]);
  });
});

// ============================================================
// 9. 自动保存——仅测试内部机制（不真的等待时间）
// ============================================================

describe('SaveManager — 自动保存', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setUp();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('startAutoSave 注册间隔定时器', () => {
    const sm = new SaveManager();
    eventBus.emit(GameEvent.GOLD_CHANGED, { newTotal: 300 });

    const spy = jest.spyOn(sm, 'save');
    sm.startAutoSave(1000);

    // 还未到时间
    expect(spy).not.toHaveBeenCalled();

    // 快进 1000ms
    jest.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalledTimes(1);

    // 再快进 1000ms
    jest.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalledTimes(2);

    sm.stopAutoSave();
    spy.mockRestore();
  });

  it('stopAutoSave 停止定时器后不再保存', () => {
    const sm = new SaveManager();
    const spy = jest.spyOn(sm, 'save');

    sm.startAutoSave(500);
    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);

    sm.stopAutoSave();
    jest.advanceTimersByTime(2000);
    expect(spy).toHaveBeenCalledTimes(1); // 不再增加

    spy.mockRestore();
  });

  it('startAutoSave 多次调用只保留最新定时器', () => {
    const sm = new SaveManager();
    const spy = jest.spyOn(sm, 'save');

    sm.startAutoSave(500);
    sm.startAutoSave(1000); // 覆盖

    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(0); // 旧定时器已清除

    jest.advanceTimersByTime(500); // 累计 1000ms
    expect(spy).toHaveBeenCalledTimes(1);

    sm.stopAutoSave();
    spy.mockRestore();
  });

  it('未启动自动保存时 stopAutoSave 不抛错', () => {
    const sm = new SaveManager();
    expect(() => sm.stopAutoSave()).not.toThrow();
  });
});
