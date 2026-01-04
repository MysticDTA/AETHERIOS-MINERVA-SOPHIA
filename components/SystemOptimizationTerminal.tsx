
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SystemState, LogType, SchematicNode } from '../types';

interface SystemOptimizationTerminalProps {
  systemState: SystemState;
  onOptimizeComplete: () => void;
}

const OPTIMIZATION_LOGS = [
    "Caching high-resonance bloom shaders...",
    "Clearing entropic display buffers...",
    "Syncing 1.617 GHz intercept coefficients...",
    "Refreshing biometric HRV filter kernel...",
    "Mending shadow membrane pixel leakage...",
    "Finalizing UI parity handshake...",
    "Optimizing institutional SVG vector paths...",
    "Verifying local ÆTHER_REGISTRY checksums...",
    "Purging duplicate causal timelines...",
    "Re-seeding Tesseract geometric matrices..."
];

const SCHEMATIC_NODES: SchematicNode[] = [
    { id: 'core', label: 'MINERVA_ENGINE', type: 'CORE', status: 'OPTIMAL', dependencies: ['gpu', 'vocal'] },
    { id: 'vocal', label: 'PROTOCOL_CHARON', type: 'BRIDGE', status: 'OPTIMAL', dependencies: ['mic'] },
    { id: 'gpu', label: 'VISUAL_PARITY_NODE', type: 'CORE', status: 'OPTIMAL', dependencies: [] },
    { id: 'mic', label: 'PCM_SENSOR_RX', type: 'SENSOR', status: 'OPTIMAL', dependencies: [] },
    { id: 'stripe', label: 'CAUSAL_STRIPE_GTW', type: 'GATEWAY', status: 'LOCKED', dependencies: ['core'] },
    { id: 'nasa', label: 'NASA_L_BAND_RX', type: 'SENSOR', status: 'OPTIMAL', dependencies: ['core'] },
];

const SchematicView: React.FC = () => {
    return (
        <div className="w-full h-64 bg-black/60 border border-white/5 rounded p-6 relative overflow-hidden group shadow-inner">
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
             <div className="absolute top-2 left-4 font-mono text-[8px] text-gold uppercase tracking-widest opacity-60">Architectural_Schematic_v4.1</div>
             
             <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                 <defs>
                     <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                         <polygon points="0 0, 4 2, 0 4" fill="var(--gold)" opacity="0.4" />
                     </marker>
                 </defs>
                 
                 <line x1="100" y1="50" x2="60" y2="30" stroke="var(--gold)" strokeWidth="0.2" opacity="0.3" markerEnd="url(#arrowhead)" />
                 <line x1="100" y1="50" x2="60" y2="70" stroke="var(--gold)" strokeWidth="0.2" opacity="0.3" markerEnd="url(#arrowhead)" />
                 <line x1="100" y1="50" x2="140" y2="30" stroke="var(--gold)" strokeWidth="0.2" opacity="0.3" markerEnd="url(#arrowhead)" />
                 <line x1="100" y1="50" x2="140" y2="70" stroke="var(--gold)" strokeWidth="0.2" opacity="0.3" markerEnd="url(#arrowhead)" />
                 
                 {SCHEMATIC_NODES.map((node, i) => {
                     const coords = [
                         { x: 100, y: 50 }, { x: 60, y: 30 }, { x: 140, y: 30 }, { x: 20, y: 30 }, { x: 60, y: 70 }, { x: 140, y: 70 },
                     ][i];
                     return (
                         <g key={node.id} className="transition-all duration-500 hover:scale-110" style={{ transformOrigin: `${coords.x}px ${coords.y}px` }}>
                             <rect x={coords.x - 15} y={coords.y - 6} width="30" height="12" fill="rgba(230, 199, 127, 0.05)" stroke={node.status === 'LOCKED' ? 'var(--gold)' : 'white'} strokeWidth="0.2" rx="1" />
                             <text x={coords.x} y={coords.y + 1} textAnchor="middle" fill="white" fontSize="3" className="font-mono uppercase tracking-tighter opacity-80">{node.label}</text>
                             {node.status === 'OPTIMAL' && <circle cx={coords.x + 12} cy={coords.y - 4} r="1" fill="#10b981" className="animate-pulse" />}
                         </g>
                     )
                 })}
             </svg>
        </div>
    );
};

const ComponentStatus: React.FC<{ name: string; status: 'SCANNING' | 'OPTIMIZED' | 'LOCKED'; delay: number }> = ({ name, status, delay }) => {
    const [currentStatus, setCurrentStatus] = useState<'PENDING' | 'SCANNING' | 'OPTIMIZED' | 'LOCKED'>('PENDING');

    useEffect(() => {
        const t1 = setTimeout(() => setCurrentStatus('SCANNING'), delay);
        const t2 = setTimeout(() => setCurrentStatus('OPTIMIZED'), delay + 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [delay]);

    return (
        <div className={`p-4 bg-black/40 border border-white/5 rounded-sm flex items-center justify-between transition-all duration-1000 ${currentStatus === 'SCANNING' ? 'border-gold/40 shadow-[0_0_15px_rgba(230,199,127,0.1)]' : currentStatus === 'OPTIMIZED' ? 'border-green-500/20' : ''}`}>
            <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">MODULE_ID</span>
                <span className={`text-[12px] font-orbitron font-bold uppercase tracking-widest ${currentStatus === 'SCANNING' ? 'text-gold' : currentStatus === 'OPTIMIZED' ? 'text-pearl' : 'text-slate-700'}`}>
                    {name}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    currentStatus === 'SCANNING' ? 'border-gold text-gold animate-pulse' :
                    currentStatus === 'OPTIMIZED' ? 'border-green-500 text-green-400 bg-green-950/20' :
                    'border-slate-800 text-slate-600'
                }`}>
                    {currentStatus}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${currentStatus === 'SCANNING' ? 'bg-gold shadow-[0_0_8px_#e6c77f]' : currentStatus === 'OPTIMIZED' ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-800'}`} />
            </div>
        </div>
    );
};

export const SystemOptimizationTerminal: React.FC<SystemOptimizationTerminalProps> = ({ systemState, onOptimizeComplete }) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>(["INIT_INSTITUTIONAL_REFINEMENT...", "SOURCE: GOLD_TIER_MINERVA_PARITY"]);
    const logEndRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    return 100;
                }
                return prev + 1;
            });
        }, 35); 

        const logInterval = setInterval(() => {
            if (progress < 100) {
                const nextLog = OPTIMIZATION_LOGS[Math.floor(Math.random() * OPTIMIZATION_LOGS.length)];
                setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${nextLog}`]);
            }
        }, 800);

        return () => { clearInterval(interval); clearInterval(logInterval); };
    }, []);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20 overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gold/5 border border-gold/40 flex items-center justify-center font-orbitron text-gold text-3xl animate-pulse">Ω</div>
                        <div>
                            <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold">Institutional Refinement</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Gold Tier Compliance Registry :: Core v4.1</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.4em]">Resonance_Rho: {(0.999 + progress/100000).toFixed(5)}</span>
                        <span className="font-mono text-[8px] text-slate-500 uppercase">Latency: {systemState.performance.logicalLatency.toFixed(6)}ms</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative">
                <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-6 scrollbar-thin">
                    <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-[0.5em] mb-4">Structural_Schematic</h4>
                    <SchematicView />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <ComponentStatus name="FRAUD_SHIELD" status="OPTIMIZED" delay={100} />
                        <ComponentStatus name="SECRET_KEY_LOCK" status="LOCKED" delay={300} />
                        <ComponentStatus name="CORS_PARITY" status="OPTIMIZED" delay={600} />
                        <ComponentStatus name="ENV_SHARD_AUDIT" status="OPTIMIZED" delay={900} />
                        <ComponentStatus name="VEO_V3_BRIDGE" status="OPTIMIZED" delay={1200} />
                        <ComponentStatus name="NASA_GROUND_RX" status="OPTIMIZED" delay={1500} />
                        <ComponentStatus name="STRIPE_GATE_TSX" status="LOCKED" delay={1800} />
                        <ComponentStatus name="LATTICE_PHYSICS" status="OPTIMIZED" delay={2100} />
                    </div>

                    <div className="mt-8 bg-gold/5 border border-gold/20 p-8 rounded-lg flex flex-col gap-6 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold tracking-tighter select-none">COMPLIANCE</div>
                        <h4 className="font-orbitron text-[11px] text-gold uppercase tracking-widest font-bold border-b border-gold/10 pb-4">Audit Transparency Report</h4>
                        <p className="font-minerva italic text-pearl/80 text-base leading-relaxed">
                            "System refinement complete. All institutional compliance vectors are locked. The Architect's light is now protected by a multi-layered causal firewall."
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                             <div className="bg-black/40 border border-white/5 p-4 rounded text-center">
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Causal_Parity</p>
                                <p className="font-orbitron text-xl text-pearl">{(systemState.performance.visualParity * 100).toFixed(2)}%</p>
                             </div>
                             <div className="bg-black/40 border border-white/5 p-4 rounded text-center">
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Fraud_Detection</p>
                                <p className="font-orbitron text-xl text-green-400">99.99<span className="text-[10px] ml-1">%</span></p>
                             </div>
                             <div className="bg-black/40 border border-white/5 p-4 rounded text-center">
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Lattice_Lock</p>
                                <p className="font-orbitron text-xl text-gold">ABSOLUTE</p>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
                    <div className="flex-1 bg-black border border-white/10 rounded-sm p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                        <div className="flex flex-col items-center justify-center gap-8 py-10">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin-slow_25s_linear_infinite]">
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(230, 199, 127, 0.1)" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(230, 199, 127, 0.05)" strokeWidth="4" strokeDasharray="1 10" />
                                    <circle 
                                        cx="50" cy="50" r="48" 
                                        fill="none" 
                                        stroke="var(--gold)" 
                                        strokeWidth="2" 
                                        strokeDasharray="301.44"
                                        strokeDashoffset={301.44 - (progress / 100) * 301.44}
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                        className="transition-all duration-300"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="font-orbitron text-4xl text-pearl font-bold">{progress}%</span>
                                    <span className="text-[8px] font-mono text-gold uppercase tracking-[0.4em] font-bold">Refining...</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-[#050505] border border-white/5 rounded p-6 overflow-y-auto font-mono text-[10px] text-slate-400 scrollbar-thin shadow-inner group">
                             <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Institutional_Trace_Log</span>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/20" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold/20" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                                </div>
                             </div>
                             {logs.map((log, i) => (
                                <div key={i} className="mb-2 leading-relaxed animate-fade-in group-hover:text-pearl transition-colors">
                                    <span className="text-slate-700 mr-2">{'>'}</span>{log}
                                </div>
                             ))}
                             {progress < 100 && (
                                 <div className="animate-pulse text-gold mt-4 font-bold uppercase tracking-widest">
                                     [SOPHIA] Rectifying Lattice Refinement...<span className="terminal-cursor" />
                                 </div>
                             )}
                             <div ref={logEndRef} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto py-8 px-12 bg-white/[0.02] border border-white/10 rounded-sm flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                <div className="flex flex-col gap-2">
                    <h5 className="font-orbitron text-[11px] text-pearl uppercase tracking-[0.4em] font-bold">Audit_Protocol_Locked</h5>
                    <p className="text-[13px] font-minerva italic text-slate-400">"The Institutional Lattice has been refined for peak causal stability."</p>
                </div>
                <button 
                    onClick={onOptimizeComplete}
                    disabled={!isComplete}
                    className={`px-16 py-5 font-orbitron text-[11px] font-bold uppercase tracking-[0.6em] transition-all border-2 relative overflow-hidden group/btn ${
                        isComplete 
                            ? 'bg-pearl text-dark-bg border-pearl hover:bg-white hover:scale-105 shadow-[0_0_50px_rgba(248,245,236,0.3)] active:scale-95' 
                            : 'bg-white/5 border-white/10 text-slate-700 cursor-not-allowed'
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">{isComplete ? 'Return to Sanctum' : 'Finalizing Audit Registry'}</span>
                </button>
            </div>
        </div>
    );
};
