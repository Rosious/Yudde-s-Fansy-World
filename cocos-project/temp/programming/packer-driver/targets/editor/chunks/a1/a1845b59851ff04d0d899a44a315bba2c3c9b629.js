System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, SpecialType, GameEvent, eventBus, Match3Engine, _crd;

  function _reportPossibleCrUseOfCell(extras) {
    _reporterNs.report("Cell", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMatchGroup(extras) {
    _reporterNs.report("MatchGroup", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfElementType(extras) {
    _reporterNs.report("ElementType", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialType(extras) {
    _reporterNs.report("SpecialType", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGridConfig(extras) {
    _reporterNs.report("GridConfig", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventBus(extras) {
    _reporterNs.report("eventBus", "../../core", _context.meta, extras);
  }

  _export("Match3Engine", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      SpecialType = _unresolved_2.SpecialType;
      GameEvent = _unresolved_2.GameEvent;
    }, function (_unresolved_3) {
      eventBus = _unresolved_3.eventBus;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "67ea23QOxhKrZras8sk/SwA", "Match3Engine", undefined); // ============================================================
      // Match3Engine — 三消核心引擎
      // 纯逻辑层，不依赖任何 UI / Cocos / Node 相关代码
      // 通过 eventBus 与外部模块通信
      // ============================================================


      /** 位置坐标（内部用） */
      // ============================================================
      // Match3Engine
      // ============================================================
      _export("Match3Engine", Match3Engine = class Match3Engine {
        /**
         * @param config 棋盘配置（行数、列数、可用棋子类型）
         */
        constructor(config) {
          this.config = void 0;
          this.grid = [];
          this.config = config;
        } // ========== Public API ==========

        /**
         * 初始化棋盘：随机填充所有格子，并保证初始状态无任何三连
         * @returns 完整的 Cell 二维数组
         */


        initGrid() {
          const {
            rows,
            cols,
            elementTypes
          } = this.config;
          const grid = [];

          for (let r = 0; r < rows; r++) {
            const row = [];

            for (let c = 0; c < cols; c++) {
              // 获取不会在当前位置产生 3 连的候选类型
              const candidates = this.getSafeTypes(grid, row, r, c, elementTypes);
              const type = candidates[Math.floor(Math.random() * candidates.length)];
              row.push({
                row: r,
                col: c,
                type,
                special: (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
                  error: Error()
                }), SpecialType) : SpecialType).NONE,
                tangleCount: 0,
                isFrozen: false
              });
            }

            grid.push(row);
          }

          this.grid = grid;
          return grid;
        }
        /**
         * 检测棋盘上所有横向/纵向 3+ 连的消除组
         *
         * 算法：扫描每一行和每一列，收集连续相同类型的序列。
         * 还会检测 T 型/L 型交叉（同时属于横向和纵向 3+ 连的交叉点）。
         *
         * @param grid 当前棋盘
         * @returns 所有匹配组数组
         */


        findMatches(grid) {
          var _grid$0$length, _grid$;

          const rows = grid.length;
          const cols = (_grid$0$length = (_grid$ = grid[0]) == null ? void 0 : _grid$.length) != null ? _grid$0$length : 0;
          const matches = []; // 辅助：记录每个 cell 参与的匹配组引用
          // key = "r,c", value = 该 cell 所属的匹配组列表

          const cellMatches = new Map();

          const addCellMatch = (r, c, match) => {
            var _cellMatches$get;

            const key = `${r},${c}`;
            const list = (_cellMatches$get = cellMatches.get(key)) != null ? _cellMatches$get : [];
            list.push(match);
            cellMatches.set(key, list);
          }; // ---- 横向扫描 ----


          for (let r = 0; r < rows; r++) {
            let startCol = 0;

            while (startCol < cols) {
              var _grid$r$startCol;

              const type = (_grid$r$startCol = grid[r][startCol]) == null ? void 0 : _grid$r$startCol.type;

              if (type === null) {
                startCol++;
                continue;
              }

              let endCol = startCol;

              while (endCol + 1 < cols && ((_grid$r = grid[r][endCol + 1]) == null ? void 0 : _grid$r.type) === type) {
                var _grid$r;

                endCol++;
              }

              const length = endCol - startCol + 1;

              if (length >= 3) {
                const cells = [];

                for (let c = startCol; c <= endCol; c++) {
                  cells.push({
                    row: r,
                    col: c
                  });
                }

                const match = {
                  cells,
                  type: type,
                  length
                };
                matches.push(match);

                for (let c = startCol; c <= endCol; c++) {
                  addCellMatch(r, c, match);
                }
              }

              startCol = endCol + 1;
            }
          } // ---- 纵向扫描 ----


          for (let c = 0; c < cols; c++) {
            let startRow = 0;

            while (startRow < rows) {
              var _grid$startRow$c;

              const type = (_grid$startRow$c = grid[startRow][c]) == null ? void 0 : _grid$startRow$c.type;

              if (type === null) {
                startRow++;
                continue;
              }

              let endRow = startRow;

              while (endRow + 1 < rows && ((_grid$c = grid[endRow + 1][c]) == null ? void 0 : _grid$c.type) === type) {
                var _grid$c;

                endRow++;
              }

              const length = endRow - startRow + 1;

              if (length >= 3) {
                const cells = [];

                for (let r = startRow; r <= endRow; r++) {
                  cells.push({
                    row: r,
                    col: c
                  });
                }

                const match = {
                  cells,
                  type: type,
                  length
                };
                matches.push(match);

                for (let r = startRow; r <= endRow; r++) {
                  addCellMatch(r, c, match);
                }
              }

              startRow = endRow + 1;
            }
          } // ---- 检测 T 型/L 型交叉 ----
          // 若某 cell 同时出现在一个横向匹配组和一个纵向匹配组中，
          // 且两个匹配组的长度都 >= 3，则为交叉点。
          // 交叉点产生 IRON special。这里不做额外合并，只是记录下来供 clearMatches 使用。
          // 实际在 clearMatches 中会重新分析交叉点。


          return matches;
        }
        /**
         * 清空消除格的 type 为 null，并对特殊匹配组生成特殊道具
         *
         * 特殊道具规则：
         * - 4连 → 被消除的最后一格保留 type，special = SHUTTLE
         * - 5连 → 中间格保留 type，special = RAINBOW
         * - T型/L型交叉点（同时属于横向3+和纵向3+匹配组）→ special = IRON
         *
         * @param grid 当前棋盘
         * @param matches 匹配组列表
         * @returns 清除后的棋盘（新数组）
         */


        clearMatches(grid, matches) {
          var _grid$0$length2, _grid$2;

          const rows = grid.length;
          const cols = (_grid$0$length2 = (_grid$2 = grid[0]) == null ? void 0 : _grid$2.length) != null ? _grid$0$length2 : 0; // 构建特殊道具生成计划：key="r,c", value=要设置的 SpecialType

          const specialPlan = new Map(); // 记录每个 cell 所属的匹配组（用于检测交叉点）

          const cellMatchGroups = new Map();

          const addCellToGroup = (r, c, group) => {
            var _cellMatchGroups$get;

            const key = `${r},${c}`;
            const list = (_cellMatchGroups$get = cellMatchGroups.get(key)) != null ? _cellMatchGroups$get : [];
            list.push(group);
            cellMatchGroups.set(key, list);
          };

          for (const match of matches) {
            for (const cell of match.cells) {
              addCellToGroup(cell.row, cell.col, match);
            }
          } // 第一步：标记特殊道具（按优先级，高优先覆盖低优先）
          // 优先级：RAINBOW (5连) > IRON (T/L) > SHUTTLE (4连)


          const setSpecial = (r, c, special) => {
            const key = `${r},${c}`;
            const current = specialPlan.get(key);

            if (!current || this.specialPriority(special) > this.specialPriority(current)) {
              specialPlan.set(key, special);
            }
          }; // 先处理 4 连和 5 连（基于单个匹配组）


          for (const match of matches) {
            if (match.length === 4) {
              // 4连：最后一个 cell 生成 SHUTTLE
              const last = match.cells[match.cells.length - 1];
              setSpecial(last.row, last.col, (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
                error: Error()
              }), SpecialType) : SpecialType).SHUTTLE);
            } else if (match.length >= 5) {
              // 5+连：中间 cell 生成 RAINBOW
              const midIdx = Math.floor(match.cells.length / 2);
              const mid = match.cells[midIdx];
              setSpecial(mid.row, mid.col, (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
                error: Error()
              }), SpecialType) : SpecialType).RAINBOW);
            }
          } // 再检测 T 型/L 型交叉


          for (const [key, groups] of cellMatchGroups) {
            if (groups.length < 2) continue;
            const [r, c] = key.split(',').map(Number);
            let hasHorizontal = false;
            let hasVertical = false;

            for (const g of groups) {
              // 判断匹配组是横向还是纵向
              const first = g.cells[0];
              const last = g.cells[g.cells.length - 1];

              if (first.row === last.row) {
                hasHorizontal = true;
              } else if (first.col === last.col) {
                hasVertical = true;
              }
            } // 同时有横向和纵向的 3+ 连 → T/L 交叉点


            if (hasHorizontal && hasVertical) {
              setSpecial(r, c, (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
                error: Error()
              }), SpecialType) : SpecialType).IRON);
            }
          } // 第二步：清除匹配格，但保留特殊道具生成格


          const clearedSet = new Set();

          for (const match of matches) {
            for (const cell of match.cells) {
              clearedSet.add(`${cell.row},${cell.col}`);
            }
          } // 构建新棋盘


          const newGrid = [];
          const clearedItemsMap = new Map();

          for (let r = 0; r < rows; r++) {
            const newRow = [];

            for (let c = 0; c < cols; c++) {
              const key = `${r},${c}`;
              const original = grid[r][c];
              const isCleared = clearedSet.has(key);
              const special = specialPlan.get(key);

              if (isCleared && !special) {
                var _clearedItemsMap$get;

                // 普通消除格：type 设为 null
                newRow.push({
                  row: r,
                  col: c,
                  type: null,
                  special: (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
                    error: Error()
                  }), SpecialType) : SpecialType).NONE,
                  tangleCount: 0,
                  isFrozen: false
                }); // 统计消除类型

                const typeKey = String(original.type);
                clearedItemsMap.set(typeKey, ((_clearedItemsMap$get = clearedItemsMap.get(typeKey)) != null ? _clearedItemsMap$get : 0) + 1);
              } else if (isCleared && special) {
                // 特殊道具生成格：保留 type，设置 special
                newRow.push({
                  row: r,
                  col: c,
                  type: original.type,
                  special,
                  tangleCount: original.tangleCount,
                  isFrozen: original.isFrozen
                });
              } else {
                // 未消除格：保留原样
                newRow.push({ ...original
                });
              }
            }

            newGrid.push(newRow);
          } // 发射 match:cleared 事件


          const clearedItems = Array.from(clearedItemsMap.entries()).map(([type, count]) => ({
            type: type,
            count
          }));
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).MATCH_CLEARED, {
            clearedItems
          });
          return newGrid;
        }
        /**
         * 重力下落 + 顶部补充新棋子
         *
         * 每列从底部向上扫描，将 null 格上方的棋子向下移动，
         * 顶部空位用随机新棋子填充。
         *
         * @param grid 当前棋盘（含 null 空位）
         * @returns 下落并填充后的棋盘
         */


        dropAndFill(grid) {
          var _grid$0$length3, _grid$3;

          const rows = grid.length;
          const cols = (_grid$0$length3 = (_grid$3 = grid[0]) == null ? void 0 : _grid$3.length) != null ? _grid$0$length3 : 0;
          const {
            elementTypes
          } = this.config; // 深拷贝

          const newGrid = grid.map(row => row.map(cell => ({ ...cell
          })));

          for (let c = 0; c < cols; c++) {
            // 收集该列所有非空棋子（从上到下）
            const nonEmpty = [];

            for (let r = 0; r < rows; r++) {
              if (newGrid[r][c].type !== null) {
                nonEmpty.push(newGrid[r][c]);
              }
            } // 从底部向上填充


            for (let r = rows - 1; r >= 0; r--) {
              if (nonEmpty.length > 0) {
                const cell = nonEmpty.pop();
                newGrid[r][c] = {
                  row: r,
                  col: c,
                  type: cell.type,
                  special: cell.special,
                  tangleCount: cell.tangleCount,
                  isFrozen: cell.isFrozen
                };
              } else {
                // 顶部补充新棋子
                const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
                newGrid[r][c] = {
                  row: r,
                  col: c,
                  type,
                  special: (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
                    error: Error()
                  }), SpecialType) : SpecialType).NONE,
                  tangleCount: 0,
                  isFrozen: false
                };
              }
            }
          }

          return newGrid;
        }
        /**
         * 单步消除循环：findMatches → clearMatches → dropAndFill → 递归直到无匹配
         *
         * @param grid 当前棋盘
         * @returns 最终稳定棋盘、所有匹配组、级联消除次数
         */


        step(grid) {
          let currentGrid = grid;
          let cascades = 0;
          const allMatches = [];
          const MAX_CASCADES = 100; // 安全上限，防止无限级联

          const doStep = g => {
            if (cascades >= MAX_CASCADES) {
              return g;
            }

            const matches = this.findMatches(g);

            if (matches.length === 0) {
              return g;
            } // 发射 match:found 事件


            (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
              error: Error()
            }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).MATCH_FOUND, matches);
            cascades++;
            allMatches.push(...matches);
            const cleared = this.clearMatches(g, matches);
            const filled = this.dropAndFill(cleared);
            return doStep(filled);
          };

          currentGrid = doStep(currentGrid); // 发射 grid:stable 事件

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GRID_STABLE, currentGrid); // 更新内部棋盘

          this.grid = currentGrid;
          return {
            grid: currentGrid,
            matches: allMatches,
            cascades
          };
        }
        /**
         * 交换两格棋子
         *
         * 验证两格是否相邻，交换后是否产生消除。
         * 若不合法（不相邻或无匹配），返回 valid=false 并恢复原棋盘。
         *
         * @param grid 当前棋盘
         * @param r1 第一格行号
         * @param c1 第一格列号
         * @param r2 第二格行号
         * @param c2 第二格列号
         * @returns { valid: boolean; grid: Cell[][] }
         */


        swap(grid, r1, c1, r2, c2) {
          var _grid$0$length4, _grid$4;

          const rows = grid.length;
          const cols = (_grid$0$length4 = (_grid$4 = grid[0]) == null ? void 0 : _grid$4.length) != null ? _grid$0$length4 : 0; // 边界检查

          if (r1 < 0 || r1 >= rows || c1 < 0 || c1 >= cols) return {
            valid: false,
            grid
          };
          if (r2 < 0 || r2 >= rows || c2 < 0 || c2 >= cols) return {
            valid: false,
            grid
          }; // 相邻性检查（上下左右邻接，不能是对角）

          const dr = Math.abs(r1 - r2);
          const dc = Math.abs(c1 - c2);

          if (!(dr === 1 && dc === 0 || dr === 0 && dc === 1)) {
            return {
              valid: false,
              grid
            };
          } // 执行交换（深拷贝）


          const newGrid = grid.map(row => row.map(cell => ({ ...cell
          }))); // 交换两个 cell 的数据

          const temp = { ...newGrid[r1][c1]
          };
          newGrid[r1][c1] = { ...newGrid[r2][c2],
            row: r1,
            col: c1
          };
          newGrid[r2][c2] = { ...temp,
            row: r2,
            col: c2
          }; // 检查是否产生匹配

          const matches = this.findMatches(newGrid);

          if (matches.length === 0) {
            return {
              valid: false,
              grid
            };
          }

          return {
            valid: true,
            grid: newGrid
          };
        }
        /**
         * 获取当前棋盘
         * @returns 当前棋盘 Cell[][]
         */


        getGrid() {
          return this.grid;
        } // ========== Private Helpers ==========

        /**
         * 获取在位置 (r, c) 放置后不会产生 3 连的候选类型
         * 用于 initGrid 保证初始无三连
         */


        getSafeTypes(grid, currentRow, r, c, elementTypes) {
          // 检查左侧两个是否相同类型（使用当前正在构建的行）
          let forbiddenLeft = null;

          if (c >= 2) {
            var _currentRow, _currentRow2;

            const t1 = (_currentRow = currentRow[c - 1]) == null ? void 0 : _currentRow.type;
            const t2 = (_currentRow2 = currentRow[c - 2]) == null ? void 0 : _currentRow2.type;

            if (t1 != null && t1 === t2) {
              forbiddenLeft = t1;
            }
          } // 检查上方两个是否相同类型（使用已完成的之前行）


          let forbiddenUp = null;

          if (r >= 2) {
            var _grid, _grid2;

            const t1 = (_grid = grid[r - 1]) == null || (_grid = _grid[c]) == null ? void 0 : _grid.type;
            const t2 = (_grid2 = grid[r - 2]) == null || (_grid2 = _grid2[c]) == null ? void 0 : _grid2.type;

            if (t1 != null && t1 === t2) {
              forbiddenUp = t1;
            }
          } // 过滤掉会产生 3 连的类型


          const forbidden = new Set();
          if (forbiddenLeft) forbidden.add(forbiddenLeft);
          if (forbiddenUp) forbidden.add(forbiddenUp);
          let candidates = elementTypes.filter(t => !forbidden.has(t)); // 如果全部被禁止（理论上不会，因为至少有 3+ 种类型时不可能全部被禁），
          // 则退回使用全部类型

          if (candidates.length === 0) {
            candidates = [...elementTypes];
          }

          return candidates;
        }
        /**
         * 特殊道具优先级：RAINBOW(3) > IRON(2) > SHUTTLE(1) > NONE(0)
         */


        specialPriority(special) {
          switch (special) {
            case (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
              error: Error()
            }), SpecialType) : SpecialType).RAINBOW:
              return 3;

            case (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
              error: Error()
            }), SpecialType) : SpecialType).IRON:
              return 2;

            case (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
              error: Error()
            }), SpecialType) : SpecialType).SHUTTLE:
              return 1;

            default:
              return 0;
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a1845b59851ff04d0d899a44a315bba2c3c9b629.js.map