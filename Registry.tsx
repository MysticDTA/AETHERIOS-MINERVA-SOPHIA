
import React from 'react';
import { UserTier } from './types';

export const SYSTEM_NODES = [
    { id: 1, label: 'SANCTUM', requiredTier: 'ACOLYTE' as UserTier, description: 'Central Command' },
    { id: 6, label: 'STATUS', requiredTier: 'ACOLYTE' as UserTier, description: 'System Health & Audit' },
    { id: 31, label: 'CHRONOS', requiredTier: 'SOVEREIGN' as UserTier, description: 'Causal Engine & Timeline Simulation' },
    { id: 8, label: 'NEXUS', requiredTier: 'ARCHITECT' as UserTier, description: 'Noetic Graph State', isBridge: true },
    { id: 28, label: 'ESTATE', requiredTier: 'SOVEREIGN' as UserTier, description: 'Digital Twin Commander' },
    { id: 29, label: 'ORCHESTRATOR', requiredTier: 'SOVEREIGN' as UserTier, description: 'Agentic Negotiation Matrix' },
    { id: 30, label: 'SHIELD', requiredTier: 'ARCHITECT' as UserTier, description: 'Vibrational Frequency Filter', isShield: true },
    { id: 27, label: 'DYNASTY', requiredTier: 'ARCHITECT' as UserTier, description: 'Estate Binding' },
    { id: 5, label: 'HARMONY', requiredTier: 'ARCHITECT' as UserTier, description: 'Resonance Monitor' },
    { id: 4, label: 'CONSOLE', requiredTier: 'ACOLYTE' as UserTier, description: 'Command Console', isBridge: true },
    { id: 10, label: 'BREATH', requiredTier: 'ACOLYTE' as UserTier, description: 'Respiratory Sync' },
    { id: 7, label: 'DECODER', requiredTier: 'ARCHITECT' as UserTier, description: 'Signal Intercept', isAudit: true },
    { id: 15, label: 'VAULT', requiredTier: 'ACOLYTE' as UserTier, description: 'Asset Vault', isLogs: true }
];

export const TIER_REGISTRY: Record<UserTier, { label: string, description: string, color: string, shadow: string }> = {
    'ACOLYTE': { label: 'Acolyte', description: 'Basic system observer.', color: 'text-slate-500', shadow: 'none' },
    'ARCHITECT': { label: 'Architect', description: 'Reality weaver.', color: 'text-gold', shadow: '0 0 10px rgba(230,199,127,0.5)' },
    'SOVEREIGN': { label: 'Sovereign', description: 'Master of causality.', color: 'text-pearl', shadow: '0 0 15px rgba(248,245,236,0.6)' },
    'LEGACY_MENERVA': { label: 'Menerva Legacy', description: 'Primordial data holder.', color: 'text-rose-400', shadow: '0 0 10px rgba(244,194,194,0.5)' }
};

export const GOVERNANCE_AXIOMS: Record<string, { label: string, description: string, colorClass: string }> = {
    'SOVEREIGN EMBODIMENT': { label: 'SOVEREIGN EMBODIMENT', description: 'Causality is absolute.', colorClass: 'text-pearl' },
    'CRADLE OF PRESENCE': { label: 'CRADLE OF PRESENCE', description: 'Stabilizing local nodes.', colorClass: 'text-emerald-400' },
    'RECALIBRATING HARMONICS': { label: 'RECALIBRATING HARMONICS', description: 'Shift detected.', colorClass: 'text-gold' },
    'REGENERATIVE CYCLE': { label: 'REGENERATIVE CYCLE', description: 'Healing the lattice.', colorClass: 'text-cyan-400' },
    'SYSTEM COMPOSURE FAILURE': { label: 'SYSTEM COMPOSURE FAILURE', description: 'Emergency protocols only.', colorClass: 'text-rose-500' },
    'UNKNOWN_STATE': { label: 'UNKNOWN_STATE', description: 'Logic shard missing.', colorClass: 'text-slate-600' }
};

export const checkNodeAccess = (userTier: UserTier, requiredTier: UserTier): boolean => {
    if (userTier === 'SOVEREIGN') return true;
    if (userTier === 'ARCHITECT') return requiredTier === 'ARCHITECT' || requiredTier === 'ACOLYTE';
    return requiredTier === 'ACOLYTE';
};
