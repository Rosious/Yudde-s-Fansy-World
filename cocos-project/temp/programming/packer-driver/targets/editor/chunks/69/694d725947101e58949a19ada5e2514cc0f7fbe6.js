System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, EventBus, _crd, eventBus;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6dee3ec3hZGmJWlqxvzMbuA", "EventBus", undefined); // ============================================================
      // 全局事件总线 — 模块间唯一通信通道
      //
      // 架构铁律：模块之间严禁直接引用。所有跨模块通信
      // 必须通过 EventBus，发送方 emit，接收方 on/once。
      //
      // 例如：
      //   Match3Engine 消除后 → EventBus.emit(GameEvent.MATCH_CLEARED, payload)
      //   InventorySystem 监听 → EventBus.on(GameEvent.MATCH_CLEARED, handler)
      // ============================================================


      EventBus = class EventBus {
        constructor() {
          this.listeners = new Map();
        }

        /** 订阅事件 */
        on(event, listener) {
          if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
          }

          this.listeners.get(event).add(listener);
        }
        /** 订阅一次（触发后自动取消） */


        once(event, listener) {
          const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
          };

          this.on(event, wrapper);
        }
        /** 取消订阅 */


        off(event, listener) {
          var _this$listeners$get;

          (_this$listeners$get = this.listeners.get(event)) == null || _this$listeners$get.delete(listener);
        }
        /** 发射事件 */


        emit(event, ...args) {
          const set = this.listeners.get(event);
          if (!set) return; // 复制一份再遍历，防止回调中修改 set

          for (const listener of [...set]) {
            try {
              listener(...args);
            } catch (e) {
              console.error(`[EventBus] Error in listener for "${event}":`, e);
            }
          }
        }
        /** 清空所有监听（仅用于测试重置） */


        reset() {
          this.listeners.clear();
        }
        /** 调试：列出所有事件及其监听数 */


        debug() {
          const lines = [];

          for (const [event, set] of this.listeners) {
            lines.push(`  ${event}: ${set.size} listener(s)`);
          }

          return lines.length ? lines.join('\n') : '  (empty)';
        }

      }; // 全局单例

      _export("eventBus", eventBus = new EventBus());

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=694d725947101e58949a19ada5e2514cc0f7fbe6.js.map