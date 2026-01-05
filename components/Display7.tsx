
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full min-h-0 animate-fade-in pb-2">
      {/* --- DECODING INSTRUMENT (LEFT/CENTER) - WIDER FOR TEXT READABILITY --- */}
      <div className="xl:col-span-8 2xl:col-span-8 h-full min-h-0 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-black/30 border-b border-white/10 px-6 py-3 rounded-t-lg backdrop-blur-md">
            <div className="flex items-center gap-4">
                <span className="text-[11px] font-mono text-gold uppercase tracking-[0.25em] font-black">Signal Reception Array</span>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] font-mono text-slate-500 font-bold">CHANNEL_BETA_SECURE</span>
            </div>
            <div className="flex gap-6 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                <span>PARITY: <span className="text-pearl font-bold">99.99%</span></span>
                <span>RSSI: <span className="text-cyan-400 font-bold">-42dBm</span></span>
            </div>
        </div>
        <div className="flex-1 min-h-0 relative rounded-b-lg overflow-hidden shadow-2xl">
            <CosmicDecodingReceiver transmission={transmission} systemState={systemState} />
        </div>
      </div>

      {/* --- CAUSAL MEMORY HUB (RIGHT) --- */}
      <div className="xl:col-span-4 2xl:col-span-4 h-full min-h-0 flex flex-col gap-4">
         <div className="flex justify-between items-center bg-black/30 border-b border-white/10 px-6 py-3 rounded-t-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-pearl uppercase tracking-[0.25em] font-black">Recursive Memory Core</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Blocks: {memories.length}/100</span>
         </div>
         <div className="flex-1 min-h-0 relative">
            <MemoryWeaver memories={memories} onMemoryChange={onMemoryChange} />
         </div>
         
         {/* COMMERCIAL INQUIRY CONDUIT - COMPACT */}
         <div className="bg-gold/5 border border-gold/20 p-4 rounded-lg flex flex-col gap-2 shadow-[0_0_20px_rgba(230,199,127,0.05)] group hover:border-gold/40 transition-all duration-500 shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_8px_#e6c77f]" />
                <h4 className="font-orbitron text-[9px] text-gold uppercase tracking-widest font-bold">Acquisition_Uplink</h4>
            </div>
            <div className="flex justify-between items-end">
                <p className="text-[10px] text-pearl/60 leading-tight font-minerva italic max-w-[200px]">
                    "Licensing inquiry for high-fidelity signal arrays."
                </p>
                <a href="mailto:divinetruthascension@gmail.com" className="text-[9px] font-mono text-gold hover:text-white transition-colors underline decoration-gold/20 underline-offset-4 uppercase tracking-wider">Contact</a>
            </div>
         </div>
      </div>
    </div>
  );
};
