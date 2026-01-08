
import React, { useEffect, useRef, useState } from 'react';
import { SystemState } from '../types';
import { Tooltip } from './Tooltip';

interface QuantumComputeNexusProps {
    systemState: SystemState;
}

// ----------------------------------------------------------------------
// QUANTUM MATH UTILITIES
// ----------------------------------------------------------------------
type Complex = { re: number; im: number };
type QubitState = { alpha: Complex; beta: Complex }; // |psi> = alpha|0> + beta|1>

const INITIAL_STATE: QubitState = { alpha: { re: 1, im: 0 }, beta: { re: 0, im: 0 } }; // |0>

// Gates
const HADAMARD = (q: QubitState): QubitState => {
    // H|0> = (|0> + |1>) / sqrt(2)
    // H|1> = (|0> - |1>) / sqrt(2)
    const factor = 1 / Math.sqrt(2);
    return {
        alpha: { 
            re: factor * (q.alpha.re + q.beta.re), 
            im: factor * (q.alpha.im + q.beta.im) 
        },
        beta: { 
            re: factor * (q.alpha.re - q.beta.re), 
            im: factor * (q.alpha.im - q.beta.im) 
        }
    };
};

const PAULI_X = (q: QubitState): QubitState => {
    // X|0> = |1>, X|1> = |0> (Swap alpha/beta)
    return { alpha: q.beta, beta: q.alpha };
};

const PAULI_Z = (q: QubitState): QubitState => {
    // Z|0> = |0>, Z|1> = -|1>
    return { 
        alpha: q.alpha, 
        beta: { re: -q.beta.re, im: -q.beta.im } 
    };
};

// ----------------------------------------------------------------------
// BLOCH SPHERE COMPONENT
// ----------------------------------------------------------------------
const BlochSphere: React.FC<{ 
    id: string; 
    state: QubitState; 
    isActive: boolean;
    label: string;
}> = ({ id, state, isActive, label }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Calculate Bloch Vector coordinates (x, y, z) from State (alpha, beta)
    // theta = 2 * acos(|alpha|)
    // phi = angle(beta) - angle(alpha)
    // x = sin(theta)cos(phi)
    // y = sin(theta)sin(phi)
    // z = cos(theta)
    // Note: Simplified visualization logic for "Real Time" feel
    
    // We add a time-based phase rotation if in superposition (beta != 0)
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = width * 0.35;

        const render = () => {
            const time = performance.now() / 1000;
            
            // Derive Theta (Vertical angle from |0>)
            // Probability of |0> is |alpha|^2
            const prob0 = state.alpha.re * state.alpha.re + state.alpha.im * state.alpha.im;
            const theta = 2 * Math.acos(Math.sqrt(Math.min(1, Math.max(0, prob0))));
            
            // Derive Phi (Azimuthal/Phase angle)
            // Ideally calc from complex phases, but for visual we'll use a time drift if in superposition
            let phi = 0;
            if (prob0 < 0.99 && prob0 > 0.01) {
                phi = time * 2; // Real-time phase precession
            } else if (prob0 <= 0.01) {
                theta === Math.PI; // Point down
            }

            // 3D Projection
            // Rotate the sphere slowly for 3D effect
            const viewRot = time * 0.2; 
            
            // Vector positions
            const vecX = Math.sin(theta) * Math.cos(phi + viewRot);
            const vecY = Math.sin(theta) * Math.sin(phi + viewRot); // Depth (z in screen space)
            const vecZ = Math.cos(theta); // Vertical

            // Screen coords (Y is up/down, X is left/right)
            // We map vecZ (vertical) to -Y screen
            // We map vecX to X screen
            const px = cx + vecX * radius;
            const py = cy - vecZ * radius;

            ctx.clearRect(0, 0, width, height);

            // Draw Sphere Back Wireframe
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fill();
            
            // Draw Equator
            ctx.beginPath();
            ctx.ellipse(cx, cy, radius, radius * 0.3, viewRot, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.stroke();

            // Draw Meridians
            ctx.beginPath();
            ctx.ellipse(cx, cy, radius * 0.3, radius, viewRot, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.stroke();

            // Draw |0> and |1> labels
            ctx.fillStyle = '#a78bfa';
            ctx.font = '10px monospace';
            ctx.fillText('|0⟩', cx - 8, cy - radius - 10);
            ctx.fillText('|1⟩', cx - 8, cy + radius + 15);

            // Draw State Vector
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = isActive ? '#a3e635' : '#60a5fa'; // Green if entangled/active
            ctx.lineWidth = 2;
            ctx.stroke();

            // Vector Head
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = isActive ? '#a3e635' : '#60a5fa';
            ctx.fill();
            // Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.stroke();
            ctx.shadowBlur = 0;

            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [state, isActive]);

    return (
        <div className="relative flex flex-col items-center">
            <canvas ref={canvasRef} width={240} height={240} className="w-48 h-48 md:w-60 md:h-60" />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-slate-400">
                {label}
            </div>
            <div className="mt-2 font-mono text-[9px] text-center space-y-1">
                <div className="text-slate-500">P(|0⟩): <span className="text-pearl">{(state.alpha.re**2 + state.alpha.im**2).toFixed(2)}</span></div>
                <div className="text-slate-500">P(|1⟩): <span className="text-pearl">{(state.beta.re**2 + state.beta.im**2).toFixed(2)}</span></div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// MAIN NEXUS COMPONENT
// ----------------------------------------------------------------------
export const QuantumComputeNexus: React.FC<QuantumComputeNexusProps> = ({ systemState }) => {
    const [qubitA, setQubitA] = useState<QubitState>(INITIAL_STATE);
    const [qubitB, setQubitB] = useState<QubitState>(INITIAL_STATE);
    const [isEntangled, setIsEntangled] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [threadCount, setThreadCount] = useState(4); // Default fallback

    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator) {
            setThreadCount(navigator.hardwareConcurrency as number);
        }
        addLog("NEXUS_INIT: QUANTUM_REGISTER_MOUNTED [2 QUBITS]");
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`, ...prev].slice(0, 8));
    };

    const applyGate = (gateName: string, target: 'A' | 'B' | 'BOTH', gateFunc?: (q: QubitState) => QubitState) => {
        addLog(`OP_EXEC: ${gateName} on Q_${target}`);
        
        if (target === 'A' && gateFunc) setQubitA(gateFunc(qubitA));
        if (target === 'B' && gateFunc) setQubitB(gateFunc(qubitB));
        
        if (isEntangled) {
            // Simulated Bell State behavior: operations on one affect the shared wavefunction
            // For visual simplicity in this demo, we sync them if CNOT or similar was conceptually applied
            if (gateName === 'X') {
               // If entangled, flip the other to maintain correlation (simulated)
               if (target === 'A') setQubitB(prev => PAULI_X(prev));
               if (target === 'B') setQubitA(prev => PAULI_X(prev));
               addLog(`ENTANGLEMENT_ECHO: State mirrored instantaneously.`);
            }
        }
    };

    const handleEntangle = () => {
        // Prepare Bell State |Phi+> = (|00> + |11>) / sqrt(2)
        // 1. H on A -> A is (+), B is 0
        // 2. CNOT A,B -> If A is 1, flip B
        
        setIsEntangled(true);
        const qA_H = HADAMARD(INITIAL_STATE); // Put A in super
        setQubitA(qA_H);
        setQubitB(qA_H); // Sync B (Visual approximation of entanglement)
        
        addLog("GATE_CNOT: BELL_STATE_ESTABLISHED (|Φ⁺⟩)");
    };

    const handleMeasure = () => {
        // Collapse wavefunction
        const probA = qubitA.alpha.re**2 + qubitA.alpha.im**2;
        const collapseVal = Math.random() > probA ? 1 : 0;
        
        const collapsedState = collapseVal === 0 ? INITIAL_STATE : { alpha: {re:0, im:0}, beta: {re:1, im:0} };
        
        setQubitA(collapsedState);
        if (isEntangled) {
            setQubitB(collapsedState); // Perfect correlation
            addLog(`MEASUREMENT: Q_A collapsed to |${collapseVal}⟩. Q_B correlated instantly.`);
        } else {
            // Measure B independently
            const probB = qubitB.alpha.re**2 + qubitB.alpha.im**2;
            const collapseValB = Math.random() > probB ? 1 : 0;
            const collapsedStateB = collapseValB === 0 ? INITIAL_STATE : { alpha: {re:0, im:0}, beta: {re:1, im:0} };
            setQubitB(collapsedStateB);
            addLog(`MEASUREMENT: Q_A=|${collapseVal}⟩, Q_B=|${collapseValB}⟩`);
        }
        setIsEntangled(false); // Measurement breaks entanglement
    };

    const handleReset = () => {
        setQubitA(INITIAL_STATE);
        setQubitB(INITIAL_STATE);
        setIsEntangled(false);
        addLog("SYS_RESET: Qubits ground state |00⟩ restored.");
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-cyan-900/10 border border-cyan-500/30 flex items-center justify-center font-orbitron text-cyan-400 text-3xl animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        Ψ
                    </div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold text-glow-pearl">Quantum Compute Nexus</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Real-Time Bloch Sphere Interface</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Available Threads</p>
                    <p className="font-orbitron text-2xl text-cyan-400">{threadCount} <span className="text-xs text-slate-600">CORES</span></p>
                </div>
            </div>

            {/* Main Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
                {/* Visualizer Column */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex-1 bg-[#020202] border border-white/10 rounded-2xl relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-center gap-12 p-8">
                        {/* Connection Beam */}
                        {isEntangled && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-md animate-pulse z-0" />
                        )}
                        
                        <div className="relative z-10 group">
                            <BlochSphere id="QA" state={qubitA} isActive={isEntangled} label="QUBIT_A [Control]" />
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <button onClick={() => applyGate('H', 'A', HADAMARD)} className="bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-[10px] font-bold py-1 rounded">H</button>
                                <button onClick={() => applyGate('X', 'A', PAULI_X)} className="bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-[10px] font-bold py-1 rounded">X</button>
                                <button onClick={() => applyGate('Z', 'A', PAULI_Z)} className="bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-[10px] font-bold py-1 rounded">Z</button>
                            </div>
                        </div>

                        <div className="relative z-10 group">
                            <BlochSphere id="QB" state={qubitB} isActive={isEntangled} label="QUBIT_B [Target]" />
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <button onClick={() => applyGate('H', 'B', HADAMARD)} className="bg-white/5 border border-white/10 hover:border-violet-400 hover:text-violet-300 text-[10px] font-bold py-1 rounded">H</button>
                                <button onClick={() => applyGate('X', 'B', PAULI_X)} className="bg-white/5 border border-white/10 hover:border-violet-400 hover:text-violet-300 text-[10px] font-bold py-1 rounded">X</button>
                                <button onClick={() => applyGate('Z', 'B', PAULI_Z)} className="bg-white/5 border border-white/10 hover:border-violet-400 hover:text-violet-300 text-[10px] font-bold py-1 rounded">Z</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Tooltip text="Entangle Qubit A and Qubit B. Changes to A will instantly affect B.">
                            <button 
                                onClick={handleEntangle}
                                disabled={isEntangled}
                                className={`py-4 border rounded-sm font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isEntangled ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400 opacity-50 cursor-not-allowed' : 'bg-black border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'}`}
                            >
                                {isEntangled ? 'Entanglement_Active' : 'Initialize_Entanglement'}
                            </button>
                        </Tooltip>
                        <Tooltip text="Collapse the wavefunction of both qubits to a classical state (|0> or |1>).">
                            <button 
                                onClick={handleMeasure}
                                className="py-4 bg-black border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold hover:text-white font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                            >
                                Collapse / Measure
                            </button>
                        </Tooltip>
                        <Tooltip text="Reset both qubits to ground state |0>.">
                            <button 
                                onClick={handleReset}
                                className="py-4 bg-black border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500 hover:text-white font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm"
                            >
                                System_Reset
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Telemetry Column */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-black/60 border border-white/10 rounded-xl p-6 flex flex-col gap-4 shadow-inner">
                        <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5 pb-2">Coherence Metrics</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-mono mb-1">
                                    <span className="text-slate-400">Bell_State_Fidelity</span>
                                    <span className={isEntangled ? 'text-green-400 font-bold' : 'text-slate-600'}>{isEntangled ? '99.98%' : '0.00%'}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${isEntangled ? 'bg-green-500 w-full' : 'w-0'}`} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-mono mb-1">
                                    <span className="text-slate-400">Phase_Coherence</span>
                                    <span className="text-pearl">{(systemState.resonanceFactorRho * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400" style={{ width: `${systemState.resonanceFactorRho * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#050505] border border-white/10 rounded-xl p-6 flex flex-col shadow-2xl relative overflow-hidden font-mono text-[10px]">
                        <div className="absolute top-0 right-0 p-3 opacity-10 text-4xl font-black text-slate-700">LOG</div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                            <span className="text-gold uppercase tracking-widest font-bold">Quantum_Trace_Log</span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 opacity-80">
                            {logs.map((log, i) => (
                                <div key={i} className="border-l-2 border-white/10 pl-2 hover:border-cyan-400 hover:text-cyan-100 transition-colors cursor-default">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
