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
    <div className="relative w-56 h-56 flex items-center justify-center transition-all duration-1000 select-none pointer-events-none group">
      {/* Deep Atmospheric Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none rounded-full" />
      
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        <defs>
          <filter id="orb-glow-main" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="orb-glow-sharp" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id={`grad-${mode}`}>
            <stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
            <stop offset="40%" stopColor={colors.primary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* --- DYNAMIC BACKGROUND LATTICE --- */}
        <g opacity="0.08" stroke={colors.primary} strokeWidth="0.15">
            <circle cx="100" cy="100" r="98" fill="none" strokeDasharray="1 10" />
            <circle cx="100" cy="100" r="88" fill="none" strokeDasharray="5 20" opacity="0.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <line key={deg} x1="100" y1="100" x2={100 + 98 * Math.cos(deg * Math.PI / 180)} y2={100 + 98 * Math.sin(deg * Math.PI / 180)} opacity="0.2" />
            ))}
        </g>

        {/* --- MODE SPECIFIC GEOMETRY --- */}

        {/* STANDBY: Elegant Concentric Shells */}
        {mode === 'STANDBY' && (
            <g className="transition-all duration-1000">
                <circle cx="100" cy="100" r="50" fill="none" stroke={colors.primary} strokeWidth="0.4" opacity="0.3">
                    <animate attributeName="r" values="49;54;49" dur="8s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="65" fill="none" stroke={colors.secondary} strokeWidth="0.2" strokeDasharray="2 15">
                     <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="80s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="42" fill="none" stroke={colors.primary} strokeWidth="1" strokeDasharray="1 30" opacity="0.6">
                     <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="40s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* ANALYSIS: Scanning Decagon & Radar HUD */}
        {mode === 'ANALYSIS' && (
            <g>
                <polygon points="100,22 146,36 164,85 140,134 95,148 55,134 35,85 53,36" fill="none" stroke={colors.primary} strokeWidth="0.8" opacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="12s" repeatCount="indefinite" />
                </polygon>
                <circle cx="100" cy="100" r="70" fill="none" stroke={colors.accent} strokeWidth="3" opacity="0.1">
                    <animate attributeName="r" values="30;85" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <path d="M 100 12 A 88 88 0 0 1 188 100" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.4">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="1.8s" repeatCount="indefinite" />
                </path>
            </g>
        )}

        {/* SYNTHESIS: Unified Toroidal Flow */}
        {mode === 'SYNTHESIS' && (
            <g>
                {[0, 60, 120].map(deg => (
                    <ellipse key={deg} cx="100" cy="100" rx="22" ry="85" fill="none" stroke={colors.primary} strokeWidth="1.2" opacity="0.5" transform={`rotate(${deg} 100 100)`}>
                        <animate attributeName="stroke-width" values="0.5;1.5;0.5" dur="4s" repeatCount="indefinite" />
                    </ellipse>
                ))}
                <circle cx="100" cy="100" r="60" fill="none" stroke={colors.secondary} strokeWidth="0.5" strokeDasharray="2 12" opacity="0.6">
                     <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="15s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* REPAIR: Causal Alignment Vectors */}
        {mode === 'REPAIR' && (
            <g>
                <rect x="58" y="58" width="84" height="84" fill="none" stroke={colors.primary} strokeWidth="0.8" opacity="0.4">
                    <animate attributeName="opacity" values="0.1;0.9;0.1" dur="2s" repeatCount="indefinite" />
                </rect>
                <path d="M 100 35 L 100 165 M 35 100 L 165 100" stroke={colors.accent} strokeWidth="1" opacity="0.7">
                     <animate attributeName="stroke-dasharray" values="0 260; 260 0; 0 260" dur="4s" repeatCount="indefinite" />
                </path>
                <circle cx="100" cy="100" r="58" fill="none" stroke={colors.primary} strokeWidth="0.6" strokeDasharray="12 8" opacity="0.3" />
            </g>
        )}

        {/* GROUNDING: Telluric Anchor Conduits */}
        {mode === 'GROUNDING' && (
            <g>
                <rect x="40" y="155" width="120" height="2" fill={colors.primary} opacity="0.8" />
                {[60, 100, 140].map(x => (
                    <line key={x} x1={x} y1="30" x2={x} y2="155" stroke={colors.secondary} strokeWidth="0.6" opacity="0.5">
                        <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="stroke-dasharray" values="1 15; 8 8" dur="2s" repeatCount="indefinite" />
                    </line>
                ))}
                <circle cx="100" cy="100" r="45" fill="none" stroke={colors.primary} strokeWidth="1.2" opacity="0.5">
                     <animate attributeName="cy" values="98;102;98" dur="4s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* CONCORDANCE: Metatron Blossom Unfolding */}
        {mode === 'CONCORDANCE' && (
            <g>
                <circle cx="100" cy="100" r="85" fill="none" stroke={colors.primary} strokeWidth="0.6" opacity="0.7" />
                {[0, 60, 120, 180, 240, 300].map(deg => (
                    <circle 
                        key={deg} 
                        cx={100 + 48 * Math.cos(deg * Math.PI / 180)} 
                        cy={100 + 48 * Math.sin(deg * Math.PI / 180)} 
                        r="48" fill="none" stroke={colors.primary} strokeWidth="0.2" opacity="0.4"
                    >
                        <animateTransform attributeName="transform" type="rotate" from={`${deg} 100 100`} to={`${deg + 360} 100 100`} dur="60s" repeatCount="indefinite" />
                    </circle>
                ))}
                <polygon points="100,15 175,145 25,145" fill="none" stroke={colors.accent} strokeWidth="1.2" opacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                </polygon>
                <polygon points="100,185 25,55 175,55" fill="none" stroke={colors.accent} strokeWidth="1.2" opacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="20s" repeatCount="indefinite" />
                </polygon>
            </g>
        )}

        {/* OFFLINE: Particulate Dissipation */}
        {mode === 'OFFLINE' && (
            <g opacity="0.2">
                <circle cx="100" cy="100" r="28" fill="none" stroke={colors.primary} strokeWidth="1.5" strokeDasharray="4 22" />
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <circle key={i} cx={70 + i * 8} cy={50 + i * 6} r="1" fill={colors.accent}>
                         <animate attributeName="opacity" values="1;0" dur={`${1.5 + i * 0.25}s`} repeatCount="indefinite" />
                         <animate attributeName="cy" values={`${50 + i * 6}; ${180}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
                    </circle>
                ))}
            </g>
        )}

        {/* --- CORE ORB (SHARED) --- */}
        <circle 
          cx="100" cy="100" r="32" 
          fill={`url(#grad-${mode})`}
          filter="url(#orb-glow-main)"
          className="transition-all duration-[2000ms] ease-in-out shadow-inner"
          style={{
             animation: mode === 'OFFLINE' ? 'none' : 'pulse 6s ease-in-out infinite'
          }}
        />
        
        {/* Core Detail Ring */}
        <circle 
          cx="100" cy="100" r="28" 
          fill="none"
          stroke={colors.accent}
          strokeWidth="0.4"
          filter="url(#orb-glow-sharp)"
          opacity="0.5"
          strokeDasharray="2 6"
        >
             <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
        </circle>

        {/* HUD Micro-Data Overlay */}
        <g opacity="0.6">
            <text x="100" y="94" textAnchor="middle" fill={colors.primary} fontSize="3.5" className="font-mono uppercase tracking-[0.2em] font-bold">
                {mode === 'OFFLINE' ? 'LOST' : 'LOCK'}
            </text>
            <text x="100" y="112" textAnchor="middle" fill={colors.accent} fontSize="3" className="font-mono uppercase tracking-widest opacity-80">
                {mode === 'OFFLINE' ? '00:00:00' : `REF_${coordinateTicker}`}
            </text>
        </g>

      </svg>
      
      {/* Decorative Bottom Bar */}
      <div className="absolute -bottom-12 flex flex-col items-center gap-3">
        <div className="flex gap-2.5 items-center">
            {Array.from({length: 4}).map((_, i) => (
                <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${mode === 'OFFLINE' ? 'bg-slate-800' : 'bg-current shadow-[0_0_8px_currentColor]'}`} 
                    style={{ 
                        color: colors.primary, 
                        animation: mode === 'OFFLINE' ? 'none' : 'pulse 2s ease-in-out infinite',
                        animationDelay: `${i * 0.25}s`,
                        opacity: 0.2 + (i * 0.2)
                    }} 
                />
            ))}
        </div>
        <div className="px-6 py-1 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
            <span className="font-orbitron text-[9px] tracking-[0.6em] font-bold uppercase transition-colors duration-1000 block text-center" style={{ color: colors.primary, textShadow: `0 0 10px ${colors.glow}` }}>
                {mode}
            </span>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes radar-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AscensionOrbEngine;