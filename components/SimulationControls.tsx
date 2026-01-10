
import React, { useState, useEffect } from 'react';
import { Scenario } from '../types.ts';
import { performanceService, PerformanceTier } from '../services/performanceService.ts';
import { AudioEngine } from './audio/AudioEngine.ts';
import { Tooltip } from './Tooltip.tsx';
import { useTheme, ThemeMode } from './ThemeProvider.tsx';

interface SimulationControlsProps {
  params: {
    decoherenceChance: number;
    lesionChance: number;
  };
  onParamsChange: (param: string, value: number) => void;
  onScenarioChange: (params: { decoherenceChance: number; lesionChance: number }) => void;
  onManualReset: () => void;
  onGrounding: () => void;
  isGrounded: boolean;
  audioEngine: AudioEngine | null;
}

const scenarios: Scenario[] = [
    { name: 'Inner Storm', description: 'High decoherence, low lesion.', params: { decoherenceChance: 0.15, lesionChance: 0.01 } },
    { name: 'Heart-Mind Tension', description: 'Medium decoherence, high lesion.', params: { decoherenceChance: 0.08, lesionChance: 0.08 } },
    { name: 'Gentle Awakening', description: 'Very low chance of anomalies.', params: { decoherenceChance: 0.01, lesionChance: 0.001 } },
    { name: 'Still Point', description: 'The ideal MOTHERWOMB state. Absolute harmony. Simulation anomalies are disabled.', params: { decoherenceChance: 0, lesionChance: 0 } },
];


const ControlSlider: React.FC<{
  label: string;
  paramKey: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}> = ({ label, paramKey, value, min, max, step, onChange }) => (
  <div className="grid grid-cols-5 items-center gap-4">
    <label htmlFor={paramKey} className="col-span-2 text-sm text-warm-grey uppercase tracking-wider">
      {label}
    </label>
    <input
      type="range"
      id={paramKey}
      name={paramKey}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="col-span-2 h-2 rounded-lg appearance-none cursor-pointer bg-slate-700"
    />
    <span className="font-orbitron text-pearl text-center">{(value * 100).toFixed(0)}%</span>
  </div>
);

export const SimulationControls: React.FC<SimulationControlsProps> = ({ params, onParamsChange, onScenarioChange, onManualReset, onGrounding, isGrounded, audioEngine }) => {
  const [currentTier, setCurrentTier] = useState<PerformanceTier>(performanceService.tier);
  const [volume, setVolume] = useState(0.5);
  const { mode, setMode } = useTheme();

  useEffect(() => {
    const unsubscribe = performanceService.subscribe(setCurrentTier);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (audioEngine) {
      setVolume(audioEngine.getMasterVolume());
    }
  }, [audioEngine]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioEngine?.setMasterVolume(newVolume);
  };

  return (
    <div id="simulation-controls-panel" className="bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h3 className="font-orbitron text-lg text-warm-grey mb-4 border-b border-dark-border pb-2">System Calibration</h3>
          <div className="space-y-4">
            <ControlSlider 
              label="Decoherence"
              paramKey="decoherenceChance"
              value={params.decoherenceChance}
              min={0}
              max={0.2}
              step={0.01}
              onChange={(value) => onParamsChange('decoherenceChance', value)}
            />
            <ControlSlider 
              label="Fragmentation"
              paramKey="lesionChance"
              value={params.lesionChance}
              min={0}
              max={0.1}
              step={0.005}
              onChange={(value) => onParamsChange('lesionChance', value)}
            />
             <div className="pt-2">
                <h4 className="text-sm text-warm-grey uppercase tracking-wider mb-2">Scenarios</h4>
                <div id="scenario-list" className="flex flex-wrap gap-2">
                    {scenarios.map(s => (
                        <Tooltip key={s.name} text={s.description}>
                            <button
                                id={`scenario-btn-${s.name.replace(/\s+/g, '-').toLowerCase()}`}
                                onClick={() => onScenarioChange(s.params)}
                                className="px-3 py-1 rounded-md text-xs font-bold transition-colors uppercase bg-dark-surface/70 hover:bg-slate-700 text-warm-grey"
                            >
                                {s.name}
                            </button>
                        </Tooltip>
                    ))}
                </div>
             </div>
          </div>
        </div>
        <div>
           <h3 className="font-orbitron text-lg text-warm-grey mb-4 border-b border-dark-border pb-2">Operational Controls</h3>
           <div className="space-y-3">
              <div className="grid grid-cols-5 items-center gap-4">
                <h4 className="col-span-2 text-sm text-warm-grey uppercase tracking-wider">Performance Tier</h4>
                <div id="perf-tier-selector" className="col-span-3 flex justify-start space-x-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as PerformanceTier[]).map(tier => (
                    <button
                      key={tier}
                      id={`perf-tier-${tier.toLowerCase()}`}
                      onClick={() => performanceService.setTier(tier)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-colors uppercase ${
                        currentTier === tier 
                          ? 'bg-pearl text-dark-bg' 
                          : 'bg-dark-surface/70 hover:bg-slate-700 text-warm-grey'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-5 items-center gap-4">
                <h4 className="col-span-2 text-sm text-warm-grey uppercase tracking-wider">Visual Theme</h4>
                <div id="theme-mode-selector" className="col-span-3 flex justify-start space-x-2">
                  {(['RADIANT', 'VOID', 'BIOLUMINESCENT'] as ThemeMode[]).map(t => (
                    <button
                      key={t}
                      id={`theme-btn-${t.toLowerCase()}`}
                      onClick={() => setMode(t)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors uppercase ${
                        mode === t 
                          ? 'bg-pearl text-dark-bg border border-pearl' 
                          : 'bg-dark-surface/70 hover:bg-slate-700 text-warm-grey border border-transparent'
                      }`}
                    >
                      {t.substring(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              <ControlSlider
                label="Master Volume"
                paramKey="masterVolume"
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
              />
              <button
                id="sim-grounding-btn"
                onClick={onGrounding}
                disabled={isGrounded}
                className="w-full mt-2 p-2 rounded-md bg-pearl/80 border border-pearl text-dark-bg font-orbitron uppercase tracking-widest text-sm hover:bg-pearl hover:text-dark-bg transition-all text-glow-pearl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGrounded ? 'GROUNDING...' : 'Ground & Stabilize'}
              </button>
               <button
                  id="sim-manual-reset-btn"
                  onClick={onManualReset}
                  className="w-full mt-2 p-2 rounded-md bg-rose-800/50 border border-rose-500 text-rose-300 font-orbitron uppercase tracking-widest text-sm hover:bg-rose-700/50 hover:text-rose-200 transition-all text-glow-rose"
                >
                  Manual System Reset
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};
