type EventHandler<T = any> = (data: T) => void | Promise<void>;

/**
 * Central event bus for decoupling features through events.
 * Implements publish-subscribe pattern.
 */
export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  /**
   * Subscribe to an event.
   * @returns Unsubscribe function
   */
  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    return () => this.off(event, handler);
  }

  /**
   * Unsubscribe from an event.
   */
  off<T>(event: string, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler);
  }

  /**
   * Emit an event to all subscribers.
   */
  async emit<T>(event: string, data?: T): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    await Promise.all(Array.from(handlers).map((h) => h(data)));
  }

  /**
   * Emit an event synchronously.
   */
  emitSync<T>(event: string, data?: T): void {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    handlers.forEach((h) => h(data));
  }

  /**
   * Clear all handlers for an event.
   */
  clear(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

export const eventBus = new EventBus();
