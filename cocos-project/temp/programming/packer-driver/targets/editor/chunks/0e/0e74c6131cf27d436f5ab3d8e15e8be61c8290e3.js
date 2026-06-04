System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, Sprite, Prefab, instantiate, resources, SpriteFrame, Color, UITransform, Graphics, MainGameFlow, eventBus, DressPart, StyleTag, GameEvent, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, DressRoomPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMainGameFlow(extras) {
    _reporterNs.report("MainGameFlow", "./MainGameFlow", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDressUpManager(extras) {
    _reporterNs.report("DressUpManager", "../systems/dressup/DressUpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventBus(extras) {
    _reporterNs.report("eventBus", "../core/EventBus", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDressPart(extras) {
    _reporterNs.report("DressPart", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStyleTag(extras) {
    _reporterNs.report("StyleTag", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../core/types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDressAttachment(extras) {
    _reporterNs.report("DressAttachment", "../core/types", _context.meta, extras);
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
      Sprite = _cc.Sprite;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      resources = _cc.resources;
      SpriteFrame = _cc.SpriteFrame;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
      Graphics = _cc.Graphics;
    }, function (_unresolved_2) {
      MainGameFlow = _unresolved_2.MainGameFlow;
    }, function (_unresolved_3) {
      eventBus = _unresolved_3.eventBus;
    }, function (_unresolved_4) {
      DressPart = _unresolved_4.DressPart;
      StyleTag = _unresolved_4.StyleTag;
      GameEvent = _unresolved_4.GameEvent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d61a6Ss2DJNU6U3xahbzYKh", "DressRoomPanel", undefined); // ============================================================
      // DressRoomPanel — 换装房间面板（Cocos Creator 3.x Component）
      //
      // 挂在换装场景根节点上，负责：
      // - 部位 Tab 切换（头发/上衣/下装/鞋子/配饰）
      // - 服装列表展示与点击换装
      // - 娃预览图更新
      // - 风格计分与 Buff 效果显示
      // ============================================================


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'Sprite', 'Prefab', 'instantiate', 'resources', 'SpriteFrame', 'Color', 'UITransform', 'Graphics']);

      ({
        ccclass,
        property
      } = _decorator);

      /**
       * 换装房间面板。
       *
       * 交互流程：
       * 1. 玩家点击顶部 Tab 切换部位
       * 2. 右侧列表展示该部位所有可用服装
       * 3. 点击某件服装 → 娃模型即时更新
       * 4. 底部显示当前风格计分和 Buff
       */
      _export("DressRoomPanel", DressRoomPanel = (_dec = ccclass('DressRoomPanel'), _dec2 = property({
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
      }), _dec(_class = (_class2 = class DressRoomPanel extends Component {
        constructor(...args) {
          super(...args);

          // ---- @property 属性（在编辑器中绑定） ----

          /** 娃预览 Sprite（简化版预览，生产环境建议用 Spine） */
          _initializerDefineProperty(this, "dollPreview", _descriptor, this);

          /** 部位 Tab 按钮容器（含 5 个子节点：HAIR/TOP/BOTTOM/SHOES/ACCESSORY） */
          _initializerDefineProperty(this, "tabContainer", _descriptor2, this);

          /** 服装列表容器（ScrollView 的 content 节点） */
          _initializerDefineProperty(this, "itemListContainer", _descriptor3, this);

          /** 服装列表项预制体 */
          _initializerDefineProperty(this, "itemPrefab", _descriptor4, this);

          /** 风格计分标签 */
          _initializerDefineProperty(this, "styleScoreLabel", _descriptor5, this);

          /** Buff 效果标签 */
          _initializerDefineProperty(this, "buffLabel", _descriptor6, this);

          // ---- 私有成员 ----

          /** 换装管理器引用（来自 MainGameFlow 单例） */
          this.dressUpManager = void 0;

          /** 当前选中的部位 */
          this.currentPart = (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).HAIR;

          /** 服装目录（所有可用服装数据） */
          this.catalog = [];
          this.levelOutfitContainer = null;
          this.previewGraphic = null;

          // ==========================================================
          // 事件回调
          // ==========================================================

          /**
           * 换装事件回调（由 DRESS_CHANGED 事件触发）。
           * 自动刷新娃预览和 Buff/计分显示。
           */
          this.onDressChanged = () => {
            this.refreshLevelOutfits();
            this.refreshDollPreview();
            this.refreshBuffDisplay();
          };
        }

        // ==========================================================
        // 生命周期
        // ==========================================================
        start() {
          // 从全局协调器获取系统实例
          const mgf = (_crd && MainGameFlow === void 0 ? (_reportPossibleCrUseOfMainGameFlow({
            error: Error()
          }), MainGameFlow) : MainGameFlow).getInstance();
          this.dressUpManager = mgf.dressUpManager;
          this.ensureFallbackUi(); // 初始化 5 个关卡解锁套装

          this.initCatalog();
          this.ensureDefaultOutfit();
          this.refreshLevelOutfits(); // 监听换装事件 → 自动刷新预览和 Buff 显示

          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).DRESS_CHANGED, this.onDressChanged); // 初始化预览

          this.refreshDollPreview();
          this.refreshBuffDisplay();
        }

        onDestroy() {
          // 清理事件监听
          (_crd && eventBus === void 0 ? (_reportPossibleCrUseOfeventBus({
            error: Error()
          }), eventBus) : eventBus).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).DRESS_CHANGED, this.onDressChanged);
        } // ==========================================================
        // 服装目录初始化
        // ==========================================================

        /**
         * 初始化 5 个关卡套装。
         *
         * Level 1 默认解锁白色套装；Level 2-5 随三消通关逐级解锁。
         */


        initCatalog() {
          this.catalog = [{
            id: 'outfit_level_1_white',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'dress',
            attachmentName: 'dress_white',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET,
            isFullDress: true,
            level: 1,
            displayName: 'White Outfit',
            colorName: 'White',
            outfitColor: new Color(245, 245, 238, 255)
          }, {
            id: 'outfit_level_2_red',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'dress',
            attachmentName: 'dress_red',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET,
            isFullDress: true,
            level: 2,
            displayName: 'Red Outfit',
            colorName: 'Red',
            outfitColor: new Color(218, 66, 72, 255)
          }, {
            id: 'outfit_level_3_blue',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'dress',
            attachmentName: 'dress_blue',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CYBER,
            isFullDress: true,
            level: 3,
            displayName: 'Blue Outfit',
            colorName: 'Blue',
            outfitColor: new Color(61, 128, 218, 255),
            matchBuff: {
              type: 'EXTRA_MOVE',
              value: 1
            }
          }, {
            id: 'outfit_level_4_green',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'dress',
            attachmentName: 'dress_green',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CUTE,
            isFullDress: true,
            level: 4,
            displayName: 'Green Outfit',
            colorName: 'Green',
            outfitColor: new Color(72, 166, 106, 255),
            matchBuff: {
              type: 'COIN_BONUS',
              value: 10
            }
          }, {
            id: 'outfit_level_5_purple',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'dress',
            attachmentName: 'dress_purple',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).RETRO,
            isFullDress: true,
            level: 5,
            displayName: 'Purple Outfit',
            colorName: 'Purple',
            outfitColor: new Color(142, 92, 184, 255),
            matchBuff: {
              type: 'START_BOMB',
              value: 1
            }
          }];
        }

        ensureDefaultOutfit() {
          const currentDress = this.dressUpManager.getCurrentDress();

          if (currentDress[(_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).TOP]) {
            return;
          }

          const defaultOutfit = this.getLevelOutfits()[0];

          if (defaultOutfit) {
            this.dressUpManager.changeEquipment(defaultOutfit.part, defaultOutfit);
          }
        }

        getLevelOutfits() {
          return this.catalog.filter(attachment => typeof attachment.level === 'number').sort((a, b) => {
            var _a$level, _b$level;

            return ((_a$level = a.level) != null ? _a$level : 0) - ((_b$level = b.level) != null ? _b$level : 0);
          });
        }

        refreshLevelOutfits() {
          const container = this.ensureLevelOutfitContainer();
          container.removeAllChildren();
          const unlockedLevel = (_crd && MainGameFlow === void 0 ? (_reportPossibleCrUseOfMainGameFlow({
            error: Error()
          }), MainGameFlow) : MainGameFlow).getInstance().getUnlockedOutfitLevel();
          const outfits = this.getLevelOutfits();

          for (let i = 0; i < outfits.length; i++) {
            this.createLevelOutfitCard(outfits[i], i, unlockedLevel);
          }
        }

        createLevelOutfitCard(outfit, index, unlockedLevel) {
          var _outfit$level, _outfit$outfitColor, _ref, _outfit$colorName;

          const container = this.ensureLevelOutfitContainer();
          const level = (_outfit$level = outfit.level) != null ? _outfit$level : 1;
          const isUnlocked = level <= unlockedLevel;
          const currentTop = this.dressUpManager.getCurrentDress()[(_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).TOP];
          const isSelected = (currentTop == null ? void 0 : currentTop.id) === outfit.id;
          const cardNode = new Node(`OutfitLevel${level}`);
          cardNode.parent = container;
          cardNode.setPosition(-292 + index * 146, 24, 0);
          const width = 124;
          const height = 190;
          const transform = cardNode.addComponent(UITransform);
          transform.setContentSize(width, height);
          const graphics = cardNode.addComponent(Graphics);
          graphics.fillColor = isUnlocked ? (_outfit$outfitColor = outfit.outfitColor) != null ? _outfit$outfitColor : new Color(245, 245, 245, 255) : new Color(54, 57, 66, 255);
          graphics.rect(-width / 2, -height / 2, width, height);
          graphics.fill();
          graphics.lineWidth = isSelected ? 5 : 2;
          graphics.strokeColor = isSelected ? new Color(255, 230, 120, 255) : new Color(235, 239, 245, isUnlocked ? 210 : 90);
          graphics.rect(-width / 2, -height / 2, width, height);
          graphics.stroke();
          const labelNode = new Node('OutfitLabel');
          labelNode.parent = cardNode;
          labelNode.setPosition(0, -8, 0);
          const labelTransform = labelNode.addComponent(UITransform);
          labelTransform.setContentSize(width - 14, height - 18);
          const label = labelNode.addComponent(Label);
          label.string = [`Lv.${level}`, (_ref = (_outfit$colorName = outfit.colorName) != null ? _outfit$colorName : outfit.displayName) != null ? _ref : outfit.id, isUnlocked ? isSelected ? 'Wearing' : 'Unlocked' : 'Locked'].join('\n');
          label.fontSize = 18;
          label.lineHeight = 24;
          label.color = isUnlocked ? new Color(255, 255, 255, 255) : new Color(155, 160, 170, 255);
          const button = this.ensureButton(cardNode, width, height);
          button.interactable = isUnlocked;

          if (isUnlocked) {
            button.node.on(Button.EventType.CLICK, () => {
              this.onItemClick(outfit);
            }, this);
          }
        } // ==========================================================
        // Tab 初始化
        // ==========================================================

        /**
         * 为 tabContainer 中的每个子节点绑定点击事件。
         *
         * 子节点命名约定：HAIR / TOP / BOTTOM / SHOES / ACCESSORY。
         * 根据子节点名称匹配对应的 DressPart 枚举值。
         */


        initTabs() {
          const tabContainer = this.ensureTabContainer();
          const partMap = {
            HAIR: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).HAIR,
            TOP: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            BOTTOM: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).BOTTOM,
            SHOES: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).SHOES,
            ACCESSORY: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).ACCESSORY
          };

          for (const child of tabContainer.children) {
            const part = partMap[child.name];
            if (!part) continue;
            const btn = this.ensureButton(child, 120, 44);
            btn.node.on(Button.EventType.CLICK, () => {
              this.switchTab(part);
            }, this);
          }
        } // ==========================================================
        // Tab 切换
        // ==========================================================

        /**
         * 切换到指定部位 Tab。
         *
         * 更新当前选中状态，清空并重新填充服装列表。
         *
         * @param part - 目标部位
         */


        switchTab(part) {
          this.currentPart = part; // 更新 Tab 高亮状态

          this.updateTabHighlight(part);
          const itemListContainer = this.ensureItemListContainer(); // 清空当前列表

          itemListContainer.removeAllChildren(); // 筛选该部位的服装并创建列表项

          const items = this.catalog.filter(att => att.part === part);

          for (const attachment of items) {
            this.createItemButton(attachment);
          }
        }
        /**
         * 更新 Tab 按钮的高亮显示。
         *
         * 当前选中的 Tab 按钮颜色变亮，其余恢复默认。
         *
         * @param activePart - 当前选中的部位
         */


        updateTabHighlight(activePart) {
          const tabContainer = this.ensureTabContainer();
          const partMap = {
            HAIR: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).HAIR,
            TOP: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            BOTTOM: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).BOTTOM,
            SHOES: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).SHOES,
            ACCESSORY: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).ACCESSORY
          };

          for (const child of tabContainer.children) {
            var _child$getComponent;

            const part = partMap[child.name];
            if (!part) continue;
            const label = (_child$getComponent = child.getComponent(Label)) != null ? _child$getComponent : child.getComponentInChildren(Label);

            if (label) {
              label.color = part === activePart ? new Color(255, 255, 255) // 选中：白色
              : new Color(120, 120, 120); // 未选中：灰色
            }
          }
        } // ==========================================================
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
         */


        createItemButton(attachment) {
          const itemListContainer = this.ensureItemListContainer();
          let itemNode;
          const index = itemListContainer.children.length;

          if (this.itemPrefab) {
            // 使用预制体
            itemNode = instantiate(this.itemPrefab);
          } else {
            // 动态创建简易节点（无预制体时的后备方案）
            itemNode = new Node('Item_' + attachment.id);
            const transform = itemNode.addComponent(UITransform);
            transform.setContentSize(220, 48);
            const labelComp = itemNode.addComponent(Label);
            labelComp.string = `${attachment.id} [${attachment.style}]`;
            labelComp.fontSize = 20;
            labelComp.color = new Color(255, 255, 255);
          }

          itemNode.parent = itemListContainer;

          if (!this.itemPrefab) {
            itemNode.setPosition(-135 + index % 2 * 270, 110 - Math.floor(index / 2) * 64, 0);
          } // 设置显示文本


          const label = itemNode.getComponentInChildren(Label);

          if (label) {
            var _styleNames$attachmen;

            const styleNames = {
              SWEET: '甜美',
              RETRO: '复古',
              CYBER: '赛博',
              CUTE: '可爱'
            };
            const styleName = (_styleNames$attachmen = styleNames[attachment.style]) != null ? _styleNames$attachmen : attachment.style;
            label.string = `${attachment.id} [${styleName}]`; // 若带 Buff 则追加标记

            if (attachment.matchBuff) {
              label.string += ` ★B`;
            }
          } // 绑定点击事件


          const btn = this.getOrCreateButton(itemNode, 220, 48);
          btn.node.on(Button.EventType.CLICK, () => {
            this.onItemClick(attachment);
          }, this);
        }

        ensureFallbackUi() {
          this.ensureDollPreview();
          this.ensureLevelOutfitContainer();

          if (!this.styleScoreLabel || !this.styleScoreLabel.isValid) {
            this.styleScoreLabel = this.createFallbackLabel('FallbackStyleScoreLabel', '', 0, -190, 620, 30, 16);
          }

          if (!this.buffLabel || !this.buffLabel.isValid) {
            this.buffLabel = this.createFallbackLabel('FallbackBuffLabel', '', 0, -225, 620, 30, 16);
          }
        }

        ensureDollPreview() {
          var _previewNode$getCompo, _previewNode$getCompo2;

          if (this.dollPreview && this.dollPreview.isValid) {
            return this.dollPreview;
          }

          let previewNode = this.node.getChildByName('FallbackDollPreview');

          if (!previewNode) {
            previewNode = new Node('FallbackDollPreview');
            previewNode.parent = this.node;
            previewNode.setPosition(-430, 35, 0);
          }

          let transform = previewNode.getComponent(UITransform);

          if (!transform) {
            transform = previewNode.addComponent(UITransform);
          }

          transform.setContentSize(210, 300);
          this.previewGraphic = (_previewNode$getCompo = previewNode.getComponent(Graphics)) != null ? _previewNode$getCompo : previewNode.addComponent(Graphics);
          this.dollPreview = (_previewNode$getCompo2 = previewNode.getComponent(Sprite)) != null ? _previewNode$getCompo2 : previewNode.addComponent(Sprite);
          return this.dollPreview;
        }

        ensureLevelOutfitContainer() {
          if (this.levelOutfitContainer && this.levelOutfitContainer.isValid) {
            return this.levelOutfitContainer;
          }

          if (this.itemListContainer && this.itemListContainer.isValid) {
            this.levelOutfitContainer = this.itemListContainer;
            return this.levelOutfitContainer;
          }

          let container = this.node.getChildByName('FallbackLevelOutfitList');

          if (!container) {
            container = new Node('FallbackLevelOutfitList');
            container.parent = this.node;
            container.setPosition(150, 35, 0);
          }

          let transform = container.getComponent(UITransform);

          if (!transform) {
            transform = container.addComponent(UITransform);
          }

          transform.setContentSize(760, 260);
          this.levelOutfitContainer = container;
          this.itemListContainer = container;
          return container;
        }

        ensureTabContainer() {
          if (this.tabContainer && this.tabContainer.isValid) {
            return this.tabContainer;
          }

          let container = this.node.getChildByName('FallbackDressTabs');

          if (!container) {
            container = new Node('FallbackDressTabs');
            container.parent = this.node;
            container.setPosition(0, 240, 0);
            const tabs = [['HAIR', 'Hair'], ['TOP', 'Top'], ['BOTTOM', 'Bottom'], ['SHOES', 'Shoes'], ['ACCESSORY', 'Acc']];

            for (let i = 0; i < tabs.length; i++) {
              const [name, text] = tabs[i];
              const tabNode = new Node(name);
              tabNode.parent = container;
              tabNode.setPosition(-240 + i * 120, 0, 0);
              const transform = tabNode.addComponent(UITransform);
              transform.setContentSize(110, 42);
              const label = tabNode.addComponent(Label);
              label.string = text;
              label.fontSize = 18;
              label.color = new Color(180, 186, 196, 255);
              this.ensureButton(tabNode, 110, 42);
            }
          }

          let transform = container.getComponent(UITransform);

          if (!transform) {
            transform = container.addComponent(UITransform);
          }

          transform.setContentSize(620, 50);
          this.tabContainer = container;
          return container;
        }

        ensureItemListContainer() {
          if (this.itemListContainer && this.itemListContainer.isValid) {
            return this.itemListContainer;
          }

          let container = this.node.getChildByName('FallbackDressItemList');

          if (!container) {
            container = new Node('FallbackDressItemList');
            container.parent = this.node;
            container.setPosition(0, 40, 0);
          }

          let transform = container.getComponent(UITransform);

          if (!transform) {
            transform = container.addComponent(UITransform);
          }

          transform.setContentSize(620, 320);
          this.itemListContainer = container;
          return container;
        }

        createFallbackLabel(name, text, x, y, width, height, fontSize) {
          const node = new Node(name);
          node.parent = this.node;
          node.setPosition(x, y, 0);
          const transform = node.addComponent(UITransform);
          transform.setContentSize(width, height);
          const label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.color = new Color(235, 239, 245, 255);
          return label;
        }

        ensureButton(node, width, height) {
          var _node$getComponent;

          let transform = node.getComponent(UITransform);

          if (!transform) {
            transform = node.addComponent(UITransform);
          }

          const size = transform.contentSize;

          if (!size || size.width <= 0 || size.height <= 0) {
            transform.setContentSize(width, height);
          }

          const button = (_node$getComponent = node.getComponent(Button)) != null ? _node$getComponent : node.addComponent(Button);
          button.interactable = true;
          button.target = node;
          return button;
        }

        getOrCreateButton(node, width, height) {
          var _node$getComponent2;

          const existingButton = (_node$getComponent2 = node.getComponent(Button)) != null ? _node$getComponent2 : node.getComponentInChildren(Button);

          if (existingButton) {
            this.ensureButton(existingButton.node, width, height);
            return existingButton;
          }

          return this.ensureButton(node, width, height);
        } // ==========================================================
        // 换装交互
        // ==========================================================

        /**
         * 点击服装列表项 → 执行换装。
         *
         * 调用 DressUpManager.changeEquipment，成功后自动触发
         * DRESS_CHANGED 事件 → onDressChanged 回调刷新预览和 Buff。
         *
         * @param attachment - 选中的服装附件
         */


        onItemClick(attachment) {
          const result = this.dressUpManager.changeEquipment(attachment.part, attachment);

          if (result.success) {
            console.log(`[DressRoomPanel] 换装成功: ${attachment.id}`);

            if (result.replaced) {
              console.log(`[DressRoomPanel]   替换了旧装: ${result.replaced.id}`);
            }

            this.refreshLevelOutfits();
          }
        } // ==========================================================
        // 预览刷新
        // ==========================================================

        /**
         * 根据当前穿戴状态刷新娃预览图。
         *
         * 按部位顺序叠加（HAIR → TOP → BOTTOM → SHOES → ACCESSORY）。
         * 简化版实现：通过 resources.load 加载各部位对应的 SpriteFrame。
         *
         * 生产环境建议使用 Spine 骨骼动画代替 Sprite 叠加。
         */


        refreshDollPreview() {
          var _topOutfit$outfitColo;

          this.ensureDollPreview();
          if (!this.dollPreview) return;
          const currentDress = this.dressUpManager.getCurrentDress();
          const topOutfit = currentDress[(_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).TOP];
          this.drawFallbackPreview((_topOutfit$outfitColo = topOutfit == null ? void 0 : topOutfit.outfitColor) != null ? _topOutfit$outfitColo : new Color(245, 245, 238, 255)); // 部位叠层顺序（后渲染的在上层）

          const partOrder = [(_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).SHOES, (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).BOTTOM, (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).TOP, (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).ACCESSORY, (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).HAIR]; // 尝试加载第一个有效部位的精灵帧作为预览
          // （简化版：显示最后一个已穿戴部位对应的精灵）

          for (let i = partOrder.length - 1; i >= 0; i--) {
            const part = partOrder[i];
            const attachment = currentDress[part];

            if (attachment) {
              // 尝试从 resources 加载对应精灵帧
              const path = `dress_preview/${attachment.id}`;
              resources.load(path, SpriteFrame, (err, spriteFrame) => {
                if (!err && spriteFrame && this.dollPreview) {
                  this.dollPreview.spriteFrame = spriteFrame;
                }
              });
              return;
            }
          } // 无穿戴 → 显示默认素体


          resources.load('dress_preview/default', SpriteFrame, (err, sf) => {
            if (!err && sf && this.dollPreview) {
              this.dollPreview.spriteFrame = sf;
            }
          });
        }

        drawFallbackPreview(outfitColor) {
          const graphics = this.previewGraphic;

          if (!graphics) {
            return;
          }

          graphics.clear();
          graphics.fillColor = new Color(239, 207, 185, 255);
          graphics.circle(0, 94, 34);
          graphics.fill();
          graphics.fillColor = new Color(76, 64, 58, 255);
          graphics.rect(-32, 112, 64, 18);
          graphics.fill();
          graphics.fillColor = outfitColor;
          graphics.moveTo(-58, 50);
          graphics.lineTo(58, 50);
          graphics.lineTo(78, -90);
          graphics.lineTo(-78, -90);
          graphics.close();
          graphics.fill();
          graphics.lineWidth = 4;
          graphics.strokeColor = new Color(255, 255, 255, 210);
          graphics.moveTo(-58, 50);
          graphics.lineTo(58, 50);
          graphics.lineTo(78, -90);
          graphics.lineTo(-78, -90);
          graphics.close();
          graphics.stroke();
        }
        /**
         * 刷新 Buff 和风格计分显示。
         *
         * - buffLabel: 当前生效的三消 Buff 列表
         * - styleScoreLabel: 四种风格的当前得分
         */


        refreshBuffDisplay() {
          // ---- Buff 显示 ----
          if (this.buffLabel) {
            var _currentOutfit$displa;

            const buffs = this.dressUpManager.getActiveBuffs();
            const currentOutfit = this.dressUpManager.getCurrentDress()[(_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP];
            const outfitName = (_currentOutfit$displa = currentOutfit == null ? void 0 : currentOutfit.displayName) != null ? _currentOutfit$displa : 'White Outfit';

            if (buffs.length === 0) {
              this.buffLabel.string = `Current: ${outfitName} | No Buff`;
            } else {
              const buffNames = {
                COIN_BONUS: 'Coin Bonus',
                START_BOMB: 'Start Bomb',
                EXTRA_MOVE: 'Extra Move'
              };
              const lines = buffs.map(b => {
                var _buffNames$b$type;

                return `${(_buffNames$b$type = buffNames[b.type]) != null ? _buffNames$b$type : b.type}: +${b.value}`;
              });
              this.buffLabel.string = `Current: ${outfitName} | ` + lines.join(' | ');
            }
          } // ---- 风格计分 ----


          if (this.styleScoreLabel) {
            const unlockedLevel = (_crd && MainGameFlow === void 0 ? (_reportPossibleCrUseOfMainGameFlow({
              error: Error()
            }), MainGameFlow) : MainGameFlow).getInstance().getUnlockedOutfitLevel();
            this.styleScoreLabel.string = `Outfits unlocked: ${unlockedLevel}/5`;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dollPreview", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tabContainer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "itemListContainer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "itemPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "styleScoreLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "buffLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0e74c6131cf27d436f5ab3d8e15e8be61c8290e3.js.map