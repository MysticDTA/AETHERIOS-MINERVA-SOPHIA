
import React, { useEffect, useRef, useState } from 'react';

// Simulation Constants
const QUBIT_COUNT = 9; // 1 Logical Qubit = 9 Physical Qubits (Shor Code representation)
const RADIUS = 120;

export const QuantumErrorCorrection: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [syndrome, setSyndrome] = useState<string>("STABLE");
    const [errorRate, setErrorRate] = useState<number>(0.0);
    const [correctionEvents, setCorrectionEvents] = useState<number>(0);

    // Qubit State
    const qubitsRef = useRef(Array.from({ length: QUBIT_COUNT }).map((_, i) => ({
        id: i,
        angle: (i / QUBIT_COUNT) * Math.PI * 2,
        state: '0', // '0', '1', or 'ERR'
        phase: 0,
        isAncilla: i % 2 !== 0 // Alternate data and ancilla for visual variety
    })));

    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly introduce entropy (Bit Flip or Phase Flip)
            if (Math.random() > 0.8) {
                const targetIdx = Math.floor(Math.random() * QUBIT_COUNT);
                const target = qubitsRef.current[targetIdx];
                if (target.state !== 'ERR') {
                    target.state = 'ERR'; // Error introduced
                    setSyndrome(`DETECTED_ERR_Q${targetIdx}`);
                    setErrorRate(prev => Math.min(1.0, prev + 0.1));
                }
            }

            // QEC Cycle: Measure & Correct
            const errorIndices = qubitsRef.current
                .map((q, i) => q.state === 'ERR' ? i : -1)
                .filter(i => i !== -1);

            if (errorIndices.length > 0 && Math.random() > 0.4) {
                // Correct logic
                errorIndices.forEach(idx => {
                    qubitsRef.current[idx].state = '0'; // Stabilize
                });
                setSyndrome("CORRECTED");
                setErrorRate(prev => Math.max(0.0, prev - 0.2));
                setCorrectionEvents(prev => prev + 1);
            }

        }, 800);

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
            time += 0.02;
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Draw Logical Qubit Core
            const corePulse = Math.sin(time * 2) * 5;
            ctx.beginPath();
            ctx.arc(cx, cy, 30 + corePulse, 0, Math.PI * 2);
            ctx.fillStyle = errorRate > 0.5 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)';
            ctx.shadowBlur = 20;
            ctx.shadowColor = errorRate > 0.5 ? '#f43f5e' : '#10b981';
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = errorRate > 0.5 ? '#f43f5e' : '#10b981';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Physical Qubits
            qubitsRef.current.forEach((q, i) => {
                const x = cx + Math.cos(q.angle + time * 0.1) * RADIUS;
                const y = cy + Math.sin(q.angle + time * 0.1) * RADIUS;

                // Connection to Core (Entanglement)
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(x, y);
                ctx.strokeStyle = q.state === 'ERR' ? 'rgba(244, 63, 94, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.setLineDash(q.state === 'ERR' ? [5, 5] : []);
                ctx.stroke();
                ctx.setLineDash([]);

                // Qubit Body
                ctx.beginPath();
                ctx.arc(x, y, q.isAncilla ? 8 : 12, 0, Math.PI * 2);
                if (q.state === 'ERR') {
                    ctx.fillStyle = '#f43f5e'; // Red
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#f43f5e';
                } else {
                    ctx.fillStyle = q.isAncilla ? '#a78bfa' : '#67e8f9'; // Violet or Cyan
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
                ctx.shadowBlur = 0;

                // Label
                ctx.fillStyle = '#000';
                ctx.font = '8px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(q.isAncilla ? 'A' : 'D', x, y);
            });

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [errorRate]);

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
                <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Syndrome_Output</span>
                    <p className={`font-orbitron text-xl font-bold ${syndrome.includes('ERR') ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                        {syndrome}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Correction_Events</span>
                    <p className="font-orbitron text-xl text-pearl">{correctionEvents}</p>
                </div>
            </div>

            <div className="flex-1 bg-black/40 rounded-xl relative overflow-hidden border border-white/5 shadow-inner">
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
                <div className="absolute bottom-4 left-4 text-[9px] font-mono text-slate-600">
                    LOGICAL_QUBIT_01 // SHOR_CODE_9_QUBIT
                </div>
            </div>
        </div>
    );
};
