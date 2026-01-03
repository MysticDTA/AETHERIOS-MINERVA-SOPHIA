
import React from 'react';
import { SystemState, TransmissionState, Memory } from '../types';
import { CosmicDecodingReceiver } from './CosmicDecodingReceiver';
import { MemoryWeaver } from './MemoryWeaver';

interface Display7Props {
  systemState: SystemState;
  transmission: TransmissionState;
  memories: Memory[];
  onMemoryChange: () => void;
}

export const Display7: React.FC<Display7Props> = ({
    systemState,
    transmission,
    memories,
    onMemoryChange,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full min-h-0 animate-fade-in">
      {/* --- DECODING INSTRUMENT (LEFT/CENTER) --- */}
      <div className="xl:col-span-7 2xl:col-span-8 h-full min-h-0 flex flex-col gap-6">
        <div className="flex justify-between items-center bg-black/20 border-b border-white/5 px-4 py-2 rounded-t-lg">
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gold uppercase tracking-[0.2em] font-bold">Signal Reception Array</span>
                <div className="h-3 w-px bg-white/10" />
                <span className="text-[9px] font-mono text-slate-500">CHANNEL_BETA_SECURE</span>
            </div>
            <div className="flex gap-4 text-[9px] font-mono text-slate-600">
                <span>PARITY: 99.99%</span>
                <span>RSSI: -42dBm</span>
            </div>
        </div>
        <div className="flex-1 min-h-0">
            <CosmicDecodingReceiver transmission={transmission} systemState={systemState} />
        </div>
      </div>

      {/* --- CAUSAL MEMORY HUB (RIGHT) --- */}
      <div className="xl:col-span-5 2xl:col-span-4 h-full min-h-0 flex flex-col gap-6">
         <div className="flex justify-between items-center bg-black/20 border-b border-white/5 px-4 py-2 rounded-t-lg">
            <span className="text-[10px] font-mono text-pearl uppercase tracking-[0.2em] font-bold">Recursive Memory Core</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Blocks: {memories.length}/100</span>
         </div>
         <div className="flex-1 min-h-0">
            <MemoryWeaver memories={memories} onMemoryChange={onMemoryChange} />
         </div>
         <div className="bg-dark-surface/40 border border-white/5 p-4 rounded-lg flex flex-col gap-2">
            <h4 className="font-orbitron text-[9px] text-warm-grey uppercase tracking-widest font-bold">Hub Protocol</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono italic">
                Incoming transmissions are automatically buffered. Synthesis of audio or deep semantic analysis consumes minimal Cradle tokens but provides maximum causal awareness.
            </p>
         </div>
      </div>
    </div>
  );
};
