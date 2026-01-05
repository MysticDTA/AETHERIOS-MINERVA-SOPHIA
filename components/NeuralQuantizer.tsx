
import React, { useEffect, useRef } from 'react';
import { OrbMode } from '../types';

interface NeuralQuantizerProps {
  orbMode: OrbMode;
}

export const NeuralQuantizer: React.FC<NeuralQuantizerProps> = ({ orbMode }) => {
    const isActive = orbMode === 'ANALYSIS' || orbMode === 'SYNTHESIS' || orbMode === 'CONCORDANCE';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        // Initialize Nodes
        const nodes: { x: number; y: number; connections: number[] }[] = [];
        const nodeCount = 50;
        const signals: { from: number; to: number; progress: number }[] = [];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                connections: []
            });
        }

        // Create Connections
        nodes.forEach((node, i) => {
            const nearby = nodes
                .map((n, idx) => ({ idx, dist: Math.hypot(n.x - node.x, n.y - node.y) }))
                .filter(n => n.idx !== i && n.dist < 100)
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 3);
            
            nearby.forEach(n => {
                if (!node.connections.includes(n.idx)) {
                    node.connections.push(n.idx);
                }
            });
        });

        const render = () => {
            // Clear
            ctx.clearRect(0, 0, width, height);

            // Draw Connections
            ctx.strokeStyle = isActive ? 'rgba(165, 243, 252, 0.15)' : 'rgba(148, 163, 184, 0.05)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            nodes.forEach((node, i) => {
                node.connections.forEach(targetIdx => {
                    const target = nodes[targetIdx];
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(target.x, target.y);
                });
            });
            ctx.stroke();

            // Draw Nodes
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = isActive ? '#a5f3fc' : '#334155';
                ctx.fill();
                
                // Glow if active
                if (isActive && Math.random() > 0.98) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(165, 243, 252, 0.2)';
                    ctx.fill();
                }
            });

            // Logic for Signals
            if (isActive) {
                // Spawn new signal
                if (Math.random() > 0.85) {
                    const startIdx = Math.floor(Math.random() * nodeCount);
                    const startNode = nodes[startIdx];
                    if (startNode.connections.length > 0) {
                        const endIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
                        signals.push({ from: startIdx, to: endIdx, progress: 0 });
                    }
                }

                // Draw and update signals
                ctx.fillStyle = '#facc15';
                for (let i = signals.length - 1; i >= 0; i--) {
                    const s = signals[i];
                    s.progress += 0.02;
                    
                    if (s.progress >= 1) {
                        signals.splice(i, 1);
                        continue;
                    }

                    const start = nodes[s.from];
                    const end = nodes[s.to];
                    const x = start.x + (end.x - start.x) * s.progress;
                    const y = start.y + (end.y - start.y) * s.progress;

                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Signal Glow
                    ctx.shadowColor = '#facc15';
                    ctx.shadowBlur = 5;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isActive]);

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-cyan backdrop-blur-sm flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-2 z-10">
                <h3 className="font-orbitron text-lg text-warm-grey">Neural Quantizer</h3>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">Cognitive Load</p>
                        <p className="font-mono text-cyan-300">{isActive ? (60 + Math.random() * 30).toFixed(1) : '0.0'}%</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
                </div>
            </div>

            <div className="flex-1 relative border border-slate-700/30 rounded bg-black/20 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full block" />
                {/* Overlay Grid */}
                <div className="absolute inset-0 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(rgba(165, 243, 252, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(165, 243, 252, 0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />
            </div>

            <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px] text-slate-500 font-mono">
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    SYNAPSES: 142
                </div>
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    LATENCY: {isActive ? '12ms' : 'IDLE'}
                </div>
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    ENTROPY: 0.04
                </div>
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    Q-BITS: STABLE
                </div>
            </div>
        </div>
    );
};
