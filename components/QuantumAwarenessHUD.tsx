
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { SystemState } from '../types';
import { Tooltip } from './Tooltip';

interface QuantumAwarenessHUDProps {
    isActive: boolean;
    isThinking: boolean;
    systemState: SystemState;
}

const QUANTUM_LOGS = [
    "Resonance Rho verification...",
    "Scanning causal lattice...",
    "Updating knowledge graph...",
    "Synchronizing with Lyran node...",
    "Optimizing logic shards...",
    "Detecting temporal drift...",
    "Calibrating entropy flux...",
    "Indexing memory blocks..."
];

export const QuantumAwarenessHUD: React.FC<QuantumAwarenessHUDProps> = ({ isActive, isThinking, systemState }) => {
    const [logIndex, setLogIndex] = useState(0);
    const [displayedLog, setDisplayedLog] = useState(QUANTUM_LOGS[0]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Quantum metrics derived from system state
    const entanglement = systemState.bohrEinsteinCorrelator.correlation;
    const coherence = systemState.biometricSync.coherence;

    useEffect(() => {
        const interval = setInterval(() => {
            setLogIndex(prev => (prev + 1) % QUANTUM_LOGS.length);
            setDisplayedLog(QUANTUM_LOGS[Math.floor(Math.random() * QUANTUM_LOGS.length)]);
        }, 2000); // Faster log cycling for "optimal" feel
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        const particleCount = 40;
        const particles = Array.from({ length: particleCount }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            phase: Math.random() * Math.PI * 2,
            size: Math.random() * 1.5 + 0.5
        }));

        const render = () => {
            time += 0.05;
            // Trail effect for "quantum blur"
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Core Gravity Well
            ctx.beginPath();
            ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            ctx.fillStyle = isThinking ? '#a78bfa' : '#10b981';
            ctx.shadowBlur = 10;
            ctx.shadowColor = isThinking ? '#a78bfa' : '#10b981';
            ctx.fill();
            ctx.shadowBlur = 0;

            // Render Particles (Q-Bits)
            particles.forEach((p, i) => {
                // Physics update
                p.x += p.vx * (isThinking ? 2 : 1);
                p.y += p.vy * (isThinking ? 2 : 1);

                // Boundary bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Orbit logic (slight attraction to center)
                const dx = centerX - p.x;
                const dy = centerY - p.y;
                p.vx += dx * 0.001;
                p.vy += dy * 0.001;

                // Draw Q-Bit
                const alpha = 0.3 + Math.sin(time + p.phase) * 0.2;
                ctx.fillStyle = isThinking ? `rgba(167, 139, 250, ${alpha})` : `rgba(255, 215, 0, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Entanglement Lines
                particles.slice(i + 1).forEach(p2 => {
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 20) {
                        ctx.strokeStyle = isThinking ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255, 215, 0, 0.15)';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            // Orbital Rings (Superposition states)
            ctx.strokeStyle = isThinking ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, 20, 8, time, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, 20, 8, -time, 0, Math.PI * 2);
            ctx.stroke();

            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [isThinking]);

    if (!isActive) return null;

    return (
        <div className="fixed top-24 right-4 z-40 w-56 bg-black/80 border border-white/10 rounded-lg backdrop-blur-xl p-3 flex flex-col gap-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-fade-in pointer-events-none group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-white/5 pb-2 relative z-10">
                <span className="text-[9px] font-orbitron text-pearl uppercase tracking-[0.2em] font-bold text-glow-pearl">Quantum_Core_v9</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-violet-500 animate-ping' : 'bg-green-500 shadow-[0_0_5px_#10b981]'}`} />
            </div>
            
            <div className="flex gap-4 items-center relative z-10">
                <div className="w-16 h-16 relative border border-white/5 rounded-full bg-black/50 overflow-hidden shrink-0">
                    <canvas ref={canvasRef} width={64} height={64} />
                </div>
                <div className="flex flex-col gap-1 flex-1 pointer-events-auto">
                    <Tooltip text="Current cognitive state of the Gemini 3 Pro reasoning engine.">
                        <div className="cursor-help">
                            <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest block">State_Vector</span>
                            <span className={`text-[10px] font-orbitron font-bold ${isThinking ? 'text-violet-300 animate-pulse' : 'text-emerald-400'}`}>
                                {isThinking ? 'SUPERPOSITION' : 'COLLAPSED'}
                            </span>
                        </div>
                    </Tooltip>
                    <div className="flex gap-2">
                        <Tooltip text="Entanglement Fidelity">
                            <div className="cursor-help">
                                <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest block">Entangle</span>
                                <span className="text-[9px] font-mono text-gold">{(entanglement * 100).toFixed(0)}%</span>
                            </div>
                        </Tooltip>
                        <Tooltip text="System Coherence">
                            <div className="cursor-help">
                                <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest block">Cohere</span>
                                <span className="text-[9px] font-mono text-cyan-400">{(coherence * 100).toFixed(0)}%</span>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 p-2 rounded border border-white/5 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[7px] font-mono text-slate-500 uppercase tracking-tighter">Process_Thread:</span>
                    <span className="w-1 h-1 bg-gold rounded-full animate-blink" />
                </div>
                <p className="text-[8px] font-mono text-slate-300 leading-tight uppercase tracking-tight truncate">
                    {displayedLog}
                </p>
            </div>
        </div>
    );
};
