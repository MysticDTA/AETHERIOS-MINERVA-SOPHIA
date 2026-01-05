
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { LogType, OrbMode } from '../types';
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

const ResonanceMemoryPulsar: React.FC<{ active: boolean; audioLevel?: number }> = ({ active, audioLevel = 0 }) => (
    <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer Resonance Rings */}
        <div className={`absolute inset-0 rounded-full border border-violet-500/20 ${active ? 'animate-[spin_4s_linear_infinite]' : 'opacity-20'}`} style={{ borderStyle: 'dashed' }} />
        <div className={`absolute inset-2 rounded-full border border-violet-400/10 ${active ? 'animate-[spin_6s_linear_infinite_reverse]' : 'opacity-20'}`} />
        
        {/* Dynamic Audio Pulse */}
        <div 
            className={`absolute inset-4 rounded-full bg-violet-600/20 transition-all duration-75 blur-md ${active ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: `scale(${1 + Math.random() * 0.5})` }} 
        />
        
        {/* Core Orb */}
        <div className={`w-6 h-6 rounded-full transition-all duration-1000 relative z-10 ${active ? 'bg-pearl shadow-[0_0_30px_rgba(248,245,236,0.8)] scale-110' : 'bg-violet-900/60 border border-violet-500/30'}`}>
            {active && <div className="absolute inset-0 bg-white animate-ping rounded-full opacity-50" />}
        </div>
        
        {active && (
            <div className="absolute -bottom-8 text-[8px] font-mono text-pearl uppercase tracking-widest animate-pulse font-bold bg-violet-950/40 px-2 py-0.5 rounded border border-violet-500/20">
                LIVE_AUDIO_INGEST
            </div>
        )}
    </div>
);

const TranscriptionVessel: React.FC<{ title: string, text: string, type: 'user' | 'sophia' }> = ({ title, text, type }) => {
    const isUser = type === 'user';
    const themeColor = isUser ? 'text-amber-400' : 'text-violet-300';
    
    return (
        <div className={`flex-1 flex flex-col rounded-xl border p-5 transition-all duration-700 relative overflow-hidden backdrop-blur-md shadow-lg group ${
            isUser 
            ? 'bg-gradient-to-br from-amber-950/10 to-black/40 border-amber-500/20 hover:border-amber-500/40' 
            : 'bg-gradient-to-br from-violet-950/10 to-black/40 border-violet-500/20 hover:border-violet-500/40'
        }`}>
            {/* Status Indicator */}
            <div className={`absolute top-3 right-3 flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/5 ${text ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isUser ? 'bg-amber-500' : 'bg-violet-500'} ${text ? 'animate-pulse' : ''}`} />
                <span className={`text-[7px] font-mono font-bold uppercase tracking-widest ${isUser ? 'text-amber-500' : 'text-violet-500'}`}>
                    {isUser ? 'RX_ACTIVE' : 'TX_STREAMING'}
                </span>
            </div>
            
            <div className="flex items-center gap-3 mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className={`w-1 h-4 rounded-sm ${isUser ? 'bg-amber-500' : 'bg-violet-500'}`} />
                <h4 className={`font-orbitron text-[10px] font-black uppercase tracking-[0.3em] ${themeColor}`}>{title}</h4>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                <p className={`text-[14px] leading-relaxed transition-opacity duration-700 ${isUser ? 'font-mono text-amber-100/90' : 'font-minerva text-pearl/90 italic'} ${!text ? 'opacity-20' : 'opacity-100'}`}>
                    {text || (isUser ? "Listening for causal intent..." : "Reasoning matrix idle...")}
                    {text && <span className={`inline-block w-1.5 h-4 ml-1 animate-pulse align-middle ${isUser ? 'bg-amber-500' : 'bg-violet-400'}`} />}
                </p>
            </div>
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
        <div className="w-full h-full bg-[#050505] border border-white/10 p-6 rounded-xl relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-6 z-10 border-b border-white/10 pb-4">
                <div className="flex flex-col gap-2">
                    <h3 className="font-minerva text-3xl text-pearl italic tracking-tighter">Vocal Bridge Protocol</h3>
                    <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${isSessionActive ? 'border-violet-500 text-violet-400 bg-violet-950/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]' : 'border-slate-800 text-slate-600'}`}>
                            {isSessionActive ? 'NEURAL_LINK_STABLE' : 'BRIDGE_OFFLINE'}
                        </span>
                        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Protocol: CHARON_v1</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {!isSessionActive && (
                        <Tooltip text="Direct System Command (Local Recognition)">
                            <button 
                                onClick={toggleLocalDirective}
                                className={`px-6 py-3 rounded-sm font-orbitron text-[9px] font-bold uppercase tracking-[0.2em] transition-all border relative overflow-hidden active:scale-95 group ${
                                    isLocalListening 
                                    ? 'bg-amber-950/20 border-amber-500 text-amber-400 animate-pulse' 
                                    : 'bg-black border-white/10 text-slate-500 hover:text-amber-400 hover:border-amber-500/50'
                                }`}
                            >
                                <div className="absolute inset-0 bg-amber-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative z-10">{isLocalListening ? 'LISTENING_FOR_DECREE...' : 'OVERRIDE_DIRECTIVE'}</span>
                            </button>
                        </Tooltip>
                    )}
                    
                    <button 
                        onClick={isSessionActive ? closeSession : startSession}
                        className={`px-8 py-3 rounded-sm font-orbitron text-[9px] font-bold uppercase tracking-[0.3em] transition-all border shadow-lg active:scale-95 relative overflow-hidden group ${
                            isSessionActive 
                            ? 'bg-red-950/40 border-red-500 text-red-400 hover:bg-red-900/60' 
                            : 'bg-violet-950/40 border-violet-500 text-violet-300 hover:bg-violet-900/60'
                        }`}
                    >
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="relative z-10">{isSessionActive ? 'SEVER_CONNECTION' : 'INITIALIZE_VOICE_LINK'}</span>
                    </button>
                </div>
            </div>

            {/* Resonance Centerpiece */}
            <div className="flex justify-center items-center py-6 relative z-10 min-h-[160px]">
                <ResonanceMemoryPulsar active={isSessionActive} />
                
                {lastSystemCommand && (
                    <div className="absolute top-0 right-0 p-3 bg-black/60 border border-white/10 rounded backdrop-blur animate-fade-in">
                        <p className="text-[8px] text-slate-500 uppercase font-mono tracking-widest mb-1">Last_Directive</p>
                        <p className="text-[10px] text-gold font-orbitron font-bold">{lastSystemCommand}</p>
                    </div>
                )}

                {localFeedback && (
                    <div className="absolute bottom-0 text-center animate-fade-in-up">
                        <span className="bg-amber-950/80 border border-amber-500 text-amber-400 px-4 py-1.5 rounded-full text-[9px] font-mono font-bold tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            {localFeedback}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 relative z-10">
                <TranscriptionVessel 
                    title="Architect Input" 
                    text={userInput || (isLocalListening ? localTranscript : '')} 
                    type="user" 
                />
                <TranscriptionVessel 
                    title="Sophia Neural Response" 
                    text={sophiaOutput} 
                    type="sophia" 
                />
            </div>

            {/* History Feed */}
            {history.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10 max-h-[120px] overflow-y-auto scrollbar-thin">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Causal_Memory_Buffer</span>
                        <button onClick={clearHistory} className="text-[8px] text-slate-600 hover:text-rose-400 uppercase tracking-wider transition-colors">Clear_Buffer</button>
                    </div>
                    <div className="space-y-3">
                        {history.slice().reverse().map((entry, i) => (
                            <div key={i} className="text-[10px] font-mono grid grid-cols-12 gap-4 opacity-60 hover:opacity-100 transition-opacity">
                                <span className="col-span-1 text-slate-600">{(history.length - i).toString().padStart(2, '0')}</span>
                                <span className="col-span-5 text-slate-400 truncate">"{entry.user}"</span>
                                <span className="col-span-6 text-violet-400/80 truncate">→ "{entry.sophia}"</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
