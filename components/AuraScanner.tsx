
import React, { useRef, useEffect, useState } from 'react';
import { BiometricSyncData } from '../types';

interface AuraScannerProps {
  biometricData: BiometricSyncData;
  resonance: number;
}

export const AuraScanner: React.FC<AuraScannerProps> = React.memo(({ biometricData, resonance }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);

  const { coherence } = biometricData;

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let intervalId: number;

    const calculateFps = () => {
        const now = performance.now();
        frames++;
        if (now > lastTime + 1000) {
            setFps(Math.round((frames * 1000) / (now - lastTime)));
            lastTime = now;
            frames = 0;
        }
        intervalId = requestAnimationFrame(calculateFps);
    };
    intervalId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(intervalId);
  }, []);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
          videoRef.current.onloadedmetadata = () => {
            setStreamActive(true);
          };
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Optical sensor access denied. Aura estimation unavailable.");
      }
    };

    if (!streamActive && !error) {
        startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamActive, error]);

  const getAuraColor = () => {
      if (coherence > 0.9) return 'rgba(248, 245, 236, 0.4)'; 
      if (coherence > 0.7) return 'rgba(230, 199, 127, 0.3)'; 
      if (coherence > 0.4) return 'rgba(45, 212, 191, 0.2)'; 
      return 'rgba(244, 63, 94, 0.2)'; 
  };

  const auraColor = getAuraColor();
  const blurAmount = 10 + (1 - coherence) * 15; 
  const pulseSpeed = 4 + (1 - coherence) * 2;

  return (
    <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-6 rounded-2xl border-glow-rose backdrop-blur-3xl flex flex-col relative overflow-hidden transition-all duration-1000 group hover:bg-dark-surface/70 gpu-accel shadow-2xl">
      <div className="flex justify-between items-center mb-6 z-20 border-b border-white/10 pb-4">
        <div className="flex flex-col">
            <h3 className="font-orbitron text-xs text-warm-grey uppercase tracking-[0.4em] font-black">Biometric Aura Array</h3>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">Institutional Node: 0x88_OPTICAL</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-gold uppercase tracking-tighter">Frame_Interval</span>
                <span className="font-orbitron text-xs text-pearl">{fps} FPS</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${streamActive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
        </div>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5 bg-black flex items-center justify-center group/feed shadow-inner">
        {error ? (
            <div className="text-center p-8 z-30">
                <div className="w-16 h-16 border-2 border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <p className="text-rose-400 font-orbitron text-[10px] uppercase tracking-[0.4em] mb-2">{error}</p>
                <p className="text-[8px] text-slate-700 font-mono uppercase tracking-widest">Protocol: AETHER_OS_ERROR_0xDEAD</p>
            </div>
        ) : (
            <>
                {!streamActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 animate-pulse bg-black/60 backdrop-blur-sm">
                        <div className="w-12 h-12 border-2 border-gold/20 rounded-full border-t-gold animate-spin mb-6" />
                        <span className="text-[9px] font-mono text-gold tracking-[0.6em] uppercase font-bold">Synchronizing Optical Mesh...</span>
                    </div>
                )}

                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`absolute inset-0 w-full h-full object-cover opacity-20 grayscale contrast-150 transition-opacity duration-[2000ms] ${streamActive ? 'opacity-20' : 'opacity-0'}`}
                />
                
                {/* AURA REFINEMENT LAYER */}
                <div 
                    className={`absolute inset-0 z-10 transition-all duration-[3000ms] pointer-events-none ${streamActive ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                        background: `radial-gradient(circle at 50% 45%, ${auraColor}, transparent 75%)`,
                        backdropFilter: `blur(${blurAmount}px) saturate(1.5)`,
                        animation: `aura-breathe ${pulseSpeed}s infinite alternate ease-in-out`
                    }}
                />

                {/* THE INSTITUTIONAL HUD */}
                <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between z-20 overflow-hidden">
                    {/* Top Markers */}
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1">
                             <div className="w-16 h-px bg-pearl/20" />
                             <div className="w-px h-16 bg-pearl/20" />
                             <span className="text-[7px] font-mono text-pearl/40 uppercase mt-2">REC_ALPHA_7</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                             <div className="w-16 h-px bg-pearl/20" />
                             <div className="w-px h-16 bg-pearl/20" />
                             <div className="mt-2 flex gap-1.5 items-center">
                                 <span className="text-[7px] font-mono text-pearl/40 uppercase">BANDWIDTH_OK</span>
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                             </div>
                        </div>
                    </div>
                    
                    {/* Center Reticle */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover/feed:opacity-60 transition-all duration-1000">
                        <svg viewBox="0 0 100 100" className="w-64 h-64 animate-[spin_60s_linear_infinite]">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--pearl)" strokeDasharray="0.5 4" strokeWidth="0.1" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--gold)" strokeDasharray="10 20" strokeWidth="0.05" />
                            <path d="M 50 10 V 20 M 50 80 V 90 M 10 50 H 20 M 80 50 H 90" stroke="var(--pearl)" strokeWidth="0.1" />
                        </svg>
                        <div className="absolute w-2 h-2 border border-pearl/40 rotate-45 animate-pulse" />
                    </div>

                    {/* Bottom Status */}
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                             <span className="text-[7px] font-mono text-pearl/40 uppercase mb-2">COORD: {resonance.toFixed(6)}</span>
                             <div className="w-px h-16 bg-pearl/20" />
                             <div className="w-16 h-px bg-pearl/20" />
                        </div>
                        
                        <div className="text-center mb-4">
                            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-sm border border-white/10 shadow-2xl">
                                <p className="text-[8px] uppercase tracking-[0.5em] text-gold font-black mb-1.5">Resonance Purity</p>
                                <div className="font-orbitron text-2xl text-white text-glow-pearl font-extrabold leading-none">
                                    {(coherence * 100).toFixed(2)}<span className="text-[12px] ml-1 opacity-40">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                             <span className="text-[7px] font-mono text-pearl/40 uppercase mb-2">EPOCH: {Math.floor(Date.now()/1000)}</span>
                             <div className="w-px h-16 bg-pearl/20" />
                             <div className="w-16 h-px bg-pearl/20" />
                        </div>
                    </div>
                </div>
            </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest z-30">
          <div className="flex gap-10">
              <div className="flex items-center gap-3">
                  <span className="text-slate-600">Scan_Parity:</span>
                  <span className={coherence > 0.8 ? 'text-green-500 font-bold' : 'text-gold'}>{(coherence * 100).toFixed(4)}%</span>
              </div>
              <div className="flex items-center gap-3 hidden md:flex">
                  <span className="text-slate-600">Dynamic_ISO:</span>
                  <span className="text-pearl">400_S7</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
               <span className="text-slate-600">Logic_Filter:</span>
               <span className="text-violet-400 font-bold">MINERVA_SOPHIA_v1.3</span>
          </div>
      </div>
      
      <style>{`
        @keyframes aura-breathe {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
});
