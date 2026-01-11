
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { EarthGroundingData } from '../types';
import { performanceService, PerformanceTier } from '../services/performanceService';
import { Tooltip } from './Tooltip';

interface EarthGroundingCoreProps {
  data: EarthGroundingData;
  onDischarge: () => void;
  isDischarging: boolean;
}

const getStatusConfig = (status: EarthGroundingData['status']) => {
    switch(status) {
        case 'STABLE':
            return { color: 'text-pearl', label: 'STABLE', baseColor: 'rgba(167, 139, 250, 1)' }; // Pearl/Violet
        case 'CHARGING':
            return { color: 'text-gold', label: 'CHARGING', baseColor: 'rgba(255, 215, 0, 1)' }; // Gold
        case 'DISCHARGING':
            return { color: 'text-cyan-400', label: 'DISCHARGING', baseColor: 'rgba(34, 211, 238, 1)' }; // Cyan
        case 'WEAK':
            return { color: 'text-orange-400', label: 'WEAK', baseColor: 'rgba(251, 146, 60, 1)' }; // Orange
        default:
            return { color: 'text-warm-grey', label: 'UNKNOWN', baseColor: 'rgba(120, 113, 108, 1)' };
    }
}

const SeismicMeter: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-slate-500">
            <span>{label}</span>
            <span style={{ color }}>{(value * 100).toFixed(1)}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
                className="h-full transition-all duration-700" 
                style={{ width: `${value * 100}%`, backgroundColor: color, boxShadow: `0 0 5px ${color}` }} 
            />
        </div>
    </div>
);

const TelluricFluxCanvas: React.FC<{ data: EarthGroundingData }> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { conductivity, status, charge, seismicActivity } = data;
    const config = getStatusConfig(status);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let particles: { x: number; y: number; vy: number; size: number; life: number; color: string }[] = [];
        
        const density = Math.floor(conductivity * 50) + 20;
        const height = canvas.offsetHeight;
        const width = canvas.offsetWidth;
        
        canvas.width = width;
        canvas.height = height;

        const render = () => {
            // Clear with heavy trail for "plasma" feel
            ctx.fillStyle = 'rgba(5, 5, 8, 0.2)';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';

            // Spawn logic
            if (particles.length < density) {
                const spawnCount = status === 'DISCHARGING' ? 5 : 1;
                for(let k=0; k<spawnCount; k++) {
                    const x = width / 2 + (Math.random() - 0.5) * 40;
                    const y = status === 'DISCHARGING' ? 0 : height; // Fall down if discharging, rise up otherwise
                    
                    particles.push({
                        x,
                        y,
                        vy: status === 'DISCHARGING' ? (Math.random() * 5 + 5) : (Math.random() * -2 - 0.5),
                        size: Math.random() * 2 + 0.5,
                        life: 1.0,
                        color: config.baseColor
                    });
                }
            }

            // Physics Loop
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                // Seismic Jitter
                p.x += (Math.random() - 0.5) * (seismicActivity * 10);
                
                // Velocity update
                if (status === 'CHARGING') p.vy -= 0.1; // Accelerate up
                p.y += p.vy;
                p.life -= 0.01;

                // Render
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace('1)', `${p.life})`);
                ctx.shadowBlur = 10 * charge;
                ctx.shadowColor = p.color;
                ctx.fill();

                if (p.life <= 0 || p.y < -10 || p.y > height + 10) {
                    particles.splice(i, 1);
                }
            }
            
            // Core Crystal Graphic (Static overlay)
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = config.baseColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width/2, height - 20);
            ctx.lineTo(width/2 - 10, height - 40);
            ctx.lineTo(width/2, height - 60);
            ctx.lineTo(width/2 + 10, height - 40);
            ctx.closePath();
            ctx.stroke();
            
            if (status === 'CHARGING' || status === 'STABLE') {
                ctx.fillStyle = config.baseColor.replace('1)', '0.2)');
                ctx.fill();
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [conductivity, status, charge, seismicActivity, config.baseColor]);

    return <canvas ref={canvasRef} className="w-full h-full block rounded-md" />;
};

export const EarthGroundingCore: React.FC<EarthGroundingCoreProps> = ({ data, onDischarge, isDischarging }) => {
    const { charge, conductivity, status, seismicActivity, telluricCurrent, feedbackLoopStatus } = data;
    const config = getStatusConfig(status);
    const canDischarge = charge > 0.75 && !isDischarging;
    const isCorrecting = feedbackLoopStatus === 'CORRECTING';

    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-orbitron text-md text-warm-grey">Earth Grounding Core</h3>
                    <div className="flex items-center gap-2">
                        <p className={`font-orbitron font-bold text-md ${config.color} ${status !== 'STABLE' ? 'animate-pulse' : ''}`}>{config.label}</p>
                        {isCorrecting && (
                            <span className="text-[8px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded animate-pulse">AUTO-STABILIZING</span>
                        )}
                    </div>
                </div>
                <button 
                    onClick={onDischarge}
                    disabled={!canDischarge}
                    className="px-3 py-1 rounded-md text-xs font-bold transition-colors uppercase bg-cyan-800/70 hover:bg-cyan-700 text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDischarging ? 'DISCHARGING' : 'Discharge Core'}
                </button>
            </div>
            
            <div className="flex-1 min-h-[120px] bg-black/40 rounded-md border border-white/5 relative overflow-hidden mb-3">
                <TelluricFluxCanvas data={data} />
            </div>

            <div className="space-y-2">
                <SeismicMeter value={seismicActivity || 0} label="Seismic Tremor" color={seismicActivity > 0.1 ? '#fb923c' : '#a78bfa'} />
                <SeismicMeter value={telluricCurrent || 0} label="Telluric Flux" color={telluricCurrent > 0.1 ? '#facc15' : '#67e8f9'} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 text-sm border-t border-dark-border/50 pt-2">
                <Tooltip text="The amount of stabilized telluric energy stored in the grounding core. This energy can be discharged to rapidly reduce system-wide decoherence.">
                    <div>
                        <span className="text-warm-grey text-xs uppercase">Charge Level</span>
                        <p className="font-mono text-pearl text-base">{(charge * 100).toFixed(1)}%</p>
                    </div>
                </Tooltip>
                <Tooltip text="The efficiency of the connection to the Earth's energy grid. Higher conductivity allows for faster charging and more effective grounding.">
                    <div className="text-right">
                        <span className="text-warm-grey text-xs uppercase">Conductivity</span>
                        <p className="font-mono text-pearl text-base">{(conductivity * 100).toFixed(1)}%</p>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};
