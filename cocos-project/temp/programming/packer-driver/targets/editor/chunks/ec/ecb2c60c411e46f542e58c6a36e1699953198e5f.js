System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, eventBus, GameEvent, SaveManager, _crd, SAVE_KEY_PREFIX;

  /** 默认初始存档数据 */
  function createDefaultSaveData() {
    return {
      gold: 0,
      flowers: 0,
      inventory: [],
      orders: [],
      currentDress: {},
      dollMood: 0,
      dollAffection: 0,
      matchLevel: 0
    };
  }
  /**
   * 存档管理器。
   *
   * 职责：
   * - 监听全局事件，自动更新内存快照
   * - 将快照写入 JSON 文件（多槽位支持）
   * - 从文件恢复快照并发射 game:loaded 事件
   * - 支持定时自动保存
   *
   * 本系统零 UI 依赖，完全是数据面逻辑。
   */


  function _reportPossibleCrUseOfeventBus(extras) {
    _reporterNs.report("eventBus", "../../core/EventBus", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSaveData(extras) {
    _reporterNs.report("SaveData", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOrder(extras) {
    _reporterNs.report("Order", "../../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDressPart(extras) {
    _reporterNs.report("DressPart", "../../core/types", _context.meta, extras);
  }

  _export("SaveManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      eventBus = _unresolved_2.eventBus;
    }, function (_unresolved_3) {
      GameEvent = _unresolved_3.GameEvent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bceaekXBOtMk5YNKGBFbf5t", "SaveManager", undefined); // ============================================================
      // SaveManager — 事件驱动的存档系统
      //
      // 本模块不主动拉取其他系统的数据，而是通过监听 EventBus
      // 上的事件被动收集状态，维护一份内存 SaveData 快照。
      //
      // save/load 通过文件 I/O 完成持久化，支持多槽位。
      // ============================================================


      __checkObsolete__(['sys']);

      /** 存档文件存放目录 */
      SAVE_KEY_PREFIX = 'wardrobe-story:save:';

      _export("SaveManager", SaveManager = class SaveManager {
        constructor() {
          /** 内存中的存档快照 */
          this.data = void 0;

          /** 自动保存定时器句柄 */
          this.autoSaveTimer = null;

          /** 注册的各事件回调引用，用于测试清理时无需显式调用 */
          this.listeners = [];
          this.data = createDefaultSaveData();
          this.registerListeners();
        } // ---- Public API ----

        /**
         * 立即将当前内存快照保存到文件。
         *
         * @param slot - 存档槽位编号，默认 0
         */


        save(slot = 0) {
          this.ensureSaveDir();
          const filePath = this.slotPath(slot);
          const json = JSON.stringify(this.data, null, 2);
          sys.localStorage.setItem(filePath, json);
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_SAVED);
        }
        /**
         * 从文件加载存档，返回解析后的 SaveData。
         *
         * @param slot - 存档槽位编号，默认 0
         * @returns 解析后的 SaveData，若文件不存在或格式错误则返回 null
         */


        load(slot = 0) {
          const filePath = this.slotPath(slot);
          const raw = sys.localStorage.getItem(filePath);

          if (!raw) {
            return null;
          }

          try {
            const parsed = JSON.parse(raw);
            (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
              error: Error()
            }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).GAME_LOADED, parsed);
            return parsed;
          } catch {
            return null;
          }
        }
        /**
         * 启动自动保存，每隔指定毫秒自动调用 save()。
         *
         * 若已有运行中的定时器，会先停止旧的再启动新的。
         *
         * @param intervalMs - 保存间隔（毫秒）
         */


        startAutoSave(intervalMs) {
          this.stopAutoSave();
          this.autoSaveTimer = setInterval(() => {
            this.save();
          }, intervalMs);
        }
        /**
         * 停止自动保存，清除定时器。
         */


        stopAutoSave() {
          if (this.autoSaveTimer !== null) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
          }
        }
        /**
         * 获取当前内存状态快照的深拷贝。
         *
         * @returns 当前 SaveData 副本
         */


        getSnapshot() {
          return JSON.parse(JSON.stringify(this.data));
        }
        /**
         * 从外部 SaveData 恢复状态（例如加载存档后调用）。
         *
         * 会用传入数据完全覆盖当前内存快照，并发射 game:loaded 事件。
         *
         * @param data - 要恢复的存档数据
         */


        restore(data) {
          this.data = JSON.parse(JSON.stringify(data));
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_LOADED, this.getSnapshot());
        } // ---- Private ----

        /** 确保存档目录存在 */


        ensureSaveDir() {// localStorage needs no directory preparation.
        }
        /** 返回指定槽位的文件路径 */


        slotPath(slot) {
          return `${SAVE_KEY_PREFIX}${slot}`;
        }
        /**
         * 注册所有需要监听的事件。
         *
         * 每个事件回调直接修改 this.data，实现被动数据收集。
         */


        registerListeners() {
          // 金币变动
          this.on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GOLD_CHANGED, payload => {
            this.data.gold = payload.newTotal;
          }); // 花朵变动

          this.on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FLOWER_CHANGED, payload => {
            this.data.flowers = payload.newTotal;
          }); // 物品添加

          this.on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_ADDED, payload => {
            this.upsertInventoryItem(payload.itemId, payload.newTotal);
          }); // 物品移除

          this.on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_REMOVED, payload => {
            this.upsertInventoryItem(payload.itemId, payload.newTotal);
          }); // 订单创建

          this.on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ORDER_CREATED, order => {
            this.data.orders.push(order);
          }); // 换装变更

          this.on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).DRESS_CHANGED, payload => {
            this.data.currentDress[payload.part] = payload.attachmentId;
          });
        }
        /**
         * 更新或删除库存中的某个物品。
         *
         * @param itemId - 物品 ID
         * @param newTotal - 经过变动后的最新数量
         */


        upsertInventoryItem(itemId, newTotal) {
          const index = this.data.inventory.findIndex(item => item.itemId === itemId);

          if (newTotal <= 0) {
            // 数量归零：从列表中移除
            if (index !== -1) {
              this.data.inventory.splice(index, 1);
            }
          } else {
            if (index !== -1) {
              this.data.inventory[index].count = newTotal;
            } else {
              this.data.inventory.push({
                itemId,
                count: newTotal
              });
            }
          }
        }
        /**
         * 便捷注册带引用追踪的事件监听。
         */


        on(event, fn) {
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).on(event, fn);
          this.listeners.push({
            event,
            fn
          });
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ecb2c60c411e46f542e58c6a36e1699953198e5f.js.map