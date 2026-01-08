
import React, { useEffect } from 'react';
import { UserTier } from '../types';
import { AudioEngine } from './audio/AudioEngine';

interface AccessDeniedScreenProps {
    requiredTier: UserTier;
    currentTier: UserTier;
    onNavigateToVault: () => void;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = React.memo(({ requiredTier, currentTier, onNavigateToVault }) => {
    
    useEffect(() => {
        // Simple fire-and-forget sound effect on mount
        const audio = new AudioEngine();
        audio.loadSounds().then(() => {
            audio.playAlarm(); // Play alert sound
        });
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#020202] relative overflow-hidden p-8 animate-fade-in">
            {/* Security Grid Background */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ 
                     backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                 }} 
            />
            
            <div className="relative z-10 max-w-lg w-full text-center space-y-8 bg-black/80 border border-red-900/50 p-12 rounded-sm shadow-[0_0_100px_rgba(220,38,38,0.1)] backdrop-blur-xl">
                <div className="w-24 h-24 border-4 border-red-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(220,38,38,0.4)] animate-pulse">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h1 className="font-orbitron text-3xl text-red-500 font-black uppercase tracking-tighter text-glow-red">Clearance Restricted</h1>
                    <p className="font-mono text-[10px] text-red-400/60 uppercase tracking-[0.4em]">Protocol: ACCESS_DENIED_0x403</p>
                </div>

                <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-sm text-left space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-red-900/30 pb-2">
                        <span className="text-slate-500 uppercase">Current_Rank</span>
                        <span className="text-slate-300 font-bold">{currentTier}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-red-900/30 pb-2">
                        <span className="text-slate-500 uppercase">Required_Rank</span>
                        <span className="text-gold font-bold animate-pulse">{requiredTier}</span>
                    </div>
                    <p className="text-[12px] font-minerva italic text-red-200/80 leading-relaxed pt-2">
                        "This logic shard operates at a causal frequency beyond your current license. Ascend to the Sovereign tier to materialize this interface."
                    </p>
                </div>

                <button 
                    onClick={onNavigateToVault}
                    className="w-full py-4 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-black transition-all shadow-[0_0_30px_rgba(255,215,0,0.15)] active:scale-95 group relative overflow-hidden"
                >
                    <span className="relative z-10">Acquire Clearance</span>
                    <div className="absolute inset-0 bg-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                </button>
            </div>
        </div>
    );
});
