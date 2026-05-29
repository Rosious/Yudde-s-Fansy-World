// ============================================================
// DressUpManager — 换装核心逻辑
//
// 管理娃的穿戴状态，包括换装、卸装、风格计分、
// Buff 收集、序列化/反序列化。
//
// 通过全局 eventBus 与其它模块通信：
//   - dress:changed     → 换装/卸装时发射
//   - style:bonus_changed → Buff 变化时发射
// ============================================================

import { DressPart, DressAttachment, StyleTag, MatchBuff, GameEvent } from '../../types';
import { eventBus } from '../../core/EventBus';

/** 扩展 DressAttachment，支持连衣裙标记 */
interface FullDressAttachment extends DressAttachment {
  /** 是否为连衣裙（穿上后自动卸下 BOTTOM） */
  isFullDress?: boolean;
}

/**
 * 换装管理器
 *
 * 负责管理当前娃的所有穿戴部位，提供换装、卸装、
 * 风格计分、Buff 收集以及存档序列化等功能。
 */
export class DressUpManager {
  /** 当前穿戴状态：部位 → 服装 */
  private dress: Partial<Record<DressPart, DressAttachment>> = {};

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
  changeEquipment(
    part: DressPart,
    attachment: DressAttachment,
  ): { success: boolean; replaced?: DressAttachment } {
    const replaced = this.dress[part];
    this.dress[part] = attachment;

    // 连衣裙规则：如果 TOP 是连衣裙，自动卸下 BOTTOM
    if (part === DressPart.TOP) {
      const fullDress = attachment as FullDressAttachment;
      if (fullDress.isFullDress) {
        delete this.dress[DressPart.BOTTOM];
      }
    }

    // 发射事件
    eventBus.emit(GameEvent.DRESS_CHANGED, { part, attachment });
    this.emitBuffChanged();

    return { success: true, ...(replaced ? { replaced } : {}) };
  }

  /**
   * 卸下指定部位的服装
   *
   * 如果该部位没有衣服，不会报错。
   * 卸下后发射 `dress:changed` 和 `style:bonus_changed` 事件。
   *
   * @param part 要卸下的部位
   */
  removeEquipment(part: DressPart): void {
    delete this.dress[part];

    eventBus.emit(GameEvent.DRESS_CHANGED, { part, attachment: undefined });
    this.emitBuffChanged();
  }

  /**
   * 获取当前全部穿戴状态
   *
   * @returns 部位到服装附件的映射（未穿戴的部位不出现在结果中）
   */
  getCurrentDress(): Partial<Record<DressPart, DressAttachment>> {
    return { ...this.dress };
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
   */
  getStyleScore(style: StyleTag): number {
    let score = 0;
    for (const attachment of Object.values(this.dress)) {
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
   */
  getActiveBuffs(): MatchBuff[] {
    const buffMap = new Map<string, number>();

    for (const attachment of Object.values(this.dress)) {
      if (attachment && attachment.matchBuff) {
        const { type, value } = attachment.matchBuff;
        const current = buffMap.get(type);
        if (current === undefined || value > current) {
          buffMap.set(type, value);
        }
      }
    }

    return Array.from(buffMap.entries()).map(([type, value]) => ({
      type: type as MatchBuff['type'],
      value,
    }));
  }

  // ==========================================================
  // 序列化 / 反序列化
  // ==========================================================

  /**
   * 将当前穿戴状态序列化为存档格式
   *
   * @returns 部位 → attachmentId 的映射
   */
  toJSON(): Partial<Record<DressPart, string>> {
    const result: Partial<Record<DressPart, string>> = {};
    for (const [part, attachment] of Object.entries(this.dress)) {
      if (attachment) {
        result[part as DressPart] = attachment.id;
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
   */
  fromJSON(data: Partial<Record<DressPart, string>>, catalog: DressAttachment[]): void {
    // 构建 catalog 查找表
    const catalogMap = new Map<string, DressAttachment>();
    for (const item of catalog) {
      catalogMap.set(item.id, item);
    }

    // 清空当前穿戴
    this.dress = {};

    // 从 data 还原
    for (const [part, attachmentId] of Object.entries(data)) {
      const attachment = catalogMap.get(attachmentId);
      if (attachment) {
        this.dress[part as DressPart] = attachment;
      }
    }
  }

  // ==========================================================
  // 内部方法
  // ==========================================================

  /** 发射 style:bonus_changed 事件 */
  private emitBuffChanged(): void {
    eventBus.emit(GameEvent.STYLE_BONUS_CHANGED, { buffs: this.getActiveBuffs() });
  }
}
