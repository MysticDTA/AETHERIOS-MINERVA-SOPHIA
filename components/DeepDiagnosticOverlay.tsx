
import React, { useState, useEffect, useRef } from 'react';
import { DiagnosticStep, DiagnosticStatus, SystemState } from '../types';
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
            ctx.strokeStyle = foundDefect ? 'rgba(244, 63, 94, 0.5)' : 'rgba(16, 185, 129, 0.5)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = foundDefect ? '#f43f5e' : '#10b981';
            ctx.stroke();
            ctx.shadowBlur = 0;

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, [foundDefect]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black/80 rounded-lg border border-white/10 shadow-inner">
            <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-500 uppercase tracking-widest z-10 flex gap-2">
                <span>Scanner_Active:</span>
                <span className="text-white">{activeStepId.toUpperCase()}</span>
            </div>
            <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mix-blend-screen" />
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

    useEffect(() => {
        if (!isScanning) return;

        let timeout: ReturnType<typeof setTimeout>;

        const processStep = async () => {
            if (currentStepIndex >= steps.length) {
                setIsScanning(false);
                setTelemetry("AUDIT_COMPLETE. COMPILING_REPORT...");
                
                if (sophiaEngine && onReportGenerated) {
                    const report = await sophiaEngine.performSystemAudit(systemState);
                    onReportGenerated(report);
                }
                
                audioEngine?.playAscensionChime();
                setTimeout(onComplete, 1000);
                return;
            }

            const currentStep = steps[currentStepIndex];
            
            // Mark step as active
            setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'ACTIVE' } : s));
            setTelemetry(SCAN_TELEMETRY[currentStepIndex % SCAN_TELEMETRY.length]);
            
            if (currentStepIndex % 3 === 0) audioEngine?.playUIClick();

            const duration = 600 + Math.random() * 800; // Simulated work time
            
            timeout = setTimeout(() => {
                // Mark step as success
                setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'SUCCESS', progress: 100 } : s));
                
                // Heal system during audit (Quantum Repair)
                if (setSystemState) {
                    setSystemState(prev => ({
                        ...prev,
                        quantumHealing: { 
                            ...prev.quantumHealing, 
                            health: Math.min(1, prev.quantumHealing.health + 0.05),
                            decoherence: Math.max(0, prev.quantumHealing.decoherence - 0.05)
                        },
                        resonanceFactorRho: Math.min(1, prev.resonanceFactorRho + 0.01)
                    }));
                }

                setCurrentStepIndex(prev => prev + 1);
            }, duration);
        };

        processStep();

        return () => clearTimeout(timeout);
    }, [currentStepIndex, isScanning, steps.length, sophiaEngine, systemState, onReportGenerated, onComplete, audioEngine, setSystemState]);

    return (
        <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex flex-col p-6 md:p-10 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-emerald-500 rounded-full flex items-center justify-center animate-spin-slow">
                        <span className="font-mono text-emerald-500 font-bold">+</span>
                    </div>
                    <div>
                        <h2 className="font-orbitron text-2xl md:text-3xl text-pearl uppercase tracking-tighter font-black">Deep Diagnostic Scan</h2>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Protocol: HEURISTIC_PURGE_V9</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white font-mono text-xs uppercase border border-white/10 px-4 py-2 rounded hover:bg-white/5 transition-all">Cancel</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Left: Visualizer */}
                <div className="flex flex-col gap-4 min-h-0">
                    <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                        <SystemArchitectureScanner activeStepId={steps[currentStepIndex]?.id || 'COMPLETE'} foundDefect={false} />
                    </div>
                    <div className="bg-black/60 border border-white/10 p-4 rounded font-mono text-[10px] text-emerald-400 h-32 overflow-y-auto scrollbar-thin shadow-inner">
                        <p className="mb-1 text-slate-500 opacity-50">{'>'} SYSTEM_ROOT_ACCESS_GRANTED</p>
                        <p className="mb-1 text-slate-500 opacity-50">{'>'} INIT_DIAGNOSTIC_DAEMON_V9</p>
                        <p className="mb-1 text-slate-500 opacity-50">{'>'} MOUNTING_LOGIC_SHARDS...</p>
                        <p className="animate-pulse text-pearl font-bold">{'>'} {telemetry}</p>
                    </div>
                </div>

                {/* Right: Step List */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-1 overflow-y-auto scrollbar-thin">
                    <div className="space-y-1">
                        {steps.map((step, idx) => (
                            <div key={step.id} className={`px-4 py-3 border-l-2 flex justify-between items-center transition-all ${
                                step.status === 'ACTIVE' 
                                ? 'bg-emerald-900/10 border-emerald-500 text-emerald-300' 
                                : step.status === 'SUCCESS' 
                                    ? 'bg-black/20 border-slate-700 text-slate-500 opacity-60' 
                                    : 'bg-transparent border-transparent text-slate-700'
                            }`}>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">{step.label}</span>
                                    <span className="text-[8px] font-mono opacity-60">ID: {step.id.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {step.status === 'ACTIVE' && <span className="animate-spin text-[10px]">⟳</span>}
                                    {step.status === 'SUCCESS' && <span className="text-emerald-500 text-[10px]">VERIFIED</span>}
                                    {step.status === 'PENDING' && <span className="text-[10px] opacity-20">PENDING</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
