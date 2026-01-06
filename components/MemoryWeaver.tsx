
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

      <div className="flex-1 min-h-0 flex flex-col relative z-10 gap-4">
        {/* Visualization Area */}
        <div className="relative flex items-center justify-center min-h-[180px] shrink-0">
          <svg viewBox="0 0 300 300" className="w-full h-full max-h-[300px] overflow-visible">
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
                        strokeWidth={isActive ? 1.5 : 0.3}
                        opacity={isActive ? 0.8 : 0.15}
                        className="transition-all duration-300"
                    />
                );
            })}

            {/* Nodes (Petals) */}
            {memoryNodes.map(node => {
                const isActive = activeMemory?.id === node.id;
                // Petal shape logic: align rotation so it points outward
                const rotation = (node.angle * 180) / Math.PI + 90; 
                
                return (
                    <g 
                        key={node.id}
                        className="cursor-pointer transition-all duration-300 group/node"
                        onMouseEnter={() => setActiveMemory(node)}
                        transform={`translate(${node.x}, ${node.y}) rotate(${rotation})`}
                    >
                        {/* Interactive Hit Area (Larger) */}
                        <circle cx={0} cy={0} r={15} fill="transparent" />
                        
                        {/* Petal Shape */}
                        <path
                            d="M 0 -6 Q 4 0 0 6 Q -4 0 0 -6 Z"
                            fill={isActive ? 'var(--pearl)' : 'var(--dark-bg)'}
                            stroke={isActive ? 'var(--gold)' : 'var(--slate-500)'}
                            strokeWidth={isActive ? 1.5 : 0.5}
                            style={{
                                filter: isActive ? 'url(#nodeGlow)' : 'none',
                                transform: isActive ? 'scale(1.5)' : 'scale(1)',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        />
                        
                        {/* Hover Ring Animation */}
                        {isActive && (
                            <circle cx={0} cy={0} r={12} fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.5">
                                <animate attributeName="r" values="6;16" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                        )}
                    </g>
                );
            })}
          </svg>
        </div>

        {/* Structured Memory Readout Panel - High Readability */}
        <div className={`
            flex-1 min-h-[120px] bg-black/80 border rounded-lg p-5 transition-all duration-500 flex flex-col gap-3 shadow-inner relative overflow-hidden backdrop-blur-xl
            ${activeMemory ? 'border-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.05)]' : 'border-white/5 opacity-80'}
        `}>
            {activeMemory ? (
                <div className="relative z-10 animate-fade-in flex flex-col h-full gap-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_5px_gold]" />
                            <span className="text-[9px] font-mono text-gold uppercase tracking-[0.2em] font-bold">
                                Block_ID: {activeMemory.id.split('_')[2] || 'UNKNOWN'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-slate-400">
                                {new Date(activeMemory.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <button 
                                onClick={() => handleCopy(activeMemory.content)}
                                className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border transition-colors ${copied ? 'border-green-500 text-green-400' : 'border-white/10 text-slate-500 hover:text-pearl hover:bg-white/10'}`}
                            >
                                {copied ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 bg-white/[0.02] rounded p-2 border border-white/5 shadow-inner">
                        <p className="text-[13px] font-minerva text-pearl leading-relaxed antialiased whitespace-pre-wrap selection:bg-gold/30 selection:text-white">
                            {activeMemory.content}
                        </p>
                    </div>

                    <div className="mt-1 pt-2 border-t border-white/5 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                                Context:
                            </span>
                            <span className="text-[8px] font-mono text-violet-300 uppercase tracking-widest font-bold bg-violet-900/20 px-2 py-0.5 rounded border border-violet-500/20">
                                {activeMemory.pillarContext || 'GENERAL_LOGIC'}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-gold rounded-full opacity-50" />
                            <div className="w-1.5 h-1.5 bg-gold rounded-full opacity-25" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full relative z-10 opacity-40 gap-3">
                    <div className="w-12 h-12 rounded-full border border-dashed border-slate-500 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                        <div className="w-1 h-1 bg-slate-500 rounded-full" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">
                        Hover Node to Decrypt
                    </span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
