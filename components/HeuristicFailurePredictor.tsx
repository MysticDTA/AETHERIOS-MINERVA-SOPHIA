
import React from 'react';
import { FailurePrediction } from '../types';
import { Tooltip } from './Tooltip';

interface HeuristicFailurePredictorProps {
    prediction: FailurePrediction | null;
    isLoading: boolean;
    onFix?: () => void;
}

export const HeuristicFailurePredictor: React.FC<HeuristicFailurePredictorProps> = ({ prediction, isLoading, onFix }) => {
    if (!prediction) return (
        <div className="bg-black/20 border border-white/5 p-4 rounded-lg flex flex-col items-center justify-center h-full opacity-30 italic text-[10px] text-warm-grey uppercase tracking-widest min-h-[220px]">
            <div className={`w-8 h-8 border-2 border-slate-700 rounded-full mb-3 ${isLoading ? 'border-t-gold animate-spin' : ''}`} />
            {isLoading ? 'Calibrating Forecast...' : 'Awaiting Data Intercept'}
        </div>
    );

    const isHighRisk = prediction.probability > 0.4 || prediction.severity === 'CRITICAL';
    const isImminent = prediction.probability > 0.7 || prediction.estTimeToDecoherence.toLowerCase().includes('min') || prediction.estTimeToDecoherence.toLowerCase().includes('hour');
    const trendColor = prediction.forecastTrend === 'ASCENDING' ? 'text-rose-400' : 'text-green-400';

    return (
        <div className={`p-5 rounded-lg backdrop-blur-xl relative overflow-hidden group transition-all duration-700 h-full flex flex-col ${
            isImminent && isHighRisk
            ? 'bg-rose-950/30 border border-rose-500 shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-pulse-slow' 
            : 'bg-[#0a0a0a]/60 border border-white/10'
        }`}>
            {isImminent && isHighRisk && (
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(220,38,38,0.05)_10px,rgba(220,38,38,0.05)_20px)] pointer-events-none" />
            )}
            
            <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-4xl uppercase font-bold tracking-tighter select-none pointer-events-none">FORECAST</div>
            
            <div className={`flex justify-between items-start mb-6 z-10 border-b pb-3 ${isImminent ? 'border-rose-500/30' : 'border-white/10'}`}>
                <div className="flex flex-col gap-1">
                    <h3 className={`font-orbitron text-[10px] uppercase tracking-[0.3em] font-bold ${isImminent ? 'text-rose-300' : 'text-warm-grey'}`}>
                        {isImminent ? '⚠️ IMMINENT FAILURE ALERT' : 'Causal Failure Forecast'}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-green-500 shadow-[0_0_8px_#10b981]'}`} />
                        <Tooltip text="Overall system stability classification based on aggregated entropy metrics.">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest cursor-help">System_Stability: {prediction.severity}</span>
                        </Tooltip>
                    </div>
                </div>
                <div className="text-right">
                    <Tooltip text="The calculated probability of a critical decoherence event occurring within the next cycle.">
                        <span className={`font-orbitron text-xl font-bold cursor-help ${isHighRisk ? 'text-rose-400' : 'text-pearl'}`}>
                            {(prediction.probability * 100).toFixed(0)}%
                        </span>
                    </Tooltip>
                    <p className="text-[8px] font-mono text-slate-600 uppercase">Prob_Collapse</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
                <div className="space-y-4">
                    <p className={`text-[12px] font-minerva italic leading-relaxed ${isImminent ? 'text-rose-100 font-bold' : 'text-pearl/90'}`}>
                        "Probability of decoherence event is <span className={trendColor}>{prediction.forecastTrend.toLowerCase()}</span>. Primary risk factor: <span className={isImminent ? 'text-rose-400' : 'text-gold font-bold'}>{prediction.primaryRiskFactor}</span>."
                    </p>
                    
                    <div className={`p-3 rounded flex items-center justify-between ${isImminent ? 'bg-rose-500/20 border border-rose-500/40' : 'bg-white/5 border border-white/10'}`}>
                         <div className="flex flex-col gap-0.5">
                            <Tooltip text="Estimated time until the system reaches an irreversible state of causal fragmentation.">
                                <span className={`text-[8px] uppercase font-bold cursor-help ${isImminent ? 'text-rose-300' : 'text-slate-500'}`}>Est_Time_To_Decoherence</span>
                            </Tooltip>
                            <span className={`font-orbitron text-sm tracking-widest ${isImminent ? 'text-white' : 'text-pearl'}`}>{prediction.estTimeToDecoherence}</span>
                         </div>
                         <div className={`w-10 h-10 border rounded flex items-center justify-center ${isImminent ? 'border-rose-500/50 bg-rose-900/40' : 'border-white/10'}`}>
                            <svg className={`w-5 h-5 ${trendColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {prediction.forecastTrend === 'ASCENDING' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                                )}
                            </svg>
                         </div>
                    </div>
                </div>

                <div className={`p-3 rounded border ${isImminent ? 'bg-rose-950/40 border-rose-500/40' : 'bg-rose-900/10 border-rose-500/20'}`}>
                    <p className="text-[9px] font-mono text-rose-300 tracking-tighter uppercase mb-1">Recommended Intervention</p>
                    <p className="text-[10px] text-pearl/80 leading-relaxed italic">"{prediction.recommendedIntervention}"</p>
                </div>
            </div>

            {onFix && (
                <button 
                    onClick={onFix}
                    className={`w-full mt-4 py-3 font-orbitron text-[10px] uppercase tracking-[0.2em] transition-all rounded-sm shadow-lg active:scale-95 group relative overflow-hidden ${isImminent ? 'bg-rose-600/20 border border-rose-500 text-rose-300 hover:bg-rose-600 hover:text-white' : 'bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-black'}`}
                >
                    <span className="relative z-10 font-bold">{isImminent ? 'EMERGENCY_OVERRIDE' : 'EXECUTE_INTERVENTION'}</span>
                    <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ${isImminent ? 'bg-rose-500/20' : 'bg-gold/20'}`} />
                </button>
            )}

            <div className="mt-6 pt-3 border-t border-white/5 text-[8px] font-mono text-slate-600 uppercase tracking-widest flex justify-between">
                <span>Ref: Minerva_Predict_v4.1</span>
                <span>Entropy_Delta: +0.004Ψ</span>
            </div>
            
            <style>{`
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; border-color: rgba(244, 63, 94, 0.6); }
                    50% { opacity: 0.95; border-color: rgba(244, 63, 94, 0.3); }
                }
            `}</style>
        </div>
    );
};
