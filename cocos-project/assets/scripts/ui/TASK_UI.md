你是 Cocos Creator 3.x TypeScript 专家。请在当前项目 assets/scripts/ui/ 下创建以下文件。

## 已有模块（可直接 import）

OrderManager (../systems/order/OrderManager):
- new OrderManager(inventory: InventorySystem)
- generateOrders(count): Order[]
- submitOrder(orderId): { success, reason? }
- getActiveOrders(): Order[]
- cancelOrder(orderId): boolean

InventorySystem (../systems/inventory/InventorySystem):
- addItem/removeItem/hasItem/getCount/getAll/clear/toJSON/fromJSON

DressUpManager (../systems/dressup/DressUpManager):
- changeEquipment(part, attachment): { success, replaced? }
- removeEquipment(part): void
- getCurrentDress(): Partial<Record<DressPart, DressAttachment>>
- getActiveBuffs(): MatchBuff[]
- getStyleScore(style): number

类型 (../core/types):
DressPart: HAIR, TOP, BOTTOM, SHOES, ACCESSORY
DressAttachment { id, part, slotName, attachmentName, style, matchBuff?, isFullDress? }
StyleTag: SWEET, RETRO, CYBER, CUTE
Order { orderId, customerName, customerAvatar, requirements, rewardGold, rewardFlower, status }
MatchBuff { type: COIN_BONUS|START_BOMB|EXTRA_MOVE, value }
GameEvent: ORDER_CREATED, ORDER_COMPLETED, DRESS_CHANGED, GOLD_CHANGED, FLOWER_CHANGED

eventBus (../core/EventBus): on/emit/off

## 要创建的文件

### 1. ShopPanel.ts
Cocos Component(@ccclass)，挂在店铺场景。
@property(Prefab) orderCardPrefab
@property(Node) orderListContainer
@property(Label) goldLabel, flowerLabel

onLoad(): 创建 InventorySystem + OrderManager(inventory)。监听 ORDER_COMPLETED 刷新。监听 GOLD_CHANGED/FLOWER_CHANGED 更新标签。调用 generateOrders(4)。

refreshOrders(): 清空 orderListContainer，遍历 getActiveOrders()，每个订单用 orderCardPrefab instantiate，填入顾客名、需求材料、奖励数字。

createOrderCard(order): 子节点放 Label(顾客名)、Label(需求文本如"红线团 x3 纽扣 x2")、Label(奖励"金币+30 花+4")、Button(提交)。

onSubmitOrder(orderId): submitOrder。success → 弹提示"完成！"。fail → 弹提示"材料不足"。

### 2. DressRoomPanel.ts
Cocos Component(@ccclass)，挂在换装场景。
@property(Sprite) dollPreview
@property(Node) tabContainer (5个部位Tab按钮)
@property(Node) itemListContainer
@property(Label) styleScoreLabel, buffLabel

onLoad(): 创建 DressUpManager。预设 catalog 数组(至少每个部位2件衣服的 DressAttachment 数据)。默认显示 HAIR 部位。

switchTab(part): 清空 itemListContainer，遍历 catalog 中该 part 的衣服，每件创建按钮(显示 attachment.id + style)。

onItemClick(attachment): dressUp.changeEquipment(part, attachment)，刷新 dollPreview 和 buff 显示。

refreshDollPreview(): 根据 getCurrentDress() 更新 dollPreview sprite（按部位叠层）。
refreshBuffDisplay(): getActiveBuffs()→显示到 buffLabel。getStyleScore 各风格→styleScoreLabel。

监听 DRESS_CHANGED 事件自动刷新。

### 3. MainGameFlow.ts
@ccclass，常驻节点，DontDestroyOnLoad。
持有 InventorySystem、OrderManager、DressUpManager 单例引用。
提供静态 getInstance()。
onLoad() 中初始化依赖。

要求：中文注释，Cocos Creator 3.x API，import 相对路径，代码完整不写 TODO。
