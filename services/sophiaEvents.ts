// services/sophiaEvents.ts
type SophiaEventListener = (event: string, payload: any) => void;

class SophiaEventBus {
  private listeners = new Set<SophiaEventListener>();

  subscribe(listener: SophiaEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(event: string, payload: any) {
    this.listeners.forEach((fn) => {
      try {
        fn(event, payload);
      } catch (err) {
        console.error("[sophiaEvents] listener error", err);
      }
    });
  }
}

const eventBus = new SophiaEventBus();

export const emitSophiaEvent = (event: string, payload: any) => {
  eventBus.emit(event, payload);
};

export const onSophiaEvent = (listener: SophiaEventListener) => {
  return eventBus.subscribe(listener);
};
