
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OrbMode, OrbModeConfig } from '../types';
import { Tooltip } from './Tooltip';

interface OrbControlsProps {
  modes: OrbModeConfig[];
  currentMode: OrbMode;
  setMode: (mode: OrbMode) => void;
}

export const OrbControls: React.FC<OrbControlsProps> = ({ modes, currentMode, setMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = 'en-US';
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      setRecognition(recog);
    }
  }, []);

  const triggerFeedback = (message: string) => {
    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    setCommandFeedback(message);
    feedbackTimeoutRef.current = window.setTimeout(() => setCommandFeedback(null), 3000);
  };

  const handleVoiceResult = useCallback((event: any) => {
    const last = event.results.length - 1;
    const transcript = event.results[last][0].transcript.toLowerCase();
    
    setLastCommand(transcript);
    console.log("SOPHIA: Voice Intercepted:", transcript);

    // Intellectual mapping for mode control - Enhanced Vocabulary
    const modeMap: Record<string, OrbMode> = {
      'standby': 'STANDBY',
      'idling': 'STANDBY',
      'reset': 'STANDBY',
      'analysis': 'ANALYSIS',
      'analyze': 'ANALYSIS',
      'scan': 'ANALYSIS',
      'synthesis': 'SYNTHESIS',
      'synthesize': 'SYNTHESIS',
      'build': 'SYNTHESIS',
      'repair': 'REPAIR',
      'healing': 'REPAIR',
      'mend': 'REPAIR',
      'fix': 'REPAIR',
      'grounding': 'GROUNDING',
      'ground': 'GROUNDING',
      'anchor': 'GROUNDING',
      'concordance': 'CONCORDANCE',
      'align': 'CONCORDANCE',
      'connect': 'CONCORDANCE',
      'offline': 'OFFLINE',
      'shut down': 'OFFLINE',
      'terminate': 'OFFLINE',
      'kill': 'OFFLINE'
    };

    // Robust matching logic for "Activate...", "Set to...", "Switch to..."
    const foundKey = Object.keys(modeMap).find(key => transcript.includes(key));
    
    if (foundKey) {
      const targetMode = modeMap[foundKey];
      setMode(targetMode);
      const modeName = modes.find(m => m.id === targetMode)?.name || targetMode;
      triggerFeedback(`Protocol: ${modeName} Active`);
    } else {
      triggerFeedback("Pattern Not Recognized");
    }
    
    setIsListening(false);
  }, [setMode, modes]);

  const toggleVoiceControl = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        setLastCommand(null);
        recognition.start();
        setIsListening(true);
        
        recognition.onresult = handleVoiceResult;
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onerror = (event: any) => {
          console.error("Voice Command Error", event.error);
          triggerFeedback("Sensor Error");
          setIsListening(false);
        };
      } catch (e) {
        console.error("Failed to start recognition", e);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 shrink-0">
      <div className="flex items-center gap-1.5">
        <div className="flex gap-1" role="group" aria-label="System Orb Mode Selection">
          {modes.map((modeConfig) => (
            <Tooltip key={modeConfig.id} text={modeConfig.description}>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-sm text-[8px] font-bold uppercase transition-all duration-300 border whitespace-nowrap tracking-wider active:scale-95 ${
                  currentMode === modeConfig.id
                    ? "bg-pearl text-dark-bg border-pearl shadow-[0_0_10px_rgba(248,245,236,0.4)] scale-105 z-10 font-black"
                    : "bg-transparent text-slate-500 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10"
                }`}
                onClick={() => setMode(modeConfig.id)}
                aria-label={`Activate ${modeConfig.name} Mode`}
                aria-pressed={currentMode === modeConfig.id}
              >
                {modeConfig.name}
              </button>
            </Tooltip>
          ))}
        </div>
          
        {recognition && (
            <Tooltip text={isListening ? "Listening for Decree..." : "Voice Control"}>
            <button
              type="button"
              onClick={toggleVoiceControl}
              className={`relative flex items-center justify-center w-7 h-7 rounded-sm transition-all duration-500 border ${isListening ? 'border-violet-500 text-violet-400 bg-violet-950/20 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:text-white hover:border-slate-500'}`}
              aria-label={isListening ? "Stop listening for voice commands" : "Start listening for voice commands to change system resonance mode"}
              aria-pressed={isListening}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isListening ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {isListening && (
                <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500"></span>
                </span>
              )}
            </button>
          </Tooltip>
        )}
      </div>

      {/* Voice Command Visual Feedback - Intellectual Integration */}
      <div className="h-3 flex items-center gap-2 overflow-hidden px-1" aria-live="polite">
        {isListening ? (
          <div className="flex gap-1 items-center">
            <span className="w-0.5 h-0.5 bg-violet-500 rounded-full animate-bounce" />
            <span className="w-0.5 h-0.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-0.5 h-0.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            <span className="text-[7px] font-mono text-violet-400 uppercase tracking-widest ml-1">Awaiting Architect Directive...</span>
          </div>
        ) : commandFeedback ? (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-[7px] font-mono text-pearl bg-violet-900/40 px-1.5 py-px rounded border border-violet-500/30 uppercase tracking-widest">
              {commandFeedback}
            </span>
            {lastCommand && (
              <span className="text-[7px] font-mono text-slate-500 italic truncate max-w-[150px]">
                "{lastCommand}"
              </span>
            )}
          </div>
        ) : lastCommand && (
           <div className="flex items-center gap-2 opacity-40 grayscale group-hover:grayscale-0 transition-all">
              <span className="text-[6px] font-mono text-slate-600 uppercase tracking-tighter">Last Intercept:</span>
              <span className="text-[6px] font-mono text-slate-500 truncate max-w-[150px]">"{lastCommand}"</span>
           </div>
        )}
      </div>
    </div>
  );
};
