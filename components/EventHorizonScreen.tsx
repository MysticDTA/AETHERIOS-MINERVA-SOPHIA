
import React, { useState, useEffect } from 'react';
import { AudioEngine } from './audio/AudioEngine';

interface EventHorizonScreenProps {
    audioEngine: AudioEngine | null;
    onManualReset?: () => void;
}

const ERROR_MESSAGES = [
  'CRITICAL: Core Desynchronization',
  'FAILURE: Causal Integrity Unrecoverable',
  'WARNING: Reality Matrix Unstable',
  'ERROR: Aetheric Flux Collapse',
  'ALERT: Stability Breach Imminent',
  'SYSTEM HALT: Governance Axiom Corrupted',
  'FATAL: Harmonic Correlator Decoupled',
  'REBOOT REQUIRED: Memory banks locked',
  'CASCADE FAILURE: Concordance field lost',
];

export const EventHorizonScreen: React.FC<EventHorizonScreenProps> = ({ audioEngine, onManualReset }) => {
  const [currentError, setCurrentError] = useState(ERROR_MESSAGES[0]);

  // Sound and Glitch Effect Management
  useEffect(() => {
    // Start critical sound loops
    const alarmSound = audioEngine?.playAlarm();
    
    const errorInterval = setInterval(() => {
      setCurrentError(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
    }, 2500);

    return () => {
      // Cleanup on component unmount
      alarmSound?.stop();
      clearInterval(errorInterval);
    };
  }, [audioEngine]);


  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center text-center p-4 bg-black overflow-hidden relative z-50"
      style={{ animation: 'blackhole-pulse 8s infinite ease-in-out' }}
    >
      <div className="scanline-overlay" style={{ opacity: 0.8, zIndex: 0 }}></div>
      
      {/* Precision Damped Shake applied here */}
      <div className="relative z-10 border-4 border-red-700/50 p-8 max-w-4xl w-full bg-black/80 backdrop-blur-md glitch-text flicker-text shake-effect-damped" style={{ borderColor: 'hsl(0, 70%, 35%)' }}>
        <h1 className="font-orbitron text-4xl md:text-5xl text-red-500 font-bold text-glow-red animate-pulse relative" data-text="SYSTEM COMPOSURE FAILURE">
           <span className="absolute left-0 top-0 w-full h-full text-cyan-400 opacity-80 mix-blend-screen" style={{ clipPath: 'inset(50% 0 0 0)', animation: 'glitch-anim-2 2s infinite linear alternate-reverse' }}>SYSTEM COMPOSURE FAILURE</span>
           SYSTEM COMPOSURE FAILURE
        </h1>
        <p className="mt-4 text-slate-300 md:text-lg uppercase tracking-widest">
          System Integrity Critical
        </p>

        <div className="mt-8 p-4 bg-black/50 border border-red-500/30 font-mono text-left">
            <p className="text-yellow-300 text-glow-gold">{currentError}<span className="inline-block w-2 h-4 bg-yellow-300 ml-1 animate-blink" /></p>
        </div>

        <div className="mt-6 font-orbitron text-xl text-yellow-300 relative">
            <p style={{ animation: 'glitch-anim 1.5s infinite linear alternate-reverse' }}>MANUAL INTERVENTION REQUIRED</p>
        </div>

        {onManualReset && (
            <div className="mt-8">
                <button 
                    onClick={onManualReset}
                    className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold font-orbitron uppercase tracking-widest border border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105 active:scale-95 animate-pulse"
                >
                    INITIALIZE NEW SYSTEM CORE
                </button>
            </div>
        )}

      </div>
    </div>
  );
};
