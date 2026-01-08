
import React, { useState, useEffect, useRef } from 'react';
import { DiagnosticStep, DiagnosticStatus, SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { AudioEngine } from './audio/AudioEngine';

interface DeepDiagnosticOverlayProps {
  onClose: () => void;
  onComplete: () => void;
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
  audioEngine: AudioEngine | null;
  onReportGenerated?: (report: { report: string; sources: any[] }) => void;
}

const QUANTUM_AUDIT_SEQUENCE: DiagnosticStep[] = [
  { id: 'perf_telemetry', label: 'UPLINK_TELEMETRY :: LATENCY_CHECK', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'quantum_coherence', label: 'QUANTUM_COHERENCE :: SUPERPOSITION', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'file_integrity', label: 'FILE_SYSTEM_INTEGRITY :: MODULE_HASH', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'temporal_alignment', label: 'TEMPORAL_ALIGNMENT :: CHRONON_SYNC', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'gpu_compute', label: 'GPU_COMPUTE_STRESS :: WEBGL_PARITY', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'hardware_scan', label: 'HOST_NODE_INTERROGATION :: HARDWARE_ID', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'engine_core', label: 'SOPHIA_COGNITIVE_CORE :: LLM_BRIDGE', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'entanglement', label: 'ENTANGLEMENT_VERIFICATION :: BELL_TEST', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'audit_logic', label: 'HEURISTIC_SWEEP :: MINERVA_PARITY', status: 'PENDING', progress: 0, sublogs: [] },
];

const SCAN_TELEMETRY = [
  "Collapsing wavefunction to observable state...",
  "Measuring Planck-scale jitter...",
  "Auditing Gemini 3 Pro thinking budget (32,768)...",
  "Validating real-time 1.617 GHz intercept parity...",
  "Heuristic verification of Rho synergy coefficients...",
  "Syncing biometric HRV coherence signatures...",
  "Mending Shadow Membrane at node 0x88...",
  "Purging entropic causal fractures...",
  "Re-aligning temporal phase vectors...",
  "Optimizing React 19 concurrent fiber roots...",
  "Checking Qubit stability matrix...",
  "Compiling Aetheric assets to WEBP/AVIF...",
];

const SystemArchitectureScanner: React.FC<{ activeStepId: string; foundDefect: boolean }> = ({ activeStepId, foundDefect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
            }
        });
        resizeObserver.observe(container);

        let animationFrame: number;
        let time = 0;

        // Volumetric Point Cloud
        const pointCount = 400;
        const points = Array.from({ length: pointCount }).map(() => ({
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            z: (Math.random() - 0.5) * 400,
            verified: false
        }));

        const project = (x: number, y: number, z: number, w: number, h: number) => {
            const scale = 600 / (600 + z);
            return {
                x: w / 2 + x * scale,
                y: h / 2 + y * scale,
                scale
            };
        };

        const rotateY = (x: number, z: number, angle: number) => ({
            x: x * Math.cos(angle) - z * Math.sin(angle),
            z: x * Math.sin(angle) + z * Math.cos(angle)
        });

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;
            time += 0.01;
            
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, w, h);

            // Scanning Beam
            const scanY = Math.sin(time * 2) * 200;

            points.forEach(p => {
                let { x, z } = rotateY(p.x, p.z, time * 0.5);
                const projected = project(x, p.y, z, w, h);
                
                // Verify logic
                if (Math.abs(p.y - scanY) < 10) p.verified = true;
                if (Math.random() > 0.995) p.verified = false; // Entropy decay

                const alpha = (projected.scale * 0.5) + 0.1;
                const size = projected.scale * 2;

                ctx.beginPath();
                ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
                
                if (foundDefect && Math.random() > 0.9) {
                    ctx.fillStyle = '#f43f5e'; // Defect Red
                } else if (p.verified) {
                    ctx.fillStyle = `rgba(163, 230, 53, ${alpha})`; // Verified Green/Gold
                } else {
                    ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.5})`; // Unverified Slate
                }
                ctx.fill();
            });

            // Draw Beam
            const beamProjStart = project(-200, scanY, 0, w, h);
            const beamProjEnd = project(200, scanY, 0, w, h);
            
            ctx.beginPath();
            ctx.moveTo(0, beamProjStart.y);
            ctx.lineTo(w, beamProjEnd.y);
            ctx.strokeStyle = foundDefect ? 'rgba(244, 63, 94, 0.5)' : 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = foundDefect ? '#f43f5e' : '#ffd700';
            ctx.stroke();
            ctx.shadowBlur = 0;

            // HUD Elements
            ctx.font = '10px "JetBrains Mono"';
            ctx.fillStyle = '#ffd700';
            ctx.fillText(`SCAN_DEPTH: ${scanY.toFixed(2)}`, 20, 20);
            ctx.fillText(`ENTROPY_DETECT: ${foundDefect ? 'CRITICAL' : 'NOMINAL'}`, 20, 35);

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, [foundDefect]);

    return (
        <div ref={containerRef} className="bg-black/80 border border-white/5 p-4 rounded-sm relative overflow-hidden h-64 lg:h-80 group shadow-inner z-10 w-full transition-colors duration-500 hover:border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.1)_0%,transparent_70%)] pointer-events-none" />
            <canvas ref={canvasRef} className="w-full h-full block relative z-10 mix-blend-screen" />
            {foundDefect && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-red-500/20 border border-red-500/50 px-4 py-2 text-red-100 font-orbitron text-xs font-bold tracking-widest animate-pulse backdrop-blur-md">
                        ⚠ QUANTUM FRACTURE DETECTED
                    </div>
                </div>
            )}
        </div>
    );
};

export const DeepDiagnosticOverlay: React.FC<DeepDiagnosticOverlayProps> = ({ onClose, onComplete, systemState, sophiaEngine, audioEngine, onReportGenerated }) => {
  const [steps, setSteps] = useState<DiagnosticStep[]>(QUANTUM_AUDIT_SEQUENCE);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [diagnosticStatus, setDiagnosticStatus] = useState<DiagnosticStatus>('SCANNING');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["INIT QUANTUM AUDIT v4.1-RADIANT...", "TARGET: KERNEL_LATENCY_OPTIMIZATION", "BENCHMARK_PROTOCOL: ACTIVE"]);
  const [auditReport, setAuditReport] = useState<{ report: string; sources: any[] } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [foundDefect, setFoundDefect] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (diagnosticStatus === 'COMPLETED') return;

    const runScan = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (!isMounted.current) return;
        
        setActiveStepIdx(i);
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'ACTIVE' } : s));
        audioEngine?.playUIClick();
        
        const triggerDefect = (i === 5 || i === 3) && Math.random() > 0.6; 
        
        const iterations = 12; 
        for (let p = 0; p <= iterations; p++) {
          if (!isMounted.current) return;
          const progress = (p / iterations) * 100;
          await new Promise(r => setTimeout(r, 60 + Math.random() * 60));
          
          if (!isMounted.current) return;
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress } : s));
          
          if (triggerDefect && p === 8 && !foundDefect) {
              setFoundDefect(true);
              audioEngine?.playAlarm();
              setTerminalOutput(prev => [...prev.slice(-50), `[WARN] ENTROPY SPIKE DETECTED IN ${steps[i].label.split(' ')[0]}`, `[AUTO-FIX] INITIATING CAUSAL PATCH...`]);
              await new Promise(r => setTimeout(r, 800));
              if (!isMounted.current) return;
              setFoundDefect(false);
              audioEngine?.playPurgeEffect();
              setTerminalOutput(prev => [...prev.slice(-50), `[SUCCESS] PATCH APPLIED. PARITY RESTORED.`]);
          }

          if (Math.random() > 0.4) {
             const msg = SCAN_TELEMETRY[Math.floor(Math.random() * SCAN_TELEMETRY.length)];
             setTerminalOutput(prev => [...prev.slice(-50), `[${steps[i].id.toUpperCase()}] ${msg}`]);
          }
        }

        if (!isMounted.current) return;
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'SUCCESS', progress: 100 } : s));
        setTerminalOutput(prev => [...prev, `[SUCCESS] ${steps[i].id} benchmark verified.`]);

        if (steps[i].id === 'audit_logic' && sophiaEngine) {
            setIsAuditing(true);
            setTerminalOutput(prev => [...prev, "[SOPHIA] Initiating 32k token deep intellectual synthesis..."]);
            const report = await sophiaEngine.performSystemAudit(systemState);
            if (!isMounted.current) return;
            setAuditReport(report);
            if (onReportGenerated) onReportGenerated(report);
            setIsAuditing(false);
            setTerminalOutput(prev => [...prev, "[SUCCESS] Performance heuristic audit report generated."]);
        }
      }

      setDiagnosticStatus('PARITY_CHECK');
      setTerminalOutput(prev => [...prev, "--- SYSTEM PERFORMANCE OPTIMIZED ---", `ESTABLISHING GLOBAL PARITY LOCK AT ${systemState.resonanceFactorRho.toFixed(4)} GHz...`]);
      await new Promise(r => setTimeout(r, 1000));
      if (!isMounted.current) return;
      setDiagnosticStatus('COMPLETED');
      audioEngine?.playAscensionChime(); 
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
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden bg-[radial-gradient(circle_at_center,rgba(76,29,149,0.15)_0%,transparent_80%)]">
        <div className="grid grid-cols-12 gap-8 h-full text-[6px] leading-tight text-violet-500/20">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="animate-[pulse_4s_infinite]" style={{ animationDelay: `${i * 0.1}s` }}>
              {Math.random().toString(36).repeat(20)}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col gap-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-violet-500 rounded-full animate-ping shadow-[0_0_10px_#8b5cf6]" />
                <h1 className="font-orbitron text-3xl md:text-5xl text-pearl tracking-tighter uppercase font-bold text-glow-violet">Quantum Interference Audit</h1>
            </div>
            <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] font-bold">Node_SFO_CORE // Deep Causal Scan // Grade_S++</p>
          </div>
          <div className="hidden md:block">
            <div className={`px-8 py-3 rounded-sm border-2 text-[12px] font-bold tracking-[0.3em] transition-all duration-1000 ${
              diagnosticStatus === 'COMPLETED' ? 'border-green-500/60 text-green-400 bg-green-950/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-violet-500/40 text-violet-300 bg-violet-950/10 animate-pulse'
            }`}>
              {diagnosticStatus === 'COMPLETED' ? 'PARITY_VERIFIED' : 'QUANTUM_SCAN_ACTIVE'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
          <div className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto pr-6 scrollbar-thin relative z-20">
            <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mb-4">Benchmark Registry</h4>
            {steps.map((step, i) => (
              <div key={step.id} className={`p-5 rounded-sm border transition-all duration-500 group ${
                step.status === 'ACTIVE' ? 'border-violet-500 text-violet-200 bg-violet-950/20 scale-[1.02] shadow-[0_0_30px_rgba(139,92,246,0.1)]' : 
                step.status === 'SUCCESS' ? 'border-green-500/20 bg-green-950/10 opacity-70' : 
                'border-white/5 bg-black/40 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${step.status === 'ACTIVE' ? 'text-violet-300' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] font-mono opacity-80">{step.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-300 ease-out ${step.status === 'SUCCESS' ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : foundDefect && step.status === 'ACTIVE' ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-violet-500 shadow-[0_0_8px_#8b5cf6]'}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}

            {auditReport && (
                <div className="mt-6 p-6 bg-gold/5 border border-gold/30 rounded animate-fade-in shadow-2xl relative overflow-hidden z-20">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold/40" />
                    <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.4em] mb-6 border-b border-gold/10 pb-3 font-bold">Formal Heuristic Conclusion</h4>
                    <div className="text-[12px] text-pearl/80 leading-relaxed font-minerva italic audit-report-content space-y-4 select-text" dangerouslySetInnerHTML={{ __html: auditReport.report }} />
                </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 min-h-0 relative z-20">
            <SystemArchitectureScanner activeStepId={steps[activeStepIdx].id} foundDefect={foundDefect} />
            
            <div 
              ref={terminalRef}
              className="flex-1 bg-black/90 border border-white/10 rounded-sm p-8 overflow-y-auto scrollbar-thin shadow-2xl relative font-mono text-[11px] select-text z-20"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/60" />
              {terminalOutput.map((line, i) => (
                <div key={i} className="leading-relaxed mb-2 flex gap-6 group">
                  <span className="text-slate-700 font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">0x{(i * 4).toString(16).padStart(4, '0')}</span>
                  <span className={line.includes('[SUCCESS]') ? 'text-green-400 font-bold' : line.includes('SOPHIA') ? 'text-gold italic' : line.includes('[WARN]') ? 'text-red-400 font-bold' : line.includes('[AUTO-FIX]') ? 'text-blue-400' : line.includes('QUANTUM') || line.includes('CHRONON') ? 'text-violet-300' : 'text-pearl/70'}>
                    {line}
                  </span>
                </div>
              ))}
              {(diagnosticStatus !== 'COMPLETED' || isAuditing) && (
                <div className="flex items-center gap-3 mt-6 animate-pulse text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold">
                    {isAuditing ? 'SOPHIA_COG_BUDGET_EXECUTING [MAX_PARITY]...' : 'EXECUTING_QUANTUM_SWEEP...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {diagnosticStatus === 'COMPLETED' && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999] bg-black/90 backdrop-blur-3xl animate-fade-in perspective-1000">
              <div className="relative group perspective-1000">
                  <div className="bg-[#050505] border border-gold/40 w-[500px] h-[700px] p-12 rounded-sm shadow-[0_0_150px_rgba(255,215,0,0.2)] text-center animate-scale-in relative overflow-hidden transform-gpu transition-transform hover:rotate-x-12 hover:rotate-y-12">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,215,0,0.05)_0%,transparent_50%,rgba(255,215,0,0.05)_100%)] pointer-events-none" />
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffd700 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                      
                      <div className="absolute top-0 right-0 p-6 opacity-20 font-orbitron text-9xl text-gold font-black select-none pointer-events-none -mr-16 -mt-16 rotate-12">S</div>
                      
                      <div className="w-24 h-24 border-4 border-double border-gold rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_gold] animate-pulse bg-gold/10 relative z-10">
                          <svg className="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      
                      <div className="relative z-10 space-y-6">
                          <div>
                              <h2 className="text-4xl font-orbitron text-white font-bold tracking-tighter text-glow-pearl uppercase">Scan Verified</h2>
                              <p className="text-gold font-mono text-[10px] uppercase tracking-[0.6em] mt-2 font-bold">Certificate of Integrity</p>
                          </div>
                          
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent my-8" />

                          <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-left text-[11px] font-mono text-slate-400 mb-12">
                              <div className="flex flex-col gap-1">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Files Scanned</span>
                                  <span className="text-cyan-400 font-bold text-sm">48 MODULES</span>
                              </div>
                              <div className="flex flex-col gap-1 text-right">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Quantum Grade</span>
                                  <span className="text-violet-400 font-bold text-sm">S++</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Latency</span>
                                  <span className="text-pearl font-bold text-sm">{(systemState.performance.logicalLatency * 1000).toFixed(2)}ms</span>
                              </div>
                              <div className="flex flex-col gap-1 text-right">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Status</span>
                                  <span className="text-emerald-400 font-black text-xl shadow-green-glow">OPTIMAL</span>
                              </div>
                          </div>
                          
                          <button onClick={() => { onComplete(); onClose(); }} className="w-full py-5 bg-gold/10 border border-gold text-gold font-orbitron font-black uppercase tracking-[0.25em] hover:bg-gold hover:text-black transition-all shadow-[0_0_40px_rgba(255,215,0,0.2)] active:scale-95 text-[12px] relative overflow-hidden group/btn">
                              <span className="relative z-10">Return to Sanctum</span>
                              <div className="absolute inset-0 bg-gold/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
      
      <style>{`
        .audit-report-content h3 { color: var(--gold); font-family: 'Orbitron'; font-size: 11px; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(230, 199, 127, 0.2); padding-bottom: 0.25rem; font-weight: bold; }
        .audit-report-content p { margin-bottom: 1rem; }
        .audit-report-content ul { margin-left: 1.5rem; list-style: square; margin-bottom: 1rem; }
        .audit-report-content li { margin-bottom: 0.5rem; }
        .audit-report-content b { color: var(--gold); }
        .perspective-1000 { perspective: 1000px; }
        .shadow-green-glow { text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
      `}</style>
    </div>
  );
};
