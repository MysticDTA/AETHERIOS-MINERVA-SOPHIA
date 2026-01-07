
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
  const [copied, setCopied] = useState(false);

  const handleClear = () => {
    knowledgeBase.clearMemories();
    onMemoryChange();
    setActiveMemory(null);
    setShowConfirm(false);
  };

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        return { ...mem, x, y, angle };
    });
  }, [visualMemories]);

  return (
    <div className="w-full h-full bg-[#0a0c0f] border border-white/10 p-6 rounded-b-xl flex flex-col relative overflow-hidden group shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 z-10 shrink-0">
        <div className="flex flex-col gap-1">
            <h3 className="font-orbitron text-[12px] text-pearl uppercase tracking-[0.3em] font-black">Causal Memory Lattice</h3>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">Storage_Blocks: {memories.length}</span>
        </div>
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)}
            disabled={memories.length === 0}
            className="px-3 py-1 rounded-sm text-[9px] font-bold bg-rose-950/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
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

      <div className="flex-1 min-h-0 flex flex-col relative z-10 gap-6">
        {/* Visualization Area */}
        <div className="relative flex items-center justify-center min-h-[180px] shrink-0">
          <svg viewBox="0 0 300 300" className="w-full h-full max-h-[300px] overflow-visible">
            <defs>
                <filter id="nodeGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="centerGrad">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Central Hub */}
            <circle cx={CENTER} cy={CENTER} r={60} fill="url(#centerGrad)" className="animate-pulse" />
            <circle cx={CENTER} cy={CENTER} r={2} fill="var(--pearl)" />
            <circle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS} stroke="var(--dark-border)" strokeWidth="0.5" fill="none" strokeDasharray="4 4" opacity="0.3" />

            {memoryNodes.length === 0 && (
                <text x={CENTER} y={CENTER + 30} textAnchor="middle" fill="var(--warm-grey)" fontSize="8" className="font-mono uppercase tracking-widest opacity-50">
                    No Causal Data Found
                </text>
            )}

            {/* Nodes (Petals) */}
            {memoryNodes.map(node => {
                const isActive = activeMemory?.id === node.id;
                // Petal shape logic: align rotation so it points outward
                const rotation = (node.angle * 180) / Math.PI + 90; 
                
                return (
                    <g 
                        key={node.id}
                        className="cursor-pointer group/node"
                        onMouseEnter={() => setActiveMemory(node)}
                        transform={`translate(${node.x}, ${node.y}) rotate(${rotation})`}
                    >
                        {/* Connecting Line (drawn here to be behind active scaling) */}
                        <line 
                            x1={0} y1={0}
                            x2={0} y2={-node.x + CENTER} /* Rough calc towards center for visual link */
                            stroke={isActive ? 'var(--gold)' : 'var(--warm-grey)'}
                            strokeWidth={isActive ? 1 : 0.2}
                            opacity={isActive ? 0.4 : 0.1}
                            className="transition-all duration-500"
                            transform={`rotate(${-rotation}) translate(${-node.x + CENTER}, ${-node.y + CENTER})`} 
                            // Note: Simplifying line logic for visual clutter reduction
                            style={{ display: 'none' }} 
                        />

                        {/* Interactive Hit Area (Larger) */}
                        <circle cx={0} cy={0} r={20} fill="transparent" />
                        
                        {/* Petal Shape */}
                        <path
                            d="M 0 -8 Q 6 0 0 8 Q -6 0 0 -8 Z"
                            fill={isActive ? 'var(--pearl)' : 'var(--dark-bg)'}
                            stroke={isActive ? 'var(--gold)' : 'var(--slate-500)'}
                            strokeWidth={isActive ? 2 : 0.5}
                            className="transition-all duration-500 ease-out"
                            style={{
                                filter: isActive ? 'drop-shadow(0 0 8px var(--gold))' : 'none',
                                transform: isActive ? 'scale(1.8)' : 'scale(1)'
                            }}
                        />
                    </g>
                );
            })}
          </svg>
        </div>

        {/* Structured Memory Readout Panel - High Readability */}
        <div className={`
            flex-1 min-h-[140px] bg-black/90 border border-white/10 rounded-lg p-6 transition-all duration-500 flex flex-col gap-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl
            ${activeMemory ? 'border-gold/40 shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 'border-white/5 opacity-60'}
        `}>
            {activeMemory ? (
                <div className="relative z-10 animate-fade-in flex flex-col h-full gap-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_8px_gold] animate-pulse" />
                            <span className="text-[10px] font-mono text-gold uppercase tracking-[0.2em] font-bold">
                                Block_ID: {activeMemory.id.split('_')[2] || 'UNKNOWN'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-mono text-slate-400">
                                {new Date(activeMemory.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                            </span>
                            <button 
                                onClick={() => handleCopy(activeMemory.content)}
                                className={`text-[9px] font-mono uppercase tracking-wider px-3 py-1 rounded border transition-all ${copied ? 'border-green-500 text-green-400 bg-green-950/20' : 'border-white/10 text-slate-500 hover:text-pearl hover:bg-white/10'}`}
                            >
                                {copied ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 bg-white/[0.03] rounded-md p-4 border border-white/5 shadow-inner">
                        <p className="text-[14px] font-minerva text-pearl leading-relaxed antialiased whitespace-pre-wrap selection:bg-gold/30 selection:text-white">
                            {activeMemory.content}
                        </p>
                    </div>

                    <div className="pt-2 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                                Context Vector:
                            </span>
                            <span className="text-[9px] font-mono text-violet-300 uppercase tracking-widest font-bold bg-violet-900/20 px-3 py-1 rounded border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                                {activeMemory.pillarContext || 'GENERAL_LOGIC'}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full relative z-10 gap-4 opacity-50">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border border-dashed border-slate-600 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-slate-600 rounded-full" />
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">
                        Awaiting Selection...
                    </span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
