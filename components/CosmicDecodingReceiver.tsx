
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { SystemState } from '../types';
import { decode, decodeAudioData } from './audio/liveUtils';

interface CosmicDecodingReceiverProps {
  transmission: any; 
  systemState: SystemState;
}

const FrequencyWaterfall: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const [lines, setLines] = useState<{ id: number, points: string, opacity: number }[]>([]);
    
    useEffect(() => {
        if (!isActive) {
            setLines([]);
            return;
        }

        const interval = setInterval(() => {
            const width = 200;
            let points = "";
            for (let x = 0; x <= width; x += 5) {
                // Simulating noise vs signal spikes
                const y = (Math.random() > 0.95) ? Math.random() * 15 : Math.random() * 5;
                points += `${x},${y} `;
            }
            const newLine = { id: Date.now(), points, opacity: 1 };
            setLines(prev => [newLine, ...prev].slice(0, 20));
        }, 100);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="absolute inset-0 flex flex-col gap-0 overflow-hidden pointer-events-none opacity-20">
            {lines.map((line, i) => (
                <svg key={line.id} viewBox="0 0 200 15" className="w-full h-4 overflow-visible transition-all duration-[3s] ease-linear" style={{ transform: `translateY(${i * 10}px)`, opacity: 1 - (i / 20) }}>
                    <polyline points={line.points} fill="none" stroke="var(--gold)" strokeWidth="0.5" />
                </svg>
            ))}
        </div>
    );
};

export const CosmicDecodingReceiver: React.FC<CosmicDecodingReceiverProps> = ({ transmission, systemState }) => {
    const { source, message, decodedCharacters, status, frequency, realWorldMetric } = transmission;
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const displayedMessage = message.substring(0, decodedCharacters);
    
    const isActiveSignal = status === 'RECEIVING...' || status === 'DECODING...' || status === 'TRANSMISSION COMPLETE';

    const handleSynthesize = async () => {
        if (!message) return;
        setIsSynthesizing(true);
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            // For real data, we use a professional, clear voice
            const prompt = `Speak this scientific telemetry data clearly and authoritatively: ${message}`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: prompt }] }],
                config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
                const buffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                setAudioBuffer(buffer);
            }
        } catch (e) { console.error(e); } finally { setIsSynthesizing(false); }
    };

    const handlePlayAudio = () => {
        if (!audioBuffer || !audioContextRef.current || isPlaying) return;
        const sourceNode = audioContextRef.current.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(audioContextRef.current.destination);
        sourceNode.onended = () => setIsPlaying(false);
        sourceNode.start();
        setIsPlaying(true);
    };

    const handleAstrophysicalAnalysis = async () => {
        if (!message) return;
        setIsAnalyzing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Perform an astrophysical interpretation of this data: "${message}". Explain the real-world implications for terrestrial communications or orbital safety. Max 40 words.`;
            const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
            setAnalysisResult(response.text || null);
        } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
    };

    return (
        <div className="w-full h-full bg-[#0a0c0f] border border-white/10 p-8 rounded-b-lg backdrop-blur-3xl flex flex-col relative overflow-hidden group">
            <FrequencyWaterfall isActive={isActiveSignal} />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                        <span className="text-[8px] font-mono text-gold uppercase tracking-[0.4em] font-bold">Deep Space Telemetry Source</span>
                    </div>
                    <h3 className="font-orbitron text-2xl text-pearl tracking-tighter uppercase font-black pl-3.5">
                        {status === 'AWAITING SIGNAL' ? 'SCANNING_SPECTRUM...' : source}
                    </h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[12px] font-mono text-pearl font-bold">{frequency.toFixed(3)} <span className="opacity-50 text-[10px]">GHz</span></span>
                    <div className="w-40 h-1 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                        <div className={`h-full bg-gold transition-all duration-500 ${isActiveSignal ? 'w-full shadow-[0_0_10px_gold]' : 'w-0'}`} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 relative z-10">
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white/[0.02] border border-white/10 rounded p-6 flex flex-col gap-4 shadow-inner hover:border-gold/20 transition-all">
                         <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Scientific Metric</span>
                            <span className="text-[9px] text-green-500 font-mono font-bold bg-green-950/30 px-2 py-0.5 rounded">STABLE</span>
                         </div>
                         <div className="flex flex-col items-center justify-center py-4">
                            <span className="text-[9px] text-slate-500 uppercase mb-2 tracking-widest">Current State</span>
                            <span className="text-3xl font-orbitron text-pearl text-glow-pearl font-black">{realWorldMetric || '---'}</span>
                         </div>
                    </div>
                    
                    <div className="bg-white/[0.02] p-6 rounded border border-white/10 flex-1">
                        <h4 className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-4 border-b border-white/5 pb-2">Live Feed Parity</h4>
                        <div className="space-y-4">
                             <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-slate-500">SNR Ratio:</span>
                                <span className="text-pearl font-bold">32.4 dB</span>
                             </div>
                             <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-slate-500">Doppler Offset:</span>
                                <span className="text-pearl font-bold">+0.0024</span>
                             </div>
                             <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-slate-500">Packet Loss:</span>
                                <span className="text-green-500 font-bold">0.00%</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 bg-black/80 rounded border border-white/10 p-8 font-mono text-gold text-lg overflow-y-auto shadow-inner relative flex flex-col leading-loose selection:bg-gold selection:text-black">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-orbitron text-7xl font-black pointer-events-none">RX</div>
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                             <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Downlink Terminal [REAL-TIME]</span>
                             <span className="text-[9px] text-slate-600 font-bold">TIMESTAMP: {new Date().toLocaleTimeString()}</span>
                        </div>
                        <p className="relative z-10 text-pearl/90 font-medium">
                            {displayedMessage}
                            {status === 'DECODING...' && <span className="inline-block w-2.5 h-5 bg-gold ml-1 animate-pulse align-middle shadow-[0_0_10px_gold]" />}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {status === 'TRANSMISSION COMPLETE' && (
                            <>
                                <button 
                                    onClick={audioBuffer ? handlePlayAudio : handleSynthesize} 
                                    disabled={isSynthesizing} 
                                    className="flex-1 py-4 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[10px] tracking-[0.2em] font-bold hover:bg-gold hover:text-black transition-all rounded-sm uppercase active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                                >
                                    {isSynthesizing ? 'Buffering Voice...' : audioBuffer ? 'Play Sonic Report' : 'Synthesize Telemetry Audio'}
                                </button>
                                <button 
                                    onClick={handleAstrophysicalAnalysis} 
                                    disabled={isAnalyzing} 
                                    className="flex-1 py-4 bg-blue-900/20 border border-blue-500/40 text-blue-300 font-orbitron text-[10px] tracking-[0.2em] font-bold hover:bg-blue-600 hover:text-white transition-all rounded-sm uppercase active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                                >
                                    {isAnalyzing ? 'Analyzing Physics...' : 'Interpretation Scan'}
                                </button>
                            </>
                        )}
                    </div>

                    {analysisResult && (
                        <div className="p-5 bg-blue-950/20 border border-blue-500/30 rounded font-mono text-[11px] text-pearl/90 italic animate-fade-in shadow-lg">
                            <span className="text-blue-400 font-black mr-2 uppercase tracking-wider not-italic">[ASTROPHYSICAL_IMPLICATION]</span>
                            {analysisResult}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
