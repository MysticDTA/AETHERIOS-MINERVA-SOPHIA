
import React, { useMemo } from 'react';

interface NodeStabilityMatrixProps {
    resonance: number;
    decoherence: number;
}

export const NodeStabilityMatrix: React.FC<NodeStabilityMatrixProps> = ({ resonance, decoherence }) => {
    const nodes = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 2,
            baseStability: 0.8 + Math.random() * 0.2
        }));
    }, []);

    return (
        <div className="bg-[#050505] border border-white/5 p-4 rounded-xl shadow-inner relative overflow-hidden group">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black">Sub_Shard_Array_RX</span>
                <span className="text-[8px] font-mono text-gold opacity-60">S7_GLOBAL_SYNC</span>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
                {nodes.map(node => {
                    const isDecoherent = Math.random() < decoherence * 0.5;
                    const nodeRho = resonance * node.baseStability;
                    return (
                        <div 
                            key={node.id} 
                            className="aspect-square rounded-[2px] relative transition-all duration-700"
                            style={{ 
                                backgroundColor: isDecoherent ? 'rgba(244, 63, 94, 0.2)' : 'rgba(248, 245, 236, 0.05)',
                                border: `1px solid ${isDecoherent ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`
                            }}
                        >
                            <div 
                                className={`absolute inset-0.5 rounded-[1px] transition-all duration-1000 ${isDecoherent ? 'bg-rose-500 animate-pulse' : 'bg-gold opacity-40'}`}
                                style={{ 
                                    transform: `scale(${nodeRho})`,
                                    animationDelay: `${node.delay}s`,
                                    boxShadow: isDecoherent ? '0 0 8px #f43f5e' : 'none'
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex justify-between items-center text-[7px] font-mono text-slate-600 uppercase tracking-tighter border-t border-white/5 pt-3">
                <div className="flex gap-3">
                    <span className="flex items-center gap-1"><div className="w-1 h-1 bg-gold rounded-full" /> ACTIVE</span>
                    <span className="flex items-center gap-1"><div className="w-1 h-1 bg-rose-500 rounded-full" /> FRACTURE</span>
                </div>
                <span>PARITY: {(resonance * 100).toFixed(2)}%</span>
            </div>
        </div>
    );
};
