import React, { useMemo, useEffect, useState, useRef } from 'react';
import { SystemState, OrbMode } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { useSophiaCore } from './hooks/useSophiaCore';

const SCAN_STEPS = [
    { id: 'flux', label: 'Analyzing Aetheric Gestation' },
    { id: 'parity', label: 'Verifying Causal Parity' },
    { id: 'rho', label: 'Gauging Resonance Rho' },
    { id: 'heuristic', label: 'Syncing Heuristic Logic' },
    { id: 'sovereign', label: 'Validating Radiant Sovereignty' }
];

const HeuristicGrid: React.FC = () => {
    const [bits, setBits] = useState<string[]>(new Array(32).fill('0'));
    useEffect(() => {
        const interval = setInterval(() => {
            setBits(prev => prev.map(() => Math.random() > 0.5 ? '1' : '0'));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-8 gap-1.5 p-4 bg-black/40 rounded border border-white/5 font-mono text-[8px] text-cyan-400/40 h-12 mb-8 overflow-hidden select-none shadow-inner">
            {bits.map((bit, i) => (
                <div key={i} className={`flex items-center justify-center transition-all duration-1000 ${bit === '1' ? 'opacity-100 text-pearl scale-110' : 'opacity-20 scale-90'}`}>
                    {bit}
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
        <div className="space-y-6 animate-fade-in py-2">
            {parsedContent.map(section => (
                <div key={section.id} className="bg-white/[0.01] border border-white/[0.04] rounded-sm overflow-hidden hover:border-white/[0.12] transition-all duration-700 group shadow-lg">
                    <div className="bg-white/[0.04] px-4 py-2 border-b border-white/[0.06] flex justify-between items-center">
                        <h3 className="font-orbitron text-[9px] text-pearl/90 uppercase tracking-[0.3em] font-bold">{section.title}</h3>
                        <div className="flex gap-1.5"><span className="w-1 h-1 bg-pearl/30 rounded-full group-hover:bg-pearl/60 transition-colors" /></div>
                    </div>
                    <div className="p-4">
                        {section.type === 'p' && <p className="text-[13px] text-warm-grey/90 leading-relaxed font-minerva italic opacity-95 antialiased select-text">{section.paragraph}</p>}
                        {section.type === 'ul' && (
                            <ul className="space-y-3">
                                {section.listItems.map((item, i) => (
                                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-4 font-mono leading-relaxed group/item select-text">
                                        <span className="text-gold/50 mt-1 text-[7px] shrink-0 group-hover/item:text-gold transition-colors">▶</span>
                                        <span className="opacity-80 group-hover/item:opacity-100 transition-opacity">{item}</span>
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
  const { analysis, sources, prediction, isLoading, isPredicting, error, runAnalysis, runPrediction } = useSophiaCore(sophiaEngine, systemState);
  const [activeStep, setActiveStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wasBusy = useRef(false);

  useEffect(() => {
    if (isLoading && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
        if (isNearBottom) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [analysis, isLoading]);

  useEffect(() => {
    if (isLoading && !analysis) {
        const interval = setInterval(() => setActiveStep(prev => (prev + 1) % SCAN_STEPS.length), 2200);
        return () => clearInterval(interval);
    }
  }, [isLoading, analysis]);

  useEffect(() => {
      if (isLoading) {
          wasBusy.current = true;
          if (!analysis && setOrbMode) setOrbMode('ANALYSIS');
          else if (setOrbMode) setOrbMode('SYNTHESIS');
      } else if (wasBusy.current && setOrbMode) {
          wasBusy.current = false;
          setOrbMode('STANDBY');
      }
  }, [isLoading, analysis, setOrbMode]);

  // Periodic Failure Prediction
  useEffect(() => {
    const interval = setInterval(() => {
        if (!isLoading && !isPredicting && sophiaEngine) {
            runPrediction();
        }
    }, 45000); // Check every 45s
    return () => clearInterval(interval);
  }, [isLoading, isPredicting, sophiaEngine, runPrediction]);

  const showPredictionAlert = prediction && (prediction.severity === 'CRITICAL' || prediction.probability > 0.5);

  return (
    <div className="w-full h-full bg-[#0a0a0a]/70 border border-white/[0.08] rounded-xl flex flex-col overflow-hidden relative group transition-all duration-700 shadow-2xl backdrop-blur-3xl">
      <div className="flex justify-between items-center px-6 py-5 flex-shrink-0 border-b border-white/[0.05] bg-black/40 z-20">
        <div className="flex items-center gap-4">
            <h3 className="font-orbitron text-[11px] text-warm-grey uppercase tracking-[0.4em] font-bold">Heuristic Audit Terminal</h3>
            <div className={`text-[8px] font-mono px-2 py-0.5 rounded-sm border tracking-[0.2em] ${isLoading ? 'border-gold/50 text-gold animate-pulse' : 'border-pearl/10 text-slate-600'}`}>
                {isLoading ? 'PROCESS_BUSY' : 'SYS_READY'}
            </div>
        </div>
        <div className="flex items-center gap-3">
             <span className="text-[7px] font-mono text-slate-500 uppercase">1.617 GHz Intercept</span>
             <div className={`w-2 h-2 rounded-full transition-all duration-500 ${systemState.resonanceFactorRho > 0.9 ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-700'}`} />
        </div>
      </div>

      <div 
        ref={scrollContainerRef} 
        className="flex-grow min-h-0 overflow-y-auto px-6 py-5 relative z-10 clear-scrolling-window select-text scrollbar-thin"
      >
        {showPredictionAlert && (
            <div className="mb-6 bg-rose-950/30 border border-rose-500/50 p-4 rounded-sm animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.15)] relative overflow-hidden group/alert">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-rose-500 rounded-full" />
                        <span className="font-orbitron text-[10px] text-rose-300 uppercase tracking-widest font-bold">Causal Failure Forecast</span>
                    </div>
                    <span className="font-mono text-[9px] text-rose-500">PROBABILITY: {(prediction.probability * 100).toFixed(0)}%</span>
                </div>
                <p className="text-[12px] font-minerva italic text-pearl leading-relaxed mb-3">
                    "Decoherence event likely in <span className="text-rose-400 font-bold underline">{prediction.estTimeToDecoherence}</span>. Primary factor: {prediction.primaryRiskFactor}"
                </p>
                <div className="bg-rose-500/10 p-2 border border-rose-500/20 rounded-sm">
                    <p className="text-[9px] font-mono text-rose-200 uppercase tracking-tighter"><span className="text-white font-bold">RECOMMENDED:</span> {prediction.recommendedIntervention}</p>
                </div>
            </div>
        )}

        {isLoading && !analysis ? (
          <div className="h-full flex flex-col pt-12 items-center">
            <HeuristicGrid />
            <div className="w-full space-y-6 px-4">
                {SCAN_STEPS.map((step, i) => (
                    <div key={step.id} className={`flex items-center justify-between text-[10px] font-mono transition-all duration-[1200ms] ${i === activeStep ? 'opacity-100 text-pearl' : i < activeStep ? 'opacity-40 text-pearl' : 'opacity-5 text-slate-500'}`}>
                        <div className="flex items-center gap-4">
                            <span className="w-4 font-bold">{i < activeStep ? '✔' : i === activeStep ? '⟳' : '○'}</span>
                            <span className="uppercase tracking-[0.2em]">{step.label}</span>
                        </div>
                        <span className="tracking-widest text-[8px] opacity-40">{i < activeStep ? 'DONE' : i === activeStep ? 'CALC' : 'WAIT'}</span>
                    </div>
                ))}
            </div>
          </div>
        ) : analysis ? (
            <div className="pb-10">
                <RenderedAnalysis htmlContent={analysis} />
                {sources && sources.length > 0 && (
                    <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                        {sources.map((s, idx) => (
                            <a key={idx} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-slate-500 hover:text-gold bg-white/[0.02] border border-white/[0.05] hover:border-gold/30 px-3 py-1.5 rounded transition-all group/link">
                                <span className="mr-2 opacity-30 group-hover:opacity-100">[{idx.toString().padStart(2, '0')}]</span>
                                {s.web?.title?.substring(0, 32) || 'CAUSAL_DATA_NODE'}...
                            </a>
                        ))}
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center h-full flex flex-col items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                <p className="text-[11px] text-warm-grey font-orbitron uppercase tracking-[0.6em] mb-4">Awaiting Causal Command</p>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <p className="text-[8px] font-mono text-slate-600 mt-4 tracking-widest uppercase">Protocol: Minerva_Audit_V1.2.6</p>
            </div>
        )}
      </div>

      <div className="p-6 bg-black/45 border-t border-white/[0.08] flex-shrink-0 z-20">
        <button 
          onClick={runAnalysis} 
          disabled={isLoading || !sophiaEngine} 
          className="w-full py-5 rounded-sm bg-violet-950/20 hover:bg-violet-900/50 border border-violet-500/30 hover:border-violet-500/80 text-pearl/80 hover:text-white font-orbitron font-bold text-[11px] uppercase tracking-[0.6em] transition-all disabled:opacity-10 group/btn shadow-xl active:scale-[0.98]"
        >
            {isLoading ? 'EXECUTING_AUDIT...' : analysis ? 'RE-INITIATE_PARITY_SCAN' : 'EXECUTE_HEURISTIC_SWEEP'}
        </button>
      </div>

      <div className="absolute inset-x-0 top-16 h-10 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-28 h-10 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};
