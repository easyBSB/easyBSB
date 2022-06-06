// classic pubsub
class EventBus {

  private subscribers: Record<string, Array<(...args: unknown[]) => void>> = {};

  public dispatch(event: string, ...args: unknown[]): void {
    const handlers = this.subscribers[event];
    if (!Array.isArray(handlers) || handlers.length === 0) {
      return;
    }

    for (const handler of handlers) {
      handler(...args);
    }
  }

  public register(event: string, handler: (...args: unknown[]) => void): { unregister: () => void } {

    if (!this.subscribers[event]) {
      this.subscribers[event] = [handler];
    }

    return {
      unregister: () => {
        const handlers = this.subscribers[event].filter((fn) => fn !== handler);
        if (handlers.length === 0) {
          delete this.subscribers[event];
          return;
        }

        this.subscribers[event] = handlers;
      }
    };
  }
}

export default new EventBus();
