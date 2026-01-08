
import React, { useState } from 'react';
import { AudioEngine } from './audio/AudioEngine';

interface LoginProps {
  onLogin: () => void;
  onForgotPassword: () => void;
  audioEngine: AudioEngine | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword, audioEngine }) => {
  const [operatorId, setOperatorId] = useState('OP_88_ALPHA');
  const [key, setKey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    audioEngine?.playUIScanStart();
    
    // Simulate handshake delay
    setTimeout(() => {
        audioEngine?.playAscensionChime();
        onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[5000]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.1)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md p-10 bg-black/80 border border-white/10 backdrop-blur-xl rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden group animate-fade-in-up">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <span className="font-minerva text-3xl text-pearl italic">Æ</span>
            </div>
            <h1 className="font-orbitron text-2xl text-pearl uppercase tracking-[0.4em] font-bold mb-2">Sovereign Gate</h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Identity Verification Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
                <label className="text-[9px] font-mono text-gold uppercase tracking-widest block">Operator_ID</label>
                <input 
                    type="text" 
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-4 text-pearl font-mono text-xs focus:outline-none focus:border-gold/50 transition-all placeholder-slate-700"
                    placeholder="ENTER_ID"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-[9px] font-mono text-gold uppercase tracking-widest block">Access_Key</label>
                <input 
                    type="password" 
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-4 text-pearl font-mono text-xs focus:outline-none focus:border-gold/50 transition-all placeholder-slate-700"
                    placeholder="••••••••••••"
                />
            </div>

            <div className="pt-4">
                <button 
                    type="submit"
                    disabled={isAuthenticating}
                    className={`w-full py-4 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-black transition-all rounded-sm shadow-lg active:scale-95 relative overflow-hidden group/btn ${isAuthenticating ? 'opacity-50 cursor-wait' : ''}`}
                >
                    <span className="relative z-10">{isAuthenticating ? 'Handshaking...' : 'Initialize Session'}</span>
                    <div className="absolute inset-0 bg-gold/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
                </button>
            </div>

            <div className="flex justify-center pt-2">
                <button 
                    type="button"
                    onClick={() => {
                        audioEngine?.playUIClick();
                        onForgotPassword();
                    }}
                    className="text-[10px] font-mono text-slate-500 hover:text-rose-400 uppercase tracking-widest transition-colors border-b border-transparent hover:border-rose-500/30 pb-0.5"
                >
                    Forgot Password?
                </button>
            </div>
        </form>

        <div className="absolute bottom-4 left-0 w-full text-center">
            <span className="text-[8px] font-mono text-slate-800 uppercase tracking-[0.2em]">Secure Connection: TLS 1.3</span>
        </div>
      </div>
    </div>
  );
};
