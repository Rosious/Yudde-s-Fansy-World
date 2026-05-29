# 衣橱物语 — 美术规格表

## 一、资源目录结构（Cocos Creator assets/）

```
assets/
├── textures/
│   ├── match3/
│   │   ├── line_red.png       # 红线团 128×128
│   │   ├── line_blue.png      # 蓝线团 128×128
│   │   ├── line_yellow.png    # 黄线团 128×128
│   │   ├── button.png         # 纽扣 128×128
│   │   ├── scissors.png       # 剪刀 128×128
│   │   ├── tape.png           # 皮尺 128×128
│   │   ├── sewing.png         # 缝纫机 128×128
│   │   ├── shuttle.png        # 飞梭道具 128×128
│   │   ├── iron.png           # 魔法熨斗 128×128
│   │   └── rainbow.png        # 彩虹布 128×128
│   ├── ui/
│   │   ├── panel_bg.png       # 面板背景
│   │   ├── btn_submit.png     # 提交按钮
│   │   ├── icon_gold.png      # 金币图标
│   │   └── icon_flower.png    # 小红花图标
│   └── effects/
│       ├── sparkle.png        # 消除粒子
│       └── ribbon.png         # 盲盒丝带
├── spine/
│   ├── doll/
│   │   ├── doll.skel          # 萌娃骨骼
│   │   ├── doll.atlas         # 图集
│   │   └── doll.png           # 贴图
│   └── customers/
│       ├── cat_customer.skel  # 猫咪顾客
│       └── bunny_customer.skel # 兔子顾客
├── prefabs/
│   ├── Cell.prefab            # 棋子预制体
│   ├── Doll.prefab            # 萌娃预制体
│   ├── OrderCard.prefab       # 订单卡片预制体
│   └── UnboxPanel.prefab      # 盲盒面板预制体
└── scenes/
    ├── MainMenu.scene
    ├── MatchGame.scene
    ├── Shop.scene
    └── DressRoom.scene
```

## 二、Spine 插槽命名规范（换装系统）

萌娃骨骼必须包含以下插槽（Slot），名称严格区分大小写：

| 插槽名 (slotName) | 对应 DressPart | 可替换附件示例 |
|-------------------|----------------|---------------|
| `hair_front` | HAIR | `hair_ponytail`, `hair_bob`, `hair_twintail` |
| `body_top` | TOP | `top_tshirt`, `top_sweater`, `top_dress_summer` |
| `body_bottom` | BOTTOM | `bottom_skirt`, `bottom_shorts`, `bottom_pants` |
| `feet` | SHOES | `shoes_sneaker`, `shoes_boot`, `shoes_sandal` |
| `head_acc` | ACCESSORY | `acc_ribbon`, `acc_hat`, `acc_glasses` |
| `hand_acc` | ACCESSORY | `acc_bag`, `acc_umbrella` |

**注意**: ACCESSORY 可映射到多个插槽。

## 三、DressAttachment 数据表示例

```typescript
// 实际项目中从 JSON 配置表加载
const CLOTHING_CATALOG: DressAttachment[] = [
  {
    id: 'hair_001',
    part: DressPart.HAIR,
    slotName: 'hair_front',
    attachmentName: 'hair_ponytail',
    style: StyleTag.SWEET,
    // 无 Buff
  },
  {
    id: 'top_001',
    part: DressPart.TOP,
    slotName: 'body_top',
    attachmentName: 'top_tshirt',
    style: StyleTag.CUTE,
    matchBuff: { type: 'COIN_BONUS', value: 10 },
  },
  {
    id: 'top_dress_001',
    part: DressPart.TOP,
    slotName: 'body_top',
    attachmentName: 'top_dress_summer',
    style: StyleTag.SWEET,
    isFullDress: true,  // 连衣裙！自动卸 BOTTOM
  },
  // ... 更多
];
```

## 四、UI 设计规范

### 色彩板
| 用途 | 色值 |
|------|------|
| 主色调（甜美粉） | #FFB6C1 |
| 辅助色（奶油黄） | #FFF8DC |
| 强调色（薄荷绿） | #98FB98 |
| 文字色 | #4A4A4A |
| 金币色 | #FFD700 |
| 小红花色 | #FF6B6B |

### 三消棋子设计规格
- 尺寸：128×128 px
- 风格：Q版扁平化，柔和阴影，圆角
- 线团：三色变体（红/蓝/黄），毛线纹理
- 特殊道具：加发光边框区分

### 萌娃设计规格
- 风格：Q版粘土风（类似《皮卡堂》）
- 比例：2-3 头身
- 骨骼：Spine 2D，支持表情切换和服装换皮
- 默认动画：idle（呼吸）、happy（开心）、sleepy（困）、surprised（惊讶）

## 五、动效清单

| 动效 | 触发条件 | 实现方式 |
|------|----------|----------|
| 棋子消除 | 三连消除 | Spine 粒子爆发 + 缩放消失 |
| 飞梭扫射 | 使用 SHUTTLE | 一行/列发光扫过 |
| 魔法熨斗爆炸 | 使用 IRON | 3×3 区域震动 + 烟雾 |
| 彩虹布全屏 | 使用 RAINBOW | 全屏彩虹闪过 |
| 剪裁小游戏 | 提交订单 | 手指划虚线动画 |
| 拆盲盒 | 兑换稀有服装 | 丝带飘落 + 金光 + 弹出 |
| 娃换装 | 更换服装 | Spine 附件切换（即时） |

## 六、音效清单（待补充）

| 音效 | 场景 |
|------|------|
| 棋子落下 | tink 清脆声 |
| 三连消除 | 叮叮叮 |
| 订单完成 | 收银机 cha-ching |
| 娃笑声 | 软萌 "嘻嘻" |
| 盲盒打开 | 魔法音效 |
