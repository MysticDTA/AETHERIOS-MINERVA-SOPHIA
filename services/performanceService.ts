
// Simple performance tier service + subscription API

export type PerformanceTier = "LOW" | "MEDIUM" | "HIGH";

type PerformanceListener = (tier: PerformanceTier) => void;

class PerformanceService {
  private _tier: PerformanceTier = "HIGH";
  private listeners = new Set<PerformanceListener>();

  get tier(): PerformanceTier {
    return this._tier;
  }

  setTier(tier: PerformanceTier) {
    if (tier === this._tier) return;
    this._tier = tier;
    this.emit();
  }

  subscribe(listener: PerformanceListener): () => void {
    this.listeners.add(listener);
    // Push current tier immediately
    listener(this._tier);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => {
      try {
        fn(this._tier);
      } catch (err) {
        console.error("[performanceService] listener error", err);
      }
    });
  }
}

export const performanceService = new PerformanceService();
