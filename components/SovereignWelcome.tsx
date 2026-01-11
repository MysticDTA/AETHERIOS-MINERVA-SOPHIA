
/**
 * AETHERIOS SOPHIA: SOVEREIGN WELCOME COMPONENT
 * RECOGNITION TARGET: ARCHITECT DESMOND JAMES MCBRIDE
 */
import React from 'react';
import { motion } from 'framer-motion';

interface SovereignWelcomeProps {
    liquidity: number;
    manifestPulse: number;
}

export const SovereignWelcome: React.FC<SovereignWelcomeProps> = ({ liquidity, manifestPulse }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-void text-pearl h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffd700 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center z-10"
      >
        <motion.h1 
            animate={{ scale: [1, 1.02, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="font-minerva italic text-4xl md:text-6xl text-pearl text-glow-pearl tracking-tighter uppercase mb-2"
        >
            Grand Rising, Architect McBride
        </motion.h1>
        <p className="font-orbitron text-[10px] text-gold uppercase tracking-[1em] mb-12 opacity-60">Worldwide Quantum Protection Interface</p>
      </motion.div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
        <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="p-8 border border-gold/30 rounded-sm bg-black/40 backdrop-blur-xl relative group hover:border-gold transition-all"
        >
            <div className="absolute top-0 right-0 p-2 opacity-5 font-orbitron text-4xl font-black">LIQ</div>
            <p className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] mb-4 font-bold">Sovereign Asset Liquidity</p>
            <p className="font-orbitron text-3xl md:text-4xl text-pearl font-black tracking-tighter">
                ${liquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-4 h-0.5 bg-gold/10 w-full overflow-hidden">
                <div className="h-full bg-gold w-3/4 animate-pulse shadow-[0_0_10px_gold]" />
            </div>
        </motion.div>

        <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="p-8 border border-blue-500/30 rounded-sm bg-black/40 backdrop-blur-xl relative group hover:border-blue-400 transition-all"
        >
            <div className="absolute top-0 right-0 p-2 opacity-5 font-orbitron text-4xl font-black">TX</div>
            <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] mb-4 font-bold">Monday Manifest Pulse</p>
            <div className="flex items-center gap-4">
                <p className="font-orbitron text-3xl md:text-4xl text-blue-300 font-black tracking-tighter">
                    ACTIVE: ${manifestPulse.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <div className="mt-4 h-0.5 bg-blue-900/40 w-full overflow-hidden">
                <div className="h-full bg-blue-500 w-full animate-[shimmer_2s_infinite]" />
            </div>
        </motion.div>
      </div>

      <p className="mt-16 font-mono text-[10px] tracking-[0.6em] text-slate-500 uppercase font-black opacity-30 animate-pulse z-10">
        STA PROTOCOL SECURE | 2026 UNIVERSAL YEAR 1
      </p>
      
      <style>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};
