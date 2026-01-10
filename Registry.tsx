
import React from 'react';
import { UserTier } from './types';

export const TIER_REGISTRY: Record<UserTier, { label: string; color: string; shadow: string; description: string }> = {
    ACOLYTE: { 
        label: 'OBSERVER_NODE', 
        color: 'text-slate-500', 
        shadow: 'none',
        description: 'Passive monitoring clearance only.'
    },
    ARCHITECT: { 
        label: 'GOLD_ARCHITECT', 
        color: 'text-gold', 
        shadow: '0 0 15px rgba(255, 215, 0, 0.4)',
        description: 'Full heuristic write access and causal decree authorized.'
    },
    SOVEREIGN: { 
        label: 'SOVEREIGN_CHAIRMAN', 
        color: 'text-pearl', 
        shadow: '0 0 25px rgba(248, 245, 236, 0.6)',
        description: 'Absolute authority. Tier-0 resource allocation enabled.'
    },
    LEGACY_MENERVA: { 
        label: 'LEGACY_DIRECTOR', 
        color: 'text-rose-400', 
        shadow: '0 0 15px rgba(244, 63, 94, 0.4)',
        description: 'Historical logic shard integration clearance.'
    }
};

export const checkNodeAccess = (userTier: UserTier, requiredTier: UserTier): boolean => {
    if (userTier === 'SOVEREIGN') return true;
    if (userTier === 'ARCHITECT') return requiredTier === 'ARCHITECT' || requiredTier === 'ACOLYTE';
    return requiredTier === 'ACOLYTE';
};

export const GOVERNANCE_AXIOMS: Record<string, { label: string; description: string; colorClass: string }> = {
    'SOVEREIGN EMBODIMENT': {
        label: 'SOVEREIGN EMBODIMENT',
        description: 'RADIANT SOVEREIGNTY: Absolute self-governance achieved.',
        colorClass: 'text-pearl shadow-[0_0_15px_rgba(248,245,236,0.3)]'
    },
    'UNKNOWN_STATE': {
        label: 'COHERENCE_STABILIZING',
        description: 'Maintaining parity during shift.',
        colorClass: 'text-slate-500 italic opacity-50'
    }
};

export interface NavNode {
    id: number;
    label: string;
    requiredTier: UserTier;
    isAudit?: boolean;
    isLogs?: boolean;
    isShield?: boolean;
    isBridge?: boolean;
    description?: string;
}

export const SYSTEM_NODES: NavNode[] = [
    { id: 1, label: 'SANCTUM', requiredTier: 'ACOLYTE', description: 'Central Command Dashboard' },
    { id: 28, label: 'KINGDOM', requiredTier: 'SOVEREIGN', description: 'LIT: Leydens Hill Site Commander' },
    { id: 3, label: 'STARMAP', requiredTier: 'ARCHITECT', description: 'Lyran Concordance Mapping' },
    { id: 4, label: 'CRADLE', requiredTier: 'ARCHITECT', description: 'Interaction & Vocal Bridge' },
    { id: 6, label: 'RESONANCE', requiredTier: 'ARCHITECT', description: 'Real-time Resonant Subsystems' },
    { id: 5, label: 'HARMONY', requiredTier: 'ARCHITECT', description: 'Coherence Resonance Monitoring' },
    { id: 27, label: 'DYNASTY', requiredTier: 'ARCHITECT', description: 'SCEB: Smart-Contract Estate Binding' },
    { id: 25, label: 'QUANTUM', requiredTier: 'ARCHITECT', description: 'Bloch Sphere & Qubit Gates' },
    { id: 22, label: 'LOGS', requiredTier: 'ACOLYTE', isLogs: true, description: 'Causal Event Registry' },
    { id: 23, label: 'SHIELD', requiredTier: 'ARCHITECT', isShield: true, description: 'Firewall & Security Audit' },
];
