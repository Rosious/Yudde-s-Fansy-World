// ============================================================
// 全局事件总线 — 模块间唯一通信通道
//
// 架构铁律：模块之间严禁直接引用。所有跨模块通信
// 必须通过 EventBus，发送方 emit，接收方 on/once。
//
// 例如：
//   Match3Engine 消除后 → EventBus.emit(GameEvent.MATCH_CLEARED, payload)
//   InventorySystem 监听 → EventBus.on(GameEvent.MATCH_CLEARED, handler)
// ============================================================

type Listener = (...args: any[]) => void;

class EventBus {
  private listeners: Map<string, Set<Listener>> = new Map();

  /** 订阅事件 */
  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /** 订阅一次（触发后自动取消） */
  once(event: string, listener: Listener): void {
    const wrapper: Listener = (...args: any[]) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }

  /** 取消订阅 */
  off(event: string, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  /** 发射事件 */
  emit(event: string, ...args: any[]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    // 复制一份再遍历，防止回调中修改 set
    for (const listener of [...set]) {
      try {
        listener(...args);
      } catch (e) {
        console.error(`[EventBus] Error in listener for "${event}":`, e);
      }
    }
  }

  /** 清空所有监听（仅用于测试重置） */
  reset(): void {
    this.listeners.clear();
  }

  /** 调试：列出所有事件及其监听数 */
  debug(): string {
    const lines: string[] = [];
    for (const [event, set] of this.listeners) {
      lines.push(`  ${event}: ${set.size} listener(s)`);
    }
    return lines.length ? lines.join('\n') : '  (empty)';
  }
}

// 全局单例
export const eventBus = new EventBus();
