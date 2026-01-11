
import React, { useState } from 'react';
import { AudioEngine } from './audio/AudioEngine';

interface ApolloProps {
    audioEngine?: AudioEngine | null;
}

export const Apollo: React.FC<ApolloProps> = ({ audioEngine }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);

    const handleRunQuery = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setResponse(null);
        audioEngine?.playUIClick();

        // Placeholder API call simulation
        setTimeout(() => {
            setIsLoading(false);
            setResponse("Query executed successfully. Apollo Node synced.");
            audioEngine?.playUIConfirm();
        }, 2000);
    };

    return (
        <div className="w-full h-full p-8 flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <span className="font-orbitron text-cyan-400 text-2xl font-bold">A</span>
                    </div>
                    <div>
                        <h2 className="font-orbitron text-3xl text-pearl uppercase font-black tracking-tighter">Apollo Interface</h2>
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">External Query Node :: Active</p>
                    </div>
                </div>
                <div className="px-4 py-1 bg-cyan-950/30 border border-cyan-500/30 rounded text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                    Status: IDLE
                </div>
            </div>

            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-inner group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
                    <div className="text-center space-y-2">
                        <h3 className="font-minerva italic text-2xl text-pearl">Execute Causal Query</h3>
                        <p className="text-[12px] text-slate-400 font-mono">Initiate data retrieval from the Apollo subsystem.</p>
                    </div>

                    <button 
                        onClick={handleRunQuery}
                        disabled={isLoading}
                        className={`px-10 py-4 font-orbitron text-[12px] font-bold uppercase tracking-[0.3em] transition-all border rounded-sm relative overflow-hidden group/btn ${
                            isLoading 
                            ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-200 cursor-wait' 
                            : 'bg-cyan-500/10 border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                        }`}
                    >
                        <span className="relative z-10">{isLoading ? 'Processing...' : 'Run Query'}</span>
                        {!isLoading && <div className="absolute inset-0 bg-cyan-400/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />}
                    </button>

                    {response && (
                        <div className="w-full bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-sm animate-fade-in-up flex items-center gap-4">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="font-mono text-[10px] text-emerald-300 uppercase tracking-wider">{response}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
