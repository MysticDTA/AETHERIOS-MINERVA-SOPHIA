import React, { useState, useEffect, useRef } from 'react';
import { SystemState } from '../types.ts';
import { AudioEngine } from './audio/AudioEngine.ts';
import { QuantumSecuritySentinel } from './QuantumSecuritySentinel.tsx';
import { QuantumSentinelPulse } from './QuantumSentinelPulse.tsx';

interface SecurityShieldAuditProps {
    systemState: SystemState;
    setSystemState?: React.Dispatch<React.SetStateAction<SystemState>>;
    audioEngine?: AudioEngine | null;
}

interface ShieldNode {
    id: number;
    x: number;
    y: number;
    z: number;
    integrity: number;
    isEntangled: boolean;
    phase: number;
}

interface ThreatVector {
    id: number;
    x: number;
    y: number;
    z: number;
    velocity: number;
    type: 'DECOHERENCE' | 'ENTROPIC' | 'MALWARE';
}

const SHIELD_RADIUS = 120;
const NODE_COUNT = 32;

export const SecurityShieldAudit: React.FC<SecurityShieldAuditProps> = ({ systemState, setSystemState, audioEngine }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<'SHIELD' | 'SENTINEL'>('SHIELD');
    const [shieldIntegrity, setShieldIntegrity] = useState(1.0);
    const [zenoMode, setZenoMode] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([
        "Initializing Quantum Zeno Protocol...",
        "Lattice Topology: ICOSAHEDRON_SPIN_1/2",
        "Waiting for causal intercept..."
    ]);

    const nodesRef = useRef<ShieldNode[]>([]);
    const threatsRef = useRef<ThreatVector[]>([]);
    const rotationRef = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const phi = Math.PI * (3 - Math.sqrt(5));
        const newNodes: ShieldNode[] = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            const y = 1 - (i / (NODE_COUNT - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;
            newNodes.push({
                id: i,
                x: Math.cos(theta) * radius * SHIELD_RADIUS,
                y: y * SHIELD_RADIUS,
                z: Math.sin(theta) * radius * SHIELD_RADIUS,
                integrity: 1.0,
                isEntangled: true,
                phase: Math.random() * Math.PI * 2
            });
        }
        nodesRef.current = newNodes;
    }, []);

    useEffect(() => {
        if (viewMode !== 'SHIELD') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let frameCount = 0;

        const render = () => {
            frameCount++;
            const width = canvas.width;
            const height = canvas.height;
            const cx = width / 2;
            const cy = height / 2;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, width, height);

            if (!isDragging.current) {
                rotationRef.current.y += zenoMode ? 0.001 : 0.005; 
                rotationRef.current.x += 0.002;
            }

            if (frameCount % (zenoMode ? 120 : 60) === 0 && Math.random() > 0.3) {
                const angle = Math.random() * Math.PI * 2;
                const spawnDist = 400;
                threatsRef.current.push({
                    id: Date.now() + Math.random(),
                    x: Math.cos(angle) * spawnDist,
                    y: (Math.random() - 0.5) * spawnDist,
                    z: Math.sin(angle) * spawnDist,
                    velocity: 2 + Math.random() * 2,
                    type: Math.random() > 0.7 ? 'ENTROPIC' : 'DECOHERENCE'
                });
            }

            threatsRef.current.forEach((threat, tIdx) => {
                const dist = Math.sqrt(threat.x**2 + threat.y**2 + threat.z**2);
                if (dist > SHIELD_RADIUS + 10) {
                    const speed = threat.velocity * (zenoMode ? 0.5 : 1.0);
                    threat.x -= (threat.x / dist) * speed;
                    threat.y -= (threat.y / dist) * speed;
                    threat.z -= (threat.z / dist) * speed;
                } else {
                    const targetNodeIdx = Math.floor(Math.random() * nodesRef.current.length);
                    const targetNode = nodesRef.current[targetNodeIdx];
                    targetNode.integrity = Math.max(0, targetNode.integrity - 0.4);
                    targetNode.isEntangled = false;
                    
                    ctx.beginPath();
                    ctx.arc(cx + threat.x * 0.5, cy + threat.y * 0.5, 20, 0, Math.PI*2);
                    ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
                    ctx.fill();

                    if (Math.random() > 0.5) audioEngine?.playUIClick();
                    threatsRef.current.splice(tIdx, 1);
                    setTerminalLogs(prev => [`[ALERT] IMPACT_DETECTOR: NODE_${targetNode.id} DEVIATION DETECTED`, ...prev.slice(0, 4)]);
                    
                    if (setSystemState) {
                        setSystemState(prev => ({
                            ...prev,
                            quantumHealing: {
                                ...prev.quantumHealing,
                                stabilizationShield: Math.max(0, prev.quantumHealing.stabilizationShield - 0.05),
                                decoherence: Math.min(1, prev.quantumHealing.decoherence + 0.02)
                            }
                        }));
                    }
                }
            });

            const projectedNodes = nodesRef.current.map(node => {
                const cosX = Math.cos(rotationRef.current.x);
                const sinX = Math.sin(rotationRef.current.x);
                const cosY = Math.cos(rotationRef.current.y);
                const sinY = Math.sin(rotationRef.current.y);
                let y = node.y * cosX - node.z * sinX;
                let z = node.y * sinX + node.z * cosX;
                let x = node.x * cosY - z * sinY;
                z = node.x * sinY + z * cosY;
                const scale = 400 / (400 + z);
                return { ...node, px: cx + x * scale, py: cy + y * scale, scale, z };
            }).sort((a, b) => a.z - b.z);

            projectedNodes.forEach(node => {
                const alpha = Math.max(0.1, (node.z + SHIELD_RADIUS) / (SHIELD_RADIUS * 2));
                ctx.beginPath();
                ctx.arc(node.px, node.py, 3 * node.scale, 0, Math.PI * 2);
                if (node.integrity < 0.3) ctx.fillStyle = `rgba(244, 63, 94, ${alpha})`;
                else if (node.integrity < 0.8) ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`;
                else ctx.fillStyle = zenoMode ? `rgba(167, 139, 250, ${alpha})` : `rgba(16, 185, 129, ${alpha})`;
                ctx.fill();

                const neighbors = projectedNodes
                    .filter(n => n.id !== node.id)
                    .sort((a, b) => Math.hypot(a.px - node.px, a.py - node.py) - Math.hypot(b.px - node.px, b.py - node.py))
                    .slice(0, 3);
                
                neighbors.forEach(n => {
                    ctx.beginPath();
                    ctx.moveTo(node.px, node.py);
                    ctx.lineTo(n.px, n.py);
                    ctx.strokeStyle = node.integrity < 0.5 ? `rgba(244, 63, 94, ${alpha * 0.3})` : `rgba(16, 185, 129, ${alpha * 0.15})`;
                    ctx.lineWidth = 1 * node.scale;
                    ctx.stroke();
                });
            });

            const totalInt = nodesRef.current.reduce((acc, n) => acc + n.integrity, 0) / NODE_COUNT;
            if (Math.abs(totalInt - shieldIntegrity) > 0.01) {
                setShieldIntegrity(totalInt);
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [zenoMode, viewMode]);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current || viewMode !== 'SHIELD') return;
        const resize = () => {
            if (canvasRef.current && containerRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [viewMode]);

    const handleRepair = () => {
        audioEngine?.playAscensionChime();
        setTerminalLogs(prev => ["INITIATING_LATTICE_REENTANGLEMENT...", ...prev]);
        nodesRef.current.forEach(n => {
            if (n.integrity < 1.0) {
                n.integrity = 1.0;
                n.isEntangled = true;
            }
        });
        if (setSystemState) {
            setSystemState(prev => ({
                ...prev,
                quantumHealing: {
                    ...prev.quantumHealing,
                    stabilizationShield: 1.0,
                    health: Math.min(1.0, prev.quantumHealing.health + 0.1)
                }
            }));
        }
    };

    const handleZenoToggle = () => {
        setZenoMode(!zenoMode);
        audioEngine?.playEffect('synthesis');
        setTerminalLogs(prev => [!zenoMode ? "QUANTUM_ZENO_ACTIVE: COLLAPSING_THREAT_WAVEFUNCTION" : "PASSIVE_MONITORING_RESUMED", ...prev]);
    };

    const handlePulse = () => {
        setIsPulsing(true);
        audioEngine?.playGroundingDischarge();
        setTerminalLogs(prev => ["HARMONIC_PULSE_EMITTED: CLEARING_ENTROPIC_VECTORS", ...prev]);
        threatsRef.current = [];
        setTimeout(() => setIsPulsing(false), 2000);
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in relative pb-10">
            <div className="flex justify-between items-end border-b border-white/10 pb-6 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-900/10 border border-emerald-500/30 flex items-center justify-center font-orbitron text-emerald-400 text-3xl shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse">
                        🛡
                    </div>
                    <div>
                        <h2 className="font-orbitron text-3xl text-pearl tracking-tighter uppercase font-extrabold text-glow-pearl">Quantum Shield Integrated</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Active Lattice Defense // Grade_S++</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 bg-black/40 p-1 rounded-lg border border-white/10">
                    <button onClick={() => setViewMode('SHIELD')} className={`px-4 py-2 rounded font-orbitron text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'SHIELD' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-white'}`}>3D_Lattice</button>
                    <button onClick={() => setViewMode('SENTINEL')} className={`px-4 py-2 rounded font-orbitron text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'SENTINEL' ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30' : 'text-slate-500 hover:text-white'}`}>Sentinel_Ops</button>
                </div>
            </div>

            {viewMode === 'SENTINEL' ? (
                <QuantumSecuritySentinel audioEngine={audioEngine} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                    <div className="lg:col-span-8 bg-black/80 border border-white/5 rounded-xl relative overflow-hidden shadow-2xl flex flex-col group" ref={containerRef}>
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${zenoMode ? 'bg-violet-500 animate-ping' : 'bg-slate-600'}`} />
                                <span className={`text-[10px] font-mono uppercase font-bold tracking-widest ${zenoMode ? 'text-violet-300' : 'text-slate-500'}`}>
                                    ZENO_OBSERVATION: {zenoMode ? 'ACTIVE' : 'PASSIVE'}
                                </span>
                            </div>
                        </div>

                        <canvas 
                            ref={canvasRef} 
                            className="flex-1 w-full h-full block cursor-crosshair"
                            onMouseDown={(e) => { isDragging.current = true; lastMousePos.current = { x: e.clientX, y: e.clientY }; }}
                            onMouseMove={(e) => {
                                if (isDragging.current) {
                                    const dx = e.clientX - lastMousePos.current.x;
                                    const dy = e.clientY - lastMousePos.current.y;
                                    rotationRef.current.y += dx * 0.01;
                                    rotationRef.current.x += dy * 0.01;
                                    lastMousePos.current = { x: e.clientX, y: e.clientY };
                                }
                            }}
                            onMouseUp={() => isDragging.current = false}
                            onMouseLeave={() => isDragging.current = false}
                        />

                        <QuantumSentinelPulse active={isPulsing} resonance={systemState.resonanceFactorRho} color="#ffd700" />

                        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center gap-6 z-20">
                            <button onClick={handleRepair} className="px-6 py-3 bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all rounded-sm shadow-lg active:scale-95">Entangle Repair</button>
                            <button onClick={handleZenoToggle} className={`px-6 py-3 border font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm shadow-lg active:scale-95 ${zenoMode ? 'bg-violet-600 text-white border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.4)]' : 'bg-violet-900/20 border-violet-500/30 text-violet-300 hover:bg-violet-800/40'}`}>{zenoMode ? 'Disengage Zeno' : 'Engage Zeno Protocol'}</button>
                            <button onClick={handlePulse} className="px-6 py-3 bg-gold/10 border border-gold/30 text-gold font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all rounded-sm shadow-lg active:scale-95">Sentinel Pulse</button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
                        <div className="flex-1 bg-black/60 border border-white/5 rounded-xl p-6 flex flex-col shadow-inner">
                            <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mb-4 border-b border-white/5 pb-2">Defense Terminal</h4>
                            <div className="flex-1 overflow-y-auto scrollbar-thin font-mono text-[10px] space-y-2">
                                {terminalLogs.map((log, i) => (
                                    <div key={i} className="flex gap-3 animate-fade-in">
                                        <span className="text-slate-700 font-bold opacity-50">{(Date.now() - i*1000).toString().slice(-6)}</span>
                                        <span className={log.includes('ALERT') ? 'text-rose-400 font-bold' : log.includes('INITIATING') ? 'text-emerald-400' : 'text-slate-400'}>{log}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
