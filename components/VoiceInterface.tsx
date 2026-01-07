
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
    
    // Distinct visual themes
    const theme = isUser ? {
        border: 'border-amber-500/30 hover:border-amber-500/50',
        bg: 'bg-gradient-to-br from-amber-950/20 via-black/40 to-black',
        text: 'text-amber-100',
        subtext: 'text-amber-500',
        indicator: 'bg-amber-500',
        font: 'font-mono tracking-tight',
        iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        pattern: 'bg-[radial-gradient(circle_at_center,_var(--gold)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-[0.03]'
    } : {
        border: 'border-violet-500/30 hover:border-violet-500/50',
        bg: 'bg-gradient-to-bl from-violet-950/20 via-black/40 to-black',
        text: 'text-violet-100',
        subtext: 'text-violet-400',
        indicator: 'bg-violet-500',
        font: 'font-minerva italic tracking-wide',
        iconBg: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
        pattern: 'bg-[linear-gradient(45deg,_var(--aether-blue)_1px,_transparent_1px)] bg-[length:32px_32px] opacity-[0.03]'
    };

    return (
        <div className={`flex-1 flex flex-col rounded-xl border p-6 transition-all duration-700 relative overflow-hidden backdrop-blur-md shadow-2xl group ${theme.bg} ${theme.border} ${text ? 'opacity-100' : 'opacity-70'}`}>
            
            {/* Background Pattern */}
            <div className={`absolute inset-0 pointer-events-none ${theme.pattern}`} />
            
            {/* Active Status Badge */}
            <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5 backdrop-blur-sm ${text ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${theme.indicator} ${text ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${theme.subtext}`}>
                    {isUser ? 'RX_CHANNEL' : 'NEURAL_TX'}
                </span>
            </div>
            
            {/* Header / Icon */}
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${theme.iconBg} shadow-inner`}>
                    {isUser ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    )}
                </div>
                <div className="flex flex-col">
                    <h4 className={`font-orbitron text-[11px] font-black uppercase tracking-[0.2em] ${theme.text} mb-0.5`}>{title}</h4>
                    <span className={`text-[8px] font-mono uppercase tracking-widest opacity-60 ${theme.subtext}`}>
                        {isUser ? 'Signal_Origin: Operator' : 'Signal_Origin: Core_Logic'}
                    </span>
                </div>
            </div>

            {/* Live Text Area */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin relative z-10 min-h-[100px]">
                <p className={`text-[16px] leading-relaxed transition-opacity duration-500 ${theme.font} ${theme.text} ${!text ? 'opacity-30' : 'opacity-100'}`}>
                    {text || (isUser ? "Awaiting vocal input..." : "Reasoning matrix idle...")}
                    {text && <span className={`inline-block w-2 h-4 ml-1 animate-pulse align-middle ${theme.indicator}`} />}
                </p>
            </div>
            
            {/* Decorative Corner Accent */}
            <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-xl opacity-20 ${theme.border.split(' ')[0]}`} />
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
                <div className="mt-6 pt-4 border-t border-white/10 max-h-[160px] overflow-y-auto scrollbar-thin relative z-10">
                    <div className="flex justify-between items-center mb-3 bg-black/40 p-2 rounded border border-white/5 sticky top-0 z-20 backdrop-blur">
                        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest font-bold">Causal_Memory_Buffer</span>
                        <button onClick={clearHistory} className="text-[8px] text-slate-600 hover:text-rose-400 uppercase tracking-wider transition-colors border border-transparent hover:border-rose-500/30 px-2 rounded">Clear_Buffer</button>
                    </div>
                    <div className="space-y-3 pb-2">
                        {history.slice().reverse().map((entry, i) => (
                            <div key={i} className="flex flex-col gap-1 text-[10px] font-mono opacity-80 hover:opacity-100 transition-opacity bg-white/[0.01] rounded-sm overflow-hidden border border-white/5">
                                {/* Metadata Row */}
                                <div className="flex justify-between items-center bg-white/[0.02] px-3 py-1.5 border-b border-white/5">
                                    <span className="text-slate-600 tracking-tighter">REF_ID: {(history.length - i).toString().padStart(4, '0')}</span>
                                    <span className="text-[7px] text-slate-700 uppercase tracking-widest">ARCHIVED_EXCHANGE</span>
                                </div>
                                {/* Architect Turn */}
                                <div className="px-3 py-2 bg-amber-950/10 border-l-2 border-amber-500/30 text-amber-100/90 leading-relaxed">
                                    <span className="text-amber-600 font-bold mr-2 uppercase text-[7px] tracking-widest bg-amber-950/30 px-1 rounded">USR</span>
                                    {entry.user}
                                </div>
                                {/* Sophia Turn */}
                                <div className="px-3 py-2 bg-violet-950/10 border-l-2 border-violet-500/30 text-violet-100/90 leading-relaxed italic">
                                    <span className="text-violet-500 font-bold mr-2 uppercase text-[7px] tracking-widest bg-violet-950/30 px-1 rounded">SYS</span>
                                    {entry.sophia}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
