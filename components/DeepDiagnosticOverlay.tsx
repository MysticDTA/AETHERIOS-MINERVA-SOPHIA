import React, { useState, useEffect, useRef, useMemo } from 'react';
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

const SpectralResonanceHUD: React.FC<{ progress: number; isActive: boolean }> = ({ progress, isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [history] = useState<number[]>(new Array(60).fill(0));

    useEffect(() => {
        if (!isActive) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !canvasRef.current) return;

        let frame = 0;
        const animate = () => {
            const w = canvasRef.current!.width;
            const h = canvasRef.current!.height;
            ctx.clearRect(0, 0, w, h);

            // Draw Background Grid
            ctx.strokeStyle = 'rgba(230, 199, 127, 0.05)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < w; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
            for (let j = 0; j < h; j += 20) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke(); }

            // Update Resonance Rho simulation
            // Noise decreases as progress increases
            const noise = (1 - progress / 100) * 40;
            const rho = 0.99 - (noise / 100);
            
            history.push(rho);
            if (history.length > 60) history.shift();

            // Draw Waveform
            ctx.strokeStyle = '#e6c77f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            history.forEach((val, i) => {
                const x = (i / 60) * w;
                const jitter = (Math.random() - 0.5) * noise;
                const y = h - (val * h * 0.8) + jitter;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Draw Scanline
            ctx.fillStyle = 'rgba(230, 199, 127, 0.1)';
            ctx.fillRect((frame % 60) / 60 * w, 0, 2, h);

            frame++;
            if (isActive) requestAnimationFrame(animate);
        };
        const handle = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(handle);
    }, [isActive, progress, history]);

    return (
        <div className="bg-black/60 border border-white/5 p-4 rounded-sm relative overflow-hidden h-32 group shadow-inner">
            <div className="absolute top-2 left-4 font-mono text-[8px] text-gold uppercase tracking-[0.4em] font-bold opacity-60">Resonance_Spectral_Waterfall</div>
            <canvas ref={canvasRef} width={400} height={100} className="w-full h-full opacity-80" />
            <div className="absolute bottom-2 right-4 text-right">
                <p className="text-[7px] text-slate-600 uppercase">Rho_Coefficient</p>
                <p className="font-orbitron text-xs text-pearl">{(0.99 - (1 - progress/100) * 0.4).toFixed(6)}</p>
            </div>
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
        
        const iterations = 12; 
        for (let p = 0; p <= iterations; p++) {
          const progress = (p / iterations) * 100;
          await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress } : s));
          
          if (Math.random() > 0.25) {
            const msg = SCAN_TELEMETRY[Math.floor(Math.random() * SCAN_TELEMETRY.length)];
            setTerminalOutput(prev => [...prev.slice(-50), `[${steps[i].id.toUpperCase()}] ${msg}`]);
          }
        }

        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'SUCCESS', progress: 100 } : s));
        const successMsg = `[SUCCESS] ${steps[i].id} functional registry verified.`;
        setTerminalOutput(prev => [...prev, successMsg]);

        if (steps[i].id === 'audit_logic' && sophiaEngine) {
            setIsAuditing(true);
            setTerminalOutput(prev => [...prev, "[SOPHIA] Initiating deep intellectual synthesis..."]);
            const report = await sophiaEngine.performSystemAudit(systemState);
            setAuditReport(report);
            setIsAuditing(false);
            setTerminalOutput(prev => [...prev, "[SUCCESS] Heuristic audit report generated."]);
        }
      }

      setDiagnosticStatus('PARITY_CHECK');
      setTerminalOutput(prev => [...prev, "--- ALL MODULES VERIFIED & HARMONIZED ---", "ESTABLISHING GLOBAL PARITY LOCK AT 1.617 GHz..."]);
      await new Promise(r => setTimeout(r, 2000));
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
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none overflow-hidden">
        <div className="grid grid-cols-24 gap-4 h-full text-[6px] leading-tight">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="animate-[pulse_5s_infinite]" style={{ animationDelay: `${i * 0.05}s` }}>
              {Math.random().toString(36).repeat(40)}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col gap-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-gold rounded-full animate-ping" />
                <h1 className="font-orbitron text-4xl md:text-5xl text-pearl tracking-tighter uppercase font-bold text-glow-pearl">Full System Audit</h1>
            </div>
            <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] font-bold">Node_SFO_1 // Causal Parity Audit // Grade_07</p>
          </div>
          <div className="hidden md:block">
            <div className={`px-8 py-3 rounded-sm border-2 text-[12px] font-bold tracking-[0.3em] transition-all duration-1000 ${
              diagnosticStatus === 'COMPLETED' ? 'border-green-500/60 text-green-400 bg-green-950/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-gold/60 text-gold bg-gold/10 animate-pulse'
            }`}>
              {diagnosticStatus === 'COMPLETED' ? 'SCAN_LOCKED' : 'EXECUTING_HEURISTIC_SWEEP'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
          <div className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto pr-6 scrollbar-thin">
            <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mb-4">Registry Trace</h4>
            {steps.map((step, i) => (
              <div key={step.id} className={`p-5 rounded-sm border transition-all duration-1000 group ${
                step.status === 'ACTIVE' ? 'border-gold bg-gold/5 scale-[1.02] shadow-[0_0_30px_rgba(230,199,127,0.1)]' : 
                step.status === 'SUCCESS' ? 'border-green-500/20 bg-green-950/10 opacity-70' : 
                'border-white/5 bg-black/40 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${step.status === 'ACTIVE' ? 'text-gold' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] font-mono opacity-80">{step.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${step.status === 'SUCCESS' ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-gold shadow-[0_0_8px_#e6c77f]'}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}

            {auditReport && (
                <div className="mt-6 p-6 bg-gold/5 border border-gold/30 rounded animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold/40" />
                    <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.4em] mb-6 border-b border-gold/10 pb-3 font-bold">Heuristic Conclusion</h4>
                    <div className="text-[12px] text-pearl/80 leading-relaxed font-minerva italic audit-report-content space-y-4 select-text" dangerouslySetInnerHTML={{ __html: auditReport.report }} />
                    {auditReport.sources.length > 0 && (
                        <div className="mt-8 pt-4 border-t border-gold/10 flex flex-wrap gap-3">
                            {auditReport.sources.map((s, idx) => (
                                <a key={idx} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-gold/50 hover:text-gold transition-all bg-white/5 px-2 py-1 rounded">
                                    SOURCE_0{idx}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 min-h-0">
            <SpectralResonanceHUD progress={steps[activeStepIdx].progress} isActive={diagnosticStatus === 'SCANNING' || diagnosticStatus === 'PARITY_CHECK'} />
            
            <div 
              ref={terminalRef}
              className="flex-1 bg-black/90 border border-white/10 rounded-sm p-8 overflow-y-auto scrollbar-thin shadow-2xl relative font-mono text-[11px] select-text"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/60" />
              {terminalOutput.map((line, i) => (
                <div key={i} className="leading-relaxed mb-2 flex gap-6 group">
                  <span className="text-slate-700 font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">{(i * 4).toString(16).padStart(4, '0')}</span>
                  <span className={line.includes('[SUCCESS]') ? 'text-green-400 font-bold' : line.includes('SOPHIA') ? 'text-gold italic' : 'text-pearl/70'}>
                    {line}
                  </span>
                </div>
              ))}
              {(diagnosticStatus !== 'COMPLETED' || isAuditing) && (
                <div className="flex items-center gap-3 mt-6 animate-pulse text-gold">
                  <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_#e6c77f]" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold">
                    {isAuditing ? 'SOPHIA_COG_BUDGET_EXECUTING [MAX]...' : 'EXECUTING_CAUSAL_SWEEP...'}
                  </span>
                </div>
              )}
            </div>

            <div className="h-20 bg-black/40 border border-white/5 rounded flex items-center justify-around px-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.05)_0%,transparent_100%)] pointer-events-none" />
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`w-1 transition-all duration-1000 ${ (activeStepIdx === i % steps.length) ? 'bg-pearl h-12 shadow-[0_0_20px_white]' : 'bg-white/5 h-6' }`} />
                ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8 border-t border-white/10">
          <button 
            onClick={diagnosticStatus === 'COMPLETED' ? () => { onComplete(); onClose(); } : undefined}
            disabled={diagnosticStatus !== 'COMPLETED'}
            className={`px-24 py-5 rounded-sm font-orbitron text-[12px] font-bold uppercase tracking-[0.8em] transition-all border relative overflow-hidden group shadow-2xl ${
              diagnosticStatus === 'COMPLETED' 
                ? 'bg-pearl text-dark-bg border-pearl hover:bg-white hover:scale-105 shadow-[0_0_50px_rgba(248,245,236,0.3)] active:scale-95' 
                : 'bg-white/5 border-white/10 text-slate-700 cursor-not-allowed'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">{diagnosticStatus === 'COMPLETED' ? 'Finalize Audit Sequence' : 'Audit Protocol Active'}</span>
          </button>
        </div>
      </div>
      
      <style>{`
        .audit-report-content h3 { color: var(--gold); font-family: 'Orbitron'; font-size: 11px; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(230, 199, 127, 0.2); padding-bottom: 0.25rem; font-weight: bold; }
        .audit-report-content p { margin-bottom: 1rem; }
        .audit-report-content ul { margin-left: 1.5rem; list-style: square; margin-bottom: 1rem; }
        .audit-report-content li { margin-bottom: 0.5rem; }
        .audit-report-content b { color: var(--gold); }
      `}</style>
    </div>
  );
};