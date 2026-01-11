
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { OrbMode } from '../../types';
import { audioAnalysisService } from '../../services/audioAnalysisService';

interface LatticeProps {
    rho: number;
    coherence: number;
    orbMode: OrbMode;
}

const ParticleField: React.FC<LatticeProps> = ({ rho, coherence, orbMode }) => {
    const ref = useRef<THREE.Points>(null);
    
    // Generate particle positions
    const [positions, colors] = useMemo(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Sphere distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 10 + Math.random() * 20;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Base color based on mode
            let hue = 0.6; // Blue/Purple
            if (orbMode === 'STANDBY') hue = 0.12; // Gold
            if (orbMode === 'SYNTHESIS') hue = 0.8; // Pink
            if (orbMode === 'GROUNDING') hue = 0.05; // Orange
            if (orbMode === 'REPAIR') hue = 0.45; // Teal
            
            color.setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return [positions, colors];
    }, [orbMode]);

    useFrame((state: any, delta: any) => {
        if (ref.current) {
            // Audio Reactivity
            const energy = audioAnalysisService.getEnergyMetrics();
            
            // Bass swells the lattice
            const audioScale = 1 + energy.bass * 0.3; 
            // Mids add jitter/turbulence
            const turbulence = energy.mid * 0.02;
            
            // Rotation based on resonance + audio excitation
            const speed = (0.05 + (1 - rho) * 0.2) + (energy.high * 0.2); 
            
            ref.current.rotation.x -= delta * speed * 0.5;
            ref.current.rotation.y -= delta * speed;

            // Breathing effect scaling (Audio + Sin Wave)
            const breathe = (Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 1) * audioScale;
            
            // Apply slight random jitter to rotation if high turbulence
            if (turbulence > 0.005) {
                ref.current.rotation.z += (Math.random() - 0.5) * turbulence;
            }

            ref.current.scale.set(breathe, breathe, breathe);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.12 * (1 + coherence)} 
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4 + rho * 0.4}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

export const UnifiedLatticeBackground: React.FC<LatticeProps> = (props) => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: 0.8 }}>
            <Canvas 
                camera={{ position: [0, 0, 20], fov: 60 }} 
                gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
                dpr={[1, 1.5]}
            >
                <ParticleField {...props} />
            </Canvas>
        </div>
    );
};
