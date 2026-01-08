
import React, { useMemo } from 'react';
import { OrbMode } from '../types';

interface AscensionOrbEngineProps {
  mode: OrbMode;
}

const AscensionOrbEngine: React.FC<AscensionOrbEngineProps> = ({ mode }) => {
  
  const getModeColors = (m: OrbMode) => {
    switch (m) {
      case 'STANDBY': return { primary: '#e2e8f0', secondary: '#64748b', accent: '#f8fafc', glow: 'rgba(226, 232, 240, 0.2)' }; 
      case 'ANALYSIS': return { primary: '#fbbf24', secondary: '#b45309', accent: '#fef3c7', glow: 'rgba(251, 191, 36, 0.4)' }; 
      case 'SYNTHESIS': return { primary: '#c084fc', secondary: '#7c3aed', accent: '#f3e8ff', glow: 'rgba(192, 132, 252, 0.4)' }; 
      case 'REPAIR': return { primary: '#2dd4bf', secondary: '#0f766e', accent: '#ccfbf1', glow: 'rgba(45, 212, 191, 0.4)' }; 
      case 'GROUNDING': return { primary: '#f97316', secondary: '#c2410c', accent: '#ffedd5', glow: 'rgba(249, 115, 22, 0.4)' }; 
      case 'CONCORDANCE': return { primary: '#38bdf8', secondary: '#0369a1', accent: '#e0f2fe', glow: 'rgba(56, 189, 248, 0.5)' }; 
      case 'OFFLINE': return { primary: '#ef4444', secondary: '#7f1d1d', accent: '#fee2e2', glow: 'rgba(239, 68, 68, 0.1)' }; 
      default: return { primary: '#94a3b8', secondary: '#475569', accent: '#f1f5f9', glow: 'none' };
    }
  };

  const colors = getModeColors(mode);

  // Generate deterministic "micro-data" for the HUD overlay
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
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <line key={deg} x1="100" y1="100" x2={100 + 98 * Math.cos(deg * Math.PI / 180)} y2={100 + 98 * Math.sin(deg * Math.PI / 180)} opacity="0.3" />
            ))}
        </g>

        {/* --- MODE SPECIFIC GEOMETRY --- */}

        {/* STANDBY: Elegant Breathing Shells */}
        {mode === 'STANDBY' && (
            <g>
                <circle cx="100" cy="100" r="60" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.5">
                    <animate attributeName="r" values="58;62;58" dur="8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="8s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="75" fill="none" stroke={colors.secondary} strokeWidth="0.3" strokeDasharray="2 10">
                     <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="60s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="45" fill="none" stroke={colors.primary} strokeWidth="1" strokeDasharray="40 20" opacity="0.8">
                     <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="45s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* ANALYSIS: High-Speed Scanning Radar */}
        {mode === 'ANALYSIS' && (
            <g>
                {/* Rotating Scanner */}
                <path d="M 100 100 L 170 100 A 70 70 0 0 1 100 170 Z" fill={colors.glow} opacity="0.2">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Target Reticles */}
                <circle cx="100" cy="100" r="80" fill="none" stroke={colors.primary} strokeWidth="1" strokeDasharray="10 30" opacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="10s" repeatCount="indefinite" />
                </circle>
                <g opacity="0.8">
                    <line x1="100" y1="20" x2="100" y2="40" stroke={colors.accent} strokeWidth="2" />
                    <line x1="100" y1="160" x2="100" y2="180" stroke={colors.accent} strokeWidth="2" />
                    <line x1="20" y1="100" x2="40" y2="100" stroke={colors.accent} strokeWidth="2" />
                    <line x1="160" y1="100" x2="180" y2="100" stroke={colors.accent} strokeWidth="2" />
                    <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="1s" repeatCount="indefinite" />
                </g>
            </g>
        )}

        {/* SYNTHESIS: Fluid Intertwining Loops */}
        {mode === 'SYNTHESIS' && (
            <g>
                {[0, 60, 120].map(deg => (
                    <ellipse key={deg} cx="100" cy="100" rx="35" ry="85" fill="none" stroke={colors.primary} strokeWidth="0.8" opacity="0.6" transform={`rotate(${deg} 100 100)`}>
                        <animate attributeName="ry" values="85;75;85" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="stroke-dasharray" values="10 100; 100 10; 10 100" dur="6s" repeatCount="indefinite" />
                    </ellipse>
                ))}
                <circle cx="100" cy="100" r="60" fill="none" stroke={colors.secondary} strokeWidth="0.5" strokeDasharray="2 8">
                     <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="15s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

        {/* REPAIR: Constructive Alignment Grid */}
        {mode === 'REPAIR' && (
            <g>
                <rect x="60" y="60" width="80" height="80" fill="none" stroke={colors.primary} strokeWidth="1.5" strokeDasharray="20 10" opacity="0.7">
                    <animate attributeName="stroke-dashoffset" from="0" to="60" dur="3s" repeatCount="indefinite" />
                </rect>
                <path d="M 100 20 L 100 180 M 20 100 L 180 100" stroke={colors.accent} strokeWidth="1" opacity="0.5" strokeDasharray="5 5">
                     <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Repair Crosshairs */}
                {[45, 135, 225, 315].map(deg => (
                    <line key={deg} x1="100" y1="100" x2="100" y2="50" stroke={colors.secondary} strokeWidth="2" transform={`rotate(${deg} 100 100)`}>
                        <animate attributeName="y2" values="50;65;50" dur="1.5s" repeatCount="indefinite" />
                    </line>
                ))}
            </g>
        )}

        {/* GROUNDING: Vertical Flow Downward */}
        {mode === 'GROUNDING' && (
            <g>
                <defs>
                    <linearGradient id="groundingFlow" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={colors.accent} stopOpacity="0" />
                        <stop offset="50%" stopColor={colors.primary} stopOpacity="1" />
                        <stop offset="100%" stopColor={colors.secondary} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[40, 60, 80, 100, 120, 140, 160].map((x, i) => (
                    <line key={x} x1={x} y1="10" x2={x} y2="190" stroke="url(#groundingFlow)" strokeWidth={1 + i%2} opacity="0.6">
                        <animate attributeName="stroke-dasharray" values="10 100; 100 10" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                        <animate attributeName="stroke-dashoffset" from="200" to="0" dur={`${2 + i * 0.1}s`} repeatCount="indefinite" />
                    </line>
                ))}
                <circle cx="100" cy="100" r="50" fill="none" stroke={colors.primary} strokeWidth="2" opacity="0.4" />
            </g>
        )}

        {/* CONCORDANCE: Geometric Expansion */}
        {mode === 'CONCORDANCE' && (
            <g>
                <circle cx="100" cy="100" r="90" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" />
                {[0, 60, 120, 180, 240, 300].map(deg => (
                    <path key={deg} d="M 100 100 L 100 40" stroke={colors.accent} strokeWidth="1" transform={`rotate(${deg} 100 100)`}>
                        <animate attributeName="d" values="M 100 100 L 100 40; M 100 100 L 100 20; M 100 100 L 100 40" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" repeatCount="indefinite" />
                    </path>
                ))}
                <polygon points="100,20 170,140 30,140" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.5">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                </polygon>
                <polygon points="100,180 170,60 30,60" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.5">
                    <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="20s" repeatCount="indefinite" />
                </polygon>
            </g>
        )}

        {/* OFFLINE: Static Dissipation */}
        {mode === 'OFFLINE' && (
            <g opacity="0.4">
                <circle cx="100" cy="100" r="30" fill="none" stroke={colors.primary} strokeWidth="1.5" strokeDasharray="4 4" />
                {[...Array(12)].map((_, i) => (
                    <circle key={i} cx={100} cy={100} r="2" fill={colors.accent}>
                         <animate attributeName="cx" values={`100; ${100 + (Math.random() - 0.5) * 100}`} dur="3s" repeatCount="indefinite" />
                         <animate attributeName="cy" values={`100; ${100 + (Math.random() - 0.5) * 100}`} dur="3s" repeatCount="indefinite" />
                         <animate attributeName="opacity" values="1;0" dur="3s" repeatCount="indefinite" />
                    </circle>
                ))}
            </g>
        )}

        {/* --- CORE ORB (SHARED) --- */}
        <circle 
          cx="100" cy="100" r="36" 
          fill={`url(#grad-${mode})`}
          filter="url(#orb-glow-main)"
          className="transition-all duration-[2000ms] ease-in-out shadow-inner"
          style={{
             animation: mode === 'OFFLINE' ? 'none' : 'pulse 6s ease-in-out infinite'
          }}
        />
        
        {/* Core Detail Ring */}
        <circle 
          cx="100" cy="100" r="32" 
          fill="none"
          stroke={colors.accent}
          strokeWidth="0.8"
          filter="url(#orb-glow-sharp)"
          opacity="0.7"
          strokeDasharray="2 6"
        >
             <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
        </circle>

        {/* HUD Micro-Data Overlay */}
        <g opacity="0.8">
            <text x="100" y="94" textAnchor="middle" fill={colors.primary} fontSize="4" className="font-mono uppercase tracking-[0.25em] font-bold">
                {mode === 'OFFLINE' ? 'VOID' : 'SYNC'}
            </text>
            <text x="100" y="114" textAnchor="middle" fill={colors.accent} fontSize="3" className="font-mono uppercase tracking-widest opacity-80">
                {mode === 'OFFLINE' ? '00:00' : `0x${coordinateTicker}`}
            </text>
        </g>

      </svg>
      
      {/* Decorative Mode Badge */}
      <div className="absolute -bottom-16 flex flex-col items-center gap-4">
        <div className="flex gap-2 items-center">
            {Array.from({length: 5}).map((_, i) => (
                <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${mode === 'OFFLINE' ? 'bg-slate-800' : 'bg-current shadow-[0_0_8px_currentColor]'}`} 
                    style={{ 
                        color: colors.primary, 
                        animation: mode === 'OFFLINE' ? 'none' : 'pulse 2s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`,
                        opacity: 0.3 + (i * 0.15)
                    }} 
                />
            ))}
        </div>
        <div className="px-6 py-2 bg-black/60 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
            <span className="font-orbitron text-[9px] tracking-[0.6em] font-black uppercase transition-colors duration-1000 block text-center" style={{ color: colors.primary, textShadow: `0 0 15px ${colors.glow}` }}>
                {mode}
            </span>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default AscensionOrbEngine;
