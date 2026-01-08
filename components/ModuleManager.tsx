
import React, { useState } from 'react';
import { SystemState, IngestedModule, LogType } from '../types';
import { Tooltip } from './Tooltip';

interface ModuleManagerProps {
  systemState: SystemState;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
  addLogEntry: (type: LogType, message: string) => void;
}

const RuntimeVisualizer: React.FC<{ active: boolean }> = ({ active }) => {
    return (
        <div className="relative w-full h-48 bg-black/40 border border-white/5 rounded-md overflow-hidden font-mono text-[10px] p-4">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4c1d95 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
            {active ? (
                <div className="flex flex-col gap-1 text-green-400/80 animate-fade-in">
                    <span>{'>'} INIT_RUNTIME_ENV... OK</span>
                    <span>{'>'} MOUNTING_SHARD_0x88... OK</span>
                    <span>{'>'} ESTABLISHING_CAUSAL_LINK...</span>
                    <span className="text-pearl">{'>'} HEURISTIC_PARITY_CHECK: PASSED</span>
                    <span className="animate-pulse">{'>'} STREAMING_TELEMETRY...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-600">
                    MODULE_IDLE
                </div>
            )}
        </div>
    );
};

export const ModuleManager: React.FC<ModuleManagerProps> = ({ systemState, setSystemState, addLogEntry }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const modules = systemState.ingestedModules || [];

    const selectedModule = modules.find(m => m.id === selectedId);

    const handleUnmount = (id: string) => {
        addLogEntry(LogType.SYSTEM, `Unmounting logic shard: ${id}`);
        setSystemState(prev => ({
            ...prev,
            ingestedModules: prev.ingestedModules.filter(m => m.id !== id)
        }));
        setSelectedId(null);
    };

    const handleRestart = (id: string) => {
        addLogEntry(LogType.SYSTEM, `Restarting module process: ${id}`);
        setSystemState(prev => ({
            ...prev,
            ingestedModules: prev.ingestedModules.map(m => 
                m.id === id ? { ...m, status: 'SYNCING' } : m
            )
        }));
        
        setTimeout(() => {
            setSystemState(prev => ({
                ...prev,
                ingestedModules: prev.ingestedModules.map(m => 
                    m.id === id ? { ...m, status: 'MOUNTED' } : m
                )
            }));
            addLogEntry(LogType.INFO, `Module ${id} synced and mounted.`);
        }, 3000);
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in pb-20">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-900/10 border border-blue-500/30 flex items-center justify-center font-orbitron text-blue-400 text-3xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        ⚯
                    </div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold">Logic Module Manager</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">External Shard Orchestration Hub</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active_Shards</span>
                        <span className="font-orbitron text-2xl text-pearl">{modules.length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                {/* Sidebar List */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin">
                    <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-black mb-2">Ingested Registry</h3>
                    {modules.length === 0 && (
                        <div className="p-4 border border-dashed border-white/10 rounded text-[10px] text-slate-600 text-center uppercase tracking-widest">
                            No Modules Ingested
                        </div>
                    )}
                    {modules.map(mod => (
                        <button
                            key={mod.id}
                            onClick={() => setSelectedId(mod.id)}
                            className={`p-4 rounded-sm border text-left transition-all group ${
                                selectedId === mod.id 
                                ? 'bg-white/[0.05] border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                : 'bg-transparent border-white/5 hover:border-white/20'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-orbitron text-[11px] font-bold uppercase tracking-wider ${selectedId === mod.id ? 'text-blue-300' : 'text-pearl'}`}>
                                    {mod.name}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${mod.status === 'MOUNTED' ? 'bg-green-500' : 'bg-yellow-500'} ${selectedId === mod.id ? 'animate-pulse' : ''}`} />
                            </div>
                            <div className="flex justify-between text-[9px] font-mono text-slate-500">
                                <span>{mod.originProject}</span>
                                <span>{mod.status}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-8 flex flex-col gap-6 bg-black/40 border border-white/5 rounded-xl p-8 relative overflow-hidden">
                    {selectedModule ? (
                        <>
                            <div className="flex justify-between items-start border-b border-white/10 pb-6">
                                <div className="space-y-2">
                                    <h3 className="font-minerva italic text-2xl text-pearl">{selectedModule.name}</h3>
                                    <div className="flex gap-4 text-[9px] font-mono uppercase tracking-widest text-slate-400">
                                        <span className="bg-white/5 px-2 py-1 rounded">ID: {selectedModule.id}</span>
                                        <span className="bg-white/5 px-2 py-1 rounded">Origin: {selectedModule.originProject}</span>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="text-[8px] text-slate-600 uppercase tracking-widest block">Entry Point</span>
                                    <code className="text-[10px] text-gold bg-black/40 px-2 py-1 rounded border border-white/10 block">
                                        {selectedModule.entryPoint}
                                    </code>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Runtime Telemetry</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white/[0.02] p-3 rounded border border-white/5">
                                            <p className="text-[8px] text-slate-600">Memory_Alloc</p>
                                            <p className="font-mono text-sm text-pearl">128MB</p>
                                        </div>
                                        <div className="bg-white/[0.02] p-3 rounded border border-white/5">
                                            <p className="text-[8px] text-slate-600">Latency</p>
                                            <p className="font-mono text-sm text-green-400">24ms</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Permissions</span>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-[8px] border border-white/10 px-2 py-1 rounded text-slate-400">READ_STATE</span>
                                        <span className="text-[8px] border border-white/10 px-2 py-1 rounded text-slate-400">WRITE_LOGS</span>
                                        <span className="text-[8px] border border-gold/20 text-gold/80 px-2 py-1 rounded">EXECUTE_CAUSAL</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 flex flex-col gap-2">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Visual Output Stream</span>
                                <RuntimeVisualizer active={selectedModule.status === 'MOUNTED'} />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                <button 
                                    onClick={() => handleUnmount(selectedModule.id)}
                                    className="px-6 py-2 bg-red-900/20 border border-red-500/30 text-red-400 text-[10px] font-orbitron uppercase tracking-widest hover:bg-red-900/40 transition-all rounded-sm"
                                >
                                    Unmount Shard
                                </button>
                                <button 
                                    onClick={() => handleRestart(selectedModule.id)}
                                    className="px-6 py-2 bg-blue-900/20 border border-blue-500/30 text-blue-300 text-[10px] font-orbitron uppercase tracking-widest hover:bg-blue-900/40 transition-all rounded-sm"
                                >
                                    Restart Process
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
                            <div className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-full animate-spin-slow" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Select a Logic Shard</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
