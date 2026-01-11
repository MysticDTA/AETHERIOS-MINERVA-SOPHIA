
import React, { useState, useEffect } from 'react';
import { emitSophiaEvent } from '../services/sophiaEvents';

interface ApiKeyGuardProps {
  children: React.ReactNode;
  bypass?: boolean;
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children, bypass = false }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Immediate bypass if authorized (e.g., Architect Mode)
    if (bypass) {
        setHasKey(true);
        return;
    }

    const checkConfiguration = async () => {
      // 1. Primary Vector: check for build-time injected process.env.API_KEY
      const envKey = process.env.API_KEY;
      const isValidEnvKey = envKey && envKey !== 'undefined' && envKey !== 'null' && envKey.length > 0;

      if (isValidEnvKey) {
          setHasKey(true);
          return;
      }

      // 2. Secondary Vector: AI Studio Selected Key (Mandatory for Veo/G3P Handshake)
      if (typeof window !== 'undefined' && window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Lattice Handshake Error:", e);
          setHasKey(false);
        }
      } else {
        // Node is unconfigured and disconnected from institutional selector
        setHasKey(false);
      }
    };

    checkConfiguration();
  }, [bypass]);

  const handleSelectKey = async () => {
    if (typeof window === 'undefined' || !window.aistudio) return;
    setIsVerifying(true);
    try {
      await window.aistudio.openSelectKey();
      // Assume success to mitigate race conditions as per architectural guidelines
      setHasKey(true);
      emitSophiaEvent('HANDSHAKE_COMPLETE', { method: 'AI_STUDIO_HUB' });
    } catch (e) {
      console.error("Handshake Protocol Failed:", e);
    } finally {
      setIsVerifying(false);
    }
  };

  if (hasKey === null && !bypass) return (
      <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[3000]">
          <div className="w-12 h-12 border-2 border-gold/10 border-t-gold rounded-full animate-spin shadow-[0_0_20px_rgba(255,215,0,0.1)]" />
      </div>
  );

  if (!hasKey && !bypass) {
    return (
      <div id="api-key-guard-overlay" className="fixed inset-0 z-[3000] bg-dark-bg flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,199,127,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-xl space-y-12 animate-fade-in relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl bg-gold/5 border border-gold/30 flex items-center justify-center font-bold text-gold text-3xl mb-8 shadow-2xl animate-pulse">!</div>
            <h2 id="guard-title" className="font-orbitron text-4xl text-pearl font-extrabold tracking-tighter uppercase leading-tight">Handshake_Incomplete</h2>
            <p className="font-mono text-[10px] text-gold uppercase tracking-[0.5em] mt-4 font-black opacity-60">Architectural Key Provisioning Required</p>
          </div>

          <div className="bg-dark-surface/80 border border-white/5 p-10 rounded-sm shadow-2xl space-y-8 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="font-minerva italic text-xl text-warm-grey leading-relaxed relative z-10">
              "The Sovereign Matrix requires a valid API key to initialize the reasoning shards. Please ensure your environment is configured or execute the handshake protocol."
            </p>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4 text-left border-l-2 border-gold/30 pl-4 py-1">
                <div>
                  <span className="text-[10px] font-mono text-gold uppercase font-black block">Vector_Alpha</span>
                  <p className="text-[12px] text-slate-400 font-mono leading-relaxed mt-1">
                    Provision <code>API_KEY</code> via the host environment variables. Access is strictly server-side.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-left border-l-2 border-violet-500/30 pl-4 py-1">
                <div>
                  <span className="text-[10px] font-mono text-violet-400 uppercase font-black block">Vector_Beta</span>
                  <p className="text-[12px] text-slate-400 font-mono leading-relaxed mt-1">
                    Select a paid key via the AI Studio selector to unlock Gemini 3 Pro reasoning [32k].
                  </p>
                </div>
              </div>
            </div>
          </div>

          {typeof window !== 'undefined' && window.aistudio ? (
            <button 
              id="api-key-select-btn"
              onClick={handleSelectKey}
              disabled={isVerifying}
              className="group relative px-20 py-6 overflow-hidden border-2 border-gold/40 hover:border-gold transition-all rounded-sm bg-gold/5 active:scale-95 shadow-[0_0_50px_rgba(255,215,0,0.1)]"
            >
              <div className="absolute inset-0 bg-gold/10 group-hover:bg-gold/20 transition-all duration-1000" />
              <span className="relative z-10 font-orbitron text-[12px] tracking-[0.6em] text-gold uppercase font-black">
                {isVerifying ? 'CALIBRATING...' : 'Initialize Handshake'}
              </span>
            </button>
          ) : (
            <div className="p-6 bg-rose-950/20 border border-rose-500/30 rounded flex flex-col gap-3 items-center">
                <span className="text-rose-400 font-mono text-[10px] uppercase tracking-widest animate-pulse font-bold">
                    [CRITICAL_ERROR] External Selector Hub Offline
                </span>
                <p className="text-slate-500 text-[9px] font-mono leading-relaxed max-w-[300px]">
                    The local environment lacks an injected API_KEY and is disconnected from the AI Studio selector conduit.
                </p>
            </div>
          )}
        </div>

        <div className="absolute bottom-12 font-mono text-[9px] text-slate-700 uppercase tracking-[0.4em] opacity-40">
          Secure Enclave Protocol: ÆTHER_GUARD_v1.4.1
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
