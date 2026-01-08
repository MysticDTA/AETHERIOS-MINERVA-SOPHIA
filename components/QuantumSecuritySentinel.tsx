
import React, { useEffect, useRef, useState } from 'react';
import { AudioEngine } from './audio/AudioEngine';

interface Threat {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    type: 'RANSOMWARE' | 'POLYMORPHIC' | 'QUANTUM_INJECT' | 'ZERO_DAY';
    integrity: number;
    signature: string;
}

interface QuantumSecuritySentinelProps {
    audioEngine?: AudioEngine | null;
}

const THREAT_TYPES = [
    { type: 'RANSOMWARE', label: 'Ransomware.Cryptex', risk: 'HIGH' },
    { type: 'POLYMORPHIC', label: 'Worm.Poly.V4', risk: 'CRITICAL' },
    { type: 'QUANTUM_INJECT', label: 'Q-Bit.Injection', risk: 'EXTREME' },
    { type: 'ZERO_DAY', label: 'Exploit.Unknown', risk: 'MODERATE' }
];

export const QuantumSecuritySentinel: React.FC<QuantumSecuritySentinelProps> = ({ audioEngine }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [threats, setThreats] = useState<Threat[]>([]);
    const [neutralizedCount, setNeutralizedCount] = useState(0);
    const [isScanning, setIsScanning] = useState(true);
    const [firewallIntegrity, setFirewallIntegrity] = useState(100);
    const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
    const [purgeBeam, setPurgeBeam] = useState<{ x: number, y: number, life: number }[]>([]);
    
    // Refs for animation loop
    const threatsRef = useRef<Threat[]>([]);
    const beamsRef = useRef<{ x: number, y: number, life: number }[]>([]);

    // Initialize & Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let width = canvas.width;
        let height = canvas.height;
        let cx = width / 2;
        let cy = height / 2;

        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
                width = canvas.width;
                height = canvas.height;
                cx = width / 2;
                cy = height / 2;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const spawnThreat = () => {
            if (threatsRef.current.length < 8 && Math.random() > 0.98) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.max(width, height) / 2 + 50;
                const typeData = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
                
                const newThreat: Threat = {
                    id: Date.now() + Math.random(),
                    x: cx + Math.cos(angle) * dist,
                    y: cy + Math.sin(angle) * dist,
                    vx: -Math.cos(angle) * (0.5 + Math.random()),
                    vy: -Math.sin(angle) * (0.5 + Math.random()),
                    type: typeData.type as any,
                    integrity: 100,
                    signature: `0x${Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase()}`
                };
                threatsRef.current.push(newThreat);
                setThreats([...threatsRef.current]);
                audioEngine?.playEffect('ui_click'); // Subtle tick on spawn
            }
        };

        const render = () => {
            // Background & Grid
            ctx.fillStyle = 'rgba(5, 5, 10, 0.2)';
            ctx.fillRect(0, 0, width, height);
            
            // Grid
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)'; // Faint Emerald
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<width; i+=40) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
            for(let i=0; i<height; i+=40) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
            ctx.stroke();

            // Central Fortress (Bank/CERN Core)
            ctx.beginPath();
            ctx.arc(cx, cy, 40, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
            
            // Shield Ring
            ctx.beginPath();
            ctx.arc(cx, cy, 60, 0, Math.PI*2);
            ctx.strokeStyle = `rgba(52, 211, 153, ${firewallIntegrity/100})`;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Process Threats
            if (isScanning) spawnThreat();

            for (let i = threatsRef.current.length - 1; i >= 0; i--) {
                const t = threatsRef.current[i];
                t.x += t.vx;
                t.y += t.vy;

                // Hit Core Logic
                const distToCore = Math.hypot(t.x - cx, t.y - cy);
                if (distToCore < 60) {
                    // Impact!
                    setFirewallIntegrity(prev => Math.max(0, prev - 5));
                    // Bounce back slightly
                    t.vx *= -1.5;
                    t.vy *= -1.5;
                    // Visual Flash
                    ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 60, 0, Math.PI*2);
                    ctx.fill();
                }

                // Draw Threat
                const color = t.type === 'QUANTUM_INJECT' ? '#c084fc' : t.type === 'RANSOMWARE' ? '#fb923c' : '#f43f5e';
                ctx.save();
                ctx.translate(t.x, t.y);
                ctx.rotate(Date.now() / 200);
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(0, -8); ctx.lineTo(6, 6); ctx.lineTo(-6, 6); ctx.closePath();
                ctx.fill();
                
                // Signature Label
                ctx.fillStyle = '#fff';
                ctx.font = '8px monospace';
                ctx.fillText(t.signature, 10, 0);
                
                // Health Bar
                ctx.fillStyle = 'red';
                ctx.fillRect(-10, -15, 20, 3);
                ctx.fillStyle = '#10b981';
                ctx.fillRect(-10, -15, 20 * (t.integrity / 100), 3);
                
                ctx.restore();
            }

            // Process Beams (Attacks)
            for (let i = beamsRef.current.length - 1; i >= 0; i--) {
                const beam = beamsRef.current[i];
                beam.life -= 0.05;
                
                if (beam.life <= 0) {
                    beamsRef.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(beam.x, beam.y);
                ctx.strokeStyle = `rgba(16, 185, 129, ${beam.life})`;
                ctx.lineWidth = 3 + Math.random() * 2;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#10b981';
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Impact Spark
                ctx.beginPath();
                ctx.arc(beam.x, beam.y, 10 * beam.life, 0, Math.PI*2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [isScanning]); // Effect deps

    const handlePurge = () => {
        if (threatsRef.current.length === 0) return;
        
        audioEngine?.playGroundingDischarge();
        
        // Target all threats
        threatsRef.current.forEach(t => {
            beamsRef.current.push({ x: t.x, y: t.y, life: 1.0 });
        });

        // Clear Threats instantly logic
        const count = threatsRef.current.length;
        setNeutralizedCount(prev => prev + count);
        threatsRef.current = [];
        setThreats([]);
        setFirewallIntegrity(prev => Math.min(100, prev + 10)); // Restore some integrity
    };

    const handleHardening = () => {
        audioEngine?.playUIConfirm();
        setFirewallIntegrity(100);
        setIsScanning(false);
        setTimeout(() => setIsScanning(true), 2000); // Brief pause in spawns
    };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            {/* Top Stat Bar */}
            <div className="flex justify-between items-center bg-black/40 border border-emerald-500/30 p-4 rounded-lg">
                <div className="flex gap-8">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">Global_Defcon</span>
                        <span className="font-orbitron text-xl text-emerald-400 font-bold animate-pulse">LEVEL_5</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">Active_Threats</span>
                        <span className={`font-orbitron text-xl font-bold ${threats.length > 0 ? 'text-rose-500' : 'text-slate-500'}`}>{threats.length}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">Neutralized</span>
                        <span className="font-orbitron text-xl text-gold font-bold">{neutralizedCount}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleHardening}
                        className="px-6 py-2 bg-emerald-900/20 border border-emerald-500/50 text-emerald-300 font-orbitron text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all rounded-sm"
                    >
                        Harden_Firewall
                    </button>
                    <button 
                        onClick={handlePurge}
                        className="px-8 py-2 bg-rose-900/20 border border-rose-500/50 text-rose-300 font-orbitron text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all rounded-sm shadow-[0_0_15px_rgba(244,63,94,0.2)] active:scale-95"
                    >
                        EXECUTE_PURGE
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Main Radar */}
                <div className="lg:col-span-2 bg-black border border-emerald-900/40 rounded-lg relative overflow-hidden" ref={containerRef}>
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-600/50">SECTOR_GRID: 0x88_ALPHA</div>
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#10b98110_3px)] pointer-events-none" />
                    <canvas ref={canvasRef} className="w-full h-full block" />
                </div>

                {/* Intel Feed */}
                <div className="bg-[#020402] border border-emerald-900/40 rounded-lg flex flex-col p-4">
                    <h4 className="font-orbitron text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-4 border-b border-emerald-900/50 pb-2">Threat Signatures</h4>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                        {threats.length === 0 ? (
                            <div className="text-center py-10 opacity-30 text-emerald-500 font-mono text-xs">
                                SECTOR CLEAR
                            </div>
                        ) : (
                            threats.map(t => (
                                <div key={t.id} className="bg-white/5 border border-white/5 p-2 rounded flex justify-between items-center group hover:bg-rose-950/20 hover:border-rose-500/30 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-rose-300">{t.type}</span>
                                        <span className="text-[8px] font-mono text-slate-500">{t.signature}</span>
                                    </div>
                                    <span className="text-[8px] font-mono text-rose-500 font-bold animate-pulse">DETECTED</span>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="mt-4 border-t border-emerald-900/50 pt-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] font-mono text-emerald-500 uppercase">Firewall_Integrity</span>
                            <span className={`text-[10px] font-bold ${firewallIntegrity < 50 ? 'text-rose-500' : 'text-emerald-400'}`}>{firewallIntegrity}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${firewallIntegrity < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${firewallIntegrity}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
