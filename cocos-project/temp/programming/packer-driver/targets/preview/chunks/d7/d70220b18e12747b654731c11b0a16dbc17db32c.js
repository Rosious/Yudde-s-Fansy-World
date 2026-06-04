System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, ElementType, SpecialType, DressPart, StyleTag, GameEvent;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "08e13igWK9GV5ReanT6IzYH", "types", undefined);

      // ============================================================
      // 衣橱物语 — 全局类型定义
      // 所有模块共享的类型，不依赖任何具体实现
      // ============================================================
      // ---- 三消 (Match-3) ----

      /** 棋子类型：线团、纽扣、剪刀、皮尺、缝纫机 */
      _export("ElementType", ElementType = /*#__PURE__*/function (ElementType) {
        ElementType["LINE"] = "LINE";
        ElementType["BUTTON"] = "BUTTON";
        ElementType["SCISSORS"] = "SCISSORS";
        ElementType["TAPE"] = "TAPE";
        ElementType["SEWING"] = "SEWING";
        return ElementType;
      }({}));
      /** 特殊道具（4连/5连生成） */


      _export("SpecialType", SpecialType = /*#__PURE__*/function (SpecialType) {
        SpecialType["NONE"] = "NONE";
        SpecialType["SHUTTLE"] = "SHUTTLE";
        SpecialType["IRON"] = "IRON";
        SpecialType["RAINBOW"] = "RAINBOW";
        return SpecialType;
      }({}));
      /** 单个棋子 */

      /** 一个匹配组（可消除） */

      /** 棋盘配置 */


      // ---- 换装 (Dress-up) ----
      _export("DressPart", DressPart = /*#__PURE__*/function (DressPart) {
        DressPart["HAIR"] = "HAIR";
        DressPart["TOP"] = "TOP";
        DressPart["BOTTOM"] = "BOTTOM";
        DressPart["SHOES"] = "SHOES";
        DressPart["ACCESSORY"] = "ACCESSORY";
        return DressPart;
      }({}));

      _export("StyleTag", StyleTag = /*#__PURE__*/function (StyleTag) {
        StyleTag["SWEET"] = "SWEET";
        StyleTag["RETRO"] = "RETRO";
        StyleTag["CYBER"] = "CYBER";
        StyleTag["CUTE"] = "CUTE";
        return StyleTag;
      }({}));
      /** 一个服装附件 */

      /** 三消被动 Buff */
      // ---- 背包/库存 (Inventory) ----
      // ---- 订单 (Order) ----
      // ---- 存档 (Save) ----


      // ---- 事件（全局事件总线） ----

      /** 事件名常量 */
      _export("GameEvent", GameEvent = {
        // 三消事件
        MATCH_FOUND: 'match:found',
        MATCH_CLEARED: 'match:cleared',
        CELLS_DROPPED: 'cells:dropped',
        GRID_STABLE: 'grid:stable',
        // 库存事件
        ITEM_ADDED: 'item:added',
        ITEM_REMOVED: 'item:removed',
        // 订单事件
        ORDER_CREATED: 'order:created',
        ORDER_SUBMITTED: 'order:submitted',
        ORDER_COMPLETED: 'order:completed',
        // 换装事件
        DRESS_CHANGED: 'dress:changed',
        STYLE_BONUS_CHANGED: 'style:bonus_changed',
        DOLL_MOOD_CHANGED: 'doll:mood_changed',
        // 经济事件
        GOLD_CHANGED: 'gold:changed',
        FLOWER_CHANGED: 'flower:changed',
        // 存档事件
        GAME_SAVED: 'game:saved',
        GAME_LOADED: 'game:loaded'
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d70220b18e12747b654731c11b0a16dbc17db32c.js.map