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

// REAL ASTRONOMICAL DATA (Standard Epoch RA/Dec)
const CELESTIAL_BODIES: Record<string, { 
    name: string; 
    type: string; 
    ra: number; // Hours
    dec: number; // Degrees
    color: string;
    dist: string;
}> = {
    'RELAY_ALPHA': { name: 'Alpha Centauri', type: 'Stellar System', ra: 14.65, dec: -60.83, color: '#fcd34d', dist: '4.37 ly' },
    'RELAY_BETA': { name: 'Sirius A', type: 'Main Sequence', ra: 6.75, dec: -16.71, color: '#60a5fa', dist: '8.6 ly' },
    'RELAY_GAMMA': { name: 'Andromeda (M31)', type: 'Galaxy', ra: 0.71, dec: 41.26, color: '#c084fc', dist: '2.537 Mly' },
    'RELAY_DELTA': { name: 'Pleiades (M45)', type: 'Open Cluster', ra: 3.78, dec: 24.11, color: '#34d399', dist: '444 ly' },
};

// Coordinate Projection Helper (Polar Planisphere)
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
    const stars = useMemo(() => Array.from({ length: 120 }).map((_, i) => ({
        id: i, cx: Math.random() * 100, cy: Math.random() * 100, r: Math.random() * 0.3 + 0.05, opacity: Math.random() * 0.4
    })), []);

    return (
        <div className="relative w-full aspect-square bg-[#050505]/80 rounded-full border border-white/[0.08] overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,1)] ring-1 ring-white/5">
            {/* Background Grid */}
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <defs>
                    <filter id="stellarGlow"><feGaussianBlur stdDeviation="0.4" /><feComposite in="SourceGraphic" operator="over" /></filter>
                    <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="90%" stopColor="rgba(230, 199, 127, 0.03)" />
                        <stop offset="100%" stopColor="rgba(230, 199, 127, 0.15)" />
                    </radialGradient>
                </defs>

                {/* Star Field */}
                {stars.map(s => <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity} />)}

                {/* Planisphere Grid */}
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.1" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.1" />
                <line x1="50" y1="2" x2="50" y2="98" stroke="white" strokeWidth="0.05" opacity="0.05" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="white" strokeWidth="0.05" opacity="0.05" />
                
                {/* Active Sweep */}
                {lockStatus === 'ACQUIRING' && (
                    <g className="animate-[spin_8s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
                        <path d="M 50 50 L 50 2 A 48 48 0 0 1 98 50 Z" fill="url(#radarSweep)" />
                        <line x1="50" y1="50" x2="50" y2="2" stroke="var(--gold)" strokeWidth="0.2" opacity="0.3" />
                    </g>
                )}

                {/* Core Node */}
                <circle cx="50" cy="50" r="1.2" fill="var(--pearl)" filter="url(#stellarGlow)" className="animate-pulse shadow-[0_0_10px_white]" />

                {/* Celestial Relay Mapping */}
                {(Object.values(relays) as GalacticRelay[]).map((relay) => {
                    const body = CELESTIAL_BODIES[relay.id];
                    if (!body) return null;
                    const { cx, cy } = projectCelestial(body.ra, body.dec);
                    const isOnline = relay.status === 'ONLINE';
                    const isCalibrating = calibratingId === relay.id;
                    
                    return (
                        <g key={`relay-${relay.id}`}>
                            <line 
                                x1="50" y1="50" x2={cx} y2={cy} 
                                stroke={isCalibrating ? 'white' : isOnline ? body.color : 'rgba(244, 63, 94, 0.2)'} 
                                strokeWidth={isCalibrating ? 0.6 : 0.15}
                                strokeDasharray={isOnline ? 'none' : '1 2'}
                                opacity={isCalibrating ? 0.8 : 0.3}
                                className="transition-all duration-1000"
                            />
                            <g 
                                onClick={() => onCalibrate(relay.id)} 
                                className="cursor-pointer group/relay-node"
                                style={{ transformOrigin: `${cx}% ${cy}%` }}
                            >
                                <circle 
                                    cx={cx} cy={cy} r={isCalibrating ? 3 : 1.2} 
                                    fill={isOnline ? body.color : '#1e293b'} 
                                    filter="url(#stellarGlow)"
                                    className="transition-all duration-500 group-hover/relay-node:scale-150"
                                />
                                {isCalibrating && (
                                    <circle cx={cx} cy={cy} r={4} fill="none" stroke="white" strokeWidth="0.2">
                                        <animate attributeName="r" values="1;6" dur="1s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite" />
                                    </circle>
                                )}
                            </g>
                        </g>
                    );
                })}
            </svg>
            
            {/* Live Data Inset */}
            {liveTelemetry && (
                <div className="absolute top-4 left-4 right-4 p-3 bg-black/60 border border-white/10 rounded-sm backdrop-blur-md animate-fade-in z-20 shadow-2xl">
                    <div className="flex justify-between items-start mb-1.5 border-b border-white/10 pb-1">
                        <span className="text-[7px] font-mono text-gold uppercase tracking-widest font-bold">LOCK: {liveTelemetry.body}</span>
                        <span className="text-[7px] font-mono text-slate-500">DIST: {liveTelemetry.dist}</span>
                    </div>
                    <p className="text-[10px] font-minerva italic text-pearl/90 leading-tight mb-2">"{liveTelemetry.status}"</p>
                    <div className="flex justify-around bg-white/5 py-1 rounded-sm">
                        <div className="text-center"><p className="text-[6px] text-slate-500 uppercase">Flux</p><p className="text-[8px] font-mono text-cyan-400">{liveTelemetry.flux}</p></div>
                        <div className="text-center"><p className="text-[6px] text-slate-500 uppercase">Mag</p><p className="text-[8px] font-mono text-gold">{liveTelemetry.magnitude}</p></div>
                    </div>
                </div>
            )}
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
        <div className="w-full bg-[#0a0a0a]/60 border border-white/[0.08] p-6 rounded-xl flex flex-col h-full relative overflow-hidden group shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-8 z-10 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500/40" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                    </div>
                    <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Celestial Mapping Unit</h3>
                </div>
                <div className="flex gap-2">
                    <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-800/30 uppercase tracking-widest">{transmissionProtocol}</span>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${lockConfig.color} border-current opacity-60`}>{lockConfig.label}</span>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-10 items-center mb-8 flex-1 min-h-0">
                <div className="w-64 h-64 flex-shrink-0">
                    <CelestialNavigator 
                        relays={relayData} 
                        lockStatus={lockStatus} 
                        onCalibrate={handleCalibrateClick}
                        calibratingId={calibratingId}
                        liveTelemetry={liveTelemetry}
                    />
                </div>
                
                <div className="flex-1 w-full space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500">
                            <span>Relay_Sync_Integrity</span>
                            <span className="text-pearl">{(signalStrength * 100).toFixed(2)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-pearl transition-all duration-[2000ms] shadow-[0_0_15px_white]" 
                                style={{ width: `${signalStrength * 100}%` }} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.02] p-4 rounded-sm border border-white/[0.05] transition-all hover:bg-white/[0.04]">
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Active Nodes</p>
                            <p className="font-orbitron text-xl text-pearl">{activeCount}<span className="text-[10px] opacity-30 ml-2">/ 4</span></p>
                        </div>
                        <div className="bg-white/[0.02] p-4 rounded-sm border border-white/[0.05] transition-all hover:bg-white/[0.04]">
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Drift Parity</p>
                            <p className={`font-orbitron text-xl ${uplinkData.hevoLatency > 50 ? 'text-gold' : 'text-cyan-400'}`}>
                                {liveTelemetry ? 'SYNC_ACTIVE' : 'MONITORING'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5 overflow-y-auto pr-2 custom-audit-scrollbar max-h-40">
                {(Object.values(relayData) as GalacticRelay[]).map((relay) => {
                    const body = CELESTIAL_BODIES[relay.id];
                    const isCalibrating = calibratingId === relay.id;
                    const isOnline = relay.status === 'ONLINE';
                    
                    return (
                        <div key={relay.id} className="flex items-center justify-between p-2.5 rounded-sm bg-white/[0.02] border border-transparent hover:border-white/[0.1] transition-all group/node">
                            <div className="flex items-center gap-4">
                                <div className={`w-1 h-1 rounded-full ${isOnline ? 'bg-green-500' : 'bg-rose-500'} ${isCalibrating ? 'animate-ping' : ''}`} />
                                <div>
                                    <p className="text-[10px] font-orbitron text-pearl leading-none mb-1 group-hover/node:text-gold transition-colors">{relay.name}</p>
                                    <p className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">
                                        TARGET: {body?.name} // RA {body?.ra}h
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleCalibrateClick(relay.id)}
                                disabled={isCalibrating}
                                className={`px-4 py-1.5 rounded-sm text-[8px] font-bold uppercase transition-all border ${
                                    isCalibrating 
                                        ? 'border-gold text-gold animate-pulse'
                                        : 'border-white/10 text-slate-500 hover:border-pearl hover:text-pearl bg-white/5'
                                }`}
                            >
                                {isCalibrating ? 'CALIBRATING' : 'ALIGN'}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <style>{`
                .custom-audit-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-audit-scrollbar::-webkit-scrollbar-thumb { background: rgba(109, 40, 217, 0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
});