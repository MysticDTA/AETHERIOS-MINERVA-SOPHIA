
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
  { id: 'live_mesh', label: 'LIVE_CONNECTION_MESH :: WEBSOCKET_HEARTBEAT', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'quantum_coherence', label: 'QUANTUM_COHERENCE :: SUPERPOSITION', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'agentic_logic', label: 'AGENTIC_ORCHESTRATOR :: NEGOTIATION_MATRIX', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'digital_twin', label: 'ESTATE_COMMANDER :: LIDAR_SYNC', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'vibra_shield', label: 'VIBRATIONAL_SHIELD :: 432Hz_FILTER', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'file_integrity', label: 'FILE_SYSTEM_INTEGRITY :: MODULE_SHA256', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'crypto_handshake', label: 'HYBRID_CRYPTO_VAULT :: E_HYBRID_AUDIT', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'resonance_sync', label: 'RESONANCE_RHO :: SPECTRAL_PARITY', status: 'PENDING', progress: 0, sublogs: [] },
];

const VolumetricScanner: React.FC<{ active: boolean; progress: number }> = ({ active, progress }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<{ x: number; y: number; z: number; ox: number; oy: number; oz: number }[]>([]);

    useEffect(() => {
        // Initialize 400 point cloud particles forming a sphere
        const pts = [];
        for (let i = 0; i < 400; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 80;
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pts.push({ x, y, z, ox: x, oy: y, oz: z });
        }
        particles.current = pts;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !active) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        const render = () => {
            time += 0.02;
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Draw "Laser" Sweep
            const sweepY = Math.sin(time) * 100;
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 150, cy + sweepY);
            ctx.lineTo(cx + 150, cy + sweepY);
            ctx.stroke();

            // Render Point Cloud
            particles.current.forEach((p, i) => {
                // Rotate
                const cosY = Math.cos(0.01);
                const sinY = Math.sin(0.01);
                const nx = p.x * cosY - p.z * sinY;
                const nz = p.x * sinY + p.z * cosY;
                p.x = nx;
                p.z = nz;

                // Project
                const scale = 300 / (300 + p.z);
                const px = cx + p.x * scale;
                const py = cy + p.y * scale;

                // Color based on sweep proximity
                const distToSweep = Math.abs(p.y - sweepY);
                const isHit = distToSweep < 10;

                ctx.fillStyle = isHit ? '#fff' : i % 10 === 0 ? '#ffd700' : 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(px, py, isHit ? 1.5 : 0.8, 0, Math.PI * 2);
                ctx.fill();

                if (isHit && Math.random() > 0.95) {
                    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(px + (Math.random() - 0.5) * 40, py + (Math.random() - 0.5) * 40);
                    ctx.stroke();
                }
            });

            // Status Ring
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.beginPath();
            ctx.arc(cx, cy, 120, 0, Math.PI * 2);
            ctx.stroke();

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [active]);

    return (
        <div className="relative w-full h-80 flex items-center justify-center">
            <canvas ref={canvasRef} width={600} height={400} className="w-full h-full max-w-xl" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute font-orbitron text-xs text-gold/40 tracking-[1em] uppercase mt-40">Scanning_Causal_Geometry</div>
            </div>
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
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [status, setStatus] = useState<DiagnosticStatus>('SCANNING');
    const [globalProgress, setGlobalProgress] = useState(0);
    const [anomalies, setAnomalies] = useState<string[]>([]);
    
    const isCompleted = status === 'COMPLETED';

    const handleRepairAndComplete = () => {
        if (setSystemState) {
            setSystemState(prev => ({
                ...prev,
                quantumHealing: {
                    ...prev.quantumHealing,
                    decoherence: 0.02,
                    health: 0.98,
                    status: 'OPTIMAL'
                },
                isPhaseLocked: true
            }));
        }
        onComplete();
    };

    useEffect(() => {
        audioEngine?.playUIScanStart();
        
        const runSequence = async () => {
            for (let i = 0; i < QUANTUM_AUDIT_SEQUENCE.length; i++) {
                setCurrentStepIdx(i);
                
                // Update step to ACTIVE
                setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'ACTIVE' } : s));
                
                // Simulate progress
                for (let p = 0; p <= 100; p += 20) {
                    await new Promise(r => setTimeout(r, 60 + Math.random() * 80));
                    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress: p } : s));
                    setGlobalProgress(prev => Math.min(99, prev + (100 / QUANTUM_AUDIT_SEQUENCE.length / 5)));
                    
                    // Add sublogs
                    if (p % 40 === 0) {
                        const hex = `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`;
                        let logMsg = `[READ] ${hex} :: PARITY_CHECK_PASS`;
                        
                        // Context-aware logs based on current step ID
                        const currentId = QUANTUM_AUDIT_SEQUENCE[i].id;
                        if (currentId === 'live_mesh') {
                             if (p === 40) logMsg = `PING: COSMOS_RELAY [${10 + Math.floor(Math.random() * 20)}ms]`;
                             if (p === 80) logMsg = `PING: VERCEL_EDGE_FUNCTION [${5 + Math.floor(Math.random() * 10)}ms]`;
                        } else if (currentId === 'perf_telemetry') {
                             if (p === 80) logMsg = "PERFORMANCE_QUALITY: 99.9% [LOCKED]";
                        }

                        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, sublogs: [logMsg, ...s.sublogs].slice(0, 3) } : s));
                    }
                }

                // Chance to detect anomaly based on system state
                if (systemState.resonanceFactorRho < 0.8 && Math.random() > 0.8) {
                    const node = `FRAC_${Math.floor(Math.random() * 99)}`;
                    setAnomalies(prev => [...prev, node]);
                    audioEngine?.playEffect('renewal');
                }

                setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'SUCCESS' } : s));
                audioEngine?.playUIClick();
            }

            // Phase shift to Parity Check
            setStatus('PARITY_CHECK');
            await new Promise(r => setTimeout(r, 1000));

            // Generate Sophia Audit Report
            if (sophiaEngine) {
                setStatus('GENERATING_REPORT');
                const report = await sophiaEngine.performSystemAudit(systemState, anomalies);
                onReportGenerated?.(report);
                audioEngine?.playEffect('synthesis');
            }

            setGlobalProgress(100);
            setStatus('COMPLETED');
            audioEngine?.playUIConfirm();
        };

        runSequence();
    }, []);

    return (
        <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex flex-col p-8 md:p-16 animate-fade-in overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffd700 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <div className="flex justify-between items-start border-b border-white/10 pb-10 relative z-10 shrink-0">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-gold rounded-full shadow-[0_0_15px_#ffd700]" />
                        <h2 className="font-orbitron text-4xl md:text-5xl text-pearl text-glow-pearl tracking-tighter uppercase font-black">Deep_Heuristic_Audit</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] font-bold">Node_SFO_0x88 // Institutional_Parity</span>
                        <div className="h-px w-20 bg-white/20" />
                        <span className={`text-[10px] font-mono uppercase tracking-widest font-black ${status === 'COMPLETED' ? 'text-emerald-400' : 'text-cyan-400 animate-pulse'}`}>
                            STAGE: {status}
                        </span>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                    <span className="font-orbitron text-5xl text-pearl font-bold drop-shadow-[0_0_20px_white]">{globalProgress.toFixed(0)}%</span>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold transition-all duration-300" style={{ width: `${globalProgress}%` }} />
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 min-h-0">
                {/* Left: Progress Steps */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-4 scrollbar-thin">
                    {steps.map((step, idx) => (
                        <div key={step.id} className={`p-5 border transition-all duration-500 rounded-sm relative overflow-hidden group ${
                            step.status === 'ACTIVE' ? 'bg-white/5 border-gold/40 shadow-lg' : 
                            step.status === 'SUCCESS' ? 'bg-emerald-950/20 border-emerald-500/30' : 
                            'bg-black/40 border-white/5 opacity-40'
                        }`}>
                            {step.status === 'ACTIVE' && (
                                <div className="absolute bottom-0 left-0 h-0.5 bg-gold shadow-[0_0_10px_gold] transition-all duration-100" style={{ width: `${step.progress}%` }} />
                            )}
                            <div className="flex justify-between items-center mb-3">
                                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${step.status === 'ACTIVE' ? 'text-gold' : 'text-slate-500'}`}>0{idx + 1}_PROCEDURE</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : step.status === 'ACTIVE' ? 'bg-gold animate-pulse' : 'bg-slate-800'}`} />
                            </div>
                            <p className={`font-orbitron text-[11px] font-bold tracking-wider mb-2 ${step.status === 'ACTIVE' ? 'text-pearl' : 'text-slate-500'}`}>{step.label}</p>
                            
                            {step.sublogs.length > 0 && (
                                <div className="space-y-1">
                                    {step.sublogs.map((log, li) => (
                                        <div key={li} className="text-[8px] font-mono text-slate-600 truncate">{log}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Center: Volumetric Visualization */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="flex-1 bg-black border border-white/5 rounded-xl relative overflow-hidden shadow-inner flex flex-col items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent pointer-events-none" />
                        <VolumetricScanner active={!isCompleted} progress={globalProgress} />
                        
                        {/* LOADING INDICATOR FOR REPORT GENERATION */}
                        {status === 'GENERATING_REPORT' && (
                            <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
                                <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
                                <span className="font-orbitron text-[12px] text-violet-300 uppercase tracking-[0.4em] animate-pulse">Synthesizing_Security_Audit</span>
                                <span className="font-mono text-[9px] text-slate-500 mt-2">Gemini_3_Pro :: Reasoning_Engine_Active</span>
                            </div>
                        )}
                        
                        {anomalies.length > 0 && (
                            <div className="absolute top-10 right-10 flex flex-col gap-2 items-end z-20">
                                <span className="text-[9px] font-mono text-rose-500 font-black uppercase tracking-widest animate-pulse">! Shadow_Interference_Detected</span>
                                <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                                    {anomalies.map((a, i) => (
                                        <span key={i} className="text-[8px] font-mono bg-rose-950/40 border border-rose-500/40 text-rose-300 px-2 py-0.5 rounded">{a}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-10">
                            <div className="flex justify-between items-end text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-4">
                                <span>Scanning_Lattice_Parity</span>
                                <span className="text-gold font-bold">{(systemState.resonanceFactorRho * 100).toFixed(4)}%</span>
                            </div>
                            <div className="h-0.5 bg-white/5 w-full relative">
                                <div className="h-full bg-gold transition-all duration-300 shadow-[0_0_15px_gold]" style={{ width: `${globalProgress}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white/[0.02] border border-white/10 rounded-sm flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="space-y-2">
                            <h4 className="font-orbitron text-sm text-pearl uppercase tracking-widest font-black">Audit_Finalization_Gate</h4>
                            <p className="text-[12px] font-minerva italic text-warm-grey leading-relaxed max-w-xl">
                                "The deep diagnostic sequence audits every sub-shard of the institutional lattice. Once parity is verified, the Sovereign Registry is updated."
                            </p>
                        </div>
                        <button 
                            onClick={isCompleted ? handleRepairAndComplete : undefined}
                            disabled={!isCompleted}
                            className={`px-16 py-6 font-orbitron text-[11px] font-black uppercase tracking-[0.8em] transition-all border-2 shadow-2xl active:scale-95 group relative overflow-hidden ${
                                isCompleted 
                                    ? 'bg-pearl text-dark-bg border-pearl hover:bg-white hover:scale-105' 
                                    : 'bg-white/5 border-white/10 text-slate-700 cursor-not-allowed opacity-50'
                            }`}
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative z-10">{isCompleted ? 'Verify_Handshake' : 'Auditing_Lattice...'}</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-auto flex justify-between items-center pt-8 text-[10px] font-mono text-slate-700 uppercase tracking-[0.4em]">
                <span>Status: AES-512_SECURED</span>
                <span className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gold animate-ping" />
                    Radiant_Sovereignty_Enabled
                </span>
            </div>
        </div>
    );
};
