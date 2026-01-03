import React, { useState, useMemo } from 'react';
import { Memory } from '../types';
import { knowledgeBase } from '../services/knowledgeBase';

interface MemoryWeaverProps {
  memories: Memory[];
  onMemoryChange: () => void;
}

const PETAL_RADIUS = 5;
const ORBIT_RADIUS = 120;
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
  
  const memoryPetals = useMemo(() => {
    if (memories.length === 0) return [];
    return memories.map((mem, index) => {
        const angle = (index / memories.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
        const x = CENTER + ORBIT_RADIUS * Math.cos(angle);
        const y = CENTER + ORBIT_RADIUS * Math.sin(angle);
        return { ...mem, x, y };
    });
  }, [memories]);

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg h-full flex flex-col border-glow-gold backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2 border-b border-dark-border pb-2">
        <h3 className="font-orbitron text-lg text-warm-grey">Regenerative Memory</h3>
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)}
            disabled={memories.length === 0}
            className="px-2 py-0.5 rounded text-xs bg-rose-800/70 text-rose-300 hover:bg-rose-700/80 hover:text-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleClear} className="px-2 py-0.5 rounded text-xs bg-rose-600 text-white">Confirm</button>
            <button onClick={() => setShowConfirm(false)} className="px-2 py-0.5 rounded text-xs bg-slate-600 text-white">Cancel</button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Visualization */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="w-[300px] h-[300px] relative">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <defs>
                  <filter id="petalGlow">
                      <feGaussianBlur stdDeviation="3" />
                  </filter>
              </defs>
              {memories.length === 0 ? (
                <>
                  <circle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS} stroke="var(--dark-border)" strokeWidth="0.5" fill="none" />
                  <circle cx={CENTER} cy={CENTER} r="10" fill="var(--dark-surface)" stroke="var(--dark-border)" strokeWidth="0.5" />
                </>
              ) : (
                <>
                  {/* Connecting Lines */}
                  {memoryPetals.map((petal) => (
                      <line 
                          key={`line-${petal.id}`}
                          x1={CENTER} y1={CENTER}
                          x2={petal.x} y2={petal.y}
                          stroke={activeMemory?.id === petal.id ? 'var(--pearl)' : 'var(--warm-grey)'}
                          strokeWidth={activeMemory?.id === petal.id ? 1 : 0.5}
                          opacity={activeMemory?.id === petal.id ? 0.8 : 0.2}
                          className="transition-all duration-300"
                      />
                  ))}
                  {/* Memory Petals */}
                  {memoryPetals.map(petal => (
                      <circle
                          key={petal.id}
                          cx={petal.x}
                          cy={petal.y}
                          r={PETAL_RADIUS}
                          fill="var(--pearl)"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveMemory(petal)}
                          onMouseLeave={() => setActiveMemory(null)}
                          style={{
                              filter: 'url(#petalGlow)',
                              animation: 'pulse 4s ease-in-out infinite',
                              animationDelay: `${(petal.x / CANVAS_SIZE) * 2}s`,
                              transform: activeMemory?.id === petal.id ? 'scale(1.8)' : 'scale(1)',
                              transformOrigin: `${petal.x}px ${petal.y}px`
                          }}
                      />
                  ))}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Details Panel */}
        <div className="flex-shrink-0 h-28 mt-4 p-3 bg-black/20 rounded-lg border border-dark-border/30 flex items-center justify-center text-center">
            <div className="transition-opacity duration-300 w-full">
                {activeMemory ? (
                    <div className="animate-fade-in">
                        <p className="text-sm text-pearl mb-2 max-h-16 overflow-y-auto pr-2">{activeMemory.content}</p>
                        <p className="text-xs text-warm-grey text-right border-t border-dark-border/50 pt-1">
                            {new Date(activeMemory.timestamp).toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">
                        {memories.length > 0 ? "Hover over a memory petal to view its contents." : "Memory bank is empty. Save insights from SOPHIA."}
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};