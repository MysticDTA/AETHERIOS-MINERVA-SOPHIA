
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

interface AnalysisData {
    summary: string;
    status: 'STABLE' | 'DEGRADING' | 'CRITICAL';
    recommendations: string[];
}

const StructuredAnalysis: React.FC<{ data: string }> = ({ data }) => {
    const parsed: AnalysisData | null = useMemo(() => {
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }, [data]);

    if (!parsed) return <div className="text-rose-400 font-mono text-xs">ERR_PARSE_FAILURE</div>;

    const statusColor = parsed.status === 'STABLE' ? 'text-emerald-400 border-emerald-500/50' : 
                        parsed.status === 'DEGRADING' ? 'text-gold border-gold/50' : 
                        'text-rose-500 border-rose-500/50';

    return (
        <div className="space-y-8 animate-fade-in py-4">
            <div className={`p-6 bg-black/40 border rounded-xl shadow-lg relative overflow-hidden group ${statusColor}`}>
                <div className="absolute top-0 right-0 p-3 opacity-10 font-orbitron text-4xl font-black">{parsed.status}</div>
                <h3 className="font-orbitron text-xs uppercase tracking-[0.3em] font-black mb-3 text-pearl">System State Summary</h3>
                <p className="text-[13px] font-minerva italic leading-relaxed text-pearl/90">
                    "{parsed.summary}"
                </p>
            </div>

            <div>
                <h3 className="font-orbitron text-xs text-gold uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-3">
                    <span className="w-1.5 h-4 bg-gold rounded-sm" />
                    Actionable Recommendations
                </h3>
                <div className="space-y-3">
                    {parsed.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded hover:border-gold/30 hover:bg-white/[0.04] transition-all group/item">
                            <span className="text-slate-500 font-mono text-[10px] font-bold mt-0.5 group-hover/item:text-gold transition-colors">0{i+1}</span>
                            <p className="text-[11px] font-mono text-slate-300 leading-relaxed">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>
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
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
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
              <StructuredAnalysis data={analysis} />
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
