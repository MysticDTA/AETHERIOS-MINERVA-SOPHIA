
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { SystemState, OrbMode } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { useSophiaCore } from './hooks/useSophiaCore';
import { HeuristicFailurePredictor } from './HeuristicFailurePredictor';

const SCAN_STEPS = [
    { id: 'flux', label: 'Analyzing Aetheric Gestation' },
    { id: 'parity', label: 'Verifying Causal Parity' },
    { id: 'rho', label: 'Gauging Resonance Rho' },
    { id: 'heuristic', label: 'Syncing Heuristic Logic' },
    { id: 'sovereign', label: 'Validating Radiant Sovereignty' }
];

const SynapticLogicTrace: React.FC = () => {
    const [streams, setStreams] = useState<{ id: number; bits: string; opacity: number }[]>([]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const newStream = {
                id: Date.now(),
                bits: Array.from({length: 12}).map(() => Math.random() > 0.5 ? '1' : '0').join(''),
                opacity: 1
            };
            setStreams(prev => [newStream, ...prev].slice(0, 10));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-1 font-mono text-[8px] text-cyan-400/40 h-24 mb-10 overflow-hidden select-none italic">
            {streams.map((s, i) => (
                <div key={s.id} className="transition-all duration-1000 flex gap-4" style={{ opacity: 1 - (i / 10) }}>
                    <span className="text-slate-700">0x{(s.id % 0xFFFF).toString(16).padStart(4, '0')}</span>
                    <span className="tracking-[0.5em]">{s.bits}</span>
                    <span className="text-gold/30">TRACE_ACTIVE</span>
                </div>
            ))}
        </div>
    );
};

const RenderedAnalysis: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
    const parsedContent = useMemo(() => {
        if (!htmlContent) return [];
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
            } else if (content.includes('<p>')) {
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
  const { analysis, isLoading, isPredicting, prediction, error, runAnalysis } = useSophiaCore(sophiaEngine, systemState);
  const [activeStep, setActiveStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (isNearBottom) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [analysis, isLoading]);

  useEffect(() => {
    if (isLoading && !analysis) {
        const interval = setInterval(() => setActiveStep(prev => (prev + 1) % SCAN_STEPS.length), 1500);
        return () => clearInterval(interval);
    }
  }, [isLoading, analysis]);

  return (
    <div className="w-full h-full glass-panel rounded-2xl flex flex-col overflow-hidden relative group transition-all duration-1000 shadow-2xl">
      <div className="flex justify-between items-center px-8 py-6 flex-shrink-0 border-b border-white/[0.05] bg-black/20 z-20">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
                <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.5em] font-black">Heuristic Audit</h3>
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
              <div className="h-full flex flex-col py-6 animate-fade-in">
                <SynapticLogicTrace />
                <div className="space-y-4 w-full max-w-sm ml-4">
                    {SCAN_STEPS.map((step, i) => (
                        <div key={step.id} className={`flex items-center justify-between text-[10px] font-mono transition-all duration-1000 ${i === activeStep ? 'opacity-100 text-pearl translate-x-2' : i < activeStep ? 'opacity-40 text-gold' : 'opacity-10 text-slate-700'}`}>
                            <div className="flex items-center gap-4">
                                <span className="w-4 font-black">{i < activeStep ? '✔' : i === activeStep ? '⟳' : '○'}</span>
                                <span className="uppercase tracking-[0.2em] font-bold">{step.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            ) : analysis ? (
                <div className="pb-16 max-w-4xl mx-auto">
                    <RenderedAnalysis htmlContent={analysis} />
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20 border border-dashed border-white/5 rounded-xl mt-4 group-hover:opacity-40 transition-opacity duration-1000">
                    <div className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 border-t-gold border rounded-full animate-spin-slow" />
                        <span className="font-orbitron text-xl text-white opacity-40 italic">Σ</span>
                    </div>
                    <p className="text-[10px] text-warm-grey font-orbitron uppercase tracking-[0.8em] font-black">Awaiting Decree</p>
                </div>
            )}
        </div>
      </div>

      <div className="p-8 bg-black/40 border-t border-white/[0.05] flex-shrink-0 z-20 shadow-2xl">
        <button 
          onClick={runAnalysis} 
          disabled={isLoading || !sophiaEngine} 
          className="w-full py-4 rounded-xl bg-violet-600/5 hover:bg-violet-600/10 border border-violet-500/10 hover:border-violet-500/30 text-pearl/50 hover:text-white font-orbitron font-black text-[11px] uppercase tracking-[0.6em] transition-all disabled:opacity-20 active:scale-[0.98] relative overflow-hidden group/btn shadow-lg"
        >
            <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[1500ms]" />
            <span className="relative z-10">
                {isLoading ? 'ANALYZING_PARITY...' : 'EXECUTE_SWEEP'}
            </span>
        </button>
      </div>
    </div>
  );
};
