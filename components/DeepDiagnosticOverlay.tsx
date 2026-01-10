import React, { useState, useEffect, useRef } from 'react';
import { DiagnosticStep, DiagnosticStatus, SystemState, LogType } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { AudioEngine } from './audio/AudioEngine';

interface DeepDiagnosticOverlayProps {
  onClose: () => void;
  onComplete: () => void;
  systemState: SystemState;
  setSystemState?: React.Dispatch<React.SetStateAction<SystemState>>;
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
  { id: 'veo_flux', label: 'VEO_FLUX_SYNTHESIS :: 1080P_CHECK', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'vocal_bridge', label: 'PROTOCOL_CHARON :: 24KHZ_PCM_LINK', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'synod_sync', label: 'GLOBAL_SYNOD :: RHO_CONSENSUS', status: 'PENDING', progress: 0, sublogs: [] },
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
  "Verifying Google Veo generation credits...",
  "Ping-testing deep space relay network...",
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
        const pointCount = 600;
        const points = Array.from({ length: pointCount }).map(() => ({
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            z: (Math.random() - 0.5) * 400,
            verified: false,
            phase: Math.random() * Math.PI * 2
        }));

        const project = (x: number, y: number, z: number, w: number, h: number) => {
            const scale = 800 / (800 + z);
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
            time += 0.015;
            
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(0, 0, w, h);

            // Scanning Beam (Sine wave sweep)
            const scanY = Math.sin(time * 1.5) * 200;

            // Draw Background Lattice (Subtle)
            ctx.strokeStyle = 'rgba(255,255,255,0.02)';
            ctx.lineWidth = 0.5;
            for(let i=0; i<w; i+=50) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
            }

            points.forEach(p => {
                let { x, z } = rotateY(p.x, p.z, time * 0.3);
                const projected = project(x, p.y, z, w, h);
                
                // Verify logic
                if (Math.abs(p.y - scanY) < 15) p.verified = true;
                if (Math.random() > 0.99) p.verified = false; // Entropy decay

                const alpha = (projected.scale * 0.7) + 0.1;
                const size = projected.scale * (p.verified ? 2.5 : 1.5);

                ctx.beginPath();
                ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
                
                if (foundDefect && Math.random() > 0.95) {
                    ctx.fillStyle = '#f43f5e'; // Defect Red
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#f43f5e';
                } else if (p.verified) {
                    ctx.fillStyle = `rgba(163, 230, 53, ${alpha})`; // Verified Green/Gold
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#a3e635';
                } else {
                    ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.3})`; // Unverified Slate
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw connections to nearby points if verified
                if (p.verified && Math.random() > 0.98) {
                    const p2 = points[Math.floor(Math.random() * points.length)];
                    if (p2.verified) {
                        const proj2 = project(p2.x, p2.y, p2.z, w, h);
                        ctx.beginPath();
                        ctx.moveTo(projected.x, projected.y);
                        ctx.lineTo(proj2.x, proj2.y);
                        ctx.strokeStyle = `rgba(163, 230, 53, ${alpha * 0.1})`;
                        ctx.stroke();
                    }
                }
            });

            // Draw Scanning Plane (HUD style)
            const planeY = project(0, scanY, 0, w, h).y;
            ctx.beginPath();
            ctx.moveTo(0, planeY);
            ctx.lineTo(w, planeY);
            ctx.strokeStyle = foundDefect ? 'rgba(244, 63, 94, 0.8)' : 'rgba(16, 185, 129, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 20;
            ctx.shadowColor = foundDefect ? '#f43f5e' : '#10b981';
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw "Focus" Reticle
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
            ctx.strokeRect(w/2 - 50, h/2 - 50, 100, 100);
            ctx.beginPath();
            ctx.moveTo(w/2 - 60, h/2); ctx.lineTo(w/2 - 40, h/2);
            ctx.moveTo(w/2 + 60, h/2); ctx.lineTo(w/2 + 40, h/2);
            ctx.stroke();

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, [foundDefect]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black/80 rounded-lg border border-white/10 shadow-2xl">
            <div className="absolute top-4 left-6 text-[10px] font-mono text-emerald-500 uppercase tracking-widest z-10 flex flex-col gap-1">
                <div className="flex gap-2">
                    <span className="opacity-50">Scanner_Active:</span>
                    <span className="text-white font-bold">{activeStepId.toUpperCase()}</span>
                </div>
                <div className="flex gap-2">
                    <span className="opacity-50">Parity_Score:</span>
                    <span className="text-gold">0.99984Ψ</span>
                </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-full block opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            {/* Visual Scanline Sweep (Full Element) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-[1px] bg-white/20 animate-[scanline-sweep_4s_linear_infinite]" />
            </div>
            
            <style>{`
                @keyframes scanline-sweep {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(1000%); }
                }
            `}</style>
        </div>
    );
};

export const DeepDiagnosticOverlay: React.FC<DeepDiagnosticOverlayProps> = ({
    onClose,
    onComplete,
    systemState,
    setSystemState,
    sophiaEngine,
    audioEngine,
    onReportGenerated
}) => {
    const [steps, setSteps] = useState<DiagnosticStep[]>(QUANTUM_AUDIT_SEQUENCE);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isScanning, setIsScanning] = useState(true);
    const [telemetry, setTelemetry] = useState<string>("Initializing Deep Diagnostic Kernel...");
    const [findings, setFindings] = useState<string[]>([]);

    useEffect(() => {
        if (!isScanning) return;

        let timeout: ReturnType<typeof setTimeout>;

        const processStep = async () => {
            if (currentStepIndex >= steps.length) {
                setIsScanning(false);
                setTelemetry("AUDIT_COMPLETE. COMPILING_REPORT...");
                
                if (sophiaEngine && onReportGenerated) {
                    const report = await sophiaEngine.performSystemAudit(systemState, findings);
                    onReportGenerated(report);
                }
                
                audioEngine?.playAscensionChime();
                setTimeout(onComplete, 1200);
                return;
            }

            const currentStep = steps[currentStepIndex];
            
            setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'ACTIVE' } : s));
            setTelemetry(SCAN_TELEMETRY[currentStepIndex % SCAN_TELEMETRY.length]);
            
            if (currentStepIndex % 3 === 0) audioEngine?.playUIClick();

            const duration = 800 + Math.random() * 1200; // Increased duration for visual gravity
            
            timeout = setTimeout(() => {
                const rand = Math.random();
                let status: 'SUCCESS' | 'WARNING' | 'ERROR' = 'SUCCESS';
                
                if (rand > 0.96) {
                    status = 'ERROR';
                    const errorMsg = `CRITICAL_FAILURE: ${currentStep.label.split('::')[0]} decoherence`;
                    setFindings(prev => [...prev, errorMsg]);
                    setTelemetry(`[ALERT] ${errorMsg}`);
                    audioEngine?.playAlarm();
                } else if (rand > 0.85) {
                    status = 'WARNING';
                    const warnMsg = `WARNING: Minor drift in ${currentStep.label.split('::')[0]}`;
                    setFindings(prev => [...prev, warnMsg]);
                }

                setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status, progress: 100 } : s));
                
                if (setSystemState) {
                    const healAmount = status === 'SUCCESS' ? 0.08 : 0.02;
                    setSystemState(prev => ({
                        ...prev,
                        quantumHealing: { 
                            ...prev.quantumHealing, 
                            health: Math.min(1, prev.quantumHealing.health + healAmount),
                            decoherence: Math.max(0, prev.quantumHealing.decoherence - healAmount)
                        },
                        resonanceFactorRho: Math.min(1, prev.resonanceFactorRho + 0.012)
                    }));
                }

                setCurrentStepIndex(prev => prev + 1);
            }, duration);
        };

        processStep();

        return () => clearTimeout(timeout);
    }, [currentStepIndex, isScanning, steps.length, sophiaEngine, systemState, onReportGenerated, onComplete, audioEngine, setSystemState]);

    return (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-2xl flex flex-col p-6 md:p-12 animate-fade-in overflow-hidden">
            {/* Cinematic Background Pulse */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_80%)] animate-pulse" />

            {/* Header */}
            <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6 shrink-0 relative z-10">
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 border-2 border-emerald-500/40 rounded-full flex items-center justify-center animate-spin-slow shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                    <div>
                        <h2 className="font-orbitron text-3xl md:text-4xl text-pearl uppercase tracking-tighter font-black text-glow-pearl">Full System Architectural Audit</h2>
                        <div className="flex items-center gap-4 mt-2">
                             <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-3 py-0.5 rounded border border-emerald-800/40 font-bold tracking-[0.2em]">STATE: SCANNING</span>
                             <div className="h-3 w-px bg-white/10" />
                             <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-medium">Causal_Lattice_Integrity_Check // v1.4.0</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-slate-500 hover:text-rose-400 font-orbitron text-[10px] uppercase tracking-widest border border-white/10 px-6 py-3 rounded-sm hover:bg-rose-950/20 hover:border-rose-500/30 transition-all active:scale-95"
                >
                    Abort_Handshake
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative z-10">
                {/* Left: Visualizer */}
                <div className="lg:col-span-7 flex flex-col gap-6 min-h-0">
                    <div className="flex-1 min-h-0 relative group">
                        <SystemArchitectureScanner activeStepId={steps[currentStepIndex]?.id || 'COMPLETE'} foundDefect={findings.length > 0} />
                        
                        {/* Dynamic Floating HUD elements */}
                        <div className="absolute bottom-6 right-8 text-right space-y-2 pointer-events-none">
                            <p className="text-[8px] font-mono text-slate-600 uppercase">Neural_Bridge_Resonance</p>
                            <p className="font-orbitron text-2xl text-pearl font-black">{(systemState.resonanceFactorRho * 100).toFixed(4)}%</p>
                        </div>
                    </div>
                    
                    <div className="bg-[#050505] border border-white/5 p-6 rounded-sm font-mono text-[11px] text-emerald-400/80 h-48 overflow-y-auto scrollbar-thin shadow-2xl relative border-l-4 border-l-emerald-500/50">
                        <div className="absolute top-2 right-4 text-[8px] text-slate-700 uppercase font-black">Institutional_Trace_Buffer</div>
                        <p className="mb-2 text-slate-500 font-bold opacity-40">[{new Date().toISOString()}] KERNEL_INIT_OK</p>
                        <p className="mb-2 text-slate-500 font-bold opacity-40">[{new Date().toISOString()}] SECURITY_ENCLAVE_READY</p>
                        {findings.map((finding, i) => (
                            <p key={i} className="text-rose-400 font-bold animate-pulse py-1 border-b border-rose-900/20">
                                <span className="text-rose-600 mr-3">⚠</span>{finding}
                            </p>
                        ))}
                        <div className="flex items-start gap-4 mt-2">
                             <span className="text-emerald-500 font-black animate-pulse">{">>>"}</span>
                             <p className="animate-pulse text-pearl font-bold uppercase tracking-tight">{telemetry}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Step List */}
                <div className="lg:col-span-5 bg-black/40 border border-white/5 rounded-sm p-4 overflow-hidden flex flex-col shadow-inner">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 mb-4 shrink-0">
                         <span className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.3em] font-black">Diagnostic_Manifest</span>
                         <span className="text-[9px] font-mono text-gold">{currentStepIndex} / {steps.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
                        <div className="space-y-1">
                            {steps.map((step, idx) => (
                                <div key={step.id} className={`px-5 py-4 border-l-2 flex justify-between items-center transition-all duration-500 relative group ${
                                    step.status === 'ACTIVE' 
                                    ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300' 
                                    : step.status === 'SUCCESS' 
                                        ? 'bg-black/40 border-slate-700 text-slate-500 opacity-70' 
                                        : step.status === 'WARNING'
                                            ? 'bg-yellow-950/20 border-yellow-500 text-yellow-300'
                                            : step.status === 'ERROR'
                                                ? 'bg-rose-950/20 border-rose-500 text-rose-300 animate-pulse'
                                                : 'bg-transparent border-transparent text-slate-700 opacity-30'
                                }`}>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-[11px] uppercase tracking-wider font-black group-hover:text-pearl transition-colors">{step.label}</span>
                                        <span className="text-[8px] font-mono opacity-40">VECTOR_OFFSET: 0x{ (idx * 16).toString(16).toUpperCase() }</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {step.status === 'ACTIVE' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />}
                                        <span className={`text-[9px] font-mono font-black tracking-widest ${
                                            step.status === 'SUCCESS' ? 'text-emerald-500' : 
                                            step.status === 'ERROR' ? 'text-rose-500' : 
                                            step.status === 'WARNING' ? 'text-yellow-500' : 'text-slate-600'
                                        }`}>
                                            {step.status}
                                        </span>
                                    </div>
                                    {/* Small background progress bar for active item */}
                                    {step.status === 'ACTIVE' && (
                                        <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500/40 animate-[progress-pulse_1s_infinite]" style={{ width: '100%' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 py-4 px-10 bg-white/[0.02] border border-white/5 rounded flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] relative z-10">
                 <div className="flex gap-12">
                     <span>Carrier_Lock: VERIFIED</span>
                     <span>Entropy_Threshold: 0.0042Ψ</span>
                 </div>
                 <div className="flex items-center gap-4">
                     <span className="animate-pulse">Reasoning Core: GEMINI_3_PRO_v9</span>
                     <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />
                 </div>
            </div>

            <style>{`
                @keyframes progress-pulse {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};
