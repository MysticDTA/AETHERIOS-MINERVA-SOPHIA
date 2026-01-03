import React, { useState, useEffect } from 'react';

interface MetricDisplayProps {
  label: string;
  value: number;
  maxValue: number;
  formatAs: 'percent' | 'decimal' | 'integer';
  isInverse?: boolean; // If true, lower is better
  className?: string;
  secondaryValue?: string;
  showSuccessIndicator?: boolean;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = React.memo(({ label, value, maxValue, formatAs, isInverse = false, className = '', secondaryValue, showSuccessIndicator = false }) => {
  const [jitterValue, setJitterValue] = useState(value);
  
  // Real-time visual optimization: subtle jitter to numbers makes it feel 'live'
  useEffect(() => {
      const interval = setInterval(() => {
          const delta = (Math.random() - 0.5) * (value * 0.0005);
          setJitterValue(value + delta);
      }, 150);
      return () => clearInterval(interval);
  }, [value]);

  const safeMaxValue = maxValue === 0 ? 1 : maxValue;
  const percentage = Math.max(0, Math.min(100, (value / safeMaxValue) * 100));
  
  const getFormattedValue = () => {
    switch (formatAs) {
      case 'percent':
        return `${(jitterValue * 100).toFixed(1)}%`;
      case 'decimal':
        return jitterValue.toFixed(4);
      case 'integer':
        return Math.round(jitterValue).toString();
      default:
        return jitterValue.toString();
    }
  };

  const getGradientColor = (percent: number) => {
    const effectivePercent = isInverse ? 100 - percent : percent;
    let hue;
    if (effectivePercent < 50) {
      hue = (effectivePercent / 50) * 45;
    } else {
      hue = 45 + ((effectivePercent - 50) / 50) * (60 - 45);
    }
    const saturation = 80 - (effectivePercent/100 * 40);
    const lightness = 70;
    const textLightness = 80;

    return {
      strokeColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      textColor: `hsl(${hue}, ${saturation}%, ${textLightness}%)`,
    };
  };

  const { strokeColor, textColor } = getGradientColor(percentage);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div 
        className={`bg-dark-surface/50 border border-white/5 p-5 rounded-lg flex items-center justify-between border-glow-rose backdrop-blur-xl relative overflow-hidden group transition-all duration-700 hover:bg-dark-surface/80 hover:border-white/20 ${className} ${showSuccessIndicator ? 'scan-success-flash' : ''}`}
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-valuetext={getFormattedValue()}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id={`grid-${label.replace(/\s/g, '')}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-${label.replace(/\s/g, '')})`} />
        <rect width="100%" height="2" fill="white" opacity="0.15" style={{ animation: 'scanline-sweep 4s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
      </svg>

      <div className="flex-1 z-10 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-gold/40 rounded-full" />
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.4em] truncate font-bold group-hover:text-gold transition-colors" id={`metric-label-${label}`} title={label}>{label}</p>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2">
            <p 
            className="font-orbitron text-4xl sm:text-5xl font-bold transition-colors duration-500 leading-none tracking-tighter"
            style={{ color: textColor, textShadow: `0 0 15px ${strokeColor}44` }}
            >
            {getFormattedValue()}
            </p>
            {secondaryValue && (
                <p className={`font-orbitron text-[10px] font-extrabold pb-0.5 transition-all duration-500 whitespace-nowrap bg-black/40 px-2 py-0.5 rounded border border-white/5 ${
                    secondaryValue.startsWith('-') ? 'text-rose-400 border-rose-500/20' : 'text-green-400 border-green-500/20'
                }`}>
                    {secondaryValue}
                </p>
            )}
        </div>
      </div>
      
      <div className="w-20 h-20 sm:w-24 sm:h-24 relative z-10 flex-shrink-0" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-slate-900/50"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius + 4}
            cx="60"
            cy="60"
          />
          <circle
            className="text-slate-800/20"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            stroke={strokeColor}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{ 
                transform: 'rotate(-90deg)', 
                transformOrigin: '50% 50%', 
                filter: `drop-shadow(0 0 12px ${strokeColor}88)` 
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes scanline-sweep {
            from { transform: translateY(-100%); }
            to { transform: translateY(600%); }
        }
      `}</style>
    </div>
  );
});