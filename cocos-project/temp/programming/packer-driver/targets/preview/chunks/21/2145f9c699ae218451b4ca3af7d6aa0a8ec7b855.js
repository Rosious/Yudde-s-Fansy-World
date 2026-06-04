System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, eventBus, GameEvent, OrderManager, _crd, MATERIAL_POOL, CUSTOMER_NAMES, CUSTOMER_AVATARS;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _reportPossibleCrUseOfeventBus(extras) {
    _reporterNs.report("eventBus", "../../core/EventBus", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOrder(extras) {
    _reporterNs.report("Order", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOrderRequirement(extras) {
    _reporterNs.report("OrderRequirement", "../../core/types", _context.meta, extras);
  }

  _export("OrderManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      eventBus = _unresolved_2.eventBus;
    }, function (_unresolved_3) {
      GameEvent = _unresolved_3.GameEvent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e8452Ucxj9A1qyLiytt8DaS", "OrderManager", undefined); // ============================================================
      // OrderManager — 订单经营系统
      //
      // 管理订单生成、提交、取消，以及金币/小红花累计。
      // 依赖 InventorySystem 进行库存校验与扣除。
      // 所有跨模块通信通过 eventBus 事件发射完成。
      // ============================================================


      /** 材料池：随机抽取 */
      MATERIAL_POOL = ['LINE', 'BUTTON', 'SCISSORS', 'TAPE', 'SEWING'];
      /** 顾客名池 */

      CUSTOMER_NAMES = ['小红', '小美', '阿花', '莉莉', '娜娜', '思思', '小云', '阿紫', '小樱', '小倩'];
      /** 头像资源池 */

      CUSTOMER_AVATARS = ['avatar/customer_01', 'avatar/customer_02', 'avatar/customer_03', 'avatar/customer_04', 'avatar/customer_05'];
      /** 待注入的库存接口（避免循环引用） */

      /**
       * 订单管理器。
       *
       * 负责：
       * - 随机生成订单（需求、奖励、顾客）
       * - 提交订单（校验库存 → 扣除 → 发放奖励）
       * - 取消订单
       * - 序列化/反序列化
       *
       * 最多同时存在 5 个活跃订单。
       */
      _export("OrderManager", OrderManager = class OrderManager {
        /**
         * @param inventory - 背包系统实例（依赖注入）
         */
        constructor(inventory) {
          /** 背包引用 */
          this.inventory = void 0;

          /** 所有订单（包括已完成/已取消），orderId → Order */
          this.orders = new Map();

          /** 订单 ID 自增计数器 */
          this.idCounter = 0;

          /** 累计金币收入 */
          this.totalGoldEarned = 0;

          /** 累计小红花收入 */
          this.totalFlowerEarned = 0;
          this.inventory = inventory;
        }
        /**
         * 随机生成 N 个订单。
         *
         * 订单受以下规则约束：
         * - 每个订单 1-3 个材料需求，来自预设材料池
         * - 每个需求数量 1-5
         * - 奖励金币 = 总需求数量 × 10
         * - 奖励小红花 = 需求种类数 × 2
         * - 最多同时存在 {@link MAX_ACTIVE_ORDERS} 个活跃订单
         *
         * 每生成一个订单，发射 `order:created` 事件。
         *
         * @param count - 期望生成数量（可能被上限截断）
         * @returns 实际新生成的订单列表
         */


        generateOrders(count) {
          var currentActive = this.getActiveOrders().length;
          var available = Math.max(0, OrderManager.MAX_ACTIVE_ORDERS - currentActive);
          var toGenerate = Math.min(count, available);
          var generated = [];

          for (var i = 0; i < toGenerate; i++) {
            var order = this.createRandomOrder();
            this.orders.set(order.orderId, order);
            generated.push(order);
            (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
              error: Error()
            }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).ORDER_CREATED, {
              order: _extends({}, order)
            });
          }

          return generated;
        }
        /**
         * 提交订单。
         *
         * 流程：校验库存 → 发射 order:submitted → 逐项扣除 → 标记完成 →
         *       发射 order:completed → 发射 gold:changed → 发射 flower:changed
         *
         * 任何一步库存不足都不会扣除物品（原子性保证）。
         *
         * @param orderId - 订单 ID
         * @returns 是否成功及失败原因
         */


        submitOrder(orderId) {
          var order = this.orders.get(orderId);

          if (!order) {
            return {
              success: false,
              reason: '订单不存在'
            };
          }

          if (order.status !== 'pending') {
            return {
              success: false,
              reason: '订单状态不允许提交'
            };
          } // 1. 逐项校验库存


          for (var req of order.requirements) {
            if (!this.inventory.hasItem(req.itemId, req.count)) {
              return {
                success: false,
                reason: req.itemId + "\u4E0D\u8DB3"
              };
            }
          } // 2. 发射 order:submitted（手作小游戏时机）


          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ORDER_SUBMITTED, {
            order: _extends({}, order)
          }); // 3. 逐项扣除库存

          for (var _req of order.requirements) {
            this.inventory.removeItem(_req.itemId, _req.count);
          } // 4. 标记完成


          order.status = 'completed'; // 5. 累计并发射奖励事件

          this.totalGoldEarned += order.rewardGold;
          this.totalFlowerEarned += order.rewardFlower; // 6. 发射 order:completed

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ORDER_COMPLETED, {
            order: _extends({}, order),
            rewardGold: order.rewardGold,
            rewardFlower: order.rewardFlower
          }); // 7. 发射经济事件

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GOLD_CHANGED, {
            amount: order.rewardGold,
            newTotal: this.totalGoldEarned
          });
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FLOWER_CHANGED, {
            amount: order.rewardFlower,
            newTotal: this.totalFlowerEarned
          });
          return {
            success: true
          };
        }
        /**
         * 获取所有活跃订单（状态为 pending 或 in_progress）。
         *
         * @returns 活跃订单列表
         */


        getActiveOrders() {
          var active = [];

          for (var order of this.orders.values()) {
            if (order.status === 'pending' || order.status === 'in_progress') {
              active.push(order);
            }
          }

          return active;
        }
        /**
         * 取消一个 pending 状态的订单。
         *
         * 已完成的订单不可取消。
         *
         * @param orderId - 订单 ID
         * @returns 是否成功取消
         */


        cancelOrder(orderId) {
          var order = this.orders.get(orderId);
          if (!order) return false;
          if (order.status !== 'pending') return false;
          order.status = 'expired';
          return true;
        }
        /**
         * 序列化所有订单为纯数据数组。
         *
         * @returns 订单数据数组
         */


        toJSON() {
          var result = [];

          for (var order of this.orders.values()) {
            result.push(_extends({}, order));
          }

          return result;
        }
        /**
         * 从纯数据数组反序列化，覆盖当前全部订单状态。
         *
         * @param orders - 订单数据数组
         */


        fromJSON(orders) {
          this.orders.clear(); // 重建 ID 计数器

          var maxId = 0;

          for (var order of orders) {
            this.orders.set(order.orderId, _extends({}, order)); // 从 orderId 中解析数字 ID

            var match = order.orderId.match(/^order_(\d+)$/);

            if (match) {
              var num = parseInt(match[1], 10);
              if (num > maxId) maxId = num;
            }
          }

          this.idCounter = maxId;
        }
        /**
         * 获取累计金币收入。
         *
         * @returns 金币累计
         */


        getTotalGoldEarned() {
          return this.totalGoldEarned;
        }
        /**
         * 获取累计小红花收入。
         *
         * @returns 小红花累计
         */


        getTotalFlowerEarned() {
          return this.totalFlowerEarned;
        } // ---- 内部方法 ----

        /**
         * 生成一个随机订单。
         */


        createRandomOrder() {
          var reqCount = this.randomInt(1, 3); // 生成需求（确保不重复类型）

          var shuffled = [...MATERIAL_POOL].sort(() => Math.random() - 0.5);
          var selectedMaterials = shuffled.slice(0, reqCount);
          var requirements = selectedMaterials.map(itemId => ({
            itemId,
            count: this.randomInt(1, 5)
          }));
          var totalCount = requirements.reduce((sum, r) => sum + r.count, 0);
          var distinctTypes = new Set(requirements.map(r => r.itemId)).size;
          var orderId = "order_" + ++this.idCounter;
          var customerName = CUSTOMER_NAMES[this.randomInt(0, CUSTOMER_NAMES.length - 1)];
          var customerAvatar = CUSTOMER_AVATARS[this.randomInt(0, CUSTOMER_AVATARS.length - 1)];
          return {
            orderId,
            customerName,
            customerAvatar,
            requirements,
            rewardGold: totalCount * 10,
            rewardFlower: distinctTypes * 2,
            status: 'pending'
          };
        }
        /**
         * 生成 [min, max] 范围内的随机整数。
         */


        randomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

      });

      /** 最多活跃订单数 */
      OrderManager.MAX_ACTIVE_ORDERS = 5;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2145f9c699ae218451b4ca3af7d6aa0a8ec7b855.js.map