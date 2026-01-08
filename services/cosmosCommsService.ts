
import { GoogleGenAI, Type } from '@google/genai';
import { TransmissionState, CommsStatus } from '../types';

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
    private isFetching = false;
    private retryCount = 0;
    private lastTransmissionTime = 0;
    
    // HEURISTIC COOLDOWN: 5 minutes (300,000ms) to prevent quota over-saturation
    private readonly MIN_SYNC_INTERVAL = 300000;

    public initialState: CosmosTransmission = {
        id: 'INIT_SIGNAL',
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
        
        const timeSinceLast = Date.now() - this.lastTransmissionTime;
        if (timeSinceLast > this.MIN_SYNC_INTERVAL) {
            this.beginTransmission();
        } else {
            this.scheduleNextTransmission();
        }
    }
    
    stop() {
        this.isRunning = false;
        if(this.decodingInterval) clearInterval(this.decodingInterval);
        if(this.nextMessageTimeout) clearTimeout(this.nextMessageTimeout);
    }

    private scheduleNextTransmission(isError = false) {
        if (!this.isRunning) return;
        if (this.nextMessageTimeout) clearTimeout(this.nextMessageTimeout);

        // OPTIMIZATION: If we're just waiting for a key, check every 10 seconds
        const isWaitingForKey = !process.env.API_KEY || process.env.API_KEY === 'undefined';
        const baseDelay = isWaitingForKey ? 10000 : (isError ? 30000 * Math.pow(2, this.retryCount) : 900000); 
        const jitter = Math.random() * 5000;
        const delay = Math.min(baseDelay + jitter, 3600000); 

        this.nextMessageTimeout = window.setTimeout(() => this.beginTransmission(), delay);
    }

    private async beginTransmission() {
        if (this.isFetching || !this.isRunning) return;
        
        // Muted warning check to prevent console spam
        if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
            this.scheduleNextTransmission(true);
            return;
        }

        this.isFetching = true;
        const transmissionId = `TX_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;
        this.currentState = {
            ...this.currentState,
            id: transmissionId,
            source: 'Syncing NOAA/NASA Telemetry...',
            message: '',
            decodedCharacters: 0,
            status: 'RECEIVING...',
            frequency: 1.617 + (Math.random() * 0.005 - 0.0025),
            bandwidth: 10 + Math.random() * 40
        };
        this.emit();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const prompt = `
                Fetch the latest solar wind telemetry, Kp-index, or solar flare activity from NOAA Space Weather Prediction Center or NASA.
                Analyze the data for potential resonance at the 1.617 GHz L-band frequency.
                Provide a highly technical 1-sentence summary of the current state of space weather.
                Return JSON: {"source": "Observatory/Satellite Name", "text": "Technical summary with real units like km/s, nT, or MeV", "metric": "Key value like Kp-Index"}
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview', 
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

            const jsonStr = (response.text || '{}').trim();
            const { source, text, metric } = JSON.parse(jsonStr);

            this.lastTransmissionTime = Date.now();
            this.currentState.source = source;
            this.currentState.message = text;
            this.currentState.realWorldMetric = metric;
            this.currentState.status = 'DECODING...';
            this.retryCount = 0;
            this.emit();

            this.startDecoding(); 

        } catch (error: any) {
            this.isFetching = false;
            let statusMsg: CommsStatus = 'SIGNAL LOST';
            this.currentState.source = "SYSTEM_ERROR";
            this.currentState.status = statusMsg;
            this.emit();
            this.scheduleNextTransmission(true);
        } finally {
            this.isFetching = false;
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
        }, 3);
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
