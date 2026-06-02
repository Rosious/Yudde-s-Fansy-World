// ============================================================
// OrderManager — 订单经营系统
//
// 管理订单生成、提交、取消，以及金币/小红花累计。
// 依赖 InventorySystem 进行库存校验与扣除。
// 所有跨模块通信通过 eventBus 事件发射完成。
// ============================================================

import { eventBus } from '../../core/EventBus';
import { GameEvent } from '../../core/types';
import type { Order, OrderRequirement } from '../../core/types';

/** 材料池：随机抽取 */
const MATERIAL_POOL = ['LINE', 'BUTTON', 'SCISSORS', 'TAPE', 'SEWING'];

/** 顾客名池 */
const CUSTOMER_NAMES = [
  '小红', '小美', '阿花', '莉莉', '娜娜', '思思', '小云', '阿紫', '小樱', '小倩',
];

/** 头像资源池 */
const CUSTOMER_AVATARS = [
  'avatar/customer_01', 'avatar/customer_02', 'avatar/customer_03',
  'avatar/customer_04', 'avatar/customer_05',
];

/** 待注入的库存接口（避免循环引用） */
interface IInventory {
  hasItem(itemId: string, count: number): boolean;
  removeItem(itemId: string, count: number): boolean;
}

/**
 * 订单管理器。
 *
 * 负责：
 * - 随机生成订单（需求、奖励、顾客）
 * - 提交订单（校验库存 → 扣除 → 发放奖励）
 * - 取消订单
 * - 序列化/反序列化
 *
 * 最多同时存在 5 个活跃订单。
 */
export class OrderManager {
  /** 最多活跃订单数 */
  static readonly MAX_ACTIVE_ORDERS = 5;

  /** 背包引用 */
  private inventory: IInventory;

  /** 所有订单（包括已完成/已取消），orderId → Order */
  private orders: Map<string, Order> = new Map();

  /** 订单 ID 自增计数器 */
  private idCounter: number = 0;

  /** 累计金币收入 */
  private totalGoldEarned: number = 0;

  /** 累计小红花收入 */
  private totalFlowerEarned: number = 0;

  /**
   * @param inventory - 背包系统实例（依赖注入）
   */
  constructor(inventory: IInventory) {
    this.inventory = inventory;
  }

  /**
   * 随机生成 N 个订单。
   *
   * 订单受以下规则约束：
   * - 每个订单 1-3 个材料需求，来自预设材料池
   * - 每个需求数量 1-5
   * - 奖励金币 = 总需求数量 × 10
   * - 奖励小红花 = 需求种类数 × 2
   * - 最多同时存在 {@link MAX_ACTIVE_ORDERS} 个活跃订单
   *
   * 每生成一个订单，发射 `order:created` 事件。
   *
   * @param count - 期望生成数量（可能被上限截断）
   * @returns 实际新生成的订单列表
   */
  generateOrders(count: number): Order[] {
    const currentActive = this.getActiveOrders().length;
    const available = Math.max(0, OrderManager.MAX_ACTIVE_ORDERS - currentActive);
    const toGenerate = Math.min(count, available);

    const generated: Order[] = [];

    for (let i = 0; i < toGenerate; i++) {
      const order = this.createRandomOrder();
      this.orders.set(order.orderId, order);
      generated.push(order);

      eventBus.emit(GameEvent.ORDER_CREATED, { order: { ...order } });
    }

    return generated;
  }

  /**
   * 提交订单。
   *
   * 流程：校验库存 → 发射 order:submitted → 逐项扣除 → 标记完成 →
   *       发射 order:completed → 发射 gold:changed → 发射 flower:changed
   *
   * 任何一步库存不足都不会扣除物品（原子性保证）。
   *
   * @param orderId - 订单 ID
   * @returns 是否成功及失败原因
   */
  submitOrder(orderId: string): { success: boolean; reason?: string } {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, reason: '订单不存在' };
    }

    if (order.status !== 'pending') {
      return { success: false, reason: '订单状态不允许提交' };
    }

    // 1. 逐项校验库存
    for (const req of order.requirements) {
      if (!this.inventory.hasItem(req.itemId, req.count)) {
        return { success: false, reason: `${req.itemId}不足` };
      }
    }

    // 2. 发射 order:submitted（手作小游戏时机）
    eventBus.emit(GameEvent.ORDER_SUBMITTED, { order: { ...order } });

    // 3. 逐项扣除库存
    for (const req of order.requirements) {
      this.inventory.removeItem(req.itemId, req.count);
    }

    // 4. 标记完成
    order.status = 'completed';

    // 5. 累计并发射奖励事件
    this.totalGoldEarned += order.rewardGold;
    this.totalFlowerEarned += order.rewardFlower;

    // 6. 发射 order:completed
    eventBus.emit(GameEvent.ORDER_COMPLETED, {
      order: { ...order },
      rewardGold: order.rewardGold,
      rewardFlower: order.rewardFlower,
    });

    // 7. 发射经济事件
    eventBus.emit(GameEvent.GOLD_CHANGED, {
      amount: order.rewardGold,
      newTotal: this.totalGoldEarned,
    });
    eventBus.emit(GameEvent.FLOWER_CHANGED, {
      amount: order.rewardFlower,
      newTotal: this.totalFlowerEarned,
    });

    return { success: true };
  }

  /**
   * 获取所有活跃订单（状态为 pending 或 in_progress）。
   *
   * @returns 活跃订单列表
   */
  getActiveOrders(): Order[] {
    const active: Order[] = [];
    for (const order of this.orders.values()) {
      if (order.status === 'pending' || order.status === 'in_progress') {
        active.push(order);
      }
    }
    return active;
  }

  /**
   * 取消一个 pending 状态的订单。
   *
   * 已完成的订单不可取消。
   *
   * @param orderId - 订单 ID
   * @returns 是否成功取消
   */
  cancelOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (!order) return false;
    if (order.status !== 'pending') return false;

    order.status = 'expired';
    return true;
  }

  /**
   * 序列化所有订单为纯数据数组。
   *
   * @returns 订单数据数组
   */
  toJSON(): Order[] {
    const result: Order[] = [];
    for (const order of this.orders.values()) {
      result.push({ ...order });
    }
    return result;
  }

  /**
   * 从纯数据数组反序列化，覆盖当前全部订单状态。
   *
   * @param orders - 订单数据数组
   */
  fromJSON(orders: Order[]): void {
    this.orders.clear();
    // 重建 ID 计数器
    let maxId = 0;
    for (const order of orders) {
      this.orders.set(order.orderId, { ...order });
      // 从 orderId 中解析数字 ID
      const match = order.orderId.match(/^order_(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxId) maxId = num;
      }
    }
    this.idCounter = maxId;
  }

  /**
   * 获取累计金币收入。
   *
   * @returns 金币累计
   */
  getTotalGoldEarned(): number {
    return this.totalGoldEarned;
  }

  /**
   * 获取累计小红花收入。
   *
   * @returns 小红花累计
   */
  getTotalFlowerEarned(): number {
    return this.totalFlowerEarned;
  }

  // ---- 内部方法 ----

  /**
   * 生成一个随机订单。
   */
  private createRandomOrder(): Order {
    const reqCount = this.randomInt(1, 3);

    // 生成需求（确保不重复类型）
    const shuffled = [...MATERIAL_POOL].sort(() => Math.random() - 0.5);
    const selectedMaterials = shuffled.slice(0, reqCount);

    const requirements: OrderRequirement[] = selectedMaterials.map((itemId) => ({
      itemId,
      count: this.randomInt(1, 5),
    }));

    const totalCount = requirements.reduce((sum, r) => sum + r.count, 0);
    const distinctTypes = new Set(requirements.map((r) => r.itemId)).size;

    const orderId = `order_${++this.idCounter}`;
    const customerName = CUSTOMER_NAMES[this.randomInt(0, CUSTOMER_NAMES.length - 1)];
    const customerAvatar = CUSTOMER_AVATARS[this.randomInt(0, CUSTOMER_AVATARS.length - 1)];

    return {
      orderId,
      customerName,
      customerAvatar,
      requirements,
      rewardGold: totalCount * 10,
      rewardFlower: distinctTypes * 2,
      status: 'pending',
    };
  }

  /**
   * 生成 [min, max] 范围内的随机整数。
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
