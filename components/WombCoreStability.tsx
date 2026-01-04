
import React from 'react';
import { SupernovaTriforceData, SupernovaTriforceState } from '../types';
import { Tooltip } from './Tooltip';

interface WombCoreStabilityProps {
  data: SupernovaTriforceData;
}

const SegmentedBar: React.FC<{ value: number; color: string; label: string; description: string; }> = ({ value, color, label, description }) => {
    const segments = 24;
    const activeSegments = Math.round(value * segments);
    
    return (
        <div className='w-full group/bar'>
            <div className='flex justify-between text-[10px] mb-1.5'>
                <Tooltip text={description}>
                    <span className='font-orbitron cursor-help text-warm-grey group-hover/bar:text-pearl transition-colors uppercase tracking-widest'>{label}</span>
                </Tooltip>
                <span className="font-mono text-slate-500 group-hover/bar:text-pearl">{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="flex gap-0.5 h-2.5">
                {Array.from({ length: segments }).map((_, i) => {
                    const isActive = i < activeSegments;
                    const isLastActive = i === activeSegments - 1;
                    return (
                        <div 
                            key={i}
                            className={`flex-1 rounded-[1px] transition-all duration-500 ${isActive ? '' : 'bg-slate-800/30'}`}
                            style={{ 
                                backgroundColor: isActive ? color : undefined,
                                boxShadow: isLastActive ? `0 0 12px ${color}` : 'none',
                                opacity: isActive ? (0.6 + (i/segments) * 0.4) : 0.15,
                                transform: isLastActive ? 'scaleY(1.2)' : 'none'
                            }}
                        />
                    )
                })}
            </div>
        </div>
    );
};

export const WombCoreStability: React.FC<WombCoreStabilityProps> = React.memo(({ data }) => {
  const getStateStyle = (state: SupernovaTriforceState): string => {
    switch (state) {
      case SupernovaTriforceState.CHARGING:
        return 'text-gold text-glow-gold animate-[pulse_2.5s_ease-in-out_infinite]';
      case SupernovaTriforceState.SUPERNOVA:
        return 'text-rose text-glow-rose animate-pulse';
      case SupernovaTriforceState.IDLE:
      default:
        return 'text-pearl';
    }
  };

  const stateStyle = getStateStyle(data.state);

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-5 rounded-lg border-glow-gold backdrop-blur-sm relative overflow-hidden group transition-all duration-500">
      <div className="flex justify-between items-center mb-5 z-10 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-3 bg-gold rounded-full ${data.state === 'SUPERNOVA' ? 'animate-ping bg-rose-500' : ''}`} />
            <h3 className="font-orbitron text-xs text-warm-grey uppercase tracking-[0.2em] font-bold">Womb Reactor Core</h3>
        </div>
        <p className={`font-orbitron text-xs font-bold transition-colors duration-500 ${stateStyle}`}>{data.state}</p>
      </div>
      
      <div className="space-y-6">
        <SegmentedBar value={data.phiEnergy} color="#f472b6" label="Ionized Gen-Force" description="Measures the creative potential of the core. At peak ionization, novel data synthesis is exponentially faster."/>
        <SegmentedBar value={data.psiEnergy} color="#60a5fa" label="Coherence Field" description="The integrity of the psychic field buffer. High psi prevents signal noise during operator vocal links."/>
        <SegmentedBar value={data.omegaEnergy} color="#a78bfa" label="Structural Anchor" description="Primary stabilizing force. If omega drops below 0.3, the Tesseract matrix becomes unstable."/>
      </div>

       <div className="mt-6 pt-4 border-t border-dark-border/50 flex justify-between text-[10px] font-mono tracking-tighter">
            <div className='flex flex-col'>
                <p className='text-slate-500 uppercase tracking-widest'>Current Output</p>
                <p className='font-orbitron text-base text-pearl'>{data.output.toFixed(0)} <span className="text-[10px]">TW/s</span></p>
            </div>
            <div className='flex flex-col text-right'>
                <p className='text-slate-500 uppercase tracking-widest'>Resonance Link</p>
                <p className='font-orbitron text-base text-pearl'>{(data.stability * 100).toFixed(1)}%</p>
            </div>
       </div>
       
       <div className="absolute top-2 right-4 pointer-events-none opacity-[0.03] font-mono text-[80px] select-none uppercase">CORE</div>
    </div>
  );
});
