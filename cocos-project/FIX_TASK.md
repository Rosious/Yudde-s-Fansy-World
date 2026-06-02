# Cocos Creator 项目修复任务

## 项目位置
D:/Yudde-Demo/cocos-project/

## 项目结构
```
assets/
├── scenes/MainScene.scene    ← 主场景（有 Canvas/MatchGrid/Header/BottomBar/GameFlow）
├── prefabs/Cell.prefab       ← 棋子预制体（有 UITransform/Sprite/CellComponent）
├── scripts/
│   ├── core/EventBus.ts
│   ├── core/types.ts
│   ├── systems/match3/Match3Engine.ts
│   ├── systems/inventory/InventorySystem.ts
│   ├── systems/order/OrderManager.ts
│   ├── systems/dressup/DressUpManager.ts
│   ├── systems/save/SaveManager.ts
│   └── ui/
│       ├── MainGameFlow.ts         ← 游戏协调器
│       ├── Match3GridComponent.ts  ← 棋盘组件
│       ├── CellComponent.ts        ← 棋子组件
│       ├── ShopPanel.ts            ← 店铺面板
│       └── DressRoomPanel.ts       ← 换装面板
└── textures/line~rainbow/          ← 8个占位图 128x128 spriteFrame.png
```

## 当前问题
构建后在浏览器只显示一个 Label（空白页面），组件全部没跑起来。

## 需要你做的
1. **阅读所有关键文件**理解项目：所有 ui/*.ts、core/*.ts、systems/*/*.ts、MainScene.scene、Cell.prefab 及它们的 .meta
2. **逐个检查并修复**：
   - 每个 .ts 脚本的 .meta 中 importer 应为 "typescript"
   - scene 中 `__type__` 引用脚本时必须用**压缩UUID**（如 "1b1618eAzJIgY8RJgOX0SJf" 不是标准uuid）
   - prefab 中 `__type__` 引用脚本时同理
   - `__uuid__` 字段引用 asset 时用**标准UUID**（带连字符）
3. **Cocos UUID 压缩算法**（重要！）：
   取 UUID 去掉连字符→前5字符保留→之后每3个 hex 字符转2个 base64 字符
   Cocos base64 字母表: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
4. **Cocos Creator 3.x scene JSON 规则**：
   - 根数组，每个对象有 __type__ 和 __id__ 引用
   - 脚本组件用压缩 UUID 作为 __type__
   - 内置组件用 cc.XXX 作为 __type__
   - _id 字段是节点/组件实例 ID（标准 UUID，可任意生成）
   - __uuid__ 是 asset 引用（标准 UUID，从 .meta 读取）
5. **修复后验证**：用 Python json.load 验证每个 .scene/.prefab 是合法 JSON

## 额外要求
- 重写 MainScene.scene，确保是一个干净完整可运行的 Cocos 3.x 场景
- 重写 Cell.prefab，确保包含 UITransform(100,100) + Sprite + CellComponent
- 确保所有 .meta 的 importer 和 uuid 正确
- 脚本 .meta 用 importer: "typescript"
- 场景 .meta 用 importer: "scene"  
- 预制体 .meta 用 importer: "prefab"
- 图片 .meta 用 importer: "image"
