import React, { useEffect, useRef, useState } from 'react';
import { OrbMode } from '../types';

interface NeuralQuantizerProps {
  orbMode: OrbMode;
}

const NeuralNode: React.FC<{ x: number, y: number, active: boolean, size: number }> = ({ x, y, active, size }) => (
    <g>
        <circle cx={x} cy={y} r={size} fill={active ? "#a5f3fc" : "#1e293b"} className="transition-colors duration-300" />
        {active && (
            <circle cx={x} cy={y} r={size * 2} fill="none" stroke="#a5f3fc" strokeWidth="0.5" opacity="0.5">
                <animate attributeName="r" from={size} to={size * 3} dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
        )}
    </g>
);

const SynapticLink: React.FC<{ x1: number, y1: number, x2: number, y2: number, active: boolean }> = ({ x1, y1, x2, y2, active }) => (
    <line 
        x1={x1} y1={y1} x2={x2} y2={y2} 
        stroke={active ? "#a5f3fc" : "#334155"} 
        strokeWidth={active ? "1" : "0.5"} 
        opacity={active ? "0.6" : "0.2"}
    />
);

export const NeuralQuantizer: React.FC<NeuralQuantizerProps> = ({ orbMode }) => {
    const isActive = orbMode === 'ANALYSIS' || orbMode === 'SYNTHESIS' || orbMode === 'CONCORDANCE';
    const [nodes, setNodes] = useState<{id: number, x: number, y: number, connections: number[]}[]>([]);
    const [activeSignals, setActiveSignals] = useState<{id: number, path: [number, number], progress: number}[]>([]);
    const requestRef = useRef<number>(0);

    // Initialize Network
    useEffect(() => {
        const newNodes = [];
        const count = 40; // Number of neurons
        
        for (let i = 0; i < count; i++) {
            newNodes.push({
                id: i,
                x: 10 + Math.random() * 80, // % coordinates
                y: 10 + Math.random() * 80,
                connections: [] as number[]
            });
        }

        // Create random connections
        newNodes.forEach((node, i) => {
            const numConnections = 1 + Math.floor(Math.random() * 3);
            for (let j = 0; j < numConnections; j++) {
                const target = Math.floor(Math.random() * count);
                if (target !== i && !node.connections.includes(target)) {
                    node.connections.push(target);
                }
            }
        });

        setNodes(newNodes);
    }, []);

    // Signal Animation Loop
    useEffect(() => {
        const animate = () => {
            if (isActive) {
                setActiveSignals(prev => {
                    // Move existing signals
                    const moved = prev.map(s => ({ ...s, progress: s.progress + 0.02 })).filter(s => s.progress < 1);
                    
                    // Spawn new signals randomly
                    if (Math.random() > 0.8) { // Signal density
                        const startNodeIdx = Math.floor(Math.random() * nodes.length);
                        const startNode = nodes[startNodeIdx];
                        if (startNode && startNode.connections.length > 0) {
                            const endNodeIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
                            moved.push({
                                id: Math.random(),
                                path: [startNodeIdx, endNodeIdx],
                                progress: 0
                            });
                        }
                    }
                    return moved;
                });
            } else {
                setActiveSignals([]);
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [isActive, nodes]);

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

            <div className="flex-1 relative border border-slate-700/30 rounded bg-black/20">
                <svg width="100%" height="100%" className="absolute inset-0">
                    {/* Connections */}
                    {nodes.map(node => (
                        node.connections.map(targetId => {
                            const target = nodes[targetId];
                            if (!target) return null;
                            return (
                                <SynapticLink 
                                    key={`${node.id}-${targetId}`} 
                                    x1={node.x * 10 + "%" as any} 
                                    y1={node.y * 10 + "%" as any} 
                                    x2={target.x * 10 + "%" as any} 
                                    y2={target.y * 10 + "%" as any} 
                                    active={isActive && Math.random() > 0.9} 
                                />
                            );
                        })
                    ))}

                    {/* Nodes */}
                    {nodes.map(node => (
                        <NeuralNode 
                            key={node.id} 
                            x={node.x * 10 + "%" as any} 
                            y={node.y * 10 + "%" as any} 
                            active={isActive && Math.random() > 0.8} 
                            size={isActive ? 3 : 2} 
                        />
                    ))}

                    {/* Active Data Packets */}
                    {activeSignals.map(signal => {
                        const start = nodes[signal.path[0]];
                        const end = nodes[signal.path[1]];
                        if (!start || !end) return null;
                        
                        const curX = start.x + (end.x - start.x) * signal.progress;
                        const curY = start.y + (end.y - start.y) * signal.progress;

                        return (
                            <circle 
                                key={signal.id}
                                cx={curX * 10 + "%" as any}
                                cy={curY * 10 + "%" as any}
                                r={2}
                                fill="#facc15"
                                filter="drop-shadow(0 0 2px #facc15)"
                            />
                        );
                    })}
                </svg>
                
                {/* Overlay Grid */}
                <div className="absolute inset-0 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(rgba(165, 243, 252, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(165, 243, 252, 0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />
            </div>

            <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px] text-slate-500 font-mono">
                <div className="bg-black/30 p-1 rounded border border-slate-700/50">
                    SYNAPSES: {nodes.reduce((acc, n) => acc + n.connections.length, 0)}
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