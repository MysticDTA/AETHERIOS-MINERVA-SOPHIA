
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

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

export const KingdomSiteCommander: React.FC = () => {
    const [sv, setSv] = useState(1424.8); // Spatial Volume Sv

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in pb-20">
            <div className="flex justify-between items-end border-b border-white/10 pb-6 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gold/10 border border-gold/30 flex items-center justify-center font-orbitron text-gold text-2xl shadow-[0_0_30_rgba(255,215,0,0.1)]">
                        ◈
                    </div>
                    <div>
                        <h2 className="font-orbitron text-3xl text-pearl tracking-tighter uppercase font-extrabold text-glow-gold">Estate Digital Twin</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">LEYDENS HILL :: REAL-TIME LIDAR TELEMETRY</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">S_v Integral: {sv.toFixed(2)} m³</span>
                    <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">Math: Sv = ∫ L(x,y,z) dt</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-9 bg-[#020202] rounded-xl border border-white/10 relative overflow-hidden shadow-inner">
                    <div className="absolute top-4 left-6 z-10 font-mono text-[9px] text-gold uppercase tracking-[0.4em] pointer-events-none">
                        Photogrammetry_Buffer :: 0x88_ESTATE
                    </div>
                    
                    <Canvas camera={{ position: [25, 25, 25], fov: 45 }}>
                        <color attach="background" args={['#010101']} />
                        <ambientLight intensity={0.5} />
                        <DigitalTwinLattice progress={0.42} />
                        <OrbitControls makeDefault />
                    </Canvas>

                    <div className="absolute bottom-6 left-6 p-6 bg-black/60 border border-white/10 backdrop-blur-md rounded shadow-2xl z-10 pointer-events-none">
                        <div className="flex flex-col gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-500 uppercase">Pellet Platform Foundation</span>
                                <div className="flex items-center gap-4">
                                    <span className="font-orbitron text-xl text-pearl">STABLE</span>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold">100% PARITY</span>
                                </div>
                            </div>
                            <div className="h-px w-full bg-white/10" />
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-500 uppercase">400lb Pulley System Sync</span>
                                <div className="flex items-center gap-4">
                                    <span className="font-orbitron text-xl text-gold">ACTIVE</span>
                                    <span className="text-[10px] font-mono text-gold font-bold">CALIBRATED</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        <p className="mt-4 text-[11px] font-minerva italic text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                            "The spatial volume integral confirms structural alignment. Foundation load for the Kingscliff acquisition is within millimetric tolerance."
                        </p>
                    </div>

                    <button className="flex-1 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 group hover:border-gold/40 hover:bg-gold/5 transition-all bg-black/40">
                        <svg className="w-10 h-10 text-slate-700 group-hover:text-gold transition-all duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                        <span className="font-orbitron text-[9px] uppercase tracking-[0.4em] text-slate-600 group-hover:text-pearl">Request_Drone_Uplink</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
