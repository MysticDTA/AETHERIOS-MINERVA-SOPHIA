
import React, { useState, useEffect, useMemo } from 'react';
import { HybridSecurityState, CipherSuite, CryptoLayer } from '../types';
import { Tooltip } from './Tooltip';

interface HybridCryptoVaultProps {
    data: HybridSecurityState;
    onHarden: () => void;
    onCycleAlgorithm: (layerId: string) => void;
}

const ALGORITHM_METADATA: Record<CipherSuite, { bits: number, safety: string, color: string }> = {
    'AES-256-GCM': { bits: 256, safety: 'CLASSICAL_OPTIMAL', color: '#60a5fa' },
    'CRYSTALS-KYBER': { bits: 1024, safety: 'QUANTUM_IMMUNE', color: '#a78bfa' },
    'DILITHIUM': { bits: 2048, safety: 'QUANTUM_IMMUNE', color: '#f472b6' },
    'FALCON': { bits: 1024, safety: 'QUANTUM_IMMUNE', color: '#2dd4bf' },
    'SPHINCS+': { bits: 4096, safety: 'QUANTUM_IMMUNE', color: '#fb923c' }
};

const EntropyCanvas: React.FC<{ score: number }> = ({ score }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame: number;
        const width = canvas.width = 300;
        const height = canvas.height = 100;

        const render = () => {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
            ctx.fillRect(0, 0, width, height);

            ctx.beginPath();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 1;
            
            for (let x = 0; x < width; x += 5) {
                const noise = (Math.random() - 0.5) * (1 - score) * 50;
                const y = height / 2 + Math.sin(x * 0.05 + Date.now() * 0.005) * 20 + noise;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            frame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frame);
    }, [score]);

    return <canvas ref={canvasRef} className="w-full h-20 bg-black/40 rounded border border-white/5" />;
};

export const HybridCryptoVault: React.FC<HybridCryptoVaultProps> = ({ data, onHarden, onCycleAlgorithm }) => {
    const [isHardening, setIsHardening] = useState(false);

    const handleHardenClick = () => {
        setIsHardening(true);
        onHarden();
        setTimeout(() => setIsHardening(false), 2000);
    };

    return (
        <div className="w-full bg-[#0a0a0c] border border-violet-500/30 p-6 rounded-xl shadow-2xl relative overflow-hidden group transition-all duration-700 hover:border-violet-500/60">
            <div className="absolute top-0 right-0 p-3 opacity-[0.03] font-orbitron text-6xl font-black italic pointer-events-none select-none">PQC_VAULT</div>
            
            <div className="flex justify-between items-center mb-6 z-10 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-900/10 border border-violet-500/40 rounded flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-orbitron text-sm text-pearl uppercase tracking-[0.3em] font-black">Hybrid Crypto Vault</h3>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Post-Quantum Lattice Standard v2.0</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-[9px] font-mono px-3 py-1 rounded border font-black tracking-widest ${data.globalPosture === 'QUANTUM_READY' ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'border-gold text-gold bg-gold/5'}`}>
                        POSTURE: {data.globalPosture}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                    <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-widest border-l-2 border-gold pl-2">Active Multi-Ciphers</h4>
                    <div className="space-y-2">
                        {data.activeLayers.map(layer => {
                            const meta = ALGORITHM_METADATA[layer.algorithm];
                            return (
                                <div key={layer.id} className="bg-black/60 border border-white/5 p-4 rounded flex justify-between items-center group/layer hover:border-white/20 transition-all">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-mono text-slate-500 uppercase">{layer.type}_LAYER</span>
                                        <span className="font-orbitron text-[11px] text-pearl font-bold tracking-wider">{layer.algorithm}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-[8px] font-mono text-slate-600 block">BIT_DEPTH</span>
                                            <span className="text-[10px] font-mono text-gold">{meta.bits} bits</span>
                                        </div>
                                        <button 
                                            onClick={() => onCycleAlgorithm(layer.id)}
                                            className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-slate-600 hover:text-pearl hover:border-pearl transition-all bg-white/5 active:scale-95"
                                            title="Cycle Algorithm (Agility Logic)"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-widest border-l-2 border-cyan-400 pl-2">Entropy Sink (QRNG)</h4>
                    <EntropyCanvas score={data.quantumResistanceScore} />
                    <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-slate-500 uppercase tracking-tighter">Source: TRAPPED_ION_GENERATOR</span>
                        <span className="text-cyan-400 font-bold">PARITY_LOCKED</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 border border-white/5 p-4 rounded text-center group/metric hover:border-violet-500/30 transition-all">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1 group-hover/metric:text-violet-300">Quantum Immunity</p>
                    <p className="font-orbitron text-xl text-pearl font-black">{(data.quantumResistanceScore * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded text-center group/metric hover:border-gold/30 transition-all">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1 group-hover/metric:text-gold">Threat Mitigation</p>
                    <p className="font-orbitron text-xl text-gold font-black">{(data.threatMitigationIndex * 100).toFixed(3)}%</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded text-center group/metric hover:border-emerald-500/30 transition-all">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1 group-hover/metric:text-emerald-400">Cipher Agility</p>
                    <p className="font-orbitron text-xl text-emerald-400 font-black">ACTIVE</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={handleHardenClick}
                    disabled={isHardening}
                    className={`flex-1 py-4 font-orbitron text-[10px] font-black uppercase tracking-[0.4em] transition-all border-2 relative overflow-hidden group/btn active:scale-95 ${
                        isHardening 
                        ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' 
                        : 'bg-violet-900/40 border-violet-500 text-violet-300 hover:bg-violet-500 hover:text-white shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                    }`}
                >
                    <span className="relative z-10">{isHardening ? 'RE-SEEDING_LATTICE...' : 'HARDEN_CIPHER_SHARDS'}</span>
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </button>
            </div>

            <div className="mt-6 p-4 bg-black/40 border border-white/5 rounded italic text-[11px] text-slate-500 leading-relaxed font-minerva">
                "The 2026 Sovereign standard requires hybrid-lattice signatures. Your data shards are wrapped in a dual-envelope, ensuring absolute sterility against future CRQC interference."
            </div>
        </div>
    );
};
