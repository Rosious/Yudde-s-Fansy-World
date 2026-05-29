# 🧵 衣橱物语：萌娃裁缝铺 (Wardrobe Story)

> 三消(Match-3) × 模拟经营 × 换装养成 — Cocos Creator 3.8 TypeScript

## 🎮 游戏简介

经营一家温馨的裁缝铺！通过三消收集布料、纽扣、剪刀等材料，完成可爱顾客的订单，用金币为萌娃换装打扮。穿特定套装还能获得三消 Buff，形成巧妙的经营循环。

## 🏗 技术架构

```
src/                          ← 纯 TS 逻辑层 (169 测试，零依赖)
├── core/EventBus.ts          ← 事件总线（模块解耦基石）
├── types/index.ts            ← 全局类型 + GameEvent
└── systems/
    ├── match3/Match3Engine   ← 三消核心引擎 (33 tests)
    ├── inventory/InventorySystem ← 通用背包 (27 tests)
    ├── order/OrderManager    ← 订单经营 (43 tests)
    ├── dressup/DressUpManager ← 换装管理 (27 tests)
    └── save/SaveManager      ← 存档系统 (27 tests)

cocos-project/               ← Cocos Creator 3.8 UI 层
├── assets/scenes/           ← 4 个场景
├── assets/scripts/ui/       ← UI Component 脚本
├── assets/textures/         ← 占位美术资源(13张)
└── assets/prefabs/          ← Cell/OrderCard 预制体
```

## 🚀 快速开始

1. **安装 [Cocos Creator 3.8](https://www.cocos.com/creator)**
2. **用 Cocos Creator 打开 `cocos-project/`**
3. **设置 MainScene 为启动场景**
4. **点击 ▶ 运行**

## 🧪 测试

```bash
npm install
npm test           # 169 个测试全部通过 ✅
```

## 📐 架构铁律

- **EventBus 事件驱动**：所有模块通过事件通信，零耦合
- **纯 TS 逻辑层**：`src/` 不依赖 Cocos Creator API
- **UI 适配层**：`cocos-project/assets/scripts/ui/` 桥接引擎与逻辑

## ⚠️ 需要手动完成的步骤

由于没有 GUI 版本的 Cocos Creator：

1. **打开项目**：Cocos Creator → 打开 `cocos-project/`
2. **绑定组件属性**：参考 `SETUP_GUIDE.md`
3. **创建预制体**：Cell 预制体 + OrderCard 预制体
4. **创建场景节点**：MainScene / MatchScene / ShopScene / DressRoom
5. **导入正式美术资源**：替换 `assets/textures/` 下的占位图

## 📄 策划文档

- `docs/design/game-design.md` — 完整游戏策划文档
- `docs/design/art-spec.md` — 美术规格表

## 🔧 开发

```bash
# 运行逻辑层测试
npm test

# 生成占位美术
python gen_sprites.py
```
