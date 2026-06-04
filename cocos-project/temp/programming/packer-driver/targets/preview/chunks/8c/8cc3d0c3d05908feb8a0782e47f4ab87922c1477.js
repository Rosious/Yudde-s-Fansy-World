System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Button, Component, Sprite, UITransform, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, CellComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Button = _cc.Button;
      Component = _cc.Component;
      Sprite = _cc.Sprite;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f8eefyOtMZE95iNOmmviVJ3", "CellComponent", undefined); // ============================================================
      // CellComponent — 三消棋盘单个棋子组件（Cocos Creator 3.x）
      //
      // 挂在 cellPrefab 上，负责：
      // - 显示棋子精灵图
      // - 处理点击事件并通知父节点 Match3GridComponent
      // ============================================================


      __checkObsolete__(['_decorator', 'Button', 'Component', 'Sprite', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 单个棋子组件。
       *
       * 每个 CellComponent 代表棋盘上的一个棋子，
       * 持有自己的行列坐标，点击时通知父节点进行交互处理。
       */

      _export("CellComponent", CellComponent = (_dec = ccclass('CellComponent'), _dec2 = property({
        type: Sprite,
        tooltip: '棋子精灵组件'
      }), _dec(_class = (_class2 = class CellComponent extends Component {
        constructor() {
          super(...arguments);

          /** 棋子精灵（在编辑器中绑定） */
          _initializerDefineProperty(this, "sprite", _descriptor, this);

          /** 棋子所在行号 */
          this.row = 0;

          /** 棋子所在列号 */
          this.col = 0;
        }

        // ==========================================================
        // 生命周期
        // ==========================================================
        onLoad() {
          // 注册按钮点击事件
          this.ensureClickable();
          this.node.off(Button.EventType.CLICK, this.onButtonClick, this);
          this.node.on(Button.EventType.CLICK, this.onButtonClick, this);
        }

        onDestroy() {
          // 清理按钮点击事件监听
          this.node.off(Button.EventType.CLICK, this.onButtonClick, this);
        } // ==========================================================
        // 公共方法
        // ==========================================================

        /**
         * 初始化棋子数据。
         *
         * 设置棋子的行列坐标和节点名称，方便调试时在场景树中识别。
         *
         * @param row - 行号
         * @param col - 列号
         * @param cellType - 棋子类型（ElementType 枚举值字符串）
         */


        setup(row, col, cellType) {
          this.row = row;
          this.col = col;
          this.node.name = "Cell_" + row + "_" + col + "_" + cellType;
        } // ==========================================================
        // 事件处理
        // ==========================================================

        /**
         * 确保当前节点有可点击的 UI 命中区域和 Button 组件。
         */


        ensureClickable() {
          var _this$node$getCompone;

          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            transform = this.node.addComponent(UITransform);
          }

          var size = transform.contentSize;

          if (!size || size.width <= 0 || size.height <= 0) {
            transform.setContentSize(80, 80);
          }

          var button = (_this$node$getCompone = this.node.getComponent(Button)) != null ? _this$node$getCompone : this.node.addComponent(Button);
          button.interactable = true;
          button.target = this.node;
        }
        /**
         * 按钮点击事件处理。
         *
         * 通过字符串获取父节点上的 Match3GridComponent 组件，
         * 并调用其 onCellClicked 方法传递当前棋子的行列坐标。
         * 使用字符串方式避免循环引用问题。
         */


        onButtonClick() {
          var _this$node$parent;

          // 通过字符串名获取组件，避免与 Match3GridComponent 产生循环 import
          var grid = (_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponent('Match3GridComponent');

          if (grid) {
            grid.onCellClicked(this.row, this.col);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8cc3d0c3d05908feb8a0782e47f4ab87922c1477.js.map