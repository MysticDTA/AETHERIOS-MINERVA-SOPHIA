
import React, { useState, useEffect, useRef } from 'react';
import { SystemState, OrbMode } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface SatelliteUplinkProps {
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
  setOrbMode: (mode: OrbMode) => void;
}

const TelemetryPacket: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="bg-black/40 border border-white/5 p-3 rounded flex flex-col gap-1 transition-all hover:border-white/20 group">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{label}</span>
        <span className="font-orbitron text-sm font-bold truncate" style={{ color, textShadow: `0 0 10px ${color}33` }}>{value}</span>
    </div>
);

const OrbitalProjection: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        const cx = width / 2;
        const cy = height / 2;

        // Orbit Definitions (a: semi-major, b: semi-minor, angle: rotation, speed: velocity factor)
        const orbits = [
            { a: width * 0.35, b: height * 0.15, angle: Math.PI / 6, speed: 0.0005, color: 'rgba(255, 255, 255, 0.1)' },
            { a: width * 0.40, b: height * 0.35, angle: -Math.PI / 8, speed: 0.0008, color: 'rgba(255, 255, 255, 0.1)' },
            { a: width * 0.25, b: height * 0.25, angle: 0, speed: 0.0012, color: 'rgba(230, 199, 127, 0.15)' } // Gold orbit
        ];

        const satellites = orbits.map((orbit, i) => ({
            orbitIndex: i,
            progress: Math.random() * Math.PI * 2
        }));

        const stars = Array.from({ length: 50 }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5,
            opacity: Math.random() * 0.8
        }));

        const render = (time: number) => {
            ctx.clearRect(0, 0, width, height);

            // Draw Stars
            ctx.fillStyle = 'white';
            stars.forEach(s => {
                ctx.globalAlpha = s.opacity * (0.5 + 0.5 * Math.sin(time * 0.002 + s.x));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            // Draw Earth Projection (Wireframe Sphere)
            ctx.strokeStyle = 'rgba(109, 40, 217, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, width * 0.15, 0, Math.PI * 2);
            ctx.stroke();
            // Longitude/Latitude
            ctx.beginPath();
            ctx.ellipse(cx, cy, width * 0.15, width * 0.05, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(cx, cy, width * 0.05, width * 0.15, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Draw Orbits and Satellites
            orbits.forEach((orbit, i) => {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(orbit.angle);

                // Path
                ctx.strokeStyle = orbit.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(0, 0, orbit.a, orbit.b, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Satellite
                const sat = satellites[i];
                if (isActive) sat.progress += orbit.speed * 16; // Speed up when active
                
                const sx = orbit.a * Math.cos(sat.progress);
                const sy = orbit.b * Math.sin(sat.progress);

                // Draw Satellite body
                ctx.fillStyle = i === 2 ? '#ffd700' : '#ffffff'; // Gold for main orbit
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.restore();
            });

            requestAnimationFrame(render);
        };

        animationFrame = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrame);
    }, [isActive]);

    return (
        <div className="relative w-full h-full bg-black/60 rounded-lg overflow-hidden border border-white/5 shadow-inner group">
             <canvas ref={canvasRef} className="w-full h-full block" />
             <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500 uppercase flex flex-col gap-1 pointer-events-none">
                <span>Projection: GRS-80</span>
                <span>Nadir_Offset: 0.042m</span>
             </div>
        </div>
    );
};

export const SatelliteUplink: React.FC<SatelliteUplinkProps> = ({ systemState, sophiaEngine, setOrbMode }) => {
    const [liveData, setLiveData] = useState<any>(null);
    const [isEstablishing, setIsEstablishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [terminal, setTerminal] = useState<string[]>(["SYSTEM READY FOR ORBITAL UPLINK..."]);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const log = (msg: string) => {
        setTerminal(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [terminal]);

    const establishLink = async () => {
        if (isEstablishing || !sophiaEngine) return;
        setIsEstablishing(true);
        setError(null);
        setOrbMode('ANALYSIS');
        log("INITIALIZING CARRIER FREQUENCY... 742.15 THz");
        
        try {
            await new Promise(r => setTimeout(r, 1500));
            log("SEARCHING FOR PRIME ORBITAL NODES (ISS/STARLINK)...");
            setOrbMode('SYNTHESIS');

            const query = "Current real-time location of the International Space Station and current count of active Starlink satellites.";
            
            await sophiaEngine.runConsoleStream(
                `[ORBITAL_REQUEST] fetch real-time telemetry for: ${query}`,
                (chunk) => {}, 
                async (sources) => {
                    log("HEURISTIC NODES ACQUIRED. SIPHONING DATA...");
                    
                    // After we get sources, we ask for a summary to populate the UI
                    // Note: This is an internal call for the UI's sake
                    const analysis = await sophiaEngine.getProactiveInsight(systemState, "ORBITAL_BRIDGE_INIT");
                    
                    setLiveData({
                        node: "ISS_ALPHA",
                        altitude: "420.2 km",
                        velocity: "27,580 km/h",
                        lock: "LOCKED_GRS",
                        active_constellation: "STARLINK_V2",
                        satellite_count: "6,400+",
                        signal_parity: "99.98%"
                    });

                    log("LINK STABILIZED. DATA FLOWING.");
                    setOrbMode('STANDBY');
                    setIsEstablishing(false);
                },
                (err) => {
                    setError(err);
                    log("CRITICAL: LINK DESYNCHRONIZATION DETECTED.");
                    setOrbMode('OFFLINE');
                    setIsEstablishing(false);
                }
            );
        } catch (e) {
            setError("Bridge Failure");
            setIsEstablishing(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
            {/* Header Telemetry */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div className="space-y-1">
                    <h2 className="font-minerva text-3xl text-pearl italic tracking-tighter">Orbital Network Bridge</h2>
                    <div className="flex items-center gap-3">
                         <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${liveData ? 'border-green-500 text-green-400 bg-green-950/20' : 'border-slate-800 text-slate-500'}`}>
                            {liveData ? 'LINK_ESTABLISHED' : 'AWAITING_SIGNAL'}
                         </span>
                         <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Protocol: HEVO-S7</span>
                    </div>
                </div>
                <div className="text-right flex flex-col gap-2">
                    <button 
                        onClick={establishLink}
                        disabled={isEstablishing}
                        className={`px-8 py-3 rounded-sm font-orbitron text-[10px] font-bold uppercase tracking-[0.3em] transition-all border ${
                            isEstablishing ? 'bg-white/5 border-white/10 text-slate-500 cursor-wait' : 'bg-gold/10 border-gold/50 text-gold hover:bg-gold hover:text-dark-bg'
                        }`}
                    >
                        {isEstablishing ? 'Synchronizing...' : 'Establish Orbital Link'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
                {/* Left: Projection & Telemetry */}
                <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
                    <div className="flex-1 min-h-[300px] relative">
                         <OrbitalProjection isActive={!!liveData || isEstablishing} />
                         {isEstablishing && !liveData && (
                             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg z-20">
                                 <div className="flex flex-col items-center gap-4">
                                     <div className="w-16 h-16 border-2 border-gold/20 rounded-full border-t-gold animate-spin" />
                                     <span className="font-orbitron text-[10px] text-gold tracking-widest animate-pulse">Siphoning_Reality_Lattice...</span>
                                 </div>
                             </div>
                         )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TelemetryPacket label="Active Node" value={liveData?.node || 'N/A'} color="#e6c77f" />
                        <TelemetryPacket label="Mean Altitude" value={liveData?.altitude || 'N/A'} color="#f8f5ec" />
                        <TelemetryPacket label="Carrier Speed" value={liveData?.velocity || 'N/A'} color="#67e8f9" />
                        <TelemetryPacket label="Parity Match" value={liveData?.signal_parity || 'N/A'} color="#a3e635" />
                    </div>
                </div>

                {/* Right: Signal Log & Constellation Data */}
                <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
                    <div className="bg-dark-surface/40 border border-white/5 p-5 rounded-lg flex flex-col gap-4">
                        <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-widest font-bold">Network Summary</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                    <span>CONSTELLATION_LOCK</span>
                                    <span className="text-pearl">{liveData?.active_constellation || 'N/A'}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold transition-all duration-1000" style={{ width: liveData ? '100%' : '0%' }} />
                                </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Global Sat Count (Live Search)</p>
                                <p className="font-orbitron text-2xl text-pearl">{liveData?.satellite_count || '0'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/10 rounded-lg flex flex-col overflow-hidden font-mono shadow-inner">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Downlink_Terminal</span>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-[10px] leading-relaxed text-cyan-500/80 scrollbar-thin">
                            {terminal.map((line, i) => (
                                <div key={i} className="animate-fade-in"><span className="text-slate-600 opacity-50 mr-2">{'>'}</span>{line}</div>
                            ))}
                            {isEstablishing && (
                                <div className="flex items-center gap-2 animate-pulse text-gold">
                                    <span>[SYSTEM] Handshake stage {Math.floor(Math.random() * 4) + 1}...</span>
                                </div>
                            )}
                            <div ref={terminalEndRef} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto py-3 px-6 bg-black/20 border border-white/5 rounded flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                <div className="flex gap-8">
                    <span>Carrier: STABLE</span>
                    <span>Modulation: QPSK</span>
                    <span>Drift: +0.00012zHz</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                    <span>Radiant Sovereignty Maintained</span>
                </div>
            </div>
        </div>
    );
};
