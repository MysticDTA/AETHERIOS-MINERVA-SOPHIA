
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { SystemState, OrbMode } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { useSophiaCore } from './hooks/useSophiaCore';
import { HeuristicFailurePredictor } from './HeuristicFailurePredictor';

const LogicTraceStream: React.FC<{ active: boolean }> = ({ active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !active) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cols = Math.floor(canvas.width / 10);
        const yPos = Array(cols).fill(0);

        let animationFrame: number;

        const render = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#67e8f9';
            ctx.font = '8px monospace';

            yPos.forEach((y, index) => {
                const text = Math.random() > 0.5 ? '1' : '0';
                const x = index * 10;
                
                ctx.globalAlpha = Math.random();
                ctx.fillText(text, x, y);
                
                if (y > canvas.height + Math.random() * 10000) {
                    yPos[index] = 0;
                } else {
                    yPos[index] = y + 10;
                }
            });
            ctx.globalAlpha = 1;
            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [active]);

    return (
        <canvas ref={canvasRef} width={600} height={150} className="w-full h-32 opacity-40 mix-blend-screen" />
    );
};

const RenderedAnalysis: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
    const parsedContent = useMemo(() => {
        if (!htmlContent) return [];
        if (!htmlContent.includes('<h3>')) {
             // Fallback for non-structured output
             return [{ 
                 id: 'raw-output', 
                 title: 'System Analysis', 
                 type: 'p', 
                 paragraph: htmlContent.replace(/<[^>]*>/g, ''), 
                 listItems: [] 
             }];
        }

        const sections = htmlContent.split('<h3>').slice(1);
        return sections.map((section, index) => {
            const [title, ...rest] = section.split('</h3>');
            const content = rest.join('</h3>');
            let listItems: string[] = [];
            let paragraph = '';
            let listType: 'ul' | 'ol' | null = null;

            if (content.includes('<ul>')) {
                listType = 'ul';
                const itemsMatch = content.match(/<li>(.*?)<\/li>/g);
                if (itemsMatch) listItems = itemsMatch.map(item => item.replace(/<\/?li>/g, '').trim());
            } else if (content.includes('<ol>')) {
                listType = 'ol';
                const itemsMatch = content.match(/<li>(.*?)<\/li>/g);
                if (itemsMatch) listItems = itemsMatch.map(item => item.replace(/<\/?li>/g, '').trim());
            } else {
                paragraph = content.replace(/<\/?p>/g, '').replace(/<[^>]*>/g, '').trim();
            }

            return { id: `${title}-${index}`, title: title.trim(), type: listType || 'p', paragraph, listItems };
        });
    }, [htmlContent]);

    if (parsedContent.length === 0) return null;

    return (
        <div className="space-y-10 animate-fade-in py-4">
            {parsedContent.map(section => (
                <div key={section.id} className="bg-white/[0.01] border border-white/[0.05] rounded-xl overflow-hidden hover:border-white/[0.1] transition-all duration-1000 group shadow-lg">
                    <div className="bg-white/[0.02] px-6 py-3 border-b border-white/[0.04] flex justify-between items-center">
                        <h3 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.4em] font-black flex items-center gap-4">
                            <span className="w-1 h-3 bg-gold rounded-full shadow-[0_0_8px_#ffd700]" />
                            {section.title}
                        </h3>
                    </div>
                    <div className="p-6">
                        {section.type === 'p' && (
                            <p className="text-[14px] text-pearl/80 leading-relaxed font-minerva italic select-text antialiased">
                                {section.paragraph}
                            </p>
                        )}
                        {(section.type === 'ul' || section.type === 'ol') && (
                            <ul className="space-y-5">
                                {section.listItems.map((item, i) => (
                                    <li key={i} className="text-[12px] text-slate-300 flex items-start gap-5 font-mono leading-relaxed group/item select-text">
                                        <span className="mt-1 text-[7px] text-slate-600 font-bold tracking-tighter opacity-40">
                                            ({(i + 1).toString().padStart(2, '0')})
                                        </span>
                                        <span className="opacity-80 group-hover:opacity-100 transition-opacity pl-4 border-l border-white/5">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

interface SystemAnalysisProps {
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
  setOrbMode?: (mode: OrbMode) => void;
}

export const SystemAnalysis: React.FC<SystemAnalysisProps> = ({ systemState, sophiaEngine, setOrbMode }) => {
  const { analysis, isLoading, isPredicting, prediction, error, runAnalysis, runPrediction } = useSophiaCore(sophiaEngine, systemState);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Automatically trigger failure prediction analysis on mount and periodically
  useEffect(() => {
      runPrediction();
      const interval = setInterval(() => {
          runPrediction();
      }, 60000); // Refresh prediction every 60s
      return () => clearInterval(interval);
  }, [sophiaEngine]);

  useEffect(() => {
    if (isLoading && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        // Auto-scroll to bottom as analysis streams in, unless user scrolled up
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (isNearBottom) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [analysis, isLoading]);

  return (
    <div className="w-full h-full glass-panel rounded-2xl flex flex-col overflow-hidden relative group transition-all duration-1000 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 flex-shrink-0 border-b border-white/[0.05] bg-black/20 z-20">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
                <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.5em] font-black">System Analysis & Recommendations</h3>
                <div className={`text-[8px] font-mono px-2 py-0.5 rounded-full border tracking-[0.3em] font-black transition-all ${isLoading ? 'border-gold text-gold animate-pulse' : 'border-pearl/10 text-slate-700'}`}>
                    {isLoading ? 'EXECUTING_REASONING' : 'IDLE'}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-24 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400/40 transition-all duration-1000" style={{ width: `${systemState.resonanceFactorRho * 100}%` }} />
                </div>
                <span className="text-[7px] font-mono text-cyan-400/40 uppercase font-black tracking-widest">Rho: {(systemState.resonanceFactorRho * 100).toFixed(2)}%</span>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={scrollContainerRef} 
        className="flex-grow min-h-0 overflow-y-auto px-8 py-6 relative z-10 select-text scrollbar-thin flex flex-col"
      >
        {error && (
            <div className="mb-6 bg-rose-950/10 border border-rose-500/30 p-4 rounded-lg text-[10px] text-rose-300 font-mono flex items-center gap-4 animate-pulse shadow-xl">
                <span className="text-lg">!</span>
                <p>[FRACTURE] {error}</p>
            </div>
        )}

        <div className="mb-8 flex-shrink-0 min-h-[220px]">
            <HeuristicFailurePredictor prediction={prediction} isLoading={isPredicting} />
        </div>

        <div className="flex-grow">
            {isLoading && !analysis ? (
              <div className="h-full flex flex-col py-6 animate-fade-in relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] z-10" />
                <LogicTraceStream active={isLoading} />
                <div className="relative z-20 text-center space-y-4 pt-10">
                    <p className="font-orbitron text-[10px] text-gold uppercase tracking-[0.5em] animate-pulse">Siphoning_Reality_Lattice</p>
                    <p className="text-[11px] font-minerva italic text-slate-500">"Constructing causal logic paths..."</p>
                </div>
              </div>
            ) : analysis ? (
              <RenderedAnalysis htmlContent={analysis} />
            ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center opacity-30 gap-4 mt-8">
                    <div className="w-12 h-12 rounded-full border border-dashed border-white/20 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] font-bold text-white">Analysis Idle</p>
                        <p className="font-minerva italic text-[11px] text-slate-500">"Initiate heuristic scan to generate insights."</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Action Deck (Footer) */}
      <div className="p-6 bg-[#050505] border-t border-white/[0.05] z-20 flex gap-4">
          <button 
            onClick={() => runAnalysis()}
            disabled={isLoading}
            className={`flex-1 py-4 bg-white/[0.02] border border-white/10 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all rounded-sm font-orbitron text-[9px] uppercase tracking-[0.3em] font-bold shadow-lg active:scale-[0.98] group relative overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
              <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">{isLoading ? 'Scanning...' : 'Generate Analysis'}</span>
          </button>
      </div>
    </div>
  );
};
