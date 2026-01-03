import { TransmissionState, CommsStatus } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

export interface CosmosTransmission extends TransmissionState {
    frequency: number; // in GHz (Radio Astronomy Spectrum)
    bandwidth: number; // in MHz
    realWorldMetric?: string;
    dataSource?: string;
}

type CommsListener = (state: CosmosTransmission) => void;

class CosmosCommsService {
    private listeners = new Set<CommsListener>();
    private decodingInterval: number | null = null;
    private nextMessageTimeout: number | null = null;
    private isRunning = false;
    private retryCount = 0;
    
    public initialState: CosmosTransmission = {
        source: 'AWAITING_NASA_UPLINK',
        message: '',
        decodedCharacters: 0,
        status: 'AWAITING SIGNAL',
        frequency: 1.617, // Golden Ratio Harmonic Baseline
        bandwidth: 50
    };

    private currentState: CosmosTransmission = { ...this.initialState };

    subscribe(listener: CommsListener): () => void {
        this.listeners.add(listener);
        listener(this.currentState); 
        return () => this.listeners.delete(listener);
    }

    private emit() {
        this.listeners.forEach(fn => fn({ ...this.currentState }));
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.beginTransmission(); // Start immediately
    }
    
    stop() {
        this.isRunning = false;
        if(this.decodingInterval) clearInterval(this.decodingInterval);
        if(this.nextMessageTimeout) clearTimeout(this.nextMessageTimeout);
    }

    private scheduleNextTransmission(isError = false) {
        if (!this.isRunning) return;
        if (this.nextMessageTimeout) clearTimeout(this.nextMessageTimeout);

        // PRODUCTION OPTIMIZATION: Increasing interval significantly to preserve API quota.
        // Base delay: 6 minutes. Exponential backoff if error occurred.
        const baseDelay = isError ? 300000 * Math.pow(2, this.retryCount) : 360000; 
        const jitter = Math.random() * 120000;
        const delay = Math.min(baseDelay + jitter, 3600000); // Cap at 1 hour

        this.nextMessageTimeout = window.setTimeout(() => this.beginTransmission(), delay);
    }

    private async beginTransmission() {
        this.currentState = {
            ...this.currentState,
            source: 'Syncing NOAA/NASA Telemetry...',
            message: '',
            decodedCharacters: 0,
            status: 'RECEIVING...',
            frequency: 1.617 + (Math.random() * 0.005 - 0.0025), // Precision jitter around Golden Ratio
            bandwidth: 10 + Math.random() * 40
        };
        this.emit();

        try {
            if (!process.env.API_KEY) throw new Error("No API Key configured");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const prompt = `
                Fetch the latest solar wind telemetry, Kp-index, or solar flare activity from NOAA Space Weather Prediction Center or NASA.
                Analyze the data for potential resonance at the 1.617 GHz L-band frequency.
                Provide a highly technical 1-sentence summary of the current state of space weather.
                Return JSON: {"source": "Observatory/Satellite Name", "text": "Technical summary with real units like km/s, nT, or MeV", "metric": "Key value like Kp-Index"}
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview', 
                contents: prompt,
                config: {
                    tools: [{googleSearch: {}}],
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            source: { type: Type.STRING },
                            text: { type: Type.STRING },
                            metric: { type: Type.STRING }
                        },
                        required: ["source", "text", "metric"]
                    }
                },
            });

            if (!this.isRunning) return;

            const jsonStr = response.text.trim();
            const { source, text, metric } = JSON.parse(jsonStr);

            this.currentState.source = source;
            this.currentState.message = text;
            this.currentState.realWorldMetric = metric;
            this.currentState.status = 'DECODING...';
            this.retryCount = 0; // Reset retry counter on success
            this.emit();

            this.startDecoding(); 

        } catch (error: any) {
            console.error("Grounding Link Failure:", error);
            
            let statusMsg: CommsStatus = 'SIGNAL LOST';
            if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429')) {
                statusMsg = 'SIGNAL LOST';
                this.currentState.message = "Grounding link quota exhausted. High-order resonance required. Re-synchronizing in standby mode...";
                this.retryCount++;
            } else {
                this.currentState.message = "Grounding link to NASA/NOAA data stream interrupted. Re-synchronizing at 1.617 GHz...";
            }

            this.currentState.source = "SYSTEM_ERROR";
            this.currentState.status = statusMsg;
            this.emit();
            this.scheduleNextTransmission(true);
        }
    }

    private startDecoding() {
        if (this.decodingInterval) clearInterval(this.decodingInterval);
        this.decodingInterval = window.setInterval(() => {
            if (!this.isRunning) return;
            if (this.currentState.decodedCharacters < this.currentState.message.length) {
                this.currentState.decodedCharacters++;
                this.emit();
            } else {
                this.endTransmission();
            }
        }, 30);
    }

    private endTransmission() {
        if (this.decodingInterval) clearInterval(this.decodingInterval);
        this.decodingInterval = null;
        this.currentState.status = 'TRANSMISSION COMPLETE';
        this.emit();
        this.scheduleNextTransmission();
    }
}

export const cosmosCommsService = new CosmosCommsService();