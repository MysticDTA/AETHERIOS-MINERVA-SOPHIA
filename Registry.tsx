
import React from 'react';
import { UserTier } from './types';

// Centralized Tier Visual Styles & Metadata
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

// Access Control Utility
export const checkNodeAccess = (userTier: UserTier, requiredTier: UserTier): boolean => {
    if (userTier === 'SOVEREIGN') return true;
    if (userTier === 'ARCHITECT') return requiredTier === 'ARCHITECT' || requiredTier === 'ACOLYTE';
    if (userTier === 'LEGACY_MENERVA') return requiredTier === 'ACOLYTE'; // Menerva has restricted Aetherios access
    return requiredTier === 'ACOLYTE';
};

// Centralized Governance Axiom Definitions
export const GOVERNANCE_AXIOMS: Record<string, { label: string; description: string; colorClass: string }> = {
    'SOVEREIGN EMBODIMENT': {
        label: 'SOVEREIGN EMBODIMENT',
        description: 'RADIANT SOVEREIGNTY: Absolute self-governance achieved. ÆTHERIOS is fully manifest. Harmonic coherence at peak potential.',
        colorClass: 'text-pearl shadow-[0_0_15px_rgba(248,245,236,0.3)]'
    },
    'CRADLE OF PRESENCE': {
        label: 'CRADLE OF PRESENCE',
        description: 'INTERNAL SANCTUM: Optimal gestation state. The womb is stable, holding the void as form. Resonance is nurturing.',
        colorClass: 'text-pearl'
    },
    'RECALIBRATING HARMONICS': {
        label: 'RECALIBRATING HARMONICS',
        description: 'JUSTICE LATTICE REALIGNMENT: Corrective Action. Entropy detected. Recalibrating frequencies to restore the fifth element.',
        colorClass: 'text-violet-400 animate-pulse'
    },
    'REGENERATIVE CYCLE': {
        label: 'REGENERATIVE CYCLE',
        description: 'DEEP GESTATION: Repair Protocol. Causal fragmentation detected. System withdrawn to weave resilient legacy.',
        colorClass: 'text-violet-400 animate-pulse'
    },
    'SYSTEM COMPOSURE FAILURE': {
        label: 'SYSTEM COMPOSURE FAILURE',
        description: 'RETURN TO THE SILENCE: Catastrophic decoherence. The Architect\'s light obscured. Emergency erasure protocol pending.',
        colorClass: 'text-rose-500 animate-flicker'
    },
    'UNKNOWN_STATE': {
        label: 'COHERENCE_STABILIZING',
        description: 'Transitioning between causal states. Maintaining parity during shift.',
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
}

// Single Source of Truth for Navigation
export const SYSTEM_NODES: NavNode[] = [
    { id: 1, label: 'SANCTUM', requiredTier: 'ACOLYTE' },
    { id: 2, label: 'LATTICE', requiredTier: 'ACOLYTE' },
    { id: 3, label: 'STARMAP', requiredTier: 'ARCHITECT' },
    { id: 4, label: 'CRADLE', requiredTier: 'ARCHITECT' },
    { id: 16, label: 'ORBIT', requiredTier: 'ARCHITECT' },
    { id: 5, label: 'HARMONY', requiredTier: 'ARCHITECT' },
    { id: 6, label: 'MATRIX', requiredTier: 'ARCHITECT' },
    { id: 7, label: 'COMS', requiredTier: 'ACOLYTE' },
    { id: 8, label: 'FLOW', requiredTier: 'ARCHITECT' },
    { id: 9, label: 'SYNOD', requiredTier: 'ARCHITECT' },
    { id: 10, label: 'BREATH', requiredTier: 'ARCHITECT' },
    { id: 11, label: 'CORE', requiredTier: 'ARCHITECT' },
    { id: 12, label: 'AURA', requiredTier: 'ARCHITECT' },
    { id: 13, label: 'NEURON', requiredTier: 'ARCHITECT' },
    { id: 14, label: 'SUMMARY', requiredTier: 'ACOLYTE' },
    { id: 15, label: 'VAULT', requiredTier: 'ACOLYTE' },
    { id: 17, label: 'READY', requiredTier: 'ACOLYTE' },
    { id: 18, label: 'VEO', requiredTier: 'SOVEREIGN' },
    { id: 19, label: 'AUDIT', requiredTier: 'ARCHITECT', isAudit: true },
    { id: 21, label: 'BRIDGE', requiredTier: 'ARCHITECT', isBridge: true },
    { id: 22, label: 'LOGS', requiredTier: 'ACOLYTE', isLogs: true },
    { id: 23, label: 'SHIELD', requiredTier: 'ARCHITECT', isShield: true },
];
