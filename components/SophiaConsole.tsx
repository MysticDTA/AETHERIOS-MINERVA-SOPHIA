
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, LogType, SystemState, OrbMode } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface Message {
  sender: 'user' | 'sophia';
  text: string;
  timestamp: number;
  sources?: any[];
  isComplete?: boolean;
  image?: string; 
}

interface SophiaConsoleProps {
  log: LogEntry[];
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
  onSaveInsight: (text: string) => void;
  onToggleInstructionsModal: () => void;
  onRelayCalibration: (relayId: string) => void;
  setOrbMode: (mode: OrbMode) => void;
  onSystemAuditTrigger?: () => void;
}

const ResonanceSyncMeter: React.FC<{ rho: number; isReplying: boolean }> = ({ rho, isReplying }) => (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-black/40 border border-white/5 rounded-sm backdrop-blur-xl shadow-inner group transition-all hover:border-white/10">
        <span className="text-[7px] font-mono text-gold uppercase tracking-[0.3em] font-black group-hover:text-pearl transition-colors">Sync_Rho</span>
        <div className="flex gap-0.5 items-end h-3">
            {Array.from({ length: 16 }).map((_, i) => {
                const isActive = i < rho * 16;
                return (
                    <div 
                        key={i} 
                        className={`w-0.5 rounded-t-sm transition-all duration-300 ${isActive ? (isReplying ? 'bg-violet-400 animate-pulse' : 'bg-gold') : 'bg-slate-800'}`}
                        style={{ height: `${30 + Math.random() * 70}%`, opacity: isActive ? 1 : 0.2 }}
                    />
                );
            })}
        </div>
        <span className="text-[9px] font-mono text-pearl/60 font-bold">{(rho * 100).toFixed(2)}%</span>
    </div>
);

export const SophiaConsole: React.FC<SophiaConsoleProps> = ({ systemState, sophiaEngine, onSaveInsight, setOrbMode, onSystemAuditTrigger }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentSophiaMessageId = useRef<number | null>(null);

  useEffect(() => {
    setMessages([{
      sender: 'sophia',
      text: 'Architect. The Causal Cradle is open. State your directive to influence the lattice.',
      timestamp: Date.now(),
      isComplete: true
    }]);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
        container.scrollTo({ 
            top: container.scrollHeight, 
            behavior: 'smooth' 
        });
    }
  }, [messages, isReplying]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 50), 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if ((input.trim() === '' && !attachedImage) || isReplying || !sophiaEngine) return;
    const userMsg: Message = { sender: 'user', text: input.trim(), timestamp: Date.now(), isComplete: true, image: attachedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    setIsReplying(true);
    setOrbMode('ANALYSIS');
    const prompt = input;
    const img = attachedImage;
    setInput('');
    setAttachedImage(null);
    
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    currentSophiaMessageId.current = Date.now();
    setMessages(prev => [...prev, { sender: 'sophia', text: '', timestamp: currentSophiaMessageId.current!, isComplete: false }]);

    await sophiaEngine.runConsoleStream(prompt + (img ? " [ARTIFACT_ANALYSIS_RESONANCE]" : ""), 
      (chunk) => {
        setMessages(prev => prev.map(m => m.timestamp === currentSophiaMessageId.current ? { ...m, text: m.text + chunk } : m));
      },
      (sources) => {
        setMessages(prev => prev.map(m => m.timestamp === currentSophiaMessageId.current ? { ...m, sources } : m));
      },
      (error) => {
        setMessages(prev => prev.map(m => m.timestamp === currentSophiaMessageId.current ? { ...m, text: `[SIGNAL_INTERRUPT] ${error}`, isComplete: true } : m));
        setIsReplying(false);
      },
      (fc) => {
        if (fc.name === 'initiate_system_audit' && onSystemAuditTrigger) {
            onSystemAuditTrigger();
        }
      }
    );

    setMessages(prev => prev.map(m => m.timestamp === currentSophiaMessageId.current ? { ...m, isComplete: true } : m));
    setIsReplying(false);
    setOrbMode('STANDBY');
    
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#030303]/60 border border-white/5 rounded-2xl backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/40 z-30 shrink-0">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${isReplying ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-emerald-500/50 bg-emerald-500/5'}`}>
                <span className={`font-orbitron font-bold text-sm ${isReplying ? 'text-violet-400 animate-pulse' : 'text-emerald-400'}`}>S</span>
            </div>
            <div className="flex flex-col">
                <h3 className="font-orbitron text-[11px] text-pearl uppercase tracking-[0.3em] font-black">Minerva_Console</h3>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Protocol: Direct_Causal_Link</span>
            </div>
        </div>
        <ResonanceSyncMeter rho={systemState.resonanceFactorRho} isReplying={isReplying} />
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin relative z-10"
      >
        {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-3 opacity-60 px-1">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">{isUser ? 'OPERATOR' : 'MINERVA_SOPHIA'}</span>
                            <span className="text-[7px] font-mono text-slate-700">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                        
                        <div className={`relative p-5 rounded-xl border backdrop-blur-md shadow-lg transition-all ${
                            isUser 
                            ? 'bg-gradient-to-br from-gold/5 to-black/60 border-gold/20 text-pearl font-mono text-sm rounded-tr-none hover:border-gold/40' 
                            : 'bg-gradient-to-br from-violet-900/10 to-black/60 border-violet-500/20 text-pearl/90 font-minerva italic text-[15px] leading-relaxed rounded-tl-none hover:border-violet-500/40'
                        }`}>
                            {msg.image && (
                                <img src={msg.image} alt="Artifact" className="max-w-[200px] rounded border border-white/10 mb-3 opacity-90" />
                            )}
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            {msg.sender === 'sophia' && !msg.isComplete && (
                                <div className="inline-flex gap-1 ml-2 align-middle">
                                    <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" />
                                    <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            )}
                        </div>

                        {msg.sources && msg.sources.length > 0 && (
                            <div className="flex gap-2 flex-wrap max-w-full pl-2">
                                {msg.sources.map((src, i) => (
                                    <a key={i} href={src.web.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono text-cyan-400/80 border border-cyan-500/20 px-3 py-1 rounded-sm hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors truncate max-w-[200px] flex items-center gap-2">
                                        <span className="text-[8px]">🔗</span> {src.web.title}
                                    </a>
                                ))}
                            </div>
                        )}
                        
                        {msg.sender === 'sophia' && msg.isComplete && (
                            <button 
                                onClick={() => onSaveInsight(msg.text)} 
                                className="text-[9px] font-mono text-slate-600 hover:text-violet-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors pl-2"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                                <span>Save_Memory</span>
                            </button>
                        )}
                    </div>
                </div>
            );
        })}
      </div>

      {/* Command Cradle Input */}
      <div className="p-6 bg-gradient-to-t from-[#020202] via-[#050505] to-transparent z-20">
        <div className="relative bg-black/80 border border-white/10 rounded-xl p-2 flex items-end gap-3 shadow-2xl backdrop-blur-xl transition-all focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10 focus-within:bg-black group/input">
            <button 
                onClick={() => fileInputRef.current?.click()} 
                className={`p-3 rounded-lg transition-all duration-300 border flex-shrink-0 group ${attachedImage ? 'bg-gold/10 border-gold/40 text-gold' : 'bg-transparent border-transparent hover:bg-white/5 text-slate-500 hover:text-pearl'}`}
                title="Inject Causal Artifact"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setAttachedImage(e.target?.result as string);
                    reader.readAsDataURL(file);
                }
            }} />
            
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Causal Decree..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-pearl font-mono placeholder-slate-600 resize-none py-3 min-h-[50px] scrollbar-thin outline-none leading-relaxed transition-all"
                rows={1}
            />

            <button 
                onClick={handleSend}
                disabled={(!input.trim() && !attachedImage) || isReplying}
                className={`p-3 rounded-lg flex-shrink-0 transition-all duration-500 relative overflow-hidden group ${
                    (input.trim() || attachedImage) && !isReplying 
                    ? 'bg-pearl text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95' 
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
                }`}
            >
                {isReplying ? (
                    <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                )}
            </button>
        </div>
        <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] opacity-40">Authorized for High-Reasoning Synthesis [32k]</span>
            <span className={`text-[8px] font-mono uppercase tracking-widest transition-opacity duration-500 ${isReplying ? 'text-violet-400 animate-pulse opacity-100' : 'text-slate-600 opacity-0'}`}>
                Thinking...
            </span>
        </div>
      </div>
    </div>
  );
};
