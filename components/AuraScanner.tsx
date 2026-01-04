
import React, { useRef, useEffect, useState } from 'react';
import { BiometricSyncData } from '../types';

interface AuraScannerProps {
  biometricData: BiometricSyncData;
  resonance: number;
}

export const AuraScanner: React.FC<AuraScannerProps> = ({ biometricData, resonance }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { coherence } = biometricData;

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "user"
            } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
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
  const blurAmount = 12 + (1 - coherence) * 20; 
  const pulseSpeed = 3 + (1 - coherence) * 3;

  return (
    <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-rose backdrop-blur-sm flex flex-col relative overflow-hidden transition-all duration-1000 group hover:bg-dark-surface/70 gpu-accel">
      <div className="flex justify-between items-center mb-4 z-20 border-b border-white/5 pb-2">
        <h3 className="font-orbitron text-xs text-warm-grey uppercase tracking-[0.2em] font-bold">Biometric Aura Scanner V2</h3>
        <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${streamActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-mono text-[9px] text-pearl uppercase tracking-widest">{streamActive ? 'OPTICAL_LOCK' : 'NO_CARRIER'}</span>
        </div>
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-700/50 bg-black/50 flex items-center justify-center group/feed">
        {error ? (
            <div className="text-center p-6 z-30">
                <p className="text-rose-400 font-orbitron text-xs uppercase tracking-widest">{error}</p>
                <p className="text-[10px] text-slate-500 mt-2 font-mono">CAUSAL_ERROR: PERMISSION_DENIED</p>
            </div>
        ) : (
            <>
                {!streamActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 animate-pulse">
                        <div className="w-12 h-12 border-2 border-gold/30 rounded-full border-t-gold animate-spin mb-4" />
                        <span className="text-[10px] font-mono text-gold tracking-widest uppercase">Initializing Core Optics...</span>
                    </div>
                )}

                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-125 transition-opacity duration-1000 ${streamActive ? 'opacity-30' : 'opacity-0'}`}
                />
                
                {/* Optimized Aura Overlay: Using a single complex filter to simulate multiple layers */}
                <div 
                    className={`absolute inset-0 z-10 transition-all duration-1000 pointer-events-none ${streamActive ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                        background: `radial-gradient(circle at 50% 40%, ${auraColor}, transparent 80%)`,
                        backdropFilter: `blur(${blurAmount}px) brightness(1.2)`,
                        animation: `aura-breathe ${pulseSpeed}s infinite alternate ease-in-out`
                    }}
                />

                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
                    <div className="flex justify-between">
                        <div className="w-12 h-12 border-t border-l border-pearl/40 rounded-tl flex items-start p-1">
                             <span className="text-[7px] font-mono text-pearl/50">FRM_INT_99</span>
                        </div>
                        <div className="w-12 h-12 border-t border-r border-pearl/40 rounded-tr flex items-start justify-end p-1">
                             <span className="text-[7px] font-mono text-pearl/50">OPT_RES_4</span>
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover/feed:opacity-40 transition-opacity">
                        <svg viewBox="0 0 100 100" className="w-48 h-48 animate-[spin_40s_linear_infinite]">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--pearl)" strokeDasharray="1 8" strokeWidth="0.2" />
                            <circle cx="50" cy="50" r="25" fill="none" stroke="var(--gold)" strokeDasharray="2 2" strokeWidth="0.1" />
                            {[0, 90, 180, 270].map(deg => (
                                <line key={deg} x1="50" y1="2" x2="50" y2="8" stroke="var(--pearl)" strokeWidth="0.3" transform={`rotate(${deg} 50 50)`} />
                            ))}
                        </svg>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="w-12 h-12 border-b border-l border-pearl/40 rounded-bl flex items-end p-1">
                             <span className="text-[7px] font-mono text-pearl/50">SIG_LOCK: {streamActive ? 'TRUE' : 'FALSE'}</span>
                        </div>
                        <div className="text-center mb-2">
                            <p className="text-[8px] uppercase tracking-[0.3em] text-pearl/60 font-bold mb-1">Coherence Phase</p>
                            <div className="font-orbitron text-xl text-white text-glow-pearl">
                                {(resonance * 100).toFixed(1)}<span className="text-[10px] ml-1">Ψ</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 border-b border-r border-pearl/40 rounded-br flex items-end justify-end p-1">
                             <span className="text-[7px] font-mono text-pearl/50">ΔT: {Math.floor(Date.now()/1000) % 1000}</span>
                        </div>
                    </div>
                </div>
            </>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest z-30">
          <div className="flex gap-3">
              <span>SCAN_BITRATE: 4.2Gbps</span>
              <span className={coherence > 0.8 ? 'text-green-500' : 'text-gold'}>PARITY: {(coherence * 100).toFixed(2)}%</span>
          </div>
          <span>PROTO: AETHER_OS_14</span>
      </div>
      
      <style>{`
        @keyframes aura-breathe {
            0% { transform: scale(1); filter: contrast(1.1); }
            100% { transform: scale(1.05); filter: contrast(1.3); }
        }
      `}</style>
    </div>
  );
};
