# 衣橱物语 — Cocos Creator 场景搭建指南

用 Cocos Creator 3.x 打开 `D:/Yudde-Demo/cocos-project/`，按以下步骤操作。

## 一、创建场景结构

### 1. 常驻主场景 (MainScene.scene)
右键 assets/scenes → 新建 Scene，保存为 `MainScene`。

创建节点层级：
```
Canvas
├── MainGameFlow          ← 空节点，挂 MainGameFlow 组件
├── Header
│   ├── GoldIcon (Sprite)
│   └── GoldLabel (Label)
├── BottomBar
│   ├── BtnMatch (Button)    ← "三消"
│   ├── BtnShop (Button)     ← "店铺"
│   └── BtnDress (Button)    ← "换装"
└── ContentContainer (空节点，用于场景内容)
```

### 2. 三消场景 (MatchScene.scene)
```
Canvas
└── MatchGrid              ← 空节点
    挂载 Match3GridComponent
    属性绑定：
      cellPrefab → 拖入 Cell 预制体
      cellSize → 80
      rows → 8
      cols → 8
```

### 3. 店铺场景 (ShopScene.scene)
```
Canvas
└── ShopPanel              ← 空节点
    挂载 ShopPanel
    属性绑定：
      orderCardPrefab → 拖入 OrderCard 预制体
      orderListContainer → 拖入列表容器节点
      goldLabel → 拖入金币 Label
      flowerLabel → 拖入小红花 Label
```

### 4. 换装场景 (DressRoom.scene)
```
Canvas
└── DressRoomPanel         ← 空节点
    挂载 DressRoomPanel
    属性绑定：
      dollPreview → 拖入娃预览 Sprite
      tabContainer → 拖入5个部位Tab按钮的父节点
      itemListContainer → 拖入服装列表容器
      itemPrefab → 拖入服装项预制体
      styleScoreLabel → 拖入风格分 Label
      buffLabel → 拖入 Buff Label
```

---

## 二、创建预制体 (Prefabs)

### Cell 预制体
1. 层级面板右键 → 创建 2D 对象 → Sprite (128×128)
2. 命名为 `Cell`
3. 挂载 `CellComponent`
4. 属性绑定：sprite → 自身的 Sprite 组件
5. 拖入 assets/prefabs/ 保存

### OrderCard 预制体
1. 创建 Panel 节点（约 300×120）
2. 子节点：
   - Label (顾客名)
   - Label (需求材料)
   - Label (奖励)
   - Button (提交按钮)
3. 拖入 assets/prefabs/

---

## 三、场景切换逻辑

MainGameFlow 组件通过 `director.loadScene()` 切换场景：
- BtnMatch → `director.loadScene('MatchScene')`
- BtnShop → `director.loadScene('ShopScene')`
- BtnDress → `director.loadScene('DressRoom')`

在 MainGameFlow 的 onLoad 里给三个按钮绑定点击事件。

---

## 四、占位美术资源

纹理路径约定（Match3GridComponent 动态加载）：
```
assets/textures/
├── line/spriteFrame.png
├── button/spriteFrame.png
├── scissors/spriteFrame.png
├── tape/spriteFrame.png
├── sewing/spriteFrame.png
├── shuttle/spriteFrame.png
├── iron/spriteFrame.png
└── rainbow/spriteFrame.png
```

先用任意 128×128 的彩色方块占位，后续替换为正式美术资源。

---

## 五、运行测试

1. 设置 MainScene 为启动场景
2. 点击编辑器顶部 ▶ 运行
3. 预期：棋盘初始化 → 点击格子交换 → 消除动画
4. 切到店铺 → 订单列表 → 提交 → 金币变化
5. 切到换装 → 选衣服 → 预览更新
