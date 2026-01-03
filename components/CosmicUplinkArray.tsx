import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SatelliteUplinkData, SatelliteLockStatus, GalacticRelay, OrbMode } from '../types';
import { Tooltip } from './Tooltip';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface CosmicUplinkArrayProps {
  uplinkData: SatelliteUplinkData;
  relayData: Record<string, GalacticRelay>;
  onCalibrate: (relayId: string) => void;
  setOrbMode?: (mode: OrbMode) => void;
  sophiaEngine: SophiaEngineCore | null;
}

const getLockStatusConfig = (status: SatelliteLockStatus) => {
    switch(status) {
        case 'LOCKED':
            return { color: 'text-pearl', label: 'LOCKED', signalColor: '#a3e635', animation: 'none' };
        case 'ACQUIRING':
            return { color: 'text-gold', label: 'SCANNING', signalColor: '#facc15', animation: 'radar-spin 2s linear infinite' };
        case 'DRIFTING':
            return { color: 'text-orange-400', label: 'DRIFT', signalColor: '#fb923c', animation: 'none' };
        case 'OFFLINE':
            return { color: 'text-rose-400', label: 'OFFLINE', signalColor: '#ef4444', animation: 'none' };
        default:
            return { color: 'text-warm-grey', label: 'UNKNOWN', signalColor: '#78716c', animation: 'none' };
    }
}

const CELESTIAL_BODIES: Record<string, { 
    name: string; 
    type: string; 
    ra: number; 
    dec: number; 
    color: string;
    dist: string;
    mag: number; // Apparent Magnitude
}> = {
    'RELAY_ALPHA': { name: 'Alpha Centauri', type: 'Stellar System', ra: 14.65, dec: -60.83, color: '#fcd34d', dist: '4.37 ly', mag: -0.27 },
    'RELAY_BETA': { name: 'Sirius A', type: 'Main Sequence', ra: 6.75, dec: -16.71, color: '#60a5fa', dist: '8.6 ly', mag: -1.46 },
    'RELAY_GAMMA': { name: 'Andromeda (M31)', type: 'Galaxy', ra: 0.71, dec: 41.26, color: '#c084fc', dist: '2.537 Mly', mag: 3.44 },
    'RELAY_DELTA': { name: 'Pleiades (M45)', type: 'Open Cluster', ra: 3.78, dec: 24.11, color: '#34d399', dist: '444 ly', mag: 1.6 },
};

const CONSTELLATIONS = [
    { name: 'Lyra', nodes: [[6.75, -16.71], [7.2, -20], [6.5, -25], [6.75, -16.71]] },
    { name: 'Centaurus', nodes: [[14.65, -60.83], [14, -55], [13.5, -60], [14.65, -60.83]] }
];

const projectCelestial = (ra: number, dec: number) => {
    const angle = (ra / 24) * Math.PI * 2 - (Math.PI / 2);
    const radius = 50 - (dec / 180) * 50; 
    const r = Math.max(8, Math.min(45, radius));
    return {
        cx: 50 + r * Math.cos(angle),
        cy: 50 + r * Math.sin(angle)
    };
};

const CelestialNavigator: React.FC<{ 
    relays: Record<string, GalacticRelay>; 
    lockStatus: SatelliteLockStatus;
    onCalibrate: (id: string) => void;
    calibratingId: string | null;
    liveTelemetry: any;
}> = ({ relays, lockStatus, onCalibrate, calibratingId, liveTelemetry }) => {
    const stars = useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
        id: i, 
        cx: Math.random() * 100, 
        cy: Math.random() * 100, 
        r: Math.random() * 0.4 + 0.05, 
        opacity: Math.random() * 0.5,
        twinkle: Math.random() * 5 + 2
    })), []);

    return (
        <div className="relative w-full aspect-square bg-[#050505] rounded-full border border-white/[0.08] overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,1)] ring-1 ring-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.05)_0%,transparent_70%)]" />
            
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible relative z-10">
                <defs>
                    <filter id="stellarGlow"><feGaussianBlur stdDeviation="0.6" /><feComposite in="SourceGraphic" operator="over" /></filter>
                    <filter id="dataGlow"><feGaussianBlur stdDeviation="2" /><feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 0.8   0 0 0 0 0.5  0 0 0 1 0" /></filter>
                    <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="90%" stopColor="rgba(230, 199, 127, 0.02)" />
                        <stop offset="100%" stopColor="rgba(230, 199, 127, 0.1)" />
                    </radialGradient>
                </defs>

                {/* Star Field with Twinkle */}
                {stars.map(s => (
                    <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity}>
                        <animate attributeName="opacity" values={`${s.opacity};${s.opacity * 0.2};${s.opacity}`} dur={`${s.twinkle}s`} repeatCount="indefinite" />
                    </circle>
                ))}

                {/* Celestial Grid */}
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.1" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
                <line x1="50" y1="2" x2="50" y2="98" stroke="white" strokeWidth="0.05" opacity="0.03" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="white" strokeWidth="0.05" opacity="0.03" />
                
                {/* Active Scanning Sweep */}
                {lockStatus === 'ACQUIRING' && (
                    <g className="animate-[spin_10s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
                        <path d="M 50 50 L 50 2 A 48 48 0 0 1 98 50 Z" fill="url(#radarSweep)" />
                        <line x1="50" y1="50" x2="50" y2="2" stroke="var(--gold)" strokeWidth="0.15" opacity="0.2" />
                    </g>
                )}

                {/* Constellation Outlines (Simplified) */}
                {CONSTELLATIONS.map((c, i) => (
                    <polyline 
                        key={i}
                        points={c.nodes.map(n => {
                            const p = projectCelestial(n[0], n[1]);
                            return `${p.cx},${p.cy}`;
                        }).join(' ')}
                        fill="none"
                        stroke="rgba(109, 40, 217, 0.2)"
                        strokeWidth="0.1"
                        strokeDasharray="0.5 1"
                    />
                ))}

                {/* Origin Point */}
                <circle cx="50" cy="50" r="0.8" fill="var(--pearl)" filter="url(#stellarGlow)" className="animate-pulse" />

                {/* Celestial Relay Nodes */}
                {(Object.values(relays) as GalacticRelay[]).map((relay) => {
                    const body = CELESTIAL_BODIES[relay.id];
                    if (!body) return null;
                    const { cx, cy } = projectCelestial(body.ra, body.dec);
                    const isOnline = relay.status === 'ONLINE';
                    const isCalibrating = calibratingId === relay.id;
                    const magFactor = Math.max(0.5, 2 - (body.mag + 1.5) / 5);
                    
                    return (
                        <g key={`relay-${relay.id}`}>
                            {/* Carrier Beam */}
                            <line 
                                x1="50" y1="50" x2={cx} y2={cy} 
                                stroke={isCalibrating ? 'white' : isOnline ? body.color : 'rgba(244, 63, 94, 0.1)'} 
                                strokeWidth={isCalibrating ? 0.4 : 0.1}
                                strokeDasharray={isOnline ? 'none' : '0.5 1.5'}
                                opacity={isCalibrating ? 0.8 : 0.2}
                                className="transition-all duration-1000"
                            />
                            
                            {/* Target Body (Star/Galaxy) */}
                            <g 
                                onClick={() => onCalibrate(relay.id)} 
                                className="cursor-pointer group/node"
                                style={{ transformOrigin: `${cx}% ${cy}%` }}
                            >
                                <circle 
                                    cx={cx} cy={cy} r={magFactor * (isCalibrating ? 1.5 : 1)} 
                                    fill={isOnline ? body.color : '#1e293b'} 
                                    filter="url(#stellarGlow)"
                                    className="transition-all duration-500 group-hover/node:scale-125 shadow-[0_0_10px_currentColor]"
                                />
                                
                                {isCalibrating && (
                                    <>
                                        <rect x={cx-4} y={cy-4} width="8" height="8" fill="none" stroke="white" strokeWidth="0.1" className="animate-pulse" />
                                        <circle cx={cx} cy={cy} r="2" fill="none" stroke="white" strokeWidth="0.1">
                                            <animate attributeName="r" values="1;6" dur="1.5s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                                        </circle>
                                        {/* Data Pulses towards center */}
                                        <circle r="0.5" fill="white">
                                            <animateMotion dur="1s" repeatCount="indefinite" path={`M ${cx} ${cy} L 50 50`} />
                                        </circle>
                                    </>
                                )}
                            </g>
                        </g>
                    );
                })}
            </svg>
            
            {/* Telemetry Display Overlay */}
            {liveTelemetry && (
                <div className="absolute top-6 left-6 right-6 p-4 bg-black/70 border border-white/10 rounded-sm backdrop-blur-xl animate-fade-in z-30 shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-l-4 border-l-gold">
                    <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                        <div>
                            <span className="text-[8px] font-mono text-gold uppercase tracking-[0.3em] font-bold">LOCK_SEQUENCE_INIT</span>
                            <h5 className="font-orbitron text-sm text-pearl uppercase tracking-tighter mt-1">{liveTelemetry.body}</h5>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">DIST: {liveTelemetry.dist}</span>
                    </div>
                    <p className="text-[11px] font-minerva italic text-pearl/80 leading-relaxed mb-4">"{liveTelemetry.status}"</p>
                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                        <div className="text-center bg-white/5 p-1 rounded-sm"><p className="text-[7px] text-slate-500 uppercase">Magnitude</p><p className="text-[9px] font-mono text-gold">{liveTelemetry.magnitude}</p></div>
                        <div className="text-center bg-white/5 p-1 rounded-sm"><p className="text-[7px] text-slate-500 uppercase">Flux_Rho</p><p className="text-[9px] font-mono text-cyan-400">{liveTelemetry.flux}</p></div>
                        <div className="text-center bg-white/5 p-1 rounded-sm"><p className="text-[7px] text-slate-500 uppercase">Parity</p><p className="text-[9px] font-mono text-green-400">SYNCED</p></div>
                    </div>
                </div>
            )}

            {/* Corner Coordinate HUD */}
            <div className="absolute bottom-6 left-6 font-mono text-[7px] text-slate-600 uppercase tracking-widest pointer-events-none">
                <p>Projection: GRS_80_POLAR</p>
                <p>Epoch: J2000.0</p>
                <p>Parallax: 0.042as</p>
            </div>
        </div>
    );
};

export const CosmicUplinkArray: React.FC<CosmicUplinkArrayProps> = React.memo(({ uplinkData, relayData, onCalibrate, setOrbMode, sophiaEngine }) => {
    const { signalStrength, lockStatus, transmissionProtocol } = uplinkData;
    const lockConfig = getLockStatusConfig(lockStatus);
    const [calibratingId, setCalibratingId] = useState<string | null>(null);
    const [liveTelemetry, setLiveTelemetry] = useState<any>(null);

    const handleCalibrateClick = async (relayId: string) => {
        if (setOrbMode) setOrbMode('CONCORDANCE');
        setCalibratingId(relayId);
        setLiveTelemetry(null);

        const bodyInfo = CELESTIAL_BODIES[relayId];
        if (bodyInfo && sophiaEngine) {
            const data = await sophiaEngine.getCelestialTargetStatus(bodyInfo.name);
            setLiveTelemetry(data);
        }

        onCalibrate(relayId);
        setTimeout(() => {
            setCalibratingId(null);
            if (setOrbMode) setOrbMode('STANDBY');
        }, 8000); 
    };

    const activeCount = (Object.values(relayData) as GalacticRelay[]).filter(r => r.status === 'ONLINE').length;

    return (
        <div className="w-full bg-[#0a0a0a]/70 border border-white/[0.08] p-8 rounded-2xl flex flex-col h-full relative overflow-hidden group shadow-2xl backdrop-blur-3xl transition-all duration-700 hover:border-white/20">
            <div className="flex justify-between items-center mb-10 z-10 border-b border-white/5 pb-5">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_#6d28d9]" />
                        <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#e6c77f]" />
                    </div>
                    <div>
                        <h3 className="font-orbitron text-[12px] text-warm-grey uppercase tracking-[0.4em] font-bold">Astro-Sync Matrix</h3>
                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">Ref: Node_SFO_Celestial_Array</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-sm border border-cyan-800/30 uppercase tracking-widest font-bold">{transmissionProtocol}</span>
                    <span className={`text-[9px] font-mono px-3 py-1 rounded-sm border uppercase tracking-widest ${lockConfig.color} border-current bg-white/5`}>{lockConfig.label}</span>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-12 items-center mb-10 flex-1 min-h-0">
                <div className="w-72 h-72 flex-shrink-0 xl:w-80 xl:h-80">
                    <CelestialNavigator 
                        relays={relayData} 
                        lockStatus={lockStatus} 
                        onCalibrate={handleCalibrateClick}
                        calibratingId={calibratingId}
                        liveTelemetry={liveTelemetry}
                    />
                </div>
                
                <div className="flex-1 w-full space-y-8">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500 font-bold">
                            <span>Matrix_Phase_Integrity</span>
                            <span className="text-pearl">{(signalStrength * 100).toFixed(2)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-violet-600 to-pearl transition-all duration-[2500ms] shadow-[0_0_20px_white]" 
                                style={{ width: `${signalStrength * 100}%` }} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/[0.03] p-5 rounded-lg border border-white/[0.06] transition-all hover:bg-white/[0.05] hover:border-gold/30 group/card">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 font-bold group-hover/card:text-gold transition-colors">Uplink Nodes</p>
                            <p className="font-orbitron text-2xl text-pearl">{activeCount}<span className="text-[12px] opacity-30 ml-2">/ 4</span></p>
                            <div className="mt-3 flex gap-1">
                                {Array.from({length: 4}).map((_, i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i < activeCount ? 'bg-gold shadow-[0_0_5px_#e6c77f]' : 'bg-white/5'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/[0.03] p-5 rounded-lg border border-white/[0.06] transition-all hover:bg-white/[0.05] hover:border-cyan-400/30 group/card">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 font-bold group-hover/card:text-cyan-400 transition-colors">Parity Lock</p>
                            <p className={`font-orbitron text-2xl ${liveTelemetry ? 'text-cyan-400 animate-pulse' : 'text-pearl/60'}`}>
                                {liveTelemetry ? 'ACTIVE' : 'IDLE'}
                            </p>
                            <p className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter mt-3">Drift: {(Math.random() * 0.005).toFixed(4)}zHz</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2 overflow-y-auto pr-3 custom-audit-scrollbar max-h-48">
                {(Object.values(relayData) as GalacticRelay[]).map((relay) => {
                    const body = CELESTIAL_BODIES[relay.id];
                    const isCalibrating = calibratingId === relay.id;
                    const isOnline = relay.status === 'ONLINE';
                    
                    return (
                        <div key={relay.id} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-transparent hover:border-white/[0.1] hover:bg-white/[0.05] transition-all group/node shadow-lg">
                            <div className="flex items-center gap-5">
                                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-rose-500'} ${isCalibrating ? 'animate-ping shadow-[0_0_10px_currentColor]' : ''}`} />
                                <div>
                                    <p className="text-[12px] font-orbitron text-pearl leading-none mb-1.5 group-hover/node:text-gold transition-colors font-bold uppercase tracking-widest">{relay.name}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                                            COORD: {body?.ra}h / {body?.dec}°
                                        </span>
                                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">DIST: {body?.dist}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleCalibrateClick(relay.id)}
                                disabled={isCalibrating}
                                className={`px-5 py-2 rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] transition-all border shadow-lg active:scale-95 ${
                                    isCalibrating 
                                        ? 'border-gold text-gold animate-pulse bg-gold/10'
                                        : 'border-white/10 text-slate-400 hover:border-gold hover:text-gold bg-white/5'
                                }`}
                            >
                                {isCalibrating ? 'SYNCING...' : 'ALIGN'}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <style>{`
                .custom-audit-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-audit-scrollbar::-webkit-scrollbar-thumb { background: rgba(109, 40, 217, 0.2); border-radius: 10px; border: 1px solid rgba(255,255,255,0.02); }
                .custom-audit-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(109, 40, 217, 0.4); }
            `}</style>
        </div>
    );
});