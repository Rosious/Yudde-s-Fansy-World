System.register(
  "chunks:///_virtual/CellComponent.ts",
  ["./rollupPluginModLoBabelHelpers.js", "cc"],
  function (t) {
    var e, n, o, i, r, l, s, c, a, p;
    return {
      setters: [
        function (t) {
          ((e = t.applyDecoratedDescriptor),
            (n = t.inheritsLoose),
            (o = t.initializerDefineProperty),
            (i = t.assertThisInitialized));
        },
        function (t) {
          ((r = t.cclegacy),
            (l = t._decorator),
            (s = t.Sprite),
            (c = t.Button),
            (a = t.UITransform),
            (p = t.Component));
        },
      ],
      execute: function () {
        var u, h, C, d, f;
        r._RF.push({}, "f8eefyOtMZE95iNOmmviVJ3", "CellComponent", void 0);
        var m = l.ccclass,
          v = l.property;
        t(
          "CellComponent",
          ((u = m("CellComponent")),
          (h = v({ type: s, tooltip: "棋子精灵组件" })),
          u(
            ((f = e(
              (d = (function (t) {
                function e() {
                  for (
                    var e, n = arguments.length, r = new Array(n), l = 0;
                    l < n;
                    l++
                  )
                    r[l] = arguments[l];
                  return (
                    (e = t.call.apply(t, [this].concat(r)) || this),
                    o(e, "sprite", f, i(e)),
                    (e.row = 0),
                    (e.col = 0),
                    e
                  );
                }
                n(e, t);
                var r = e.prototype;
                return (
                  (r.onLoad = function () {
                    (this.ensureClickable(),
                      this.node.off(
                        c.EventType.CLICK,
                        this.onButtonClick,
                        this,
                      ),
                      this.node.on(
                        c.EventType.CLICK,
                        this.onButtonClick,
                        this,
                      ));
                  }),
                  (r.onDestroy = function () {
                    this.node.off(c.EventType.CLICK, this.onButtonClick, this);
                  }),
                  (r.setup = function (t, e, n) {
                    ((this.row = t),
                      (this.col = e),
                      (this.node.name = "Cell_" + t + "_" + e + "_" + n));
                  }),
                  (r.ensureClickable = function () {
                    var t,
                      e = this.node.getComponent(a);
                    e || (e = this.node.addComponent(a));
                    var n = e.contentSize;
                    (!n || n.width <= 0 || n.height <= 0) &&
                      e.setContentSize(80, 80);
                    var o =
                      null != (t = this.node.getComponent(c))
                        ? t
                        : this.node.addComponent(c);
                    ((o.interactable = !0), (o.target = this.node));
                  }),
                  (r.onButtonClick = function () {
                    var t,
                      e =
                        null == (t = this.node.parent)
                          ? void 0
                          : t.getComponent("Match3GridComponent");
                    e && e.onCellClicked(this.row, this.col);
                  }),
                  e
                );
              })(p)).prototype,
              "sprite",
              [h],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                },
              },
            )),
            (C = d)),
          ) || C),
        );
        r._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/DressRoomPanel.ts",
  [
    "./rollupPluginModLoBabelHelpers.js",
    "cc",
    "./MainGameFlow.ts",
    "./EventBus.ts",
    "./index7.ts",
  ],
  function (t) {
    var e, a, r, n, i, o, s, l, c, u, h, f, p, m, d, C, b, v, S, y, E, T, _;
    return {
      setters: [
        function (t) {
          ((e = t.applyDecoratedDescriptor),
            (a = t.inheritsLoose),
            (r = t.createForOfIteratorHelperLoose),
            (n = t.initializerDefineProperty),
            (i = t.assertThisInitialized));
        },
        function (t) {
          ((o = t.cclegacy),
            (s = t._decorator),
            (l = t.Sprite),
            (c = t.Node),
            (u = t.Prefab),
            (h = t.Label),
            (f = t.Color),
            (p = t.instantiate),
            (m = t.UITransform),
            (d = t.Button),
            (C = t.resources),
            (b = t.SpriteFrame),
            (v = t.Component));
        },
        function (t) {
          S = t.MainGameFlow;
        },
        function (t) {
          y = t.eventBus;
        },
        function (t) {
          ((E = t.DressPart), (T = t.GameEvent), (_ = t.StyleTag));
        },
      ],
      execute: function () {
        var O, g, R, B, N, w, P, A, I, D, H, M, L, U, Y;
        o._RF.push({}, "d61a6Ss2DJNU6U3xahbzYKh", "DressRoomPanel", void 0);
        var z = s.ccclass,
          F = s.property;
        t(
          "DressRoomPanel",
          ((O = z("DressRoomPanel")),
          (g = F({ type: l, tooltip: "娃预览图 Sprite" })),
          (R = F({ type: c, tooltip: "部位 Tab 容器节点" })),
          (B = F({ type: c, tooltip: "服装列表容器节点" })),
          (N = F({
            type: u,
            tooltip: "服装列表项预制体（含 Label、Sprite、Button）",
          })),
          (w = F({ type: h, tooltip: "风格计分标签" })),
          (P = F({ type: h, tooltip: "Buff 效果标签" })),
          O(
            ((D = e(
              (I = (function (t) {
                function e() {
                  for (
                    var e, a = arguments.length, r = new Array(a), o = 0;
                    o < a;
                    o++
                  )
                    r[o] = arguments[o];
                  return (
                    (e = t.call.apply(t, [this].concat(r)) || this),
                    n(e, "dollPreview", D, i(e)),
                    n(e, "tabContainer", H, i(e)),
                    n(e, "itemListContainer", M, i(e)),
                    n(e, "itemPrefab", L, i(e)),
                    n(e, "styleScoreLabel", U, i(e)),
                    n(e, "buffLabel", Y, i(e)),
                    (e.dressUpManager = void 0),
                    (e.currentPart = E.HAIR),
                    (e.catalog = []),
                    (e.onDressChanged = function () {
                      (e.refreshDollPreview(), e.refreshBuffDisplay());
                    }),
                    e
                  );
                }
                a(e, t);
                var o = e.prototype;
                return (
                  (o.start = function () {
                    var t = S.getInstance();
                    ((this.dressUpManager = t.dressUpManager),
                      this.ensureFallbackUi(),
                      this.initCatalog(),
                      this.initTabs(),
                      this.switchTab(E.HAIR),
                      y.on(T.DRESS_CHANGED, this.onDressChanged),
                      this.refreshDollPreview(),
                      this.refreshBuffDisplay());
                  }),
                  (o.onDestroy = function () {
                    y.off(T.DRESS_CHANGED, this.onDressChanged);
                  }),
                  (o.initCatalog = function () {
                    this.catalog = [
                      {
                        id: "hair_01",
                        part: E.HAIR,
                        slotName: "hair",
                        attachmentName: "hair_sweet_pink",
                        style: _.SWEET,
                        matchBuff: { type: "COIN_BONUS", value: 10 },
                      },
                      {
                        id: "hair_02",
                        part: E.HAIR,
                        slotName: "hair",
                        attachmentName: "hair_cyber_neon",
                        style: _.CYBER,
                      },
                      {
                        id: "hair_03",
                        part: E.HAIR,
                        slotName: "hair",
                        attachmentName: "hair_retro_curl",
                        style: _.RETRO,
                      },
                      {
                        id: "top_01",
                        part: E.TOP,
                        slotName: "top",
                        attachmentName: "top_sweet_lace",
                        style: _.SWEET,
                        matchBuff: { type: "START_BOMB", value: 1 },
                      },
                      {
                        id: "top_02",
                        part: E.TOP,
                        slotName: "top",
                        attachmentName: "top_cute_hoodie",
                        style: _.CUTE,
                        matchBuff: { type: "COIN_BONUS", value: 15 },
                      },
                      {
                        id: "top_03",
                        part: E.TOP,
                        slotName: "top",
                        attachmentName: "top_cyber_jacket",
                        style: _.CYBER,
                        isFullDress: !1,
                      },
                      {
                        id: "bottom_01",
                        part: E.BOTTOM,
                        slotName: "bottom",
                        attachmentName: "bottom_sweet_skirt",
                        style: _.SWEET,
                      },
                      {
                        id: "bottom_02",
                        part: E.BOTTOM,
                        slotName: "bottom",
                        attachmentName: "bottom_retro_pants",
                        style: _.RETRO,
                        matchBuff: { type: "EXTRA_MOVE", value: 3 },
                      },
                      {
                        id: "bottom_03",
                        part: E.BOTTOM,
                        slotName: "bottom",
                        attachmentName: "bottom_cute_shorts",
                        style: _.CUTE,
                      },
                      {
                        id: "shoes_01",
                        part: E.SHOES,
                        slotName: "shoes",
                        attachmentName: "shoes_sweet_maryjane",
                        style: _.SWEET,
                      },
                      {
                        id: "shoes_02",
                        part: E.SHOES,
                        slotName: "shoes",
                        attachmentName: "shoes_cyber_boots",
                        style: _.CYBER,
                        matchBuff: { type: "COIN_BONUS", value: 5 },
                      },
                      {
                        id: "shoes_03",
                        part: E.SHOES,
                        slotName: "shoes",
                        attachmentName: "shoes_retro_heels",
                        style: _.RETRO,
                      },
                      {
                        id: "acc_01",
                        part: E.ACCESSORY,
                        slotName: "accessory",
                        attachmentName: "acc_sweet_bow",
                        style: _.SWEET,
                      },
                      {
                        id: "acc_02",
                        part: E.ACCESSORY,
                        slotName: "accessory",
                        attachmentName: "acc_cute_cat_ears",
                        style: _.CUTE,
                        matchBuff: { type: "EXTRA_MOVE", value: 2 },
                      },
                      {
                        id: "acc_03",
                        part: E.ACCESSORY,
                        slotName: "accessory",
                        attachmentName: "acc_cyber_goggles",
                        style: _.CYBER,
                      },
                    ];
                  }),
                  (o.initTabs = function () {
                    var t = this;
                    if (this.tabContainer)
                      for (
                        var e,
                          a = {
                            HAIR: E.HAIR,
                            TOP: E.TOP,
                            BOTTOM: E.BOTTOM,
                            SHOES: E.SHOES,
                            ACCESSORY: E.ACCESSORY,
                          },
                          n = function () {
                            var r = e.value,
                              n = a[r.name];
                            if (!n) return 1;
                            t.ensureButton(r, 120, 44).node.on(
                              d.EventType.CLICK,
                              function () {
                                t.switchTab(n);
                              },
                              t,
                            );
                          },
                          i = r(this.tabContainer.children);
                        !(e = i()).done;
                      )
                        n();
                  }),
                  (o.switchTab = function (t) {
                    ((this.currentPart = t),
                      this.updateTabHighlight(t),
                      this.itemListContainer &&
                        this.itemListContainer.removeAllChildren());
                    for (
                      var e,
                        a = this.catalog.filter(function (e) {
                          return e.part === t;
                        }),
                        n = r(a);
                      !(e = n()).done;
                    ) {
                      var i = e.value;
                      this.createItemButton(i);
                    }
                  }),
                  (o.updateTabHighlight = function (t) {
                    if (this.tabContainer)
                      for (
                        var e,
                          a = {
                            HAIR: E.HAIR,
                            TOP: E.TOP,
                            BOTTOM: E.BOTTOM,
                            SHOES: E.SHOES,
                            ACCESSORY: E.ACCESSORY,
                          },
                          n = r(this.tabContainer.children);
                        !(e = n()).done;
                      ) {
                        var i = e.value,
                          o = a[i.name];
                        if (o) {
                          var s = i.getComponentInChildren(h);
                          s &&
                            (s.color =
                              o === t
                                ? new f(255, 255, 255)
                                : new f(120, 120, 120));
                        }
                      }
                  }),
                  (o.createItemButton = function (t) {
                    var e = this;
                    if (this.itemListContainer) {
                      var a;
                      if (this.itemPrefab) a = p(this.itemPrefab);
                      else {
                        (a = new c("Item_" + t.id))
                          .addComponent(m)
                          .setContentSize(220, 48);
                        var r = a.addComponent(h);
                        ((r.string = t.id + " [" + t.style + "]"),
                          (r.fontSize = 20),
                          (r.color = new f(255, 255, 255)));
                      }
                      a.parent = this.itemListContainer;
                      if (!this.itemPrefab && a.setPosition) {
                        var l = this.itemListContainer.children.length - 1;
                        a.setPosition(
                          -120 + 240 * (l % 2),
                          110 - 58 * Math.floor(l / 2),
                          0,
                        );
                      }
                      var n = a.getComponentInChildren(h);
                      if (n) {
                        var i,
                          o =
                            null !=
                            (i = {
                              SWEET: "甜美",
                              RETRO: "复古",
                              CYBER: "赛博",
                              CUTE: "可爱",
                            }[t.style])
                              ? i
                              : t.style;
                        ((n.string = t.id + " [" + o + "]"),
                          t.matchBuff && (n.string += " ★B"));
                      }
                      this.getOrCreateButton(a, 220, 48).node.on(
                        d.EventType.CLICK,
                        function () {
                          e.onItemClick(t);
                        },
                        this,
                      );
                    }
                  }),
                  (o.ensureFallbackUi = function () {
                    (this.ensureTabContainer(),
                      this.ensureItemListContainer(),
                      this.styleScoreLabel ||
                        (this.styleScoreLabel = this.createFallbackLabel(
                          this.node,
                          "FallbackStyleScoreLabel",
                          "Style: 0",
                          -145,
                          -190,
                          18,
                          new f(255, 220, 120),
                          260,
                        )),
                      this.buffLabel ||
                        (this.buffLabel = this.createFallbackLabel(
                          this.node,
                          "FallbackBuffLabel",
                          "Buff: none",
                          145,
                          -190,
                          18,
                          new f(180, 230, 255),
                          260,
                        )));
                  }),
                  (o.ensureTabContainer = function () {
                    if (!this.tabContainer) {
                      var t = new c("FallbackDressTabs");
                      ((t.parent = this.node),
                        t.addComponent(m).setContentSize(580, 46),
                        t.setPosition && t.setPosition(0, 170, 0),
                        (this.tabContainer = t));
                      for (
                        var e = [
                            ["HAIR", "Hair"],
                            ["TOP", "Top"],
                            ["BOTTOM", "Bottom"],
                            ["SHOES", "Shoes"],
                            ["ACCESSORY", "Acc"],
                          ],
                          a = 0;
                        a < e.length;
                        a++
                      ) {
                        var r = new c(e[a][0]);
                        ((r.parent = t),
                          r.addComponent(m).setContentSize(104, 40),
                          r.setPosition &&
                            r.setPosition(-220 + 110 * a, 0, 0));
                        var n = r.addComponent(h);
                        ((n.string = e[a][1]),
                          (n.fontSize = 18),
                          (n.color = new f(180, 180, 180)),
                          this.ensureButton(r, 104, 40));
                      }
                    }
                    return this.tabContainer;
                  }),
                  (o.ensureItemListContainer = function () {
                    if (!this.itemListContainer) {
                      var t = new c("FallbackDressItems");
                      ((t.parent = this.node),
                        t.addComponent(m).setContentSize(500, 300),
                        t.setPosition && t.setPosition(0, 15, 0),
                        (this.itemListContainer = t));
                    }
                    return this.itemListContainer;
                  }),
                  (o.createFallbackLabel = function (t, e, a, r, n, i, o, s) {
                    var l = new c(e);
                    ((l.parent = t),
                      l.addComponent(m).setContentSize(null != s ? s : 260, 28),
                      l.setPosition && l.setPosition(r, n, 0));
                    var d = l.addComponent(h);
                    return (
                      (d.string = a),
                      (d.fontSize = i),
                      (d.color = o),
                      d
                    );
                  }),
                  (o.ensureButton = function (t, e, a) {
                    var r,
                      n = t.getComponent(m);
                    n || (n = t.addComponent(m));
                    var i = n.contentSize;
                    (!i || i.width <= 0 || i.height <= 0) &&
                      n.setContentSize(e, a);
                    var o =
                      null != (r = t.getComponent(d)) ? r : t.addComponent(d);
                    return ((o.interactable = !0), (o.target = t), o);
                  }),
                  (o.getOrCreateButton = function (t, e, a) {
                    var r,
                      n =
                        null != (r = t.getComponent(d))
                          ? r
                          : t.getComponentInChildren(d);
                    return n
                      ? (this.ensureButton(n.node, e, a), n)
                      : this.ensureButton(t, e, a);
                  }),
                  (o.onItemClick = function (t) {
                    var e = this.dressUpManager.changeEquipment(t.part, t);
                    e.success &&
                      (console.log("[DressRoomPanel] 换装成功: " + t.id),
                      e.replaced &&
                        console.log(
                          "[DressRoomPanel]   替换了旧装: " + e.replaced.id,
                        ));
                  }),
                  (o.refreshDollPreview = function () {
                    var t = this;
                    if (this.dollPreview) {
                      for (
                        var e = this.dressUpManager.getCurrentDress(),
                          a = [E.SHOES, E.BOTTOM, E.TOP, E.ACCESSORY, E.HAIR],
                          r = a.length - 1;
                        r >= 0;
                        r--
                      ) {
                        var n = e[a[r]];
                        if (n) {
                          var i = "dress_preview/" + n.id;
                          return void C.load(i, b, function (e, a) {
                            !e &&
                              a &&
                              t.dollPreview &&
                              (t.dollPreview.spriteFrame = a);
                          });
                        }
                      }
                      C.load("dress_preview/default", b, function (e, a) {
                        !e &&
                          a &&
                          t.dollPreview &&
                          (t.dollPreview.spriteFrame = a);
                      });
                    }
                  }),
                  (o.refreshBuffDisplay = function () {
                    var t = this;
                    if (this.buffLabel) {
                      var e = this.dressUpManager.getActiveBuffs();
                      if (0 === e.length) this.buffLabel.string = "当前无 Buff";
                      else {
                        var a = {
                            COIN_BONUS: "金币加成",
                            START_BOMB: "开局炸弹",
                            EXTRA_MOVE: "额外步数",
                          },
                          r = e.map(function (t) {
                            var e;
                            return (
                              (null != (e = a[t.type]) ? e : t.type) +
                              ": +" +
                              t.value
                            );
                          });
                        this.buffLabel.string = "Buff: " + r.join(" | ");
                      }
                    }
                    if (this.styleScoreLabel) {
                      var n = [_.SWEET, _.RETRO, _.CYBER, _.CUTE],
                        i = {
                          SWEET: "甜美",
                          RETRO: "复古",
                          CYBER: "赛博",
                          CUTE: "可爱",
                        },
                        o = n.map(function (e) {
                          var a = t.dressUpManager.getStyleScore(e);
                          return i[e] + ": " + a;
                        });
                      this.styleScoreLabel.string =
                        "风格计分: " + o.join(" | ");
                    }
                  }),
                  e
                );
              })(v)).prototype,
              "dollPreview",
              [g],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                },
              },
            )),
            (H = e(I.prototype, "tabContainer", [R], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (M = e(I.prototype, "itemListContainer", [B], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (L = e(I.prototype, "itemPrefab", [N], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (U = e(I.prototype, "styleScoreLabel", [w], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (Y = e(I.prototype, "buffLabel", [P], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (A = I)),
          ) || A),
        );
        o._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/DressUpManager.ts",
  ["./rollupPluginModLoBabelHelpers.js", "cc", "./index7.ts", "./EventBus.ts"],
  function (e) {
    var t, r, s, n, i, u;
    return {
      setters: [
        function (e) {
          ((t = e.extends), (r = e.createForOfIteratorHelperLoose));
        },
        function (e) {
          s = e.cclegacy;
        },
        function (e) {
          ((n = e.DressPart), (i = e.GameEvent));
        },
        function (e) {
          u = e.eventBus;
        },
      ],
      execute: function () {
        s._RF.push({}, "5c0db948M5GFbhd46E3tFla", "DressUpManager", void 0);
        e(
          "DressUpManager",
          (function () {
            function e() {
              this.dress = {};
            }
            var s = e.prototype;
            return (
              (s.changeEquipment = function (e, r) {
                var s = this.dress[e];
                ((this.dress[e] = r), e === n.TOP) &&
                  r.isFullDress &&
                  delete this.dress[n.BOTTOM];
                return (
                  u.emit(i.DRESS_CHANGED, { part: e, attachment: r }),
                  this.emitBuffChanged(),
                  t({ success: !0 }, s ? { replaced: s } : {})
                );
              }),
              (s.removeEquipment = function (e) {
                (delete this.dress[e],
                  u.emit(i.DRESS_CHANGED, { part: e, attachment: void 0 }),
                  this.emitBuffChanged());
              }),
              (s.getCurrentDress = function () {
                return t({}, this.dress);
              }),
              (s.getStyleScore = function (e) {
                for (
                  var t = 0, r = 0, s = Object.values(this.dress);
                  r < s.length;
                  r++
                ) {
                  var n = s[r];
                  n && n.style === e && (t += 1);
                }
                return t;
              }),
              (s.getActiveBuffs = function () {
                for (
                  var e = new Map(), t = 0, r = Object.values(this.dress);
                  t < r.length;
                  t++
                ) {
                  var s = r[t];
                  if (s && s.matchBuff) {
                    var n = s.matchBuff,
                      i = n.type,
                      u = n.value,
                      a = e.get(i);
                    (void 0 === a || u > a) && e.set(i, u);
                  }
                }
                return Array.from(e.entries()).map(function (e) {
                  return { type: e[0], value: e[1] };
                });
              }),
              (s.toJSON = function () {
                for (
                  var e = {}, t = 0, r = Object.entries(this.dress);
                  t < r.length;
                  t++
                ) {
                  var s = r[t],
                    n = s[0],
                    i = s[1];
                  i && (e[n] = i.id);
                }
                return e;
              }),
              (s.fromJSON = function (e, t) {
                for (var s, n = new Map(), i = r(t); !(s = i()).done; ) {
                  var u = s.value;
                  n.set(u.id, u);
                }
                this.dress = {};
                for (var a = 0, f = Object.entries(e); a < f.length; a++) {
                  var c = f[a],
                    o = c[0],
                    h = c[1],
                    v = n.get(h);
                  v && (this.dress[o] = v);
                }
              }),
              (s.emitBuffChanged = function () {
                u.emit(i.STYLE_BONUS_CHANGED, { buffs: this.getActiveBuffs() });
              }),
              e
            );
          })(),
        );
        s._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/EventBus.ts",
  ["./rollupPluginModLoBabelHelpers.js", "cc"],
  function (e) {
    var t, n;
    return {
      setters: [
        function (e) {
          t = e.createForOfIteratorHelperLoose;
        },
        function (e) {
          n = e.cclegacy;
        },
      ],
      execute: function () {
        n._RF.push({}, "6dee3ec3hZGmJWlqxvzMbuA", "EventBus", void 0);
        e(
          "eventBus",
          new ((function () {
            function e() {
              this.listeners = new Map();
            }
            var n = e.prototype;
            return (
              (n.on = function (e, t) {
                (this.listeners.has(e) || this.listeners.set(e, new Set()),
                  this.listeners.get(e).add(t));
              }),
              (n.once = function (e, t) {
                var n = this;
                this.on(e, function r() {
                  (n.off(e, r), t.apply(void 0, arguments));
                });
              }),
              (n.off = function (e, t) {
                var n;
                null == (n = this.listeners.get(e)) || n.delete(t);
              }),
              (n.emit = function (e) {
                var t = this.listeners.get(e);
                if (t) {
                  for (
                    var n = arguments.length,
                      r = new Array(n > 1 ? n - 1 : 0),
                      s = 1;
                    s < n;
                    s++
                  )
                    r[s - 1] = arguments[s];
                  for (var i = 0, o = [].concat(t); i < o.length; i++) {
                    var u = o[i];
                    try {
                      u.apply(void 0, r);
                    } catch (t) {
                      console.error(
                        '[EventBus] Error in listener for "' + e + '":',
                        t,
                      );
                    }
                  }
                }
              }),
              (n.reset = function () {
                this.listeners.clear();
              }),
              (n.debug = function () {
                for (var e, n = [], r = t(this.listeners); !(e = r()).done; ) {
                  var s = e.value,
                    i = s[0],
                    o = s[1];
                  n.push("  " + i + ": " + o.size + " listener(s)");
                }
                return n.length ? n.join("\n") : "  (empty)";
              }),
              e
            );
          })())(),
        );
        n._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/index.ts",
  ["cc", "./SaveManager.ts"],
  function (e) {
    var n;
    return {
      setters: [
        function (e) {
          n = e.cclegacy;
        },
        function (n) {
          e("SaveManager", n.SaveManager);
        },
      ],
      execute: function () {
        (n._RF.push({}, "19dc3XTHZ9CUYYh73Jzy9D1", "index", void 0),
          n._RF.pop());
      },
    };
  },
);

System.register(
  "chunks:///_virtual/index2.ts",
  ["cc", "./OrderManager.ts"],
  function (e) {
    var r;
    return {
      setters: [
        function (e) {
          r = e.cclegacy;
        },
        function (r) {
          e("OrderManager", r.OrderManager);
        },
      ],
      execute: function () {
        (r._RF.push({}, "2081b5G2slMUaUMo5J7G4Qj", "index", void 0),
          r._RF.pop());
      },
    };
  },
);

System.register(
  "chunks:///_virtual/index3.ts",
  ["cc", "./EventBus.ts"],
  function (e) {
    var t;
    return {
      setters: [
        function (e) {
          t = e.cclegacy;
        },
        function (t) {
          e("eventBus", t.eventBus);
        },
      ],
      execute: function () {
        (t._RF.push({}, "2c7eamyWxdO8LCkHzIVmSfZ", "index", void 0),
          t._RF.pop());
      },
    };
  },
);

System.register(
  "chunks:///_virtual/index4.ts",
  ["cc", "./Match3Engine.ts"],
  function (n) {
    var e;
    return {
      setters: [
        function (n) {
          e = n.cclegacy;
        },
        function (e) {
          n("Match3Engine", e.Match3Engine);
        },
      ],
      execute: function () {
        (e._RF.push({}, "2e19fxTa2NDpaToJolrZO3T", "index", void 0),
          e._RF.pop());
      },
    };
  },
);

System.register(
  "chunks:///_virtual/index5.ts",
  ["cc", "./DressUpManager.ts"],
  function (e) {
    var n;
    return {
      setters: [
        function (e) {
          n = e.cclegacy;
        },
        function (n) {
          e("DressUpManager", n.DressUpManager);
        },
      ],
      execute: function () {
        (n._RF.push({}, "807bf2WBpBGsq3RTwQY3vNO", "index", void 0),
          n._RF.pop());
      },
    };
  },
);

System.register(
  "chunks:///_virtual/index6.ts",
  ["cc", "./InventorySystem.ts"],
  function (t) {
    var e;
    return {
      setters: [
        function (t) {
          e = t.cclegacy;
        },
        function (e) {
          t("InventorySystem", e.InventorySystem);
        },
      ],
      execute: function () {
        (e._RF.push({}, "b1bcb3al+5GxqZOVSwzgSVl", "index", void 0),
          e._RF.pop());
      },
    };
  },
);

System.register("chunks:///_virtual/index7.ts", ["cc"], function (E) {
  var e;
  return {
    setters: [
      function (E) {
        e = E.cclegacy;
      },
    ],
    execute: function () {
      e._RF.push({}, "b48c2nLdVVKTbwlZ6VopQfy", "index", void 0);
      (E(
        "ElementType",
        (function (E) {
          return (
            (E.LINE = "LINE"),
            (E.BUTTON = "BUTTON"),
            (E.SCISSORS = "SCISSORS"),
            (E.TAPE = "TAPE"),
            (E.SEWING = "SEWING"),
            E
          );
        })({}),
      ),
        E(
          "SpecialType",
          (function (E) {
            return (
              (E.NONE = "NONE"),
              (E.SHUTTLE = "SHUTTLE"),
              (E.IRON = "IRON"),
              (E.RAINBOW = "RAINBOW"),
              E
            );
          })({}),
        ),
        E(
          "DressPart",
          (function (E) {
            return (
              (E.HAIR = "HAIR"),
              (E.TOP = "TOP"),
              (E.BOTTOM = "BOTTOM"),
              (E.SHOES = "SHOES"),
              (E.ACCESSORY = "ACCESSORY"),
              E
            );
          })({}),
        ),
        E(
          "StyleTag",
          (function (E) {
            return (
              (E.SWEET = "SWEET"),
              (E.RETRO = "RETRO"),
              (E.CYBER = "CYBER"),
              (E.CUTE = "CUTE"),
              E
            );
          })({}),
        ),
        E("GameEvent", {
          MATCH_FOUND: "match:found",
          MATCH_CLEARED: "match:cleared",
          CELLS_DROPPED: "cells:dropped",
          GRID_STABLE: "grid:stable",
          ITEM_ADDED: "item:added",
          ITEM_REMOVED: "item:removed",
          ORDER_CREATED: "order:created",
          ORDER_SUBMITTED: "order:submitted",
          ORDER_COMPLETED: "order:completed",
          DRESS_CHANGED: "dress:changed",
          STYLE_BONUS_CHANGED: "style:bonus_changed",
          DOLL_MOOD_CHANGED: "doll:mood_changed",
          GOLD_CHANGED: "gold:changed",
          FLOWER_CHANGED: "flower:changed",
          GAME_SAVED: "game:saved",
          GAME_LOADED: "game:loaded",
        }));
      e._RF.pop();
    },
  };
});

System.register(
  "chunks:///_virtual/InventorySystem.ts",
  ["./rollupPluginModLoBabelHelpers.js", "cc", "./EventBus.ts", "./index7.ts"],
  function (t) {
    var e, n, r, i;
    return {
      setters: [
        function (t) {
          e = t.createForOfIteratorHelperLoose;
        },
        function (t) {
          n = t.cclegacy;
        },
        function (t) {
          r = t.eventBus;
        },
        function (t) {
          i = t.GameEvent;
        },
      ],
      execute: function () {
        n._RF.push({}, "f0706dAeh1IfbWOeTvxjIzV", "InventorySystem", void 0);
        t(
          "InventorySystem",
          (function () {
            function t() {
              this.items = new Map();
            }
            var n = t.prototype;
            return (
              (n.addItem = function (t, e) {
                var n;
                if (Number.isInteger(e) && !(e <= 0)) {
                  var s = (null != (n = this.items.get(t)) ? n : 0) + e;
                  (this.items.set(t, s),
                    r.emit(i.ITEM_ADDED, { itemId: t, count: e, newTotal: s }));
                }
              }),
              (n.removeItem = function (t, e) {
                var n;
                if (!Number.isInteger(e) || e <= 0) return !1;
                var s = null != (n = this.items.get(t)) ? n : 0;
                if (s < e) return !1;
                var u = s - e;
                return (
                  this.items.set(t, u),
                  r.emit(i.ITEM_REMOVED, { itemId: t, count: e, newTotal: u }),
                  !0
                );
              }),
              (n.hasItem = function (t, e) {
                var n;
                return (null != (n = this.items.get(t)) ? n : 0) >= e;
              }),
              (n.getCount = function (t) {
                var e;
                return null != (e = this.items.get(t)) ? e : 0;
              }),
              (n.getAll = function () {
                for (var t, n = [], r = e(this.items); !(t = r()).done; ) {
                  var i = t.value,
                    s = i[0],
                    u = i[1];
                  n.push({ itemId: s, count: u });
                }
                return n;
              }),
              (n.toJSON = function () {
                return this.getAll();
              }),
              (n.fromJSON = function (t) {
                this.items.clear();
                for (var n, r = e(t); !(n = r()).done; ) {
                  var i = n.value,
                    s = i.itemId,
                    u = i.count;
                  Number.isInteger(u) && u > 0 && this.items.set(s, u);
                }
              }),
              (n.clear = function () {
                this.items.clear();
              }),
              t
            );
          })(),
        );
        n._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/main",
  [
    "./EventBus.ts",
    "./index3.ts",
    "./types.ts",
    "./DressUpManager.ts",
    "./index5.ts",
    "./InventorySystem.ts",
    "./index6.ts",
    "./Match3Engine.ts",
    "./index4.ts",
    "./OrderManager.ts",
    "./index2.ts",
    "./SaveManager.ts",
    "./index.ts",
    "./index7.ts",
    "./CellComponent.ts",
    "./DressRoomPanel.ts",
    "./MainGameFlow.ts",
    "./Match3GridComponent.ts",
    "./ShopPanel.ts",
  ],
  function () {
    return {
      setters: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      execute: function () {},
    };
  },
);

System.register(
  "chunks:///_virtual/MainGameFlow.ts",
  [
    "./rollupPluginModLoBabelHelpers.js",
    "cc",
    "./InventorySystem.ts",
    "./OrderManager.ts",
    "./DressUpManager.ts",
  ],
  function (n) {
    var e, t, o, a, i, s, r, l, c, d, h, u;
    return {
      setters: [
        function (n) {
          e = n.inheritsLoose;
        },
        function (n) {
          ((t = n.cclegacy),
            (o = n._decorator),
            (a = n.director),
            (i = n.Camera),
            (s = n.Canvas),
            (r = n.Vec3),
            (l = n.Button),
            (c = n.Component));
        },
        function (n) {
          d = n.InventorySystem;
        },
        function (n) {
          h = n.OrderManager;
        },
        function (n) {
          u = n.DressUpManager;
        },
      ],
      execute: function () {
        var m, v;
        t._RF.push({}, "b0c1dUPxkVLRb30BokRBRT+", "MainGameFlow", void 0);
        var C = o.ccclass;
        (o.property,
          n(
            "MainGameFlow",
            C("MainGameFlow")(
              (((v = (function (n) {
                function t() {
                  for (
                    var e, t = arguments.length, o = new Array(t), a = 0;
                    a < t;
                    a++
                  )
                    o[a] = arguments[a];
                  return (
                    ((e =
                      n.call.apply(n, [this].concat(o)) ||
                      this).inventorySystem = void 0),
                    (e.orderManager = void 0),
                    (e.dressUpManager = void 0),
                    e
                  );
                }
                (e(t, n),
                  (t.getInstance = function () {
                    if (!t._instance)
                      throw new Error(
                        "[MainGameFlow] 尚未初始化！请确保场景中含有 MainGameFlow 组件节点。",
                      );
                    return t._instance;
                  }));
                var o = t.prototype;
                return (
                  (o.onLoad = function () {
                    if (t._instance)
                      return (
                        console.warn(
                          "[MainGameFlow] 已存在单例实例，销毁当前节点。",
                        ),
                        void this.node.destroy()
                      );
                    ((t._instance = this),
                      this.configureSceneCamera(),
                      a.addPersistRootNode(this.node),
                      (this.inventorySystem = new d()),
                      (this.orderManager = new h(this.inventorySystem)),
                      (this.dressUpManager = new u()),
                      console.log(
                        "[MainGameFlow] 初始化完成，三大系统已就绪。",
                      ),
                      this.bindBottomButtons(),
                      this.showPanel("match"));
                  }),
                  (o.configureSceneCamera = function () {
                    var n,
                      e,
                      t,
                      o =
                        null != (n = null == a.getScene ? void 0 : a.getScene())
                          ? n
                          : this.node.parent,
                      l = null == o ? void 0 : o.getChildByName("Main Camera"),
                      c = null == o ? void 0 : o.getChildByName("Canvas"),
                      d = null == l ? void 0 : l.getComponent(i),
                      h = null == c ? void 0 : c.getComponent(s);
                    l && d && h
                      ? (l.setPosition(new r(640, 360, 1e3)),
                        null == l.setRotationFromEuler ||
                          l.setRotationFromEuler(0, 0, 0),
                        (d.projection =
                          null !=
                          (e =
                            null == (t = i.ProjectionType) ? void 0 : t.ORTHO)
                            ? e
                            : 0),
                        (d.orthoHeight = 360),
                        (h.cameraComponent = d),
                        (h.alignCanvasWithScreen = !0))
                      : console.warn(
                          "[MainGameFlow] Main Camera or Canvas missing; 2D render setup skipped.",
                        );
                  }),
                  (o.bindBottomButtons = function () {
                    var n = this.findCanvasNode(),
                      e = null == n ? void 0 : n.getChildByName("BottomBar");
                    e
                      ? (this.bindButton(
                          e.getChildByName("BtnMatch"),
                          this.onMatchClicked,
                          "BtnMatch",
                        ),
                        this.bindButton(
                          e.getChildByName("BtnShop"),
                          this.onShopClicked,
                          "BtnShop",
                        ),
                        this.bindButton(
                          e.getChildByName("BtnDress"),
                          this.onDressClicked,
                          "BtnDress",
                        ))
                      : console.warn(
                          "[MainGameFlow] BottomBar not found; bottom navigation skipped.",
                        );
                  }),
                  (o.bindButton = function (n, e, t) {
                    var o;
                    if (n) {
                      var a =
                        null != (o = n.getComponent(l)) ? o : n.addComponent(l);
                      ((a.interactable = !0),
                        (a.target = n),
                        a.node.off(l.EventType.CLICK, e, this),
                        a.node.on(l.EventType.CLICK, e, this));
                    } else console.warn("[MainGameFlow] " + t + " not found.");
                  }),
                  (o.onMatchClicked = function () {
                    this.showPanel("match");
                  }),
                  (o.onShopClicked = function () {
                    this.showPanel("shop");
                  }),
                  (o.onDressClicked = function () {
                    this.showPanel("dress");
                  }),
                  (o.showPanel = function (n) {
                    var e = this.findCanvasNode();
                    if (e) {
                      var t = e.getChildByName("MatchGrid"),
                        o = e.getChildByName("ShopPanel"),
                        a = e.getChildByName("DressRoomPanel");
                      ((t && o && a) ||
                        console.warn(
                          "[MainGameFlow] One or more main panels are missing.",
                        ),
                        t && (t.active = "match" === n),
                        o && (o.active = "shop" === n),
                        a && (a.active = "dress" === n));
                    } else
                      console.warn(
                        "[MainGameFlow] Canvas not found; cannot switch panels.",
                      );
                  }),
                  (o.findCanvasNode = function () {
                    var n,
                      e,
                      t,
                      o = a.getScene();
                    return null !=
                      (n =
                        null !=
                        (e = null == o ? void 0 : o.getChildByName("Canvas"))
                          ? e
                          : null == (t = this.node.parent)
                            ? void 0
                            : t.getChildByName("Canvas"))
                      ? n
                      : null;
                  }),
                  (o.onDestroy = function () {
                    t._instance === this && (t._instance = null);
                  }),
                  t
                );
              })(c))._instance = null),
              (m = v)),
            ) || m,
          ));
        t._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/Match3Engine.ts",
  [
    "./rollupPluginModLoBabelHelpers.js",
    "cc",
    "./index7.ts",
    "./index3.ts",
    "./EventBus.ts",
  ],
  function (e) {
    var r, n, t, l, a, o;
    return {
      setters: [
        function (e) {
          ((r = e.createForOfIteratorHelperLoose), (n = e.extends));
        },
        function (e) {
          t = e.cclegacy;
        },
        function (e) {
          ((l = e.SpecialType), (a = e.GameEvent));
        },
        null,
        function (e) {
          o = e.eventBus;
        },
      ],
      execute: function () {
        t._RF.push({}, "67ea23QOxhKrZras8sk/SwA", "Match3Engine", void 0);
        e(
          "Match3Engine",
          (function () {
            function e(e) {
              ((this.config = void 0), (this.grid = []), (this.config = e));
            }
            var t = e.prototype;
            return (
              (t.initGrid = function () {
                for (
                  var e = this.config,
                    r = e.rows,
                    n = e.cols,
                    t = e.elementTypes,
                    a = [],
                    o = 0;
                  o < r;
                  o++
                ) {
                  for (var i = [], u = 0; u < n; u++) {
                    var s = this.getSafeTypes(a, i, o, u, t),
                      c = s[Math.floor(Math.random() * s.length)];
                    i.push({
                      row: o,
                      col: u,
                      type: c,
                      special: l.NONE,
                      tangleCount: 0,
                      isFrozen: !1,
                    });
                  }
                  a.push(i);
                }
                return ((this.grid = a), a);
              }),
              (t.findMatches = function (e) {
                for (
                  var r,
                    n,
                    t = e.length,
                    l =
                      null != (r = null == (n = e[0]) ? void 0 : n.length)
                        ? r
                        : 0,
                    a = [],
                    o = new Map(),
                    i = function (e, r, n) {
                      var t,
                        l = e + "," + r,
                        a = null != (t = o.get(l)) ? t : [];
                      (a.push(n), o.set(l, a));
                    },
                    u = 0;
                  u < t;
                  u++
                )
                  for (var s = 0; s < l; ) {
                    var c,
                      v = null == (c = e[u][s]) ? void 0 : c.type;
                    if (null !== v) {
                      for (
                        var f = s;
                        f + 1 < l &&
                        (null == (p = e[u][f + 1]) ? void 0 : p.type) === v;
                      ) {
                        var p;
                        f++;
                      }
                      var h = f - s + 1;
                      if (h >= 3) {
                        for (var d = [], g = s; g <= f; g++)
                          d.push({ row: u, col: g });
                        var y = { cells: d, type: v, length: h };
                        a.push(y);
                        for (var w = s; w <= f; w++) i(u, w, y);
                      }
                      s = f + 1;
                    } else s++;
                  }
                for (var M = 0; M < l; M++)
                  for (var m = 0; m < t; ) {
                    var E,
                      F = null == (E = e[m][M]) ? void 0 : E.type;
                    if (null !== F) {
                      for (
                        var N = m;
                        N + 1 < t &&
                        (null == (T = e[N + 1][M]) ? void 0 : T.type) === F;
                      ) {
                        var T;
                        N++;
                      }
                      var S = N - m + 1;
                      if (S >= 3) {
                        for (var A = [], C = m; C <= N; C++)
                          A.push({ row: C, col: M });
                        var O = { cells: A, type: F, length: S };
                        a.push(O);
                        for (var R = m; R <= N; R++) i(R, M, O);
                      }
                      m = N + 1;
                    } else m++;
                  }
                return a;
              }),
              (t.clearMatches = function (e, t) {
                for (
                  var i,
                    u,
                    s,
                    c = this,
                    v = e.length,
                    f =
                      null != (i = null == (u = e[0]) ? void 0 : u.length)
                        ? i
                        : 0,
                    p = new Map(),
                    h = new Map(),
                    d = function (e, r, n) {
                      var t,
                        l = e + "," + r,
                        a = null != (t = h.get(l)) ? t : [];
                      (a.push(n), h.set(l, a));
                    },
                    g = r(t);
                  !(s = g()).done;
                )
                  for (var y, w = s.value, M = r(w.cells); !(y = M()).done; ) {
                    var m = y.value;
                    d(m.row, m.col, w);
                  }
                for (
                  var E,
                    F = function (e, r, n) {
                      var t = e + "," + r,
                        l = p.get(t);
                      (!l || c.specialPriority(n) > c.specialPriority(l)) &&
                        p.set(t, n);
                    },
                    N = r(t);
                  !(E = N()).done;
                ) {
                  var T = E.value;
                  if (4 === T.length) {
                    var S = T.cells[T.cells.length - 1];
                    F(S.row, S.col, l.SHUTTLE);
                  } else if (T.length >= 5) {
                    var A = Math.floor(T.cells.length / 2),
                      C = T.cells[A];
                    F(C.row, C.col, l.RAINBOW);
                  }
                }
                for (var O, R = r(h); !(O = R()).done; ) {
                  var z = O.value,
                    I = z[0],
                    B = z[1];
                  if (!(B.length < 2)) {
                    for (
                      var H,
                        L = I.split(",").map(Number),
                        _ = L[0],
                        x = L[1],
                        b = !1,
                        G = !1,
                        P = r(B);
                      !(H = P()).done;
                    ) {
                      var D = H.value,
                        U = D.cells[0],
                        k = D.cells[D.cells.length - 1];
                      U.row === k.row ? (b = !0) : U.col === k.col && (G = !0);
                    }
                    b && G && F(_, x, l.IRON);
                  }
                }
                for (var W, j = new Set(), K = r(t); !(W = K()).done; )
                  for (var Q, Z = W.value, q = r(Z.cells); !(Q = q()).done; ) {
                    var J = Q.value;
                    j.add(J.row + "," + J.col);
                  }
                for (var V = [], X = new Map(), Y = 0; Y < v; Y++) {
                  for (var $ = [], ee = 0; ee < f; ee++) {
                    var re = Y + "," + ee,
                      ne = e[Y][ee],
                      te = j.has(re),
                      le = p.get(re);
                    if (te && !le) {
                      var ae;
                      $.push({
                        row: Y,
                        col: ee,
                        type: null,
                        special: l.NONE,
                        tangleCount: 0,
                        isFrozen: !1,
                      });
                      var oe = String(ne.type);
                      X.set(oe, (null != (ae = X.get(oe)) ? ae : 0) + 1);
                    } else
                      te && le
                        ? $.push({
                            row: Y,
                            col: ee,
                            type: ne.type,
                            special: le,
                            tangleCount: ne.tangleCount,
                            isFrozen: ne.isFrozen,
                          })
                        : $.push(n({}, ne));
                  }
                  V.push($);
                }
                var ie = Array.from(X.entries()).map(function (e) {
                  return { type: e[0], count: e[1] };
                });
                return (o.emit(a.MATCH_CLEARED, { clearedItems: ie }), V);
              }),
              (t.dropAndFill = function (e) {
                for (
                  var r,
                    t,
                    a = e.length,
                    o =
                      null != (r = null == (t = e[0]) ? void 0 : t.length)
                        ? r
                        : 0,
                    i = this.config.elementTypes,
                    u = e.map(function (e) {
                      return e.map(function (e) {
                        return n({}, e);
                      });
                    }),
                    s = 0;
                  s < o;
                  s++
                ) {
                  for (var c = [], v = 0; v < a; v++)
                    null !== u[v][s].type && c.push(u[v][s]);
                  for (var f = a - 1; f >= 0; f--)
                    if (c.length > 0) {
                      var p = c.pop();
                      u[f][s] = {
                        row: f,
                        col: s,
                        type: p.type,
                        special: p.special,
                        tangleCount: p.tangleCount,
                        isFrozen: p.isFrozen,
                      };
                    } else {
                      var h = i[Math.floor(Math.random() * i.length)];
                      u[f][s] = {
                        row: f,
                        col: s,
                        type: h,
                        special: l.NONE,
                        tangleCount: 0,
                        isFrozen: !1,
                      };
                    }
                }
                return u;
              }),
              (t.step = function (e) {
                var r = this,
                  n = e,
                  t = 0,
                  l = [];
                return (
                  (n = (function e(n) {
                    if (t >= 100) return n;
                    var i = r.findMatches(n);
                    if (0 === i.length) return n;
                    (o.emit(a.MATCH_FOUND, i), t++, l.push.apply(l, i));
                    var u = r.clearMatches(n, i);
                    return e(r.dropAndFill(u));
                  })(n)),
                  o.emit(a.GRID_STABLE, n),
                  (this.grid = n),
                  { grid: n, matches: l, cascades: t }
                );
              }),
              (t.swap = function (e, r, t, l, a) {
                var o,
                  i,
                  u = e.length,
                  s =
                    null != (o = null == (i = e[0]) ? void 0 : i.length)
                      ? o
                      : 0;
                if (r < 0 || r >= u || t < 0 || t >= s)
                  return { valid: !1, grid: e };
                if (l < 0 || l >= u || a < 0 || a >= s)
                  return { valid: !1, grid: e };
                var c = Math.abs(r - l),
                  v = Math.abs(t - a);
                if (!((1 === c && 0 === v) || (0 === c && 1 === v)))
                  return { valid: !1, grid: e };
                var f = e.map(function (e) {
                    return e.map(function (e) {
                      return n({}, e);
                    });
                  }),
                  p = n({}, f[r][t]);
                return (
                  (f[r][t] = n({}, f[l][a], { row: r, col: t })),
                  (f[l][a] = n({}, p, { row: l, col: a })),
                  0 === this.findMatches(f).length
                    ? { valid: !1, grid: e }
                    : { valid: !0, grid: f }
                );
              }),
              (t.getGrid = function () {
                return this.grid;
              }),
              (t.getSafeTypes = function (e, r, n, t, l) {
                var a = null;
                if (t >= 2) {
                  var o,
                    i,
                    u = null == (o = r[t - 1]) ? void 0 : o.type,
                    s = null == (i = r[t - 2]) ? void 0 : i.type;
                  null != u && u === s && (a = u);
                }
                var c = null;
                if (n >= 2) {
                  var v,
                    f,
                    p =
                      null == (v = e[n - 1]) || null == (v = v[t])
                        ? void 0
                        : v.type,
                    h =
                      null == (f = e[n - 2]) || null == (f = f[t])
                        ? void 0
                        : f.type;
                  null != p && p === h && (c = p);
                }
                var d = new Set();
                (a && d.add(a), c && d.add(c));
                var g = l.filter(function (e) {
                  return !d.has(e);
                });
                return (0 === g.length && (g = [].concat(l)), g);
              }),
              (t.specialPriority = function (e) {
                switch (e) {
                  case l.RAINBOW:
                    return 3;
                  case l.IRON:
                    return 2;
                  case l.SHUTTLE:
                    return 1;
                  default:
                    return 0;
                }
              }),
              e
            );
          })(),
        );
        t._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/Match3GridComponent.ts",
  [
    "./rollupPluginModLoBabelHelpers.js",
    "cc",
    "./Match3Engine.ts",
    "./index7.ts",
    "./EventBus.ts",
    "./CellComponent.ts",
  ],
  function (e) {
    var t,
      n,
      i,
      r,
      l,
      o,
      s,
      a,
      c,
      u,
      h,
      p,
      d,
      C,
      f,
      w,
      m,
      g,
      v,
      S,
      y,
      b,
      N,
      T,
      G,
      E,
      x,
      F,
      k;
    return {
      setters: [
        function (e) {
          ((t = e.applyDecoratedDescriptor),
            (n = e.inheritsLoose),
            (i = e.initializerDefineProperty),
            (r = e.assertThisInitialized),
            (l = e.asyncToGenerator),
            (o = e.regeneratorRuntime));
        },
        function (e) {
          ((s = e.cclegacy),
            (a = e._decorator),
            (c = e.Prefab),
            (u = e.CCFloat),
            (h = e.CCInteger),
            (p = e.Vec3),
            (d = e.instantiate),
            (C = e.Node),
            (f = e.UITransform),
            (w = e.Button),
            (m = e.Graphics),
            (g = e.Sprite),
            (v = e.Color),
            (S = e.resources),
            (y = e.SpriteFrame),
            (b = e.tween),
            (N = e.Component));
        },
        function (e) {
          T = e.Match3Engine;
        },
        function (e) {
          ((G = e.ElementType), (E = e.GameEvent), (x = e.SpecialType));
        },
        function (e) {
          F = e.eventBus;
        },
        function (e) {
          k = e.CellComponent;
        },
      ],
      execute: function () {
        var z, R, P, I, M, B, O, _, A, L, D;
        s._RF.push(
          {},
          "1b1618eAzJIgY8RJgOX0SJf",
          "Match3GridComponent",
          void 0,
        );
        var U = a.ccclass,
          W = a.property;
        e(
          "Match3GridComponent",
          ((z = U("Match3GridComponent")),
          (R = W({
            type: c,
            tooltip: "棋子预制体（需挂载 CellComponent 和 Sprite）",
          })),
          (P = W({ type: u, tooltip: "单个棋子边长（像素）" })),
          (I = W({ type: h, tooltip: "棋盘行数" })),
          (M = W({ type: h, tooltip: "棋盘列数" })),
          z(
            ((_ = t(
              (O = (function (e) {
                function t() {
                  for (
                    var t, n = arguments.length, l = new Array(n), o = 0;
                    o < n;
                    o++
                  )
                    l[o] = arguments[o];
                  return (
                    (t = e.call.apply(e, [this].concat(l)) || this),
                    i(t, "cellPrefab", _, r(t)),
                    i(t, "cellSize", A, r(t)),
                    i(t, "rows", L, r(t)),
                    i(t, "cols", D, r(t)),
                    (t.engine = void 0),
                    (t.cellNodes = []),
                    (t.selectedRow = -1),
                    (t.selectedCol = -1),
                    (t.isProcessing = !1),
                    (t.selectedTween = null),
                    (t.onGridStable = function (e) {
                      t.renderGrid(e);
                    }),
                    t
                  );
                }
                n(t, e);
                var s = t.prototype;
                return (
                  (s.onLoad = function () {
                    var e = {
                      rows: this.rows,
                      cols: this.cols,
                      elementTypes: [
                        G.LINE,
                        G.BUTTON,
                        G.SCISSORS,
                        G.TAPE,
                        G.SEWING,
                      ],
                    };
                    this.engine = new T(e);
                    var t = this.engine.initGrid();
                    (this.renderGrid(t),
                      F.on(E.GRID_STABLE, this.onGridStable));
                  }),
                  (s.onDestroy = function () {
                    (F.off(E.GRID_STABLE, this.onGridStable),
                      this.cancelSelectionTween());
                  }),
                  (s.renderGrid = function (e) {
                    if (0 === this.cellNodes.length)
                      for (var t = 0; t < this.rows; t++)
                        this.cellNodes[t] = [];
                    for (var n = 0; n < this.rows; n++)
                      for (var i = 0; i < this.cols; i++) {
                        var r,
                          l,
                          o,
                          s = null == (r = e[n]) ? void 0 : r[i];
                        if (s) {
                          var a =
                            null !=
                            (l =
                              null == (o = this.cellNodes[n]) ? void 0 : o[i])
                              ? l
                              : null;
                          if (!a) {
                            var c = this.createCellNode();
                            ((c.parent = this.node),
                              this.cellNodes[n] || (this.cellNodes[n] = []),
                              (this.cellNodes[n][i] = c),
                              (a = c));
                          }
                          if (a) {
                            var u = (-(this.cols - 1) * this.cellSize) / 2,
                              h = ((this.rows - 1) * this.cellSize) / 2;
                            (a.setPosition(
                              new p(
                                u + i * this.cellSize,
                                h - n * this.cellSize,
                                0,
                              ),
                            ),
                              this.updateCellSprite(a, s),
                              this.ensureCellComponent(a).setup(n, i, s.type));
                          }
                        }
                      }
                  }),
                  (s.createCellNode = function () {
                    if (this.cellPrefab) return d(this.cellPrefab);
                    var e = new C("Cell"),
                      t = e.addComponent(f),
                      n = Math.max(12, this.cellSize);
                    t.setContentSize(n, n);
                    var i = e.addComponent(w);
                    return (
                      (i.interactable = !0),
                      (i.target = e),
                      e.addComponent(m),
                      e.addComponent(k),
                      e
                    );
                  }),
                  (s.ensureCellComponent = function (e) {
                    var t,
                      n = e.getComponent(f);
                    n || (n = e.addComponent(f));
                    var i = Math.max(12, this.cellSize);
                    n.setContentSize(i, i);
                    var r =
                      null != (t = e.getComponent(w)) ? t : e.addComponent(w);
                    ((r.interactable = !0), (r.target = e));
                    var l = e.getComponent(k);
                    return (l || (l = e.addComponent(k)), l);
                  }),
                  (s.updateCellSprite = function (e, t) {
                    var n = this,
                      i = e.getComponent(g);
                    if (!t.type)
                      return (
                        i &&
                          ((i.spriteFrame = null),
                          (i.color = new v(255, 255, 255, 0))),
                        void this.clearFallbackCell(e)
                      );
                    if ((this.drawFallbackCell(e, t), i)) {
                      var r = this.getElementTexturePath(t.type);
                      if (
                        (S.load(r, y, function (t, r) {
                          !t &&
                            r &&
                            i.isValid &&
                            ((i.spriteFrame = r), n.clearFallbackCell(e));
                        }),
                        t.special !== x.NONE)
                      ) {
                        var l = this.getSpecialColor(t.special);
                        i.color = l;
                      } else i.color = new v(255, 255, 255, 255);
                    }
                  }),
                  (s.drawFallbackCell = function (e, t) {
                    var n = this.getFallbackGraphics(e),
                      i = Math.max(12, this.cellSize - 8),
                      r = i / 2;
                    (n.clear(),
                      (n.fillColor = this.getElementColor(t.type)),
                      n.rect(-r, -r, i, i),
                      n.fill(),
                      (n.lineWidth = t.special !== x.NONE ? 5 : 2),
                      (n.strokeColor =
                        t.special !== x.NONE
                          ? this.getSpecialColor(t.special)
                          : new v(255, 255, 255, 220)),
                      n.rect(-r, -r, i, i),
                      n.stroke());
                  }),
                  (s.getFallbackGraphics = function (e) {
                    var t,
                      n = "__CellFallbackGraphic",
                      i = e.getChildByName(n);
                    (i || (((i = new C(n)).layer = e.layer), (i.parent = e)),
                      (i.active = !0),
                      (i.layer = e.layer));
                    var r = i.getComponent(f);
                    r || (r = i.addComponent(f));
                    var l = Math.max(12, this.cellSize - 8);
                    return (
                      r.setContentSize(l, l),
                      null != (t = i.getComponent(m)) ? t : i.addComponent(m)
                    );
                  }),
                  (s.clearFallbackCell = function (e) {
                    var t,
                      n,
                      i = e.getChildByName("__CellFallbackGraphic");
                    i
                      ? (null == (t = i.getComponent(m)) || t.clear(),
                        (i.active = !1))
                      : null == (n = e.getComponent(m)) || n.clear();
                  }),
                  (s.getElementColor = function (e) {
                    switch (e) {
                      case G.LINE:
                        return new v(231, 76, 60, 255);
                      case G.BUTTON:
                        return new v(52, 152, 219, 255);
                      case G.SCISSORS:
                        return new v(46, 204, 113, 255);
                      case G.TAPE:
                        return new v(241, 196, 15, 255);
                      case G.SEWING:
                        return new v(155, 89, 182, 255);
                      default:
                        return new v(149, 165, 166, 255);
                    }
                  }),
                  (s.getElementTexturePath = function (e) {
                    switch (e) {
                      case G.LINE:
                        return "textures/line/spriteFrame";
                      case G.BUTTON:
                        return "textures/button/spriteFrame";
                      case G.SCISSORS:
                        return "textures/scissors/spriteFrame";
                      case G.TAPE:
                        return "textures/tape/spriteFrame";
                      case G.SEWING:
                        return "textures/sewing/spriteFrame";
                      default:
                        return "textures/line/spriteFrame";
                    }
                  }),
                  (s.getSpecialColor = function (e) {
                    switch (e) {
                      case x.SHUTTLE:
                        return new v(255, 215, 0, 255);
                      case x.IRON:
                        return new v(255, 99, 71, 255);
                      case x.RAINBOW:
                        return new v(0, 255, 255, 255);
                      default:
                        return new v(255, 255, 255, 255);
                    }
                  }),
                  (s.onCellClicked = function (e, t) {
                    this.isProcessing ||
                      (-1 !== this.selectedRow && -1 !== this.selectedCol
                        ? this.selectedRow !== e || this.selectedCol !== t
                          ? this.trySwap(
                              this.selectedRow,
                              this.selectedCol,
                              e,
                              t,
                            )
                          : this.deselectCell()
                        : this.selectCell(e, t));
                  }),
                  (s.selectCell = function (e, t) {
                    var n;
                    ((this.selectedRow = e), (this.selectedCol = t));
                    var i = null == (n = this.cellNodes[e]) ? void 0 : n[t];
                    i &&
                      (this.cancelSelectionTween(),
                      (this.selectedTween = b(i)
                        .to(0.3, { scale: new p(1.15, 1.15, 1) })
                        .to(0.3, { scale: new p(1, 1, 1) })
                        .union()
                        .repeatForever()
                        .start()));
                  }),
                  (s.deselectCell = function () {
                    if (this.selectedRow >= 0 && this.selectedCol >= 0) {
                      var e,
                        t =
                          null == (e = this.cellNodes[this.selectedRow])
                            ? void 0
                            : e[this.selectedCol];
                      t && t.setScale(new p(1, 1, 1));
                    }
                    (this.cancelSelectionTween(),
                      (this.selectedRow = -1),
                      (this.selectedCol = -1));
                  }),
                  (s.cancelSelectionTween = function () {
                    this.selectedTween &&
                      (this.selectedTween.stop(), (this.selectedTween = null));
                  }),
                  (s.trySwap = function (e, t, n, i) {
                    var r = this.engine.getGrid(),
                      l = this.engine.swap(r, e, t, n, i);
                    (this.deselectCell(),
                      l.valid
                        ? (this.renderGrid(l.grid), this.processMatches(l.grid))
                        : (this.shakeCell(e, t), this.shakeCell(n, i)));
                  }),
                  (s.shakeCell = function (e, t) {
                    var n,
                      i = null == (n = this.cellNodes[e]) ? void 0 : n[t];
                    if (i) {
                      var r = i.getPosition();
                      b(i)
                        .to(0.05, { position: new p(r.x + 5, r.y, 0) })
                        .to(0.05, { position: new p(r.x - 5, r.y, 0) })
                        .to(0.05, { position: new p(r.x + 5, r.y, 0) })
                        .to(0.05, { position: new p(r.x - 5, r.y, 0) })
                        .to(0.05, { position: r })
                        .start();
                    }
                  }),
                  (s.processMatches = (function () {
                    var e = l(
                      o().mark(function e(t) {
                        var n, i, r, l;
                        return o().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  ((this.isProcessing = !0),
                                    (n = t),
                                    (i = 0),
                                    (r = 100));
                                case 4:
                                  if (!(i < r)) {
                                    e.next = 20;
                                    break;
                                  }
                                  if (
                                    0 !==
                                    (l = this.engine.findMatches(n)).length
                                  ) {
                                    e.next = 8;
                                    break;
                                  }
                                  return e.abrupt("break", 20);
                                case 8:
                                  return (
                                    i++,
                                    F.emit(E.MATCH_FOUND, l),
                                    (n = this.engine.clearMatches(n, l)),
                                    this.renderGrid(n),
                                    (e.next = 14),
                                    this.delay(150)
                                  );
                                case 14:
                                  return (
                                    (n = this.engine.dropAndFill(n)),
                                    this.renderGrid(n),
                                    (e.next = 18),
                                    this.delay(150)
                                  );
                                case 18:
                                  e.next = 4;
                                  break;
                                case 20:
                                  (F.emit(E.GRID_STABLE, n),
                                    (this.isProcessing = !1));
                                case 22:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                        );
                      }),
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (s.delay = function (e) {
                    return new Promise(function (t) {
                      setTimeout(t, e);
                    });
                  }),
                  t
                );
              })(N)).prototype,
              "cellPrefab",
              [R],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                },
              },
            )),
            (A = t(O.prototype, "cellSize", [P], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return 80;
              },
            })),
            (L = t(O.prototype, "rows", [I], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return 8;
              },
            })),
            (D = t(O.prototype, "cols", [M], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return 8;
              },
            })),
            (B = O)),
          ) || B),
        );
        s._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/OrderManager.ts",
  ["./rollupPluginModLoBabelHelpers.js", "cc", "./EventBus.ts", "./index7.ts"],
  function (r) {
    var e, t, n, o, a;
    return {
      setters: [
        function (r) {
          ((e = r.extends), (t = r.createForOfIteratorHelperLoose));
        },
        function (r) {
          n = r.cclegacy;
        },
        function (r) {
          o = r.eventBus;
        },
        function (r) {
          a = r.GameEvent;
        },
      ],
      execute: function () {
        n._RF.push({}, "e8452Ucxj9A1qyLiytt8DaS", "OrderManager", void 0);
        var s = ["LINE", "BUTTON", "SCISSORS", "TAPE", "SEWING"],
          d = [
            "小红",
            "小美",
            "阿花",
            "莉莉",
            "娜娜",
            "思思",
            "小云",
            "阿紫",
            "小樱",
            "小倩",
          ],
          i = [
            "avatar/customer_01",
            "avatar/customer_02",
            "avatar/customer_03",
            "avatar/customer_04",
            "avatar/customer_05",
          ];
        ((r(
          "OrderManager",
          (function () {
            function r(r) {
              ((this.inventory = void 0),
                (this.orders = new Map()),
                (this.idCounter = 0),
                (this.totalGoldEarned = 0),
                (this.totalFlowerEarned = 0),
                (this.inventory = r));
            }
            var n = r.prototype;
            return (
              (n.generateOrders = function (t) {
                for (
                  var n = this.getActiveOrders().length,
                    s = Math.max(0, r.MAX_ACTIVE_ORDERS - n),
                    d = Math.min(t, s),
                    i = [],
                    u = 0;
                  u < d;
                  u++
                ) {
                  var c = this.createRandomOrder();
                  (this.orders.set(c.orderId, c),
                    i.push(c),
                    o.emit(a.ORDER_CREATED, { order: e({}, c) }));
                }
                return i;
              }),
              (n.submitOrder = function (r) {
                var n = this.orders.get(r);
                if (!n) return { success: !1, reason: "订单不存在" };
                if ("pending" !== n.status)
                  return { success: !1, reason: "订单状态不允许提交" };
                for (var s, d = t(n.requirements); !(s = d()).done; ) {
                  var i = s.value;
                  if (!this.inventory.hasItem(i.itemId, i.count))
                    return { success: !1, reason: i.itemId + "不足" };
                }
                o.emit(a.ORDER_SUBMITTED, { order: e({}, n) });
                for (var u, c = t(n.requirements); !(u = c()).done; ) {
                  var l = u.value;
                  this.inventory.removeItem(l.itemId, l.count);
                }
                return (
                  (n.status = "completed"),
                  (this.totalGoldEarned += n.rewardGold),
                  (this.totalFlowerEarned += n.rewardFlower),
                  o.emit(a.ORDER_COMPLETED, {
                    order: e({}, n),
                    rewardGold: n.rewardGold,
                    rewardFlower: n.rewardFlower,
                  }),
                  o.emit(a.GOLD_CHANGED, {
                    amount: n.rewardGold,
                    newTotal: this.totalGoldEarned,
                  }),
                  o.emit(a.FLOWER_CHANGED, {
                    amount: n.rewardFlower,
                    newTotal: this.totalFlowerEarned,
                  }),
                  { success: !0 }
                );
              }),
              (n.getActiveOrders = function () {
                for (
                  var r, e = [], n = t(this.orders.values());
                  !(r = n()).done;
                ) {
                  var o = r.value;
                  ("pending" !== o.status && "in_progress" !== o.status) ||
                    e.push(o);
                }
                return e;
              }),
              (n.cancelOrder = function (r) {
                var e = this.orders.get(r);
                return (
                  !!e && "pending" === e.status && ((e.status = "expired"), !0)
                );
              }),
              (n.toJSON = function () {
                for (
                  var r, n = [], o = t(this.orders.values());
                  !(r = o()).done;
                ) {
                  var a = r.value;
                  n.push(e({}, a));
                }
                return n;
              }),
              (n.fromJSON = function (r) {
                this.orders.clear();
                for (var n, o = 0, a = t(r); !(n = a()).done; ) {
                  var s = n.value;
                  this.orders.set(s.orderId, e({}, s));
                  var d = s.orderId.match(/^order_(\d+)$/);
                  if (d) {
                    var i = parseInt(d[1], 10);
                    i > o && (o = i);
                  }
                }
                this.idCounter = o;
              }),
              (n.getTotalGoldEarned = function () {
                return this.totalGoldEarned;
              }),
              (n.getTotalFlowerEarned = function () {
                return this.totalFlowerEarned;
              }),
              (n.createRandomOrder = function () {
                var r = this,
                  e = this.randomInt(1, 3),
                  t = []
                    .concat(s)
                    .sort(function () {
                      return Math.random() - 0.5;
                    })
                    .slice(0, e)
                    .map(function (e) {
                      return { itemId: e, count: r.randomInt(1, 5) };
                    }),
                  n = t.reduce(function (r, e) {
                    return r + e.count;
                  }, 0),
                  o = new Set(
                    t.map(function (r) {
                      return r.itemId;
                    }),
                  ).size;
                return {
                  orderId: "order_" + ++this.idCounter,
                  customerName: d[this.randomInt(0, d.length - 1)],
                  customerAvatar: i[this.randomInt(0, i.length - 1)],
                  requirements: t,
                  rewardGold: 10 * n,
                  rewardFlower: 2 * o,
                  status: "pending",
                };
              }),
              (n.randomInt = function (r, e) {
                return Math.floor(Math.random() * (e - r + 1)) + r;
              }),
              r
            );
          })(),
        ).MAX_ACTIVE_ORDERS = 5),
          n._RF.pop());
      },
    };
  },
);

System.register(
  "chunks:///_virtual/SaveManager.ts",
  ["cc", "./EventBus.ts", "./index7.ts"],
  function (t) {
    var e, n, i, a;
    return {
      setters: [
        function (t) {
          ((e = t.cclegacy), (n = t.sys));
        },
        function (t) {
          i = t.eventBus;
        },
        function (t) {
          a = t.GameEvent;
        },
      ],
      execute: function () {
        e._RF.push({}, "bceaekXBOtMk5YNKGBFbf5t", "SaveManager", void 0);
        t(
          "SaveManager",
          (function () {
            function t() {
              ((this.data = void 0),
                (this.autoSaveTimer = null),
                (this.listeners = []),
                (this.data = {
                  gold: 0,
                  flowers: 0,
                  inventory: [],
                  orders: [],
                  currentDress: {},
                  dollMood: 0,
                  dollAffection: 0,
                  matchLevel: 0,
                }),
                this.registerListeners());
            }
            var e = t.prototype;
            return (
              (e.save = function (t) {
                (void 0 === t && (t = 0), this.ensureSaveDir());
                var e = this.slotPath(t),
                  r = JSON.stringify(this.data, null, 2);
                (n.localStorage.setItem(e, r), i.emit(a.GAME_SAVED));
              }),
              (e.load = function (t) {
                void 0 === t && (t = 0);
                var e = this.slotPath(t),
                  r = n.localStorage.getItem(e);
                if (!r) return null;
                try {
                  var s = JSON.parse(r);
                  return (i.emit(a.GAME_LOADED, s), s);
                } catch (t) {
                  return null;
                }
              }),
              (e.startAutoSave = function (t) {
                var e = this;
                (this.stopAutoSave(),
                  (this.autoSaveTimer = setInterval(function () {
                    e.save();
                  }, t)));
              }),
              (e.stopAutoSave = function () {
                null !== this.autoSaveTimer &&
                  (clearInterval(this.autoSaveTimer),
                  (this.autoSaveTimer = null));
              }),
              (e.getSnapshot = function () {
                return JSON.parse(JSON.stringify(this.data));
              }),
              (e.restore = function (t) {
                ((this.data = JSON.parse(JSON.stringify(t))),
                  i.emit(a.GAME_LOADED, this.getSnapshot()));
              }),
              (e.ensureSaveDir = function () {}),
              (e.slotPath = function (t) {
                return "wardrobe-story:save:" + t;
              }),
              (e.registerListeners = function () {
                var t = this;
                (this.on(a.GOLD_CHANGED, function (e) {
                  t.data.gold = e.newTotal;
                }),
                  this.on(a.FLOWER_CHANGED, function (e) {
                    t.data.flowers = e.newTotal;
                  }),
                  this.on(a.ITEM_ADDED, function (e) {
                    t.upsertInventoryItem(e.itemId, e.newTotal);
                  }),
                  this.on(a.ITEM_REMOVED, function (e) {
                    t.upsertInventoryItem(e.itemId, e.newTotal);
                  }),
                  this.on(a.ORDER_CREATED, function (e) {
                    t.data.orders.push(e);
                  }),
                  this.on(a.DRESS_CHANGED, function (e) {
                    t.data.currentDress[e.part] = e.attachmentId;
                  }));
              }),
              (e.upsertInventoryItem = function (t, e) {
                var n = this.data.inventory.findIndex(function (e) {
                  return e.itemId === t;
                });
                e <= 0
                  ? -1 !== n && this.data.inventory.splice(n, 1)
                  : -1 !== n
                    ? (this.data.inventory[n].count = e)
                    : this.data.inventory.push({ itemId: t, count: e });
              }),
              (e.on = function (t, e) {
                (i.on(t, e), this.listeners.push({ event: t, fn: e }));
              }),
              t
            );
          })(),
        );
        e._RF.pop();
      },
    };
  },
);

System.register(
  "chunks:///_virtual/ShopPanel.ts",
  [
    "./rollupPluginModLoBabelHelpers.js",
    "cc",
    "./MainGameFlow.ts",
    "./EventBus.ts",
    "./index7.ts",
  ],
  function (e) {
    var r, t, n, o, i, a, l, s, d, u, h, c, f, p, C, m, g, b;
    return {
      setters: [
        function (e) {
          ((r = e.applyDecoratedDescriptor),
            (t = e.inheritsLoose),
            (n = e.createForOfIteratorHelperLoose),
            (o = e.initializerDefineProperty),
            (i = e.assertThisInitialized));
        },
        function (e) {
          ((a = e.cclegacy),
            (l = e._decorator),
            (s = e.Prefab),
            (d = e.Node),
            (u = e.Label),
            (h = e.instantiate),
            (c = e.Color),
            (f = e.Button),
            (p = e.UITransform),
            (C = e.Component));
        },
        function (e) {
          m = e.MainGameFlow;
        },
        function (e) {
          g = e.eventBus;
        },
        function (e) {
          b = e.GameEvent;
        },
      ],
      execute: function () {
        var v, L, w, y, S, O, P, B, E, G, N;
        a._RF.push({}, "cd8f62o9DFBXoFuY0clMHAu", "ShopPanel", void 0);
        var F = l.ccclass,
          D = l.property;
        e(
          "ShopPanel",
          ((v = F("ShopPanel")),
          (L = D({ type: s, tooltip: "订单卡片预制体" })),
          (w = D({ type: d, tooltip: "订单列表容器节点" })),
          (y = D({ type: u, tooltip: "金币数量标签" })),
          (S = D({ type: u, tooltip: "小红花数量标签" })),
          v(
            ((B = r(
              (P = (function (e) {
                function r() {
                  for (
                    var r, t = arguments.length, n = new Array(t), a = 0;
                    a < t;
                    a++
                  )
                    n[a] = arguments[a];
                  return (
                    (r = e.call.apply(e, [this].concat(n)) || this),
                    o(r, "orderCardPrefab", B, i(r)),
                    o(r, "orderListContainer", E, i(r)),
                    o(r, "goldLabel", G, i(r)),
                    o(r, "flowerLabel", N, i(r)),
                    (r.orderManager = void 0),
                    (r.inventorySystem = void 0),
                    (r.onOrderCompleted = function () {
                      r.refreshOrders();
                    }),
                    (r.onGoldChanged = function (e) {
                      r.updateGoldLabel(e.newTotal);
                    }),
                    (r.onFlowerChanged = function (e) {
                      r.updateFlowerLabel(e.newTotal);
                    }),
                    r
                  );
                }
                t(r, e);
                var a = r.prototype;
                return (
                  (a.start = function () {
                    var e = m.getInstance();
                    ((this.inventorySystem = e.inventorySystem),
                      (this.orderManager = e.orderManager),
                      this.ensureFallbackUi(),
                      this.updateGoldLabel(0),
                      this.updateFlowerLabel(0),
                      g.on(b.ORDER_COMPLETED, this.onOrderCompleted),
                      g.on(b.GOLD_CHANGED, this.onGoldChanged),
                      g.on(b.FLOWER_CHANGED, this.onFlowerChanged),
                      this.orderManager.generateOrders(4),
                      this.refreshOrders());
                  }),
                  (a.onDestroy = function () {
                    (g.off(b.ORDER_COMPLETED, this.onOrderCompleted),
                      g.off(b.GOLD_CHANGED, this.onGoldChanged),
                      g.off(b.FLOWER_CHANGED, this.onFlowerChanged));
                  }),
                  (a.refreshOrders = function () {
                    var e = this.ensureOrderListContainer();
                    e.removeAllChildren();
                    var r = this.orderManager.getActiveOrders();
                    if (0 !== r.length)
                      for (var t, o = n(r); !(t = o()).done; ) {
                        var i = t.value;
                        this.createOrderCard(i);
                      }
                    else console.log("[ShopPanel] 当前无活跃订单。");
                    return;
                    if (this.orderListContainer && this.orderCardPrefab) {
                      this.orderListContainer.removeAllChildren();
                      var e = this.orderManager.getActiveOrders();
                      if (0 !== e.length)
                        for (var r, t = n(e); !(r = t()).done; ) {
                          var o = r.value;
                          this.createOrderCard(o);
                        }
                      else console.log("[ShopPanel] 当前无活跃订单。");
                    } else
                      console.warn(
                        "[ShopPanel] orderListContainer 或 orderCardPrefab 未绑定！",
                      );
                  }),
                  (a.createOrderCard = function (e) {
                    var r = this.ensureOrderListContainer(),
                      t = this;
                    if (!this.orderCardPrefab) {
                      var n = this.createFallbackOrderCard();
                      n.parent = r;
                      var o = r.children.length - 1;
                      n.setPosition && n.setPosition(0, 130 - 92 * o, 0);
                      var i = n.getChildByName("NameLabel");
                      i && (i.getComponent(u).string = e.customerName);
                      var a = n.getChildByName("RequirementLabel");
                      a &&
                        (a.getComponent(u).string = this.formatRequirements(
                          e.requirements,
                        ));
                      var l = n.getChildByName("RewardLabel");
                      l &&
                        ((l.getComponent(u).string =
                          "Gold +" +
                          e.rewardGold +
                          "  Flower +" +
                          e.rewardFlower),
                        (l.getComponent(u).color = new c(255, 215, 0)));
                      return void this.bindButtonClick(
                        this.findChildByName(n, "SubmitBtn"),
                        function () {
                          t.onSubmitOrder(e.orderId);
                        },
                        "SubmitBtn",
                      );
                    }
                    var r,
                      t,
                      n,
                      o = this,
                      i = h(this.orderCardPrefab);
                    i.parent = this.orderListContainer;
                    var a =
                      null == (r = i.getChildByName("NameLabel"))
                        ? void 0
                        : r.getComponent(u);
                    a && (a.string = e.customerName);
                    var l =
                      null == (t = i.getChildByName("RequirementLabel"))
                        ? void 0
                        : t.getComponent(u);
                    l && (l.string = this.formatRequirements(e.requirements));
                    var s =
                      null == (n = i.getChildByName("RewardLabel"))
                        ? void 0
                        : n.getComponent(u);
                    s &&
                      ((s.string =
                        "金币+" + e.rewardGold + "  花+" + e.rewardFlower),
                      (s.color = new c(255, 215, 0)));
                    var d = this.findChildByName(i, "SubmitBtn");
                    this.bindButtonClick(
                      d,
                      function () {
                        o.onSubmitOrder(e.orderId);
                      },
                      "SubmitBtn",
                    );
                  }),
                  (a.ensureFallbackUi = function () {
                    (this.ensureOrderListContainer(),
                      this.goldLabel ||
                        (this.goldLabel = this.createFallbackLabelNode(
                          "FallbackGoldLabel",
                          "Gold: 0",
                          -120,
                          205,
                          20,
                          new c(255, 215, 0),
                        )),
                      this.flowerLabel ||
                        (this.flowerLabel = this.createFallbackLabelNode(
                          "FallbackFlowerLabel",
                          "Flowers: 0",
                          90,
                          205,
                          20,
                          new c(255, 130, 180),
                        )));
                  }),
                  (a.ensureOrderListContainer = function () {
                    if (!this.orderListContainer) {
                      var e = new d("FallbackOrderList");
                      ((e.parent = this.node),
                        e.addComponent(p).setContentSize(360, 360),
                        e.setPosition && e.setPosition(0, -10, 0),
                        (this.orderListContainer = e));
                    }
                    return this.orderListContainer;
                  }),
                  (a.createFallbackOrderCard = function () {
                    var e = new d("FallbackOrderCard");
                    e.addComponent(p).setContentSize(330, 82);
                    var r = new d("SubmitBtn");
                    return (
                      this.createFallbackLabel(
                        e,
                        "NameLabel",
                        "",
                        0,
                        24,
                        18,
                        new c(255, 255, 255),
                        310,
                      ),
                      this.createFallbackLabel(
                        e,
                        "RequirementLabel",
                        "",
                        0,
                        0,
                        16,
                        new c(215, 235, 255),
                        310,
                      ),
                      this.createFallbackLabel(
                        e,
                        "RewardLabel",
                        "",
                        0,
                        -22,
                        16,
                        new c(255, 215, 0),
                        310,
                      ),
                      (r.parent = e),
                      r.addComponent(p).setContentSize(120, 30),
                      r.setPosition && r.setPosition(0, -54, 0),
                      this.createFallbackLabel(
                        r,
                        "SubmitLabel",
                        "Submit",
                        0,
                        0,
                        16,
                        new c(255, 255, 255),
                        110,
                      ),
                      this.ensureButton(r, 120, 30),
                      e
                    );
                  }),
                  (a.createFallbackLabel = function (e, r, t, n, o, i, a, l) {
                    var s = new d(r);
                    ((s.parent = e),
                      s.addComponent(p).setContentSize(null != l ? l : 260, 26),
                      s.setPosition && s.setPosition(n, o, 0));
                    var C = s.addComponent(u);
                    return (
                      (C.string = t),
                      (C.fontSize = i),
                      (C.color = a),
                      C
                    );
                  }),
                  (a.createFallbackLabelNode = function (e, r, t, n, o, i) {
                    return this.createFallbackLabel(
                      this.node,
                      e,
                      r,
                      t,
                      n,
                      o,
                      i,
                      190,
                    );
                  }),
                  (a.bindButtonClick = function (e, r, t) {
                    e
                      ? this.ensureButton(e, 140, 44).node.on(
                          f.EventType.CLICK,
                          r,
                          this,
                        )
                      : console.warn(
                          "[ShopPanel] " + t + " not found on order card.",
                        );
                  }),
                  (a.ensureButton = function (e, r, t) {
                    var n,
                      o = e.getComponent(p);
                    o || (o = e.addComponent(p));
                    var i = o.contentSize;
                    (!i || i.width <= 0 || i.height <= 0) &&
                      o.setContentSize(r, t);
                    var a =
                      null != (n = e.getComponent(f)) ? n : e.addComponent(f);
                    return ((a.interactable = !0), (a.target = e), a);
                  }),
                  (a.findChildByName = function (e, r) {
                    var t = e.getChildByName(r);
                    if (t) return t;
                    for (var o, i = n(e.children); !(o = i()).done; ) {
                      var a = o.value,
                        l = this.findChildByName(a, r);
                      if (l) return l;
                    }
                    return null;
                  }),
                  (a.formatRequirements = function (e) {
                    var r = {
                      LINE: "红线团",
                      BUTTON: "纽扣",
                      SCISSORS: "剪刀",
                      TAPE: "皮尺",
                      SEWING: "缝纫机",
                    };
                    return e
                      .map(function (e) {
                        var t;
                        return (
                          (null != (t = r[e.itemId]) ? t : e.itemId) +
                          " x" +
                          e.count
                        );
                      })
                      .join("  ");
                  }),
                  (a.onSubmitOrder = function (e) {
                    var r = this.orderManager.submitOrder(e);
                    r.success
                      ? (console.log("[ShopPanel] 订单 " + e + " 提交成功！"),
                        this.showToast("完成！"))
                      : (console.warn(
                          "[ShopPanel] 订单 " + e + " 提交失败: " + r.reason,
                        ),
                        this.showToast(
                          "订单不存在" === r.reason ? "订单已失效" : "材料不足",
                        ));
                  }),
                  (a.updateGoldLabel = function (e) {
                    this.goldLabel && (this.goldLabel.string = "金币: " + e);
                  }),
                  (a.updateFlowerLabel = function (e) {
                    this.flowerLabel && (this.flowerLabel.string = "花: " + e);
                  }),
                  (a.showToast = function (e) {
                    console.log("[ShopPanel] Toast: " + e);
                  }),
                  r
                );
              })(C)).prototype,
              "orderCardPrefab",
              [L],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return null;
                },
              },
            )),
            (E = r(P.prototype, "orderListContainer", [w], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (G = r(P.prototype, "goldLabel", [y], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (N = r(P.prototype, "flowerLabel", [S], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (O = P)),
          ) || O),
        );
        a._RF.pop();
      },
    };
  },
);

System.register("chunks:///_virtual/types.ts", ["cc"], function (e) {
  var E;
  return {
    setters: [
      function (e) {
        E = e.cclegacy;
      },
    ],
    execute: function () {
      E._RF.push({}, "08e13igWK9GV5ReanT6IzYH", "types", void 0);
      (e(
        "ElementType",
        (function (e) {
          return (
            (e.LINE = "LINE"),
            (e.BUTTON = "BUTTON"),
            (e.SCISSORS = "SCISSORS"),
            (e.TAPE = "TAPE"),
            (e.SEWING = "SEWING"),
            e
          );
        })({}),
      ),
        e(
          "SpecialType",
          (function (e) {
            return (
              (e.NONE = "NONE"),
              (e.SHUTTLE = "SHUTTLE"),
              (e.IRON = "IRON"),
              (e.RAINBOW = "RAINBOW"),
              e
            );
          })({}),
        ),
        e(
          "DressPart",
          (function (e) {
            return (
              (e.HAIR = "HAIR"),
              (e.TOP = "TOP"),
              (e.BOTTOM = "BOTTOM"),
              (e.SHOES = "SHOES"),
              (e.ACCESSORY = "ACCESSORY"),
              e
            );
          })({}),
        ),
        e(
          "StyleTag",
          (function (e) {
            return (
              (e.SWEET = "SWEET"),
              (e.RETRO = "RETRO"),
              (e.CYBER = "CYBER"),
              (e.CUTE = "CUTE"),
              e
            );
          })({}),
        ),
        e("GameEvent", {
          MATCH_FOUND: "match:found",
          MATCH_CLEARED: "match:cleared",
          CELLS_DROPPED: "cells:dropped",
          GRID_STABLE: "grid:stable",
          ITEM_ADDED: "item:added",
          ITEM_REMOVED: "item:removed",
          ORDER_CREATED: "order:created",
          ORDER_SUBMITTED: "order:submitted",
          ORDER_COMPLETED: "order:completed",
          DRESS_CHANGED: "dress:changed",
          STYLE_BONUS_CHANGED: "style:bonus_changed",
          DOLL_MOOD_CHANGED: "doll:mood_changed",
          GOLD_CHANGED: "gold:changed",
          FLOWER_CHANGED: "flower:changed",
          GAME_SAVED: "game:saved",
          GAME_LOADED: "game:loaded",
        }));
      E._RF.pop();
    },
  };
});

(function (r) {
  r("virtual:///prerequisite-imports/main", "chunks:///_virtual/main");
})(function (mid, cid) {
  System.register(mid, [cid], function (_export, _context) {
    return {
      setters: [
        function (_m) {
          var _exportObj = {};

          for (var _key in _m) {
            if (_key !== "default" && _key !== "__esModule")
              _exportObj[_key] = _m[_key];
          }

          _export(_exportObj);
        },
      ],
      execute: function () {},
    };
  });
});
