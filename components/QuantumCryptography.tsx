
import React, { useEffect, useRef, useState, useMemo } from 'react';

interface Photon {
    id: number;
    x: number;
    y: number;
    polarization: 0 | 45 | 90 | 135; // 0/90 = Rectilinear (+), 45/135 = Diagonal (x)
    basis: '+' | 'x';
    bit: 0 | 1;
    intercepted: boolean;
    color: string;
}

const CHANNEL_LENGTH = 600;
const SPEED = 4;

export const QuantumCryptography: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [eavesdropperActive, setEavesdropperActive] = useState(false);
    
    // Metrics
    const [siftedKey, setSiftedKey] = useState<string>("");
    const [totalBits, setTotalBits] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [qber, setQber] = useState(0); // Quantum Bit Error Rate

    // Refs for animation loop
    const photonsRef = useRef<Photon[]>([]);
    const frameIdRef = useRef<number>(0);

    // Color mapping
    const COLORS = {
        0: '#60a5fa',   // Blue (Horizontal)
        90: '#3b82f6',  // Dark Blue (Vertical)
        45: '#a78bfa',  // Violet (Diagonal /)
        135: '#d946ef', // Pink (Diagonal \)
    };

    useEffect(() => {
        if (!isGenerating) {
            cancelAnimationFrame(frameIdRef.current);
            return;
        }

        const spawnPhoton = () => {
            if (Math.random() > 0.1) return; // Control density

            const bit = Math.random() > 0.5 ? 1 : 0;
            const basis = Math.random() > 0.5 ? '+' : 'x';
            let polarization: 0 | 45 | 90 | 135 = 0;

            if (basis === '+') polarization = bit === 0 ? 0 : 90;
            else polarization = bit === 0 ? 45 : 135;

            const newPhoton: Photon = {
                id: Date.now() + Math.random(),
                x: 50, // Start at Alice
                y: 150, // Center Y
                polarization,
                basis,
                bit,
                intercepted: false,
                color: COLORS[polarization]
            };
            photonsRef.current.push(newPhoton);
        };

        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Channel
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(50, 150);
            ctx.lineTo(canvas.width - 50, 150);
            ctx.stroke();

            // Spawn
            spawnPhoton();

            // Update Photons
            for (let i = photonsRef.current.length - 1; i >= 0; i--) {
                const p = photonsRef.current[i];
                p.x += SPEED;

                // Eavesdropper Logic (Interception at 50% distance)
                if (eavesdropperActive && !p.intercepted && p.x > canvas.width / 2 - 20 && p.x < canvas.width / 2 + 20) {
                    p.intercepted = true;
                    // Eve measures in random basis
                    const eveBasis = Math.random() > 0.5 ? '+' : 'x';
                    if (eveBasis !== p.basis) {
                        // Collapse state to wrong basis (50% chance to flip bit when Bob measures later)
                        // Visually change color to indicate "touch"
                        p.color = '#ef4444'; // Red flag
                    }
                }

                // Bob Reception
                if (p.x > canvas.width - 50) {
                    // Bob chooses basis
                    const bobBasis = Math.random() > 0.5 ? '+' : 'x';
                    
                    if (bobBasis === p.basis) {
                        // Bases match! Sift this bit.
                        let receivedBit = p.bit;
                        
                        // If Eve intercepted with WRONG basis, 50% chance bit flipped
                        if (p.intercepted && p.color === '#ef4444' && Math.random() > 0.5) {
                            receivedBit = p.bit === 0 ? 1 : 0;
                        }

                        // Add to key stats
                        setTotalBits(prev => prev + 1);
                        if (receivedBit !== p.bit) {
                            setErrorCount(prev => prev + 1); // Error detected (Eve!)
                        } else {
                            setSiftedKey(prev => (prev + receivedBit).slice(-128)); // Keep last 128 chars
                        }
                    }

                    // Remove photon
                    photonsRef.current.splice(i, 1);
                    continue;
                }

                // Draw Photon
                ctx.save();
                ctx.translate(p.x, p.y + Math.sin(p.x * 0.05) * 10); // Wave motion
                ctx.rotate((p.polarization * Math.PI) / 180);
                
                // Glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                
                // Particle shape representing polarization
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-6, 0);
                ctx.lineTo(6, 0);
                ctx.stroke();
                
                // Arrow head
                if (p.polarization === 90 || p.polarization === 135) {
                    ctx.beginPath(); ctx.moveTo(6,0); ctx.lineTo(3, -3); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(6,0); ctx.lineTo(3, 3); ctx.stroke();
                }

                ctx.restore();
            }

            // Draw Eve Indicator
            if (eavesdropperActive) {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
                ctx.beginPath();
                ctx.arc(canvas.width / 2, 150, 40, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fca5a5';
                ctx.font = '10px monospace';
                ctx.fillText("EVE ACTIVE", canvas.width / 2 - 25, 100);
            }

            frameIdRef.current = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameIdRef.current);
    }, [isGenerating, eavesdropperActive]);

    // Update QBER
    useEffect(() => {
        if (totalBits > 0) {
            setQber((errorCount / totalBits) * 100);
        }
    }, [totalBits, errorCount]);

    return (
        <div className="w-full h-full flex flex-col gap-6">
            {/* Control Deck */}
            <div className="flex justify-between items-end bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="flex gap-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Protocol</span>
                        <h3 className="font-orbitron text-xl text-pearl font-bold">BB84_QKD</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Secure_Bitrate</span>
                        <h3 className="font-orbitron text-xl text-cyan-400 font-bold">{isGenerating ? (Math.random() * 2 + 4).toFixed(1) : 0} <span className="text-sm">kbps</span></h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">QBER (Error)</span>
                        <h3 className={`font-orbitron text-xl font-bold ${qber > 15 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                            {qber.toFixed(2)}%
                        </h3>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setEavesdropperActive(!eavesdropperActive)}
                        className={`px-6 py-2 rounded-sm border font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                            eavesdropperActive 
                            ? 'bg-rose-900/40 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                            : 'bg-black/40 border-slate-700 text-slate-500 hover:text-rose-400 hover:border-rose-500/50'
                        }`}
                    >
                        {eavesdropperActive ? 'EVE INTERCEPTING' : 'Simulate Attack'}
                    </button>
                    <button
                        onClick={() => setIsGenerating(!isGenerating)}
                        className={`px-8 py-2 rounded-sm border font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                            isGenerating 
                            ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' 
                            : 'bg-gold/10 border-gold/50 text-gold hover:bg-gold hover:text-black'
                        }`}
                    >
                        {isGenerating ? 'Stop Transmission' : 'Generate Key'}
                    </button>
                </div>
            </div>

            {/* Visualization Canvas */}
            <div className="flex-1 bg-black/60 rounded-xl border border-white/5 relative overflow-hidden shadow-inner flex flex-col justify-center">
                <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                    Alice (Sender) ------------------------ Quantum Channel ------------------------ Bob (Receiver)
                </div>
                
                <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
                
                {/* Basis Labels Overlay */}
                <div className="absolute inset-0 pointer-events-none flex justify-between px-12 items-center opacity-30">
                    <div className="w-16 h-32 border-l border-white border-dashed"></div>
                    <div className="w-16 h-32 border-r border-white border-dashed"></div>
                </div>
            </div>

            {/* Sifted Key Output */}
            <div className="bg-[#050505] border border-white/10 p-4 rounded-lg font-mono text-[10px] relative overflow-hidden h-24">
                <div className="absolute top-2 right-2 text-slate-600 text-[8px] uppercase tracking-widest">Sifted_Secret_Key_Buffer</div>
                <div className="break-all text-emerald-500/80 leading-relaxed tracking-wider">
                    {siftedKey || <span className="opacity-30 text-slate-500">INITIATE_QUANTUM_DISTRIBUTION_TO_GENERATE_ENTROPY...</span>}
                    <span className="animate-blink inline-block w-2 h-4 bg-emerald-500 ml-1 align-middle"></span>
                </div>
            </div>
        </div>
    );
};
