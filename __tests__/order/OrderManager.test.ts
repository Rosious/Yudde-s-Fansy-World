// ============================================================
// OrderManager 测试 — TDD
// ============================================================

import { OrderManager } from '../../src/systems/order/OrderManager';
import { InventorySystem } from '../../src/systems/inventory/InventorySystem';
import { eventBus } from '../../src/core/EventBus';
import { GameEvent } from '../../src/types';
import type { Order } from '../../src/types';

describe('OrderManager', () => {
  let inventory: InventorySystem;
  let orderManager: OrderManager;

  beforeEach(() => {
    inventory = new InventorySystem();
    orderManager = new OrderManager(inventory);
    eventBus.reset();
  });

  // ---- 订单生成 ----

  describe('generateOrders', () => {
    it('生成指定数量的订单', () => {
      const orders = orderManager.generateOrders(3);
      expect(orders).toHaveLength(3);
    });

    it('每个订单有 1-3 个材料需求', () => {
      // 生成足够多的订单来验证需求数在合理范围
      const orders = orderManager.generateOrders(20);
      for (const order of orders) {
        expect(order.requirements.length).toBeGreaterThanOrEqual(1);
        expect(order.requirements.length).toBeLessThanOrEqual(3);
      }
    });

    it('需求材料来自预设池', () => {
      const validMaterials = ['LINE', 'BUTTON', 'SCISSORS', 'TAPE', 'SEWING'];
      const orders = orderManager.generateOrders(20);
      for (const order of orders) {
        for (const req of order.requirements) {
          expect(validMaterials).toContain(req.itemId);
        }
      }
    });

    it('每个需求数量在 1-5 之间', () => {
      const orders = orderManager.generateOrders(20);
      for (const order of orders) {
        for (const req of order.requirements) {
          expect(req.count).toBeGreaterThanOrEqual(1);
          expect(req.count).toBeLessThanOrEqual(5);
        }
      }
    });

    it('奖励金币 = 总需求数量 × 10', () => {
      const orders = orderManager.generateOrders(10);
      for (const order of orders) {
        const totalCount = order.requirements.reduce((sum, r) => sum + r.count, 0);
        expect(order.rewardGold).toBe(totalCount * 10);
      }
    });

    it('奖励小红花 = 需求种类数 × 2', () => {
      const orders = orderManager.generateOrders(10);
      for (const order of orders) {
        const distinctTypes = new Set(order.requirements.map(r => r.itemId)).size;
        expect(order.rewardFlower).toBe(distinctTypes * 2);
      }
    });

    it('每个订单有唯一 orderId', () => {
      const orders = orderManager.generateOrders(10);
      const ids = orders.map(o => o.orderId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('每个订单初始状态为 pending', () => {
      const orders = orderManager.generateOrders(5);
      for (const order of orders) {
        expect(order.status).toBe('pending');
      }
    });

    it('活跃订单不超过 5 个（生成超过上限时截断）', () => {
      // 先生成 5 个
      orderManager.generateOrders(5);
      // 再生成 3 个，但活跃上限为 5，所以应该只新增 0 个
      const newOrders = orderManager.generateOrders(3);
      expect(newOrders).toHaveLength(0);
      expect(orderManager.getActiveOrders()).toHaveLength(5);
    });

    it('已有部分活跃订单时，只补到 5 个', () => {
      orderManager.generateOrders(3);
      expect(orderManager.getActiveOrders()).toHaveLength(3);
      const newOrders = orderManager.generateOrders(5);
      // 应该只新增 2 个，达到 5 上限
      expect(newOrders).toHaveLength(2);
      expect(orderManager.getActiveOrders()).toHaveLength(5);
    });

    it('生成订单时发射 order:created 事件', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.ORDER_CREATED, handler);

      orderManager.generateOrders(3);

      expect(handler).toHaveBeenCalledTimes(3);
      // 每次调用都传入了 { order }
      for (let i = 0; i < 3; i++) {
        expect(handler.mock.calls[i][0]).toHaveProperty('order');
      }
    });
  });

  // ---- 获取活跃订单 ----

  describe('getActiveOrders', () => {
    it('初始无订单返回空数组', () => {
      expect(orderManager.getActiveOrders()).toEqual([]);
    });

    it('返回所有 pending 状态的订单', () => {
      orderManager.generateOrders(3);
      expect(orderManager.getActiveOrders()).toHaveLength(3);
    });

    it('不返回已完成的订单', () => {
      const orders = orderManager.generateOrders(3);

      // 给足库存
      for (const order of orders) {
        for (const req of order.requirements) {
          inventory.addItem(req.itemId, req.count);
        }
      }

      // 完成第一个订单
      orderManager.submitOrder(orders[0].orderId);
      expect(orderManager.getActiveOrders()).toHaveLength(2);
    });

    it('不返回已取消的订单', () => {
      const orders = orderManager.generateOrders(3);
      orderManager.cancelOrder(orders[0].orderId);
      expect(orderManager.getActiveOrders()).toHaveLength(2);
    });
  });

  // ---- 提交订单（成功） ----

  describe('submitOrder - 成功', () => {
    it('库存充足时提交成功', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];

      // 添加足够材料
      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      const result = orderManager.submitOrder(order.orderId);
      expect(result.success).toBe(true);
    });

    it('提交后扣除对应库存', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];

      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count + 10); // 多加一些
      }

      const beforeCounts: Record<string, number> = {};
      for (const req of order.requirements) {
        beforeCounts[req.itemId] = inventory.getCount(req.itemId);
      }

      orderManager.submitOrder(order.orderId);

      // 每个需求物品数量应减少
      for (const req of order.requirements) {
        expect(inventory.getCount(req.itemId)).toBe(beforeCounts[req.itemId] - req.count);
      }
    });

    it('提交后订单状态变为 completed', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];

      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(order.orderId);

      // 从活跃订单列表中找不到该订单
      const activeIds = orderManager.getActiveOrders().map(o => o.orderId);
      expect(activeIds).not.toContain(order.orderId);
    });

    it('提交后累计金币和小红花', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];

      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(order.orderId);

      expect(orderManager.getTotalGoldEarned()).toBe(order.rewardGold);
      expect(orderManager.getTotalFlowerEarned()).toBe(order.rewardFlower);
    });
  });

  // ---- 提交订单事件 ----

  describe('submitOrder - 事件发射', () => {
    it('发射 order:submitted 事件', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.ORDER_SUBMITTED, handler);

      const orders = orderManager.generateOrders(1);
      for (const req of orders[0].requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(orders[0].orderId);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0]).toHaveProperty('order');
    });

    it('发射 order:completed 事件', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.ORDER_COMPLETED, handler);

      const orders = orderManager.generateOrders(1);
      const order = orders[0];
      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(order.orderId);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0]).toEqual({
        order: expect.objectContaining({ orderId: order.orderId, status: 'completed' }),
        rewardGold: order.rewardGold,
        rewardFlower: order.rewardFlower,
      });
    });

    it('发射 gold:changed 事件', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.GOLD_CHANGED, handler);

      const orders = orderManager.generateOrders(1);
      const order = orders[0];
      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(order.orderId);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0]).toEqual({
        amount: order.rewardGold,
        newTotal: order.rewardGold,
      });
    });

    it('发射 flower:changed 事件', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.FLOWER_CHANGED, handler);

      const orders = orderManager.generateOrders(1);
      const order = orders[0];
      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(order.orderId);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0]).toEqual({
        amount: order.rewardFlower,
        newTotal: order.rewardFlower,
      });
    });

    it('多次提交后 gold:changed 的 newTotal 正确累加', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.GOLD_CHANGED, handler);

      // 生成并完成 2 个订单
      const orders = orderManager.generateOrders(2);
      let totalGold = 0;

      for (const order of orders) {
        for (const req of order.requirements) {
          inventory.addItem(req.itemId, req.count);
        }
        orderManager.submitOrder(order.orderId);
        totalGold += order.rewardGold;
      }

      expect(handler).toHaveBeenCalledTimes(2);
      // 最后一次调用的 newTotal 应该是累计值
      expect(handler.mock.calls[1][0]).toEqual({
        amount: orders[1].rewardGold,
        newTotal: totalGold,
      });
    });

    it('事件发射顺序正确：submitted → completed → gold → flower', () => {
      const events: string[] = [];
      eventBus.on(GameEvent.ORDER_SUBMITTED, () => events.push('submitted'));
      eventBus.on(GameEvent.ORDER_COMPLETED, () => events.push('completed'));
      eventBus.on(GameEvent.GOLD_CHANGED, () => events.push('gold'));
      eventBus.on(GameEvent.FLOWER_CHANGED, () => events.push('flower'));

      const orders = orderManager.generateOrders(1);
      for (const req of orders[0].requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(orders[0].orderId);

      expect(events).toEqual(['submitted', 'completed', 'gold', 'flower']);
    });
  });

  // ---- 提交订单（失败） ----

  describe('submitOrder - 失败', () => {
    it('库存不足时返回 { success: false }', () => {
      const orders = orderManager.generateOrders(1);
      // 不添加任何库存
      const result = orderManager.submitOrder(orders[0].orderId);
      expect(result.success).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('库存不足时不会扣除物品（原子性）', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];

      // 只给部分材料
      if (order.requirements.length > 0) {
        // 给第一个需求部分数量（少 1）
        const firstReq = order.requirements[0];
        inventory.addItem(firstReq.itemId, firstReq.count - 1);
      }

      // 记录初始库存
      const before = inventory.toJSON();

      orderManager.submitOrder(order.orderId);

      // 库存不应变化
      expect(inventory.toJSON()).toEqual(before);
    });

    it('库存不足时不发射 order:completed 事件', () => {
      const handler = jest.fn();
      eventBus.on(GameEvent.ORDER_COMPLETED, handler);

      const orders = orderManager.generateOrders(1);
      orderManager.submitOrder(orders[0].orderId);

      expect(handler).not.toHaveBeenCalled();
    });

    it('库存不足时不发射 gold:changed / flower:changed', () => {
      const goldHandler = jest.fn();
      const flowerHandler = jest.fn();
      eventBus.on(GameEvent.GOLD_CHANGED, goldHandler);
      eventBus.on(GameEvent.FLOWER_CHANGED, flowerHandler);

      const orders = orderManager.generateOrders(1);
      orderManager.submitOrder(orders[0].orderId);

      expect(goldHandler).not.toHaveBeenCalled();
      expect(flowerHandler).not.toHaveBeenCalled();
    });

    it('提交不存在的订单返回失败', () => {
      const result = orderManager.submitOrder('non-existent-order');
      expect(result.success).toBe(false);
    });

    it('提交已完成的订单返回失败', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];

      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      // 第一次提交成功
      const firstResult = orderManager.submitOrder(order.orderId);
      expect(firstResult.success).toBe(true);

      // 再次给足库存（模拟）
      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      // 第二次提交应失败（订单已完成）
      const secondResult = orderManager.submitOrder(order.orderId);
      expect(secondResult.success).toBe(false);
    });

    it('库存不足时金币累计不变', () => {
      const orders = orderManager.generateOrders(1);
      // 不给库存

      const beforeGold = orderManager.getTotalGoldEarned();
      orderManager.submitOrder(orders[0].orderId);

      expect(orderManager.getTotalGoldEarned()).toBe(beforeGold);
    });
  });

  // ---- 取消订单 ----

  describe('cancelOrder', () => {
    it('取消 pending 订单返回 true', () => {
      const orders = orderManager.generateOrders(3);
      const result = orderManager.cancelOrder(orders[0].orderId);
      expect(result).toBe(true);
    });

    it('取消后订单不在活跃列表中', () => {
      const orders = orderManager.generateOrders(3);
      orderManager.cancelOrder(orders[0].orderId);

      const activeIds = orderManager.getActiveOrders().map(o => o.orderId);
      expect(activeIds).not.toContain(orders[0].orderId);
    });

    it('取消不存在的订单返回 false', () => {
      const result = orderManager.cancelOrder('non-existent');
      expect(result).toBe(false);
    });

    it('取消已完成的订单返回 false', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];

      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }

      orderManager.submitOrder(order.orderId);
      const result = orderManager.cancelOrder(order.orderId);
      expect(result).toBe(false);
    });
  });

  // ---- 序列化 / 反序列化 ----

  describe('序列化 / 反序列化', () => {
    it('toJSON 返回订单数组', () => {
      orderManager.generateOrders(3);
      const json = orderManager.toJSON();
      expect(Array.isArray(json)).toBe(true);
      expect(json).toHaveLength(3);
    });

    it('fromJSON 正确恢复所有订单', () => {
      // 先创建一些订单
      const orders = orderManager.generateOrders(3);
      const json = orderManager.toJSON();

      // 创建新的 OrderManager
      const newInventory = new InventorySystem();
      const newManager = new OrderManager(newInventory);
      newManager.fromJSON(json);

      expect(newManager.getActiveOrders()).toHaveLength(3);
      // 订单 ID 应对应
      const restoredIds = newManager.getActiveOrders().map(o => o.orderId);
      for (const order of orders) {
        expect(restoredIds).toContain(order.orderId);
      }
    });

    it('toJSON → fromJSON 往返一致', () => {
      orderManager.generateOrders(3);
      const json = orderManager.toJSON();

      const newInventory = new InventorySystem();
      const newManager = new OrderManager(newInventory);
      newManager.fromJSON(json);

      expect(newManager.toJSON()).toEqual(json);
    });

    it('fromJSON 覆盖已有订单', () => {
      orderManager.generateOrders(5);

      // 准备 2 个新订单数据
      const newData: Order[] = orderManager.toJSON().slice(0, 2);
      orderManager.fromJSON(newData);

      expect(orderManager.getActiveOrders()).toHaveLength(2);
    });

    it('序列化不包含金币/小红花累计（由 EconomySystem 单独持久化）', () => {
      const orders = orderManager.generateOrders(1);
      const order = orders[0];
      for (const req of order.requirements) {
        inventory.addItem(req.itemId, req.count);
      }
      orderManager.submitOrder(order.orderId);

      // toJSON 只返回订单数据
      const json = orderManager.toJSON();
      expect(Array.isArray(json)).toBe(true);
      // 恢复后，金币/小红花累计为初始值 0
      const newInventory = new InventorySystem();
      const newManager = new OrderManager(newInventory);
      newManager.fromJSON(json);

      expect(newManager.getTotalGoldEarned()).toBe(0);
      expect(newManager.getTotalFlowerEarned()).toBe(0);
    });
  });

  // ---- 累计追踪 ----

  describe('累计追踪', () => {
    it('初始金币和小红花为 0', () => {
      expect(orderManager.getTotalGoldEarned()).toBe(0);
      expect(orderManager.getTotalFlowerEarned()).toBe(0);
    });

    it('多次完成订单后累计正确', () => {
      const orders = orderManager.generateOrders(3);
      let expectedGold = 0;
      let expectedFlower = 0;

      for (const order of orders) {
        for (const req of order.requirements) {
          inventory.addItem(req.itemId, req.count);
        }
        const result = orderManager.submitOrder(order.orderId);
        if (result.success) {
          expectedGold += order.rewardGold;
          expectedFlower += order.rewardFlower;
        }
      }

      expect(orderManager.getTotalGoldEarned()).toBe(expectedGold);
      expect(orderManager.getTotalFlowerEarned()).toBe(expectedFlower);
    });
  });
});
