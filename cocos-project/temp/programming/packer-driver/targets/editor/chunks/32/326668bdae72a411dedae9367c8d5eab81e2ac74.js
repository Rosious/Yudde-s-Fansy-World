System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Button, Canvas, Camera, Component, Vec3, director, InventorySystem, OrderManager, DressUpManager, _dec, _class, _class2, _crd, ccclass, property, MainGameFlow;

  function _reportPossibleCrUseOfInventorySystem(extras) {
    _reporterNs.report("InventorySystem", "../systems/inventory/InventorySystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOrderManager(extras) {
    _reporterNs.report("OrderManager", "../systems/order/OrderManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDressUpManager(extras) {
    _reporterNs.report("DressUpManager", "../systems/dressup/DressUpManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Button = _cc.Button;
      Canvas = _cc.Canvas;
      Camera = _cc.Camera;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
      director = _cc.director;
    }, function (_unresolved_2) {
      InventorySystem = _unresolved_2.InventorySystem;
    }, function (_unresolved_3) {
      OrderManager = _unresolved_3.OrderManager;
    }, function (_unresolved_4) {
      DressUpManager = _unresolved_4.DressUpManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b0c1dUPxkVLRb30BokRBRT+", "MainGameFlow", undefined); // ============================================================
      // MainGameFlow — 游戏状态协调器（常驻单例）
      //
      // 持有 InventorySystem、OrderManager、DressUpManager 的全局引用，
      // 确保其余 UI 组件可以通过静态 getInstance() 获取这些系统实例。
      // 本节点挂载后即设为持久化节点（场景切换不销毁）。
      // ============================================================


      __checkObsolete__(['_decorator', 'Button', 'Canvas', 'Camera', 'Component', 'Node', 'Vec3', 'director']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 游戏全局主流程协调器。
       *
       * 职责：
       * - 生命周期：场景加载 → 常驻不销毁
       * - 初始化三大核心系统：背包、订单、换装
       * - 对外暴露单例 getInstance() 供所有 UI 面板使用
       *
       * 用法：在首个场景的根节点上挂载此组件即可。
       */

      _export("MainGameFlow", MainGameFlow = (_dec = ccclass('MainGameFlow'), _dec(_class = (_class2 = class MainGameFlow extends Component {
        constructor(...args) {
          super(...args);
          // ---- 系统引用 ----

          /** 全局背包系统 */
          this.inventorySystem = void 0;

          /** 全局订单管理器 */
          this.orderManager = void 0;

          /** 全局换装管理器 */
          this.dressUpManager = void 0;
        }

        /**
         * 获取 MainGameFlow 单例。
         * 必须在场景中已存在挂载了此组件的节点后调用。
         *
         * @returns MainGameFlow 唯一实例
         * @throws 若尚未初始化则抛出错误
         */
        static getInstance() {
          if (!MainGameFlow._instance) {
            throw new Error('[MainGameFlow] 尚未初始化！请确保场景中含有 MainGameFlow 组件节点。');
          }

          return MainGameFlow._instance;
        }

        // ==========================================================
        // 生命周期
        // ==========================================================
        onLoad() {
          // 防止重复创建实例
          if (MainGameFlow._instance) {
            console.warn('[MainGameFlow] 已存在单例实例，销毁当前节点。');
            this.node.destroy();
            return;
          } // 注册为单例


          MainGameFlow._instance = this;
          this.configureSceneCamera(); // 设为常驻节点，场景切换不销毁

          director.addPersistRootNode(this.node); // 初始化三大核心系统

          this.inventorySystem = new (_crd && InventorySystem === void 0 ? (_reportPossibleCrUseOfInventorySystem({
            error: Error()
          }), InventorySystem) : InventorySystem)();
          this.orderManager = new (_crd && OrderManager === void 0 ? (_reportPossibleCrUseOfOrderManager({
            error: Error()
          }), OrderManager) : OrderManager)(this.inventorySystem);
          this.dressUpManager = new (_crd && DressUpManager === void 0 ? (_reportPossibleCrUseOfDressUpManager({
            error: Error()
          }), DressUpManager) : DressUpManager)();
          console.log('[MainGameFlow] 初始化完成，三大系统已就绪。');
          this.bindBottomButtons();
          this.showPanel('match');
        }

        configureSceneCamera() {
          var _director$getScene, _ProjectionType$ORTHO, _ProjectionType;

          const scene = (_director$getScene = director.getScene == null ? void 0 : director.getScene()) != null ? _director$getScene : this.node.parent;
          const cameraNode = scene == null ? void 0 : scene.getChildByName('Main Camera');
          const canvasNode = scene == null ? void 0 : scene.getChildByName('Canvas');
          const camera = cameraNode == null ? void 0 : cameraNode.getComponent(Camera);
          const canvas = canvasNode == null ? void 0 : canvasNode.getComponent(Canvas);

          if (!cameraNode || !camera || !canvas) {
            console.warn('[MainGameFlow] Main Camera or Canvas missing; 2D render setup skipped.');
            return;
          }

          cameraNode.setPosition(new Vec3(640, 360, 1000));
          cameraNode.setRotationFromEuler == null || cameraNode.setRotationFromEuler(0, 0, 0);
          camera.projection = (_ProjectionType$ORTHO = (_ProjectionType = Camera.ProjectionType) == null ? void 0 : _ProjectionType.ORTHO) != null ? _ProjectionType$ORTHO : 0;
          camera.orthoHeight = 360;
          canvas.cameraComponent = camera;
          canvas.alignCanvasWithScreen = true;
        }

        bindBottomButtons() {
          const canvas = this.findCanvasNode();
          const bottomBar = canvas == null ? void 0 : canvas.getChildByName('BottomBar');

          if (!bottomBar) {
            console.warn('[MainGameFlow] BottomBar not found; bottom navigation skipped.');
            return;
          }

          this.bindButton(bottomBar.getChildByName('BtnMatch'), this.onMatchClicked, 'BtnMatch');
          this.bindButton(bottomBar.getChildByName('BtnShop'), this.onShopClicked, 'BtnShop');
          this.bindButton(bottomBar.getChildByName('BtnDress'), this.onDressClicked, 'BtnDress');
        }

        bindButton(buttonNode, handler, debugName) {
          var _buttonNode$getCompon;

          if (!buttonNode) {
            console.warn(`[MainGameFlow] ${debugName} not found.`);
            return;
          }

          const button = (_buttonNode$getCompon = buttonNode.getComponent(Button)) != null ? _buttonNode$getCompon : buttonNode.addComponent(Button);
          button.interactable = true;
          button.target = buttonNode;
          button.node.off(Button.EventType.CLICK, handler, this);
          button.node.on(Button.EventType.CLICK, handler, this);
        }

        onMatchClicked() {
          this.showPanel('match');
        }

        onShopClicked() {
          this.showPanel('shop');
        }

        onDressClicked() {
          this.showPanel('dress');
        }

        showPanel(activePanel) {
          const canvas = this.findCanvasNode();

          if (!canvas) {
            console.warn('[MainGameFlow] Canvas not found; cannot switch panels.');
            return;
          }

          const matchGrid = canvas.getChildByName('MatchGrid');
          const shopPanel = canvas.getChildByName('ShopPanel');
          const dressRoomPanel = canvas.getChildByName('DressRoomPanel');

          if (!matchGrid || !shopPanel || !dressRoomPanel) {
            console.warn('[MainGameFlow] One or more main panels are missing.');
          }

          if (matchGrid) matchGrid.active = activePanel === 'match';
          if (shopPanel) shopPanel.active = activePanel === 'shop';
          if (dressRoomPanel) dressRoomPanel.active = activePanel === 'dress';
        }

        findCanvasNode() {
          var _ref, _scene$getChildByName, _this$node$parent;

          const scene = director.getScene();
          return (_ref = (_scene$getChildByName = scene == null ? void 0 : scene.getChildByName('Canvas')) != null ? _scene$getChildByName : (_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getChildByName('Canvas')) != null ? _ref : null;
        }

        onDestroy() {
          // 清理单例引用，避免野指针
          if (MainGameFlow._instance === this) {
            MainGameFlow._instance = null;
          }
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=326668bdae72a411dedae9367c8d5eab81e2ac74.js.map