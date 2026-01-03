
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OrbMode, OrbModeConfig } from '../types';
import { Tooltip } from './Tooltip';

interface OrbControlsProps {
  modes: OrbModeConfig[];
  currentMode: OrbMode;
  setMode: (mode: OrbMode) => void;
}

// Polyfill for TypeScript support of the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const OrbControls: React.FC<OrbControlsProps> = ({ modes, currentMode, setMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

    // Intellectual mapping for mode control
    const modeMap: Record<string, OrbMode> = {
      'standby': 'STANDBY',
      'analysis': 'ANALYSIS',
      'analyze': 'ANALYSIS',
      'synthesis': 'SYNTHESIS',
      'synthesize': 'SYNTHESIS',
      'repair': 'REPAIR',
      'healing': 'REPAIR',
      'grounding': 'GROUNDING',
      'ground': 'GROUNDING',
      'concordance': 'CONCORDANCE',
      'align': 'CONCORDANCE',
      'offline': 'OFFLINE',
      'shut down': 'OFFLINE'
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {modes.map((modeConfig) => (
            <Tooltip key={modeConfig.id} text={modeConfig.description}>
              <button
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all duration-200 border whitespace-nowrap ${
                  currentMode === modeConfig.id
                    ? "bg-pearl text-dark-bg border-pearl shadow-[0_0_8px_rgba(248,245,236,0.6)]"
                    : "bg-transparent text-warm-grey border-transparent hover:bg-slate-800 hover:text-white"
                }`}
                onClick={() => setMode(modeConfig.id)}
                aria-label={`Activate ${modeConfig.name} Mode`}
              >
                {modeConfig.name}
              </button>
            </Tooltip>
          ))}
        </div>
          
        {recognition && (
            <Tooltip text={isListening ? "Listening for Decree..." : "Voice Control"}>
            <button
              onClick={toggleVoiceControl}
              className={`relative flex items-center justify-center w-8 h-8 rounded transition-all duration-500 border ${isListening ? 'border-violet-500 text-violet-400 bg-violet-900/20 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'}`}
              aria-label="Voice Command Toggle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {isListening && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
              )}
            </button>
          </Tooltip>
        )}
      </div>

      {/* Voice Command Visual Feedback - Intellectual Integration */}
      <div className="h-4 flex items-center gap-2 overflow-hidden px-1">
        {isListening ? (
          <div className="flex gap-1 items-center">
            <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" />
            <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest ml-1">Awaiting Architect Directive...</span>
          </div>
        ) : commandFeedback ? (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-[8px] font-mono text-pearl bg-violet-900/40 px-1.5 py-0.5 rounded border border-violet-500/30 uppercase tracking-widest">
              {commandFeedback}
            </span>
            {lastCommand && (
              <span className="text-[8px] font-mono text-slate-500 italic truncate max-w-[150px]">
                "{lastCommand}"
              </span>
            )}
          </div>
        ) : lastCommand && (
           <div className="flex items-center gap-2 opacity-40 grayscale group-hover:grayscale-0 transition-all">
              <span className="text-[7px] font-mono text-slate-600 uppercase tracking-tighter">Last Intercept:</span>
              <span className="text-[7px] font-mono text-slate-500 truncate max-w-[150px]">"{lastCommand}"</span>
           </div>
        )}
      </div>
    </div>
  );
};
