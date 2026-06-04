System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, Vec3, Color, Button, Sprite, SpriteFrame, UITransform, Graphics, tween, resources, CCFloat, CCInteger, Match3Engine, ElementType, SpecialType, GameEvent, eventBus, CellComponent, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, Match3GridComponent;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMatch3Engine(extras) {
    _reporterNs.report("Match3Engine", "../systems/match3/Match3Engine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfElementType(extras) {
    _reporterNs.report("ElementType", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialType(extras) {
    _reporterNs.report("SpecialType", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCell(extras) {
    _reporterNs.report("Cell", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGridConfig(extras) {
    _reporterNs.report("GridConfig", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventBus(extras) {
    _reporterNs.report("eventBus", "../core/EventBus", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCellComponent(extras) {
    _reporterNs.report("CellComponent", "./CellComponent", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Vec3 = _cc.Vec3;
      Color = _cc.Color;
      Button = _cc.Button;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      UITransform = _cc.UITransform;
      Graphics = _cc.Graphics;
      tween = _cc.tween;
      resources = _cc.resources;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
    }, function (_unresolved_2) {
      Match3Engine = _unresolved_2.Match3Engine;
    }, function (_unresolved_3) {
      ElementType = _unresolved_3.ElementType;
      SpecialType = _unresolved_3.SpecialType;
      GameEvent = _unresolved_3.GameEvent;
    }, function (_unresolved_4) {
      eventBus = _unresolved_4.eventBus;
    }, function (_unresolved_5) {
      CellComponent = _unresolved_5.CellComponent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1b1618eAzJIgY8RJgOX0SJf", "Match3GridComponent", undefined); // ============================================================
      // Match3GridComponent — 三消棋盘主组件（Cocos Creator 3.x）
      //
      // 挂在棋盘根节点上，负责：
      // - 初始化三消引擎并生成棋盘
      // - 渲染棋子网格
      // - 处理玩家点击与交换交互
      // - 级联消除动画循环
      // ============================================================


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'Color', 'Button', 'Sprite', 'SpriteFrame', 'UITransform', 'Graphics', 'tween', 'resources', 'CCFloat', 'CCInteger']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 三消棋盘主组件。
       *
       * 交互流程：
       * 1. onLoad 时创建 Match3Engine，初始化棋盘并渲染
       * 2. 玩家点击棋子 → onCellClicked 处理选中/交换逻辑
       * 3. 交换合法 → 级联消除动画循环
       * 4. 交换非法 → 取消选中，恢复原状态
       */

      _export("Match3GridComponent", Match3GridComponent = (_dec = ccclass('Match3GridComponent'), _dec2 = property({
        type: Prefab,
        tooltip: '棋子预制体（需挂载 CellComponent 和 Sprite）'
      }), _dec3 = property({
        type: CCFloat,
        tooltip: '单个棋子边长（像素）'
      }), _dec4 = property({
        type: CCInteger,
        tooltip: '棋盘行数'
      }), _dec5 = property({
        type: CCInteger,
        tooltip: '棋盘列数'
      }), _dec(_class = (_class2 = class Match3GridComponent extends Component {
        constructor() {
          super(...arguments);

          // ---- @property 属性（在编辑器中绑定） ----

          /** 棋子预制体（需挂载 CellComponent） */
          _initializerDefineProperty(this, "cellPrefab", _descriptor, this);

          /** 单个棋子大小（像素） */
          _initializerDefineProperty(this, "cellSize", _descriptor2, this);

          /** 棋盘行数 */
          _initializerDefineProperty(this, "rows", _descriptor3, this);

          /** 棋盘列数 */
          _initializerDefineProperty(this, "cols", _descriptor4, this);

          // ---- 私有成员 ----

          /** 三消引擎实例 */
          this.engine = void 0;

          /** 棋盘子节点二维数组 cellNodes[row][col] */
          this.cellNodes = [];

          /** 当前选中的棋子行号（-1 表示无选中） */
          this.selectedRow = -1;

          /** 当前选中的棋子列号（-1 表示无选中） */
          this.selectedCol = -1;

          /** 是否正在处理消除动画（防止连点） */
          this.isProcessing = false;

          /** 当前正在执行的 Tween 动画引用（用于取消） */
          this.selectedTween = null;

          // ==========================================================
          // 事件回调
          // ==========================================================

          /**
           * 棋盘稳定事件回调。
           *
           * 当 GRID_STABLE 事件触发时，重新渲染棋盘以同步最新状态。
           *
           * @param grid - 稳定后的棋盘数据
           */
          this.onGridStable = grid => {
            // 同步渲染最新棋盘状态
            this.renderGrid(grid);
          };
        }

        // ==========================================================
        // 生命周期
        // ==========================================================
        onLoad() {
          // 构建棋盘配置
          var config = {
            rows: this.rows,
            cols: this.cols,
            elementTypes: [(_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).LINE, (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).BUTTON, (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).SCISSORS, (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).TAPE, (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).SEWING]
          }; // 创建三消引擎并初始化棋盘

          this.engine = new (_crd && Match3Engine === void 0 ? (_reportPossibleCrUseOfMatch3Engine({
            error: Error()
          }), Match3Engine) : Match3Engine)(config);
          var grid = this.engine.initGrid();
          this.renderGrid(grid); // 监听棋盘稳定事件

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GRID_STABLE, this.onGridStable);
        }

        onDestroy() {
          // 清理事件监听
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GRID_STABLE, this.onGridStable); // 停止所有 Tween 动画

          this.cancelSelectionTween();
        } // ==========================================================
        // 棋盘渲染
        // ==========================================================

        /**
         * 根据棋盘数据渲染整个网格。
         *
         * 首次调用时为每个 cell 从预制体创建节点，
         * 后续调用时复用已有节点并更新其显示。
         *
         * @param grid - 棋盘数据二维数组
         */


        renderGrid(grid) {
          // 确保 cellNodes 数组已初始化
          if (this.cellNodes.length === 0) {
            for (var r = 0; r < this.rows; r++) {
              this.cellNodes[r] = [];
            }
          }

          for (var _r = 0; _r < this.rows; _r++) {
            for (var c = 0; c < this.cols; c++) {
              var _grid$_r, _this$cellNodes$_r$c, _this$cellNodes$_r;

              var cell = (_grid$_r = grid[_r]) == null ? void 0 : _grid$_r[c];
              if (!cell) continue;
              var node = (_this$cellNodes$_r$c = (_this$cellNodes$_r = this.cellNodes[_r]) == null ? void 0 : _this$cellNodes$_r[c]) != null ? _this$cellNodes$_r$c : null; // 首次创建节点

              if (!node) {
                var createdNode = this.createCellNode();
                createdNode.parent = this.node;

                if (!this.cellNodes[_r]) {
                  this.cellNodes[_r] = [];
                }

                this.cellNodes[_r][c] = createdNode;
                node = createdNode;
              }

              if (node) {
                // 设置位置：x = col * cellSize，y = -row * cellSize（棋盘原点在左上角）
                var originX = -((this.cols - 1) * this.cellSize) / 2;
                var originY = (this.rows - 1) * this.cellSize / 2;
                node.setPosition(new Vec3(originX + c * this.cellSize, originY - _r * this.cellSize, 0)); // 更新棋子精灵显示

                this.updateCellSprite(node, cell); // 更新 CellComponent 数据

                var cellComp = this.ensureCellComponent(node);
                cellComp.setup(_r, c, cell.type);
              }
            }
          }
        }

        createCellNode() {
          if (this.cellPrefab) {
            return instantiate(this.cellPrefab);
          }

          var node = new Node('Cell');
          var transform = node.addComponent(UITransform);
          var size = Math.max(12, this.cellSize);
          transform.setContentSize(size, size);
          var button = node.addComponent(Button);
          button.interactable = true;
          button.target = node;
          node.addComponent(Graphics);
          node.addComponent(_crd && CellComponent === void 0 ? (_reportPossibleCrUseOfCellComponent({
            error: Error()
          }), CellComponent) : CellComponent);
          return node;
        }

        ensureCellComponent(node) {
          var _node$getComponent;

          var transform = node.getComponent(UITransform);

          if (!transform) {
            transform = node.addComponent(UITransform);
          }

          var size = Math.max(12, this.cellSize);
          transform.setContentSize(size, size);
          var button = (_node$getComponent = node.getComponent(Button)) != null ? _node$getComponent : node.addComponent(Button);
          button.interactable = true;
          button.target = node;
          var cellComp = node.getComponent(_crd && CellComponent === void 0 ? (_reportPossibleCrUseOfCellComponent({
            error: Error()
          }), CellComponent) : CellComponent);

          if (!cellComp) {
            cellComp = node.addComponent(_crd && CellComponent === void 0 ? (_reportPossibleCrUseOfCellComponent({
              error: Error()
            }), CellComponent) : CellComponent);
          }

          return cellComp;
        }
        /**
         * 根据 cell 数据更新单个节点的精灵显示。
         *
         * 通过 resources.load 动态加载对应棋子类型的 SpriteFrame，
         * 路径格式为 'textures/{ElementType}/spriteFrame'。
         * 特殊道具棋子通过颜色叠加方式高亮标记。
         *
         * @param node - 棋子节点
         * @param cell - 棋子数据
         */


        updateCellSprite(node, cell) {
          var sprite = node.getComponent(Sprite); // 根据棋子类型动态加载对应精灵帧

          if (!cell.type) {
            if (sprite) {
              sprite.spriteFrame = null;
              sprite.color = new Color(255, 255, 255, 0);
            }

            this.clearFallbackCell(node);
            return;
          }

          this.drawFallbackCell(node, cell);
          if (!sprite) return;
          var path = this.getElementTexturePath(cell.type);
          resources.load(path, SpriteFrame, (err, spriteFrame) => {
            if (!err && spriteFrame && sprite.isValid) {
              sprite.spriteFrame = spriteFrame;
              this.clearFallbackCell(node);
            }
          }); // 特殊道具高亮：通过颜色叠加标记

          if (cell.special !== (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
            error: Error()
          }), SpecialType) : SpecialType).NONE) {
            var highlightColor = this.getSpecialColor(cell.special);
            sprite.color = highlightColor;
          } else {
            sprite.color = new Color(255, 255, 255, 255);
          }
        }
        /**
         * 获取特殊道具对应的高亮颜色。
         *
         * @param special - 特殊道具类型
         * @returns 对应颜色
         */


        drawFallbackCell(node, cell) {
          var graphics = this.getFallbackGraphics(node);
          var size = Math.max(12, this.cellSize - 8);
          var half = size / 2;
          graphics.clear();
          graphics.fillColor = this.getElementColor(cell.type);
          graphics.rect(-half, -half, size, size);
          graphics.fill();
          graphics.lineWidth = cell.special !== (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
            error: Error()
          }), SpecialType) : SpecialType).NONE ? 5 : 2;
          graphics.strokeColor = cell.special !== (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
            error: Error()
          }), SpecialType) : SpecialType).NONE ? this.getSpecialColor(cell.special) : new Color(255, 255, 255, 220);
          graphics.rect(-half, -half, size, size);
          graphics.stroke();
        }

        getFallbackGraphics(node) {
          var _fallbackNode$getComp;

          var fallbackName = '__CellFallbackGraphic';
          var fallbackNode = node.getChildByName(fallbackName);

          if (!fallbackNode) {
            fallbackNode = new Node(fallbackName);
            fallbackNode.layer = node.layer;
            fallbackNode.parent = node;
          }

          fallbackNode.active = true;
          fallbackNode.layer = node.layer;
          var transform = fallbackNode.getComponent(UITransform);

          if (!transform) {
            transform = fallbackNode.addComponent(UITransform);
          }

          var size = Math.max(12, this.cellSize - 8);
          transform.setContentSize(size, size);
          return (_fallbackNode$getComp = fallbackNode.getComponent(Graphics)) != null ? _fallbackNode$getComp : fallbackNode.addComponent(Graphics);
        }

        clearFallbackCell(node) {
          var _fallbackNode$getComp2;

          var fallbackNode = node.getChildByName('__CellFallbackGraphic');

          if (!fallbackNode) {
            var _node$getComponent2;

            (_node$getComponent2 = node.getComponent(Graphics)) == null || _node$getComponent2.clear();
            return;
          }

          (_fallbackNode$getComp2 = fallbackNode.getComponent(Graphics)) == null || _fallbackNode$getComp2.clear();
          fallbackNode.active = false;
        }

        getElementColor(type) {
          switch (type) {
            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).LINE:
              return new Color(231, 76, 60, 255);

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).BUTTON:
              return new Color(52, 152, 219, 255);

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).SCISSORS:
              return new Color(46, 204, 113, 255);

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).TAPE:
              return new Color(241, 196, 15, 255);

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).SEWING:
              return new Color(155, 89, 182, 255);

            default:
              return new Color(149, 165, 166, 255);
          }
        }

        getElementTexturePath(type) {
          switch (type) {
            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).LINE:
              return 'textures/line/spriteFrame';

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).BUTTON:
              return 'textures/button/spriteFrame';

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).SCISSORS:
              return 'textures/scissors/spriteFrame';

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).TAPE:
              return 'textures/tape/spriteFrame';

            case (_crd && ElementType === void 0 ? (_reportPossibleCrUseOfElementType({
              error: Error()
            }), ElementType) : ElementType).SEWING:
              return 'textures/sewing/spriteFrame';

            default:
              return 'textures/line/spriteFrame';
          }
        }

        getSpecialColor(special) {
          switch (special) {
            case (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
              error: Error()
            }), SpecialType) : SpecialType).SHUTTLE:
              return new Color(255, 215, 0, 255);
            // 金色（飞梭）

            case (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
              error: Error()
            }), SpecialType) : SpecialType).IRON:
              return new Color(255, 99, 71, 255);
            // 番茄红（魔法熨斗）

            case (_crd && SpecialType === void 0 ? (_reportPossibleCrUseOfSpecialType({
              error: Error()
            }), SpecialType) : SpecialType).RAINBOW:
              return new Color(0, 255, 255, 255);
            // 青色（彩虹布）

            default:
              return new Color(255, 255, 255, 255);
          }
        } // ==========================================================
        // 点击交互
        // ==========================================================

        /**
         * 棋子点击事件处理（由 CellComponent 调用）。
         *
         * 交互逻辑：
         * - 无选中棋子 → 选中当前棋子，播放呼吸动画
         * - 同一棋子再次点击 → 取消选中
         * - 不同棋子点击 → 尝试交换，交换有效则进入消除流程，无效则取消选中
         * - 正在处理消除动画中 → 忽略点击
         *
         * @param row - 被点击棋子的行号
         * @param col - 被点击棋子的列号
         */


        onCellClicked(row, col) {
          // 动画进行中，忽略点击
          if (this.isProcessing) return; // 无选中棋子 → 选中当前棋子

          if (this.selectedRow === -1 || this.selectedCol === -1) {
            this.selectCell(row, col);
            return;
          } // 点击同一棋子 → 取消选中


          if (this.selectedRow === row && this.selectedCol === col) {
            this.deselectCell();
            return;
          } // 点击不同棋子 → 尝试交换


          this.trySwap(this.selectedRow, this.selectedCol, row, col);
        }
        /**
         * 选中棋子并播放呼吸动画。
         *
         * @param row - 行号
         * @param col - 列号
         */


        selectCell(row, col) {
          var _this$cellNodes$row;

          this.selectedRow = row;
          this.selectedCol = col;
          var node = (_this$cellNodes$row = this.cellNodes[row]) == null ? void 0 : _this$cellNodes$row[col];
          if (!node) return; // 取消之前的选中动画

          this.cancelSelectionTween(); // 播放呼吸缩放动画（放大→缩小循环）

          this.selectedTween = tween(node).to(0.3, {
            scale: new Vec3(1.15, 1.15, 1)
          }).to(0.3, {
            scale: new Vec3(1, 1, 1)
          }).union().repeatForever().start();
        }
        /**
         * 取消棋子选中状态并停止动画。
         */


        deselectCell() {
          // 恢复选中棋子缩放
          if (this.selectedRow >= 0 && this.selectedCol >= 0) {
            var _this$cellNodes$this$;

            var node = (_this$cellNodes$this$ = this.cellNodes[this.selectedRow]) == null ? void 0 : _this$cellNodes$this$[this.selectedCol];

            if (node) {
              node.setScale(new Vec3(1, 1, 1));
            }
          }

          this.cancelSelectionTween();
          this.selectedRow = -1;
          this.selectedCol = -1;
        }
        /**
         * 停止选中动画 Tween。
         */


        cancelSelectionTween() {
          if (this.selectedTween) {
            this.selectedTween.stop();
            this.selectedTween = null;
          }
        }
        /**
         * 尝试交换两个棋子。
         *
         * 调用引擎 swap 方法验证交换是否合法（相邻且产生消除）。
         * 若合法则进入消除流程，否则播放抖动提示并取消选中。
         *
         * @param r1 - 第一格行号
         * @param c1 - 第一格列号
         * @param r2 - 第二格行号
         * @param c2 - 第二格列号
         */


        trySwap(r1, c1, r2, c2) {
          var grid = this.engine.getGrid();
          var result = this.engine.swap(grid, r1, c1, r2, c2); // 取消原选中状态

          this.deselectCell();

          if (result.valid) {
            // 交换有效 → 渲染新棋盘并进入消除流程
            this.renderGrid(result.grid);
            this.processMatches(result.grid);
          } else {
            // 交换无效 → 抖动提示，棋盘不变
            this.shakeCell(r1, c1);
            this.shakeCell(r2, c2);
          }
        }
        /**
         * 格子抖动动画（提示非法操作）。
         *
         * @param row - 行号
         * @param col - 列号
         */


        shakeCell(row, col) {
          var _this$cellNodes$row2;

          var node = (_this$cellNodes$row2 = this.cellNodes[row]) == null ? void 0 : _this$cellNodes$row2[col];
          if (!node) return;
          var originalPos = node.getPosition();
          tween(node).to(0.05, {
            position: new Vec3(originalPos.x + 5, originalPos.y, 0)
          }).to(0.05, {
            position: new Vec3(originalPos.x - 5, originalPos.y, 0)
          }).to(0.05, {
            position: new Vec3(originalPos.x + 5, originalPos.y, 0)
          }).to(0.05, {
            position: new Vec3(originalPos.x - 5, originalPos.y, 0)
          }).to(0.05, {
            position: originalPos
          }).start();
        } // ==========================================================
        // 消除流程（级联动画）
        // ==========================================================

        /**
         * 级联消除处理循环。
         *
         * 逐轮调用引擎的 findMatches → clearMatches → dropAndFill，
         * 每轮之间插入延迟以实现可视化级联消除动画效果。
         * 直到棋盘完全稳定（无新的匹配组）。
         *
         * 注意：不用引擎的 step() 一步到位的做法，
         * 而是手动逐轮推进，以便在每轮之间 renderGrid 更新显示。
         *
         * @param grid - 当前棋盘数据
         */


        processMatches(grid) {
          var _this = this;

          return _asyncToGenerator(function* () {
            _this.isProcessing = true;
            var currentGrid = grid;
            var cascades = 0;
            var MAX_CASCADES = 100; // 安全上限

            while (cascades < MAX_CASCADES) {
              // 查找当前棋盘上的所有匹配组
              var matches = _this.engine.findMatches(currentGrid);

              if (matches.length === 0) {
                // 无匹配组 → 棋盘稳定
                break;
              }

              cascades++; // 发射 MATCH_FOUND 事件

              (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
                error: Error()
              }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
                error: Error()
              }), GameEvent) : GameEvent).MATCH_FOUND, matches); // 清除匹配棋子（生成特殊道具）

              currentGrid = _this.engine.clearMatches(currentGrid, matches);

              _this.renderGrid(currentGrid); // 等待 150ms 观看消除效果


              yield _this.delay(150); // 重力下落 + 顶部补充新棋子

              currentGrid = _this.engine.dropAndFill(currentGrid);

              _this.renderGrid(currentGrid); // 等待 150ms 观看下落效果


              yield _this.delay(150);
            } // 发射棋盘稳定事件


            (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
              error: Error()
            }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).GRID_STABLE, currentGrid);
            _this.isProcessing = false;
          })();
        }
        /**
         * 异步延迟工具。
         *
         * @param ms - 延迟毫秒数
         * @returns Promise
         */


        delay(ms) {
          return new Promise(resolve => {
            setTimeout(resolve, ms);
          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cellPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cellSize", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 80;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rows", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "cols", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=31d7d0a3c8c511c3fc92407f2e4bbe9ad165451b.js.map