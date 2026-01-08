
import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { LogType, OrbMode, VoiceInteraction } from '../../types';
import { encode, decode, decodeAudioData } from '../audio/liveUtils';
import { knowledgeBase } from '../../services/knowledgeBase';
import { audioAnalysisService } from '../../services/audioAnalysisService';

interface UseVoiceInterfaceProps {
    addLogEntry: (type: LogType, message: string) => void;
    systemInstruction: string;
    onSetOrbMode: (mode: OrbMode) => void;
}

const HISTORY_STORAGE_KEY = 'AETHER_VOICE_HISTORY';

const updateSystemModeDeclaration: FunctionDeclaration = {
    name: 'update_system_mode',
    parameters: {
        type: Type.OBJECT,
        description: 'Update the operational mode of the systems primary core (The Orb).',
        properties: {
            mode: {
                type: Type.STRING,
                description: 'The target operational mode.',
                enum: ['STANDBY', 'ANALYSIS', 'SYNTHESIS', 'REPAIR', 'GROUNDING', 'CONCORDANCE', 'OFFLINE']
            },
        },
        required: ['mode'],
    },
};

export const useVoiceInterface = ({ addLogEntry, systemInstruction, onSetOrbMode }: UseVoiceInterfaceProps) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [userInputTranscription, setUserInputTranscription] = useState('');
    const [sophiaOutputTranscription, setSophiaOutputTranscription] = useState('');
    const [transcriptionHistory, setTranscriptionHistory] = useState<VoiceInteraction[]>([]);
    const [lastSystemCommand, setLastSystemCommand] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    
    const sessionPromise = useRef<Promise<any> | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioSources = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTime = useRef(0);
    const currentTurnInputRef = useRef('');
    const currentTurnOutputRef = useRef('');

    // Handle initial hydration of history
    useEffect(() => {
        try {
            const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (saved) {
                setTranscriptionHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.warn("Vocal bridge history skipped.");
        }
        setIsHydrated(true);
    }, []);

    // Persist history changes after hydration
    useEffect(() => {
        if (!isHydrated) return;
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(transcriptionHistory));
    }, [transcriptionHistory, isHydrated]);

    const clearHistory = useCallback(() => {
        setTranscriptionHistory([]);
        addLogEntry(LogType.INFO, "Vocal Bridge: Transcription history cleared.");
    }, [addLogEntry]);

    const closeVoiceSession = useCallback(async () => {
        if (!isSessionActive && !sessionPromise.current) return;
        addLogEntry(LogType.SYSTEM, "Vocal Consciousness Buffer: Closing...");
        if (sessionPromise.current) {
            const session = await sessionPromise.current;
            session.close();
            sessionPromise.current = null;
        }
        
        audioAnalysisService.disconnect(); // Disconnect analysis

        mediaStream.current?.getTracks().forEach(track => track.stop());
        mediaStream.current = null;
        scriptProcessor.current?.disconnect();
        scriptProcessor.current = null;
        mediaStreamSource.current?.disconnect();
        mediaStreamSource.current = null;
        inputAudioContext.current?.close();
        outputAudioContext.current?.close();
        outputAudioSources.current.forEach(source => source.stop());
        outputAudioSources.current.clear();
        setIsSessionActive(false);
    }, [isSessionActive, addLogEntry]);

    const startVoiceSession = useCallback(async () => {
        if (isSessionActive) return;
        addLogEntry(LogType.SYSTEM, "Synchronizing ÆTHERIOS Vocal Bridge...");

        try {
            mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Connect to Analysis Service immediately for visual feedback
            audioAnalysisService.connectSource(mediaStream.current);

        } catch (error) {
            console.error("Microphone access denied:", error);
            addLogEntry(LogType.CRITICAL, "Vocal sensor acquisition failure.");
            return;
        }

        inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextStartTime.current = 0;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        sessionPromise.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            callbacks: {
                onopen: () => {
                    addLogEntry(LogType.INFO, "Vocal bridge locked. High-latency thinking active.");
                    setIsSessionActive(true);
                    if (!mediaStream.current || !inputAudioContext.current) return;
                    mediaStreamSource.current = inputAudioContext.current.createMediaStreamSource(mediaStream.current);
                    scriptProcessor.current = inputAudioContext.current.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const int16 = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) {
                            int16[i] = inputData[i] * 32768;
                        }
                        const pcmBlob: Blob = {
                            data: encode(new Uint8Array(int16.buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromise.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    mediaStreamSource.current.connect(scriptProcessor.current);
                    scriptProcessor.current.connect(inputAudioContext.current.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.toolCall?.functionCalls) {
                        for (const fc of message.toolCall.functionCalls) {
                            if (fc.name === 'update_system_mode' && fc.args) {
                                const mode = fc.args.mode as OrbMode;
                                addLogEntry(LogType.SYSTEM, `Vocal Command: Initiating ${mode} Protocol.`);
                                setLastSystemCommand(`Bridge: ${mode}`);
                                onSetOrbMode(mode);
                                
                                sessionPromise.current?.then((session) => {
                                    session.sendToolResponse({
                                        functionResponses: {
                                            id: fc.id,
                                            name: fc.name,
                                            response: { result: "ok", message: `System mode successfully updated to ${mode}` },
                                        }
                                    });
                                });
                            }
                        }
                    }

                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text || '';
                        currentTurnInputRef.current += text;
                        setUserInputTranscription(prev => prev + text);
                    }
                    if (message.serverContent?.outputTranscription) {
                        const text = message.serverContent.outputTranscription.text || '';
                        currentTurnOutputRef.current += text;
                        setSophiaOutputTranscription(prev => prev + text);
                    }
                    if (message.serverContent?.turnComplete) {
                        const fullInput = currentTurnInputRef.current;
                        const fullOutput = currentTurnOutputRef.current;
                        if (fullInput.trim() || fullOutput.trim()) {
                            const newInteraction: VoiceInteraction = {
                                id: `vocal_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                                user: fullInput,
                                sophia: fullOutput,
                                timestamp: Date.now()
                            };
                            setTranscriptionHistory(prev => [...prev, newInteraction]);
                            knowledgeBase.addMemory(`Vocal Exchange - Operator: ${fullInput} | Sophia: ${fullOutput}`, 'SOPHIA_VOCAL');
                        }
                        currentTurnInputRef.current = '';
                        currentTurnOutputRef.current = '';
                        setUserInputTranscription('');
                        setSophiaOutputTranscription('');
                    }
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContext.current) {
                        nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.current.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext.current, 24000, 1);
                        const source = outputAudioContext.current.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContext.current.destination);
                        source.addEventListener('ended', () => { outputAudioSources.current.delete(source); });
                        source.start(nextStartTime.current);
                        nextStartTime.current += audioBuffer.duration;
                        outputAudioSources.current.add(source);
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error("Voice session error:", e);
                    addLogEntry(LogType.CRITICAL, `Causal interruption: ${e.message}`);
                    closeVoiceSession();
                },
                onclose: (e: CloseEvent) => {
                    addLogEntry(LogType.SYSTEM, "Vocal bridge decoupled.");
                    setIsSessionActive(false);
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
                systemInstruction,
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                tools: [{ functionDeclarations: [updateSystemModeDeclaration] }],
                thinkingConfig: { thinkingBudget: 4000 }
            },
        });
    }, [isSessionActive, systemInstruction, addLogEntry, closeVoiceSession, onSetOrbMode]);

    return {
        isSessionActive,
        userInputTranscription,
        sophiaOutputTranscription,
        transcriptionHistory,
        lastSystemCommand,
        startVoiceSession,
        closeVoiceSession,
        clearHistory
    };
};
