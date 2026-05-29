// ============================================================
// DressUpManager 单元测试 — TDD
// ============================================================

import { DressUpManager } from '../../src/systems/dressup/DressUpManager';
import { DressPart, StyleTag, GameEvent, DressAttachment, MatchBuff } from '../../src/types';
import { eventBus } from '../../src/core/EventBus';

// ---- 测试辅助：构建模拟服装数据 ----

/** 连衣裙标记 — 在 DressAttachment 上扩展 isFullDress */
interface FullDressAttachment extends DressAttachment {
  isFullDress?: boolean;
}

function makeAttachment(overrides: Partial<FullDressAttachment> & { id: string; part: DressPart }): FullDressAttachment {
  return {
    slotName: `slot_${overrides.part.toLowerCase()}`,
    attachmentName: `attach_${overrides.id}`,
    style: StyleTag.SWEET,
    ...overrides,
  };
}

// ---- 服装目录（模拟数据） ----

const sweetTop: FullDressAttachment = makeAttachment({ id: 'top_001', part: DressPart.TOP, style: StyleTag.SWEET });
const retroTop: FullDressAttachment = makeAttachment({ id: 'top_002', part: DressPart.TOP, style: StyleTag.RETRO });
const fullDress: FullDressAttachment = makeAttachment({
  id: 'dress_001',
  part: DressPart.TOP,
  style: StyleTag.CUTE,
  isFullDress: true,
});
const sweetBottom: FullDressAttachment = makeAttachment({ id: 'bottom_001', part: DressPart.BOTTOM, style: StyleTag.SWEET });
const cyberShoes: FullDressAttachment = makeAttachment({ id: 'shoes_001', part: DressPart.SHOES, style: StyleTag.CYBER });
const cuteHair: FullDressAttachment = makeAttachment({ id: 'hair_001', part: DressPart.HAIR, style: StyleTag.CUTE });
const sweetAcc: FullDressAttachment = makeAttachment({ id: 'acc_001', part: DressPart.ACCESSORY, style: StyleTag.SWEET });

const coinBuffTop: FullDressAttachment = makeAttachment({
  id: 'top_buff_001',
  part: DressPart.TOP,
  style: StyleTag.RETRO,
  matchBuff: { type: 'COIN_BONUS', value: 20 },
});
const bombBuffBottom: FullDressAttachment = makeAttachment({
  id: 'bottom_buff_001',
  part: DressPart.BOTTOM,
  style: StyleTag.CYBER,
  matchBuff: { type: 'START_BOMB', value: 1 },
});
const coinBuffShoes: FullDressAttachment = makeAttachment({
  id: 'shoes_buff_001',
  part: DressPart.SHOES,
  style: StyleTag.CUTE,
  matchBuff: { type: 'COIN_BONUS', value: 10 },
});

const allCatalog: FullDressAttachment[] = [
  sweetTop, retroTop, fullDress, sweetBottom, cyberShoes,
  cuteHair, sweetAcc, coinBuffTop, bombBuffBottom, coinBuffShoes,
];

// ---- 测试前重置 EventBus ----

beforeEach(() => {
  eventBus.reset();
});

// ============================================================
// 测试套件
// ============================================================

describe('DressUpManager', () => {
  // --- 基础换装 ---
  describe('changeEquipment', () => {
    it('应该能穿上衣服并返回成功', () => {
      const manager = new DressUpManager();
      const result = manager.changeEquipment(DressPart.TOP, sweetTop);
      expect(result.success).toBe(true);
      expect(result.replaced).toBeUndefined();
    });

    it('应该能替换已穿上的衣服，返回被替换的旧衣服', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);
      const result = manager.changeEquipment(DressPart.TOP, retroTop);
      expect(result.success).toBe(true);
      expect(result.replaced).toBe(sweetTop);
    });

    it('应该在换装后发射 dress:changed 事件', () => {
      const manager = new DressUpManager();
      const listener = jest.fn();
      eventBus.on(GameEvent.DRESS_CHANGED, listener);

      manager.changeEquipment(DressPart.HAIR, cuteHair);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ part: DressPart.HAIR, attachment: cuteHair });
    });

    it('应该在换装后发射 style:bonus_changed 事件', () => {
      const manager = new DressUpManager();
      const listener = jest.fn();
      eventBus.on(GameEvent.STYLE_BONUS_CHANGED, listener);

      manager.changeEquipment(DressPart.TOP, coinBuffTop);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ buffs: [coinBuffTop.matchBuff] });
    });
  });

  // --- 卸下装备 ---
  describe('removeEquipment', () => {
    it('应该能卸下已穿上的衣服', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);
      manager.removeEquipment(DressPart.TOP);
      const current = manager.getCurrentDress();
      expect(current[DressPart.TOP]).toBeUndefined();
    });

    it('卸下不存在的部位不应报错', () => {
      const manager = new DressUpManager();
      expect(() => manager.removeEquipment(DressPart.SHOES)).not.toThrow();
    });

    it('卸下后应发射 dress:changed 事件', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);

      const listener = jest.fn();
      eventBus.on(GameEvent.DRESS_CHANGED, listener);

      manager.removeEquipment(DressPart.TOP);
      expect(listener).toHaveBeenCalledWith({ part: DressPart.TOP, attachment: undefined });
    });
  });

  // --- 连衣裙自动卸下装 ---
  describe('连衣裙规则', () => {
    it('穿上连衣裙 (isFullDress=true) 应自动卸下 BOTTOM', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.BOTTOM, sweetBottom);
      const result = manager.changeEquipment(DressPart.TOP, fullDress);

      expect(result.success).toBe(true);
      const current = manager.getCurrentDress();
      expect(current[DressPart.BOTTOM]).toBeUndefined();
      expect(current[DressPart.TOP]).toBe(fullDress);
    });

    it('穿普通上衣不应影响下装', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.BOTTOM, sweetBottom);
      manager.changeEquipment(DressPart.TOP, sweetTop);

      const current = manager.getCurrentDress();
      expect(current[DressPart.BOTTOM]).toBe(sweetBottom);
      expect(current[DressPart.TOP]).toBe(sweetTop);
    });
  });

  // --- getCurrentDress ---
  describe('getCurrentDress', () => {
    it('初始状态应返回空对象', () => {
      const manager = new DressUpManager();
      expect(manager.getCurrentDress()).toEqual({});
    });

    it('穿上多件后应返回所有部位映射', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);
      manager.changeEquipment(DressPart.SHOES, cyberShoes);
      manager.changeEquipment(DressPart.HAIR, cuteHair);

      const current = manager.getCurrentDress();
      expect(current[DressPart.TOP]).toBe(sweetTop);
      expect(current[DressPart.SHOES]).toBe(cyberShoes);
      expect(current[DressPart.HAIR]).toBe(cuteHair);
      expect(current[DressPart.BOTTOM]).toBeUndefined();
      expect(current[DressPart.ACCESSORY]).toBeUndefined();
    });
  });

  // --- 风格计分 ---
  describe('getStyleScore', () => {
    it('初始风格分数应为 0', () => {
      const manager = new DressUpManager();
      expect(manager.getStyleScore(StyleTag.SWEET)).toBe(0);
    });

    it('每件同风格衣服 value 1 分，应累加', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);     // SWEET
      manager.changeEquipment(DressPart.BOTTOM, sweetBottom); // SWEET
      manager.changeEquipment(DressPart.ACCESSORY, sweetAcc); // SWEET

      expect(manager.getStyleScore(StyleTag.SWEET)).toBe(3);
      expect(manager.getStyleScore(StyleTag.RETRO)).toBe(0);
    });

    it('混搭风格应各自计分', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);      // SWEET
      manager.changeEquipment(DressPart.BOTTOM, sweetBottom); // SWEET
      manager.changeEquipment(DressPart.SHOES, cyberShoes);   // CYBER

      expect(manager.getStyleScore(StyleTag.SWEET)).toBe(2);
      expect(manager.getStyleScore(StyleTag.CYBER)).toBe(1);
    });
  });

  // --- Buff 收集 ---
  describe('getActiveBuffs', () => {
    it('初始状态应返回空数组', () => {
      const manager = new DressUpManager();
      expect(manager.getActiveBuffs()).toEqual([]);
    });

    it('应收集所有已穿戴衣服的 matchBuff', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, coinBuffTop);       // COIN_BONUS 20
      manager.changeEquipment(DressPart.BOTTOM, bombBuffBottom); // START_BOMB 1

      const buffs = manager.getActiveBuffs();
      expect(buffs).toHaveLength(2);
      expect(buffs).toContainEqual({ type: 'COIN_BONUS', value: 20 });
      expect(buffs).toContainEqual({ type: 'START_BOMB', value: 1 });
    });

    it('同 type 的 Buff 取 max value（去重）', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, coinBuffTop);     // COIN_BONUS 20
      manager.changeEquipment(DressPart.SHOES, coinBuffShoes); // COIN_BONUS 10

      const buffs = manager.getActiveBuffs();
      expect(buffs).toHaveLength(1);
      expect(buffs[0]).toEqual({ type: 'COIN_BONUS', value: 20 });
    });

    it('没有 matchBuff 的衣服不影响结果', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);   // no buff
      manager.changeEquipment(DressPart.HAIR, cuteHair);  // no buff

      expect(manager.getActiveBuffs()).toEqual([]);
    });
  });

  // --- 序列化/反序列化 ---
  describe('序列化', () => {
    it('toJSON 应返回 part → id 的映射', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);
      manager.changeEquipment(DressPart.SHOES, cyberShoes);

      const json = manager.toJSON();
      expect(json).toEqual({
        [DressPart.TOP]: 'top_001',
        [DressPart.SHOES]: 'shoes_001',
      });
    });

    it('fromJSON 应通过 catalog 还原穿戴状态', () => {
      const manager = new DressUpManager();
      manager.fromJSON(
        { [DressPart.TOP]: 'top_001', [DressPart.HAIR]: 'hair_001' },
        allCatalog,
      );

      const current = manager.getCurrentDress();
      expect(current[DressPart.TOP]).toBe(sweetTop);
      expect(current[DressPart.HAIR]).toBe(cuteHair);
      expect(current[DressPart.BOTTOM]).toBeUndefined();
    });

    it('fromJSON 中 catalog 找不到的 id 应静默忽略', () => {
      const manager = new DressUpManager();
      manager.fromJSON(
        { [DressPart.TOP]: 'nonexistent_id' },
        allCatalog,
      );

      expect(manager.getCurrentDress()).toEqual({});
    });

    it('序列化往返应保持一致', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);
      manager.changeEquipment(DressPart.BOTTOM, sweetBottom);
      manager.changeEquipment(DressPart.ACCESSORY, sweetAcc);

      const json = manager.toJSON();
      const restored = new DressUpManager();
      restored.fromJSON(json, allCatalog);

      const restoredJson = restored.toJSON();
      expect(restoredJson).toEqual(json);
    });

    it('fromJSON 覆盖当前穿戴', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);
      manager.changeEquipment(DressPart.SHOES, cyberShoes);

      manager.fromJSON({ [DressPart.HAIR]: 'hair_001' }, allCatalog);

      const current = manager.getCurrentDress();
      // 旧的被清空，只保留 fromJSON 的数据
      expect(current[DressPart.TOP]).toBeUndefined();
      expect(current[DressPart.SHOES]).toBeUndefined();
      expect(current[DressPart.HAIR]).toBe(cuteHair);
    });
  });

  // --- 事件完整性 ---
  describe('事件完整性', () => {
    it('卸下装备后应重新计算并发射 style:bonus_changed', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, coinBuffTop);   // COIN_BONUS 20
      manager.changeEquipment(DressPart.SHOES, coinBuffShoes); // COIN_BONUS 10

      const listener = jest.fn();
      eventBus.on(GameEvent.STYLE_BONUS_CHANGED, listener);

      // 卸下鞋子，只剩下 top 的 COIN_BONUS 20
      manager.removeEquipment(DressPart.SHOES);
      expect(listener).toHaveBeenCalledWith({ buffs: [{ type: 'COIN_BONUS', value: 20 }] });
    });

    it('替换装备应重新计算 buff 并发射事件', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, coinBuffTop); // COIN_BONUS 20

      const listener = jest.fn();
      eventBus.on(GameEvent.STYLE_BONUS_CHANGED, listener);

      // 替换为无 buff 的衣服
      manager.changeEquipment(DressPart.TOP, sweetTop);
      expect(listener).toHaveBeenCalledWith({ buffs: [] });
    });
  });

  // --- 边界场景 ---
  describe('边界场景', () => {
    it('连续换装多次，每次状态正确', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.TOP, sweetTop);
      manager.changeEquipment(DressPart.TOP, retroTop);
      manager.changeEquipment(DressPart.TOP, fullDress); // 连衣裙

      const current = manager.getCurrentDress();
      expect(current[DressPart.TOP]).toBe(fullDress);
    });

    it('穿连衣裙再换回普通上衣，BOTTOM 不受影响', () => {
      const manager = new DressUpManager();
      manager.changeEquipment(DressPart.BOTTOM, sweetBottom);
      manager.changeEquipment(DressPart.TOP, fullDress);   // BOTTOM 被清除
      manager.changeEquipment(DressPart.TOP, sweetTop);    // 换回普通上衣

      const current = manager.getCurrentDress();
      expect(current[DressPart.TOP]).toBe(sweetTop);
      // BOTTOM 之前被连衣裙清除了，换回普通上衣不会自动恢复
      expect(current[DressPart.BOTTOM]).toBeUndefined();
    });
  });
});
