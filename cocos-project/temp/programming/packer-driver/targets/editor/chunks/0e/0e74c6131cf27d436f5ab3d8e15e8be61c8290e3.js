System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, Sprite, Prefab, instantiate, resources, SpriteFrame, Color, UITransform, MainGameFlow, eventBus, DressPart, StyleTag, GameEvent, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, DressRoomPanel;

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


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'Sprite', 'Prefab', 'instantiate', 'resources', 'SpriteFrame', 'Color', 'UITransform']);

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

          // ==========================================================
          // 事件回调
          // ==========================================================

          /**
           * 换装事件回调（由 DRESS_CHANGED 事件触发）。
           * 自动刷新娃预览和 Buff/计分显示。
           */
          this.onDressChanged = () => {
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
          this.dressUpManager = mgf.dressUpManager; // 初始化服装目录（每个部位至少 2 件）

          this.initCatalog(); // 绑定 Tab 按钮事件

          this.initTabs(); // 默认显示 HAIR 部位

          this.switchTab((_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
            error: Error()
          }), DressPart) : DressPart).HAIR); // 监听换装事件 → 自动刷新预览和 Buff 显示

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
         * 初始化内置服装目录。
         *
         * 每个部位至少 2 件衣服，覆盖 4 种风格。
         * 部分衣服带有三消 Buff（COIN_BONUS / START_BOMB / EXTRA_MOVE）。
         */


        initCatalog() {
          this.catalog = [// ---- 头发 ----
          {
            id: 'hair_01',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).HAIR,
            slotName: 'hair',
            attachmentName: 'hair_sweet_pink',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET,
            matchBuff: {
              type: 'COIN_BONUS',
              value: 10
            }
          }, {
            id: 'hair_02',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).HAIR,
            slotName: 'hair',
            attachmentName: 'hair_cyber_neon',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CYBER
          }, {
            id: 'hair_03',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).HAIR,
            slotName: 'hair',
            attachmentName: 'hair_retro_curl',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).RETRO
          }, // ---- 上衣 ----
          {
            id: 'top_01',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'top',
            attachmentName: 'top_sweet_lace',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET,
            matchBuff: {
              type: 'START_BOMB',
              value: 1
            }
          }, {
            id: 'top_02',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'top',
            attachmentName: 'top_cute_hoodie',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CUTE,
            matchBuff: {
              type: 'COIN_BONUS',
              value: 15
            }
          }, {
            id: 'top_03',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).TOP,
            slotName: 'top',
            attachmentName: 'top_cyber_jacket',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CYBER,
            isFullDress: false
          }, // ---- 下装 ----
          {
            id: 'bottom_01',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).BOTTOM,
            slotName: 'bottom',
            attachmentName: 'bottom_sweet_skirt',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET
          }, {
            id: 'bottom_02',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).BOTTOM,
            slotName: 'bottom',
            attachmentName: 'bottom_retro_pants',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).RETRO,
            matchBuff: {
              type: 'EXTRA_MOVE',
              value: 3
            }
          }, {
            id: 'bottom_03',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).BOTTOM,
            slotName: 'bottom',
            attachmentName: 'bottom_cute_shorts',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CUTE
          }, // ---- 鞋子 ----
          {
            id: 'shoes_01',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).SHOES,
            slotName: 'shoes',
            attachmentName: 'shoes_sweet_maryjane',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET
          }, {
            id: 'shoes_02',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).SHOES,
            slotName: 'shoes',
            attachmentName: 'shoes_cyber_boots',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CYBER,
            matchBuff: {
              type: 'COIN_BONUS',
              value: 5
            }
          }, {
            id: 'shoes_03',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).SHOES,
            slotName: 'shoes',
            attachmentName: 'shoes_retro_heels',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).RETRO
          }, // ---- 配饰 ----
          {
            id: 'acc_01',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).ACCESSORY,
            slotName: 'accessory',
            attachmentName: 'acc_sweet_bow',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET
          }, {
            id: 'acc_02',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).ACCESSORY,
            slotName: 'accessory',
            attachmentName: 'acc_cute_cat_ears',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CUTE,
            matchBuff: {
              type: 'EXTRA_MOVE',
              value: 2
            }
          }, {
            id: 'acc_03',
            part: (_crd && DressPart === void 0 ? (_reportPossibleCrUseOfDressPart({
              error: Error()
            }), DressPart) : DressPart).ACCESSORY,
            slotName: 'accessory',
            attachmentName: 'acc_cyber_goggles',
            style: (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CYBER
          }];
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
          if (!this.tabContainer) return;
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

          for (const child of this.tabContainer.children) {
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

          this.updateTabHighlight(part); // 清空当前列表

          if (this.itemListContainer) {
            this.itemListContainer.removeAllChildren();
          } // 筛选该部位的服装并创建列表项


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
          if (!this.tabContainer) return;
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

          for (const child of this.tabContainer.children) {
            const part = partMap[child.name];
            if (!part) continue;
            const label = child.getComponentInChildren(Label);

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
          if (!this.itemListContainer) return;
          let itemNode;

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

          itemNode.parent = this.itemListContainer; // 设置显示文本

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
          if (!this.dollPreview) return;
          const currentDress = this.dressUpManager.getCurrentDress(); // 部位叠层顺序（后渲染的在上层）

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
        /**
         * 刷新 Buff 和风格计分显示。
         *
         * - buffLabel: 当前生效的三消 Buff 列表
         * - styleScoreLabel: 四种风格的当前得分
         */


        refreshBuffDisplay() {
          // ---- Buff 显示 ----
          if (this.buffLabel) {
            const buffs = this.dressUpManager.getActiveBuffs();

            if (buffs.length === 0) {
              this.buffLabel.string = '当前无 Buff';
            } else {
              const buffNames = {
                COIN_BONUS: '金币加成',
                START_BOMB: '开局炸弹',
                EXTRA_MOVE: '额外步数'
              };
              const lines = buffs.map(b => {
                var _buffNames$b$type;

                return `${(_buffNames$b$type = buffNames[b.type]) != null ? _buffNames$b$type : b.type}: +${b.value}`;
              });
              this.buffLabel.string = 'Buff: ' + lines.join(' | ');
            }
          } // ---- 风格计分 ----


          if (this.styleScoreLabel) {
            const styles = [(_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).SWEET, (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).RETRO, (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CYBER, (_crd && StyleTag === void 0 ? (_reportPossibleCrUseOfStyleTag({
              error: Error()
            }), StyleTag) : StyleTag).CUTE];
            const styleNames = {
              SWEET: '甜美',
              RETRO: '复古',
              CYBER: '赛博',
              CUTE: '可爱'
            };
            const lines = styles.map(s => {
              const score = this.dressUpManager.getStyleScore(s);
              return `${styleNames[s]}: ${score}`;
            });
            this.styleScoreLabel.string = '风格计分: ' + lines.join(' | ');
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