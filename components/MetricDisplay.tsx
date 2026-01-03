
import React from 'react';

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
  // Safety check for division by zero
  const safeMaxValue = maxValue === 0 ? 1 : maxValue;
  const percentage = Math.max(0, Math.min(100, (value / safeMaxValue) * 100));
  
  const getFormattedValue = () => {
    switch (formatAs) {
      case 'percent':
        return `${(value * 100).toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(4);
      case 'integer':
        return Math.round(value).toString();
      default:
        return value.toString();
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
        className={`bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg flex items-center justify-between border-glow-rose backdrop-blur-sm relative overflow-hidden group transition-all hover:bg-dark-surface/80 ${className} ${showSuccessIndicator ? 'scan-success-flash' : ''}`}
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-valuetext={getFormattedValue()}
    >
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id={`grid-${label.replace(/\s/g, '')}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-${label.replace(/\s/g, '')})`} />
        <rect width="100%" height="2" fill="white" opacity="0.2" style={{ animation: 'scanline-sweep 3s linear infinite' }} />
      </svg>

      <div className="flex-1 z-10 min-w-0 pr-2">
        <p className="text-[9px] text-warm-grey uppercase tracking-[0.25em] mb-2 truncate font-bold group-hover:text-pearl transition-colors" id={`metric-label-${label}`} title={label}>{label}</p>
        <div className="flex flex-wrap items-baseline gap-x-2">
            <p 
            className="font-orbitron text-3xl sm:text-4xl font-bold transition-colors duration-500 leading-none"
            style={{ color: textColor }}
            >
            {getFormattedValue()}
            </p>
            {secondaryValue && (
                <p className={`font-orbitron text-xs font-bold pb-0.5 transition-colors duration-500 whitespace-nowrap ${
                    secondaryValue.startsWith('-') ? 'text-rose-400' : 'text-green-400'
                }`}>
                    {secondaryValue}
                </p>
            )}
        </div>
      </div>
      
      <div className="w-16 h-16 sm:w-20 sm:h-20 relative z-10 flex-shrink-0" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-slate-800/50"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius + 4}
            cx="60"
            cy="60"
          />
          <circle
            className="text-slate-800/30"
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
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', filter: `drop-shadow(0 0 8px ${strokeColor})` }}
          />
        </svg>
        {showSuccessIndicator && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              className="w-10 h-10 text-green-400 opacity-0"
              style={{ animation: 'checkmark-in-out 1.5s ease-in-out' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanline-sweep {
            from { transform: translateY(-100%); }
            to { transform: translateY(500%); }
        }
      `}</style>
    </div>
  );
});
