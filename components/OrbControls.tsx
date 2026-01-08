
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

  // Dedicated function to parse voice commands into modes
  const processVoiceCommand = (transcript: string): OrbMode | null => {
    const lower = transcript.toLowerCase();

    // 1. Direct Mode Names (Highest Priority)
    // Checks for presence of the mode name itself (e.g. "Activate Analysis", "Set to Analysis")
    if (lower.includes('analysis')) return 'ANALYSIS';
    if (lower.includes('standby')) return 'STANDBY';
    if (lower.includes('synthesis')) return 'SYNTHESIS';
    if (lower.includes('repair')) return 'REPAIR';
    if (lower.includes('grounding')) return 'GROUNDING';
    if (lower.includes('concordance')) return 'CONCORDANCE';
    if (lower.includes('offline')) return 'OFFLINE';

    // 2. Intellectual mapping for aliases (Secondary Priority)
    const modeMap: Record<string, OrbMode> = {
      'scan': 'ANALYSIS', 'examine': 'ANALYSIS', 'investigate': 'ANALYSIS',
      'idling': 'STANDBY', 'reset': 'STANDBY', 'wait': 'STANDBY',
      'build': 'SYNTHESIS', 'create': 'SYNTHESIS', 'generate': 'SYNTHESIS',
      'fix': 'REPAIR', 'heal': 'REPAIR', 'mend': 'REPAIR', 'restore': 'REPAIR',
      'anchor': 'GROUNDING', 'discharge': 'GROUNDING', 'earth': 'GROUNDING',
      'align': 'CONCORDANCE', 'connect': 'CONCORDANCE', 'link': 'CONCORDANCE', 'harmonize': 'CONCORDANCE',
      'shut down': 'OFFLINE', 'terminate': 'OFFLINE', 'kill': 'OFFLINE', 'sleep': 'OFFLINE'
    };

    const foundKey = Object.keys(modeMap).find(key => lower.includes(key));
    return foundKey ? modeMap[foundKey] : null;
  };

  const handleVoiceResult = useCallback((event: any) => {
    const last = event.results.length - 1;
    const transcript = event.results[last][0].transcript;
    
    setLastCommand(transcript);
    console.log("SOPHIA: Voice Intercepted:", transcript);

    const targetMode = processVoiceCommand(transcript);
    
    if (targetMode) {
      setMode(targetMode);
      const modeName = modes.find(m => m.id === targetMode)?.name || targetMode;
      triggerFeedback(`Protocol: ${modeName} Active`);
    } else {
      triggerFeedback("Unrecognized Decree");
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
    <div className="flex flex-col gap-0.5 shrink-0 bg-white/[0.02] border border-white/5 p-1 rounded-[2px] transition-colors hover:border-white/10">
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5" role="group" aria-label="System Orb Mode Selection">
          {modes.map((modeConfig) => (
            <Tooltip key={modeConfig.id} text={modeConfig.description}>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-[1px] text-[9px] font-bold uppercase transition-all duration-300 border whitespace-nowrap tracking-wider active:scale-95 ${
                  currentMode === modeConfig.id
                    ? "bg-pearl text-dark-bg border-pearl shadow-[0_0_8px_rgba(248,245,236,0.3)] scale-105 z-10 font-black"
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
            <Tooltip text={isListening ? "Listening for Decree..." : "Voice Control Protocol"}>
            <button
              type="button"
              onClick={toggleVoiceControl}
              className={`relative flex items-center justify-center w-6 h-6 rounded-[1px] transition-all duration-500 border ${isListening ? 'border-violet-500 text-violet-400 bg-violet-950/20 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:text-white hover:border-slate-500'}`}
              aria-label={isListening ? "Stop listening for voice commands" : "Start listening for voice commands"}
              aria-pressed={isListening}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${isListening ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {isListening && (
                <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-1 w-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-violet-500"></span>
                </span>
              )}
            </button>
          </Tooltip>
        )}
      </div>

      {/* Voice Command Visual Feedback - High Density */}
      <div className="h-2.5 flex items-center gap-1.5 overflow-hidden px-0.5" aria-live="polite">
        {isListening ? (
          <div className="flex gap-0.5 items-center">
            <span className="w-0.5 h-0.5 bg-violet-500 rounded-full animate-bounce" />
            <span className="w-0.5 h-0.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-0.5 h-0.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            <span className="text-[5px] font-mono text-violet-400 uppercase tracking-widest ml-1 opacity-80">Receiving...</span>
          </div>
        ) : commandFeedback ? (
          <div className="flex items-center gap-1 animate-fade-in">
            <span className="text-[5px] font-mono text-pearl bg-violet-900/40 px-1 py-px rounded border border-violet-500/30 uppercase tracking-widest">
              {commandFeedback}
            </span>
            {lastCommand && (
              <span className="text-[5px] font-mono text-slate-500 italic truncate max-w-[100px] opacity-60">
                "{lastCommand}"
              </span>
            )}
          </div>
        ) : lastCommand ? (
           <div className="flex items-center gap-1 opacity-40 grayscale group-hover:grayscale-0 transition-all">
              <span className="text-[5px] font-mono text-slate-600 uppercase tracking-tighter">Prev:</span>
              <span className="text-[5px] font-mono text-slate-500 truncate max-w-[100px]">"{lastCommand}"</span>
           </div>
        ) : (
            <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-1 h-full bg-slate-800 animate-pulse" />
            </div>
        )}
      </div>
    </div>
  );
};
