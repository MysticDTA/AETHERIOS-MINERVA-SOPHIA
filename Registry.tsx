
import React from 'react';
import { UserTier, SystemState, OrbMode } from './types';

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
