System.register("chunks:///_virtual/CellComponent.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Sprite, Node, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Node = module.Node;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "f8eefyOtMZE95iNOmmviVJ3", "CellComponent", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 单个棋子组件。
       *
       * 每个 CellComponent 代表棋盘上的一个棋子，
       * 持有自己的行列坐标，点击时通知父节点进行交互处理。
       */
      var CellComponent = exports('CellComponent', (_dec = ccclass('CellComponent'), _dec2 = property({
        type: Sprite,
        tooltip: '棋子精灵组件'
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(CellComponent, _Component);
        function CellComponent() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          /** 棋子精灵（在编辑器中绑定） */
          _initializerDefineProperty(_this, "sprite", _descriptor, _assertThisInitialized(_this));
          /** 棋子所在行号 */
          _this.row = 0;
          /** 棋子所在列号 */
          _this.col = 0;
          return _this;
        }
        var _proto = CellComponent.prototype;
        // ==========================================================
        // 生命周期
        // ==========================================================
        _proto.onLoad = function onLoad() {
          // 注册触摸事件
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        };
        _proto.onDestroy = function onDestroy() {
          // 清理触摸事件监听
          this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        // ==========================================================
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
         */;
        _proto.setup = function setup(row, col, cellType) {
          this.row = row;
          this.col = col;
          this.node.name = "Cell_" + row + "_" + col + "_" + cellType;
        }

        // ==========================================================
        // 事件处理
        // ==========================================================

        /**
         * 触摸结束事件处理。
         *
         * 通过字符串获取父节点上的 Match3GridComponent 组件，
         * 并调用其 onCellClicked 方法传递当前棋子的行列坐标。
         * 使用字符串方式避免循环引用问题。
         *
         * @param _event - 触摸事件对象（此处未使用）
         */;
        _proto.onTouchEnd = function onTouchEnd(_event) {
          var _this$node$parent;
          // 通过字符串名获取组件，避免与 Match3GridComponent 产生循环 import
          var grid = (_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponent('Match3GridComponent');
          if (grid) {
            grid.onCellClicked(this.row, this.col);
          }
        };
        return CellComponent;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DressRoomPanel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './MainGameFlow.ts', './EventBus.ts', './index7.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _createForOfIteratorHelperLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Sprite, Node, Prefab, Label, Color, instantiate, Button, resources, SpriteFrame, Component, MainGameFlow, eventBus, DressPart, GameEvent, StyleTag;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Node = module.Node;
      Prefab = module.Prefab;
      Label = module.Label;
      Color = module.Color;
      instantiate = module.instantiate;
      Button = module.Button;
      resources = module.resources;
      SpriteFrame = module.SpriteFrame;
      Component = module.Component;
    }, function (module) {
      MainGameFlow = module.MainGameFlow;
    }, function (module) {
      eventBus = module.eventBus;
    }, function (module) {
      DressPart = module.DressPart;
      GameEvent = module.GameEvent;
      StyleTag = module.StyleTag;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
      cclegacy._RF.push({}, "d61a6Ss2DJNU6U3xahbzYKh", "DressRoomPanel", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      /**
       * 换装房间面板。
       *
       * 交互流程：
       * 1. 玩家点击顶部 Tab 切换部位
       * 2. 右侧列表展示该部位所有可用服装
       * 3. 点击某件服装 → 娃模型即时更新
       * 4. 底部显示当前风格计分和 Buff
       */
      var DressRoomPanel = exports('DressRoomPanel', (_dec = ccclass('DressRoomPanel'), _dec2 = property({
        type: Sprite,
        tooltip: '娃预览图 Sprite'
      }), _dec3 = property({
        type: Node,
        tooltip: '部位 Tab 容器节点'
      }), _dec4 = property({
        type: Node,
        tooltip: '服装列表容器节点'
      }), _dec5 = property({
        type: Prefab,
        tooltip: '服装列表项预制体（含 Label、Sprite、Button）'
      }), _dec6 = property({
        type: Label,
        tooltip: '风格计分标签'
      }), _dec7 = property({
        type: Label,
        tooltip: 'Buff 效果标签'
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(DressRoomPanel, _Component);
        function DressRoomPanel() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          // ---- @property 属性（在编辑器中绑定） ----
          /** 娃预览 Sprite（简化版预览，生产环境建议用 Spine） */
          _initializerDefineProperty(_this, "dollPreview", _descriptor, _assertThisInitialized(_this));
          /** 部位 Tab 按钮容器（含 5 个子节点：HAIR/TOP/BOTTOM/SHOES/ACCESSORY） */
          _initializerDefineProperty(_this, "tabContainer", _descriptor2, _assertThisInitialized(_this));
          /** 服装列表容器（ScrollView 的 content 节点） */
          _initializerDefineProperty(_this, "itemListContainer", _descriptor3, _assertThisInitialized(_this));
          /** 服装列表项预制体 */
          _initializerDefineProperty(_this, "itemPrefab", _descriptor4, _assertThisInitialized(_this));
          /** 风格计分标签 */
          _initializerDefineProperty(_this, "styleScoreLabel", _descriptor5, _assertThisInitialized(_this));
          /** Buff 效果标签 */
          _initializerDefineProperty(_this, "buffLabel", _descriptor6, _assertThisInitialized(_this));
          // ---- 私有成员 ----
          /** 换装管理器引用（来自 MainGameFlow 单例） */
          _this.dressUpManager = void 0;
          /** 当前选中的部位 */
          _this.currentPart = DressPart.HAIR;
          /** 服装目录（所有可用服装数据） */
          _this.catalog = [];
          // ==========================================================
          // 事件回调
          // ==========================================================
          /**
           * 换装事件回调（由 DRESS_CHANGED 事件触发）。
           * 自动刷新娃预览和 Buff/计分显示。
           */
          _this.onDressChanged = function () {
            _this.refreshDollPreview();
            _this.refreshBuffDisplay();
          };
          return _this;
        }
        var _proto = DressRoomPanel.prototype;
        // ==========================================================
        // 生命周期
        // ==========================================================
        _proto.onLoad = function onLoad() {
          // 从全局协调器获取系统实例
          var mgf = MainGameFlow.getInstance();
          this.dressUpManager = mgf.dressUpManager;

          // 初始化服装目录（每个部位至少 2 件）
          this.initCatalog();

          // 绑定 Tab 按钮事件
          this.initTabs();

          // 默认显示 HAIR 部位
          this.switchTab(DressPart.HAIR);

          // 监听换装事件 → 自动刷新预览和 Buff 显示
          eventBus.on(GameEvent.DRESS_CHANGED, this.onDressChanged);

          // 初始化预览
          this.refreshDollPreview();
          this.refreshBuffDisplay();
        };
        _proto.onDestroy = function onDestroy() {
          // 清理事件监听
          eventBus.off(GameEvent.DRESS_CHANGED, this.onDressChanged);
        }

        // ==========================================================
        // 服装目录初始化
        // ==========================================================

        /**
         * 初始化内置服装目录。
         *
         * 每个部位至少 2 件衣服，覆盖 4 种风格。
         * 部分衣服带有三消 Buff（COIN_BONUS / START_BOMB / EXTRA_MOVE）。
         */;
        _proto.initCatalog = function initCatalog() {
          this.catalog = [
          // ---- 头发 ----
          {
            id: 'hair_01',
            part: DressPart.HAIR,
            slotName: 'hair',
            attachmentName: 'hair_sweet_pink',
            style: StyleTag.SWEET,
            matchBuff: {
              type: 'COIN_BONUS',
              value: 10
            }
          }, {
            id: 'hair_02',
            part: DressPart.HAIR,
            slotName: 'hair',
            attachmentName: 'hair_cyber_neon',
            style: StyleTag.CYBER
          }, {
            id: 'hair_03',
            part: DressPart.HAIR,
            slotName: 'hair',
            attachmentName: 'hair_retro_curl',
            style: StyleTag.RETRO
          },
          // ---- 上衣 ----
          {
            id: 'top_01',
            part: DressPart.TOP,
            slotName: 'top',
            attachmentName: 'top_sweet_lace',
            style: StyleTag.SWEET,
            matchBuff: {
              type: 'START_BOMB',
              value: 1
            }
          }, {
            id: 'top_02',
            part: DressPart.TOP,
            slotName: 'top',
            attachmentName: 'top_cute_hoodie',
            style: StyleTag.CUTE,
            matchBuff: {
              type: 'COIN_BONUS',
              value: 15
            }
          }, {
            id: 'top_03',
            part: DressPart.TOP,
            slotName: 'top',
            attachmentName: 'top_cyber_jacket',
            style: StyleTag.CYBER,
            isFullDress: false
          },
          // ---- 下装 ----
          {
            id: 'bottom_01',
            part: DressPart.BOTTOM,
            slotName: 'bottom',
            attachmentName: 'bottom_sweet_skirt',
            style: StyleTag.SWEET
          }, {
            id: 'bottom_02',
            part: DressPart.BOTTOM,
            slotName: 'bottom',
            attachmentName: 'bottom_retro_pants',
            style: StyleTag.RETRO,
            matchBuff: {
              type: 'EXTRA_MOVE',
              value: 3
            }
          }, {
            id: 'bottom_03',
            part: DressPart.BOTTOM,
            slotName: 'bottom',
            attachmentName: 'bottom_cute_shorts',
            style: StyleTag.CUTE
          },
          // ---- 鞋子 ----
          {
            id: 'shoes_01',
            part: DressPart.SHOES,
            slotName: 'shoes',
            attachmentName: 'shoes_sweet_maryjane',
            style: StyleTag.SWEET
          }, {
            id: 'shoes_02',
            part: DressPart.SHOES,
            slotName: 'shoes',
            attachmentName: 'shoes_cyber_boots',
            style: StyleTag.CYBER,
            matchBuff: {
              type: 'COIN_BONUS',
              value: 5
            }
          }, {
            id: 'shoes_03',
            part: DressPart.SHOES,
            slotName: 'shoes',
            attachmentName: 'shoes_retro_heels',
            style: StyleTag.RETRO
          },
          // ---- 配饰 ----
          {
            id: 'acc_01',
            part: DressPart.ACCESSORY,
            slotName: 'accessory',
            attachmentName: 'acc_sweet_bow',
            style: StyleTag.SWEET
          }, {
            id: 'acc_02',
            part: DressPart.ACCESSORY,
            slotName: 'accessory',
            attachmentName: 'acc_cute_cat_ears',
            style: StyleTag.CUTE,
            matchBuff: {
              type: 'EXTRA_MOVE',
              value: 2
            }
          }, {
            id: 'acc_03',
            part: DressPart.ACCESSORY,
            slotName: 'accessory',
            attachmentName: 'acc_cyber_goggles',
            style: StyleTag.CYBER
          }];
        }

        // ==========================================================
        // Tab 初始化
        // ==========================================================

        /**
         * 为 tabContainer 中的每个子节点绑定点击事件。
         *
         * 子节点命名约定：HAIR / TOP / BOTTOM / SHOES / ACCESSORY。
         * 根据子节点名称匹配对应的 DressPart 枚举值。
         */;
        _proto.initTabs = function initTabs() {
          var _this2 = this;
          if (!this.tabContainer) return;
          var partMap = {
            HAIR: DressPart.HAIR,
            TOP: DressPart.TOP,
            BOTTOM: DressPart.BOTTOM,
            SHOES: DressPart.SHOES,
            ACCESSORY: DressPart.ACCESSORY
          };
          var _loop = function _loop() {
            var child = _step.value;
            var part = partMap[child.name];
            if (!part) return 1; // continue
            var btn = child.getComponent(Button);
            if (btn) {
              btn.node.on(Button.EventType.CLICK, function () {
                _this2.switchTab(part);
              }, _this2);
            }
          };
          for (var _iterator = _createForOfIteratorHelperLoose(this.tabContainer.children), _step; !(_step = _iterator()).done;) {
            if (_loop()) continue;
          }
        }

        // ==========================================================
        // Tab 切换
        // ==========================================================

        /**
         * 切换到指定部位 Tab。
         *
         * 更新当前选中状态，清空并重新填充服装列表。
         *
         * @param part - 目标部位
         */;
        _proto.switchTab = function switchTab(part) {
          this.currentPart = part;

          // 更新 Tab 高亮状态
          this.updateTabHighlight(part);

          // 清空当前列表
          if (this.itemListContainer) {
            this.itemListContainer.removeAllChildren();
          }

          // 筛选该部位的服装并创建列表项
          var items = this.catalog.filter(function (att) {
            return att.part === part;
          });
          for (var _iterator2 = _createForOfIteratorHelperLoose(items), _step2; !(_step2 = _iterator2()).done;) {
            var attachment = _step2.value;
            this.createItemButton(attachment);
          }
        }

        /**
         * 更新 Tab 按钮的高亮显示。
         *
         * 当前选中的 Tab 按钮颜色变亮，其余恢复默认。
         *
         * @param activePart - 当前选中的部位
         */;
        _proto.updateTabHighlight = function updateTabHighlight(activePart) {
          if (!this.tabContainer) return;
          var partMap = {
            HAIR: DressPart.HAIR,
            TOP: DressPart.TOP,
            BOTTOM: DressPart.BOTTOM,
            SHOES: DressPart.SHOES,
            ACCESSORY: DressPart.ACCESSORY
          };
          for (var _iterator3 = _createForOfIteratorHelperLoose(this.tabContainer.children), _step3; !(_step3 = _iterator3()).done;) {
            var child = _step3.value;
            var part = partMap[child.name];
            if (!part) continue;
            var label = child.getComponentInChildren(Label);
            if (label) {
              label.color = part === activePart ? new Color(255, 255, 255) // 选中：白色
              : new Color(120, 120, 120); // 未选中：灰色
            }
          }
        }

        // ==========================================================
        // 服装列表项创建
        // ==========================================================

        /**
         * 创建一个服装列表按钮。
         *
         * 如果 itemPrefab 已绑定，使用预制体实例化；
         * 否则动态创建一个简单节点。
         *
         * 按钮显示服装名称 + 风格标签，点击后触发换装。
         *
         * @param attachment - 服装附件数据
         */;
        _proto.createItemButton = function createItemButton(attachment) {
          var _this3 = this;
          if (!this.itemListContainer) return;
          var itemNode;
          if (this.itemPrefab) {
            // 使用预制体
            itemNode = instantiate(this.itemPrefab);
          } else {
            // 动态创建简易节点（无预制体时的后备方案）
            itemNode = new Node('Item_' + attachment.id);
            itemNode.addComponent(Button);
            var labelComp = itemNode.addComponent(Label);
            labelComp.string = attachment.id + " [" + attachment.style + "]";
            labelComp.fontSize = 20;
            labelComp.color = new Color(255, 255, 255);
          }
          itemNode.parent = this.itemListContainer;

          // 设置显示文本
          var label = itemNode.getComponentInChildren(Label);
          if (label) {
            var _styleNames$attachmen;
            var styleNames = {
              SWEET: '甜美',
              RETRO: '复古',
              CYBER: '赛博',
              CUTE: '可爱'
            };
            var styleName = (_styleNames$attachmen = styleNames[attachment.style]) != null ? _styleNames$attachmen : attachment.style;
            label.string = attachment.id + " [" + styleName + "]";
            // 若带 Buff 则追加标记
            if (attachment.matchBuff) {
              label.string += " \u2605B";
            }
          }

          // 绑定点击事件
          var btn = itemNode.getComponent(Button);
          if (btn) {
            btn.node.on(Button.EventType.CLICK, function () {
              _this3.onItemClick(attachment);
            }, this);
          }
        }

        // ==========================================================
        // 换装交互
        // ==========================================================

        /**
         * 点击服装列表项 → 执行换装。
         *
         * 调用 DressUpManager.changeEquipment，成功后自动触发
         * DRESS_CHANGED 事件 → onDressChanged 回调刷新预览和 Buff。
         *
         * @param attachment - 选中的服装附件
         */;
        _proto.onItemClick = function onItemClick(attachment) {
          var result = this.dressUpManager.changeEquipment(attachment.part, attachment);
          if (result.success) {
            console.log("[DressRoomPanel] \u6362\u88C5\u6210\u529F: " + attachment.id);
            if (result.replaced) {
              console.log("[DressRoomPanel]   \u66FF\u6362\u4E86\u65E7\u88C5: " + result.replaced.id);
            }
          }
        }

        // ==========================================================
        // 预览刷新
        // ==========================================================

        /**
         * 根据当前穿戴状态刷新娃预览图。
         *
         * 按部位顺序叠加（HAIR → TOP → BOTTOM → SHOES → ACCESSORY）。
         * 简化版实现：通过 resources.load 加载各部位对应的 SpriteFrame。
         *
         * 生产环境建议使用 Spine 骨骼动画代替 Sprite 叠加。
         */;
        _proto.refreshDollPreview = function refreshDollPreview() {
          var _this4 = this;
          if (!this.dollPreview) return;
          var currentDress = this.dressUpManager.getCurrentDress();

          // 部位叠层顺序（后渲染的在上层）
          var partOrder = [DressPart.SHOES, DressPart.BOTTOM, DressPart.TOP, DressPart.ACCESSORY, DressPart.HAIR];

          // 尝试加载第一个有效部位的精灵帧作为预览
          // （简化版：显示最后一个已穿戴部位对应的精灵）
          for (var i = partOrder.length - 1; i >= 0; i--) {
            var part = partOrder[i];
            var attachment = currentDress[part];
            if (attachment) {
              // 尝试从 resources 加载对应精灵帧
              var path = "dress_preview/" + attachment.id;
              resources.load(path, SpriteFrame, function (err, spriteFrame) {
                if (!err && spriteFrame && _this4.dollPreview) {
                  _this4.dollPreview.spriteFrame = spriteFrame;
                }
              });
              return;
            }
          }

          // 无穿戴 → 显示默认素体
          resources.load('dress_preview/default', SpriteFrame, function (err, sf) {
            if (!err && sf && _this4.dollPreview) {
              _this4.dollPreview.spriteFrame = sf;
            }
          });
        }

        /**
         * 刷新 Buff 和风格计分显示。
         *
         * - buffLabel: 当前生效的三消 Buff 列表
         * - styleScoreLabel: 四种风格的当前得分
         */;
        _proto.refreshBuffDisplay = function refreshBuffDisplay() {
          var _this5 = this;
          // ---- Buff 显示 ----
          if (this.buffLabel) {
            var buffs = this.dressUpManager.getActiveBuffs();
            if (buffs.length === 0) {
              this.buffLabel.string = '当前无 Buff';
            } else {
              var buffNames = {
                COIN_BONUS: '金币加成',
                START_BOMB: '开局炸弹',
                EXTRA_MOVE: '额外步数'
              };
              var lines = buffs.map(function (b) {
                var _buffNames$b$type;
                return ((_buffNames$b$type = buffNames[b.type]) != null ? _buffNames$b$type : b.type) + ": +" + b.value;
              });
              this.buffLabel.string = 'Buff: ' + lines.join(' | ');
            }
          }

          // ---- 风格计分 ----
          if (this.styleScoreLabel) {
            var styles = [StyleTag.SWEET, StyleTag.RETRO, StyleTag.CYBER, StyleTag.CUTE];
            var styleNames = {
              SWEET: '甜美',
              RETRO: '复古',
              CYBER: '赛博',
              CUTE: '可爱'
            };
            var _lines = styles.map(function (s) {
              var score = _this5.dressUpManager.getStyleScore(s);
              return styleNames[s] + ": " + score;
            });
            this.styleScoreLabel.string = '风格计分: ' + _lines.join(' | ');
          }
        };
        return DressRoomPanel;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dollPreview", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tabContainer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "itemListContainer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "itemPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "styleScoreLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "buffLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DressUpManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index7.ts', './EventBus.ts'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, cclegacy, DressPart, GameEvent, eventBus;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      DressPart = module.DressPart;
      GameEvent = module.GameEvent;
    }, function (module) {
      eventBus = module.eventBus;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5c0db948M5GFbhd46E3tFla", "DressUpManager", undefined);

      /** 扩展 DressAttachment，支持连衣裙标记 */

      /**
       * 换装管理器
       *
       * 负责管理当前娃的所有穿戴部位，提供换装、卸装、
       * 风格计分、Buff 收集以及存档序列化等功能。
       */
      var DressUpManager = exports('DressUpManager', /*#__PURE__*/function () {
        function DressUpManager() {
          /** 当前穿戴状态：部位 → 服装 */
          this.dress = {};
        }
        var _proto = DressUpManager.prototype;
        // ==========================================================
        // 换装 / 卸装
        // ==========================================================
        /**
         * 给指定部位换上衣服
         *
         * 如果该部位已有衣服，旧衣服会被替换并返回。
         * 如果穿的是连衣裙（`isFullDress: true`），会自动卸下 BOTTOM 部位。
         *
         * 换装成功后发射 `dress:changed` 和 `style:bonus_changed` 事件。
         *
         * @param part       要换装的部位
         * @param attachment 要穿上的衣服附件
         * @returns `success` 表示是否成功，`replaced` 为被替换的旧衣服（如有）
         */
        _proto.changeEquipment = function changeEquipment(part, attachment) {
          var replaced = this.dress[part];
          this.dress[part] = attachment;

          // 连衣裙规则：如果 TOP 是连衣裙，自动卸下 BOTTOM
          if (part === DressPart.TOP) {
            var fullDress = attachment;
            if (fullDress.isFullDress) {
              delete this.dress[DressPart.BOTTOM];
            }
          }

          // 发射事件
          eventBus.emit(GameEvent.DRESS_CHANGED, {
            part: part,
            attachment: attachment
          });
          this.emitBuffChanged();
          return _extends({
            success: true
          }, replaced ? {
            replaced: replaced
          } : {});
        }

        /**
         * 卸下指定部位的服装
         *
         * 如果该部位没有衣服，不会报错。
         * 卸下后发射 `dress:changed` 和 `style:bonus_changed` 事件。
         *
         * @param part 要卸下的部位
         */;
        _proto.removeEquipment = function removeEquipment(part) {
          delete this.dress[part];
          eventBus.emit(GameEvent.DRESS_CHANGED, {
            part: part,
            attachment: undefined
          });
          this.emitBuffChanged();
        }

        /**
         * 获取当前全部穿戴状态
         *
         * @returns 部位到服装附件的映射（未穿戴的部位不出现在结果中）
         */;
        _proto.getCurrentDress = function getCurrentDress() {
          return _extends({}, this.dress);
        }

        // ==========================================================
        // 风格计分
        // ==========================================================

        /**
         * 获取指定风格的当前总分
         *
         * 每件衣服价值 1 分，同一 style 累加。
         *
         * @param style 风格标签
         * @returns 该风格的总分
         */;
        _proto.getStyleScore = function getStyleScore(style) {
          var score = 0;
          for (var _i = 0, _Object$values = Object.values(this.dress); _i < _Object$values.length; _i++) {
            var attachment = _Object$values[_i];
            if (attachment && attachment.style === style) {
              score += 1;
            }
          }
          return score;
        }

        // ==========================================================
        // Buff 收集
        // ==========================================================

        /**
         * 获取当前生效的三消 Buff 列表
         *
         * 收集所有已穿戴衣服的 `matchBuff`，按 type 去重：
         * 同一 type 的 Buff 取最大 value。
         *
         * @returns 去重后的 Buff 列表
         */;
        _proto.getActiveBuffs = function getActiveBuffs() {
          var buffMap = new Map();
          for (var _i2 = 0, _Object$values2 = Object.values(this.dress); _i2 < _Object$values2.length; _i2++) {
            var attachment = _Object$values2[_i2];
            if (attachment && attachment.matchBuff) {
              var _attachment$matchBuff = attachment.matchBuff,
                type = _attachment$matchBuff.type,
                value = _attachment$matchBuff.value;
              var current = buffMap.get(type);
              if (current === undefined || value > current) {
                buffMap.set(type, value);
              }
            }
          }
          return Array.from(buffMap.entries()).map(function (_ref) {
            var type = _ref[0],
              value = _ref[1];
            return {
              type: type,
              value: value
            };
          });
        }

        // ==========================================================
        // 序列化 / 反序列化
        // ==========================================================

        /**
         * 将当前穿戴状态序列化为存档格式
         *
         * @returns 部位 → attachmentId 的映射
         */;
        _proto.toJSON = function toJSON() {
          var result = {};
          for (var _i3 = 0, _Object$entries = Object.entries(this.dress); _i3 < _Object$entries.length; _i3++) {
            var _Object$entries$_i = _Object$entries[_i3],
              part = _Object$entries$_i[0],
              attachment = _Object$entries$_i[1];
            if (attachment) {
              result[part] = attachment.id;
            }
          }
          return result;
        }

        /**
         * 从存档数据恢复穿戴状态
         *
         * 根据 catalog 查找对应的 DressAttachment。
         * catalog 中找不到的 id 会被静默忽略。
         * 此方法会**覆盖**当前所有穿戴状态。
         *
         * @param data    存档中的部位 → attachmentId 映射
         * @param catalog 可用服装目录，用于查找 DressAttachment
         */;
        _proto.fromJSON = function fromJSON(data, catalog) {
          // 构建 catalog 查找表
          var catalogMap = new Map();
          for (var _iterator = _createForOfIteratorHelperLoose(catalog), _step; !(_step = _iterator()).done;) {
            var item = _step.value;
            catalogMap.set(item.id, item);
          }

          // 清空当前穿戴
          this.dress = {};

          // 从 data 还原
          for (var _i4 = 0, _Object$entries2 = Object.entries(data); _i4 < _Object$entries2.length; _i4++) {
            var _Object$entries2$_i = _Object$entries2[_i4],
              part = _Object$entries2$_i[0],
              attachmentId = _Object$entries2$_i[1];
            var attachment = catalogMap.get(attachmentId);
            if (attachment) {
              this.dress[part] = attachment;
            }
          }
        }

        // ==========================================================
        // 内部方法
        // ==========================================================

        /** 发射 style:bonus_changed 事件 */;
        _proto.emitBuffChanged = function emitBuffChanged() {
          eventBus.emit(GameEvent.STYLE_BONUS_CHANGED, {
            buffs: this.getActiveBuffs()
          });
        };
        return DressUpManager;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EventBus.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6dee3ec3hZGmJWlqxvzMbuA", "EventBus", undefined); // ============================================================
      // 全局事件总线 — 模块间唯一通信通道
      //
      // 架构铁律：模块之间严禁直接引用。所有跨模块通信
      // 必须通过 EventBus，发送方 emit，接收方 on/once。
      //
      // 例如：
      //   Match3Engine 消除后 → EventBus.emit(GameEvent.MATCH_CLEARED, payload)
      //   InventorySystem 监听 → EventBus.on(GameEvent.MATCH_CLEARED, handler)
      // ============================================================
      var EventBus = /*#__PURE__*/function () {
        function EventBus() {
          this.listeners = new Map();
        }
        var _proto = EventBus.prototype;
        /** 订阅事件 */
        _proto.on = function on(event, listener) {
          if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
          }
          this.listeners.get(event).add(listener);
        }

        /** 订阅一次（触发后自动取消） */;
        _proto.once = function once(event, listener) {
          var _this = this;
          var wrapper = function wrapper() {
            _this.off(event, wrapper);
            listener.apply(void 0, arguments);
          };
          this.on(event, wrapper);
        }

        /** 取消订阅 */;
        _proto.off = function off(event, listener) {
          var _this$listeners$get;
          (_this$listeners$get = this.listeners.get(event)) == null || _this$listeners$get["delete"](listener);
        }

        /** 发射事件 */;
        _proto.emit = function emit(event) {
          var set = this.listeners.get(event);
          if (!set) return;
          // 复制一份再遍历，防止回调中修改 set
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          for (var _i = 0, _arr = [].concat(set); _i < _arr.length; _i++) {
            var listener = _arr[_i];
            try {
              listener.apply(void 0, args);
            } catch (e) {
              console.error("[EventBus] Error in listener for \"" + event + "\":", e);
            }
          }
        }

        /** 清空所有监听（仅用于测试重置） */;
        _proto.reset = function reset() {
          this.listeners.clear();
        }

        /** 调试：列出所有事件及其监听数 */;
        _proto.debug = function debug() {
          var lines = [];
          for (var _iterator = _createForOfIteratorHelperLoose(this.listeners), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
              event = _step$value[0],
              set = _step$value[1];
            lines.push("  " + event + ": " + set.size + " listener(s)");
          }
          return lines.length ? lines.join('\n') : '  (empty)';
        };
        return EventBus;
      }(); // 全局单例
      var eventBus = exports('eventBus', new EventBus());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index.ts", ['cc', './SaveManager.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('SaveManager', module.SaveManager);
    }],
    execute: function () {
      cclegacy._RF.push({}, "19dc3XTHZ9CUYYh73Jzy9D1", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index2.ts", ['cc', './OrderManager.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('OrderManager', module.OrderManager);
    }],
    execute: function () {
      cclegacy._RF.push({}, "2081b5G2slMUaUMo5J7G4Qj", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index3.ts", ['cc', './EventBus.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('eventBus', module.eventBus);
    }],
    execute: function () {
      cclegacy._RF.push({}, "2c7eamyWxdO8LCkHzIVmSfZ", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index4.ts", ['cc', './Match3Engine.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('Match3Engine', module.Match3Engine);
    }],
    execute: function () {
      cclegacy._RF.push({}, "2e19fxTa2NDpaToJolrZO3T", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index5.ts", ['cc', './DressUpManager.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('DressUpManager', module.DressUpManager);
    }],
    execute: function () {
      cclegacy._RF.push({}, "807bf2WBpBGsq3RTwQY3vNO", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index6.ts", ['cc', './InventorySystem.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('InventorySystem', module.InventorySystem);
    }],
    execute: function () {
      cclegacy._RF.push({}, "b1bcb3al+5GxqZOVSwzgSVl", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index7.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b48c2nLdVVKTbwlZ6VopQfy", "index", undefined);
      // ============================================================
      // 衣橱物语 — 全局类型定义
      // 所有模块共享的类型，不依赖任何具体实现
      // ============================================================

      // ---- 三消 (Match-3) ----

      /** 棋子类型：线团、纽扣、剪刀、皮尺、缝纫机 */
      var ElementType = exports('ElementType', /*#__PURE__*/function (ElementType) {
        ElementType["LINE"] = "LINE";
        ElementType["BUTTON"] = "BUTTON";
        ElementType["SCISSORS"] = "SCISSORS";
        ElementType["TAPE"] = "TAPE";
        ElementType["SEWING"] = "SEWING";
        return ElementType;
      }({}));

      /** 特殊道具（4连/5连生成） */
      var SpecialType = exports('SpecialType', /*#__PURE__*/function (SpecialType) {
        SpecialType["NONE"] = "NONE";
        SpecialType["SHUTTLE"] = "SHUTTLE";
        SpecialType["IRON"] = "IRON";
        SpecialType["RAINBOW"] = "RAINBOW";
        return SpecialType;
      }({})); // 彩虹布：清除同色全部（5连）

      /** 单个棋子 */

      /** 一个匹配组（可消除） */

      /** 棋盘配置 */

      // ---- 换装 (Dress-up) ----

      var DressPart = exports('DressPart', /*#__PURE__*/function (DressPart) {
        DressPart["HAIR"] = "HAIR";
        DressPart["TOP"] = "TOP";
        DressPart["BOTTOM"] = "BOTTOM";
        DressPart["SHOES"] = "SHOES";
        DressPart["ACCESSORY"] = "ACCESSORY";
        return DressPart;
      }({}));
      var StyleTag = exports('StyleTag', /*#__PURE__*/function (StyleTag) {
        StyleTag["SWEET"] = "SWEET";
        StyleTag["RETRO"] = "RETRO";
        StyleTag["CYBER"] = "CYBER";
        StyleTag["CUTE"] = "CUTE";
        return StyleTag;
      }({})); // 可爱

      /** 一个服装附件 */

      /** 三消被动 Buff */

      // ---- 背包/库存 (Inventory) ----

      // ---- 订单 (Order) ----

      // ---- 存档 (Save) ----

      // ---- 事件（全局事件总线） ----
      /** 事件名常量 */
      var GameEvent = exports('GameEvent', {
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
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/InventorySystem.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './EventBus.ts', './index7.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, eventBus, GameEvent;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      eventBus = module.eventBus;
    }, function (module) {
      GameEvent = module.GameEvent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f0706dAeh1IfbWOeTvxjIzV", "InventorySystem", undefined);
      /**
       * 通用背包系统。
       *
       * 管理物品 ID → 数量的映射，支持：
       * - 添加/移除物品（原子操作）
       * - 数量查询
       * - 序列化/反序列化
       * - 事件发射（item:added / item:removed）
       *
       * 本系统完全通用，不依赖任何物品语义。
       */
      var InventorySystem = exports('InventorySystem', /*#__PURE__*/function () {
        function InventorySystem() {
          /** 内部存储：itemId → count */
          this.items = new Map();
        }
        var _proto = InventorySystem.prototype;
        /**
         * 添加物品。
         *
         * 数量必须为正整数，否则忽略本次操作。
         * 发射 `item:added` 事件。
         *
         * @param itemId - 物品 ID
         * @param count - 添加数量，必须 > 0 且为整数
         */
        _proto.addItem = function addItem(itemId, count) {
          var _this$items$get;
          if (!Number.isInteger(count) || count <= 0) return;
          var current = (_this$items$get = this.items.get(itemId)) != null ? _this$items$get : 0;
          var newTotal = current + count;
          this.items.set(itemId, newTotal);
          eventBus.emit(GameEvent.ITEM_ADDED, {
            itemId: itemId,
            count: count,
            newTotal: newTotal
          });
        }

        /**
         * 移除物品（原子操作：要么全扣，要么全不扣）。
         *
         * @param itemId - 物品 ID
         * @param count - 移除数量，必须 > 0 且为整数
         * @returns 是否成功移除
         */;
        _proto.removeItem = function removeItem(itemId, count) {
          var _this$items$get2;
          if (!Number.isInteger(count) || count <= 0) return false;
          var current = (_this$items$get2 = this.items.get(itemId)) != null ? _this$items$get2 : 0;
          if (current < count) return false;
          var newTotal = current - count;
          this.items.set(itemId, newTotal);
          eventBus.emit(GameEvent.ITEM_REMOVED, {
            itemId: itemId,
            count: count,
            newTotal: newTotal
          });
          return true;
        }

        /**
         * 检查是否有足够数量的物品。
         *
         * @param itemId - 物品 ID
         * @param count - 需要的数量
         * @returns 是否满足需求
         */;
        _proto.hasItem = function hasItem(itemId, count) {
          var _this$items$get3;
          var current = (_this$items$get3 = this.items.get(itemId)) != null ? _this$items$get3 : 0;
          return current >= count;
        }

        /**
         * 获取某物品当前数量。不存在时返回 0。
         *
         * @param itemId - 物品 ID
         * @returns 当前数量
         */;
        _proto.getCount = function getCount(itemId) {
          var _this$items$get4;
          return (_this$items$get4 = this.items.get(itemId)) != null ? _this$items$get4 : 0;
        }

        /**
         * 获取全部物品列表（返回副本，修改不影响内部状态）。
         *
         * @returns 物品数组
         */;
        _proto.getAll = function getAll() {
          var result = [];
          for (var _iterator = _createForOfIteratorHelperLoose(this.items), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
              itemId = _step$value[0],
              count = _step$value[1];
            result.push({
              itemId: itemId,
              count: count
            });
          }
          return result;
        }

        /**
         * 序列化为纯数据数组（适合存档）。
         *
         * @returns InventoryItem 数组
         */;
        _proto.toJSON = function toJSON() {
          return this.getAll();
        }

        /**
         * 从纯数据数组反序列化，覆盖当前背包全部内容。
         *
         * @param items - InventoryItem 数组
         */;
        _proto.fromJSON = function fromJSON(items) {
          this.items.clear();
          for (var _iterator2 = _createForOfIteratorHelperLoose(items), _step2; !(_step2 = _iterator2()).done;) {
            var _step2$value = _step2.value,
              itemId = _step2$value.itemId,
              count = _step2$value.count;
            if (Number.isInteger(count) && count > 0) {
              this.items.set(itemId, count);
            }
          }
        }

        /**
         * 清空背包所有物品（仅用于测试重置）。
         */;
        _proto.clear = function clear() {
          this.items.clear();
        };
        return InventorySystem;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./EventBus.ts', './index3.ts', './types.ts', './DressUpManager.ts', './index5.ts', './InventorySystem.ts', './index6.ts', './Match3Engine.ts', './index4.ts', './OrderManager.ts', './index2.ts', './SaveManager.ts', './index.ts', './index7.ts', './CellComponent.ts', './DressRoomPanel.ts', './MainGameFlow.ts', './Match3GridComponent.ts', './ShopPanel.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/MainGameFlow.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './InventorySystem.ts', './OrderManager.ts', './DressUpManager.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, director, Component, InventorySystem, OrderManager, DressUpManager;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      director = module.director;
      Component = module.Component;
    }, function (module) {
      InventorySystem = module.InventorySystem;
    }, function (module) {
      OrderManager = module.OrderManager;
    }, function (module) {
      DressUpManager = module.DressUpManager;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "b0c1dUPxkVLRb30BokRBRT+", "MainGameFlow", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

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
      var MainGameFlow = exports('MainGameFlow', (_dec = ccclass('MainGameFlow'), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(MainGameFlow, _Component);
        function MainGameFlow() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          // ---- 系统引用 ----
          /** 全局背包系统 */
          _this.inventorySystem = void 0;
          /** 全局订单管理器 */
          _this.orderManager = void 0;
          /** 全局换装管理器 */
          _this.dressUpManager = void 0;
          return _this;
        }
        /**
         * 获取 MainGameFlow 单例。
         * 必须在场景中已存在挂载了此组件的节点后调用。
         *
         * @returns MainGameFlow 唯一实例
         * @throws 若尚未初始化则抛出错误
         */
        MainGameFlow.getInstance = function getInstance() {
          if (!MainGameFlow._instance) {
            throw new Error('[MainGameFlow] 尚未初始化！请确保场景中含有 MainGameFlow 组件节点。');
          }
          return MainGameFlow._instance;
        };
        var _proto = MainGameFlow.prototype;
        // ==========================================================
        // 生命周期
        // ==========================================================
        _proto.onLoad = function onLoad() {
          // 防止重复创建实例
          if (MainGameFlow._instance) {
            console.warn('[MainGameFlow] 已存在单例实例，销毁当前节点。');
            this.node.destroy();
            return;
          }

          // 注册为单例
          MainGameFlow._instance = this;

          // 设为常驻节点，场景切换不销毁
          director.addPersistRootNode(this.node);

          // 初始化三大核心系统
          this.inventorySystem = new InventorySystem();
          this.orderManager = new OrderManager(this.inventorySystem);
          this.dressUpManager = new DressUpManager();
          console.log('[MainGameFlow] 初始化完成，三大系统已就绪。');
        };
        _proto.onDestroy = function onDestroy() {
          // 清理单例引用，避免野指针
          if (MainGameFlow._instance === this) {
            MainGameFlow._instance = null;
          }
        };
        return MainGameFlow;
      }(Component), _class2._instance = null, _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Match3Engine.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index7.ts', './index3.ts', './EventBus.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _extends, cclegacy, SpecialType, GameEvent, eventBus;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      SpecialType = module.SpecialType;
      GameEvent = module.GameEvent;
    }, null, function (module) {
      eventBus = module.eventBus;
    }],
    execute: function () {
      cclegacy._RF.push({}, "67ea23QOxhKrZras8sk/SwA", "Match3Engine", undefined);

      /** 位置坐标（内部用） */

      // ============================================================
      // Match3Engine
      // ============================================================
      var Match3Engine = exports('Match3Engine', /*#__PURE__*/function () {
        /**
         * @param config 棋盘配置（行数、列数、可用棋子类型）
         */
        function Match3Engine(config) {
          this.config = void 0;
          this.grid = [];
          this.config = config;
        }

        // ========== Public API ==========

        /**
         * 初始化棋盘：随机填充所有格子，并保证初始状态无任何三连
         * @returns 完整的 Cell 二维数组
         */
        var _proto = Match3Engine.prototype;
        _proto.initGrid = function initGrid() {
          var _this$config = this.config,
            rows = _this$config.rows,
            cols = _this$config.cols,
            elementTypes = _this$config.elementTypes;
          var grid = [];
          for (var r = 0; r < rows; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) {
              // 获取不会在当前位置产生 3 连的候选类型
              var candidates = this.getSafeTypes(grid, row, r, c, elementTypes);
              var type = candidates[Math.floor(Math.random() * candidates.length)];
              row.push({
                row: r,
                col: c,
                type: type,
                special: SpecialType.NONE,
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
         */;
        _proto.findMatches = function findMatches(grid) {
          var _grid$0$length, _grid$;
          var rows = grid.length;
          var cols = (_grid$0$length = (_grid$ = grid[0]) == null ? void 0 : _grid$.length) != null ? _grid$0$length : 0;
          var matches = [];

          // 辅助：记录每个 cell 参与的匹配组引用
          // key = "r,c", value = 该 cell 所属的匹配组列表
          var cellMatches = new Map();
          var addCellMatch = function addCellMatch(r, c, match) {
            var _cellMatches$get;
            var key = r + "," + c;
            var list = (_cellMatches$get = cellMatches.get(key)) != null ? _cellMatches$get : [];
            list.push(match);
            cellMatches.set(key, list);
          };

          // ---- 横向扫描 ----
          for (var r = 0; r < rows; r++) {
            var startCol = 0;
            while (startCol < cols) {
              var _grid$r$startCol;
              var type = (_grid$r$startCol = grid[r][startCol]) == null ? void 0 : _grid$r$startCol.type;
              if (type === null) {
                startCol++;
                continue;
              }
              var endCol = startCol;
              while (endCol + 1 < cols && ((_grid$r = grid[r][endCol + 1]) == null ? void 0 : _grid$r.type) === type) {
                var _grid$r;
                endCol++;
              }
              var length = endCol - startCol + 1;
              if (length >= 3) {
                var cells = [];
                for (var c = startCol; c <= endCol; c++) {
                  cells.push({
                    row: r,
                    col: c
                  });
                }
                var match = {
                  cells: cells,
                  type: type,
                  length: length
                };
                matches.push(match);
                for (var _c = startCol; _c <= endCol; _c++) {
                  addCellMatch(r, _c, match);
                }
              }
              startCol = endCol + 1;
            }
          }

          // ---- 纵向扫描 ----
          for (var _c2 = 0; _c2 < cols; _c2++) {
            var startRow = 0;
            while (startRow < rows) {
              var _grid$startRow$_c;
              var _type = (_grid$startRow$_c = grid[startRow][_c2]) == null ? void 0 : _grid$startRow$_c.type;
              if (_type === null) {
                startRow++;
                continue;
              }
              var endRow = startRow;
              while (endRow + 1 < rows && ((_grid$_c = grid[endRow + 1][_c2]) == null ? void 0 : _grid$_c.type) === _type) {
                var _grid$_c;
                endRow++;
              }
              var _length = endRow - startRow + 1;
              if (_length >= 3) {
                var _cells = [];
                for (var _r = startRow; _r <= endRow; _r++) {
                  _cells.push({
                    row: _r,
                    col: _c2
                  });
                }
                var _match = {
                  cells: _cells,
                  type: _type,
                  length: _length
                };
                matches.push(_match);
                for (var _r2 = startRow; _r2 <= endRow; _r2++) {
                  addCellMatch(_r2, _c2, _match);
                }
              }
              startRow = endRow + 1;
            }
          }

          // ---- 检测 T 型/L 型交叉 ----
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
         */;
        _proto.clearMatches = function clearMatches(grid, matches) {
          var _grid$0$length2,
            _grid$2,
            _this = this;
          var rows = grid.length;
          var cols = (_grid$0$length2 = (_grid$2 = grid[0]) == null ? void 0 : _grid$2.length) != null ? _grid$0$length2 : 0;

          // 构建特殊道具生成计划：key="r,c", value=要设置的 SpecialType
          var specialPlan = new Map();

          // 记录每个 cell 所属的匹配组（用于检测交叉点）
          var cellMatchGroups = new Map();
          var addCellToGroup = function addCellToGroup(r, c, group) {
            var _cellMatchGroups$get;
            var key = r + "," + c;
            var list = (_cellMatchGroups$get = cellMatchGroups.get(key)) != null ? _cellMatchGroups$get : [];
            list.push(group);
            cellMatchGroups.set(key, list);
          };
          for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
            var match = _step.value;
            for (var _iterator5 = _createForOfIteratorHelperLoose(match.cells), _step5; !(_step5 = _iterator5()).done;) {
              var cell = _step5.value;
              addCellToGroup(cell.row, cell.col, match);
            }
          }

          // 第一步：标记特殊道具（按优先级，高优先覆盖低优先）
          // 优先级：RAINBOW (5连) > IRON (T/L) > SHUTTLE (4连)
          var setSpecial = function setSpecial(r, c, special) {
            var key = r + "," + c;
            var current = specialPlan.get(key);
            if (!current || _this.specialPriority(special) > _this.specialPriority(current)) {
              specialPlan.set(key, special);
            }
          };

          // 先处理 4 连和 5 连（基于单个匹配组）
          for (var _iterator2 = _createForOfIteratorHelperLoose(matches), _step2; !(_step2 = _iterator2()).done;) {
            var _match2 = _step2.value;
            if (_match2.length === 4) {
              // 4连：最后一个 cell 生成 SHUTTLE
              var last = _match2.cells[_match2.cells.length - 1];
              setSpecial(last.row, last.col, SpecialType.SHUTTLE);
            } else if (_match2.length >= 5) {
              // 5+连：中间 cell 生成 RAINBOW
              var midIdx = Math.floor(_match2.cells.length / 2);
              var mid = _match2.cells[midIdx];
              setSpecial(mid.row, mid.col, SpecialType.RAINBOW);
            }
          }

          // 再检测 T 型/L 型交叉
          for (var _iterator3 = _createForOfIteratorHelperLoose(cellMatchGroups), _step3; !(_step3 = _iterator3()).done;) {
            var _step3$value = _step3.value,
              _key = _step3$value[0],
              groups = _step3$value[1];
            if (groups.length < 2) continue;
            var _key$split$map = _key.split(',').map(Number),
              _r3 = _key$split$map[0],
              _c3 = _key$split$map[1];
            var hasHorizontal = false;
            var hasVertical = false;
            for (var _iterator6 = _createForOfIteratorHelperLoose(groups), _step6; !(_step6 = _iterator6()).done;) {
              var g = _step6.value;
              // 判断匹配组是横向还是纵向
              var first = g.cells[0];
              var _last = g.cells[g.cells.length - 1];
              if (first.row === _last.row) {
                hasHorizontal = true;
              } else if (first.col === _last.col) {
                hasVertical = true;
              }
            }

            // 同时有横向和纵向的 3+ 连 → T/L 交叉点
            if (hasHorizontal && hasVertical) {
              setSpecial(_r3, _c3, SpecialType.IRON);
            }
          }

          // 第二步：清除匹配格，但保留特殊道具生成格
          var clearedSet = new Set();
          for (var _iterator4 = _createForOfIteratorHelperLoose(matches), _step4; !(_step4 = _iterator4()).done;) {
            var _match3 = _step4.value;
            for (var _iterator7 = _createForOfIteratorHelperLoose(_match3.cells), _step7; !(_step7 = _iterator7()).done;) {
              var _cell = _step7.value;
              clearedSet.add(_cell.row + "," + _cell.col);
            }
          }

          // 构建新棋盘
          var newGrid = [];
          var clearedItemsMap = new Map();
          for (var r = 0; r < rows; r++) {
            var newRow = [];
            for (var c = 0; c < cols; c++) {
              var key = r + "," + c;
              var original = grid[r][c];
              var isCleared = clearedSet.has(key);
              var special = specialPlan.get(key);
              if (isCleared && !special) {
                var _clearedItemsMap$get;
                // 普通消除格：type 设为 null
                newRow.push({
                  row: r,
                  col: c,
                  type: null,
                  special: SpecialType.NONE,
                  tangleCount: 0,
                  isFrozen: false
                });
                // 统计消除类型
                var typeKey = String(original.type);
                clearedItemsMap.set(typeKey, ((_clearedItemsMap$get = clearedItemsMap.get(typeKey)) != null ? _clearedItemsMap$get : 0) + 1);
              } else if (isCleared && special) {
                // 特殊道具生成格：保留 type，设置 special
                newRow.push({
                  row: r,
                  col: c,
                  type: original.type,
                  special: special,
                  tangleCount: original.tangleCount,
                  isFrozen: original.isFrozen
                });
              } else {
                // 未消除格：保留原样
                newRow.push(_extends({}, original));
              }
            }
            newGrid.push(newRow);
          }

          // 发射 match:cleared 事件
          var clearedItems = Array.from(clearedItemsMap.entries()).map(function (_ref) {
            var type = _ref[0],
              count = _ref[1];
            return {
              type: type,
              count: count
            };
          });
          eventBus.emit(GameEvent.MATCH_CLEARED, {
            clearedItems: clearedItems
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
         */;
        _proto.dropAndFill = function dropAndFill(grid) {
          var _grid$0$length3, _grid$3;
          var rows = grid.length;
          var cols = (_grid$0$length3 = (_grid$3 = grid[0]) == null ? void 0 : _grid$3.length) != null ? _grid$0$length3 : 0;
          var elementTypes = this.config.elementTypes;

          // 深拷贝
          var newGrid = grid.map(function (row) {
            return row.map(function (cell) {
              return _extends({}, cell);
            });
          });
          for (var c = 0; c < cols; c++) {
            // 收集该列所有非空棋子（从上到下）
            var nonEmpty = [];
            for (var r = 0; r < rows; r++) {
              if (newGrid[r][c].type !== null) {
                nonEmpty.push(newGrid[r][c]);
              }
            }

            // 从底部向上填充
            for (var _r4 = rows - 1; _r4 >= 0; _r4--) {
              if (nonEmpty.length > 0) {
                var cell = nonEmpty.pop();
                newGrid[_r4][c] = {
                  row: _r4,
                  col: c,
                  type: cell.type,
                  special: cell.special,
                  tangleCount: cell.tangleCount,
                  isFrozen: cell.isFrozen
                };
              } else {
                // 顶部补充新棋子
                var type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
                newGrid[_r4][c] = {
                  row: _r4,
                  col: c,
                  type: type,
                  special: SpecialType.NONE,
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
         */;
        _proto.step = function step(grid) {
          var _this2 = this;
          var currentGrid = grid;
          var cascades = 0;
          var allMatches = [];
          var MAX_CASCADES = 100; // 安全上限，防止无限级联

          var doStep = function doStep(g) {
            if (cascades >= MAX_CASCADES) {
              return g;
            }
            var matches = _this2.findMatches(g);
            if (matches.length === 0) {
              return g;
            }

            // 发射 match:found 事件
            eventBus.emit(GameEvent.MATCH_FOUND, matches);
            cascades++;
            allMatches.push.apply(allMatches, matches);
            var cleared = _this2.clearMatches(g, matches);
            var filled = _this2.dropAndFill(cleared);
            return doStep(filled);
          };
          currentGrid = doStep(currentGrid);

          // 发射 grid:stable 事件
          eventBus.emit(GameEvent.GRID_STABLE, currentGrid);

          // 更新内部棋盘
          this.grid = currentGrid;
          return {
            grid: currentGrid,
            matches: allMatches,
            cascades: cascades
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
         */;
        _proto.swap = function swap(grid, r1, c1, r2, c2) {
          var _grid$0$length4, _grid$4;
          var rows = grid.length;
          var cols = (_grid$0$length4 = (_grid$4 = grid[0]) == null ? void 0 : _grid$4.length) != null ? _grid$0$length4 : 0;

          // 边界检查
          if (r1 < 0 || r1 >= rows || c1 < 0 || c1 >= cols) return {
            valid: false,
            grid: grid
          };
          if (r2 < 0 || r2 >= rows || c2 < 0 || c2 >= cols) return {
            valid: false,
            grid: grid
          };

          // 相邻性检查（上下左右邻接，不能是对角）
          var dr = Math.abs(r1 - r2);
          var dc = Math.abs(c1 - c2);
          if (!(dr === 1 && dc === 0 || dr === 0 && dc === 1)) {
            return {
              valid: false,
              grid: grid
            };
          }

          // 执行交换（深拷贝）
          var newGrid = grid.map(function (row) {
            return row.map(function (cell) {
              return _extends({}, cell);
            });
          });

          // 交换两个 cell 的数据
          var temp = _extends({}, newGrid[r1][c1]);
          newGrid[r1][c1] = _extends({}, newGrid[r2][c2], {
            row: r1,
            col: c1
          });
          newGrid[r2][c2] = _extends({}, temp, {
            row: r2,
            col: c2
          });

          // 检查是否产生匹配
          var matches = this.findMatches(newGrid);
          if (matches.length === 0) {
            return {
              valid: false,
              grid: grid
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
         */;
        _proto.getGrid = function getGrid() {
          return this.grid;
        }

        // ========== Private Helpers ==========

        /**
         * 获取在位置 (r, c) 放置后不会产生 3 连的候选类型
         * 用于 initGrid 保证初始无三连
         */;
        _proto.getSafeTypes = function getSafeTypes(grid, currentRow, r, c, elementTypes) {
          // 检查左侧两个是否相同类型（使用当前正在构建的行）
          var forbiddenLeft = null;
          if (c >= 2) {
            var _currentRow, _currentRow2;
            var t1 = (_currentRow = currentRow[c - 1]) == null ? void 0 : _currentRow.type;
            var t2 = (_currentRow2 = currentRow[c - 2]) == null ? void 0 : _currentRow2.type;
            if (t1 != null && t1 === t2) {
              forbiddenLeft = t1;
            }
          }

          // 检查上方两个是否相同类型（使用已完成的之前行）
          var forbiddenUp = null;
          if (r >= 2) {
            var _grid, _grid2;
            var _t = (_grid = grid[r - 1]) == null || (_grid = _grid[c]) == null ? void 0 : _grid.type;
            var _t2 = (_grid2 = grid[r - 2]) == null || (_grid2 = _grid2[c]) == null ? void 0 : _grid2.type;
            if (_t != null && _t === _t2) {
              forbiddenUp = _t;
            }
          }

          // 过滤掉会产生 3 连的类型
          var forbidden = new Set();
          if (forbiddenLeft) forbidden.add(forbiddenLeft);
          if (forbiddenUp) forbidden.add(forbiddenUp);
          var candidates = elementTypes.filter(function (t) {
            return !forbidden.has(t);
          });

          // 如果全部被禁止（理论上不会，因为至少有 3+ 种类型时不可能全部被禁），
          // 则退回使用全部类型
          if (candidates.length === 0) {
            candidates = [].concat(elementTypes);
          }
          return candidates;
        }

        /**
         * 特殊道具优先级：RAINBOW(3) > IRON(2) > SHUTTLE(1) > NONE(0)
         */;
        _proto.specialPriority = function specialPriority(special) {
          switch (special) {
            case SpecialType.RAINBOW:
              return 3;
            case SpecialType.IRON:
              return 2;
            case SpecialType.SHUTTLE:
              return 1;
            default:
              return 0;
          }
        };
        return Match3Engine;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Match3GridComponent.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Match3Engine.ts', './index7.ts', './EventBus.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, Prefab, CCFloat, CCInteger, instantiate, Vec3, Sprite, Color, resources, SpriteFrame, tween, Component, Match3Engine, ElementType, GameEvent, SpecialType, eventBus;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      CCFloat = module.CCFloat;
      CCInteger = module.CCInteger;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      Sprite = module.Sprite;
      Color = module.Color;
      resources = module.resources;
      SpriteFrame = module.SpriteFrame;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      Match3Engine = module.Match3Engine;
    }, function (module) {
      ElementType = module.ElementType;
      GameEvent = module.GameEvent;
      SpecialType = module.SpecialType;
    }, function (module) {
      eventBus = module.eventBus;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "1b1618eAzJIgY8RJgOX0SJf", "Match3GridComponent", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 三消棋盘主组件。
       *
       * 交互流程：
       * 1. onLoad 时创建 Match3Engine，初始化棋盘并渲染
       * 2. 玩家点击棋子 → onCellClicked 处理选中/交换逻辑
       * 3. 交换合法 → 级联消除动画循环
       * 4. 交换非法 → 取消选中，恢复原状态
       */
      var Match3GridComponent = exports('Match3GridComponent', (_dec = ccclass('Match3GridComponent'), _dec2 = property({
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
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Match3GridComponent, _Component);
        function Match3GridComponent() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          // ---- @property 属性（在编辑器中绑定） ----
          /** 棋子预制体（需挂载 CellComponent） */
          _initializerDefineProperty(_this, "cellPrefab", _descriptor, _assertThisInitialized(_this));
          /** 单个棋子大小（像素） */
          _initializerDefineProperty(_this, "cellSize", _descriptor2, _assertThisInitialized(_this));
          /** 棋盘行数 */
          _initializerDefineProperty(_this, "rows", _descriptor3, _assertThisInitialized(_this));
          /** 棋盘列数 */
          _initializerDefineProperty(_this, "cols", _descriptor4, _assertThisInitialized(_this));
          // ---- 私有成员 ----
          /** 三消引擎实例 */
          _this.engine = void 0;
          /** 棋盘子节点二维数组 cellNodes[row][col] */
          _this.cellNodes = [];
          /** 当前选中的棋子行号（-1 表示无选中） */
          _this.selectedRow = -1;
          /** 当前选中的棋子列号（-1 表示无选中） */
          _this.selectedCol = -1;
          /** 是否正在处理消除动画（防止连点） */
          _this.isProcessing = false;
          /** 当前正在执行的 Tween 动画引用（用于取消） */
          _this.selectedTween = null;
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
          _this.onGridStable = function (grid) {
            // 同步渲染最新棋盘状态
            _this.renderGrid(grid);
          };
          return _this;
        }
        var _proto = Match3GridComponent.prototype;
        // ==========================================================
        // 生命周期
        // ==========================================================
        _proto.onLoad = function onLoad() {
          // 构建棋盘配置
          var config = {
            rows: this.rows,
            cols: this.cols,
            elementTypes: [ElementType.LINE, ElementType.BUTTON, ElementType.SCISSORS, ElementType.TAPE, ElementType.SEWING]
          };

          // 创建三消引擎并初始化棋盘
          this.engine = new Match3Engine(config);
          var grid = this.engine.initGrid();
          this.renderGrid(grid);

          // 监听棋盘稳定事件
          eventBus.on(GameEvent.GRID_STABLE, this.onGridStable);
        };
        _proto.onDestroy = function onDestroy() {
          // 清理事件监听
          eventBus.off(GameEvent.GRID_STABLE, this.onGridStable);
          // 停止所有 Tween 动画
          this.cancelSelectionTween();
        }

        // ==========================================================
        // 棋盘渲染
        // ==========================================================

        /**
         * 根据棋盘数据渲染整个网格。
         *
         * 首次调用时为每个 cell 从预制体创建节点，
         * 后续调用时复用已有节点并更新其显示。
         *
         * @param grid - 棋盘数据二维数组
         */;
        _proto.renderGrid = function renderGrid(grid) {
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
              var node = (_this$cellNodes$_r$c = (_this$cellNodes$_r = this.cellNodes[_r]) == null ? void 0 : _this$cellNodes$_r[c]) != null ? _this$cellNodes$_r$c : null;

              // 首次创建节点
              if (!node && this.cellPrefab) {
                var createdNode = instantiate(this.cellPrefab);
                createdNode.parent = this.node;
                if (!this.cellNodes[_r]) {
                  this.cellNodes[_r] = [];
                }
                this.cellNodes[_r][c] = createdNode;
                node = createdNode;
              }
              if (node) {
                // 设置位置：x = col * cellSize，y = -row * cellSize（棋盘原点在左上角）
                node.setPosition(new Vec3(c * this.cellSize, -_r * this.cellSize, 0));

                // 更新棋子精灵显示
                this.updateCellSprite(node, cell);

                // 更新 CellComponent 数据
                var cellComp = node.getComponent('CellComponent');
                if (cellComp) {
                  cellComp.setup(_r, c, cell.type);
                }
              }
            }
          }
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
         */;
        _proto.updateCellSprite = function updateCellSprite(node, cell) {
          var sprite = node.getComponent(Sprite);
          if (!sprite) return;

          // 根据棋子类型动态加载对应精灵帧
          if (!cell.type) {
            sprite.spriteFrame = null;
            sprite.color = new Color(255, 255, 255, 0);
            return;
          }
          var path = this.getElementTexturePath(cell.type);
          resources.load(path, SpriteFrame, function (err, spriteFrame) {
            if (!err && spriteFrame && sprite.isValid) {
              sprite.spriteFrame = spriteFrame;
            }
          });

          // 特殊道具高亮：通过颜色叠加标记
          if (cell.special !== SpecialType.NONE) {
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
         */;
        _proto.getElementTexturePath = function getElementTexturePath(type) {
          switch (type) {
            case ElementType.LINE:
              return 'textures/line/spriteFrame';
            case ElementType.BUTTON:
              return 'textures/button/spriteFrame';
            case ElementType.SCISSORS:
              return 'textures/scissors/spriteFrame';
            case ElementType.TAPE:
              return 'textures/tape/spriteFrame';
            case ElementType.SEWING:
              return 'textures/sewing/spriteFrame';
            default:
              return 'textures/line/spriteFrame';
          }
        };
        _proto.getSpecialColor = function getSpecialColor(special) {
          switch (special) {
            case SpecialType.SHUTTLE:
              return new Color(255, 215, 0, 255);
            // 金色（飞梭）
            case SpecialType.IRON:
              return new Color(255, 99, 71, 255);
            // 番茄红（魔法熨斗）
            case SpecialType.RAINBOW:
              return new Color(0, 255, 255, 255);
            // 青色（彩虹布）
            default:
              return new Color(255, 255, 255, 255);
          }
        }

        // ==========================================================
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
         */;
        _proto.onCellClicked = function onCellClicked(row, col) {
          // 动画进行中，忽略点击
          if (this.isProcessing) return;

          // 无选中棋子 → 选中当前棋子
          if (this.selectedRow === -1 || this.selectedCol === -1) {
            this.selectCell(row, col);
            return;
          }

          // 点击同一棋子 → 取消选中
          if (this.selectedRow === row && this.selectedCol === col) {
            this.deselectCell();
            return;
          }

          // 点击不同棋子 → 尝试交换
          this.trySwap(this.selectedRow, this.selectedCol, row, col);
        }

        /**
         * 选中棋子并播放呼吸动画。
         *
         * @param row - 行号
         * @param col - 列号
         */;
        _proto.selectCell = function selectCell(row, col) {
          var _this$cellNodes$row;
          this.selectedRow = row;
          this.selectedCol = col;
          var node = (_this$cellNodes$row = this.cellNodes[row]) == null ? void 0 : _this$cellNodes$row[col];
          if (!node) return;

          // 取消之前的选中动画
          this.cancelSelectionTween();

          // 播放呼吸缩放动画（放大→缩小循环）
          this.selectedTween = tween(node).to(0.3, {
            scale: new Vec3(1.15, 1.15, 1)
          }).to(0.3, {
            scale: new Vec3(1, 1, 1)
          }).union().repeatForever().start();
        }

        /**
         * 取消棋子选中状态并停止动画。
         */;
        _proto.deselectCell = function deselectCell() {
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
         */;
        _proto.cancelSelectionTween = function cancelSelectionTween() {
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
         */;
        _proto.trySwap = function trySwap(r1, c1, r2, c2) {
          var grid = this.engine.getGrid();
          var result = this.engine.swap(grid, r1, c1, r2, c2);

          // 取消原选中状态
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
         */;
        _proto.shakeCell = function shakeCell(row, col) {
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
        }

        // ==========================================================
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
         */;
        _proto.processMatches = /*#__PURE__*/
        function () {
          var _processMatches = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(grid) {
            var currentGrid, cascades, MAX_CASCADES, matches;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  this.isProcessing = true;
                  currentGrid = grid;
                  cascades = 0;
                  MAX_CASCADES = 100;
                // 安全上限
                case 4:
                  if (!(cascades < MAX_CASCADES)) {
                    _context.next = 20;
                    break;
                  }
                  // 查找当前棋盘上的所有匹配组
                  matches = this.engine.findMatches(currentGrid);
                  if (!(matches.length === 0)) {
                    _context.next = 8;
                    break;
                  }
                  return _context.abrupt("break", 20);
                case 8:
                  cascades++;

                  // 发射 MATCH_FOUND 事件
                  eventBus.emit(GameEvent.MATCH_FOUND, matches);

                  // 清除匹配棋子（生成特殊道具）
                  currentGrid = this.engine.clearMatches(currentGrid, matches);
                  this.renderGrid(currentGrid);

                  // 等待 150ms 观看消除效果
                  _context.next = 14;
                  return this.delay(150);
                case 14:
                  // 重力下落 + 顶部补充新棋子
                  currentGrid = this.engine.dropAndFill(currentGrid);
                  this.renderGrid(currentGrid);

                  // 等待 150ms 观看下落效果
                  _context.next = 18;
                  return this.delay(150);
                case 18:
                  _context.next = 4;
                  break;
                case 20:
                  // 发射棋盘稳定事件
                  eventBus.emit(GameEvent.GRID_STABLE, currentGrid);
                  this.isProcessing = false;
                case 22:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function processMatches(_x) {
            return _processMatches.apply(this, arguments);
          }
          return processMatches;
        }()
        /**
         * 异步延迟工具。
         *
         * @param ms - 延迟毫秒数
         * @returns Promise
         */;

        _proto.delay = function delay(ms) {
          return new Promise(function (resolve) {
            setTimeout(resolve, ms);
          });
        };
        return Match3GridComponent;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cellPrefab", [_dec2], {
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
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/OrderManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './EventBus.ts', './index7.ts'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, cclegacy, eventBus, GameEvent;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      eventBus = module.eventBus;
    }, function (module) {
      GameEvent = module.GameEvent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e8452Ucxj9A1qyLiytt8DaS", "OrderManager", undefined);
      /** 材料池：随机抽取 */
      var MATERIAL_POOL = ['LINE', 'BUTTON', 'SCISSORS', 'TAPE', 'SEWING'];

      /** 顾客名池 */
      var CUSTOMER_NAMES = ['小红', '小美', '阿花', '莉莉', '娜娜', '思思', '小云', '阿紫', '小樱', '小倩'];

      /** 头像资源池 */
      var CUSTOMER_AVATARS = ['avatar/customer_01', 'avatar/customer_02', 'avatar/customer_03', 'avatar/customer_04', 'avatar/customer_05'];

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
      var OrderManager = exports('OrderManager', /*#__PURE__*/function () {
        /**
         * @param inventory - 背包系统实例（依赖注入）
         */
        function OrderManager(inventory) {
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
        var _proto = OrderManager.prototype;
        _proto.generateOrders = function generateOrders(count) {
          var currentActive = this.getActiveOrders().length;
          var available = Math.max(0, OrderManager.MAX_ACTIVE_ORDERS - currentActive);
          var toGenerate = Math.min(count, available);
          var generated = [];
          for (var i = 0; i < toGenerate; i++) {
            var order = this.createRandomOrder();
            this.orders.set(order.orderId, order);
            generated.push(order);
            eventBus.emit(GameEvent.ORDER_CREATED, {
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
         */;
        _proto.submitOrder = function submitOrder(orderId) {
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
          }

          // 1. 逐项校验库存
          for (var _iterator = _createForOfIteratorHelperLoose(order.requirements), _step; !(_step = _iterator()).done;) {
            var req = _step.value;
            if (!this.inventory.hasItem(req.itemId, req.count)) {
              return {
                success: false,
                reason: req.itemId + "\u4E0D\u8DB3"
              };
            }
          }

          // 2. 发射 order:submitted（手作小游戏时机）
          eventBus.emit(GameEvent.ORDER_SUBMITTED, {
            order: _extends({}, order)
          });

          // 3. 逐项扣除库存
          for (var _iterator2 = _createForOfIteratorHelperLoose(order.requirements), _step2; !(_step2 = _iterator2()).done;) {
            var _req = _step2.value;
            this.inventory.removeItem(_req.itemId, _req.count);
          }

          // 4. 标记完成
          order.status = 'completed';

          // 5. 累计并发射奖励事件
          this.totalGoldEarned += order.rewardGold;
          this.totalFlowerEarned += order.rewardFlower;

          // 6. 发射 order:completed
          eventBus.emit(GameEvent.ORDER_COMPLETED, {
            order: _extends({}, order),
            rewardGold: order.rewardGold,
            rewardFlower: order.rewardFlower
          });

          // 7. 发射经济事件
          eventBus.emit(GameEvent.GOLD_CHANGED, {
            amount: order.rewardGold,
            newTotal: this.totalGoldEarned
          });
          eventBus.emit(GameEvent.FLOWER_CHANGED, {
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
         */;
        _proto.getActiveOrders = function getActiveOrders() {
          var active = [];
          for (var _iterator3 = _createForOfIteratorHelperLoose(this.orders.values()), _step3; !(_step3 = _iterator3()).done;) {
            var order = _step3.value;
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
         */;
        _proto.cancelOrder = function cancelOrder(orderId) {
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
         */;
        _proto.toJSON = function toJSON() {
          var result = [];
          for (var _iterator4 = _createForOfIteratorHelperLoose(this.orders.values()), _step4; !(_step4 = _iterator4()).done;) {
            var order = _step4.value;
            result.push(_extends({}, order));
          }
          return result;
        }

        /**
         * 从纯数据数组反序列化，覆盖当前全部订单状态。
         *
         * @param orders - 订单数据数组
         */;
        _proto.fromJSON = function fromJSON(orders) {
          this.orders.clear();
          // 重建 ID 计数器
          var maxId = 0;
          for (var _iterator5 = _createForOfIteratorHelperLoose(orders), _step5; !(_step5 = _iterator5()).done;) {
            var order = _step5.value;
            this.orders.set(order.orderId, _extends({}, order));
            // 从 orderId 中解析数字 ID
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
         */;
        _proto.getTotalGoldEarned = function getTotalGoldEarned() {
          return this.totalGoldEarned;
        }

        /**
         * 获取累计小红花收入。
         *
         * @returns 小红花累计
         */;
        _proto.getTotalFlowerEarned = function getTotalFlowerEarned() {
          return this.totalFlowerEarned;
        }

        // ---- 内部方法 ----

        /**
         * 生成一个随机订单。
         */;
        _proto.createRandomOrder = function createRandomOrder() {
          var _this = this;
          var reqCount = this.randomInt(1, 3);

          // 生成需求（确保不重复类型）
          var shuffled = [].concat(MATERIAL_POOL).sort(function () {
            return Math.random() - 0.5;
          });
          var selectedMaterials = shuffled.slice(0, reqCount);
          var requirements = selectedMaterials.map(function (itemId) {
            return {
              itemId: itemId,
              count: _this.randomInt(1, 5)
            };
          });
          var totalCount = requirements.reduce(function (sum, r) {
            return sum + r.count;
          }, 0);
          var distinctTypes = new Set(requirements.map(function (r) {
            return r.itemId;
          })).size;
          var orderId = "order_" + ++this.idCounter;
          var customerName = CUSTOMER_NAMES[this.randomInt(0, CUSTOMER_NAMES.length - 1)];
          var customerAvatar = CUSTOMER_AVATARS[this.randomInt(0, CUSTOMER_AVATARS.length - 1)];
          return {
            orderId: orderId,
            customerName: customerName,
            customerAvatar: customerAvatar,
            requirements: requirements,
            rewardGold: totalCount * 10,
            rewardFlower: distinctTypes * 2,
            status: 'pending'
          };
        }

        /**
         * 生成 [min, max] 范围内的随机整数。
         */;
        _proto.randomInt = function randomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        return OrderManager;
      }());
      /** 最多活跃订单数 */
      OrderManager.MAX_ACTIVE_ORDERS = 5;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SaveManager.ts", ['cc', './EventBus.ts', './index7.ts'], function (exports) {
  var cclegacy, sys, eventBus, GameEvent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      eventBus = module.eventBus;
    }, function (module) {
      GameEvent = module.GameEvent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bceaekXBOtMk5YNKGBFbf5t", "SaveManager", undefined);
      /** 存档文件存放目录 */
      var SAVE_KEY_PREFIX = 'wardrobe-story:save:';

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
      var SaveManager = exports('SaveManager', /*#__PURE__*/function () {
        function SaveManager() {
          /** 内存中的存档快照 */
          this.data = void 0;
          /** 自动保存定时器句柄 */
          this.autoSaveTimer = null;
          /** 注册的各事件回调引用，用于测试清理时无需显式调用 */
          this.listeners = [];
          this.data = createDefaultSaveData();
          this.registerListeners();
        }

        // ---- Public API ----

        /**
         * 立即将当前内存快照保存到文件。
         *
         * @param slot - 存档槽位编号，默认 0
         */
        var _proto = SaveManager.prototype;
        _proto.save = function save(slot) {
          if (slot === void 0) {
            slot = 0;
          }
          this.ensureSaveDir();
          var filePath = this.slotPath(slot);
          var json = JSON.stringify(this.data, null, 2);
          sys.localStorage.setItem(filePath, json);
          eventBus.emit(GameEvent.GAME_SAVED);
        }

        /**
         * 从文件加载存档，返回解析后的 SaveData。
         *
         * @param slot - 存档槽位编号，默认 0
         * @returns 解析后的 SaveData，若文件不存在或格式错误则返回 null
         */;
        _proto.load = function load(slot) {
          if (slot === void 0) {
            slot = 0;
          }
          var filePath = this.slotPath(slot);
          var raw = sys.localStorage.getItem(filePath);
          if (!raw) {
            return null;
          }
          try {
            var parsed = JSON.parse(raw);
            eventBus.emit(GameEvent.GAME_LOADED, parsed);
            return parsed;
          } catch (_unused) {
            return null;
          }
        }

        /**
         * 启动自动保存，每隔指定毫秒自动调用 save()。
         *
         * 若已有运行中的定时器，会先停止旧的再启动新的。
         *
         * @param intervalMs - 保存间隔（毫秒）
         */;
        _proto.startAutoSave = function startAutoSave(intervalMs) {
          var _this = this;
          this.stopAutoSave();
          this.autoSaveTimer = setInterval(function () {
            _this.save();
          }, intervalMs);
        }

        /**
         * 停止自动保存，清除定时器。
         */;
        _proto.stopAutoSave = function stopAutoSave() {
          if (this.autoSaveTimer !== null) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
          }
        }

        /**
         * 获取当前内存状态快照的深拷贝。
         *
         * @returns 当前 SaveData 副本
         */;
        _proto.getSnapshot = function getSnapshot() {
          return JSON.parse(JSON.stringify(this.data));
        }

        /**
         * 从外部 SaveData 恢复状态（例如加载存档后调用）。
         *
         * 会用传入数据完全覆盖当前内存快照，并发射 game:loaded 事件。
         *
         * @param data - 要恢复的存档数据
         */;
        _proto.restore = function restore(data) {
          this.data = JSON.parse(JSON.stringify(data));
          eventBus.emit(GameEvent.GAME_LOADED, this.getSnapshot());
        }

        // ---- Private ----

        /** 确保存档目录存在 */;
        _proto.ensureSaveDir = function ensureSaveDir() {
          // localStorage needs no directory preparation.
        }

        /** 返回指定槽位的文件路径 */;
        _proto.slotPath = function slotPath(slot) {
          return "" + SAVE_KEY_PREFIX + slot;
        }

        /**
         * 注册所有需要监听的事件。
         *
         * 每个事件回调直接修改 this.data，实现被动数据收集。
         */;
        _proto.registerListeners = function registerListeners() {
          var _this2 = this;
          // 金币变动
          this.on(GameEvent.GOLD_CHANGED, function (payload) {
            _this2.data.gold = payload.newTotal;
          });

          // 花朵变动
          this.on(GameEvent.FLOWER_CHANGED, function (payload) {
            _this2.data.flowers = payload.newTotal;
          });

          // 物品添加
          this.on(GameEvent.ITEM_ADDED, function (payload) {
            _this2.upsertInventoryItem(payload.itemId, payload.newTotal);
          });

          // 物品移除
          this.on(GameEvent.ITEM_REMOVED, function (payload) {
            _this2.upsertInventoryItem(payload.itemId, payload.newTotal);
          });

          // 订单创建
          this.on(GameEvent.ORDER_CREATED, function (order) {
            _this2.data.orders.push(order);
          });

          // 换装变更
          this.on(GameEvent.DRESS_CHANGED, function (payload) {
            _this2.data.currentDress[payload.part] = payload.attachmentId;
          });
        }

        /**
         * 更新或删除库存中的某个物品。
         *
         * @param itemId - 物品 ID
         * @param newTotal - 经过变动后的最新数量
         */;
        _proto.upsertInventoryItem = function upsertInventoryItem(itemId, newTotal) {
          var index = this.data.inventory.findIndex(function (item) {
            return item.itemId === itemId;
          });
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
                itemId: itemId,
                count: newTotal
              });
            }
          }
        }

        /**
         * 便捷注册带引用追踪的事件监听。
         */;
        _proto.on = function on(event, fn) {
          eventBus.on(event, fn);
          this.listeners.push({
            event: event,
            fn: fn
          });
        };
        return SaveManager;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ShopPanel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './MainGameFlow.ts', './EventBus.ts', './index7.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _createForOfIteratorHelperLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Prefab, Node, Label, instantiate, Color, Button, Component, MainGameFlow, eventBus, GameEvent;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      Node = module.Node;
      Label = module.Label;
      instantiate = module.instantiate;
      Color = module.Color;
      Button = module.Button;
      Component = module.Component;
    }, function (module) {
      MainGameFlow = module.MainGameFlow;
    }, function (module) {
      eventBus = module.eventBus;
    }, function (module) {
      GameEvent = module.GameEvent;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "cd8f62o9DFBXoFuY0clMHAu", "ShopPanel", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 店铺订单面板。
       *
       * 交互流程：
       * 1. 玩家进入店铺场景，面板自动生成 4 个随机订单
       * 2. 每个订单卡片显示顾客名、需求材料、奖励
       * 3. 点击"提交"按钮 → 检查库存 → 扣除材料 → 获得奖励
       * 4. 订单完成后刷新列表，经济标签同步更新
       */
      var ShopPanel = exports('ShopPanel', (_dec = ccclass('ShopPanel'), _dec2 = property({
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
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(ShopPanel, _Component);
        function ShopPanel() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          // ---- @property 属性（在编辑器中绑定） ----
          /** 订单卡片预制体（需包含 NameLabel、RequirementLabel、RewardLabel、SubmitBtn 子节点） */
          _initializerDefineProperty(_this, "orderCardPrefab", _descriptor, _assertThisInitialized(_this));
          /** 订单列表滚动容器的 content 节点 */
          _initializerDefineProperty(_this, "orderListContainer", _descriptor2, _assertThisInitialized(_this));
          /** 金币数量标签 */
          _initializerDefineProperty(_this, "goldLabel", _descriptor3, _assertThisInitialized(_this));
          /** 小红花数量标签 */
          _initializerDefineProperty(_this, "flowerLabel", _descriptor4, _assertThisInitialized(_this));
          // ---- 私有成员 ----
          /** 订单管理器引用（来自 MainGameFlow 单例） */
          _this.orderManager = void 0;
          /** 背包系统引用 */
          _this.inventorySystem = void 0;
          // ==========================================================
          // 事件回调
          // ==========================================================
          /**
           * 订单完成事件回调（由 ORDER_COMPLETED 事件触发）。
           * 刷新订单列表以移除已完成的订单。
           */
          _this.onOrderCompleted = function () {
            _this.refreshOrders();
          };
          _this.onGoldChanged = function (payload) {
            _this.updateGoldLabel(payload.newTotal);
          };
          _this.onFlowerChanged = function (payload) {
            _this.updateFlowerLabel(payload.newTotal);
          };
          return _this;
        }
        var _proto = ShopPanel.prototype;
        // ==========================================================
        // 生命周期
        // ==========================================================
        _proto.onLoad = function onLoad() {
          // 从全局协调器获取系统实例
          var mgf = MainGameFlow.getInstance();
          this.inventorySystem = mgf.inventorySystem;
          this.orderManager = mgf.orderManager;

          // 初始化经济标签
          this.updateGoldLabel(0);
          this.updateFlowerLabel(0);

          // 监听订单完成事件 → 刷新列表
          eventBus.on(GameEvent.ORDER_COMPLETED, this.onOrderCompleted);

          // 监听金币变化事件 → 更新标签
          eventBus.on(GameEvent.GOLD_CHANGED, this.onGoldChanged);

          // 监听小红花变化事件 → 更新标签
          eventBus.on(GameEvent.FLOWER_CHANGED, this.onFlowerChanged);

          // 初次进入：生成 4 个订单
          this.orderManager.generateOrders(4);
          this.refreshOrders();
        };
        _proto.onDestroy = function onDestroy() {
          // 清理事件监听，防止内存泄漏
          eventBus.off(GameEvent.ORDER_COMPLETED, this.onOrderCompleted);
          eventBus.off(GameEvent.GOLD_CHANGED, this.onGoldChanged);
          eventBus.off(GameEvent.FLOWER_CHANGED, this.onFlowerChanged);
        }

        // ==========================================================
        // 订单列表刷新
        // ==========================================================

        /**
         * 刷新订单列表。
         *
         * 清空当前列表容器，重新遍历活跃订单并生成卡片。
         * 如果没有活跃订单，列表为空。
         */;
        _proto.refreshOrders = function refreshOrders() {
          if (!this.orderListContainer || !this.orderCardPrefab) {
            console.warn('[ShopPanel] orderListContainer 或 orderCardPrefab 未绑定！');
            return;
          }

          // 清空旧卡片
          this.orderListContainer.removeAllChildren();

          // 获取当前活跃订单
          var activeOrders = this.orderManager.getActiveOrders();
          if (activeOrders.length === 0) {
            console.log('[ShopPanel] 当前无活跃订单。');
            return;
          }

          // 为每个订单创建卡片
          for (var _iterator = _createForOfIteratorHelperLoose(activeOrders), _step; !(_step = _iterator()).done;) {
            var order = _step.value;
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
         */;
        _proto.createOrderCard = function createOrderCard(order) {
          var _cardNode$getChildByN,
            _cardNode$getChildByN2,
            _cardNode$getChildByN3,
            _cardNode$getChildByN4,
            _this2 = this;
          var cardNode = instantiate(this.orderCardPrefab);
          cardNode.parent = this.orderListContainer;

          // ---- 顾客名称 ----
          var nameLabel = (_cardNode$getChildByN = cardNode.getChildByName('NameLabel')) == null ? void 0 : _cardNode$getChildByN.getComponent(Label);
          if (nameLabel) {
            nameLabel.string = order.customerName;
          }

          // ---- 需求文本 ----
          var reqLabel = (_cardNode$getChildByN2 = cardNode.getChildByName('RequirementLabel')) == null ? void 0 : _cardNode$getChildByN2.getComponent(Label);
          if (reqLabel) {
            reqLabel.string = this.formatRequirements(order.requirements);
          }

          // ---- 奖励文本 ----
          var rewardLabel = (_cardNode$getChildByN3 = cardNode.getChildByName('RewardLabel')) == null ? void 0 : _cardNode$getChildByN3.getComponent(Label);
          if (rewardLabel) {
            rewardLabel.string = "\u91D1\u5E01+" + order.rewardGold + "  \u82B1+" + order.rewardFlower;
            rewardLabel.color = new Color(255, 215, 0); // 金色
          }

          // ---- 提交按钮 ----
          var submitBtn = (_cardNode$getChildByN4 = cardNode.getChildByName('SubmitBtn')) == null ? void 0 : _cardNode$getChildByN4.getComponent(Button);
          if (submitBtn) {
            submitBtn.node.on(Button.EventType.CLICK, function () {
              _this2.onSubmitOrder(order.orderId);
            }, this);
          }
        }

        /**
         * 将需求数组格式化为可读文本。
         *
         * 材料 ID → 中文名映射：
         * LINE → 红线团, BUTTON → 纽扣, SCISSORS → 剪刀, TAPE → 皮尺, SEWING → 缝纫机
         *
         * @param requirements - 订单需求列表
         * @returns 格式化文本，如 "红线团 x3  纽扣 x2"
         */;
        _proto.formatRequirements = function formatRequirements(requirements) {
          var nameMap = {
            LINE: '红线团',
            BUTTON: '纽扣',
            SCISSORS: '剪刀',
            TAPE: '皮尺',
            SEWING: '缝纫机'
          };
          return requirements.map(function (req) {
            var _nameMap$req$itemId;
            return ((_nameMap$req$itemId = nameMap[req.itemId]) != null ? _nameMap$req$itemId : req.itemId) + " x" + req.count;
          }).join('  ');
        }

        // ==========================================================
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
         */;
        _proto.onSubmitOrder = function onSubmitOrder(orderId) {
          var result = this.orderManager.submitOrder(orderId);
          if (result.success) {
            console.log("[ShopPanel] \u8BA2\u5355 " + orderId + " \u63D0\u4EA4\u6210\u529F\uFF01");
            this.showToast('完成！');
          } else {
            console.warn("[ShopPanel] \u8BA2\u5355 " + orderId + " \u63D0\u4EA4\u5931\u8D25: " + result.reason);
            this.showToast(result.reason === '订单不存在' ? '订单已失效' : '材料不足');
          }
        };
        // ==========================================================
        // UI 更新
        // ==========================================================
        /** 更新金币标签显示 */
        _proto.updateGoldLabel = function updateGoldLabel(value) {
          if (this.goldLabel) {
            this.goldLabel.string = "\u91D1\u5E01: " + value;
          }
        }

        /** 更新小红花标签显示 */;
        _proto.updateFlowerLabel = function updateFlowerLabel(value) {
          if (this.flowerLabel) {
            this.flowerLabel.string = "\u82B1: " + value;
          }
        }

        // ==========================================================
        // 简易提示
        // ==========================================================

        /**
         * 弹出简易文字提示（Console 版实现，生产环境可替换为 UI Toast）。
         *
         * @param message - 提示文字
         */;
        _proto.showToast = function showToast(message) {
          console.log("[ShopPanel] Toast: " + message);
          // 生产环境中可替换为：
          // 1. 创建一个 Toast Label 节点
          // 2. 使用 Tween 做淡入淡出动画
          // 3. 动画结束后销毁节点
        };

        return ShopPanel;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "orderCardPrefab", [_dec2], {
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
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/types.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "08e13igWK9GV5ReanT6IzYH", "types", undefined);
      // ============================================================
      // 衣橱物语 — 全局类型定义
      // 所有模块共享的类型，不依赖任何具体实现
      // ============================================================

      // ---- 三消 (Match-3) ----

      /** 棋子类型：线团、纽扣、剪刀、皮尺、缝纫机 */
      var ElementType = exports('ElementType', /*#__PURE__*/function (ElementType) {
        ElementType["LINE"] = "LINE";
        ElementType["BUTTON"] = "BUTTON";
        ElementType["SCISSORS"] = "SCISSORS";
        ElementType["TAPE"] = "TAPE";
        ElementType["SEWING"] = "SEWING";
        return ElementType;
      }({}));

      /** 特殊道具（4连/5连生成） */
      var SpecialType = exports('SpecialType', /*#__PURE__*/function (SpecialType) {
        SpecialType["NONE"] = "NONE";
        SpecialType["SHUTTLE"] = "SHUTTLE";
        SpecialType["IRON"] = "IRON";
        SpecialType["RAINBOW"] = "RAINBOW";
        return SpecialType;
      }({})); // 彩虹布：清除同色全部（5连）

      /** 单个棋子 */

      /** 一个匹配组（可消除） */

      /** 棋盘配置 */

      // ---- 换装 (Dress-up) ----

      var DressPart = exports('DressPart', /*#__PURE__*/function (DressPart) {
        DressPart["HAIR"] = "HAIR";
        DressPart["TOP"] = "TOP";
        DressPart["BOTTOM"] = "BOTTOM";
        DressPart["SHOES"] = "SHOES";
        DressPart["ACCESSORY"] = "ACCESSORY";
        return DressPart;
      }({}));
      var StyleTag = exports('StyleTag', /*#__PURE__*/function (StyleTag) {
        StyleTag["SWEET"] = "SWEET";
        StyleTag["RETRO"] = "RETRO";
        StyleTag["CYBER"] = "CYBER";
        StyleTag["CUTE"] = "CUTE";
        return StyleTag;
      }({})); // 可爱

      /** 一个服装附件 */

      /** 三消被动 Buff */

      // ---- 背包/库存 (Inventory) ----

      // ---- 订单 (Order) ----

      // ---- 存档 (Save) ----

      // ---- 事件（全局事件总线） ----
      /** 事件名常量 */
      var GameEvent = exports('GameEvent', {
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
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});