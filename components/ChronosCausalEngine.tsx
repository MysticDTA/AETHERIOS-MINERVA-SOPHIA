
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SystemState, ChronosState, TimelineType } from '../types';
import { AudioEngine } from './audio/AudioEngine';

interface ChronosCausalEngineProps {
    systemState: SystemState;
    setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
    audioEngine?: AudioEngine | null;
}

const ProbabilityCone: React.FC<{ type: TimelineType; progress: number; variance: number; active: boolean }> = ({ type, progress, variance, active }) => {
    const lineRef = useRef<any>(null);
    
    const points = useMemo(() => {
        const pts = [];
        const length = 50;
        for (let i = 0; i < length; i++) {
            const t = i / length;
            let y = 0;
            let x = t * 30; // Time forward
            let z = 0;

            if (type === 'GOLDEN') {
                y = Math.pow(t * 3, 2); // Exponential growth
            } else if (type === 'SHADOW') {
                y = -Math.pow(t * 3, 2); // Decay
            } else {
                y = Math.sin(t * 10) * 2; // Inertial / Flat
            }

            // Apply variance noise
            y += (Math.random() - 0.5) * variance * 2 * t; 

            pts.push(new THREE.Vector3(x, y, z));
        }
        return pts;
    }, [type, variance]);

    useFrame((state) => {
        if (lineRef.current) {
            lineRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    const color = type === 'GOLDEN' ? '#ffd700' : type === 'SHADOW' ? '#f43f5e' : '#94a3b8';
    const opacity = active ? 1 : 0.2;
    const width = active ? 3 : 1;

    return (
        <group>
            <Line 
                ref={lineRef}
                points={points}
                color={color}
                lineWidth={width}
                transparent
                opacity={opacity}
                dashed={!active}
            />
            {active && (
                <mesh position={[progress * 30, points[Math.floor(progress * 49)].y, 0]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            )}
        </group>
    );
};

const ButterflyEffectNode: React.FC<{ x: number, y: number, label: string, active: boolean }> = ({ x, y, label, active }) => (
    <div className={`absolute p-3 rounded border backdrop-blur-md transition-all duration-500 ${active ? 'bg-gold/20 border-gold text-gold scale-110 z-20' : 'bg-black/60 border-white/10 text-slate-500 scale-100 z-10'}`}
         style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
        <div className="text-[8px] font-mono uppercase tracking-widest font-bold mb-1">{label}</div>
        {active && <div className="text-[7px] font-mono text-pearl">Causal Ripple Detected</div>}
    </div>
);

export const ChronosCausalEngine: React.FC<ChronosCausalEngineProps> = ({ systemState, setSystemState, audioEngine }) => {
    const { chronos } = systemState;
    const [simProgress, setSimProgress] = useState(0.1);
    const [activeDecision, setActiveDecision] = useState<string | null>(null);

    const handleAnchorToggle = () => {
        audioEngine?.playAscensionChime();
        setSystemState(prev => ({
            ...prev,
            chronos: {
                ...prev.chronos,
                anchorStatus: prev.chronos.anchorStatus === 'LOCKED' ? 'UNLOCKED' : 'LOCKED',
                timelineStability: prev.chronos.anchorStatus === 'LOCKED' ? 0.8 : 1.0
            }
        }));
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setSimProgress(val);
        // Simulate "Butterfly Effect" decision triggers based on progress
        if (val > 0.7) setActiveDecision('LIQUIDITY_EVENT');
        else if (val > 0.4) setActiveDecision('ESTATE_ACQUISITION');
        else setActiveDecision(null);
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in relative pb-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6 shrink-0 z-20 bg-dark-bg/80 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-violet-900/10 border border-violet-500/30 flex items-center justify-center font-orbitron text-violet-400 text-3xl animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                        ⏳
                    </div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold text-glow-violet">Chronos Causal Engine</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Temporal Simulation & Pre-Crime Heuristics</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleAnchorToggle}
                        className={`px-8 py-3 rounded-sm font-orbitron text-[10px] font-bold uppercase tracking-[0.3em] transition-all border relative overflow-hidden group ${
                            chronos.anchorStatus === 'LOCKED' 
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                            : 'bg-black/40 border-gold/30 text-gold hover:bg-gold hover:text-black'
                        }`}
                    >
                        {chronos.anchorStatus === 'LOCKED' ? 'TIMELINE_ANCHORED' : 'ANCHOR_PRESENT_MOMENT'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 relative z-10">
                {/* 3D Simulation Viewport */}
                <div className="lg:col-span-9 bg-black/80 border border-white/5 rounded-xl relative overflow-hidden shadow-2xl group flex flex-col">
                    <div className="absolute top-4 left-6 z-10 flex flex-col gap-1 pointer-events-none">
                        <span className="text-[10px] font-orbitron text-gold uppercase tracking-[0.4em] font-bold">Probability Cones</span>
                        <span className="text-[8px] font-mono text-slate-500">Projected Horizon: {chronos.forecastHorizon} Days</span>
                    </div>

                    <div className="flex-1 relative">
                        <Canvas>
                            <PerspectiveCamera makeDefault position={[10, 5, 40]} />
                            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            
                            <ProbabilityCone type="GOLDEN" progress={simProgress} variance={0.5} active={chronos.activeTimeline === 'GOLDEN'} />
                            <ProbabilityCone type="INERTIAL" progress={simProgress} variance={0.2} active={chronos.activeTimeline === 'INERTIAL'} />
                            <ProbabilityCone type="SHADOW" progress={simProgress} variance={0.8} active={chronos.activeTimeline === 'SHADOW'} />
                            
                            <gridHelper args={[100, 20, 0x333333, 0x111111]} position={[0, -5, 0]} />
                        </Canvas>

                        {/* 2D Overlay for "Butterfly Effect" Nodes */}
                        <div className="absolute inset-0 pointer-events-none">
                            <ButterflyEffectNode x={40} y={60} label="ESTATE_ACQUISITION" active={activeDecision === 'ESTATE_ACQUISITION'} />
                            <ButterflyEffectNode x={70} y={30} label="LIQUIDITY_EVENT" active={activeDecision === 'LIQUIDITY_EVENT'} />
                        </div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="p-6 bg-white/[0.02] border-t border-white/5 z-20">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Simulate_Decision_Impact</span>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.01" 
                                value={simProgress} 
                                onChange={handleSliderChange}
                                className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                            />
                            <span className="font-orbitron text-gold font-bold">{(simProgress * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Metrics & Sentinel */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-dark-surface/60 border border-white/5 p-6 rounded-xl flex flex-col gap-4 shadow-inner">
                        <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold border-b border-white/5 pb-2">Timeline Metrics</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono text-slate-400">Projected Rho</span>
                                <span className="font-orbitron text-pearl font-bold">{systemState.chronos.projectedRho.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono text-slate-400">Variance (Chaos)</span>
                                <span className="font-orbitron text-gold font-bold">{(systemState.chronos.butterflyVariance * 100).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono text-slate-400">Anchor Integrity</span>
                                <span className={`font-orbitron font-bold ${chronos.anchorStatus === 'LOCKED' ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    {chronos.anchorStatus === 'LOCKED' ? '100%' : 'DRIFTING'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-rose-950/10 border border-rose-500/20 p-6 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 font-orbitron text-5xl font-black text-rose-500 pointer-events-none">PRE</div>
                        <h4 className="font-orbitron text-[10px] text-rose-300 uppercase tracking-[0.3em] font-bold border-b border-rose-500/20 pb-2 mb-4">Pre-Crime Sentinel</h4>
                        
                        <div className="space-y-4 text-center">
                            <div className="w-24 h-24 border-2 border-rose-500/30 rounded-full flex items-center justify-center mx-auto relative">
                                <div className="absolute inset-0 border border-rose-500/10 rounded-full animate-ping" />
                                <span className="font-orbitron text-2xl text-rose-400 font-black">0</span>
                            </div>
                            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                                Intent Signatures Detected
                            </p>
                            <p className="text-[11px] font-minerva italic text-rose-200/60 leading-relaxed">
                                "Scanning for malicious causal threads 0.5ms before execution..."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
