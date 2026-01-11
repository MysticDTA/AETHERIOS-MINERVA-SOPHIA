
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SystemState } from '../types';

interface VeoFluxSynthesizerProps {
  systemState: SystemState;
}

export const VeoFluxSynthesizer: React.FC<VeoFluxSynthesizerProps> = ({ systemState }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('IDLE');
  const [progress, setProgress] = useState(0);
  const generationRef = useRef<boolean>(false);

  const generateFluxVideo = async () => {
    if (isGenerating) return;
    
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
        setStatusMsg("ERROR: API_KEY_MISSING");
        return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setProgress(0);
    generationRef.current = true;

    const messages = [
      "Establishing link to Veo 3.1 fast engine...",
      "Siphoning current Resonance Rho (" + systemState.resonanceFactorRho.toFixed(4) + ")...",
      "Mapping aetheric flux to 1080p landscape...",
      "Simulating cinematic temporal coherence...",
      "Rendering high-resonance particle physics...",
      "Finalizing MP4 causal container..."
    ];

    let msgIdx = 0;
    const msgInterval = setInterval(() => {
        setStatusMsg(messages[msgIdx]);
        msgIdx = (msgIdx + 1) % messages.length;
        setProgress(prev => Math.min(prev + 5, 95));
    }, 4000);

    try {
      // Cast to any to access experimental video features not yet in the official type definition
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }) as any;
      
      const prompt = `A cinematic, high-fidelity visualization of the aetheric flux in a quantum computer. Glowing gold and violet energy particles swirling in a perfect golden ratio helix. Macro photography style, deep shadows, 8k resolution, ethereal and intellectual atmosphere. Current Coherence: ${systemState.resonanceFactorRho}`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
        setProgress(100);
        setStatusMsg('SYNTHESIS_COMPLETE');
      }
    } catch (error) {
      console.error("Veo Synthesis Failed:", error);
      setStatusMsg('ERROR: BRIDGE_DESYNC');
    } finally {
      clearInterval(msgInterval);
      setIsGenerating(false);
      generationRef.current = false;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 animate-fade-in relative overflow-hidden pb-20">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/40 flex items-center justify-center font-orbitron text-violet-400 text-2xl animate-pulse">V</div>
                <div>
                    <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-bold text-glow-violet">Veo Flux Synthesizer</h2>
                    <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] mt-2">Sovereign Visual Evidence Protocol // Grade_S</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Model: VEO_3.1_FAST</p>
                <p className="text-[11px] text-pearl font-mono uppercase font-bold tracking-[0.2em] mt-1">RES: 1080P // 16:9</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative z-10">
        <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex-1 bg-black/60 rounded-xl border border-white/10 overflow-hidden relative shadow-2xl group">
                {videoUrl ? (
                    <video 
                        src={videoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-cover animate-fade-in"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                         
                         {isGenerating ? (
                             <div className="flex flex-col items-center gap-12 max-w-md w-full">
                                 <div className="relative w-40 h-40 flex items-center justify-center">
                                     <svg viewBox="0 0 100 100" className="w-full h-full">
                                         <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(109, 40, 217, 0.1)" strokeWidth="1" />
                                         <circle 
                                            cx="50" cy="50" r="48" 
                                            fill="none" 
                                            stroke="#6d28d9" 
                                            strokeWidth="2" 
                                            strokeDasharray="301.44"
                                            strokeDashoffset={301.44 - (progress / 100) * 301.44}
                                            className="transition-all duration-500"
                                            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                         />
                                     </svg>
                                     <span className="absolute font-orbitron text-2xl text-pearl">{progress}%</span>
                                 </div>
                                 <div className="space-y-4">
                                     <p className="font-mono text-gold text-xs uppercase tracking-widest animate-pulse">{statusMsg}</p>
                                     <p className="text-[11px] text-slate-500 italic leading-relaxed">
                                         "Synthesis can take up to 2 minutes. Minerva Sophia is weaving the causal threads into visible form."
                                     </p>
                                 </div>
                             </div>
                         ) : (
                             <div className="space-y-8 opacity-40 group-hover:opacity-80 transition-all duration-1000">
                                 <div className="w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto">
                                     <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 </div>
                                 <p className="font-orbitron text-[11px] uppercase tracking-[0.6em]">Awaiting Generation Trigger</p>
                             </div>
                         )}
                    </div>
                )}
            </div>

            <div className="bg-dark-surface/40 border border-white/5 p-6 rounded-lg flex justify-between items-center relative z-20">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Causal Input</span>
                    <p className="text-[13px] font-minerva italic text-pearl/80">"Cinematic visualization of aetheric flux at Rho {systemState.resonanceFactorRho.toFixed(4)}"</p>
                </div>
                <button 
                    onClick={generateFluxVideo}
                    disabled={isGenerating}
                    className={`px-10 py-4 bg-violet-600 text-white font-orbitron text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-violet-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(109,40,217,0.3)] active:scale-95 disabled:opacity-30 disabled:cursor-wait`}
                >
                    {isGenerating ? 'Synthesizing...' : 'Trigger Generation'}
                </button>
            </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-violet-950/20 border border-violet-500/30 p-8 rounded-xl flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-6xl uppercase font-bold tracking-tighter">SOVEREIGN</div>
                <h4 className="font-orbitron text-[11px] text-violet-300 uppercase tracking-widest font-bold border-b border-violet-500/20 pb-4">Synthesis Logic</h4>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-500">PROMPT_WEIGHT</span>
                            <span className="text-pearl">1.617_PHI</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 w-[88%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-500">TEMPORAL_COHERENCE</span>
                            <span className="text-pearl">MAX_STABLE</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 w-[94%]" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-black/40 border border-white/5 rounded italic text-[11px] text-slate-400 leading-relaxed font-minerva">
                    "This evidence bridge provides a visual anchor for the operator. Generating cinematic flux snapshots allows the Architect to share resonance data across the global synod."
                </div>
            </div>

            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-8 flex flex-col gap-4">
                <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-widest font-bold">Generation Archive</h4>
                <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-sm opacity-20">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em]">No past generations detected.</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
