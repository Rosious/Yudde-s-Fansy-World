你是 Cocos Creator 3.x TypeScript 专家。请在当前项目 assets/scripts/ui/ 下创建以下文件。

## 已有模块（可直接 import）

Match3Engine (../systems/match3/Match3Engine):
- new Match3Engine(config: GridConfig)
- initGrid(): Cell[][]
- swap(grid, r1, c1, r2, c2): { valid, grid }
- step(grid): { grid, matches, cascades }
- findMatches(grid): MatchGroup[]
- getGrid(): Cell[][]

类型 (../core/types):
Cell { row, col, type: ElementType, special: SpecialType }
ElementType: LINE, BUTTON, SCISSORS, TAPE, SEWING
SpecialType: NONE, SHUTTLE, IRON, RAINBOW
GridConfig { rows, cols, elementTypes }
GameEvent: MATCH_FOUND, MATCH_CLEARED, GRID_STABLE

eventBus (../core/EventBus): on/emit/off

## 要创建的文件

### 1. Match3GridComponent.ts
Cocos Component(@ccclass)，挂载棋盘根节点上。
@property cellPrefab: Prefab (棋子预制体)
@property cellSize: number = 80
@property rows: number = 8
@property cols: number = 8

onLoad(): 创建 Match3Engine(config)，调用 initGrid()，然后 renderGrid(grid)
renderGrid(grid): 遍历 grid，对每个 cell 用 cellPrefab instantiate，位置(col*cellSize, -row*cellSize)，存到 cellNodes[][]。给每个节点加 Button 或 EventTrigger 绑定点击事件。
updateCellSprite(node, cell): 根据 cell.type 换 sprite（用枚举名拼路径如 'textures/'+type+'/spriteFrame'），如果 special 不是 NONE 加高亮边框。
onCellClicked(row, col): 第一次点击→高亮选中（Tween 呼吸动画），第二次点击→尝试 swap(selected, clicked)。swap valid → 调用 processMatches。swap invalid → 取消选中。
processMatches(grid): 循环调用 engine.step(grid)，每次消除后 renderGrid，直到 stable。每次迭代间 setTimeout 300ms。

### 2. CellComponent.ts
挂在 cellPrefab 上。@property(Sprite) sprite, 属性 row/col。setup(row,col,type) 设置数据。点击事件用 EventTouch 或 Button，回调通知父节点(通过 node.parent.getComponent)。

### 3. InputHandler.ts (可选)
如果点击逻辑简单可以直接写在 Match3GridComponent 里无需单独文件。

要求：中文注释，Cocos Creator 3.x API (cc 模块)，import 用相对路径从 ui/ 出发，代码完整不写 TODO。
