# 衣橱物语（Wardrobe Story）— 实现计划

> **For Hermes:** 使用 subagent-driven-development skill 逐任务实现。
> **目标:** 构建可独立运行的三消+经营+换装游戏 Demo 核心逻辑层
> **架构:** 纯 TypeScript 模块，EventBus 解耦，零 UI 依赖，可直接嵌入 Cocos Creator 3.x
> **技术栈:** TypeScript 5.x, Jest 测试，EventBus 事件驱动

---

## 架构铁律

1. **MVC 分离**: 所有核心逻辑（Model）不 import 任何渲染/UI 代码
2. **EventBus 通信**: 模块间通过 `eventBus.emit/on` 通信，禁止直接引用其他模块
3. **通用系统**: Inventory/Save/EventBus 是纯工具，不知道任何业务
4. **TDD**: 先写测试，确认失败，再写实现，确认通过

## 模块依赖图

```
  types (零依赖)
    ↑
  EventBus (依赖 types)
    ↑
  ┌─────────┬──────────┬──────────┬──────────┐
  │ Match3  │Inventory │  Order   │ DressUp  │  ← 业务模块
  │ Engine  │ System   │ Manager  │ Manager  │     全部只依赖 EventBus + types
  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘
       └──────────┴──────────┴──────────┘
                      ↑
                   SaveManager (监听 EventBus，持久化)
```

---

## Task 1: Match3Engine — 三消核心引擎

**职责**: 棋盘初始化、消除检测、掉落补充、特殊道具判定。纯逻辑，零 UI。

**文件**:
- `src/systems/match3/Match3Engine.ts`
- `src/systems/match3/index.ts`
- `__tests__/match3/Match3Engine.test.ts`

**核心 API**:
- `initGrid(config: GridConfig): Cell[][]` — 无三连的随机棋盘
- `findMatches(grid: Cell[][]): MatchGroup[]` — 检测所有可消除组
- `clearMatches(grid: Cell[][], matches: MatchGroup[]): Cell[][]` — 清空消除格
- `dropAndFill(grid: Cell[][], config: GridConfig): Cell[][]` — 下落+补充
- `step(grid: Cell[][], config: GridConfig): { grid: Cell[][], matches: MatchGroup[] }` — 单步消除循环
- `swap(grid: Cell[][], r1: number, c1: number, r2: number, c2: number): { valid: boolean, grid: Cell[][] }` — 交换两格

**事件发射**:
- `match:found` — 检测到消除组时
- `match:cleared` — 消除完成，携带消除物品列表
- `grid:stable` — 棋盘稳定，无更多可消除项

**特殊道具逻辑**:
- 4连 → SHUTTLE（飞梭，清一行/列）
- 5连 → RAINBOW（彩虹布，清同色全部）
- T/L型消除 → IRON（魔法熨斗，炸3×3）

---

## Task 2: InventorySystem — 通用背包/库存系统

**职责**: 增删查改物品数量，纯通用系统，不关心物品是什么。

**文件**:
- `src/systems/inventory/InventorySystem.ts`
- `src/systems/inventory/index.ts`
- `__tests__/inventory/InventorySystem.test.ts`

**核心 API**:
- `addItem(itemId: string, count: number): void` — 添加物品
- `removeItem(itemId: string, count: number): boolean` — 移除物品，不足返回 false
- `hasItem(itemId: string, count: number): boolean` — 检查是否足够
- `getCount(itemId: string): number` — 获取数量
- `getAll(): InventoryItem[]` — 获取全部
- `toJSON(): InventoryItem[]` / `fromJSON(items: InventoryItem[]): void` — 序列化

**事件发射**:
- `item:added` — 物品增加
- `item:removed` — 物品减少

**注意**: 本系统不关心 itemId 是线团还是裙子，只做加减。物品映射关系由 OrderManager 维护。

---

## Task 3: OrderManager — 订单/经营系统

**职责**: 管理顾客订单的生成、提交、校验，关联库存消耗。

**文件**:
- `src/systems/order/OrderManager.ts`
- `src/systems/order/index.ts`
- `__tests__/order/OrderManager.test.ts`

**核心 API**:
- `generateOrders(count: number): Order[]` — 随机生成 N 个订单
- `submitOrder(orderId: string): { success: boolean, reason?: string }` — 提交订单（校验库存→扣除→发奖励）
- `getActiveOrders(): Order[]` — 获取当前活跃订单
- `toJSON(): Order[]` / `fromJSON(orders: Order[]): void` — 序列化

**事件发射**:
- `order:created` — 新订单生成
- `order:submitted` — 订单提交（触发手作小游戏入口）
- `order:completed` — 订单完成（发放奖励）
- `gold:changed` / `flower:changed` — 货币变动

**内部行为**: 提交时通过 InventorySystem 校验库存，不足则拒绝。

---

## Task 4: DressUpManager — 换装管理器

**职责**: 管理萌娃换装状态、风格属性计算、三消 Buff 产出。兼容 Spine 挂点 API。

**文件**:
- `src/systems/dressup/DressUpManager.ts`
- `src/systems/dressup/index.ts`
- `__tests__/dressup/DressUpManager.test.ts`

**核心 API**:
- `changeEquipment(part: DressPart, attachment: DressAttachment): { success: boolean, replaced?: DressAttachment }` — 换装
- `removeEquipment(part: DressPart): void` — 卸下
- `getCurrentDress(): Partial<Record<DressPart, DressAttachment>>` — 当前穿戴
- `getActiveBuffs(): MatchBuff[]` — 获取当前生效的三消 Buff
- `getStyleScore(style: StyleTag): number` — 某风格的得分
- `toJSON() / fromJSON()` — 序列化

**特殊规则**:
- 换 TOP 如果是连衣裙类型，自动卸载 BOTTOM
- 风格 Buff 叠加规则：取该风格最高分的 3 件

**事件发射**:
- `dress:changed` — 换装完成
- `style:bonus_changed` — Buff 变化

---

## Task 5: SaveManager — 存档系统

**职责**: 监听 EventBus，将所有系统状态持久化到 JSON 文件。启动时加载恢复。

**文件**:
- `src/systems/save/SaveManager.ts`
- `src/systems/save/index.ts`
- `__tests__/save/SaveManager.test.ts`

**核心 API**:
- `save(slot?: number): void` — 保存到文件
- `load(slot?: number): SaveData | null` — 从文件加载
- `autoSave(intervalMs: number): void` — 启动定时自动保存
- `stopAutoSave(): void` — 停止自动保存

**事件发射**:
- `game:saved` — 保存完成
- `game:loaded` — 加载完成

**实现**: 监听 `gold:changed`、`flower:changed`、`item:added/removed`、`order:*`、`dress:changed` 等事件，收集最新状态，定期写入文件。不主动拉取数据，靠事件驱动。

---

## Task 6: 集成测试

**职责**: 编写端到端场景测试，验证模块联动正确。

**文件**:
- `__tests__/integration/full-game-loop.test.ts`

**测试场景**:
1. 完整游戏循环：三消消除 → 材料入库 → 凑齐订单 → 提交 → 金币增加 → 换装 → Buff 生效
2. 极端情况：库存不足时提交订单被拒绝
3. 事件总线通信验证

---

## 实现顺序

1. Task 1: Match3Engine（基础引擎）
2. Task 2: InventorySystem（通用库存）
3. Task 3: OrderManager（依赖 InventorySystem 的接口）
4. Task 4: DressUpManager（换装+Buff）
5. Task 5: SaveManager（监听所有事件）
6. Task 6: 集成测试
