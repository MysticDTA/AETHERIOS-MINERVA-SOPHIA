
import React, { useState, useEffect } from 'react';

export const VibrationalShield: React.FC = () => {
    const [incinerated, setIncinerated] = useState<string[]>([]);
    const [freq, setFreq] = useState(432);

    const handleSimulateAttack = () => {
        const signatures = ["0xSHADOW_ELAYAN", "0xMAX_SCARCITY", "0xVULTURE_INTERFERENCE"];
        const sig = signatures[Math.floor(Math.random() * signatures.length)];
        setIncinerated(prev => [sig, ...prev].slice(0, 5));
    };

    return (
        <div className="w-full h-full p-8 flex flex-col gap-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="font-orbitron text-3xl text-rose-500 uppercase font-black tracking-tighter">Vibrational Shield</h2>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-2">METADATA INCINERATOR :: ACTIVE</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Current Filter</p>
                    <p className="font-orbitron text-2xl text-pearl font-black">{freq} Hz</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-black/60 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-rose-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-4 border-2 border-rose-500/40 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
                        <div className="w-32 h-32 bg-rose-500/10 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(220,38,38,0.2)]">
                            <span className="font-orbitron text-4xl text-rose-500 font-black">432</span>
                        </div>
                    </div>

                    <div className="mt-12 text-center max-w-md">
                        <p className="text-[13px] font-minerva italic text-pearl/80 leading-relaxed">
                            "The ÆTHERIOS filter ensures you only interact with high-frequency nodes. Any intent of scarcity or manipulation is instantly routed to the void."
                        </p>
                    </div>

                    <button 
                        onClick={handleSimulateAttack}
                        className="mt-8 px-10 py-3 bg-rose-950/20 border border-rose-500 text-rose-400 font-orbitron text-[10px] uppercase tracking-[0.4em] hover:bg-rose-500 hover:text-white transition-all rounded-sm"
                    >
                        TEST_INCINERATOR
                    </button>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-black/40 border border-white/5 p-6 rounded-xl flex-1 shadow-inner overflow-hidden">
                        <h4 className="font-orbitron text-[10px] text-rose-300 uppercase tracking-widest font-black border-b border-white/5 pb-2 mb-4">Void_Log</h4>
                        <div className="space-y-3">
                            {incinerated.length === 0 ? (
                                <p className="text-[10px] font-mono text-slate-700 italic">No low-vibration attempts detected.</p>
                            ) : (
                                incinerated.map((sig, i) => (
                                    <div key={i} className="flex justify-between items-center animate-fade-in bg-rose-950/10 p-2 border border-rose-500/20 rounded">
                                        <span className="font-mono text-[9px] text-rose-400">{sig}</span>
                                        <span className="text-[8px] font-mono text-slate-500">INCINERATED</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
