
import { RemoteCursor, CollaborationEvent } from '../types';

type CollabListener = (cursors: RemoteCursor[]) => void;
type StateChangeListener = (key: string, value: any, user: string) => void;

class CollaborationService {
    private channel: BroadcastChannel;
    private listeners = new Set<CollabListener>();
    private stateListeners = new Set<StateChangeListener>();
    private cursors: Map<string, RemoteCursor> = new Map();
    private localId: string;
    private localName: string;
    
    // Ghost Bot Logic
    private ghostInterval: number | null = null;
    private ghostUsers: RemoteCursor[] = [];

    constructor() {
        this.channel = new BroadcastChannel('aetherios_synod_v1');
        this.localId = `ARCHITECT_${Math.floor(Math.random() * 9999)}`;
        this.localName = this.localId;

        this.channel.onmessage = (event) => {
            const data = event.data as CollaborationEvent;
            if (data.type === 'CURSOR_MOVE') {
                this.handleRemoteCursor(data.payload);
            } else if (data.type === 'STATE_CHANGE') {
                this.stateListeners.forEach(fn => fn(data.payload.key, data.payload.value, data.payload.user));
            }
        };

        this.initGhosts();
    }

    private initGhosts() {
        // Create 2-3 Simulated "Ghost Architects" for visual noise
        const count = 2 + Math.floor(Math.random() * 2);
        for(let i=0; i<count; i++) {
            this.ghostUsers.push({
                id: `GHOST_${i}`,
                name: `SOVEREIGN_NODE_${Math.floor(Math.random()*100)}`,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                color: i % 2 === 0 ? '#a78bfa' : '#ffd700',
                lastActive: Date.now(),
                tier: 'SOVEREIGN'
            });
        }

        // Move ghosts periodically
        this.ghostInterval = window.setInterval(() => {
            const now = Date.now();
            
            // Move Existing Ghosts
            this.ghostUsers = this.ghostUsers.map(g => {
                // Perlin-like movement
                const dx = (Math.random() - 0.5) * 50;
                const dy = (Math.random() - 0.5) * 50;
                let nx = g.x + dx;
                let ny = g.y + dy;
                
                // Bounds check (rough)
                if (nx < 0 || nx > window.innerWidth) nx = window.innerWidth / 2;
                if (ny < 0 || ny > window.innerHeight) ny = window.innerHeight / 2;

                return { ...g, x: nx, y: ny, lastActive: now };
            });

            // Randomly trigger state changes from Ghosts (rarely)
            if (Math.random() > 0.98) {
                const modes = ['ANALYSIS', 'SYNTHESIS', 'REPAIR'];
                const targetMode = modes[Math.floor(Math.random() * modes.length)];
                this.stateListeners.forEach(fn => fn('orbMode', targetMode, this.ghostUsers[0].name));
            }

            this.emitCursors();
        }, 100);
    }

    public broadcastCursor(x: number, y: number) {
        const payload: RemoteCursor = {
            id: this.localId,
            name: this.localName,
            x, y,
            color: '#10b981', // Local is Green/Emerald in debug, but wont be seen by self usually
            lastActive: Date.now(),
            tier: 'ARCHITECT'
        };
        this.channel.postMessage({ type: 'CURSOR_MOVE', payload });
    }

    public broadcastStateChange(key: string, value: any) {
        this.channel.postMessage({ 
            type: 'STATE_CHANGE', 
            payload: { key, value, user: this.localName } 
        });
    }

    private handleRemoteCursor(cursor: RemoteCursor) {
        this.cursors.set(cursor.id, cursor);
        this.emitCursors();
    }

    private emitCursors() {
        const allCursors = [
            ...Array.from(this.cursors.values()),
            ...this.ghostUsers
        ];
        
        // Filter old cursors (inactive > 10s)
        const now = Date.now();
        const activeCursors = allCursors.filter(c => now - c.lastActive < 10000);
        
        this.listeners.forEach(fn => fn(activeCursors));
    }

    public subscribe(listener: CollabListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    public onStateChange(listener: StateChangeListener): () => void {
        this.stateListeners.add(listener);
        return () => this.stateListeners.delete(listener);
    }

    public getActiveCount(): number {
        return this.cursors.size + this.ghostUsers.length + 1; // +1 for self
    }
}

export const collaborationService = new CollaborationService();
