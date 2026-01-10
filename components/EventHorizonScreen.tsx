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
      id="event-horizon-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center text-center p-4 bg-dark-bg overflow-hidden relative z-[9999]"
      style={{ animation: 'blackhole-pulse 8s infinite ease-in-out' }}
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_80%)] pointer-events-none" />
      <div className="scanline-overlay" style={{ opacity: 0.8, zIndex: 0 }}></div>
      
      {/* Precision Damped Shake applied here */}
      <div className="relative z-10 border-4 border-red-700/50 p-12 max-w-4xl w-full bg-black/80 backdrop-blur-md shake-effect-damped flex flex-col items-center" style={{ borderColor: 'hsl(0, 70%, 35%)', boxShadow: '0 0 100px rgba(220,38,38,0.2)' }}>
        <h1 className="font-orbitron text-5xl md:text-7xl text-red-500 font-black text-glow-red animate-pulse relative tracking-tighter" data-text="SYSTEM COMPOSURE FAILURE">
           <span className="absolute left-0 top-0 w-full h-full text-red-300 opacity-80 mix-blend-screen" style={{ clipPath: 'inset(50% 0 0 0)', animation: 'glitch-anim-2 2s infinite linear alternate-reverse' }}>SYSTEM COMPOSURE FAILURE</span>
           SYSTEM COMPOSURE FAILURE
        </h1>
        <p className="mt-6 text-red-300/80 md:text-lg uppercase tracking-[0.5em] font-bold">
          System Integrity Critical // Event Horizon Reached
        </p>

        <div id="critical-error-display" className="mt-12 p-6 bg-black/50 border border-red-500/30 font-mono text-left w-full max-w-2xl">
            <p className="text-yellow-300 text-glow-gold text-lg"><span className="text-red-500 mr-4">&gt;&gt;</span>{currentError}<span className="inline-block w-3 h-5 bg-yellow-300 ml-1 animate-blink align-middle" /></p>
        </div>

        <div className="mt-10 font-orbitron text-2xl text-yellow-300 relative uppercase font-bold tracking-widest">
            <p style={{ animation: 'glitch-anim 1.5s infinite linear alternate-reverse' }}>MANUAL INTERVENTION REQUIRED</p>
        </div>

        {onManualReset && (
            <div className="mt-16">
                <button 
                    id="manual-reset-button"
                    onClick={onManualReset}
                    className="px-12 py-6 bg-red-600 hover:bg-red-500 text-white font-bold font-orbitron text-lg uppercase tracking-[0.2em] border-2 border-red-400 shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all hover:scale-105 active:scale-95 animate-pulse"
                >
                    INITIALIZE NEW SYSTEM CORE
                </button>
            </div>
        )}

        <div className="absolute bottom-4 font-mono text-[10px] text-red-900/50 uppercase tracking-widest">
            Error_Code: 0xDEAD_LATTICE // Ref: Minerva_Fatal_Exception
        </div>
      </div>
    </div>
  );
};
