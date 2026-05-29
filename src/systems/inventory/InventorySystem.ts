// ============================================================
// InventorySystem — 通用背包系统
//
// 纯逻辑层，不关心 itemId 代表什么物品（线团/纽扣/…）。
// 所有跨模块通信通过 eventBus 发射事件完成。
// ============================================================

import { eventBus } from '../../core/EventBus';
import { GameEvent } from '../../types';
import type { InventoryItem } from '../../types';

/**
 * 通用背包系统。
 *
 * 管理物品 ID → 数量的映射，支持：
 * - 添加/移除物品（原子操作）
 * - 数量查询
 * - 序列化/反序列化
 * - 事件发射（item:added / item:removed）
 *
 * 本系统完全通用，不依赖任何物品语义。
 */
export class InventorySystem {
  /** 内部存储：itemId → count */
  private items: Map<string, number> = new Map();

  /**
   * 添加物品。
   *
   * 数量必须为正整数，否则忽略本次操作。
   * 发射 `item:added` 事件。
   *
   * @param itemId - 物品 ID
   * @param count - 添加数量，必须 > 0 且为整数
   */
  addItem(itemId: string, count: number): void {
    if (!Number.isInteger(count) || count <= 0) return;

    const current = this.items.get(itemId) ?? 0;
    const newTotal = current + count;
    this.items.set(itemId, newTotal);

    eventBus.emit(GameEvent.ITEM_ADDED, {
      itemId,
      count,
      newTotal,
    });
  }

  /**
   * 移除物品（原子操作：要么全扣，要么全不扣）。
   *
   * @param itemId - 物品 ID
   * @param count - 移除数量，必须 > 0 且为整数
   * @returns 是否成功移除
   */
  removeItem(itemId: string, count: number): boolean {
    if (!Number.isInteger(count) || count <= 0) return false;

    const current = this.items.get(itemId) ?? 0;
    if (current < count) return false;

    const newTotal = current - count;
    this.items.set(itemId, newTotal);

    eventBus.emit(GameEvent.ITEM_REMOVED, {
      itemId,
      count,
      newTotal,
    });

    return true;
  }

  /**
   * 检查是否有足够数量的物品。
   *
   * @param itemId - 物品 ID
   * @param count - 需要的数量
   * @returns 是否满足需求
   */
  hasItem(itemId: string, count: number): boolean {
    const current = this.items.get(itemId) ?? 0;
    return current >= count;
  }

  /**
   * 获取某物品当前数量。不存在时返回 0。
   *
   * @param itemId - 物品 ID
   * @returns 当前数量
   */
  getCount(itemId: string): number {
    return this.items.get(itemId) ?? 0;
  }

  /**
   * 获取全部物品列表（返回副本，修改不影响内部状态）。
   *
   * @returns 物品数组
   */
  getAll(): InventoryItem[] {
    const result: InventoryItem[] = [];
    for (const [itemId, count] of this.items) {
      result.push({ itemId, count });
    }
    return result;
  }

  /**
   * 序列化为纯数据数组（适合存档）。
   *
   * @returns InventoryItem 数组
   */
  toJSON(): InventoryItem[] {
    return this.getAll();
  }

  /**
   * 从纯数据数组反序列化，覆盖当前背包全部内容。
   *
   * @param items - InventoryItem 数组
   */
  fromJSON(items: InventoryItem[]): void {
    this.items.clear();
    for (const { itemId, count } of items) {
      if (Number.isInteger(count) && count > 0) {
        this.items.set(itemId, count);
      }
    }
  }

  /**
   * 清空背包所有物品（仅用于测试重置）。
   */
  clear(): void {
    this.items.clear();
  }
}
