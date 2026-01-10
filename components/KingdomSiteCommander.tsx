
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { SanctuaryState, VehicleTelemetry } from '../types';

const DigitalTwinLattice: React.FC<{ progress: number }> = ({ progress }) => {
    const pointsRef = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const count = 15000;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            const y = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 2;
            
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            if (Math.abs(x) < 4 && Math.abs(z) < 4) {
                color.set('#ffd700'); // Foundation area
            } else {
                color.set('#334155');
            }
            
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }
        return [pos, col];
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <group>
            <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.12}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.7}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            {/* 400lb Pulley System Foundation Indicator */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1, 1, 4, 32]} />
                <meshBasicMaterial color="#ffd700" wireframe transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

const SanctuaryControls: React.FC = () => {
    const [lighting, setLighting] = useState<'ZEN' | 'FOCUS' | 'ENTERTAIN' | 'OFF'>('ZEN');
    const [temp, setTemp] = useState(21.5);
    const [perimeter, setPerimeter] = useState(true);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="bg-black/60 border border-white/10 p-6 rounded-xl flex flex-col gap-6">
                <h4 className="font-orbitron text-[10px] text-pearl uppercase tracking-widest font-bold border-b border-white/5 pb-2">Atmospheric Control</h4>
                <div className="space-y-4">
                    <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block mb-2">Lighting_Zone_Mode</span>
                        <div className="flex gap-2">
                            {['ZEN', 'FOCUS', 'ENTERTAIN', 'OFF'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setLighting(mode as any)}
                                    className={`flex-1 py-2 text-[8px] font-bold rounded border transition-all ${
                                        lighting === mode 
                                        ? 'bg-gold text-black border-gold' 
                                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block mb-2">Climate_Set_Point</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setTemp(t => t - 0.5)} className="w-8 h-8 rounded border border-white/10 hover:bg-white/10 text-white">-</button>
                            <span className="font-orbitron text-2xl text-pearl">{temp.toFixed(1)}°C</span>
                            <button onClick={() => setTemp(t => t + 0.5)} className="w-8 h-8 rounded border border-white/10 hover:bg-white/10 text-white">+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-black/60 border border-white/10 p-6 rounded-xl flex flex-col gap-6">
                <h4 className="font-orbitron text-[10px] text-pearl uppercase tracking-widest font-bold border-b border-white/5 pb-2">Perimeter Security</h4>
                <div className="flex flex-col gap-4 items-center justify-center flex-1">
                    <button 
                        onClick={() => setPerimeter(!perimeter)}
                        className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                            perimeter 
                            ? 'border-emerald-500 bg-emerald-900/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]' 
                            : 'border-rose-500 bg-rose-900/20 shadow-[0_0_40px_rgba(244,63,94,0.2)]'
                        }`}
                    >
                        <svg className={`w-10 h-10 mb-2 ${perimeter ? 'text-emerald-400' : 'text-rose-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className={`text-[9px] font-bold tracking-widest ${perimeter ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {perimeter ? 'ARMED' : 'DISARMED'}
                        </span>
                    </button>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Status: {perimeter ? 'PERIMETER_LOCKED' : 'ZONES_OPEN'}
                    </p>
                </div>
            </div>
        </div>
    );
};

const VehicleStatus: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-black/60 border border-white/10 rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <span className="font-minerva italic text-xl text-pearl">RR</span>
                    </div>
                    <div>
                        <h4 className="font-orbitron text-lg text-pearl font-bold">Cullinan Sentinel</h4>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Connected via Starlink_V2</span>
                    </div>
                </div>
                <span className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded text-[9px] font-bold tracking-widest">SECURE</span>
            </div>

            <div className="flex-1 p-8 grid grid-cols-3 gap-8">
                <div className="flex flex-col items-center justify-center border-r border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Cabin_Temp</span>
                    <span className="font-orbitron text-4xl text-pearl">20.0°</span>
                    <span className="text-[9px] text-cyan-400 mt-2">PRE-CONDITIONING</span>
                </div>
                <div className="flex flex-col items-center justify-center border-r border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Fuel_Range</span>
                    <span className="font-orbitron text-4xl text-pearl">420<span className="text-lg ml-1">km</span></span>
                    <span className="text-[9px] text-green-400 mt-2">OPTIMAL</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Location</span>
                    <span className="font-orbitron text-xl text-pearl text-center">Kingscliff Estate</span>
                    <span className="text-[9px] text-gold mt-2">GEOFENCE_ACTIVE</span>
                </div>
            </div>

            <div className="p-4 bg-white/5 text-center">
                <button className="px-8 py-3 bg-white/10 border border-white/20 hover:bg-white/20 transition-all rounded font-orbitron text-[10px] uppercase tracking-[0.2em] font-bold text-pearl">
                    Summon Vehicle
                </button>
            </div>
        </div>
    );
};

export const KingdomSiteCommander: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ESTATE' | 'SANCTUARY' | 'CULLINAN'>('ESTATE');
    const [sv, setSv] = useState(1424.8); 

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in pb-20">
            <div className="flex justify-between items-end border-b border-white/10 pb-6 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gold/10 border border-gold/30 flex items-center justify-center font-orbitron text-gold text-2xl shadow-[0_0_30_rgba(255,215,0,0.1)]">
                        ◈
                    </div>
                    <div>
                        <h2 className="font-orbitron text-3xl text-pearl tracking-tighter uppercase font-extrabold text-glow-gold">Kingdom Commander</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">ASSET CONTROL :: {activeTab}</p>
                    </div>
                </div>
                
                <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
                    {['ESTATE', 'SANCTUARY', 'CULLINAN'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded font-orbitron text-[10px] uppercase tracking-widest font-bold transition-all ${
                                activeTab === tab 
                                ? 'bg-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                {activeTab === 'ESTATE' && (
                    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-9 bg-[#020202] rounded-xl border border-white/10 relative overflow-hidden shadow-inner h-full min-h-[400px]">
                            <div className="absolute top-4 left-6 z-10 font-mono text-[9px] text-gold uppercase tracking-[0.4em] pointer-events-none">
                                Kingscliff_Digital_Twin_v4
                            </div>
                            <Canvas camera={{ position: [25, 25, 25], fov: 45 }}>
                                <color attach="background" args={['#010101']} />
                                <ambientLight intensity={0.5} />
                                <DigitalTwinLattice progress={0.42} />
                                <OrbitControls makeDefault />
                            </Canvas>
                        </div>
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            <div className="bg-black/60 border border-white/5 p-6 rounded-xl shadow-2xl flex flex-col gap-4">
                                <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-widest font-black border-b border-white/5 pb-2">Spatial Analytics</h4>
                                <div className="space-y-6 font-mono">
                                    <div className="flex justify-between text-[10px] uppercase">
                                        <span className="text-slate-500">Mass Displacement</span>
                                        <span className="text-pearl">42.4 t</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase">
                                        <span className="text-slate-500">Lidar Density</span>
                                        <span className="text-pearl">14.2k pts/m²</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'SANCTUARY' && <SanctuaryControls />}
                
                {activeTab === 'CULLINAN' && <VehicleStatus />}
            </div>
        </div>
    );
};
