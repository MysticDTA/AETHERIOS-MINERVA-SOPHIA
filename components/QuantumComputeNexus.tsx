
import React, { useState } from 'react';
import { SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { QuantumNeuralNetwork } from './QuantumNeuralNetwork';
import { QuantumErrorCorrection } from './QuantumErrorCorrection';
import { QuantumCryptography } from './QuantumCryptography';
import { QuantumAnomalyDetector } from './QuantumAnomalyDetector';
import { QuantumTeleportation } from './QuantumTeleportation';

interface QuantumComputeNexusProps {
    systemState: SystemState;
    sophiaEngine: SophiaEngineCore | null;
    voiceStream?: string;
}

type QuantumTab = 'NEURAL' | 'ERROR_CORRECTION' | 'CRYPTO' | 'ANOMALY' | 'TELEPORT';

const TABS: { id: QuantumTab; label: string }[] = [
    { id: 'NEURAL', label: 'Neural Network (QNN)' },
    { id: 'ERROR_CORRECTION', label: 'Error Correction (QEC)' },
    { id: 'CRYPTO', label: 'Cryptography (QKD)' },
    { id: 'ANOMALY', label: 'Grover Anomaly Detect' },
    { id: 'TELEPORT', label: 'Entanglement Teleport' },
];

export const QuantumComputeNexus: React.FC<QuantumComputeNexusProps> = ({ systemState, sophiaEngine, voiceStream }) => {
    const [activeTab, setActiveTab] = useState<QuantumTab>('NEURAL');

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in pb-20">
            {/* Header / Nav */}
            <div className="flex flex-col gap-6 border-b border-white/10 pb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-violet-900/10 border border-violet-500/30 flex items-center justify-center font-orbitron text-violet-400 text-3xl shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-pulse">
                            Ψ
                        </div>
                        <div>
                            <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold text-glow-violet">Quantum Compute Nexus</h2>
                            <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">50-Qubit Trapped Ion Simulator // Coherence: {(systemState.coherenceResonance.quantumCorrelation * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                    {voiceStream && (
                        <div className="bg-black/40 border border-white/5 px-4 py-2 rounded text-[10px] font-mono text-slate-400">
                            Voice_Input: <span className="text-pearl italic">"{voiceStream}"</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/5 self-start">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded font-orbitron text-[10px] uppercase tracking-widest font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 relative">
                {activeTab === 'NEURAL' && (
                    <QuantumNeuralNetwork systemState={systemState} sophiaEngine={sophiaEngine} />
                )}
                {activeTab === 'ERROR_CORRECTION' && (
                    <QuantumErrorCorrection />
                )}
                {activeTab === 'CRYPTO' && (
                    <QuantumCryptography />
                )}
                {activeTab === 'ANOMALY' && (
                    <QuantumAnomalyDetector systemState={systemState} />
                )}
                {activeTab === 'TELEPORT' && (
                    <QuantumTeleportation />
                )}
            </div>
        </div>
    );
};
