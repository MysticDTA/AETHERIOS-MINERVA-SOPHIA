
import { GoogleGenAI, Type } from '@google/genai';
import { TransmissionState, CommsStatus, LiveTickerMetric } from '../types';

export interface CosmosTransmission extends TransmissionState {
    frequency: number; // in GHz (Radio Astronomy Spectrum)
    bandwidth: number; // in MHz
    realWorldMetric?: string;
    dataSource?: string;
}

type CommsListener = (state: CosmosTransmission) => void;
type MetricListener = (metrics: LiveTickerMetric[]) => void;

class CosmosCommsService {
    private listeners = new Set<CommsListener>();
    private metricListeners = new Set<MetricListener>();
    
    private decodingInterval: number | null = null;
    private nextMessageTimeout: number | null = null;
    private metricInterval: number | null = null;
    
    private isRunning = false;
    private isFetching = false;
    private retryCount = 0;
    private lastTransmissionTime = 0;
    
    private liveMetrics: LiveTickerMetric[] = [];
    private currentMetricTopicIndex = 0;

    private readonly METRIC_TOPICS = [
        { id: 'SPACE', query: 'current real-time solar wind speed km/s and Kp index. Return numbers.' },
        { id: 'CRYPTO', query: 'current live price of Bitcoin and Ethereum in USD. Return numbers.' },
        { id: 'ECONOMY', query: 'current price of Gold per ounce and S&P 500 index. Return numbers.' }
    ];
    
    // HEURISTIC COOLDOWN: 5 minutes (300,000ms) for main transmissions
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

    public currentState: CosmosTransmission = { ...this.initialState };

    subscribe(listener: CommsListener): () => void {
        this.listeners.add(listener);
        listener(this.currentState); 
        return () => this.listeners.delete(listener);
    }

    subscribeMetrics(listener: MetricListener): () => void {
        this.metricListeners.add(listener);
        listener(this.liveMetrics);
        return () => this.metricListeners.delete(listener);
    }

    private emit() {
        this.listeners.forEach(fn => fn({ ...this.currentState }));
    }

    private emitMetrics() {
        this.metricListeners.forEach(fn => fn([...this.liveMetrics]));
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // Start main transmission loop
        const timeSinceLast = Date.now() - this.lastTransmissionTime;
        if (timeSinceLast > this.MIN_SYNC_INTERVAL) {
            this.beginTransmission();
        } else {
            this.scheduleNextTransmission();
        }

        // Start Live Metric Cycle (every 90 seconds)
        this.fetchLiveMetrics();
        this.metricInterval = window.setInterval(() => this.fetchLiveMetrics(), 90000);
    }
    
    stop() {
        this.isRunning = false;
        if(this.decodingInterval) clearInterval(this.decodingInterval);
        if(this.nextMessageTimeout) clearTimeout(this.nextMessageTimeout);
        if(this.metricInterval) clearInterval(this.metricInterval);
    }

    private async fetchLiveMetrics() {
        if (!process.env.API_KEY || process.env.API_KEY === 'undefined') return;

        const topic = this.METRIC_TOPICS[this.currentMetricTopicIndex];
        this.currentMetricTopicIndex = (this.currentMetricTopicIndex + 1) % this.METRIC_TOPICS.length;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Fetch real-time data for: "${topic.query}".
                Return a JSON array of 2 key metrics found.
                Format: [{ "id": "UNIQUE_ID", "label": "SHORT_LABEL", "value": "VALUE_WITH_UNIT", "trend": "UP/DOWN/STABLE" }]
                Example: [{ "id": "BTC", "label": "BITCOIN", "value": "$98,420", "trend": "UP" }]
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                label: { type: Type.STRING },
                                value: { type: Type.STRING },
                                trend: { type: Type.STRING, enum: ['UP', 'DOWN', 'STABLE'] }
                            },
                            required: ["id", "label", "value", "trend"]
                        }
                    }
                }
            });

            const text = response.text;
            if (text) {
                const newMetrics = JSON.parse(text) as LiveTickerMetric[];
                // Update existing metrics or add new ones
                const updatedList = [...this.liveMetrics];
                newMetrics.forEach(m => {
                    const idx = updatedList.findIndex(existing => existing.id === m.id);
                    if (idx >= 0) updatedList[idx] = m;
                    else updatedList.push(m);
                });
                
                // Keep only last 6 metrics to prevent overflow
                this.liveMetrics = updatedList.slice(-6);
                this.emitMetrics();
            }
        } catch (e) {
            console.warn("Live metric fetch failed:", e);
        }
    }

    private scheduleNextTransmission(isError = false) {
        if (!this.isRunning) return;
        if (this.nextMessageTimeout) clearTimeout(this.nextMessageTimeout);

        const isWaitingForKey = !process.env.API_KEY || process.env.API_KEY === 'undefined';
        const baseDelay = isWaitingForKey ? 10000 : (isError ? 30000 * Math.pow(2, this.retryCount) : 900000); 
        const jitter = Math.random() * 5000;
        const delay = Math.min(baseDelay + jitter, 3600000); 

        this.nextMessageTimeout = window.setTimeout(() => this.beginTransmission(), delay);
    }

    private async beginTransmission() {
        if (this.isFetching || !this.isRunning) return;
        
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
