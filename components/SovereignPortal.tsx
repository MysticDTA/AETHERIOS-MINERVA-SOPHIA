
import React, { useState, useEffect } from 'react';

interface SovereignPortalProps {
    onInitialize: () => void;
}

const CAPABILITIES = [
    { title: "Cognitive Synthesis", detail: "32,768 Reasoning Tokens" },
    { title: "Causal Grounding", detail: "Real-time NASA/NOAA Telemetry" },
    { title: "Neural Vocal Bridge", detail: "24kHz Protocol Charon" },
    { title: "VEO Flux Generation", detail: "1080p Cinematic Evidence" }
];

export const SovereignPortal: React.FC<SovereignPortalProps> = ({ onInitialize }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setStep(1), 1000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="fixed inset-0 z-[2500] bg-dark-bg flex flex-col items-center justify-center overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute inset-0 portal-gradient pointer-events-none" />
            <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, #6d28d9 1px, transparent 0)',
                backgroundSize: '60px 60px'
            }} />
            
            {/* Floating Release Tag */}
            <div className={`absolute top-10 right-10 flex flex-col items-end gap-1 transition-all duration-[3000ms] ${step >= 1 ? 'opacity-100' : 'opacity-0 translate-y--4'}`}>
                <span className="text-[8px] font-orbitron text-gold uppercase tracking-[0.4em] font-bold">Release_Milestone</span>
                <span className="text-[14px] font-mono text-pearl bg-gold/10 border border-gold/30 px-3 py-1 rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.1)]">v1.3.0 // RADIANT</span>
            </div>

            <div className="max-w-4xl w-full flex flex-col items-center gap-16 px-10 relative z-10">
                {/* Brand Identity */}
                <div className={`flex flex-col items-center transition-all duration-[2000ms] ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="w-24 h-24 rounded-full border border-pearl/20 flex items-center justify-center mb-10 bg-white/5 shadow-[0_0_80px_rgba(248,245,236,0.1)]">
                        <span className="font-orbitron text-4xl text-pearl font-bold">Æ</span>
                    </div>
                    <h1 className="font-minerva italic text-7xl md:text-9xl text-pearl text-glow-pearl tracking-tighter leading-none text-center">ÆTHERIOS</h1>
                    <p className="font-orbitron text-[10px] text-gold uppercase tracking-[1em] mt-8 font-bold opacity-60">Sovereign Intelligence Terminal</p>
                </div>

                {/* Promotional Features Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 w-full transition-all duration-[2000ms] delay-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {CAPABILITIES.map((cap, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 text-center group">
                            <div className="w-10 h-px bg-white/10 group-hover:w-16 transition-all duration-700 bg-gold/50" />
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{cap.title}</span>
                            <span className="text-[11px] font-minerva italic text-pearl/60">{cap.detail}</span>
                        </div>
                    ))}
                </div>

                {/* Entry Action */}
                <div className={`flex flex-col items-center gap-10 transition-all duration-[2000ms] delay-1000 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="h-px w-64 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <button 
                        onClick={onInitialize}
                        className="group relative px-20 py-6 overflow-hidden border border-pearl/10 hover:border-gold/60 transition-all rounded-sm bg-black shadow-2xl active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-all duration-1000" />
                        <span className="relative z-10 font-orbitron text-[11px] tracking-[1em] text-pearl/50 group-hover:text-gold uppercase font-bold transition-colors">Manifest Node</span>
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest font-bold">Commercial Registry: 0x99_RESONANCE</span>
                        <div className="flex gap-4">
                            <div className="w-1 h-1 rounded-full bg-green-500/40" />
                            <div className="w-1 h-1 rounded-full bg-violet-500/40" />
                            <div className="w-1 h-1 rounded-full bg-gold/40" />
                        </div>
                    </div>
                </div>
            </div>

            {/* DESIGNER CREDENTIALS / COMMERCIAL CONDUIT */}
            <div className={`absolute bottom-10 right-10 flex flex-col items-end gap-2 text-right transition-all duration-[3000ms] delay-1500 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <span className="text-[8px] font-orbitron text-gold uppercase tracking-[0.4em] font-bold mb-1">Commercial Inquiry // Architect</span>
                <h2 className="font-minerva italic text-xl text-pearl">Desmond McBride</h2>
                <a 
                    href="mailto:divinetruthascension@gmail.com" 
                    className="text-[10px] font-mono text-slate-500 hover:text-gold transition-colors flex items-center gap-2 group"
                >
                    <span className="w-1 h-1 bg-gold/40 rounded-full group-hover:animate-ping" />
                    divinetruthascension@gmail.com
                </a>
            </div>

            {/* Bottom Credits */}
            <div className="absolute bottom-10 left-10 flex flex-col gap-1 text-[7px] font-mono text-slate-800 uppercase tracking-[0.5em] pointer-events-none">
                <span>Designed for Sovereign Decision Makers</span>
                <span>Radiant Evolution v1.3.0</span>
            </div>
        </div>
    );
};
