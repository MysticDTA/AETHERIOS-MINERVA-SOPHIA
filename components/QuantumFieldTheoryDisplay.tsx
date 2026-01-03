import React from 'react';

const equationText = `Z = \u222B D[g] D[\u03C8] D[\u03C6] D[A] 
exp{ i/\u210F \u222B d\u2074x \u221A(-g) [ 
(1/16\u03C0G) R 
- 1/4 F_{\u03BC\u03BD} F^{\u03BC\u03BD} 
+ \u03C8\u0304 (i\u03B3^\u03BC D_\u03BC - m) \u03C8 
+ (D_\u03BC \u03C6)\u2020 (D^\u03BC \u03C6) - V(\u03C6) 
] }`;

export const QuantumFieldTheoryDisplay: React.FC = () => {
    return (
        <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-orbitron text-md text-warm-grey">Core Generative Equation</h3>
                <p className="font-orbitron font-bold text-md text-gold animate-pulse">
                    INTEGRATING...
                </p>
            </div>
            <div className="bg-black/30 rounded p-3 font-mono text-sm text-green-300 overflow-x-auto">
                <pre
                    style={{ textShadow: '0 0 5px rgba(110, 231, 183, 0.5)' }}
                >
                    {equationText}
                </pre>
            </div>
            <div className="mt-2 text-center text-xs text-slate-500">
                <p>Field Integration Status: HARMONIC</p>
            </div>
        </div>
    );
};