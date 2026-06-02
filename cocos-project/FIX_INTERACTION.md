# 衣橱物语 — 交互修复任务

## 现状
构建后能看到 "Wardrobe Match" / "match" / "shop" / "dress" 等 Label，但点击任何按钮或棋子都没有反应。

## 根本原因
1. BtnMatch / BtnShop / BtnDress 三个按钮没有绑定 click 事件处理函数
2. Cell 棋子节点实例化后可能没正确响应触摸
3. MainGameFlow 没有连接按钮到任何逻辑
4. import 路径可能有误

## 需要修复的文件

### 1. MainGameFlow.ts (assets/scripts/ui/MainGameFlow.ts)
在 onLoad 中，初始化完系统后，找到 Canvas 下的 BottomBar 的三个按钮，用代码绑定 click：
```typescript
// 在 onLoad 末尾添加按钮绑定
this.scheduleOnce(() => {
    this.bindBottomButtons();
}, 0.1);

private bindBottomButtons(): void {
    const canvas = this.node.parent?.getChildByName('Canvas');
    if (!canvas) { console.warn('Canvas not found'); return; }
    const bottomBar = canvas.getChildByName('BottomBar');
    if (!bottomBar) { console.warn('BottomBar not found'); return; }
    
    const btnMatch = bottomBar.getChildByName('BtnMatch');
    const btnShop = bottomBar.getChildByName('BtnShop');
    const btnDress = bottomBar.getChildByName('BtnDress');
    
    // 用 Cocos Button 组件的 clickEvents
    const matchBtn = btnMatch?.getComponent(Button);
    if (matchBtn) {
        matchBtn.clickEvents = [{
            target: this.node,
            component: 'MainGameFlow',
            handler: 'onMatchClicked',
            customEventData: ''
        }];
    }
    
    const shopBtn = btnShop?.getComponent(Button);
    if (shopBtn) {
        shopBtn.clickEvents = [{
            target: this.node,
            component: 'MainGameFlow',
            handler: 'onShopClicked',
            customEventData: ''
        }];
    }
    
    const dressBtn = btnDress?.getComponent(Button);
    if (dressBtn) {
        dressBtn.clickEvents = [{
            target: this.node,
            component: 'MainGameFlow',
            handler: 'onDressClicked',
            customEventData: ''
        }];
    }
}

onMatchClicked(): void { console.log('切换到三消'); }
onShopClicked(): void { console.log('切换到店铺'); }
onDressClicked(): void { console.log('切换到换装'); }
```

import Button from 'cc' 加入 `import { ..., Button } from 'cc';`

### 2. Match3GridComponent.ts
检查 onLoad 中 initGrid/renderGrid 是否正确创建了可点击的 cell 节点。
确保每个 cell 节点有 UITransform 组件，并且大小正确。
instatiate 出来的 node 需要 addChild 到 this.node。
如果 cell 太小点不到，加大 cell 的 UITransform contentSize 到 cellSize×cellSize。

### 3. CellComponent.ts
当前用 Node.EventType.TOUCH_END 注册触摸。确保 cellPrefab 上有 UITransform 且 size > 0。
如果触摸收不到，改方案：不用 EventTouch，而是在每个 cell 上挂一个透明的 Button 组件，然后监听 Button 的 click 事件。

### 4. ShopPanel.ts
确保订单卡片的提交按钮绑定了 click 事件。检查 onLoad 中是否正确创建了订单卡片和绑定了按钮。
按钮点击 → onSubmitOrder。

### 5. DressRoomPanel.ts  
确保部位 Tab 按钮和服装选择按钮绑定了 click 事件。

## 验证步骤
修完后运行 `npx tsc --noEmit` 确认无编译错误。读取修改后的文件自检逻辑完整性。
