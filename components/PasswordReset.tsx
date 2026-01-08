
import React, { useState } from 'react';
import { AudioEngine } from './audio/AudioEngine';

interface PasswordResetProps {
  onBack: () => void;
  audioEngine: AudioEngine | null;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ onBack, audioEngine }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');
    audioEngine?.playPurgeEffect();
    
    setTimeout(() => {
        setStatus('SENT');
        audioEngine?.playUIConfirm();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[5000]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="w-full max-w-md p-10 bg-black/90 border border-rose-900/30 backdrop-blur-xl rounded-sm shadow-[0_0_100px_rgba(220,38,38,0.1)] relative overflow-hidden animate-fade-in-up">
        
        <div className="text-center mb-8">
            <h2 className="font-orbitron text-xl text-rose-400 uppercase tracking-[0.3em] font-bold mb-2">Credential Recovery</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Protocol: EMERGENCY_RESET_AUTH</p>
        </div>

        {status === 'SENT' ? (
            <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 mx-auto bg-green-900/20 border border-green-500/50 rounded-full flex items-center justify-center text-green-400 animate-pulse">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-[12px] font-minerva italic text-pearl/80">
                    "A secure recovery shard has been transmitted to your neural-link address. Please verify causality."
                </p>
                <button 
                    onClick={onBack}
                    className="mt-4 px-8 py-3 bg-white/5 border border-white/10 text-pearl font-orbitron text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-sm"
                >
                    Return to Gate
                </button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-mono text-rose-400 uppercase tracking-widest block">Registered_Uplink (Email)</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-4 text-pearl font-mono text-xs focus:outline-none focus:border-rose-500/50 transition-all placeholder-slate-700"
                        placeholder="operator@aetherios.net"
                    />
                </div>

                <div className="pt-2 space-y-3">
                    <button 
                        type="submit"
                        disabled={status === 'SENDING'}
                        className={`w-full py-4 bg-rose-900/20 border border-rose-500/40 text-rose-300 font-orbitron text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-rose-900/40 hover:text-white transition-all rounded-sm shadow-lg active:scale-95 ${status === 'SENDING' ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {status === 'SENDING' ? 'Transmitting...' : 'Initiate Reset Sequence'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => {
                            audioEngine?.playUIClick();
                            onBack();
                        }}
                        className="w-full py-3 text-[10px] font-mono text-slate-500 hover:text-pearl uppercase tracking-widest transition-colors"
                    >
                        Cancel Protocol
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};
