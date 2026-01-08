
import React, { useEffect, useState, useRef } from 'react';
import { SystemState } from '../types';

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

    useEffect(() => {
        const interval = setInterval(() => {
            setLogIndex(prev => (prev + 1) % QUANTUM_LOGS.length);
            setDisplayedLog(QUANTUM_LOGS[Math.floor(Math.random() * QUANTUM_LOGS.length)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        const render = () => {
            time += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const radius = 30;

            // Core
            ctx.beginPath();
            ctx.arc(cx, cy, 10 + Math.sin(time) * 2, 0, Math.PI * 2);
            ctx.fillStyle = isThinking ? '#a78bfa' : '#ffd700'; // Violet if thinking, Gold otherwise
            ctx.fill();
            ctx.shadowBlur = 15;
            ctx.shadowColor = isThinking ? '#a78bfa' : '#ffd700';
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Orbitals
            for(let i = 0; i < 3; i++) {
                ctx.beginPath();
                const angle = time * (1 + i * 0.5) + (i * Math.PI * 2 / 3);
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                
                ctx.ellipse(cx, cy, radius, radius * 0.4, angle, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + (i * 0.1)})`;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }

            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [isThinking]);

    if (!isActive) return null;

    return (
        <div className="fixed top-24 right-4 z-40 w-48 bg-black/60 border border-white/10 rounded-lg backdrop-blur-xl p-3 flex flex-col gap-3 shadow-2xl animate-fade-in pointer-events-none">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[8px] font-mono text-gold uppercase tracking-[0.2em] font-bold">Quantum_Core</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-violet-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
            
            <div className="flex gap-3 items-center">
                <div className="w-16 h-16 relative">
                    <canvas ref={canvasRef} width={64} height={64} />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Status</span>
                    <span className={`text-[9px] font-orbitron font-bold ${isThinking ? 'text-violet-300' : 'text-pearl'}`}>
                        {isThinking ? 'REASONING' : 'ONLINE'}
                    </span>
                    <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-1">Rho_Sync</span>
                    <span className="text-[9px] font-mono text-cyan-400">{(systemState.resonanceFactorRho * 100).toFixed(1)}%</span>
                </div>
            </div>

            <div className="bg-white/5 p-2 rounded border border-white/5">
                <p className="text-[7px] font-mono text-slate-400 leading-relaxed uppercase tracking-tight">
                    {">"} {displayedLog}
                </p>
            </div>
        </div>
    );
};
