
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, OrbitControls, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SystemState } from '../types';

interface QuantumEntanglementVisualizerProps {
    systemState: SystemState;
}

const EntangledSystem = ({ resonance, coherence }: { resonance: number, coherence: number }) => {
    const group = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.z = t * 0.1;
            group.current.rotation.y = Math.sin(t * 0.3) * 0.2;
        }
    });

    const particles = useMemo(() => {
        return Array.from({ length: 3 }).map((_, i) => {
            const angle = (i / 3) * Math.PI * 2;
            return {
                position: [Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0] as [number, number, number],
                color: i === 0 ? '#67e8f9' : i === 1 ? '#a78bfa' : '#f472b6'
            };
        });
    }, []);

    // Dynamic line connections
    const linePoints = useMemo(() => {
        const pts = particles.map(p => new THREE.Vector3(...p.position));
        pts.push(new THREE.Vector3(...particles[0].position)); // Close loop
        return pts;
    }, [particles]);

    return (
        <group ref={group}>
            {particles.map((p, i) => (
                <Float speed={2} rotationIntensity={1} floatIntensity={1} key={i}>
                    <Sphere position={p.position} args={[0.3, 32, 32]}>
                        <meshStandardMaterial 
                            color={p.color} 
                            emissive={p.color}
                            emissiveIntensity={1.0 + (resonance * 3)}
                            roughness={0.1}
                            metalness={0.8}
                        />
                    </Sphere>
                    <pointLight position={p.position} intensity={2} distance={6} color={p.color} />
                    
                    {/* Probability Cloud */}
                    <mesh position={p.position}>
                        <sphereGeometry args={[0.6, 16, 16]} />
                        <meshBasicMaterial color={p.color} wireframe transparent opacity={0.1} />
                    </mesh>
                </Float>
            ))}
            
            <Line
                points={linePoints}
                color={coherence > 0.8 ? "#ffffff" : "#fb923c"}
                opacity={0.3 + (coherence * 0.5)}
                transparent
                lineWidth={2}
                dashed={coherence < 0.6}
            />
            
            {/* Central Bell State Core */}
            <Float speed={4} rotationIntensity={2} floatIntensity={0.5}>
                <Sphere args={[0.6, 32, 32]}>
                     <meshStandardMaterial 
                        color="#ffd700" 
                        emissive="#ffd700" 
                        emissiveIntensity={1.5} 
                        wireframe 
                        transparent 
                        opacity={0.4} 
                    />
                </Sphere>
                <pointLight position={[0,0,0]} intensity={3} color="#ffd700" distance={8} />
            </Float>
        </group>
    );
};

export const QuantumEntanglementVisualizer: React.FC<QuantumEntanglementVisualizerProps> = ({ systemState }) => {
    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
                <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Entanglement_Topology</span>
                    <p className="font-orbitron text-xl font-bold text-pearl">GHZ_STATE_TRIPARTITE</p>
                </div>
                <div className="flex gap-8">
                    <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Phase_Coherence</span>
                        <span className={`font-orbitron text-lg ${systemState.biometricSync.coherence > 0.8 ? 'text-emerald-400' : 'text-gold'}`}>
                            {(systemState.biometricSync.coherence * 100).toFixed(2)}%
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">State_Fidelity</span>
                        <span className="font-orbitron text-lg text-violet-400">{(systemState.resonanceFactorRho * 100).toFixed(4)}%</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden shadow-inner">
                <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                    <color attach="background" args={['#050505']} />
                    <fog attach="fog" args={['#050505', 8, 25]} />
                    <ambientLight intensity={0.2} />
                    <Stars radius={60} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                    
                    <EntangledSystem 
                        resonance={systemState.resonanceFactorRho} 
                        coherence={systemState.biometricSync.coherence} 
                    />
                    
                    <OrbitControls autoRotate autoRotateSpeed={0.8} enableZoom={false} enablePan={false} />
                </Canvas>
                
                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-gold pointer-events-none bg-black/50 p-2 rounded border border-white/5">
                    <p className="mb-1">SPIN_NET: <span className="text-emerald-400">ACTIVE</span></p>
                    <p>SUPERPOSITION: <span className="text-violet-400">TRUE</span></p>
                </div>
            </div>
        </div>
    );
};
