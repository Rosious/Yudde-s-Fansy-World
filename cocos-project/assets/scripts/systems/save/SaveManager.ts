// ============================================================
// SaveManager — 事件驱动的存档系统
//
// 本模块不主动拉取其他系统的数据，而是通过监听 EventBus
// 上的事件被动收集状态，维护一份内存 SaveData 快照。
//
// save/load 通过文件 I/O 完成持久化，支持多槽位。
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

import { eventBus } from '../../core/EventBus';
import { GameEvent } from '../../types';
import type { SaveData, InventoryItem, Order } from '../../types';
import type { DressPart } from '../../types';

/** 存档文件存放目录 */
const SAVE_DIR = path.resolve('D:/Yudde-Demo/saves');

/** 默认初始存档数据 */
function createDefaultSaveData(): SaveData {
  return {
    gold: 0,
    flowers: 0,
    inventory: [],
    orders: [],
    currentDress: {},
    dollMood: 0,
    dollAffection: 0,
    matchLevel: 0,
  };
}

/**
 * 存档管理器。
 *
 * 职责：
 * - 监听全局事件，自动更新内存快照
 * - 将快照写入 JSON 文件（多槽位支持）
 * - 从文件恢复快照并发射 game:loaded 事件
 * - 支持定时自动保存
 *
 * 本系统零 UI 依赖，完全是数据面逻辑。
 */
export class SaveManager {
  /** 内存中的存档快照 */
  private data: SaveData;

  /** 自动保存定时器句柄 */
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  /** 注册的各事件回调引用，用于测试清理时无需显式调用 */
  private listeners: Array<{ event: string; fn: (...args: any[]) => void }> = [];

  constructor() {
    this.data = createDefaultSaveData();
    this.registerListeners();
  }

  // ---- Public API ----

  /**
   * 立即将当前内存快照保存到文件。
   *
   * @param slot - 存档槽位编号，默认 0
   */
  save(slot: number = 0): void {
    this.ensureSaveDir();
    const filePath = this.slotPath(slot);
    const json = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(filePath, json, 'utf-8');
    eventBus.emit(GameEvent.GAME_SAVED);
  }

  /**
   * 从文件加载存档，返回解析后的 SaveData。
   *
   * @param slot - 存档槽位编号，默认 0
   * @returns 解析后的 SaveData，若文件不存在或格式错误则返回 null
   */
  load(slot: number = 0): SaveData | null {
    const filePath = this.slotPath(slot);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed: SaveData = JSON.parse(raw);
      eventBus.emit(GameEvent.GAME_LOADED, parsed);
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * 启动自动保存，每隔指定毫秒自动调用 save()。
   *
   * 若已有运行中的定时器，会先停止旧的再启动新的。
   *
   * @param intervalMs - 保存间隔（毫秒）
   */
  startAutoSave(intervalMs: number): void {
    this.stopAutoSave();
    this.autoSaveTimer = setInterval(() => {
      this.save();
    }, intervalMs);
  }

  /**
   * 停止自动保存，清除定时器。
   */
  stopAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * 获取当前内存状态快照的深拷贝。
   *
   * @returns 当前 SaveData 副本
   */
  getSnapshot(): SaveData {
    return JSON.parse(JSON.stringify(this.data)) as SaveData;
  }

  /**
   * 从外部 SaveData 恢复状态（例如加载存档后调用）。
   *
   * 会用传入数据完全覆盖当前内存快照，并发射 game:loaded 事件。
   *
   * @param data - 要恢复的存档数据
   */
  restore(data: SaveData): void {
    this.data = JSON.parse(JSON.stringify(data)) as SaveData;
    eventBus.emit(GameEvent.GAME_LOADED, this.getSnapshot());
  }

  // ---- Private ----

  /** 确保存档目录存在 */
  private ensureSaveDir(): void {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
  }

  /** 返回指定槽位的文件路径 */
  private slotPath(slot: number): string {
    return path.join(SAVE_DIR, `slot_${slot}.json`);
  }

  /**
   * 注册所有需要监听的事件。
   *
   * 每个事件回调直接修改 this.data，实现被动数据收集。
   */
  private registerListeners(): void {
    // 金币变动
    this.on(GameEvent.GOLD_CHANGED, (payload: { newTotal: number }) => {
      this.data.gold = payload.newTotal;
    });

    // 花朵变动
    this.on(GameEvent.FLOWER_CHANGED, (payload: { newTotal: number }) => {
      this.data.flowers = payload.newTotal;
    });

    // 物品添加
    this.on(GameEvent.ITEM_ADDED, (payload: { itemId: string; count: number; newTotal: number }) => {
      this.upsertInventoryItem(payload.itemId, payload.newTotal);
    });

    // 物品移除
    this.on(GameEvent.ITEM_REMOVED, (payload: { itemId: string; count: number; newTotal: number }) => {
      this.upsertInventoryItem(payload.itemId, payload.newTotal);
    });

    // 订单创建
    this.on(GameEvent.ORDER_CREATED, (order: Order) => {
      this.data.orders.push(order);
    });

    // 换装变更
    this.on(GameEvent.DRESS_CHANGED, (payload: { part: DressPart; attachmentId: string }) => {
      this.data.currentDress[payload.part] = payload.attachmentId;
    });
  }

  /**
   * 更新或删除库存中的某个物品。
   *
   * @param itemId - 物品 ID
   * @param newTotal - 经过变动后的最新数量
   */
  private upsertInventoryItem(itemId: string, newTotal: number): void {
    const index = this.data.inventory.findIndex((item) => item.itemId === itemId);
    if (newTotal <= 0) {
      // 数量归零：从列表中移除
      if (index !== -1) {
        this.data.inventory.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        this.data.inventory[index].count = newTotal;
      } else {
        this.data.inventory.push({ itemId, count: newTotal });
      }
    }
  }

  /**
   * 便捷注册带引用追踪的事件监听。
   */
  private on(event: string, fn: (...args: any[]) => void): void {
    eventBus.on(event, fn);
    this.listeners.push({ event, fn });
  }
}
