
import React, { useState, useMemo } from 'react';
import { Memory } from '../types';
import { knowledgeBase } from '../services/knowledgeBase';

interface MemoryWeaverProps {
  memories: Memory[];
  onMemoryChange: () => void;
}

const ORBIT_RADIUS = 100;
const CANVAS_SIZE = 300;
const CENTER = CANVAS_SIZE / 2;

export const MemoryWeaver: React.FC<MemoryWeaverProps> = ({ memories, onMemoryChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  const handleClear = () => {
    knowledgeBase.clearMemories();
    onMemoryChange();
    setActiveMemory(null);
    setShowConfirm(false);
  };
  
  // Limit to most recent 24 memories for visual clarity in the circle
  const visualMemories = useMemo(() => memories.slice(0, 24), [memories]);

  const memoryNodes = useMemo(() => {
    if (visualMemories.length === 0) return [];
    return visualMemories.map((mem, index) => {
        // Spiral distribution for organic feel
        const angle = (index / visualMemories.length) * 2 * Math.PI - (Math.PI / 2); 
        const r = ORBIT_RADIUS + (index % 2 === 0 ? 10 : -10); // Stagger radius
        const x = CENTER + r * Math.cos(angle);
        const y = CENTER + r * Math.sin(angle);
        return { ...mem, x, y };
    });
  }, [visualMemories]);

  return (
    <div className="w-full h-full bg-dark-surface/60 border border-dark-border/50 p-6 rounded-xl flex flex-col border-glow-gold backdrop-blur-xl relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3 z-10">
        <div className="flex flex-col gap-1">
            <h3 className="font-orbitron text-[12px] text-pearl uppercase tracking-[0.3em] font-bold">Causal Memory Lattice</h3>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Storage_Blocks: {memories.length}</span>
        </div>
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)}
            disabled={memories.length === 0}
            className="px-3 py-1 rounded-sm text-[9px] font-bold bg-rose-950/30 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Purge_Bank
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleClear} className="px-3 py-1 rounded-sm text-[9px] font-bold bg-rose-600 text-white hover:bg-rose-500 border border-rose-500 uppercase tracking-widest">Confirm</button>
            <button onClick={() => setShowConfirm(false)} className="px-3 py-1 rounded-sm text-[9px] font-bold bg-slate-800 text-slate-400 hover:text-white border border-white/10 uppercase tracking-widest">Cancel</button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col relative z-10">
        {/* Visualization Area */}
        <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
          <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
            <defs>
                <filter id="nodeGlow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="centerGrad">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Central Hub */}
            <circle cx={CENTER} cy={CENTER} r={40} fill="url(#centerGrad)" className="animate-pulse" />
            <circle cx={CENTER} cy={CENTER} r={3} fill="var(--pearl)" />
            <circle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS} stroke="var(--dark-border)" strokeWidth="0.5" fill="none" strokeDasharray="4 4" opacity="0.5" />

            {memoryNodes.length === 0 && (
                <text x={CENTER} y={CENTER + 20} textAnchor="middle" fill="var(--warm-grey)" fontSize="8" className="font-mono uppercase tracking-widest opacity-50">
                    No Causal Data Found
                </text>
            )}

            {/* Connecting Lines */}
            {memoryNodes.map((node) => {
                const isActive = activeMemory?.id === node.id;
                return (
                    <line 
                        key={`line-${node.id}`}
                        x1={CENTER} y1={CENTER}
                        x2={node.x} y2={node.y}
                        stroke={isActive ? 'var(--gold)' : 'var(--warm-grey)'}
                        strokeWidth={isActive ? 1 : 0.3}
                        opacity={isActive ? 0.8 : 0.15}
                        className="transition-all duration-300"
                    />
                );
            })}

            {/* Nodes */}
            {memoryNodes.map(node => {
                const isActive = activeMemory?.id === node.id;
                return (
                    <g 
                        key={node.id}
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setActiveMemory(node)}
                        onMouseLeave={() => setActiveMemory(null)}
                    >
                        {/* Interactive Hit Area */}
                        <circle cx={node.x} cy={node.y} r={10} fill="transparent" />
                        
                        {/* Visible Node */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={isActive ? 6 : 3}
                            fill={isActive ? 'var(--pearl)' : 'var(--dark-bg)'}
                            stroke={isActive ? 'var(--gold)' : 'var(--slate-500)'}
                            strokeWidth={isActive ? 1 : 0.5}
                            style={{
                                filter: isActive ? 'url(#nodeGlow)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        />
                        {isActive && (
                            <circle cx={node.x} cy={node.y} r={12} fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.5">
                                <animate attributeName="r" values="6;14" dur="1s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.8;0" dur="1s" repeatCount="indefinite" />
                            </circle>
                        )}
                    </g>
                );
            })}
          </svg>
        </div>

        {/* Structured Memory Readout Panel */}
        <div className="mt-4 flex-shrink-0 relative">
            <div className={`
                bg-black/80 border rounded-lg p-5 transition-all duration-500 flex flex-col gap-3 min-h-[140px] shadow-2xl relative overflow-hidden
                ${activeMemory ? 'border-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 'border-white/5 opacity-60'}
            `}>
                {/* Background Gradient for Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 pointer-events-none" />
                
                {activeMemory ? (
                    <div className="relative z-10 animate-fade-in flex flex-col h-full">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                            <span className="text-[9px] font-mono text-gold uppercase tracking-[0.2em] font-bold">
                                Block_ID: {activeMemory.id.split('_')[2]}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                                {new Date(activeMemory.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 max-h-[80px]">
                            <p className="text-[13px] font-minerva text-pearl leading-relaxed antialiased">
                                {activeMemory.content}
                            </p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                                Context: {activeMemory.pillarContext || 'GENERAL_LOGIC'}
                            </span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-gold rounded-full" />
                                <div className="w-1 h-1 bg-gold rounded-full opacity-50" />
                                <div className="w-1 h-1 bg-gold rounded-full opacity-25" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full relative z-10 opacity-40 gap-2">
                        <div className="w-8 h-8 rounded-full border border-dashed border-slate-500 animate-[spin_10s_linear_infinite]" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            Hover Node to Decrypt
                        </span>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
