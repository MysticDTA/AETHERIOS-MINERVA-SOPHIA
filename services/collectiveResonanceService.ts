
import { GlobalResonanceState, CommunityData } from '../types';

type ResonanceListener = (state: GlobalResonanceState) => void;

class CollectiveResonanceService {
    private listeners = new Set<ResonanceListener>();
    private currentState: GlobalResonanceState;
    private intervalId: number | null = null;

    constructor() {
        this.currentState = {
            aggregateRho: 0.88,
            activeArchitects: 142,
            fieldStatus: 'STABLE',
            globalCarrierFrequency: 1.617,
            communities: [
                { id: 'c1', name: 'Sirius Collective', rho: 0.94, coherence: 0.92, stability: 0.98, activeNodes: 24, lastEvent: 'Harmonic Lock achieved.', location: { x: 25, y: 35 } },
                { id: 'c2', name: 'Omega Research', rho: 0.72, coherence: 0.65, stability: 0.81, activeNodes: 18, lastEvent: 'Minor decoherence spike detected.', location: { x: 65, y: 45 } },
                { id: 'c3', name: 'Arcturian Node', rho: 0.98, coherence: 0.99, stability: 0.97, activeNodes: 32, lastEvent: 'Peak Rho synergy verified.', location: { x: 45, y: 75 } },
                { id: 'c4', name: 'Lemurian Labs', rho: 0.85, coherence: 0.88, stability: 0.84, activeNodes: 12, lastEvent: 'Flow optimization active.', location: { x: 85, y: 25 } }
            ]
        };
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = window.setInterval(() => {
            this.updateState();
        }, 3000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    subscribe(listener: ResonanceListener): () => void {
        this.listeners.add(listener);
        listener({ ...this.currentState });
        return () => this.listeners.delete(listener);
    }

    private updateState() {
        const jitter = (n: number) => Math.max(0.1, Math.min(1.0, n + (Math.random() - 0.5) * 0.02));
        
        this.currentState = {
            ...this.currentState,
            activeArchitects: Math.max(100, this.currentState.activeArchitects + (Math.random() > 0.5 ? 1 : -1)),
            communities: this.currentState.communities.map(c => ({
                ...c,
                rho: jitter(c.rho),
                coherence: jitter(c.coherence),
                stability: jitter(c.stability)
            }))
        };

        const totalRho = this.currentState.communities.reduce((acc, c) => acc + c.rho, 0);
        this.currentState.aggregateRho = totalRho / this.currentState.communities.length;
        
        if (this.currentState.aggregateRho > 0.92) this.currentState.fieldStatus = 'RESONATING';
        else if (this.currentState.aggregateRho < 0.65) this.currentState.fieldStatus = 'DECOHERING';
        else this.currentState.fieldStatus = 'STABLE';

        this.emit();
    }

    private emit() {
        this.listeners.forEach(fn => fn({ ...this.currentState }));
    }
}

export const collectiveResonanceService = new CollectiveResonanceService();