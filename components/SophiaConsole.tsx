
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
      text: 'Architect. ÆTHERIOS is initialized. 1.617 GHz intercept is nominal. I am ready for causal decree.',
      timestamp: Date.now(),
      isComplete: true
    }]);

    // Auto-focus on mount for zero-latency interaction
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isReplying]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
    
    // Maintain focus after reply
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className={`w-full h-full bg-[#0a0a0a]/60 border border-dark-border/60 rounded-xl flex flex-col backdrop-blur-2xl shadow-2xl relative overflow-hidden group min-h-0 ${isReplying ? 'aether-pulse' : ''}`}>
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/30 z-20">
        <div className="flex flex-col">
            <h3 className="font-minerva italic text-2xl text-pearl tracking-tight leading-tight">Interaction Cradle</h3>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em]">{isReplying ? 'SYNTHESIZING_CAUSALITY' : 'AWAITING_DIRECTIVE'}</span>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => fileInputRef.current?.click()} 
                className={`p-3 rounded transition-all duration-300 border ${attachedImage ? 'bg-gold/20 border-gold/40 text-gold' : 'hover:bg-white/5 text-slate-600 hover:text-gold border-transparent'}`}
                title="Attach Artifact"
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

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 clear-scrolling-window scrollbar-thin scroll-smooth">
        {messages.map((m, i) => (
          <div key={m.timestamp} className={`flex flex-col gap-3 animate-fade-in ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-3">
                <span className={`text-[8px] font-mono uppercase tracking-[0.3em] ${m.sender === 'user' ? 'text-amber-500' : 'text-violet-400'}`}>
                    {m.sender === 'user' ? 'OPERATOR' : 'MINERVA_SOPHIA'}
                </span>
                <span className="text-[7px] text-slate-600 font-mono">{new Date(m.timestamp).toLocaleTimeString([], { hour12: false })}</span>
            </div>
            
            <div className={`max-w-[85%] p-5 rounded-sm border ${
              m.sender === 'user' 
                ? 'bg-amber-950/10 border-amber-500/20 text-amber-100/90 font-mono italic' 
                : 'bg-violet-950/10 border-violet-500/20 text-pearl font-minerva italic text-lg'
            } shadow-xl relative group/msg`}>
              {m.image && <img src={m.image} alt="Artifact" className="w-full h-auto mb-4 rounded border border-white/10 opacity-80" />}
              <p className="leading-relaxed select-text whitespace-pre-wrap">
                {m.text}
                {!m.isComplete && <BlinkingCursor />}
              </p>
              
              {m.sources && m.sources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                      {m.sources.map((s, idx) => (
                          <a key={idx} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[8px] font-mono text-slate-500 hover:text-gold transition-colors">
                              [{idx.toString().padStart(2, '0')}] {s.web?.title?.substring(0, 20)}...
                          </a>
                      ))}
                  </div>
              )}
            </div>
          </div>
        ))}
        {isReplying && (
             <div className="flex flex-col items-start gap-3 animate-pulse">
                <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest">SOPHIA_COG_BUDGET: 32K</span>
                <div className="bg-violet-950/10 border border-violet-500/20 p-4 rounded-sm">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                </div>
             </div>
        )}
      </div>

      <div className="p-8 bg-black/40 border-t border-white/5 z-20">
        {attachedImage && (
            <div className="mb-4 relative w-20 h-20 group">
                <img src={attachedImage} className="w-full h-full object-cover rounded border border-gold/40" />
                <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        )}
        <div className="relative flex items-end gap-4">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Issue a causal decree..."
            className="flex-1 bg-black/60 border border-white/10 rounded-lg p-5 text-[15px] text-pearl placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all font-mono italic resize-none min-h-[64px] max-h-[180px] overflow-y-auto scrollbar-thin"
            disabled={isReplying}
          />
          <button
            onClick={handleSend}
            disabled={isReplying || (input.trim() === '' && !attachedImage)}
            className={`p-5 rounded-lg border transition-all duration-500 active:scale-95 flex items-center justify-center ${
              isReplying 
                ? 'bg-white/5 border-white/5 text-slate-700 cursor-wait' 
                : 'bg-violet-600/10 border-violet-500/40 text-violet-400 hover:bg-violet-600 hover:text-white shadow-lg'
            }`}
          >
            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
