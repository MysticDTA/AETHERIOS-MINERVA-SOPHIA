
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BiometricHandshakeProps {
    onVerified: () => void;
    onFail: () => void;
}

export const BiometricHandshake: React.FC<BiometricHandshakeProps> = ({ onVerified, onFail }) => {
    const [scanStage, setScanStage] = useState<'IDLE' | 'IRIS' | 'HRV' | 'PARITY'>('IDLE');
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (scanStage === 'IDLE') return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (scanStage === 'IRIS') setScanStage('HRV');
                    else if (scanStage === 'HRV') setScanStage('PARITY');
                    else if (scanStage === 'PARITY') {
                        clearInterval(interval);
                        onVerified();
                    }
                    return 0;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [scanStage]);

    return (
        <div className="fixed inset-0 bg-void z-[6000] flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1)_0%,transparent_80%)]" />
            
            <div className="relative max-w-lg w-full bg-black/80 border border-gold/30 p-12 rounded-sm shadow-[0_0_100px_rgba(255,215,0,0.1)] flex flex-col items-center">
                <div className="mb-10 text-center">
                    <h2 className="font-orbitron text-2xl text-gold font-black uppercase tracking-[0.4em] mb-2">Biometric_Handshake</h2>
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Protocol: AETHER_ABC_v1.0</p>
                </div>

                <div className="relative w-64 h-64 border border-white/10 rounded-full flex items-center justify-center mb-12">
                    {/* Scanner Visuals */}
                    <div className="absolute inset-0 border-2 border-gold/10 rounded-full animate-ping" />
                    
                    {scanStage === 'IDLE' ? (
                        <button 
                            onClick={() => setScanStage('IRIS')}
                            className="group relative px-10 py-5 bg-gold/5 border border-gold/40 text-gold font-orbitron text-[10px] uppercase tracking-widest font-black hover:bg-gold hover:text-black transition-all"
                        >
                            Initialize_Scan
                        </button>
                    ) : (
                        <div className="relative flex flex-col items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-48 h-48">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,215,0,0.1)" strokeWidth="1" />
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke="var(--gold)" 
                                    strokeWidth="2" 
                                    strokeDasharray="301.44"
                                    strokeDashoffset={301.44 - (progress / 100) * 301.44}
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                />
                                {scanStage === 'IRIS' && (
                                    <path d="M 30 50 Q 50 20 70 50 Q 50 80 30 50" fill="none" stroke="var(--gold)" strokeWidth="0.5" className="animate-pulse" />
                                )}
                                {scanStage === 'HRV' && (
                                    <path d="M 20 50 L 35 50 L 40 30 L 50 70 L 55 50 L 80 50" fill="none" stroke="#67e8f9" strokeWidth="1" className="animate-[pulse_1s_infinite]" />
                                )}
                            </svg>
                            <span className="absolute font-orbitron text-xs text-pearl tracking-widest uppercase font-black">{scanStage}</span>
                        </div>
                    )}
                </div>

                <div className="w-full space-y-4">
                    <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                        <span>Resonance_Acquisition</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold transition-all duration-300 shadow-[0_0_10px_gold]" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[10px] font-minerva italic text-center text-pearl/60">
                        {scanStage === 'IDLE' && "Awaiting physical presence verification."}
                        {scanStage === 'IRIS' && "Mapping corneal resonance patterns..."}
                        {scanStage === 'HRV' && "Syncing cardiac variability with Tesseract baseline..."}
                        {scanStage === 'PARITY' && "Authenticating Sovereign identity shards..."}
                    </p>
                </div>
            </div>

            <div className="mt-12 font-mono text-[9px] text-slate-800 uppercase tracking-[1em]">
                ABC CORE LOCKED // McBRIDE KINGDOM
            </div>
        </div>
    );
};
