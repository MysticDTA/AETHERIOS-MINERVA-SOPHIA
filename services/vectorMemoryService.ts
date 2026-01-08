
import { Memory } from '../types';

export interface VectorNode {
    id: string;
    embedding: number[];
    content: string;
    timestamp: number;
    coherenceScore: number;
}

const VECTOR_STORAGE_KEY = 'sophia_vector_lattice';

class VectorMemoryService {
    private vectors: VectorNode[] = [];

    constructor() {
        this.hydrate();
    }

    private hydrate() {
        try {
            const stored = localStorage.getItem(VECTOR_STORAGE_KEY);
            if (stored) {
                this.vectors = JSON.parse(stored);
            }
        } catch (e) {
            console.warn("Vector lattice corrupted. Re-initializing.");
            this.vectors = [];
        }
    }

    private save() {
        try {
            localStorage.setItem(VECTOR_STORAGE_KEY, JSON.stringify(this.vectors));
        } catch (e) {
            console.error("Vector storage failed", e);
        }
    }

    // Simulates the generation of a 1536-dimensional embedding
    private generateMockEmbedding(): number[] {
        // We only generate 3 dimensions for visualization, but store "metadata" for realism
        return [
            (Math.random() - 0.5) * 20, // X
            (Math.random() - 0.5) * 20, // Y
            (Math.random() - 0.5) * 20  // Z
        ];
    }

    public async crystallizeMemory(memory: Memory): Promise<VectorNode> {
        // Simulate API latency for embedding generation
        await new Promise(resolve => setTimeout(resolve, 1200));

        const node: VectorNode = {
            id: `VEC_${memory.id}`,
            embedding: this.generateMockEmbedding(),
            content: memory.content,
            timestamp: Date.now(),
            coherenceScore: 0.95 + Math.random() * 0.05
        };

        this.vectors.push(node);
        this.save();
        return node;
    }

    public getVectors(): VectorNode[] {
        return this.vectors;
    }

    public clearLattice() {
        this.vectors = [];
        this.save();
    }
}

export const vectorMemoryService = new VectorMemoryService();
