
import React, { useEffect, useRef, useState } from 'react';

const STEP_DESCRIPTIONS = [
    "PREPARE_PAYLOAD: Initializing Source Qubit |ψ⟩...",
    "ENTANGLE_PAIR: Generating Bell State |Φ⁺⟩...",
    "BELL_MEASUREMENT: Collapsing Alice's Qubits...",
    "CLASSICAL_TX: Transmitting 2 bits to Bob...",
    "CORRECTION: Applying Pauli Gates (X/Z)...",
    "TELEPORT_COMPLETE: State |ψ⟩ Transferred."
];

export const QuantumTeleportation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [step, setStep] = useState(0);
    const [isTeleporting, setIsTeleporting] = useState(false);
    const [fidelity, setFidelity] = useState(1.0);
    const [aliceState, setAliceState] = useState({ theta: Math.PI / 3, phi: Math.PI / 4 });
    const [bobState, setBobState] = useState({ theta: 0, phi: 0 }); // Bob starts at |0>

    // Animation control
    useEffect(() => {
        if (!isTeleporting) return;

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setStep(currentStep);
            
            if (currentStep === 5) { // Teleport complete
                setBobState(aliceState); // Copy state to Bob
                setFidelity(0.99 + Math.random() * 0.01); // Simulated high fidelity
                setIsTeleporting(false);
                setTimeout(() => setStep(0), 4000); // Reset delay
            }
        }, 1500); // 1.5s per step

        return () => clearInterval(interval);
    }, [isTeleporting, aliceState]);

    const drawBlochSphere = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, state: { theta: number, phi: number }, label: string, color: string, active: boolean) => {
        // Sphere
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.strokeStyle = active ? color : 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Equator
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.stroke();

        // Axis
        ctx.beginPath(); ctx.moveTo(x, y - radius); ctx.lineTo(x, y + radius); ctx.stroke(); // Z
        ctx.beginPath(); ctx.moveTo(x - radius, y); ctx.lineTo(x + radius, y); ctx.stroke(); // X

        // State Vector
        const vecX = radius * Math.sin(state.theta) * Math.cos(state.phi);
        const vecY3D = radius * Math.sin(state.theta) * Math.sin(state.phi);
        const vecZ = radius * Math.cos(state.theta);

        const px = x + vecX;
        const py = y - vecZ + (vecY3D * 0.3); // Simple orthographic-ish projection

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(px, py);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Vector Head
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.fillStyle = active ? '#fff' : '#64748b';
        ctx.font = '10px "Orbitron"';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + radius + 20);
    };

    const drawEntanglement = (ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, progress: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y);
        
        // Sine wave representing entanglement channel
        for (let i = 0; i <= 100; i++) {
            const px = x1 + (x2 - x1) * (i / 100);
            const py = y + Math.sin((i / 5) + Date.now() / 100) * 10 * Math.sin(Math.PI * (i/100)); // Envelope
            ctx.lineTo(px, py);
        }
        
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 + progress * 0.8})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    };

    const drawBits = (ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, progress: number) => {
        if (progress <= 0) return;
        const lx = x1 + (x2 - x1) * progress;
        ctx.fillStyle = '#ffd700';
        ctx.font = '12px monospace';
        ctx.fillText('1 0', lx, y - 20);
        
        ctx.beginPath();
        ctx.arc(lx, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Draw Alice
            drawBlochSphere(ctx, 100, cy, 50, aliceState, "ALICE |ψ⟩", '#f472b6', step < 3);

            // Draw Bob
            drawBlochSphere(ctx, w - 100, cy, 50, bobState, "BOB |ψ'⟩", '#60a5fa', step >= 4);

            // Visuals based on step
            if (step >= 1 && step < 3) {
                // Entanglement
                drawEntanglement(ctx, 150, w - 150, cy, 1);
            }

            if (step === 3) {
                // Classical Transmission
                const progress = (Date.now() % 1000) / 1000; 
                drawBits(ctx, 150, w - 150, cy - 60, progress);
                // Classical Line
                ctx.beginPath(); ctx.moveTo(150, cy - 60); ctx.lineTo(w - 150, cy - 60);
                ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1; ctx.stroke();
            }

            // Beam flash on complete
            if (step === 5) {
                ctx.fillStyle = 'rgba(96, 165, 250, 0.1)';
                ctx.fillRect(w - 160, cy - 60, 120, 120);
            }

            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [step, aliceState, bobState]);

    const randomizeState = () => {
        setAliceState({
            theta: Math.random() * Math.PI,
            phi: Math.random() * Math.PI * 2
        });
        setBobState({ theta: 0, phi: 0 }); // Reset Bob
        setStep(0);
    };

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <div className="flex justify-between items-end bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="flex gap-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Protocol</span>
                        <h3 className="font-orbitron text-xl text-pearl font-bold">Quantum_Teleportation</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Status</span>
                        <h3 className={`font-orbitron text-xl font-bold ${isTeleporting ? 'text-gold animate-pulse' : 'text-slate-300'}`}>
                            {isTeleporting ? 'TRANSMITTING...' : 'IDLE'}
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">State_Fidelity</span>
                        <h3 className="font-orbitron text-xl text-emerald-400 font-bold">{(fidelity * 100).toFixed(4)}%</h3>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={randomizeState}
                        disabled={isTeleporting}
                        className="px-6 py-2 rounded-sm border border-slate-700 text-slate-500 font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                    >
                        Randomize_Source
                    </button>
                    <button
                        onClick={() => setIsTeleporting(true)}
                        disabled={isTeleporting}
                        className="px-8 py-2 rounded-sm bg-violet-900/40 border border-violet-500 text-violet-300 font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-violet-800/40 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                    >
                        Initiate_Teleport
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-black/60 rounded-xl border border-white/5 relative overflow-hidden shadow-inner flex flex-col">
                <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500 uppercase tracking-widest z-10 flex flex-col gap-1">
                    <span>Protocol_Step: {step}/5</span>
                    <span className="text-pearl">{STEP_DESCRIPTIONS[step] || "READY"}</span>
                </div>
                
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
            </div>
        </div>
    );
};
