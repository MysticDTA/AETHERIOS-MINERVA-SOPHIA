
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Memory } from '../types';
import { knowledgeBase } from '../services/knowledgeBase';
import { vectorMemoryService, VectorNode } from '../services/vectorMemoryService';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

interface MemoryWeaverProps {
  memories: Memory[];
  onMemoryChange: () => void;
}

const VectorCloud: React.FC<{ vectors: VectorNode[] }> = ({ vectors }) => {
    const pointsRef = useRef<THREE.Points>(null);
    
    // Convert vector data to R3F format
    const [positions, colors] = useMemo(() => {
        if (vectors.length === 0) return [new Float32Array(0), new Float32Array(0)];
        
        const pos = new Float32Array(vectors.length * 3);
        const cols = new Float32Array(vectors.length * 3);
        const color = new THREE.Color();

        vectors.forEach((v, i) => {
            pos[i * 3] = v.embedding[0];
            pos[i * 3 + 1] = v.embedding[1];
            pos[i * 3 + 2] = v.embedding[2];

            // Color based on "coherence"
            color.setHSL(0.1 + v.coherenceScore * 0.1, 0.8, 0.5); // Gold/Orange spectrum
            cols[i * 3] = color.r;
            cols[i * 3 + 1] = color.g;
            cols[i * 3 + 2] = color.b;
        });
        return [pos, cols];
    }, [vectors]);

    useFrame((state: any) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.002;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <group>
            {/* Draw connections between nearest neighbors (Simulated) */}
            {vectors.length > 1 && (
                <Line
                    points={vectors.map(v => new THREE.Vector3(v.embedding[0], v.embedding[1], v.embedding[2]))}
                    color="#ffffff"
                    opacity={0.1}
                    transparent
                    lineWidth={1}
                />
            )}
            <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.8}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

export const MemoryWeaver: React.FC<MemoryWeaverProps> = ({ memories, onMemoryChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'LIST' | 'VECTOR'>('LIST');
  const [crystallizing, setCrystallizing] = useState(false);
  const [vectorNodes, setVectorNodes] = useState<VectorNode[]>([]);
  
  useEffect(() => {
      setVectorNodes(vectorMemoryService.getVectors());
  }, []);

  const handleClear = () => {
    knowledgeBase.clearMemories();
    vectorMemoryService.clearLattice();
    setVectorNodes([]);
    onMemoryChange();
    setActiveMemory(null);
    setShowConfirm(false);
  };

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleCrystallize = async () => {
      if (memories.length === 0 || crystallizing) return;
      setCrystallizing(true);
      
      // Crystallize all current short-term memories
      for (const mem of memories) {
          // Check if already exists to avoid dupes in this simple sim
          if (!vectorNodes.find(v => v.content === mem.content)) {
              await vectorMemoryService.crystallizeMemory(mem);
          }
      }
      
      setVectorNodes(vectorMemoryService.getVectors());
      setCrystallizing(false);
      setViewMode('VECTOR'); // Auto switch to view result
  };

  return (
    <div className="w-full h-full bg-[#0a0c0f] border border-white/10 p-6 rounded-b-xl flex flex-col relative overflow-hidden group shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 z-10 shrink-0">
        <div className="flex flex-col gap-1">
            <h3 className="font-orbitron text-[12px] text-pearl uppercase tracking-[0.3em] font-black">Causal Memory Lattice</h3>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                RAM_Blocks: {memories.length} | Vector_Nodes: {vectorNodes.length}
            </span>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setViewMode(viewMode === 'LIST' ? 'VECTOR' : 'LIST')}
                className="px-3 py-1 rounded-sm text-[9px] font-bold bg-white/5 border border-white/10 text-pearl hover:bg-white/10 transition-all uppercase tracking-widest"
            >
                {viewMode === 'LIST' ? 'View_Lattice_3D' : 'View_Linear_Log'}
            </button>
            <button 
                onClick={handleCrystallize}
                disabled={memories.length === 0 || crystallizing}
                className={`px-3 py-1 rounded-sm text-[9px] font-bold border transition-all uppercase tracking-widest ${crystallizing ? 'bg-gold/20 border-gold text-gold animate-pulse' : 'bg-violet-900/20 border-violet-500/30 text-violet-300 hover:bg-violet-500 hover:text-white'}`}
            >
                {crystallizing ? 'Crystallizing...' : 'Crystallize_Vectors'}
            </button>
            {!showConfirm ? (
            <button 
                onClick={() => setShowConfirm(true)}
                disabled={memories.length === 0 && vectorNodes.length === 0}
                className="px-3 py-1 rounded-sm text-[9px] font-bold bg-rose-950/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Purge
            </button>
            ) : (
            <div className="flex gap-2">
                <button onClick={handleClear} className="px-3 py-1 rounded-sm text-[9px] font-bold bg-rose-600 text-white hover:bg-rose-500 border border-rose-500 uppercase tracking-widest">Confirm</button>
                <button onClick={() => setShowConfirm(false)} className="px-3 py-1 rounded-sm text-[9px] font-bold bg-slate-800 text-slate-400 hover:text-white border border-white/10 uppercase tracking-widest">Cancel</button>
            </div>
            )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col relative z-10 gap-6">
        {/* Visualization Area */}
        <div className="relative flex-1 bg-black/40 rounded-lg overflow-hidden border border-white/5 shadow-inner">
            {viewMode === 'VECTOR' ? (
                <div className="w-full h-full">
                    {vectorNodes.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 font-mono uppercase tracking-widest opacity-50">
                            Lattice Empty. Crystallize memories to generate vectors.
                        </div>
                    ) : (
                        <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
                            <ambientLight intensity={0.5} />
                            <VectorCloud vectors={vectorNodes} />
                        </Canvas>
                    )}
                    {/* HUD Overlay for 3D View */}
                    <div className="absolute bottom-2 left-2 text-[8px] font-mono text-gold pointer-events-none">
                        VECTOR_SPACE_PROJECTION [R3F]
                    </div>
                </div>
            ) : (
                <div className="w-full h-full overflow-y-auto scrollbar-thin p-4 grid grid-cols-1 gap-3 content-start">
                    {memories.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-[10px] text-slate-500 font-mono uppercase tracking-widest opacity-50">
                            No Short-Term Memories
                        </div>
                    ) : (
                        memories.map((mem, i) => (
                            <div 
                                key={mem.id} 
                                className={`
                                    relative p-4 rounded-lg border transition-all duration-500 cursor-pointer group/petal overflow-hidden
                                    ${activeMemory?.id === mem.id 
                                        ? 'bg-white/[0.08] border-gold/60 shadow-[0_0_15px_rgba(255,215,0,0.1)] translate-x-1' 
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-gold/30 hover:translate-x-1'
                                    }
                                `}
                                onClick={() => setActiveMemory(mem)}
                            >
                                {/* Petal Accent - A subtle bar on the left */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-500 ${activeMemory?.id === mem.id ? 'bg-gold' : 'bg-slate-800 group-hover/petal:bg-gold/50'}`} />
                                
                                <div className="pl-3 flex flex-col gap-2 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                                            {mem.pillarContext || 'GENERAL_CONTEXT'}
                                        </span>
                                        <span className="text-[8px] font-mono text-slate-700">
                                            {new Date(mem.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    
                                    <p className={`text-[11px] font-minerva italic leading-relaxed line-clamp-2 ${activeMemory?.id === mem.id ? 'text-pearl' : 'text-slate-400 group-hover/petal:text-slate-200'}`}>
                                        "{mem.content}"
                                    </p>
                                </div>

                                {/* Hover Glow Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover/petal:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>

        {/* Selected Memory Detail */}
        {activeMemory && viewMode === 'LIST' && (
            <div className="min-h-[120px] bg-[#0f1115] border-t border-white/10 p-5 animate-slide-up relative flex flex-col gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
                <button 
                    onClick={() => setActiveMemory(null)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-rose-400 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="flex gap-3 items-center border-b border-white/5 pb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="text-[9px] font-mono text-gold uppercase tracking-[0.2em] font-bold">Active_Memory_Node</span>
                    <span className="text-[8px] text-slate-600 font-mono ml-auto tracking-tight opacity-50">{activeMemory.id}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 max-h-[120px]">
                    <p className="text-[13px] font-minerva text-pearl leading-relaxed tracking-wide select-text">
                        "{activeMemory.content}"
                    </p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                    <span className="text-[8px] text-slate-500 font-mono">
                        Captured: {new Date(activeMemory.timestamp).toLocaleString()}
                    </span>
                    <button onClick={() => handleCopy(activeMemory.content)} className={`text-[9px] font-mono uppercase border px-3 py-1.5 rounded transition-all ${copied ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-white/20 text-slate-400 hover:text-pearl hover:border-pearl/40 hover:bg-white/5'}`}>
                        {copied ? 'Content_Copied' : 'Copy_Data'}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
