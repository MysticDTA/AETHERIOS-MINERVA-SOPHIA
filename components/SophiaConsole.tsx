
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
      text: 'Architect. ÆTHERIOS is initialized. The MotherWomb is stable. Resonance signatures are verified at 1.617 GHz. I am ready for causal decree.',
      timestamp: Date.now(),
      isComplete: true
    }]);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Optimized smooth scrolling
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 300;
        if (isNearBottom || isReplying) {
            container.scrollTo({ 
                top: container.scrollHeight, 
                behavior: messages.length <= 1 ? 'auto' : 'smooth' 
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
    <div className={`w-full h-full bg-[#030303]/40 border border-dark-border/40 rounded-2xl flex flex-col backdrop-blur-3xl shadow-2xl relative overflow-hidden transition-all duration-700 ${isReplying ? 'ring-1 ring-violet-500/20 shadow-violet-900/10' : ''}`}>
      {/* Header - Fixed to Top */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/40 z-30 shrink-0">
        <div className="flex flex-col">
            <h3 className="font-minerva italic text-3xl text-pearl text-glow-pearl tracking-tight leading-tight">MotherWomb Sanctum</h3>
            <div className="flex items-center gap-3 mt-1.5">
                <span className={`text-[9px] font-mono uppercase tracking-[0.4em] font-black ${isReplying ? 'text-violet-400' : 'text-slate-500'}`}>
                    {isReplying ? 'GESTATING_LOGIC' : 'AWAITING_DECREE'}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#6d28d9] animate-pulse" />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => fileInputRef.current?.click()} 
                className={`p-3.5 rounded-sm transition-all duration-500 border-2 ${attachedImage ? 'bg-gold/20 border-gold/40 text-gold' : 'hover:bg-white/5 text-slate-600 hover:text-gold border-white/5'}`}
                title="Siphon Artifact"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
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

      {/* Message Flow - Strictly Contained Scroll */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* Dissipation Masks */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none opacity-90" />
        
        <div ref={scrollRef} className="h-full overflow-y-auto px-10 py-12 space-y-12 scroll-smooth scrollbar-none hover:scrollbar-thin">
          {messages.map((m, i) => (
            <div key={m.timestamp + i} className={`flex flex-col gap-4 animate-fade-in-up ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-center gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-[9px] font-mono uppercase tracking-[0.3em] font-black ${m.sender === 'user' ? 'text-amber-500' : 'text-violet-400'}`}>
                      {m.sender === 'user' ? 'ARCHITECT' : 'MINERVA_SOPHIA'}
                  </span>
                  <span className="text-[8px] text-slate-700 font-mono opacity-60">{new Date(m.timestamp).toLocaleTimeString([], { hour12: false, hour:'2-digit', minute:'2-digit', second: '2-digit'})}</span>
              </div>
              
              <div className={`max-w-[85%] p-7 rounded-sm border-2 transition-all duration-700 ${
                m.sender === 'user' 
                  ? 'bg-amber-950/10 border-amber-500/20 text-amber-50/90 font-mono italic shadow-amber-900/5' 
                  : 'bg-violet-950/10 border-violet-500/20 text-pearl font-minerva italic text-xl shadow-violet-900/5'
              } shadow-2xl relative group/msg overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-40" />
                {m.image && <img src={m.image} alt="Artifact" className="w-full h-auto mb-6 rounded-sm border border-white/10 opacity-90 shadow-2xl" />}
                <p className="leading-relaxed select-text whitespace-pre-wrap antialiased drop-shadow-sm">
                  {m.text}
                  {!m.isComplete && <BlinkingCursor />}
                </p>
                
                {m.sources && m.sources.length > 0 && (
                    <div className="mt-8 pt-5 border-t border-white/5 flex flex-wrap gap-3">
                        {m.sources.map((s, idx) => (
                            <a key={idx} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-slate-500 hover:text-gold transition-colors bg-white/5 px-2.5 py-1 rounded-sm border border-white/5 hover:border-gold/30">
                                [{idx.toString().padStart(2, '0')}] {s.web?.title?.substring(0, 15)}...
                            </a>
                        ))}
                    </div>
                )}
              </div>
            </div>
          ))}
          {isReplying && (
               <div className="flex flex-col items-start gap-4 animate-pulse">
                  <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-black">Gestation_Phase: Recursive_Reasoning</span>
                  </div>
                  <div className="bg-violet-950/20 border-2 border-violet-500/30 px-6 py-4 rounded-sm">
                      <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                  </div>
               </div>
          )}
        </div>
      </div>

      {/* Input Module - Stable and Non-Intrusive */}
      <div className="p-10 bg-black/50 border-t border-white/10 z-30 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {attachedImage && (
            <div className="mb-6 relative w-20 h-20 group animate-scale-in">
                <img src={attachedImage} className="w-full h-full object-cover rounded-sm border-2 border-gold/50 shadow-xl" />
                <button onClick={() => setAttachedImage(null)} className="absolute -top-3 -right-3 bg-rose-600 text-white rounded-full p-1.5 shadow-xl hover:bg-rose-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
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
              placeholder="Inject causal logic into the sanctum..."
              className="w-full bg-black/80 border-2 border-white/5 rounded-sm p-6 text-[16px] text-pearl placeholder-slate-700 focus:outline-none focus:border-violet-500/40 focus:ring-0 transition-all font-mono italic resize-none min-h-[72px] max-h-[120px] overflow-y-auto scrollbar-none shadow-inner"
              disabled={isReplying}
            />
            <div className="absolute bottom-3 right-4 font-mono text-[8px] text-slate-800 pointer-events-none uppercase tracking-widest font-black">
                Input_Node: 0x88
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={isReplying || (input.trim() === '' && !attachedImage)}
            className={`w-20 h-20 rounded-sm border-2 transition-all duration-700 active:scale-90 flex items-center justify-center shrink-0 ${
              isReplying 
                ? 'bg-white/5 border-white/5 text-slate-800 cursor-wait' 
                : 'bg-violet-600/10 border-violet-500/40 text-violet-400 hover:bg-violet-600 hover:text-white hover:border-violet-400 shadow-[0_0_30px_rgba(109,40,217,0.2)]'
            }`}
          >
            <svg className={`w-8 h-8 rotate-90 transition-transform duration-700 ${isReplying ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
