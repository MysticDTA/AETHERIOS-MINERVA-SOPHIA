
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Tooltip } from './Tooltip';

interface TruthReconciliationInterfaceProps {
    initialMatter?: number; // In Millions
    initialLiquidity?: number;
    initialVirtual?: number;
}

const DensityCore: React.FC<{ m: number; l: number; v: number; density: number }> = ({ m, l, v, density }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

            // Totals for ratio calculations
            const total = m + l + v || 1;
            const rSolid = (m / total) * 60; // Radius of solid core
            const rLiquid = ((m + l) / total) * 70; // Radius of liquid layer
            const rVirtual = 80; // Outer limit

            ctx.clearRect(0, 0, w, h);

            // 1. Virtual/IP Halo (Vapor)
            // Expands based on V ratio. If Density is low, this is chaotic.
            const vRatio = v / total;
            const vaporColor = density < 0.3 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(167, 139, 250, 0.1)';
            
            ctx.beginPath();
            for (let i = 0; i < 360; i += 5) {
                const angle = (i * Math.PI) / 180;
                // Wobble increases with Virtual ratio
                const wobble = Math.sin(time * 2 + i * 0.1) * (vRatio * 15);
                const r = rVirtual + wobble;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = vaporColor;
            ctx.fill();
            ctx.strokeStyle = density < 0.3 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(167, 139, 250, 0.3)';
            ctx.stroke();

            // 2. Liquid Capital Layer (Flow)
            if (l > 0) {
                ctx.beginPath();
                ctx.arc(cx, cy, rLiquid, 0, Math.PI * 2);
                const grad = ctx.createRadialGradient(cx, cy, rSolid, cx, cy, rLiquid);
                grad.addColorStop(0, 'rgba(16, 185, 129, 0.6)'); // Emerald
                grad.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
                ctx.fillStyle = grad;
                ctx.fill();
                
                // Flow particles
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, rLiquid, 0, Math.PI*2);
                ctx.clip();
                const particleCount = Math.floor(l / 2);
                for(let p=0; p<particleCount; p++) {
                    const angle = time + (p * 45);
                    const dist = rSolid + (Math.sin(time * 0.5 + p) * 0.5 + 0.5) * (rLiquid - rSolid);
                    const px = cx + Math.cos(angle) * dist;
                    const py = cy + Math.sin(angle) * dist;
                    ctx.fillStyle = '#6ee7b7';
                    ctx.fillRect(px, py, 2, 2);
                }
                ctx.restore();
            }

            // 3. Matter Core (Solid Assets)
            // This is the anchor. High M = Stable Core.
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(2, rSolid), 0, Math.PI * 2);
            ctx.fillStyle = '#ffd700'; // Gold
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffd700';
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Texture on core
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - rSolid + 5, cy - 5); ctx.lineTo(cx + rSolid - 5, cy + 5);
            ctx.stroke();

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [m, l, v, density]);

    return <canvas ref={canvasRef} width={200} height={200} className="w-full h-full object-contain" />;
};

export const TruthReconciliationInterface: React.FC<TruthReconciliationInterfaceProps> = ({ 
    initialMatter = 15, 
    initialLiquidity = 5, 
    initialVirtual = 20 
}) => {
    const [matter, setMatter] = useState(initialMatter); // M
    const [liquidity, setLiquidity] = useState(initialLiquidity); // L
    const [virtual, setVirtual] = useState(initialVirtual); // V_ip

    const totalValue = matter + liquidity + virtual;
    
    // Pd = (M + L) / V_total
    // If V_total is 0, density is 0 to avoid division by zero error, effectively "No Reality".
    const physicalDensity = totalValue > 0 ? (matter + liquidity) / totalValue : 0;

    const densityStatus = useMemo(() => {
        if (physicalDensity > 0.8) return { label: 'ABSOLUTE TRUTH', color: 'text-emerald-400', desc: 'Sovereign Reality' };
        if (physicalDensity > 0.5) return { label: 'SOLID STATE', color: 'text-gold', desc: 'Balanced Portfolio' };
        if (physicalDensity > 0.2) return { label: 'INFLATED', color: 'text-orange-400', desc: 'High Vapor Content' };
        return { label: 'VAPORWARE', color: 'text-rose-500', desc: 'Causal Instability' };
    }, [physicalDensity]);

    return (
        <div className="w-full h-full bg-[#050505] border border-white/10 p-6 rounded-xl flex flex-col gap-6 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start z-10 border-b border-white/5 pb-4">
                <div className="space-y-1">
                    <h3 className="font-orbitron text-[12px] text-pearl uppercase tracking-[0.3em] font-black text-glow-pearl">Truth Reconciliation Engine</h3>
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Physics Constant: $P_d$</p>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Density Constant</p>
                    <p className={`font-orbitron text-2xl font-black ${densityStatus.color} transition-colors duration-500`}>
                        {physicalDensity.toFixed(3)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0 relative z-10">
                
                {/* Visualizer */}
                <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-lg relative overflow-hidden p-4">
                    <DensityCore m={matter} l={liquidity} v={virtual} density={physicalDensity} />
                    <div className="absolute bottom-4 text-center">
                        <span className={`text-[10px] font-orbitron font-bold uppercase tracking-[0.2em] px-3 py-1 rounded bg-black/60 border border-white/10 ${densityStatus.color}`}>
                            {densityStatus.label}
                        </span>
                        <p className="text-[8px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{densityStatus.desc}</p>
                    </div>
                </div>

                {/* Controls & Formula */}
                <div className="flex flex-col justify-between">
                    <div className="bg-white/5 p-3 rounded border border-white/10 mb-4 font-minerva italic text-[11px] text-slate-300 text-center">
                        <span className="font-bold text-pearl not-italic font-orbitron text-[10px] mr-2">FORMULA:</span>
                        V<sub>Total</sub> = ∑ (M<sub>assets</sub> + L<sub>vaults</sub>) + V<sub>IP</sub>
                    </div>

                    <div className="space-y-5 font-mono text-[9px] uppercase tracking-widest text-slate-500">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-gold font-bold">Matter (M) - Assets</label>
                                <span className="text-pearl">${matter}M</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" step="1" value={matter}
                                onChange={(e) => setMatter(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-emerald-400 font-bold">Liquidity (L) - Vaults</label>
                                <span className="text-pearl">${liquidity}M</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" step="1" value={liquidity}
                                onChange={(e) => setLiquidity(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-violet-400 font-bold">Virtual (V<sub>IP</sub>) - Brand</label>
                                <span className="text-pearl">${virtual}M</span>
                            </div>
                            <input 
                                type="range" min="0" max="200" step="5" value={virtual}
                                onChange={(e) => setVirtual(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Total_Net_Worth</span>
                        <span className="font-orbitron text-xl text-pearl font-bold">${totalValue}M</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
