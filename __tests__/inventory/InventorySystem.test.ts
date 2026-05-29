// ============================================================
// InventorySystem 测试 — TDD
// ============================================================

import { InventorySystem } from '../../src/systems/inventory/InventorySystem';
import { eventBus } from '../../src/core/EventBus';
import { GameEvent } from '../../src/types';
import type { InventoryItem } from '../../src/types';

describe('InventorySystem', () => {
  let inventory: InventorySystem;

  beforeEach(() => {
    inventory = new InventorySystem();
    eventBus.reset();
  });

  // ---- 基础操作 ----

  describe('addItem', () => {
    it('添加新物品，数量正确', () => {
      inventory.addItem('thread_red', 5);
      expect(inventory.getCount('thread_red')).toBe(5);
    });

    it('累加已有物品', () => {
      inventory.addItem('thread_red', 3);
      inventory.addItem('thread_red', 2);
      expect(inventory.getCount('thread_red')).toBe(5);
    });

    it('添加多个不同物品', () => {
      inventory.addItem('thread_red', 3);
      inventory.addItem('button_gold', 7);
      expect(inventory.getCount('thread_red')).toBe(3);
      expect(inventory.getCount('button_gold')).toBe(7);
    });

    it('传入数量 0 时忽略', () => {
      inventory.addItem('thread_red', 0);
      expect(inventory.getCount('thread_red')).toBe(0);
    });

    it('传入负数时忽略', () => {
      inventory.addItem('thread_red', -5);
      expect(inventory.getCount('thread_red')).toBe(0);
    });

    it('传入非整数时忽略', () => {
      inventory.addItem('thread_red', 3.5);
      expect(inventory.getCount('thread_red')).toBe(0);
    });
  });

  describe('removeItem', () => {
    it('移除足够数量，返回 true', () => {
      inventory.addItem('thread_red', 10);
      const result = inventory.removeItem('thread_red', 4);
      expect(result).toBe(true);
      expect(inventory.getCount('thread_red')).toBe(6);
    });

    it('全部移除后物品 count 为 0（仍存在于背包）', () => {
      inventory.addItem('thread_red', 5);
      const result = inventory.removeItem('thread_red', 5);
      expect(result).toBe(true);
      expect(inventory.getCount('thread_red')).toBe(0);
    });

    it('数量不足时返回 false，不部分移除', () => {
      inventory.addItem('thread_red', 3);
      const result = inventory.removeItem('thread_red', 5);
      expect(result).toBe(false);
      // 原子操作：不应部分移除
      expect(inventory.getCount('thread_red')).toBe(3);
    });

    it('移除不存在的物品返回 false', () => {
      const result = inventory.removeItem('nonexistent', 1);
      expect(result).toBe(false);
    });

    it('传入数量 <= 0 时返回 false', () => {
      inventory.addItem('thread_red', 5);
      expect(inventory.removeItem('thread_red', 0)).toBe(false);
      expect(inventory.removeItem('thread_red', -1)).toBe(false);
      expect(inventory.getCount('thread_red')).toBe(5);
    });
  });

  describe('hasItem', () => {
    it('有足够数量时返回 true', () => {
      inventory.addItem('thread_red', 10);
      expect(inventory.hasItem('thread_red', 5)).toBe(true);
      expect(inventory.hasItem('thread_red', 10)).toBe(true);
    });

    it('数量不足时返回 false', () => {
      inventory.addItem('thread_red', 3);
      expect(inventory.hasItem('thread_red', 5)).toBe(false);
    });

    it('物品不存在时返回 false', () => {
      expect(inventory.hasItem('nonexistent', 1)).toBe(false);
    });
  });

  describe('getCount', () => {
    it('没有物品时返回 0', () => {
      expect(inventory.getCount('anything')).toBe(0);
    });

    it('返回正确数量', () => {
      inventory.addItem('thread_red', 7);
      expect(inventory.getCount('thread_red')).toBe(7);
    });
  });

  describe('getAll', () => {
    it('空背包返回空数组', () => {
      expect(inventory.getAll()).toEqual([]);
    });

    it('返回所有物品列表', () => {
      inventory.addItem('thread_red', 3);
      inventory.addItem('button_gold', 5);
      const all = inventory.getAll();
      expect(all).toHaveLength(2);
      expect(all).toContainEqual({ itemId: 'thread_red', count: 3 });
      expect(all).toContainEqual({ itemId: 'button_gold', count: 5 });
    });

    it('返回的是副本，修改不影响内部', () => {
      inventory.addItem('thread_red', 3);
      const all = inventory.getAll();
      all.push({ itemId: 'hack', count: 999 });
      expect(inventory.getCount('hack')).toBe(0);
    });
  });

  describe('clear', () => {
    it('清空所有物品', () => {
      inventory.addItem('thread_red', 5);
      inventory.addItem('button_gold', 3);
      inventory.clear();
      expect(inventory.getAll()).toEqual([]);
      expect(inventory.getCount('thread_red')).toBe(0);
    });
  });

  // ---- 序列化 ----

  describe('序列化 / 反序列化', () => {
    it('toJSON 返回纯数据数组', () => {
      inventory.addItem('thread_red', 3);
      inventory.addItem('button_gold', 5);
      const json = inventory.toJSON();
      expect(json).toEqual([
        { itemId: 'thread_red', count: 3 },
        { itemId: 'button_gold', count: 5 },
      ]);
    });

    it('fromJSON 正确恢复背包', () => {
      const data: InventoryItem[] = [
        { itemId: 'lace_white', count: 2 },
        { itemId: 'zipper_silver', count: 1 },
      ];
      inventory.fromJSON(data);
      expect(inventory.getCount('lace_white')).toBe(2);
      expect(inventory.getCount('zipper_silver')).toBe(1);
      expect(inventory.getAll()).toHaveLength(2);
    });

    it('fromJSON 覆盖已有数据', () => {
      inventory.addItem('thread_red', 10);
      inventory.fromJSON([{ itemId: 'button_gold', count: 1 }]);
      expect(inventory.getCount('thread_red')).toBe(0);
      expect(inventory.getCount('button_gold')).toBe(1);
    });

    it('toJSON → fromJSON 往返一致', () => {
      inventory.addItem('thread_red', 3);
      inventory.addItem('button_gold', 7);
      inventory.addItem('scissors_blue', 2);

      const json = inventory.toJSON();

      const restored = new InventorySystem();
      restored.fromJSON(json);

      expect(restored.getAll()).toEqual(inventory.getAll());
      expect(restored.getCount('thread_red')).toBe(3);
      expect(restored.getCount('button_gold')).toBe(7);
      expect(restored.getCount('scissors_blue')).toBe(2);
    });
  });

  // ---- 事件 ----

  describe('事件发射', () => {
    it('addItem 发射 item:added 事件', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.ITEM_ADDED, handler);

      inventory.addItem('thread_red', 5);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        itemId: 'thread_red',
        count: 5,
        newTotal: 5,
      });
    });

    it('removeItem 成功时发射 item:removed 事件', () => {
      inventory.addItem('thread_red', 10);

      const handler = jest.fn();
      eventBus.on(GameEvent.ITEM_REMOVED, handler);

      const result = inventory.removeItem('thread_red', 3);

      expect(result).toBe(true);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        itemId: 'thread_red',
        count: 3,
        newTotal: 7,
      });
    });

    it('removeItem 失败时不发射事件', () => {
      inventory.addItem('thread_red', 3);

      const handler = jest.fn();
      eventBus.on(GameEvent.ITEM_REMOVED, handler);

      const result = inventory.removeItem('thread_red', 10);

      expect(result).toBe(false);
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
