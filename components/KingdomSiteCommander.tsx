
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PointCloudSite: React.FC<{ progress: number }> = ({ progress }) => {
    const pointsRef = useRef<THREE.Points>(null);

    const [positions, colors] = React.useMemo(() => {
        const count = 10000;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Simulate terrain
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            const y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
            
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            // Highlight progress area in Gold
            if (Math.abs(x) < 5 && Math.abs(z) < 5) {
                color.set('#ffd700');
            } else {
                color.set('#64748b');
            }
            
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }
        return [pos, col];
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.001;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
            <PointMaterial
                transparent
                vertexColors
                size={0.1}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
};

export const KingdomSiteCommander: React.FC = () => {
    const [scanTime, setScanTime] = useState(Date.now());

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in pb-20">
            <div className="flex justify-between items-end border-b border-white/10 pb-6 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gold/10 border border-gold/30 flex items-center justify-center font-orbitron text-gold text-2xl shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                        L
                    </div>
                    <div>
                        <h2 className="font-orbitron text-3xl text-pearl tracking-tighter uppercase font-extrabold text-glow-gold">KINGDOM SITE COMMANDER</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">LIT: LEYDENS HILL POINT-CLOUD TELEMETRY</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase bg-emerald-950/20 px-3 py-1 rounded border border-emerald-500/20">DRONE_UPLINK: ACTIVE</span>
                    <span className="text-[8px] font-mono text-slate-500 mt-1">LAST_SCAN: {new Date(scanTime).toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-9 bg-[#050505] rounded-xl border border-white/5 relative overflow-hidden shadow-inner">
                    <div className="absolute top-4 left-6 z-10 font-mono text-[9px] text-gold uppercase tracking-[0.4em] pointer-events-none">
                        Digital_Twin_Projection :: 0xLEYDENS_HILL
                    </div>
                    
                    <Canvas camera={{ position: [20, 20, 20], fov: 45 }}>
                        <color attach="background" args={['#020202']} />
                        <ambientLight intensity={0.5} />
                        <PointCloudSite progress={0.42} />
                        <OrbitControls makeDefault />
                    </Canvas>

                    <div className="absolute bottom-6 right-8 p-4 bg-black/60 border border-white/10 backdrop-blur-md rounded-sm z-10 pointer-events-none">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between gap-10 text-[9px] font-mono">
                                <span className="text-slate-500 uppercase">Current Elevation</span>
                                <span className="text-pearl">142.4m</span>
                            </div>
                            <div className="flex justify-between gap-10 text-[9px] font-mono">
                                <span className="text-slate-500 uppercase">Pellet Platform Stabilized</span>
                                <span className="text-green-400">100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-black/60 border border-white/5 p-6 rounded-xl shadow-2xl flex flex-col gap-4">
                        <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-widest font-black border-b border-white/5 pb-2">Construction Analytics</h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-mono uppercase">
                                    <span className="text-slate-500">Main Estate Foundation</span>
                                    <span className="text-pearl">32%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold w-[32%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-mono uppercase">
                                    <span className="text-slate-500">Causal Security Shards</span>
                                    <span className="text-pearl">98%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[98%]" />
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-[11px] font-minerva italic text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                            "LiDAR acquisition verified. Physical structural alignment with the Digital Twin is within 2.4mm parity."
                        </p>
                    </div>

                    <button className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 group hover:border-gold/30 hover:bg-gold/5 transition-all">
                        <svg className="w-8 h-8 text-slate-600 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <span className="font-orbitron text-[9px] uppercase tracking-[0.4em] text-slate-600 group-hover:text-pearl">Request_Drone_Pass</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
