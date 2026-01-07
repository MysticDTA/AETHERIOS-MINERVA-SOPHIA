
import React, { useEffect, useRef } from 'react';
import { OrbMode, SystemState } from '../types';

interface NeuralQuantizerProps {
  orbMode: OrbMode;
  systemState?: SystemState;
}

export const NeuralQuantizer: React.FC<NeuralQuantizerProps> = ({ orbMode, systemState }) => {
    const isActive = orbMode === 'ANALYSIS' || orbMode === 'SYNTHESIS' || orbMode === 'CONCORDANCE';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Extract real-time metrics
    const activeNodesMetric = systemState?.globalResonance.activeArchitects || 100;
    const signalSpeedMetric = systemState?.globalResonance.aggregateRho || 0.8;
    const fieldStatus = systemState?.globalResonance.fieldStatus || 'STABLE';

    // Determine color palette based on field status
    let nodeColor = '#334155';
    let signalColor = '#facc15';
    let activeNodeColor = '#a5f3fc';
    
    if (fieldStatus === 'RESONATING') {
        nodeColor = '#475569';
        signalColor = '#fcd34d'; // Brighter gold
        activeNodeColor = '#c084fc'; // Violet
    } else if (fieldStatus === 'DECOHERING') {
        nodeColor = '#451a1a';
        signalColor = '#f87171'; // Red
        activeNodeColor = '#fb923c'; // Orange
    }

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

        // Initialize Nodes based on active architects (scaled down)
        const nodeCount = Math.min(80, Math.floor(activeNodesMetric / 2));
        const nodes: { x: number; y: number; connections: number[]; pulse: number }[] = [];
        const signals: { from: number; to: number; progress: number }[] = [];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                connections: [],
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Create Connections - optimized for visual density
        nodes.forEach((node, i) => {
            const nearby = nodes
                .map((n, idx) => ({ idx, dist: Math.hypot(n.x - node.x, n.y - node.y) }))
                .filter(n => n.idx !== i && n.dist < 120)
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 3); // Max 3 connections per node
            
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
                node.pulse += 0.05 * signalSpeedMetric; // Pulse speed linked to Rho
                const pulseSize = Math.sin(node.pulse) * 1.5 + 2;

                ctx.beginPath();
                ctx.arc(node.x, node.y, isActive ? pulseSize : 2, 0, Math.PI * 2);
                ctx.fillStyle = isActive ? activeNodeColor : nodeColor;
                ctx.fill();
                
                // Glow if active and high resonance
                if (isActive && Math.random() > 0.99 && signalSpeedMetric > 0.9) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fill();
                }
            });

            // Logic for Signals (Packets)
            if (isActive) {
                // Spawn new signal based on global activity
                if (Math.random() > (1 - (activeNodesMetric / 500))) {
                    const startIdx = Math.floor(Math.random() * nodeCount);
                    const startNode = nodes[startIdx];
                    if (startNode.connections.length > 0) {
                        const endIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
                        signals.push({ from: startIdx, to: endIdx, progress: 0 });
                    }
                }

                // Draw and update signals
                ctx.fillStyle = signalColor;
                for (let i = signals.length - 1; i >= 0; i--) {
                    const s = signals[i];
                    s.progress += 0.01 + (signalSpeedMetric * 0.02); // Speed linked to Rho
                    
                    if (s.progress >= 1) {
                        signals.splice(i, 1);
                        continue;
                    }

                    const start = nodes[s.from];
                    const end = nodes[s.to];
                    const x = start.x + (end.x - start.x) * s.progress;
                    const y = start.y + (end.y - start.y) * s.progress;

                    ctx.beginPath();
                    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Signal Glow
                    ctx.shadowColor = signalColor;
                    ctx.shadowBlur = 8;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isActive, activeNodesMetric, signalSpeedMetric, fieldStatus]);

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-cyan backdrop-blur-sm flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-2 z-10">
                <h3 className="font-orbitron text-lg text-warm-grey">Neural Quantizer</h3>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">Collective Load</p>
                        <p className="font-mono text-cyan-300">{isActive ? (activeNodesMetric * 0.8).toFixed(0) : '0'} <span className="text-[8px]">NODES</span></p>
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
                    SYNAPSES: {activeNodesMetric * 3}
                </div>
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    LATENCY: {isActive ? (20 * (1 - signalSpeedMetric)).toFixed(1) : '--'}ms
                </div>
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    STATUS: {fieldStatus}
                </div>
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    Q-BITS: {isActive ? 'ENTANGLED' : 'IDLE'}
                </div>
            </div>
        </div>
    );
};
