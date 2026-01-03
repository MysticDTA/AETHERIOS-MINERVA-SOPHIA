import React, { useState, useEffect, useRef, useMemo } from 'react';
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
}

const BlinkingCursor: React.FC = () => (
    <span className="inline-block w-2 h-4 bg-violet-500 ml-1 animate-blink align-middle shadow-[0_0_12px_#6d28d9]" />
);

export const SophiaConsole: React.FC<SophiaConsoleProps> = ({ systemState, sophiaEngine, onSaveInsight, setOrbMode }) => {
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
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isReplying]);

  // Handle textarea auto-grow
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
    
    // Reset textarea height manually after clear
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }

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
      }
    );

    setMessages(prev => prev.map(m => m.timestamp === currentSophiaMessageId.current ? { ...m, isComplete: true } : m));
    setIsReplying(false);
    setOrbMode('STANDBY');
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
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={(e) => {
            const f = e.target.files?.[0];
            if(f) { const r = new FileReader(); r.onloadend = () => setAttachedImage(r.result as string); r.readAsDataURL(f); }
        }} accept="image/*" className="hidden" />
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-12 space-y-12 clear-scrolling-window select-text">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in group/msg`}>
            <div className={`max-w-[92%] p-6 rounded-sm border ${msg.sender === 'user' ? 'bg-slate-900/50 border-slate-700/60 text-slate-200' : 'bg-violet-950/10 border-violet-500/40 text-pearl font-minerva italic text-lg'} transition-all hover:border-white/20 shadow-xl`}>
              {msg.image && (
                  <div className="relative mb-6 group/img">
                      <img src={msg.image} className="rounded-sm max-w-full h-auto border border-white/10 shadow-2xl" alt="Artifact" />
                      <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/90 rounded-sm text-[8px] font-mono text-gold border border-gold/40 uppercase tracking-widest">Artifact_Verified</div>
                  </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed antialiased">{msg.text}{!msg.isComplete && msg.sender === 'sophia' && <BlinkingCursor />}</p>
              <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center opacity-0 group-hover/msg:opacity-100 transition-opacity">
                  <span className="text-[8px] font-mono text-slate-600 tracking-tighter">{new Date(msg.timestamp).toLocaleTimeString()} // ID: {msg.timestamp.toString().slice(-6)}</span>
                  {msg.sender === 'sophia' && msg.isComplete && (
                      <button onClick={() => onSaveInsight(msg.text)} className="text-[9px] font-mono text-gold hover:text-pearl uppercase tracking-[0.2em] font-bold transition-colors">Commit_to_Memory</button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 py-8 border-t border-white/5 bg-black/40">
        {attachedImage && (
            <div className="mb-6 flex items-center gap-5 animate-fade-in bg-gold/5 border border-gold/30 p-3 rounded-sm">
                <div className="w-12 h-12 rounded-sm overflow-hidden border border-gold/40 shadow-inner"><img src={attachedImage} className="w-full h-full object-cover" /></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gold uppercase font-bold tracking-[0.2em]">Multi-modal Artifact Staged</span>
                    <span className="text-[8px] font-mono text-gold/60 uppercase">Encoding for causal synthesis...</span>
                </div>
                <button onClick={() => setAttachedImage(null)} className="ml-auto p-2 text-slate-500 hover:text-rose-500 transition-colors">✕</button>
            </div>
        )}
        <div className="relative flex bg-black/60 border border-white/10 rounded px-6 py-5 gap-6 ring-1 ring-white/5 focus-within:border-violet-500/60 focus-within:ring-violet-500/20 transition-all shadow-inner items-end">
            <textarea 
                ref={textareaRef}
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder="Communicate decree to the matrix..." 
                className="flex-1 bg-transparent border-none p-0 text-pearl placeholder-slate-700 focus:ring-0 font-minerva italic text-xl resize-none min-h-[1.5rem] max-h-[180px] overflow-y-auto scrollbar-thin" 
                rows={1} 
            />
            <button 
                onClick={handleSend} 
                disabled={isReplying || (!input.trim() && !attachedImage)} 
                className={`p-2 transition-all duration-700 active:scale-90 flex-shrink-0 ${input.trim() || attachedImage ? 'text-pearl scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'text-slate-800 opacity-20'}`}
            >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
        </div>
        <div className="mt-2 px-2 flex justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest">
            <span>Shift + Enter for new line</span>
            <span>Enter to transmit</span>
        </div>
      </div>
    </div>
  );
};