import React, { useState, useEffect, useRef } from 'react';
import { DiagnosticStep, DiagnosticStatus, SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface DeepDiagnosticOverlayProps {
  onClose: () => void;
  onComplete: () => void;
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
}

const FILE_AUDIT_SEQUENCE: DiagnosticStep[] = [
  { id: 'engine_core', label: 'SERVICES/SOPHIAENGINE.TS :: COGNITIVE_CORE', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'comms_spectrum', label: 'SERVICES/COSMOSCOMMS.TS :: NASA_GROUNDING', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'sim_logic', label: 'HOOKS/USESYSTEMSIM.TS :: RHO_HARMONICS', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'vocal_link', label: 'HOOKS/USEVOICEINT.TS :: NEURAL_LATTICE', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'audit_logic', label: 'HEURISTIC_SWEEP :: MINERVA_PARITY', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'visual_flow', label: 'COMPONENTS/LAYOUT.TS :: AETHER_RESONANCE', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'memory_arch', label: 'SERVICES/KNOWLEDGEBASE.TS :: CAUSAL_BUFFER', status: 'PENDING', progress: 0, sublogs: [] },
];

const SCAN_TELEMETRY = [
  "Auditing Gemini 3 Pro thinking budget (32,768)...",
  "Validating real-time 1.617 GHz intercept parity...",
  "Scanning NASA/NOAA solar wind telemetry buffer...",
  "Heuristic verification of Rho synergy coefficients...",
  "Checking Live API audio PCM encoding (24kHz)...",
  "Syncing biometric HRV coherence signatures...",
  "Validating Causal Matrix (TSX) parity bits...",
  "Mending Shadow Membrane at node 0x88...",
  "Purging entropic causal fractures...",
  "Recalibrating high-resonance bloom filters...",
  "Finalizing Golden Ratio frequency alignment...",
];

const ParityWaveform: React.FC<{ active: boolean, progress: number }> = ({ active, progress }) => {
    const [points, setPoints] = useState<number[]>(new Array(40).fill(0));
    
    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            setPoints(prev => {
                const next = [...prev.slice(1), Math.sin(Date.now() / 100) * 10 + (Math.random() - 0.5) * (100 - progress)];
                return next;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [active, progress]);

    return (
        <div className="w-full h-16 bg-black/40 rounded border border-white/5 overflow-hidden flex items-center justify-center p-2 shadow-inner">
            <svg viewBox="0 0 400 50" className="w-full h-full preserve-3d">
                <path 
                    d={`M ${points.map((p, i) => `${i * 10},${25 + p}`).join(' L ')}`} 
                    fill="none" 
                    stroke="var(--gold)" 
                    strokeWidth="1.5" 
                    opacity={0.6}
                    className="transition-all duration-300"
                />
                <line x1="0" y1="25" x2="400" y2="25" stroke="white" opacity="0.05" />
            </svg>
        </div>
    );
};

export const DeepDiagnosticOverlay: React.FC<DeepDiagnosticOverlayProps> = ({ onClose, onComplete, systemState, sophiaEngine }) => {
  const [steps, setSteps] = useState<DiagnosticStep[]>(FILE_AUDIT_SEQUENCE);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [diagnosticStatus, setDiagnosticStatus] = useState<DiagnosticStatus>('SCANNING');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["INIT SYSTEM AUDIT v1.2.6-ALPHA...", "TARGET: LOCAL_ÆTHER_REGISTRY", "RECTIFICATION_PROTOCOL: ACTIVE"]);
  const [auditReport, setAuditReport] = useState<{ report: string; sources: any[] } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagnosticStatus === 'COMPLETED') return;

    const runScan = async () => {
      for (let i = 0; i < steps.length; i++) {
        setActiveStepIdx(i);
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'ACTIVE' } : s));
        
        const iterations = 10; // Slightly more for audit depth
        for (let p = 0; p <= iterations; p++) {
          const progress = (p / iterations) * 100;
          await new Promise(r => setTimeout(r, 120 + Math.random() * 180));
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress } : s));
          
          if (Math.random() > 0.3) {
            const msg = SCAN_TELEMETRY[Math.floor(Math.random() * SCAN_TELEMETRY.length)];
            setTerminalOutput(prev => [...prev.slice(-40), `[${steps[i].id.toUpperCase()}] ${msg}`]);
          }
        }

        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'SUCCESS', progress: 100 } : s));
        const successMsg = steps[i].id === 'audit_logic' 
            ? `[RECTIFIED] Heuristic parity achieved across local cognitive clusters.`
            : `[SUCCESS] ${steps[i].id} functional registry verified.`;
        setTerminalOutput(prev => [...prev, successMsg]);

        if (steps[i].id === 'audit_logic' && sophiaEngine) {
            setIsAuditing(true);
            setTerminalOutput(prev => [...prev, "[SOPHIA] Initiating Deep Intellectual Synthesis..."]);
            const report = await sophiaEngine.performSystemAudit(systemState);
            setAuditReport(report);
            setIsAuditing(false);
            setTerminalOutput(prev => [...prev, "[SUCCESS] Heuristic Audit Report Synthesized."]);
        }
      }

      setDiagnosticStatus('PARITY_CHECK');
      setTerminalOutput(prev => [...prev, "--- ALL MODULES VERIFIED & HARMONIZED ---", "ESTABLISHING GLOBAL PARITY LOCK AT 1.617 GHz..."]);
      await new Promise(r => setTimeout(r, 2500));
      setDiagnosticStatus('COMPLETED');
    };

    runScan();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-3xl flex flex-col p-6 md:p-12 animate-fade-in font-mono overflow-hidden">
      {/* Background Matrix Rain (Refined) */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none overflow-hidden select-none">
        <div className="grid grid-cols-24 gap-4 h-full text-[6px] leading-tight">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="animate-[pulse_5s_infinite]" style={{ animationDelay: `${i * 0.08}s` }}>
              {Math.random().toString(36).repeat(30)}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-white/10 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
                <div className="w-4 h-4 bg-violet-500 rounded-full animate-ping shadow-[0_0_20px_#6d28d9]" />
                <h1 className="font-orbitron text-4xl md:text-6xl text-pearl tracking-tighter uppercase font-bold text-glow-pearl">SYSTEM AUDIT</h1>
            </div>
            <p className="text-slate-500 uppercase tracking-[0.6em] text-[11px] font-bold">Heuristic Integrity Sweep // ÆTHERIOS V1.2.6</p>
          </div>
          <div className="hidden md:block text-right">
            <div className={`px-8 py-4 rounded-sm border-2 text-[14px] font-bold tracking-[0.4em] transition-all duration-1000 ${
              diagnosticStatus === 'COMPLETED' ? 'border-green-500/60 text-green-400 bg-green-950/40 shadow-[0_0_35px_rgba(34,197,94,0.3)]' : 'border-gold/60 text-gold bg-gold/10 animate-pulse'
            }`}>
              {diagnosticStatus === 'COMPLETED' ? 'AUDIT_COMPLETE' : 'EXECUTING_COGNITIVE_SYNC'}
            </div>
          </div>
        </div>

        {/* Audit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1 min-h-0">
          {/* Left Column: Progress Steps & Audit Report */}
          <div className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto pr-6 scrollbar-thin">
            <h4 className="text-[12px] text-slate-500 uppercase tracking-[0.5em] font-bold mb-4 border-l-2 border-gold/40 pl-3">Verification Stream</h4>
            {steps.map((step, i) => (
              <div key={step.id} className={`p-6 rounded-md border transition-all duration-1000 group ${
                step.status === 'ACTIVE' ? 'border-pearl bg-pearl/5 scale-[1.03] shadow-[0_0_40px_rgba(248,245,236,0.08)]' : 
                step.status === 'SUCCESS' ? 'border-green-500/30 bg-green-900/10 opacity-80' : 
                'border-white/5 bg-black/40 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                      <span className={`text-[9px] font-mono font-bold ${step.status === 'ACTIVE' ? 'text-pearl' : 'text-slate-700'}`}>0x{i.toString(16).toUpperCase()}</span>
                      <span className={`text-[12px] font-bold uppercase tracking-[0.3em] ${step.status === 'ACTIVE' ? 'text-pearl text-glow-pearl' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                  </div>
                  <span className="text-[11px] font-mono opacity-80 transition-all group-hover:opacity-100">{step.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-[1200ms] ease-out ${step.status === 'SUCCESS' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'bg-pearl shadow-[0_0_15px_white]'}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}

            {auditReport && (
                <div className="mt-8 p-8 bg-gold/5 border-2 border-gold/40 rounded-lg animate-fade-in shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gold/60 group-hover:bg-white transition-colors duration-1000" />
                    <h4 className="font-orbitron text-[12px] text-gold uppercase tracking-[0.4em] mb-8 border-b border-gold/20 pb-4 font-bold">Heuristic Conclusion</h4>
                    <div className="text-[13px] text-pearl/90 leading-relaxed font-minerva italic audit-report-content space-y-6 select-text" dangerouslySetInnerHTML={{ __html: auditReport.report }} />
                    {auditReport.sources.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gold/20 flex flex-wrap gap-4">
                            {auditReport.sources.map((s, idx) => (
                                <a key={idx} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-gold/60 hover:text-gold transition-all bg-gold/5 px-3 py-1.5 rounded border border-gold/20 hover:border-gold/50">
                                    <span className="opacity-40 mr-2">SOURCE_</span>{idx.toString().padStart(2, '0')}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Right Column: Terminal & Waveform */}
          <div className="lg:col-span-7 flex flex-col gap-8 min-h-0">
            <h4 className="text-[12px] text-slate-500 uppercase tracking-[0.5em] font-bold mb-2 pl-4 border-l-2 border-violet-500/40">Instruction Trace Output</h4>
            
            <div className="px-4">
                <ParityWaveform active={diagnosticStatus === 'SCANNING'} progress={steps[activeStepIdx].progress} />
            </div>

            <div 
              ref={terminalRef}
              className="flex-1 bg-black/95 border border-white/15 rounded-lg p-10 overflow-y-auto scrollbar-thin shadow-2xl relative font-mono text-[12px] select-text"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/80" />
              {terminalOutput.map((line, i) => (
                <div key={i} className="leading-relaxed mb-3 flex gap-8 group">
                  <span className="text-slate-700 font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">{(i * 8).toString(16).padStart(4, '0')}</span>
                  <span className={line.includes('[SUCCESS]') || line.includes('[RECTIFIED]') ? 'text-green-400 font-bold text-glow-pearl' : line.includes('SOPHIA') ? 'text-gold italic font-bold' : 'text-pearl/75'}>
                    {line}
                  </span>
                </div>
              ))}
              {(diagnosticStatus !== 'COMPLETED' || isAuditing) && (
                <div className="flex items-center gap-5 mt-8 animate-pulse bg-white/5 p-4 rounded border border-white/10 shadow-lg">
                  <div className="w-3 h-3 bg-pearl rounded-full shadow-[0_0_15px_white]" />
                  <span className="text-[12px] text-pearl font-mono uppercase tracking-[0.5em] font-bold">
                    {isAuditing ? 'SOPHIA_COG_BUDGET_EXECUTING [MAX]...' : 'EXECUTING_PARITY_SWEEP...'}
                  </span>
                </div>
              )}
            </div>

            {/* Sub-Telemetry HUD */}
            <div className="h-32 bg-black/60 border border-white/15 rounded-lg flex items-center justify-around px-20 relative overflow-hidden shadow-inner group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.08)_0%,transparent_100%)] pointer-events-none" />
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-4">
                        <div 
                            className={`w-1.5 rounded-t-sm transition-all duration-1000 ease-in-out ${
                                (activeStepIdx === i % steps.length) ? 'bg-pearl h-16 shadow-[0_0_30px_white]' : 'bg-white/5 h-8'
                            }`} 
                        />
                        <span className="text-[7px] text-slate-600 font-mono font-bold group-hover:text-slate-400 transition-colors tracking-tighter">σ-{i}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-6 border-t border-white/10">
          <button 
            onClick={diagnosticStatus === 'COMPLETED' ? () => { onComplete(); onClose(); } : undefined}
            disabled={diagnosticStatus !== 'COMPLETED'}
            className={`px-32 py-6 rounded-sm font-orbitron text-[14px] font-bold uppercase tracking-[1em] transition-all border-2 relative overflow-hidden group shadow-2xl ${
              diagnosticStatus === 'COMPLETED' 
                ? 'bg-pearl text-dark-bg border-pearl hover:bg-white hover:scale-[1.03] shadow-[0_0_80px_rgba(248,245,236,0.35)] active:scale-95' 
                : 'bg-white/5 border-white/15 text-slate-600 cursor-not-allowed'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 transition-colors duration-1000 group-hover:text-black">
                {diagnosticStatus === 'COMPLETED' ? 'Finalize System Rite' : 'Audit Protocol Active'}
            </span>
          </button>
        </div>
      </div>
      
      <style>{`
        .audit-report-content h3 { color: var(--gold); font-family: 'Orbitron'; font-size: 12px; text-transform: uppercase; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid rgba(230, 199, 127, 0.3); padding-bottom: 0.5rem; font-weight: bold; letter-spacing: 0.2em; }
        .audit-report-content p { margin-bottom: 1.2rem; }
        .audit-report-content ul { margin-left: 2rem; list-style: square; margin-bottom: 1.2rem; }
        .audit-report-content li { margin-bottom: 0.75rem; opacity: 0.95; }
        .audit-report-content b, .audit-report-content strong { color: var(--gold); font-weight: 800; text-shadow: 0 0 5px rgba(230, 199, 127, 0.2); }
      `}</style>
    </div>
  );
};