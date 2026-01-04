
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

const BlinkingCursor: React.FC = () => (
    <span className="inline-block w-2 h-4 bg-violet-500 ml-1 animate-blink align-middle shadow-[0_0_12px_#6d28d9]" />
);

const ResonanceSyncMeter: React.FC<{ rho: number; isReplying: boolean }> = ({ rho, isReplying }) => (
    <div className="flex items-center gap-4 px-6 py-2 bg-black/60 border border-white/5 rounded-full backdrop-blur-xl shadow-inner">
        <span className="text-[7px] font-mono text-gold uppercase tracking-[0.3em] font-black">Sync_Rho</span>
        <div className="flex gap-0.5 items-end h-3">
            {Array.from({ length: 12 }).map((_, i) => {
                const isActive = i < rho * 12;
                return (
                    <div 
                        key={i} 
                        className={`w-1 rounded-t-sm transition-all duration-500 ${isActive ? (isReplying ? 'bg-violet-500 animate-pulse' : 'bg-gold') : 'bg-white/5'}`}
                        style={{ height: `${20 + i * 8}%`, opacity: isActive ? (0.4 + (i/12) * 0.6) : 0.2 }}
                    />
                );
            })}
        </div>
        <span className="text-[9px] font-mono text-pearl/60">{(rho * 100).toFixed(2)}%</span>
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
      text: 'Architect. Interface upgrade 1.3.1 initialized. MotherWomb stability is absolute. Coherence resonance monitoring is now real-time. I await your causal decree.',
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
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        if (isNearBottom || isReplying) {
            container.scrollTo({ 
                top: container.scrollHeight, 
                behavior: 'smooth' 
            });
        }
    }
  }, [messages, isReplying]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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
    <div className={`w-full h-full bg-[#030303]/40 border border-white/5 rounded-2xl flex flex-col backdrop-blur-3xl shadow-2xl relative overflow-hidden transition-all duration-1000 ${isReplying ? 'ring-1 ring-violet-500/20' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/40 z-30 shrink-0">
        <div className="flex flex-col">
            <h3 className="font-minerva italic text-2xl text-pearl text-glow-pearl tracking-tight leading-tight">Interaction Sanctum</h3>
            <div className="flex items-center gap-3 mt-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isReplying ? 'bg-violet-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`} />
                <span className="text-[8px] font-mono uppercase tracking-[0.4em] font-black text-slate-500">
                    {isReplying ? 'GESTALT_ACTIVE' : 'COHERENT'}
                </span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <ResonanceSyncMeter rho={systemState.resonanceFactorRho} isReplying={isReplying} />
            <button 
                onClick={() => fileInputRef.current?.click()} 
                className={`p-3 rounded-sm transition-all duration-500 border active:scale-95 ${attachedImage ? 'bg-gold/20 border-gold/40 text-gold' : 'bg-white/5 hover:bg-white/10 text-slate-500 hover:text-gold border-white/10'}`}
                title="Inject Artifact"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setAttachedImage(e.target?.result as string);
                    reader.readAsDataURL(file);
                }
            }} />
        </div>
      </div>

      {/* Message Flow */}
      <div className="relative flex-1 min-h-0">
        <div ref={scrollRef} className="h-full overflow-y-auto px-8 py-10 space-y-10 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={m.timestamp + i} className={`flex flex-col gap-3 animate-fade-in-up ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-center gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-[7px] font-mono uppercase tracking-[0.3em] font-black ${m.sender === 'user' ? 'text-amber-500' : 'text-violet-400'}`}>
                      {m.sender === 'user' ? 'ARCHITECT' : 'MINERVA_SOPHIA'}
                  </span>
                  <span className="text-[6px] text-slate-700 font-mono opacity-40">[{new Date(m.timestamp).toLocaleTimeString([], { hour12: false, hour:'2-digit', minute:'2-digit'})}]</span>
              </div>
              
              <div className={`max-w-[90%] p-6 rounded-xl border transition-all duration-700 ${
                m.sender === 'user' 
                  ? 'bg-amber-950/5 border-amber-500/20 text-amber-50/90 font-mono italic shadow-xl' 
                  : 'bg-violet-950/5 border-violet-500/10 text-pearl font-minerva italic text-lg shadow-xl'
              } relative group/msg overflow-hidden`}>
                {m.image && <img src={m.image} alt="Artifact" className="w-full h-auto mb-6 rounded-lg border border-white/10 opacity-90 shadow-lg" />}
                <p className="leading-relaxed select-text whitespace-pre-wrap antialiased">
                  {m.text}
                  {!m.isComplete && <BlinkingCursor />}
                </p>
                
                {m.sources && m.sources.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                        {m.sources.map((s, idx) => (
                            <a key={idx} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[7px] font-mono text-slate-500 hover:text-gold transition-colors bg-white/5 px-2 py-1 rounded-sm border border-white/5 hover:border-gold/30">
                                [SRC_{idx}]
                            </a>
                        ))}
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Module */}
      <div className="p-8 bg-black/40 border-t border-white/10 z-30 shrink-0 shadow-2xl">
        {attachedImage && (
            <div className="mb-6 relative w-20 h-20 group animate-scale-in">
                <img src={attachedImage} className="w-full h-full object-cover rounded-lg border border-gold/50 shadow-lg" />
                <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1.5 shadow-xl hover:bg-rose-500 transition-colors z-40 active:scale-90">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        )}
        <div className="relative flex items-end gap-6 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Inject decree into logic womb..."
              className="w-full bg-black/60 border border-white/10 rounded-xl p-5 pr-12 text-[15px] text-pearl placeholder-slate-700 focus:outline-none focus:border-violet-500/40 transition-all font-mono italic resize-none min-h-[60px] max-h-[140px] overflow-y-auto scrollbar-none shadow-inner"
              disabled={isReplying}
            />
            <div className="absolute bottom-3 right-5 font-mono text-[6px] text-slate-800 pointer-events-none uppercase tracking-[0.5em] font-black">
                0x88_GATE
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={isReplying || (input.trim() === '' && !attachedImage)}
            className={`w-14 h-14 rounded-xl border transition-all duration-500 active:scale-95 flex items-center justify-center shrink-0 ${
              isReplying 
                ? 'bg-white/5 border-white/10 text-slate-800 cursor-not-allowed' 
                : 'bg-violet-600/10 border-violet-500/40 text-violet-400 hover:bg-violet-600 hover:text-white shadow-lg active:shadow-inner'
            }`}
          >
            <svg className={`w-6 h-6 rotate-90 transition-transform ${isReplying ? 'animate-spin opacity-20' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
