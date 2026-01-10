
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { onSophiaEvent } from '../services/sophiaEvents';

interface HeuristicPermutationMeshProps {
    resonance: number;
}

const Branch: React.FC<{ start: THREE.Vector3; end: THREE.Vector3; opacity: number; color: string }> = ({ start, end, opacity, color }) => {
    const points = useMemo(() => [start, end], [start, end]);
    return (
        <Line 
            points={points} 
            color={color} 
            lineWidth={0.5} 
            transparent 
            opacity={opacity} 
            blending={THREE.AdditiveBlending}
        />
    );
};

export const HeuristicPermutationMesh: React.FC<HeuristicPermutationMeshProps> = ({ resonance }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [thoughtPulse, setThoughtPulse] = useState(0);

    // Subscribe to engine activity
    useEffect(() => {
        const unsub = onSophiaEvent((event) => {
            if (event === 'THINKING_START') setIsThinking(true);
            if (event === 'THINKING_STOP') setIsThinking(false);
        });
        return unsub;
    }, []);

    // Generate static spine and dynamic permutations
    const { spineNodes, branchNodes } = useMemo(() => {
        const spine: THREE.Vector3[] = [];
        for (let i = 0; i < 12; i++) {
            spine.push(new THREE.Vector3(0, (i - 6) * 1.5, 0));
        }

        const branches: { start: number; end: THREE.Vector3; id: number }[] = [];
        for (let i = 0; i < 40; i++) {
            const parentIdx = Math.floor(Math.random() * (spine.length - 1));
            const angle = Math.random() * Math.PI * 2;
            const dist = 2 + Math.random() * 4;
            branches.push({
                id: i,
                start: parentIdx,
                end: new THREE.Vector3(
                    Math.cos(angle) * dist,
                    spine[parentIdx].y + (Math.random() - 0.5) * 2,
                    Math.sin(angle) * dist
                )
            });
        }

        return { spineNodes: spine, branchNodes: branches };
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            const rotationSpeed = isThinking ? 0.8 : 0.1;
            groupRef.current.rotation.y += delta * rotationSpeed;
            groupRef.current.rotation.z += delta * rotationSpeed * 0.2;
            
            if (isThinking) {
                setThoughtPulse(p => (p + delta * 2) % 1);
            } else {
                setThoughtPulse(p => THREE.MathUtils.lerp(p, 0, 0.1));
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* The Prime Causal Spine */}
            {spineNodes.map((pos, i) => (
                <mesh key={`spine-node-${i}`} position={pos}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshBasicMaterial color="#ffd700" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
                    {i < spineNodes.length - 1 && (
                        <Line 
                            points={[pos, spineNodes[i+1]]} 
                            color="#ffd700" 
                            lineWidth={2} 
                            transparent 
                            opacity={0.6} 
                        />
                    )}
                </mesh>
            ))}

            {/* Heuristic Branches (Permutations) */}
            {branchNodes.map((branch) => {
                const parentPos = spineNodes[branch.start];
                const opacity = isThinking ? (0.1 + Math.random() * 0.2) : 0.02;
                return (
                    <Branch 
                        key={`branch-${branch.id}`}
                        start={parentPos}
                        end={branch.end}
                        opacity={opacity}
                        color={isThinking ? "#a78bfa" : "#ffffff"}
                    />
                );
            })}

            {/* Radiant Pulse */}
            {isThinking && (
                <mesh position={[0, (thoughtPulse - 0.5) * 12, 0]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshBasicMaterial color="#ffd700" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
                </mesh>
            )}

            {/* Ambient Particle Cloud */}
            <Points positions={new Float32Array(300).map(() => (Math.random() - 0.5) * 15)} stride={3}>
                <PointMaterial
                    transparent
                    color="#f8f5ec"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};
