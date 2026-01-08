
import React, { useState, useEffect } from 'react';
import '../types'; // Ensure global window types are loaded

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window !== 'undefined' && window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for environments where aistudio object isn't present
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (typeof window === 'undefined' || !window.aistudio) return;
    setIsVerifying(true);
    try {
      await window.aistudio.openSelectKey();
      // Assume success as per guidelines to mitigate race conditions
      setHasKey(true);
    } catch (e) {
      console.error("Key selection failed", e);
    } finally {
      setIsVerifying(false);
    }
  };

  if (hasKey === null) return null; // Initial check loading

  if (!hasKey) {
    return (
      <div id="api-key-guard-overlay" className="fixed inset-0 z-[3000] bg-dark-bg flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,199,127,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-xl space-y-12 animate-fade-in relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center font-bold text-[#635bff] text-2xl mb-8 shadow-2xl animate-pulse">S</div>
            <h2 id="guard-title" className="font-orbitron text-3xl text-pearl font-bold tracking-tighter uppercase">AI Studio Handshake</h2>
            <p className="font-mono text-[10px] text-gold uppercase tracking-[0.4em] mt-4 font-bold opacity-60">Authentication Required for Pro-Tier Intelligence</p>
          </div>

          <div className="bg-dark-surface border border-white/10 p-8 rounded-sm shadow-2xl space-y-6">
            <p className="font-minerva italic text-lg text-warm-grey leading-relaxed">
              "To access the Sovereign Matrix and high-reasoning modules, you must select an API key from your AI Studio account."
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-left">
                <span className="text-gold mt-1 text-[10px]">▶</span>
                <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                  Requires a key from a paid GCP project. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-gold underline hover:text-white transition-colors">Review billing documentation</a>.
                </p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="text-gold mt-1 text-[10px]">▶</span>
                <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                  Unlocks Gemini 3 Pro (32k tokens) & Pro Image synthesis.
                </p>
              </div>
            </div>
          </div>

          <button 
            id="api-key-select-btn"
            onClick={handleSelectKey}
            disabled={isVerifying}
            className="group relative px-16 py-5 overflow-hidden border border-gold/40 hover:border-gold transition-all rounded-sm bg-gold/5 active:scale-95"
          >
            <div className="absolute inset-0 bg-gold/10 group-hover:bg-gold/20 transition-all duration-1000" />
            <span className="relative z-10 font-orbitron text-[11px] tracking-[0.5em] text-gold uppercase font-bold">
              {isVerifying ? 'Establishing Link...' : 'Select AI Studio Key'}
            </span>
          </button>
        </div>

        <div className="absolute bottom-12 font-mono text-[8px] text-slate-700 uppercase tracking-widest opacity-40">
          Secure Gateway Protocol: GRS-V2
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
