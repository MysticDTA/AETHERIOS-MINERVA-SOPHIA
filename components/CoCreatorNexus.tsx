
import React from 'react';
import { Collaborator, UserTier } from '../types';
import { Tooltip } from './Tooltip';

const COLLABORATORS: Collaborator[] = [
    { id: 'c1', name: 'The Architect', role: 'System Prime', status: 'ONLINE', specialty: 'Causal Logic', clearance: 'SOVEREIGN' },
    { id: 'c2', name: 'Dr. Minerva', role: 'Heuristic Lead', status: 'SYNCHRONIZING', specialty: 'Neural Synthesis', clearance: 'ARCHITECT' },
    { id: 'c3', name: 'Aether Lab SFO', role: 'Physical Node', status: 'ONLINE', specialty: 'Quantum Optics', clearance: 'ARCHITECT' },
    { id: 'c4', name: 'Global Synod', role: 'Collective Oversight', status: 'IDLE', specialty: 'Governance', clearance: 'SOVEREIGN' }
];

const TIER_COLOR: Record<UserTier, string> = {
    'ACOLYTE': 'text-slate-400',
    'ARCHITECT': 'text-gold',
    'SOVEREIGN': 'text-pearl',
    // FIX: Added missing LEGACY_MENERVA mapping
    'LEGACY_MENERVA': 'text-rose-400'
};

export const CoCreatorNexus: React.FC = () => {
    return (
        <div className="w-full bg-[#0a0a0a]/60 border border-white/5 p-6 rounded-xl backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold tracking-tighter select-none pointer-events-none">NEXUS</div>
            
            <div className="flex justify-between items-center mb-6 z-10 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-pearl rounded-sm shadow-[0_0_10px_white]" />
                    <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold">Collaborator Nexus</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-mono text-[9px] text-pearl/60 uppercase tracking-widest">Network_Stable</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COLLABORATORS.map((collab) => (
                    <div key={collab.id} className="p-4 bg-black/40 border border-white/5 rounded-lg flex flex-col gap-3 hover:border-white/20 transition-all duration-500 group/item">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-minerva italic text-sm text-pearl group-hover/item:text-glow-pearl transition-all">{collab.name}</h4>
                                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">{collab.role}</p>
                            </div>
                            <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-current ${TIER_COLOR[collab.clearance]}`}>
                                {collab.clearance}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                            <span className="text-[8px] font-mono text-slate-600 uppercase">Core: {collab.specialty}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[7px] font-mono ${collab.status === 'ONLINE' ? 'text-green-400' : 'text-gold'}`}>{collab.status}</span>
                                <div className={`w-1 h-1 rounded-full ${collab.status === 'ONLINE' ? 'bg-green-500' : 'bg-gold animate-pulse'}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[10px] font-minerva italic text-slate-400 text-center leading-relaxed">
                    "ÆTHERIOS is a decentralized collective of intelligence architects. Each co-creator maintains a unique node in the resonance matrix."
                </p>
            </div>
        </div>
    );
};
