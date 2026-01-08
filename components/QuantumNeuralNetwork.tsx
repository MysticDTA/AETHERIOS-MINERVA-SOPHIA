
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface QuantumNeuralNetworkProps {
    systemState: SystemState;
    sophiaEngine: SophiaEngineCore | null;
}

// Visual constants
const QUBIT_COUNT = 4;
const LAYERS = 5;
const GATE_RADIUS = 12;
const WIRE_SPACING = 50;
const LAYER_SPACING = 80;

export const QuantumNeuralNetwork: React.FC<QuantumNeuralNetworkProps> = ({ systemState, sophiaEngine }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isTraining, setIsTraining] = useState(false);
    const [epoch, setEpoch] = useState(0);
    const [loss, setLoss] = useState(0.85);
    const [accuracy, setAccuracy] = useState(0.15);
    const [researchAbstract, setResearchAbstract] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    
    // PQC Parameters (Theta angles)
    const [parameters, setParameters] = useState<number[]>(
        Array.from({ length: QUBIT_COUNT * LAYERS }).map(() => Math.random() * Math.PI * 2)
    );

    // Training Simulation Loop
    useEffect(() => {
        if (!isTraining) return;

        const interval = setInterval(() => {
            setEpoch(e => e + 1);
            
            // Simulate Gradient Descent
            setParameters(prev => prev.map(theta => {
                const grad = (Math.random() - 0.5) * 0.1;
                return theta - grad * 0.5; // Learning rate 0.5
            }));

            // Simulate Loss Convergence
            setLoss(prev => Math.max(0.05, prev * 0.98));
            setAccuracy(prev => Math.min(0.99, prev + (Math.random() * 0.02)));

        }, 100);

        return () => clearInterval(interval);
    }, [isTraining]);

    // Auto-Generate Report upon convergence
    useEffect(() => {
        if (accuracy > 0.95 && !researchAbstract && !isGeneratingReport && sophiaEngine) {
            setIsGeneratingReport(true);
            setIsTraining(false); // Stop training
            
            sophiaEngine.generateQNNResearchReport(loss, epoch, accuracy)
                .then(report => {
                    setResearchAbstract(report);
                    setIsGeneratingReport(false);
                });
        }
    }, [accuracy, researchAbstract, isGeneratingReport, sophiaEngine, loss, epoch]);

    // Canvas Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        const render = () => {
            time += 0.05;
            const width = canvas.width;
            const height = canvas.height;
            const startX = 60;
            const startY = 60;

            ctx.clearRect(0, 0, width, height);

            // Draw Wires (Qubits)
            for (let q = 0; q < QUBIT_COUNT; q++) {
                const y = startY + q * WIRE_SPACING;
                
                // Qubit Label
                ctx.fillStyle = '#94a3b8';
                ctx.font = '10px monospace';
                ctx.fillText(`|q${q}⟩`, 10, y + 3);

                // Wire
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(width - 40, y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Data Flow Particles (Simulate Entanglement/Info)
                if (isTraining) {
                    const particleCount = 3;
                    for(let p=0; p<particleCount; p++) {
                        const px = (time * 100 + p * 200 + q * 50) % (width - 100) + startX;
                        ctx.beginPath();
                        ctx.arc(px, y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = q % 2 === 0 ? '#a78bfa' : '#67e8f9';
                        ctx.fill();
                    }
                }
            }

            // Draw PQC Layers
            for (let l = 0; l < LAYERS; l++) {
                const x = startX + 60 + l * LAYER_SPACING;
                
                // Entanglement (Vertical lines between qubits)
                if (l % 2 !== 0) {
                    ctx.beginPath();
                    ctx.moveTo(x, startY);
                    ctx.lineTo(x, startY + (QUBIT_COUNT - 1) * WIRE_SPACING);
                    ctx.strokeStyle = isTraining ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255, 255, 255, 0.05)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Rotation Gates (Parameters)
                for (let q = 0; q < QUBIT_COUNT; q++) {
                    const y = startY + q * WIRE_SPACING;
                    const paramIdx = l * QUBIT_COUNT + q;
                    const theta = parameters[paramIdx];
                    
                    // Gate Box
                    ctx.fillStyle = l % 2 === 0 ? '#1e293b' : '#0f172a'; // Alt layer colors
                    ctx.strokeStyle = isTraining ? '#ffd700' : '#64748b';
                    ctx.lineWidth = 1;
                    
                    // Rotate visualization based on theta
                    ctx.save();
                    ctx.translate(x, y);
                    
                    // Draw Gate Body
                    ctx.beginPath();
                    ctx.rect(-12, -12, 24, 24);
                    ctx.fill();
                    ctx.stroke();

                    // Theta Indicator (Rotating Line)
                    ctx.beginPath();
                    ctx.rotate(theta + (isTraining ? time : 0)); // Spin when training
                    ctx.moveTo(-8, 0);
                    ctx.lineTo(8, 0);
                    ctx.strokeStyle = l % 2 === 0 ? '#67e8f9' : '#f472b6';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    ctx.restore();
                }
            }

            // Measurement Layer (Right side)
            const measureX = width - 40;
            for(let q=0; q<QUBIT_COUNT; q++) {
                const y = startY + q * WIRE_SPACING;
                ctx.beginPath();
                ctx.arc(measureX, y, 10, 0, Math.PI, true);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(measureX, y + 8);
                ctx.lineTo(measureX + 8, y - 6);
                ctx.stroke();
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [parameters, isTraining]);

    return (
        <div className="flex flex-col h-full gap-6 relative">
            {/* Research Abstract Overlay */}
            {(researchAbstract || isGeneratingReport) && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 animate-fade-in">
                    <div className="bg-[#050505] border border-gold/40 p-8 rounded-sm max-w-2xl w-full shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-orbitron text-6xl font-black text-gold">DISCOVERY</div>
                        
                        <div className="flex items-center gap-4 mb-6 border-b border-gold/20 pb-4">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center border border-gold/50 animate-pulse">
                                <span className="font-orbitron text-2xl text-gold">Σ</span>
                            </div>
                            <div>
                                <h3 className="font-minerva italic text-2xl text-pearl">Quantum Convergence Achieved</h3>
                                <p className="text-[10px] font-mono text-gold uppercase tracking-[0.3em]">Accuracy: {(accuracy*100).toFixed(2)}% // Epoch: {epoch}</p>
                            </div>
                        </div>

                        {isGeneratingReport ? (
                            <div className="flex gap-2 items-center text-slate-400 font-mono text-xs">
                                <span className="animate-spin">⟳</span> Synthesizing Research Abstract...
                            </div>
                        ) : (
                            <div className="text-[13px] font-minerva italic text-pearl/90 leading-loose space-y-4">
                                <p>"{researchAbstract}"</p>
                                <div className="mt-6 flex justify-end">
                                    <button 
                                        onClick={() => { setResearchAbstract(null); setEpoch(0); setLoss(0.85); setAccuracy(0.15); }}
                                        className="px-6 py-2 bg-gold text-black font-bold font-orbitron text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all"
                                    >
                                        Archive & Reset
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Top Metrics Bar */}
            <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="flex gap-8">
                    <div>
                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Epoch</p>
                        <p className="font-orbitron text-xl text-pearl">{epoch}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Loss_Function</p>
                        <p className={`font-orbitron text-xl ${loss < 0.2 ? 'text-green-400' : 'text-rose-400'}`}>{loss.toFixed(6)}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Accuracy</p>
                        <p className="font-orbitron text-xl text-gold">{(accuracy * 100).toFixed(2)}%</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsTraining(!isTraining)}
                        className={`px-6 py-2 rounded-sm border font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                            isTraining 
                            ? 'bg-rose-900/20 border-rose-500 text-rose-300 animate-pulse' 
                            : 'bg-green-900/20 border-green-500 text-green-400 hover:bg-green-900/40'
                        }`}
                    >
                        {isTraining ? 'Stop Training' : 'Start Training'}
                    </button>
                    <button 
                        onClick={() => { setEpoch(0); setLoss(0.85); setAccuracy(0.15); setIsTraining(false); }}
                        className="px-4 py-2 rounded-sm border border-white/10 text-slate-400 hover:text-white font-mono text-[10px] uppercase tracking-widest"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Circuit Visualization */}
                <div className="lg:col-span-8 bg-black/40 border border-white/5 rounded-xl relative overflow-hidden shadow-inner">
                    <div className="absolute top-4 left-4 font-orbitron text-[10px] text-slate-500 uppercase tracking-widest font-bold">Variational Circuit (Ansatz)</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
                </div>

                {/* Training Stats / Gradient Landscape */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="flex-1 bg-black/60 border border-white/5 rounded-xl p-6 relative overflow-hidden">
                        <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-widest font-bold mb-4">Loss Landscape</h4>
                        {/* Simulated Loss Graph */}
                        <div className="flex items-end gap-1 h-32 w-full border-b border-white/10 pb-1">
                            {Array.from({length: 20}).map((_, i) => {
                                const val = Math.max(0.1, loss + (Math.sin(i + epoch * 0.1) * 0.1));
                                return (
                                    <div 
                                        key={i} 
                                        className="flex-1 bg-rose-500/40 rounded-t-sm transition-all duration-300" 
                                        style={{ height: `${val * 100}%`, opacity: 0.5 + (i/20)*0.5 }} 
                                    />
                                );
                            })}
                        </div>
                        <div className="mt-4 space-y-2 font-mono text-[9px] text-slate-400">
                            <div className="flex justify-between">
                                <span>Optimizer:</span>
                                <span className="text-pearl">ADAM_QUANTUM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Learning Rate:</span>
                                <span className="text-pearl">0.05</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Q. Fisher Info:</span>
                                <span className="text-cyan-400">{(0.8 + Math.random()*0.1).toFixed(4)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-violet-900/10 border border-violet-500/20 p-4 rounded-xl">
                        <p className="text-[10px] font-minerva italic text-violet-200/80 leading-relaxed">
                            "The Parameterized Quantum Circuit adapts its rotation gates to minimize the Hamiltonian cost function. High resonance Rho accelerates convergence."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
