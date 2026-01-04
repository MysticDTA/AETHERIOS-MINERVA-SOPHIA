
import React, { useMemo } from 'react';
import { OrbMode } from '../types';

interface AscensionOrbEngineProps {
  mode: OrbMode;
}

const AscensionOrbEngine: React.FC<AscensionOrbEngineProps> = ({ mode }) => {
  
  const getModeColors = (m: OrbMode) => {
    switch (m) {
      case 'STANDBY': return { primary: '#f8f5ec', secondary: '#b6b0a0', accent: '#ffffff', glow: 'rgba(248,245,236,0.3)' }; 
      case 'ANALYSIS': return { primary: '#e6c77f', secondary: '#facc15', accent: '#fffbeb', glow: 'rgba(230,199,127,0.4)' }; 
      case 'SYNTHESIS': return { primary: '#d8b4fe', secondary: '#a78bfa', accent: '#f5f3ff', glow: 'rgba(167,139,250,0.4)' }; 
      case 'REPAIR': return { primary: '#2dd4bf', secondary: '#14b8a6', accent: '#f0fdfa', glow: 'rgba(45,212,191,0.4)' }; 
      case 'GROUNDING': return { primary: '#f59e0b', secondary: '#d97706', accent: '#fff7ed', glow: 'rgba(245,158,11,0.4)' }; 
      case 'CONCORDANCE': return { primary: '#60a5fa', secondary: '#3b82f6', accent: '#eff6ff', glow: 'rgba(59,130,246,0.5)' }; 
      case 'OFFLINE': return { primary: '#ef4444', secondary: '#7f1d1d', accent: '#fee2e2', glow: 'rgba(239,68,68,0.2)' }; 
      default: return { primary: '#f8f5ec', secondary: '#b6b0a0', accent: '#ffffff', glow: 'none' };
    }
  };

  const colors = getModeColors(mode);

  // Generate some deterministic "micro-data" for the HUD
  const coordinateTicker = useMemo(() => {
    const chars = '0123456789ABCDEF';
    return Array.from({length: 4}).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  }, [mode]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center transition-all duration-1000 select-none pointer-events-none group">
      {/* Deep Atmospheric Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none rounded-full" />
      
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        <defs>
          <filter id="orb-glow-main" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="orb-glow-sharp" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id={`grad-${mode}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
            <stop offset="40%" stopColor={colors.primary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* --- DYNAMIC BACKGROUND LATTICE --- */}
        <g opacity="0.1" stroke={colors.primary} strokeWidth="0.2">
            <circle cx="100" cy="100" r="98" fill="none" strokeDasharray="1 10" />
            <circle cx="100" cy="100" r="88" fill="none" strokeDasharray="5 20" opacity="0.5" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                <line key={deg} x1="100" y1="100" x2={100 + 98 * Math.cos(deg * Math.PI / 180)} y2={100 + 98 * Math.sin(deg * Math.PI / 180)} opacity="0.3" />
            ))}
        </g>

        {/* --- MODE SPECIFIC GEOMETRY --- */}

        {/* STANDBY: Elegant Concentric Shells */}
        {mode === 'STANDBY' && (
            <g className="transition-all duration-1000">
                <circle cx="100" cy="100" r="55" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.4">
                    <animate attributeName="r" values="54;58;54" dur="10s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="72" fill="none" stroke={colors.secondary} strokeWidth="0.3" strokeDasharray="3 18">
                     <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="120s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="48" fill="none" stroke={colors.primary} strokeWidth="1.2" strokeDasharray="1 35" opacity="0.7">
                     <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="50s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* ANALYSIS: Scanning Decagon & Radar HUD */}
        {mode === 'ANALYSIS' && (
            <g>
                <polygon points="100,15 149,30 178,74 162,126 120,165 74,165 35,126 18,74 48,30" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.7">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="15s" repeatCount="indefinite" />
                </polygon>
                <circle cx="100" cy="100" r="85" fill="none" stroke={colors.accent} strokeWidth="5" opacity="0.1">
                    <animate attributeName="r" values="40;95" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0" dur="3s" repeatCount="indefinite" />
                </circle>
                <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '100px 100px' }}>
                    <path d="M 100 10 A 90 90 0 0 1 190 100" fill="none" stroke={colors.accent} strokeWidth="1.5" opacity="0.5" />
                    <circle cx="100" cy="10" r="2" fill={colors.accent} filter="url(#orb-glow-sharp)" />
                </g>
            </g>
        )}

        {/* SYNTHESIS: Unified Toroidal Flow */}
        {mode === 'SYNTHESIS' && (
            <g>
                {[0, 45, 90, 135].map(deg => (
                    <ellipse key={deg} cx="100" cy="100" rx="30" ry="92" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.6" transform={`rotate(${deg} 100 100)`}>
                        <animate attributeName="stroke-width" values="0.4;1.8;0.4" dur="5s" repeatCount="indefinite" />
                        <animate attributeName="stroke-dasharray" values="10,200; 150,10; 10,200" dur="8s" repeatCount="indefinite" />
                    </ellipse>
                ))}
                <circle cx="100" cy="100" r="68" fill="none" stroke={colors.secondary} strokeWidth="0.6" strokeDasharray="3 15" opacity="0.7">
                     <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* REPAIR: Causal Alignment Vectors */}
        {mode === 'REPAIR' && (
            <g>
                <rect x="52" y="52" width="96" height="96" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.5">
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" repeatCount="indefinite" />
                </rect>
                <rect x="35" y="35" width="130" height="130" fill="none" stroke={colors.secondary} strokeWidth="0.5" strokeDasharray="15 15">
                     <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="-360 100 100" dur="40s" repeatCount="indefinite" />
                </rect>
                <path d="M 100 20 L 100 180 M 20 100 L 180 100" stroke={colors.accent} strokeWidth="1.2" opacity="0.8">
                     <animate attributeName="stroke-dasharray" values="0 320; 320 0; 0 320" dur="6s" repeatCount="indefinite" />
                </path>
                <circle cx="100" cy="100" r="65" fill="none" stroke={colors.primary} strokeWidth="0.8" strokeDasharray="15 10" opacity="0.4" />
            </g>
        )}

        {/* GROUNDING: Telluric Anchor Conduits */}
        {mode === 'GROUNDING' && (
            <g>
                <rect x="30" y="165" width="140" height="3" fill={colors.primary} opacity="0.9" filter="url(#orb-glow-sharp)" />
                {[50, 75, 100, 125, 150].map(x => (
                    <line key={x} x1={x} y1="20" x2={x} y2="165" stroke={colors.secondary} strokeWidth="0.8" opacity="0.6">
                        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.8s" repeatCount="indefinite" />
                        <animate attributeName="stroke-dasharray" values="2 20; 12 12" dur="1.5s" repeatCount="indefinite" />
                    </line>
                ))}
                <circle cx="100" cy="100" r="52" fill="none" stroke={colors.primary} strokeWidth="2" opacity="0.6">
                     <animate attributeName="cy" values="96;104;96" dur="5s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* CONCORDANCE: Metatron Blossom Unfolding */}
        {mode === 'CONCORDANCE' && (
            <g>
                <circle cx="100" cy="100" r="92" fill="none" stroke={colors.primary} strokeWidth="0.8" opacity="0.8" />
                {[0, 60, 120, 180, 240, 300].map(deg => {
                    const r = 55;
                    const cx = 100 + r * Math.cos(deg * Math.PI / 180);
                    const cy = 100 + r * Math.sin(deg * Math.PI / 180);
                    return (
                        <g key={deg} style={{ transformOrigin: '100px 100px' }}>
                             <animateTransform attributeName="transform" type="rotate" from={`${deg} 100 100`} to={`${deg + 360} 100 100`} dur="100s" repeatCount="indefinite" />
                             <circle cx={cx} cy={cy} r="55" fill="none" stroke={colors.primary} strokeWidth="0.3" opacity="0.5" />
                             <line x1="100" y1="100" x2={cx} y2={cy} stroke={colors.accent} strokeWidth="0.2" opacity="0.3" />
                        </g>
                    );
                })}
                <polygon points="100,5 185,150 15,150" fill="none" stroke={colors.accent} strokeWidth="1.5" opacity="0.7">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="25s" repeatCount="indefinite" />
                </polygon>
                <polygon points="100,195 15,50 185,50" fill="none" stroke={colors.accent} strokeWidth="1.5" opacity="0.7">
                    <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="25s" repeatCount="indefinite" />
                </polygon>
            </g>
        )}

        {/* OFFLINE: Particulate Dissipation */}
        {mode === 'OFFLINE' && (
            <g opacity="0.3">
                <circle cx="100" cy="100" r="35" fill="none" stroke={colors.primary} strokeWidth="2" strokeDasharray="5 25" />
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                    <circle key={i} cx={60 + i * 7} cy={40 + i * 5} r="1.2" fill={colors.accent}>
                         <animate attributeName="opacity" values="1;0" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
                         <animate attributeName="cy" values={`${40 + i * 5}; ${190}`} dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />
                         <animate attributeName="cx" values={`${60 + i * 7}; ${60 + i * 7 + (Math.random() - 0.5) * 40}`} dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                ))}
            </g>
        )}

        {/* --- CORE ORB (SHARED) --- */}
        <circle 
          cx="100" cy="100" r="38" 
          fill={`url(#grad-${mode})`}
          filter="url(#orb-glow-main)"
          className="transition-all duration-[2000ms] ease-in-out shadow-inner"
          style={{
             animation: mode === 'OFFLINE' ? 'none' : 'pulse 8s ease-in-out infinite'
          }}
        />
        
        {/* Core Detail Ring */}
        <circle 
          cx="100" cy="100" r="34" 
          fill="none"
          stroke={colors.accent}
          strokeWidth="0.6"
          filter="url(#orb-glow-sharp)"
          opacity="0.6"
          strokeDasharray="3 8"
        >
             <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="12s" repeatCount="indefinite" />
        </circle>

        {/* HUD Micro-Data Overlay */}
        <g opacity="0.7">
            <text x="100" y="94" textAnchor="middle" fill={colors.primary} fontSize="4.5" className="font-mono uppercase tracking-[0.25em] font-bold">
                {mode === 'OFFLINE' ? 'VOID' : 'SYNC'}
            </text>
            <text x="100" y="114" textAnchor="middle" fill={colors.accent} fontSize="3.5" className="font-mono uppercase tracking-widest opacity-80">
                {mode === 'OFFLINE' ? '00:00' : `0x${coordinateTicker}`}
            </text>
        </g>

      </svg>
      
      {/* Decorative Mode Badge */}
      <div className="absolute -bottom-16 flex flex-col items-center gap-4">
        <div className="flex gap-3 items-center">
            {Array.from({length: 5}).map((_, i) => (
                <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-700 ${mode === 'OFFLINE' ? 'bg-slate-900' : 'bg-current shadow-[0_0_10px_currentColor]'}`} 
                    style={{ 
                        color: colors.primary, 
                        animation: mode === 'OFFLINE' ? 'none' : 'pulse 2.5s ease-in-out infinite',
                        animationDelay: `${i * 0.3}s`,
                        opacity: 0.15 + (i * 0.15)
                    }} 
                />
            ))}
        </div>
        <div className="px-8 py-2 bg-black/50 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
            <span className="font-orbitron text-[10px] tracking-[0.8em] font-black uppercase transition-colors duration-1000 block text-center" style={{ color: colors.primary, textShadow: `0 0 15px ${colors.glow}` }}>
                {mode}
            </span>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
            0%, 100% { opacity: 0.75; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
};

export default AscensionOrbEngine;
