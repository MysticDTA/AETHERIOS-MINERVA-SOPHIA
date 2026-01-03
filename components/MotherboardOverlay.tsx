import React, { useEffect, useState } from "react";
import { performanceService, PerformanceTier } from "../services/performanceService";

export const MotherboardOverlay: React.FC = React.memo(() => {
    const [tier, setTier] = useState<PerformanceTier>(performanceService.tier);
    useEffect(() => performanceService.subscribe(setTier), []);

    const strokeColor = "#e6c77f";
    const durationMultiplier = tier === 'LOW' ? 2 : 1;

    return (
      <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000 opacity-20`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="auditGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke={strokeColor} strokeWidth="0.05" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#auditGrid)" />
          
          <g opacity={tier === 'LOW' ? 0.05 : 0.15} stroke={strokeColor} fill="none" strokeWidth="0.1">
            <path d="M 0 20 L 15 20 L 20 25 L 40 25" />
            <path d="M 100 80 L 85 80 L 80 75 L 60 75" />
          </g>

          {tier !== 'LOW' && (
            <g>
                <circle r="0.4" fill={strokeColor} opacity="0.6">
                    <animateMotion dur={`${6 * durationMultiplier}s`} repeatCount="indefinite" path="M 0 20 L 15 20 L 20 25 L 40 25" />
                </circle>
                <circle r="0.4" fill={strokeColor} opacity="0.6">
                    <animateMotion dur={`${8 * durationMultiplier}s`} repeatCount="indefinite" path="M 100 80 L 85 80 L 80 75 L 60 75" />
                </circle>
            </g>
          )}
        </svg>
      </div>
    );
});