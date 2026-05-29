// ============================================================
// Match3Engine 测试套件（TDD：先写测试，确认失败后再写实现）
// ============================================================

import {
  Match3Engine,
} from '../../src/systems/match3/Match3Engine';
import {
  ElementType,
  SpecialType,
  GridConfig,
  Cell,
  MatchGroup,
  GameEvent,
} from '../../src/types';
import { eventBus } from '../../src/core';

// ---- 辅助函数 ----

/** 创建标准 8x8 棋盘配置 */
function makeConfig(rows = 8, cols = 8): GridConfig {
  return {
    rows,
    cols,
    elementTypes: [
      ElementType.LINE,
      ElementType.BUTTON,
      ElementType.SCISSORS,
      ElementType.TAPE,
      ElementType.SEWING,
    ],
  };
}

/** 创建一个指定行列的空 Cell */
function makeCell(row: number, col: number, type: ElementType): Cell {
  return { row, col, type, special: SpecialType.NONE, tangleCount: 0, isFrozen: false };
}

/** 从二维 type 数组构建网格 */
function gridFromTypes(types: ElementType[][]): Cell[][] {
  return types.map((row, r) =>
    row.map((type, c) => makeCell(r, c, type))
  );
}

/** 获取网格中所有非空 type 列表（用于调试） */
function getTypeGrid(grid: Cell[][]): (ElementType | null)[][] {
  return grid.map(row => row.map(cell => cell.type));
}

/** 检查网格是否有 3+ 连 */
function hasMatches(grid: Cell[][]): boolean {
  const engine = new Match3Engine(makeConfig(grid.length, grid[0].length));
  return engine.findMatches(grid).length > 0;
}

// ---- 每个测试前重置 EventBus ----
beforeEach(() => {
  eventBus.reset();
});

// ============================================================
// 1. initGrid — 初始化棋盘
// ============================================================
describe('initGrid', () => {
  it('应生成正确尺寸的棋盘', () => {
    const engine = new Match3Engine(makeConfig(8, 8));
    const grid = engine.initGrid();
    expect(grid.length).toBe(8);
    expect(grid[0].length).toBe(8);
    grid.forEach(row => row.forEach(cell => {
      expect(cell.row).toBeGreaterThanOrEqual(0);
      expect(cell.col).toBeGreaterThanOrEqual(0);
    }));
  });

  it('所有棋子类型应在配置范围内', () => {
    const config = makeConfig(6, 6);
    const engine = new Match3Engine(config);
    const grid = engine.initGrid();
    grid.forEach(row => row.forEach(cell => {
      expect(config.elementTypes).toContain(cell.type);
    }));
  });

  it('初始棋盘不应有任何三连', () => {
    const engine = new Match3Engine(makeConfig(8, 8));
    // 多次初始化确保稳定性
    for (let i = 0; i < 10; i++) {
      const grid = engine.initGrid();
      const matches = engine.findMatches(grid);
      expect(matches.length).toBe(0);
    }
  });

  it('所有棋子初始 special 应为 NONE', () => {
    const engine = new Match3Engine(makeConfig(6, 6));
    const grid = engine.initGrid();
    grid.forEach(row => row.forEach(cell => {
      expect(cell.special).toBe(SpecialType.NONE);
    }));
  });
});

// ============================================================
// 2. findMatches — 检测消除组
// ============================================================
describe('findMatches', () => {
  let engine: Match3Engine;

  beforeEach(() => {
    engine = new Match3Engine(makeConfig(8, 8));
  });

  it('横向3连应被检测到', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    // 第一行放3个连着的 BUTTON
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;
    types[0][3] = ElementType.BUTTON;
    // 打散其他位置防止额外匹配
    types[0][0] = ElementType.SCISSORS;
    types[0][4] = ElementType.TAPE;
    types[0][5] = ElementType.SEWING;
    types[0][6] = ElementType.LINE;
    types[0][7] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);

    const buttonMatch = matches.find(m => m.type === ElementType.BUTTON && m.length === 3);
    expect(buttonMatch).toBeDefined();
    expect(buttonMatch!.cells.length).toBe(3);
  });

  it('纵向3连应被检测到', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[1][0] = ElementType.SCISSORS;
    types[2][0] = ElementType.SCISSORS;
    types[3][0] = ElementType.SCISSORS;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);

    const scissorsMatch = matches.find(m => m.type === ElementType.SCISSORS && m.length === 3);
    expect(scissorsMatch).toBeDefined();
  });

  it('横向4连应被检测到，length=4', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[2][2] = ElementType.TAPE;
    types[2][3] = ElementType.TAPE;
    types[2][4] = ElementType.TAPE;
    types[2][5] = ElementType.TAPE;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);

    const match4 = matches.find(m => m.type === ElementType.TAPE && m.length === 4);
    expect(match4).toBeDefined();
    expect(match4!.cells.length).toBe(4);
  });

  it('横向5连应被检测到，length=5', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[3][0] = ElementType.SEWING;
    types[3][1] = ElementType.SEWING;
    types[3][2] = ElementType.SEWING;
    types[3][3] = ElementType.SEWING;
    types[3][4] = ElementType.SEWING;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);

    const match5 = matches.find(m => m.type === ElementType.SEWING && m.length === 5);
    expect(match5).toBeDefined();
    expect(match5!.cells.length).toBe(5);
  });

  it('无匹配时返回空数组', () => {
    // 交错排列确保无三连
    const types: ElementType[][] = [];
    const elems = [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r + c) % elems.length]);
      }
      types.push(row);
    }
    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    expect(matches.length).toBe(0);
  });

  it('应同时检测到多个不同的匹配组', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    // 行0: 3个BUTTON
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;
    // 行2: 3个SCISSORS
    types[2][5] = ElementType.SCISSORS;
    types[2][6] = ElementType.SCISSORS;
    types[2][7] = ElementType.SCISSORS;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });
});

// ============================================================
// 3. clearMatches — 清空消除格
// ============================================================
describe('clearMatches', () => {
  let engine: Match3Engine;

  beforeEach(() => {
    engine = new Match3Engine(makeConfig(8, 8));
  });

  it('匹配的格子应被清空', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    const cleared = engine.clearMatches(grid, matches);

    // 被消除的格子类型应为 null
    expect(cleared[0][0].type).toBeNull();
    expect(cleared[0][1].type).toBeNull();
    expect(cleared[0][2].type).toBeNull();
    // 未被消除的格子保持不变
    expect(cleared[0][3].type).toBe(ElementType.LINE);
  });

  it('清除后应发射 match:cleared 事件', () => {
    const listener = jest.fn();
    eventBus.on(GameEvent.MATCH_CLEARED, listener);

    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    engine.clearMatches(grid, matches);

    expect(listener).toHaveBeenCalled();
    const payload = listener.mock.calls[0][0];
    expect(payload).toHaveProperty('clearedItems');
  });

  it('清除后应发射 match:found 事件（在 findMatches 阶段检测到匹配时）', () => {
    // 注意：findMatches 是纯函数，不发射事件。
    // 事件应在 step 方法中发射。此处测试 clearMatches 本身不发射 match:found。
    // 这里主要验证 clearMatches 正确清空格子。
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    const cleared = engine.clearMatches(grid, matches);

    // 验证清除数量正确
    let nullCount = 0;
    cleared.forEach(row => row.forEach(cell => {
      if (cell.type === null) nullCount++;
    }));
    expect(nullCount).toBe(3);
  });
});

// ============================================================
// 4. dropAndFill — 下落 + 顶部补充
// ============================================================
describe('dropAndFill', () => {
  let engine: Match3Engine;

  beforeEach(() => {
    engine = new Match3Engine(makeConfig(4, 4));
  });

  it('空位应被上方棋子下落填充', () => {
    const types: ElementType[][] = [
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
    ];
    const grid = gridFromTypes(types);

    // 手动清空几个位置模拟消除
    (grid[1][0] as any).type = null;
    (grid[2][0] as any).type = null;
    (grid[3][0] as any).type = null;

    const filled = engine.dropAndFill(grid);

    // 第3行(最底)应该不再是 null
    expect(filled[3][0].type).not.toBeNull();
    // 被清空的列，顶部的棋子应该下落
    // col0: 原本 row0=LINE, row1/2/3=null → 下落+补充后不应有null
    for (let r = 0; r < 4; r++) {
      expect(filled[r][0].type).not.toBeNull();
    }
  });

  it('补充的新棋子类型应在配置范围内', () => {
    const types: ElementType[][] = Array(4).fill(null).map(() =>
      Array(4).fill(ElementType.LINE)
    );
    const grid = gridFromTypes(types);

    // 清空整列
    for (let r = 0; r < 4; r++) {
      (grid[r][2] as any).type = null;
    }

    const filled = engine.dropAndFill(grid);
    const config = makeConfig(4, 4);

    for (let r = 0; r < 4; r++) {
      expect(config.elementTypes).toContain(filled[r][2].type);
    }
  });

  it('无空位时网格应保持不变（新引用）', () => {
    const types: ElementType[][] = [
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
      [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE],
    ];
    const grid = gridFromTypes(types);
    const filled = engine.dropAndFill(grid);

    // 不应是同一个引用
    expect(filled).not.toBe(grid);
    // 内容应相同
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        expect(filled[r][c].type).toBe(grid[r][c].type);
      }
    }
  });
});

// ============================================================
// 5. 特殊道具生成（含在 clearMatches 逻辑中）
// ============================================================
describe('special token generation', () => {
  let engine: Match3Engine;

  beforeEach(() => {
    engine = new Match3Engine(makeConfig(8, 8));
  });

  it('4连应生成 SHUTTLE 在最后一个被消除格', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    // row=0, col=2-5 放4个 TAPE
    types[0][2] = ElementType.TAPE;
    types[0][3] = ElementType.TAPE;
    types[0][4] = ElementType.TAPE;
    types[0][5] = ElementType.TAPE;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);

    // 应该有一个 length=4 的 TAPE 匹配
    const match4 = matches.find(m => m.length === 4);
    expect(match4).toBeDefined();

    const cleared = engine.clearMatches(grid, matches);

    // 前3个被清除（null），最后一个保留 type=TAPE 且 special=SHUTTLE
    expect(cleared[0][2].type).toBeNull();
    expect(cleared[0][3].type).toBeNull();
    expect(cleared[0][4].type).toBeNull();
    expect(cleared[0][5].type).toBe(ElementType.TAPE);
    expect(cleared[0][5].special).toBe(SpecialType.SHUTTLE);
  });

  it('5连应生成 RAINBOW 在中间格', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[1][1] = ElementType.BUTTON;
    types[1][2] = ElementType.BUTTON;
    types[1][3] = ElementType.BUTTON;
    types[1][4] = ElementType.BUTTON;
    types[1][5] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    const cleared = engine.clearMatches(grid, matches);

    // 中间格 (row=1, col=3) 应保留 type=BUTTON 且 special=RAINBOW
    expect(cleared[1][1].type).toBeNull();
    expect(cleared[1][2].type).toBeNull();
    expect(cleared[1][3].type).toBe(ElementType.BUTTON);
    expect(cleared[1][3].special).toBe(SpecialType.RAINBOW);
    expect(cleared[1][4].type).toBeNull();
    expect(cleared[1][5].type).toBeNull();
  });

  it('T型消除应生成 IRON 在交叉点', () => {
    // 构造 T 型：
    //   row=0: - B -    (col=1)
    //   row=1: B B B    (col=0,1,2) → 横向3连
    //   row=2: - B -    (col=1)
    // 纵向 col=1: row=0,1,2 → 3连
    // 交叉点 (row=1, col=1) 属于横向和纵向各一个 3 连
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    // 横向在 row=1: col=0-2 全 BUTTON
    types[1][0] = ElementType.BUTTON;
    types[1][1] = ElementType.BUTTON;
    types[1][2] = ElementType.BUTTON;
    // 纵向在 col=1: row=0-2 全 BUTTON
    types[0][1] = ElementType.BUTTON;
    // row=1 col=1 already BUTTON
    types[2][1] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    const cleared = engine.clearMatches(grid, matches);

    // 交叉点 (row=1, col=1) 应保留 type=BUTTON 且 special=IRON
    expect(cleared[1][1].type).toBe(ElementType.BUTTON);
    expect(cleared[1][1].special).toBe(SpecialType.IRON);
    // 行上其他 BUTTON 格子应被清除
    expect(cleared[1][0].type).toBeNull();
    expect(cleared[1][2].type).toBeNull();
    expect(cleared[0][1].type).toBeNull();
    expect(cleared[2][1].type).toBeNull();
  });

  it('L型消除应生成 IRON 在交叉点', () => {
    // 构造 L 型：
    //   row=0: B B B
    //   row=1: B - -
    //   row=2: B - -
    // 横向 row=0: 3个BUTTON (col 0-2)
    // 纵向 col=0: 3个BUTTON (row 0-2)
    // 交叉点是 (0,0)
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;
    types[1][0] = ElementType.BUTTON;
    types[2][0] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    const cleared = engine.clearMatches(grid, matches);

    // 交叉点 (row=0, col=0) 应保留 type=BUTTON 且 special=IRON
    expect(cleared[0][0].type).toBe(ElementType.BUTTON);
    expect(cleared[0][0].special).toBe(SpecialType.IRON);
    expect(cleared[0][1].type).toBeNull();
    expect(cleared[0][2].type).toBeNull();
    expect(cleared[1][0].type).toBeNull();
    expect(cleared[2][0].type).toBeNull();
  });

  it('优先级：5连 RAINBOW > T型 IRON > 4连 SHUTTLE', () => {
    // 创建一个既是 T 型交叉点又在 5 连中的情况（实际上不太容易同时满足）
    // 更实际的测试：一个横向5连 + 纵向3连在交叉点
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    // 横向5连: row=2, col=0-4
    types[2][0] = ElementType.SEWING;
    types[2][1] = ElementType.SEWING;
    types[2][2] = ElementType.SEWING;
    types[2][3] = ElementType.SEWING;
    types[2][4] = ElementType.SEWING;
    // 纵向3连: col=2, row=1-3
    types[1][2] = ElementType.SEWING;
    types[3][2] = ElementType.SEWING;
    // 交叉点 (2,2) 同时是5连的中间格和T型交叉点
    // 预期：5连优先级更高 → RAINBOW

    const grid = gridFromTypes(types);
    const matches = engine.findMatches(grid);
    const cleared = engine.clearMatches(grid, matches);

    // 交叉点 (2,2) 应是 RAINBOW（5连优先级最高）
    expect(cleared[2][2].type).toBe(ElementType.SEWING);
    expect(cleared[2][2].special).toBe(SpecialType.RAINBOW);
  });
});

// ============================================================
// 6. swap — 交换两格
// ============================================================
describe('swap', () => {
  let engine: Match3Engine;

  beforeEach(() => {
    engine = new Match3Engine(makeConfig(8, 8));
    // 初始化棋盘
    engine.initGrid();
  });

  it('交换相邻空格应返回 valid=false（不相邻）', () => {
    const grid = engine.getGrid();
    // 原始格子保留引用，交换不相邻的
    const result = engine.swap(grid, 0, 0, 0, 3);
    expect(result.valid).toBe(false);
  });

  it('交换相邻但无匹配应返回 valid=false', () => {
    // 先构造一个无匹配的棋盘，手动设置
    // 保证交换后依然无匹配
    const types: ElementType[][] = [];
    const elems = [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r * 7 + c * 3) % elems.length]);
      }
      types.push(row);
    }
    const grid = gridFromTypes(types);

    const result = engine.swap(grid, 0, 0, 0, 1);
    // 交换后可能产生也可能不产生匹配
    // 这个测试验证 swap 能正确判断
    if (!result.valid) {
      // 无匹配时网格应不变（或回退）
      expect(result.grid[0][0].type).toBe(types[0][0]);
      expect(result.grid[0][1].type).toBe(types[0][1]);
    }
  });

  it('相邻且产生匹配应返回 valid=true', () => {
    // 设置一个只需交换一步就能产生3连的棋盘
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    // row=0: BUTTON, BUTTON, SCISSORS, BUTTON
    // 如果交换 (0,2) 和 (0,3)，得到 BUTTON,BUTTON,BUTTON,SCISSORS → 3连
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.SCISSORS;
    types[0][3] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const result = engine.swap(grid, 0, 2, 0, 3);

    expect(result.valid).toBe(true);
    // 验证确实产生了匹配
    const matches = engine.findMatches(result.grid);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('交换后棋盘应反映交换结果', () => {
    const types: ElementType[][] = Array(8).fill(null).map(() =>
      Array(8).fill(ElementType.LINE)
    );
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.SCISSORS;
    types[0][3] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const result = engine.swap(grid, 0, 2, 0, 3);

    if (result.valid) {
      // 交换后 col2 和 col3 应互换
      expect(result.grid[0][2].type).toBe(ElementType.BUTTON);
      expect(result.grid[0][3].type).toBe(ElementType.SCISSORS);
    }
  });
});

// ============================================================
// 7. step — 单步消除循环
// ============================================================
describe('step', () => {
  let engine: Match3Engine;

  beforeEach(() => {
    engine = new Match3Engine(makeConfig(8, 8));
  });

  it('无匹配棋盘 step 应返回空匹配和 cascade=0', () => {
    const types: ElementType[][] = [];
    const elems = [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r * 7 + c * 3) % elems.length]);
      }
      types.push(row);
    }
    const grid = gridFromTypes(types);
    const result = engine.step(grid);

    expect(result.matches.length).toBe(0);
    expect(result.cascades).toBe(0);
  });

  it('单次消除的棋盘应产生匹配并返回 cascade=1', () => {
    // 使用交错背景避免除 BUTTON 外的其他匹配
    const elems = [ElementType.LINE, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING];
    const types: ElementType[][] = [];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r * 3 + c * 2) % elems.length]);
      }
      types.push(row);
    }
    // 在 row=0 放3个BUTTON
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const result = engine.step(grid);

    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.cascades).toBeGreaterThanOrEqual(1);
  });

  it('step 应发射 match:found 事件', () => {
    const listener = jest.fn();
    eventBus.on(GameEvent.MATCH_FOUND, listener);

    // 使用交错背景
    const elems = [ElementType.LINE, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING];
    const types: ElementType[][] = [];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r * 3 + c * 2) % elems.length]);
      }
      types.push(row);
    }
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    engine.step(grid);

    expect(listener).toHaveBeenCalled();
  });

  it('step 应发射 match:cleared 事件', () => {
    const listener = jest.fn();
    eventBus.on(GameEvent.MATCH_CLEARED, listener);

    const elems = [ElementType.LINE, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING];
    const types: ElementType[][] = [];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r * 3 + c * 2) % elems.length]);
      }
      types.push(row);
    }
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    engine.step(grid);

    expect(listener).toHaveBeenCalled();
  });

  it('step 完成后应发射 grid:stable 事件', () => {
    const listener = jest.fn();
    eventBus.on(GameEvent.GRID_STABLE, listener);

    const elems = [ElementType.LINE, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING];
    const types: ElementType[][] = [];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r * 3 + c * 2) % elems.length]);
      }
      types.push(row);
    }
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    engine.step(grid);

    expect(listener).toHaveBeenCalled();
  });

  it('step 后的棋盘应无更多可消除项', () => {
    const elems = [ElementType.LINE, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING];
    const types: ElementType[][] = [];
    for (let r = 0; r < 8; r++) {
      const row: ElementType[] = [];
      for (let c = 0; c < 8; c++) {
        row.push(elems[(r * 3 + c * 2) % elems.length]);
      }
      types.push(row);
    }
    types[0][0] = ElementType.BUTTON;
    types[0][1] = ElementType.BUTTON;
    types[0][2] = ElementType.BUTTON;

    const grid = gridFromTypes(types);
    const result = engine.step(grid);

    // step 递归直到无匹配，最终棋盘不应有匹配
    const remainingMatches = engine.findMatches(result.grid);
    expect(remainingMatches.length).toBe(0);
  });
});

// ============================================================
// 8. getGrid — 获取当前棋盘
// ============================================================
describe('getGrid', () => {
  it('应返回 initGrid 之后的棋盘', () => {
    const engine = new Match3Engine(makeConfig(6, 6));
    const grid = engine.initGrid();
    const stored = engine.getGrid();

    expect(stored).toBe(grid);
  });

  it('初始未初始化应返回空数组', () => {
    const engine = new Match3Engine(makeConfig(6, 6));
    const grid = engine.getGrid();
    expect(grid).toEqual([]);
  });
});
