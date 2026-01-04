import React from 'react';
import { FailurePrediction } from '../types';
import { Tooltip } from './Tooltip';

interface HeuristicFailurePredictorProps {
    prediction: FailurePrediction | null;
    isLoading: boolean;
}

export const HeuristicFailurePredictor: React.FC<HeuristicFailurePredictorProps> = ({ prediction, isLoading }) => {
    if (!prediction) return (
        <div className="bg-black/20 border border-white/5 p-4 rounded-lg flex flex-col items-center justify-center h-full opacity-30 italic text-[10px] text-warm-grey uppercase tracking-widest">
            {isLoading ? 'Calibrating Forecast...' : 'Awaiting Data Intercept'}
        </div>
    );

    const isHighRisk = prediction.probability > 0.4 || prediction.severity === 'CRITICAL';
    const trendColor = prediction.forecastTrend === 'ASCENDING' ? 'text-rose-400' : 'text-green-400';

    return (
        <div className="bg-[#0a0a0a]/60 border border-white/10 p-5 rounded-lg backdrop-blur-xl relative overflow-hidden group transition-all duration-700 h-full flex flex-col">
            <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-4xl uppercase font-bold tracking-tighter select-none pointer-events-none">FORECAST</div>
            
            <div className="flex justify-between items-start mb-6 z-10 border-b border-white/10 pb-3">
                <div className="flex flex-col gap-1">
                    <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Causal Failure Forecast</h3>
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-green-500 shadow-[0_0_8px_#10b981]'}`} />
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">System_Stability: {prediction.severity}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`font-orbitron text-xl font-bold ${isHighRisk ? 'text-rose-400' : 'text-pearl'}`}>
                        {(prediction.probability * 100).toFixed(0)}%
                    </span>
                    <p className="text-[8px] font-mono text-slate-600 uppercase">Prob_Collapse</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
                <div className="space-y-4">
                    <p className="text-[12px] font-minerva italic text-pearl/90 leading-relaxed">
                        "Probability of decoherence event is <span className={trendColor}>{prediction.forecastTrend.toLowerCase()}</span>. Primary risk factor: <span className="text-gold font-bold">{prediction.primaryRiskFactor}</span>."
                    </p>
                    
                    <div className="bg-white/5 border border-white/10 p-3 rounded flex items-center justify-between">
                         <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-slate-500 uppercase font-bold">Est_Time_To_Decoherence</span>
                            <span className="font-orbitron text-sm text-pearl tracking-widest">{prediction.estTimeToDecoherence}</span>
                         </div>
                         <div className="w-10 h-10 border border-white/10 rounded flex items-center justify-center">
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

                <div className="bg-rose-900/10 border border-rose-500/20 p-3 rounded">
                    <p className="text-[9px] font-mono text-rose-300 tracking-tighter uppercase mb-1">Recommended Intervention</p>
                    <p className="text-[10px] text-pearl/80 leading-relaxed italic">"{prediction.recommendedIntervention}"</p>
                </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/5 text-[8px] font-mono text-slate-600 uppercase tracking-widest flex justify-between">
                <span>Ref: Minerva_Predict_v4.1</span>
                <span>Entropy_Delta: +0.004Ψ</span>
            </div>
        </div>
    );
};