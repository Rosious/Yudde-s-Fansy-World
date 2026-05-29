# 衣橱物语 — UI 层开发任务

## 任务：完善 Cocos Creator UI 组件层

已有文件：
- D:/Yudde-Demo/cocos-project/assets/types/ 下有一些类型定义
- D:/Yudde-Demo/src/ 下有完整的纯 TS 逻辑层（169 测试通过）

需要做的：

1. 检查 D:/Yudde-Demo/cocos-project/ 下现有文件，尤其是 assets/ 里的脚本

2. 根据 SETUP_GUIDE.md 创建以下文件（如果不存在就创建，存在就完善）：

### 场景文件（JSON格式）
在 D:/Yudde-Demo/cocos-project/assets/scenes/ 下创建：
- MainScene.scene — 主场景，含 Canvas/MainGameFlow/Header/BottomBar
- 场景文件格式参考 Cocos Creator 3.8 的 JSON 结构

### 预制体（在 assets/prefabs/下）
- Cell.prefab — 棋盘格子预制体
- OrderCard.prefab — 订单卡预制体

### Script 完善
- 确保已经存在的 UI Component 脚本能正常工作
- 如果需要，添加场景加载逻辑

3. 用 npm test 验证现有逻辑层是否仍然通过

4. 提交所有修改到 git
