
import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface MetricDisplayProps {
  label: string;
  value: number;
  maxValue: number;
  formatAs: 'percent' | 'decimal' | 'integer';
  isInverse?: boolean; // If true, lower is better
  className?: string;
  secondaryValue?: string;
  showSuccessIndicator?: boolean;
  tooltip?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = React.memo(({ label, value, maxValue, formatAs, isInverse = false, className = '', secondaryValue, showSuccessIndicator = false, tooltip }) => {
  const [jitterValue, setJitterValue] = useState(value);
  
  // Real-time visual optimization: subtle jitter to numbers makes it feel 'live'
  useEffect(() => {
      const interval = setInterval(() => {
          // Smaller jitter for elegance
          const delta = (Math.random() - 0.5) * (value * 0.002); // 0.2% jitter
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
      hue = (effectivePercent / 50) * 45; // Red to Gold
    } else {
      hue = 45 + ((effectivePercent - 50) / 50) * (150 - 45); // Gold to Teal
    }
    const saturation = 90;
    const lightness = 60;

    return {
      strokeColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      textColor: `hsl(${hue}, ${saturation}%, 85%)`,
    };
  };

  const { strokeColor, textColor } = getGradientColor(percentage);

  // Geometry for SVG
  const size = 120;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const content = (
    <div 
        className={`bg-dark-surface/60 border border-white/5 p-5 rounded-xl flex items-center justify-between backdrop-blur-2xl relative overflow-hidden group transition-all duration-700 hover:bg-dark-surface/80 hover:border-white/10 ${className} ${showSuccessIndicator ? 'scan-success-flash' : ''}`}
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-valuetext={getFormattedValue()}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <div className="flex-1 z-10 min-w-0 pr-4 relative">
        <div className="flex items-center gap-2 mb-1.5">
            <div className="w-px h-3 bg-white/30 group-hover:bg-white/60 transition-colors" />
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.25em] truncate font-semibold group-hover:text-pearl transition-colors" id={`metric-label-${label}`} title={label}>{label}</p>
        </div>
        <div className="flex flex-col">
            <p 
                className="font-orbitron text-3xl sm:text-4xl font-bold transition-colors duration-500 leading-none tracking-tighter"
                style={{ color: textColor, textShadow: `0 0 20px ${strokeColor}33` }}
            >
                {getFormattedValue()}
            </p>
            {secondaryValue && (
                <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[9px] font-mono opacity-60 ${secondaryValue.startsWith('-') ? 'text-rose-300' : 'text-emerald-300'}`}>
                        {secondaryValue}
                    </span>
                </div>
            )}
        </div>
      </div>
      
      <div className="w-16 h-16 relative z-10 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Track (Segmented) */}
          <circle
            className="text-white/5"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size/2}
            cy={size/2}
            strokeDasharray="2 4" 
          />
          {/* Progress Segment */}
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={strokeColor}
            fill="transparent"
            r={radius}
            cx={size/2}
            cy={size/2}
            style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
          />
          
          {/* Inner Decorative Spinner - Slower for elegance */}
          <circle
            className="text-white/10"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            stroke="currentColor"
            fill="transparent"
            r={radius - 8}
            cx={size/2}
            cy={size/2}
            style={{ transformOrigin: 'center', animation: 'spin-slow 20s linear infinite' }}
          />
          
          {/* Value Indicator Dot */}
          <circle 
             r="2.5" 
             fill={strokeColor}
             cx={size/2 + radius * Math.cos(2 * Math.PI * (percentage/100))}
             cy={size/2 + radius * Math.sin(2 * Math.PI * (percentage/100))}
             style={{ 
                 transformOrigin: 'center', 
                 transform: `rotate(${360 * (percentage/100)}deg)` 
             }}
          />
        </svg>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[8px] font-mono text-white/20">{(percentage).toFixed(0)}</span>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (tooltip) {
      return <Tooltip text={tooltip}>{content}</Tooltip>;
  }

  return content;
});
