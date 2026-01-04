
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full min-h-0 animate-fade-in pb-4">
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
         
         {/* COMMERCIAL INQUIRY CONDUIT */}
         <div className="bg-gold/5 border border-gold/20 p-5 rounded-lg flex flex-col gap-4 shadow-[0_0_30px_rgba(230,199,127,0.1)] group hover:border-gold transition-all duration-500">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_8px_#e6c77f]" />
                <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-widest font-bold">Acquisition_Uplink</h4>
            </div>
            <p className="text-[11px] text-pearl/80 leading-relaxed font-minerva italic">
                Interested in licensing this high-fidelity signal array or commissioning a custom intelligence interface?
            </p>
            <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Architect: Desmond McBride</span>
                <a href="mailto:divinetruthascension@gmail.com" className="text-[11px] font-mono text-gold hover:text-white transition-colors underline decoration-gold/20 underline-offset-4">divinetruthascension@gmail.com</a>
            </div>
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
