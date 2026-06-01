// ============================================================
// 衣橱物语 — 全局类型定义
// 所有模块共享的类型，不依赖任何具体实现
// ============================================================

// ---- 三消 (Match-3) ----

/** 棋子类型：线团、纽扣、剪刀、皮尺、缝纫机 */
export enum ElementType {
  LINE = 'LINE',
  BUTTON = 'BUTTON',
  SCISSORS = 'SCISSORS',
  TAPE = 'TAPE',
  SEWING = 'SEWING',
}

/** 特殊道具（4连/5连生成） */
export enum SpecialType {
  NONE = 'NONE',
  SHUTTLE = 'SHUTTLE',   // 飞梭：清除一行/列（4连）
  IRON = 'IRON',         // 魔法熨斗：炸3×3（L/T型消除）
  RAINBOW = 'RAINBOW',   // 彩虹布：清除同色全部（5连）
}

/** 单个棋子 */
export interface Cell {
  row: number;
  col: number;
  type: ElementType;
  special: SpecialType;
  /** 乱线团：需要额外消除次数 */
  tangleCount: number;
  /** 未裁剪布料：需要剪刀才能消除 */
  isFrozen: boolean;
}

/** 一个匹配组（可消除） */
export interface MatchGroup {
  cells: { row: number; col: number }[];
  type: ElementType;
  length: number; // 3/4/5
}

/** 棋盘配置 */
export interface GridConfig {
  rows: number;
  cols: number;
  elementTypes: ElementType[];
}

// ---- 换装 (Dress-up) ----

export enum DressPart {
  HAIR = 'HAIR',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  SHOES = 'SHOES',
  ACCESSORY = 'ACCESSORY',
}

export enum StyleTag {
  SWEET = 'SWEET',       // 甜美
  RETRO = 'RETRO',       // 复古
  CYBER = 'CYBER',       // 赛博
  CUTE = 'CUTE',         // 可爱
}

/** 一个服装附件 */
export interface DressAttachment {
  id: string;
  part: DressPart;
  slotName: string;      // Spine 插槽名
  attachmentName: string; // Spine 附件名
  style: StyleTag;
  /** 穿此件衣服时给三消的 Buff */
  matchBuff?: MatchBuff;
}

/** 三消被动 Buff */
export interface MatchBuff {
  type: 'COIN_BONUS' | 'START_BOMB' | 'EXTRA_MOVE';
  value: number; // 百分比或绝对数值
}

// ---- 背包/库存 (Inventory) ----

export interface InventoryItem {
  itemId: string;
  count: number;
}

// ---- 订单 (Order) ----

export interface OrderRequirement {
  itemId: string;
  count: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerAvatar: string;  // 资源路径
  requirements: OrderRequirement[];
  rewardGold: number;
  rewardFlower: number;    // 小红花
  timeLimit?: number;      // 秒，可选限时
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
}

// ---- 存档 (Save) ----

export interface SaveData {
  gold: number;
  flowers: number;
  inventory: InventoryItem[];
  orders: Order[];
  currentDress: Partial<Record<DressPart, string>>; // part -> attachmentId
  dollMood: number;     // 娃心情值 0-100
  dollAffection: number; // 好感度
  matchLevel: number;    // 当前三消关卡
}

// ---- 事件（全局事件总线） ----

/** 事件名常量 */
export const GameEvent = {
  // 三消事件
  MATCH_FOUND: 'match:found',
  MATCH_CLEARED: 'match:cleared',
  CELLS_DROPPED: 'cells:dropped',
  GRID_STABLE: 'grid:stable',

  // 库存事件
  ITEM_ADDED: 'item:added',
  ITEM_REMOVED: 'item:removed',

  // 订单事件
  ORDER_CREATED: 'order:created',
  ORDER_SUBMITTED: 'order:submitted',
  ORDER_COMPLETED: 'order:completed',

  // 换装事件
  DRESS_CHANGED: 'dress:changed',
  STYLE_BONUS_CHANGED: 'style:bonus_changed',
  DOLL_MOOD_CHANGED: 'doll:mood_changed',

  // 经济事件
  GOLD_CHANGED: 'gold:changed',
  FLOWER_CHANGED: 'flower:changed',

  // 存档事件
  GAME_SAVED: 'game:saved',
  GAME_LOADED: 'game:loaded',
} as const;

export type GameEventType = (typeof GameEvent)[keyof typeof GameEvent];
