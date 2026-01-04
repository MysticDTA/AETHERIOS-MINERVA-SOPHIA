
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ResonanceSymmetryArray } from './ResonanceSymmetryArray';
import { OrbMode } from '../types';
import { Tooltip } from './Tooltip';

interface VoiceInterfaceProps {
  isSessionActive: boolean;
  startSession: () => void;
  closeSession: () => void;
  userInput: string;
  sophiaOutput: string;
  history: { user: string; sophia: string }[];
  resonance: number;
  lastSystemCommand?: string | null;
  onSetOrbMode?: (mode: OrbMode) => void;
  clearHistory?: () => void;
}

const ResonanceMemoryPulsar: React.FC<{ active: boolean }> = ({ active }) => (
    <div className="relative w-16 h-16 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full border-2 border-violet-500/10 ${active ? 'animate-ping' : ''}`} />
        <div className={`absolute inset-2 rounded-full border border-violet-400/20 ${active ? 'animate-[pulse_2s_infinite]' : ''}`} />
        <div className={`w-4 h-4 rounded-full transition-all duration-1000 ${active ? 'bg-pearl shadow-[0_0_20px_rgba(248,245,236,0.9)] scale-125' : 'bg-violet-900/40'}`} />
        {active && (
            <div className="absolute -top-8 text-[8px] font-mono text-pearl uppercase tracking-widest animate-bounce">
                MEM_SYNC
            </div>
        )}
    </div>
);

const TranscriptionVessel: React.FC<{ title: string, text: string, type: 'user' | 'sophia' }> = ({ title, text, type }) => {
    const isUser = type === 'user';
    
    // Distincit color paths for absolute clarity
    const themeColor = isUser ? 'text-amber-500' : 'text-violet-400';
    const borderColor = isUser 
        ? (text ? 'border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]' : 'border-white/5 bg-black/20') 
        : (text ? 'border-violet-500/60 shadow-[0_0_25px_rgba(167,139,250,0.15)]' : 'border-white/5 bg-black/20');
    
    const bgStyle = isUser 
        ? 'bg-gradient-to-br from-amber-950/20 via-black to-transparent' 
        : 'bg-gradient-to-br from-violet-950/20 via-black to-transparent';

    return (
        <div className={`flex-1 flex flex-col rounded-xl border p-6 transition-all duration-700 relative overflow-hidden backdrop-blur-md ${bgStyle} ${borderColor} shadow-2xl`}>
            {/* Dynamic Status Corner Badge */}
            <div className={`absolute top-0 right-0 px-4 py-1.5 text-[8px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-500 ${text ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'} ${isUser ? 'bg-amber-500/30 text-amber-300' : 'bg-violet-500/30 text-violet-300'}`}>
                {isUser ? 'RX_ACTIVE' : 'TX_STREAMING'}
            </div>
            
            <div className="flex justify-between items-center mb-5 flex-shrink-0 relative z-10 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${isUser ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' : 'bg-violet-400 shadow-[0_0_12px_#a78bfa]'} ${text ? 'animate-pulse' : 'opacity-40'}`} />
                    <div className="flex flex-col">
                        <h4 className={`font-orbitron text-[10px] font-black uppercase tracking-[0.4em] ${themeColor}`}>
                            {title}
                        </h4>
                        <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">Channel_0x88_V{isUser ? '1' : '2'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 font-mono text-[8px] text-slate-600">
                    <span className="opacity-40">{isUser ? '16KHZ_LVM' : '24KHZ_PCM'}</span>
                    <div className={`w-1 h-4 rounded-full ${text ? 'bg-pearl animate-blink' : 'bg-slate-800'}`} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-3 scrollbar-thin">
                <p className={`text-[15px] leading-relaxed transition-opacity duration-700 ${isUser ? 'font-mono text-amber-100/80 italic' : 'font-minerva text-pearl italic'} ${!text ? 'opacity-20' : 'opacity-100'}`}>
                    {text || (isUser ? "Awaiting operator vocal intent..." : "Synthesizing intelligence response...")}
                    {text && <span className={`inline-block w-2 h-5 ml-2 animate-pulse align-middle ${isUser ? 'bg-amber-500/40' : 'bg-violet-400/40'}`} />}
                </p>
            </div>
            
            {/* Contextual Grain / Grid Background */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', 
                    backgroundSize: '24px 24px', 
                    color: isUser ? '#f59e0b' : '#a78bfa' 
                }} 
            />
        </div>
    );
};

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
    isSessionActive, 
    startSession, 
    closeSession, 
    userInput, 
    sophiaOutput,
    history,
    resonance,
    lastSystemCommand,
    onSetOrbMode,
    clearHistory
}) => {
    const [isLocalListening, setIsLocalListening] = useState(false);
    const [localTranscript, setLocalTranscript] = useState('');
    const [localFeedback, setLocalFeedback] = useState<string | null>(null);
    const feedbackTimeoutRef = useRef<number | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.lang = 'en-US';
            recog.interimResults = false;
            recog.maxAlternatives = 1;
            recognitionRef.current = recog;
        }
    }, []);

    const triggerLocalFeedback = (message: string) => {
        if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
        setLocalFeedback(message);
        feedbackTimeoutRef.current = window.setTimeout(() => setLocalFeedback(null), 3000);
    };

    const handleLocalCommand = useCallback((transcript: string) => {
        const lower = transcript.toLowerCase();
        const modeMap: Record<string, OrbMode> = {
            'standby': 'STANDBY',
            'analysis': 'ANALYSIS',
            'analyze': 'ANALYSIS',
            'synthesis': 'SYNTHESIS',
            'synthesize': 'SYNTHESIS',
            'repair': 'REPAIR',
            'healing': 'REPAIR',
            'grounding': 'GROUNDING',
            'ground': 'GROUNDING',
            'concordance': 'CONCORDANCE',
            'align': 'CONCORDANCE',
            'offline': 'OFFLINE',
            'shut down': 'OFFLINE'
        };

        const foundKey = Object.keys(modeMap).find(key => lower.includes(key));
        if (foundKey && onSetOrbMode) {
            const targetMode = modeMap[foundKey];
            onSetOrbMode(targetMode);
            triggerLocalFeedback(`DIRECTIVE: ${targetMode} ENGAGED`);
        } else {
            triggerLocalFeedback("PATTERN_NOT_MATCHED");
        }
    }, [onSetOrbMode]);

    const toggleLocalDirective = () => {
        if (!recognitionRef.current || isSessionActive) return;

        if (isLocalListening) {
            recognitionRef.current.stop();
            setIsLocalListening(false);
        } else {
            try {
                setLocalTranscript('');
                recognitionRef.current.start();
                setIsLocalListening(true);
                
                recognitionRef.current.onresult = (event: any) => {
                    const last = event.results.length - 1;
                    const transcript = event.results[last][0].transcript;
                    setLocalTranscript(transcript);
                    handleLocalCommand(transcript);
                };
                
                recognitionRef.current.onend = () => setIsLocalListening(false);
                recognitionRef.current.onerror = () => {
                    setIsLocalListening(false);
                    triggerLocalFeedback("SENSOR_ERR");
                };
            } catch (e) {
                setIsLocalListening(false);
            }
        }
    };

    return (
        <div className="w-full h-full bg-dark-surface/40 border border-dark-border/60 p-6 rounded-xl border-glow-aether backdrop-blur-md flex flex-col relative overflow-hidden group">
            {/* Background Interference */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(109,40,217,0)_50%,rgba(109,40,217,0.01)_50%)] bg-[length:100%_8px] z-0 opacity-40"></div>

            {/* Header Telemetry */}
            <div className="flex justify-between items-center mb-8 z-10 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h3 className="font-minerva text-3xl text-pearl italic tracking-tighter">Vocal Bridge Protocol</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`text-[10px] font-mono px-3 py-0.5 rounded-full border ${isSessionActive ? 'border-violet-500 text-violet-400 bg-violet-950/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-slate-800 text-slate-600'}`}>
                                {isSessionActive ? 'NEURAL_LINK_STABLE' : 'BRIDGE_OFFLINE'}
                            </span>
                            <div className="h-3 w-px bg-white/10" />
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest opacity-60 font-black">Operator: ARCHITECT_88</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    {!isSessionActive && (
                        <Tooltip text="Direct System Command (Local Recognition)">
                            <button 
                                onClick={toggleLocalDirective}
                                className={`px-6 py-3.5 rounded-sm font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] transition-all border relative overflow-hidden active:scale-95 ${
                                    isLocalListening 
                                    ? 'bg-amber-950/20 border-amber-500 text-amber-400 animate-pulse' 
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/50'
                                }`}
                            >
                                <span className="relative z-10 font-black">{isLocalListening ? 'Listening...' : 'Quick Cmd'}</span>
                            </button>
                        </Tooltip>
                    )}
                    <button 
                        onClick={isSessionActive ? closeSession : startSession}
                        className={`px-8 py-3.5 rounded-sm font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] transition-all border relative overflow-hidden group/btn active:scale-95 ${
                            isSessionActive 
                            ? 'bg-rose-950/30 border-rose-500/60 text-rose-400 hover:bg-rose-500 hover:text-white' 
                            : 'bg-violet-900/30 border-violet-500/60 text-violet-300 hover:bg-violet-500 hover:text-white'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10 font-black">{isSessionActive ? 'Sever Connection' : 'Initialize Bridge'}</span>
                    </button>
                </div>
            </div>

            {/* Main Interaction Area */}
            <div className="flex-1 flex flex-col gap-8 min-h-0 relative z-10">
                {/* Active Transcription Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-1/2 min-h-0">
                   <div className="h-full flex flex-col min-h-0 relative border border-white/5 rounded-xl bg-black/40 overflow-hidden shadow-inner group/symmetry">
                      <div className="absolute top-4 left-5 z-20">
                          <span className="text-[8px] font-mono text-violet-500/80 bg-black/80 px-2.5 py-1 border border-violet-900/50 rounded uppercase tracking-[0.3em] font-black">Phase_Harmonic_Array</span>
                      </div>
                      <ResonanceSymmetryArray rho={resonance} isOptimizing={isSessionActive} />
                   </div>
                   <div className="flex flex-col gap-4 min-h-0">
                      <TranscriptionVessel title="Operator_Intent_Rx" text={isLocalListening ? localTranscript : userInput} type="user" />
                      <TranscriptionVessel title="Sophia_Synthesized_Tx" text={sophiaOutput} type="sophia" />
                   </div>
                </div>

                {/* Status Synchronizer & Command Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-shrink-0">
                    <div className="flex flex-col items-center justify-center py-6 bg-black/50 border border-white/10 rounded-xl relative shadow-inner group/sync">
                        <ResonanceMemoryPulsar active={isSessionActive && (!!userInput || !!sophiaOutput)} />
                        <div className="mt-5 text-center">
                            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.6em] font-black mb-3">Phase Synchronization</p>
                            <div className="flex gap-3 justify-center">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-0.5 h-5 rounded-full transition-all duration-700 ${isSessionActive ? 'bg-violet-400 animate-pulse shadow-[0_0_5px_rgba(167,139,250,0.5)]' : 'bg-slate-800'}`} 
                                        style={{ animationDelay: `${i * 0.1}s`, opacity: isSessionActive ? (1 - (Math.abs(i - 8) / 8)) : 0.2 }} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/60 border border-white/10 rounded-xl p-6 flex flex-col justify-center gap-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                             <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">System Directive Hub</span>
                             <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_12px_#6d28d9] animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded border border-white/5">
                                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold">Last Decree</span>
                                <span className="text-[11px] font-mono text-pearl uppercase font-black tracking-tighter">
                                    {lastSystemCommand || localFeedback || 'NONE'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center opacity-50 px-3">
                                <span className="text-[8px] font-mono text-slate-600 uppercase">Input Channel</span>
                                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-widest">
                                    {isSessionActive ? 'Gemini_Bridge_TX' : isLocalListening ? 'Local_Sensor_RX' : 'STANDBY'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Causal Archive */}
                <div className="flex-1 min-h-0 flex flex-col bg-black/70 border border-white/10 rounded-xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                    <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-5 bg-violet-500 rounded-sm shadow-[0_0_10px_#6d28d9]" />
                            <span className="text-[12px] text-warm-grey uppercase tracking-[0.4em] font-black">Causal Exchange Archive</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={clearHistory}
                                className="text-[9px] font-mono text-slate-500 hover:text-rose-400 uppercase tracking-widest transition-colors font-bold"
                            >
                                [Flush_Buffer]
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-4 py-1.5 rounded-full tracking-tighter border border-white/10 font-bold">CYCLES: {history.length}</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin">
                        {history.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-xs text-warm-grey gap-8">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-current flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <span className="font-orbitron uppercase tracking-[0.8em] text-[11px] font-black">Awaiting Causal Input</span>
                            </div>
                        ) : (
                            [...history].reverse().map((turn, i) => (
                                <div key={i} className="animate-fade-in group relative border border-white/5 bg-white/[0.01] p-8 rounded-lg transition-all hover:bg-white/[0.03] hover:border-white/20 shadow-xl">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase mb-6 tracking-[0.3em] border-b border-white/5 pb-4 font-black">
                                        <span className="text-pearl/40">Sequence_{(history.length - i).toString().padStart(3, '0')}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-green-500/60 font-black group-hover:text-green-400 transition-colors">PARITY_LOCK: OK</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                            <span className="opacity-40">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        <div className="flex gap-6 group/user p-4 rounded-lg border border-transparent hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all">
                                            <div className="w-1.5 bg-amber-500/30 rounded-full shrink-0 group-hover/user:bg-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                                            <div className="space-y-2.5 flex-1">
                                                <span className="text-[9px] font-mono text-amber-500/80 uppercase font-black tracking-[0.4em]">Operator_Intent</span>
                                                <p className="text-[14px] text-amber-100/80 font-mono italic leading-relaxed">{turn.user}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 group/sophia p-4 rounded-lg border border-transparent hover:border-violet-500/20 hover:bg-violet-500/[0.03] transition-all">
                                            <div className="w-1.5 bg-violet-500/30 rounded-full shrink-0 group-hover/sophia:bg-violet-400 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
                                            <div className="space-y-2.5 flex-1">
                                                <span className="text-[9px] font-mono text-violet-400/80 uppercase font-black tracking-[0.4em]">Sophia_Synthesis</span>
                                                <p className="text-[16px] text-pearl/90 font-minerva italic leading-relaxed antialiased">{turn.sophia}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-[11px] font-mono text-slate-500 uppercase tracking-[0.4em] relative z-10 font-bold">
                <div className="flex gap-12">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-600">Sync_Rho:</span>
                        <span className="text-pearl font-black tracking-tighter">{(resonance).toFixed(8)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-600">Carrier:</span>
                        <span className="text-green-500">ABSOLUTE_OK</span>
                    </div>
                    <div className="flex items-center gap-4 hidden xl:flex">
                        <span className="text-slate-600">Jitter:</span>
                        <span className="text-cyan-400">0.000004ms</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 px-5 py-1.5 bg-violet-950/20 border border-violet-500/20 rounded-full">
                    <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_12px_#6d28d9]" />
                    <span className="text-pearl/80 font-black tracking-widest">Neural_Gate_Active</span>
                </div>
            </div>
        </div>
    );
};
