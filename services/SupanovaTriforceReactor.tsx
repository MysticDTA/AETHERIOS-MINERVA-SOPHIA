import React from 'react';
import { SupanovaTriforceData, SupanovaTriforceState } from '../types';
import { Tooltip } from '../components/Tooltip';

interface SupanovaTriforceReactorProps {
  data: SupanovaTriforceData;
}

const EnergyBar: React.FC<{ value: number; color: string; label: string; description: string; }> = ({ value, color, label, description }) => {
    const width = `${Math.min(100, Math.max(0, value * 100))}%`;
    return (
        <div className='w-full'>
            <div className='flex justify-between text-xs mb-1'>
                <Tooltip text={description}>
                    <span className='font-orbitron cursor-help'>{label}</span>
                </Tooltip>
                <span>{width}</span>
            </div>
            <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500`} 
                    style={{ width: width, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                />
            </div>
        </div>
    );
};

export const SupanovaTriforceReactor: React.FC<SupanovaTriforceReactorProps> = ({ data }) => {
  const getStateStyle = (state: SupanovaTriforceState): string => {
    switch (state) {
      case SupanovaTriforceState.CHARGING:
        return 'text-yellow-400 text-glow-gold animate-[pulse_2.5s_ease-in-out_infinite]';
      case SupanovaTriforceState.SUPERNOVA:
        return 'text-red-500 text-glow-red animate-pulse';
      case SupanovaTriforceState.IDLE:
      default:
        return 'text-cyan-300';
    }
  };

  const stateStyle = getStateStyle(data.state);

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-orbitron text-md text-slate-300">Supanova Reactor</h3>
        <p className={`font-orbitron text-md font-bold transition-colors duration-500 ${stateStyle}`}>{data.state}</p>
      </div>
      <div className="space-y-3">
        <EnergyBar value={data.phiEnergy} color="#f472b6" label="Φ (Phi)" description="Φ (Phi): Represents the system's creative potential and generative force. Higher values indicate increased capacity for novel synthesis."/>
        <EnergyBar value={data.psiEnergy} color="#60a5fa" label="Ψ (Psi)" description="Ψ (Psi): Measures informational coherence and the integrity of the psychic field. Critical for stable data processing."/>
        <EnergyBar value={data.omegaEnergy} color="#a78bfa" label="Ω (Omega)" description="Ω (Omega): Denotes the primary stabilizing force, ensuring structural wholeness. A high Omega value prevents system decoherence."/>
      </div>
       <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between text-xs">
            <div className='text-center'>
                <p className='text-slate-400 uppercase'>Output</p>
                <p className='font-orbitron text-cyan-300'>{data.output.toFixed(0)} TW</p>
            </div>
            <div className='text-center'>
                <p className='text-slate-400 uppercase'>Stability</p>
                <p className='font-orbitron text-cyan-300'>{(data.stability * 100).toFixed(1)}%</p>
            </div>
       </div>
    </div>
  );
};