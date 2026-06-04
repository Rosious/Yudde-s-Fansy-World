System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, Prefab, instantiate, Color, UITransform, MainGameFlow, eventBus, GameEvent, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, ShopPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMainGameFlow(extras) {
    _reporterNs.report("MainGameFlow", "./MainGameFlow", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOrderManager(extras) {
    _reporterNs.report("OrderManager", "../systems/order/OrderManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfInventorySystem(extras) {
    _reporterNs.report("InventorySystem", "../systems/inventory/InventorySystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventBus(extras) {
    _reporterNs.report("eventBus", "../core/EventBus", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOrder(extras) {
    _reporterNs.report("Order", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOrderRequirement(extras) {
    _reporterNs.report("OrderRequirement", "../core/types", _context.meta, extras);
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
      Label = _cc.Label;
      Button = _cc.Button;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      MainGameFlow = _unresolved_2.MainGameFlow;
    }, function (_unresolved_3) {
      eventBus = _unresolved_3.eventBus;
    }, function (_unresolved_4) {
      GameEvent = _unresolved_4.GameEvent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cd8f62o9DFBXoFuY0clMHAu", "ShopPanel", undefined); // ============================================================
      // ShopPanel — 店铺订单面板（Cocos Creator 3.x Component）
      //
      // 挂在店铺场景根节点上，负责：
      // - 展示当前活跃订单列表
      // - 显示金币/小红花数量
      // - 订单提交交互
      // ============================================================


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'Prefab', 'instantiate', 'Sprite', 'resources', 'Color', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 店铺订单面板。
       *
       * 交互流程：
       * 1. 玩家进入店铺场景，面板自动生成 4 个随机订单
       * 2. 每个订单卡片显示顾客名、需求材料、奖励
       * 3. 点击"提交"按钮 → 检查库存 → 扣除材料 → 获得奖励
       * 4. 订单完成后刷新列表，经济标签同步更新
       */

      _export("ShopPanel", ShopPanel = (_dec = ccclass('ShopPanel'), _dec2 = property({
        type: Prefab,
        tooltip: '订单卡片预制体'
      }), _dec3 = property({
        type: Node,
        tooltip: '订单列表容器节点'
      }), _dec4 = property({
        type: Label,
        tooltip: '金币数量标签'
      }), _dec5 = property({
        type: Label,
        tooltip: '小红花数量标签'
      }), _dec(_class = (_class2 = class ShopPanel extends Component {
        constructor() {
          super(...arguments);

          // ---- @property 属性（在编辑器中绑定） ----

          /** 订单卡片预制体（需包含 NameLabel、RequirementLabel、RewardLabel、SubmitBtn 子节点） */
          _initializerDefineProperty(this, "orderCardPrefab", _descriptor, this);

          /** 订单列表滚动容器的 content 节点 */
          _initializerDefineProperty(this, "orderListContainer", _descriptor2, this);

          /** 金币数量标签 */
          _initializerDefineProperty(this, "goldLabel", _descriptor3, this);

          /** 小红花数量标签 */
          _initializerDefineProperty(this, "flowerLabel", _descriptor4, this);

          // ---- 私有成员 ----

          /** 订单管理器引用（来自 MainGameFlow 单例） */
          this.orderManager = void 0;

          /** 背包系统引用 */
          this.inventorySystem = void 0;

          // ==========================================================
          // 事件回调
          // ==========================================================

          /**
           * 订单完成事件回调（由 ORDER_COMPLETED 事件触发）。
           * 刷新订单列表以移除已完成的订单。
           */
          this.onOrderCompleted = () => {
            this.refreshOrders();
          };

          this.onGoldChanged = payload => {
            this.updateGoldLabel(payload.newTotal);
          };

          this.onFlowerChanged = payload => {
            this.updateFlowerLabel(payload.newTotal);
          };
        }

        // ==========================================================
        // 生命周期
        // ==========================================================
        start() {
          // 从全局协调器获取系统实例
          var mgf = (_crd && MainGameFlow === void 0 ? (_reportPossibleCrUseOfMainGameFlow({
            error: Error()
          }), MainGameFlow) : MainGameFlow).getInstance();
          this.inventorySystem = mgf.inventorySystem;
          this.orderManager = mgf.orderManager; // 初始化经济标签

          this.updateGoldLabel(0);
          this.updateFlowerLabel(0); // 监听订单完成事件 → 刷新列表

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ORDER_COMPLETED, this.onOrderCompleted); // 监听金币变化事件 → 更新标签

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GOLD_CHANGED, this.onGoldChanged); // 监听小红花变化事件 → 更新标签

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FLOWER_CHANGED, this.onFlowerChanged); // 初次进入：生成 4 个订单

          this.orderManager.generateOrders(4);
          this.refreshOrders();
        }

        onDestroy() {
          // 清理事件监听，防止内存泄漏
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ORDER_COMPLETED, this.onOrderCompleted);
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GOLD_CHANGED, this.onGoldChanged);
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FLOWER_CHANGED, this.onFlowerChanged);
        } // ==========================================================
        // 订单列表刷新
        // ==========================================================

        /**
         * 刷新订单列表。
         *
         * 清空当前列表容器，重新遍历活跃订单并生成卡片。
         * 如果没有活跃订单，列表为空。
         */


        refreshOrders() {
          if (!this.orderListContainer || !this.orderCardPrefab) {
            console.warn('[ShopPanel] orderListContainer 或 orderCardPrefab 未绑定！');
            return;
          } // 清空旧卡片


          this.orderListContainer.removeAllChildren(); // 获取当前活跃订单

          var activeOrders = this.orderManager.getActiveOrders();

          if (activeOrders.length === 0) {
            console.log('[ShopPanel] 当前无活跃订单。');
            return;
          } // 为每个订单创建卡片


          for (var order of activeOrders) {
            this.createOrderCard(order);
          }
        }
        /**
         * 根据订单数据创建一个订单卡片节点，添加到列表容器中。
         *
         * 卡片结构（子节点名约定）：
         * - NameLabel:     顾客名称
         * - RequirementLabel: 需求文本，如 "红线团 x3  纽扣 x2"
         * - RewardLabel:   奖励文本，如 "金币+30  花+4"
         * - SubmitBtn:     提交按钮
         *
         * @param order - 订单数据
         */


        createOrderCard(order) {
          var _cardNode$getChildByN, _cardNode$getChildByN2, _cardNode$getChildByN3;

          var cardNode = instantiate(this.orderCardPrefab);
          cardNode.parent = this.orderListContainer; // ---- 顾客名称 ----

          var nameLabel = (_cardNode$getChildByN = cardNode.getChildByName('NameLabel')) == null ? void 0 : _cardNode$getChildByN.getComponent(Label);

          if (nameLabel) {
            nameLabel.string = order.customerName;
          } // ---- 需求文本 ----


          var reqLabel = (_cardNode$getChildByN2 = cardNode.getChildByName('RequirementLabel')) == null ? void 0 : _cardNode$getChildByN2.getComponent(Label);

          if (reqLabel) {
            reqLabel.string = this.formatRequirements(order.requirements);
          } // ---- 奖励文本 ----


          var rewardLabel = (_cardNode$getChildByN3 = cardNode.getChildByName('RewardLabel')) == null ? void 0 : _cardNode$getChildByN3.getComponent(Label);

          if (rewardLabel) {
            rewardLabel.string = "\u91D1\u5E01+" + order.rewardGold + "  \u82B1+" + order.rewardFlower;
            rewardLabel.color = new Color(255, 215, 0); // 金色
          } // ---- 提交按钮 ----


          var submitNode = this.findChildByName(cardNode, 'SubmitBtn');
          this.bindButtonClick(submitNode, () => {
            this.onSubmitOrder(order.orderId);
          }, 'SubmitBtn');
        }

        bindButtonClick(buttonNode, handler, debugName) {
          if (!buttonNode) {
            console.warn("[ShopPanel] " + debugName + " not found on order card.");
            return;
          }

          var button = this.ensureButton(buttonNode, 140, 44);
          button.node.on(Button.EventType.CLICK, handler, this);
        }

        ensureButton(node, width, height) {
          var _node$getComponent;

          var transform = node.getComponent(UITransform);

          if (!transform) {
            transform = node.addComponent(UITransform);
          }

          var size = transform.contentSize;

          if (!size || size.width <= 0 || size.height <= 0) {
            transform.setContentSize(width, height);
          }

          var button = (_node$getComponent = node.getComponent(Button)) != null ? _node$getComponent : node.addComponent(Button);
          button.interactable = true;
          button.target = node;
          return button;
        }

        findChildByName(root, name) {
          var directChild = root.getChildByName(name);

          if (directChild) {
            return directChild;
          }

          for (var child of root.children) {
            var found = this.findChildByName(child, name);

            if (found) {
              return found;
            }
          }

          return null;
        }
        /**
         * 将需求数组格式化为可读文本。
         *
         * 材料 ID → 中文名映射：
         * LINE → 红线团, BUTTON → 纽扣, SCISSORS → 剪刀, TAPE → 皮尺, SEWING → 缝纫机
         *
         * @param requirements - 订单需求列表
         * @returns 格式化文本，如 "红线团 x3  纽扣 x2"
         */


        formatRequirements(requirements) {
          var nameMap = {
            LINE: '红线团',
            BUTTON: '纽扣',
            SCISSORS: '剪刀',
            TAPE: '皮尺',
            SEWING: '缝纫机'
          };
          return requirements.map(req => {
            var _nameMap$req$itemId;

            return ((_nameMap$req$itemId = nameMap[req.itemId]) != null ? _nameMap$req$itemId : req.itemId) + " x" + req.count;
          }).join('  ');
        } // ==========================================================
        // 订单提交
        // ==========================================================

        /**
         * 提交指定订单。
         *
         * 调用 OrderManager.submitOrder，根据结果弹窗提示：
         * - success → 弹出"完成！"
         * - fail → 弹出"材料不足"（或具体原因）
         *
         * @param orderId - 要提交的订单 ID
         */


        onSubmitOrder(orderId) {
          var result = this.orderManager.submitOrder(orderId);

          if (result.success) {
            console.log("[ShopPanel] \u8BA2\u5355 " + orderId + " \u63D0\u4EA4\u6210\u529F\uFF01");
            this.showToast('完成！');
          } else {
            console.warn("[ShopPanel] \u8BA2\u5355 " + orderId + " \u63D0\u4EA4\u5931\u8D25: " + result.reason);
            this.showToast(result.reason === '订单不存在' ? '订单已失效' : '材料不足');
          }
        }

        // ==========================================================
        // UI 更新
        // ==========================================================

        /** 更新金币标签显示 */
        updateGoldLabel(value) {
          if (this.goldLabel) {
            this.goldLabel.string = "\u91D1\u5E01: " + value;
          }
        }
        /** 更新小红花标签显示 */


        updateFlowerLabel(value) {
          if (this.flowerLabel) {
            this.flowerLabel.string = "\u82B1: " + value;
          }
        } // ==========================================================
        // 简易提示
        // ==========================================================

        /**
         * 弹出简易文字提示（Console 版实现，生产环境可替换为 UI Toast）。
         *
         * @param message - 提示文字
         */


        showToast(message) {
          console.log("[ShopPanel] Toast: " + message); // 生产环境中可替换为：
          // 1. 创建一个 Toast Label 节点
          // 2. 使用 Tween 做淡入淡出动画
          // 3. 动画结束后销毁节点
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "orderCardPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "orderListContainer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "goldLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "flowerLabel", [_dec5], {
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
//# sourceMappingURL=b7b1071246a6a5e01c3c922c6fab0a1d45d8cd0b.js.map