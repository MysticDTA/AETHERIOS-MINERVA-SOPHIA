
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

const STORAGE_KEY = 'AETHERIOS_COMMS_STATE_V1';

class CosmosCommsService {
    private listeners = new Set<CommsListener>();
    private metricListeners = new Set<MetricListener>();
    
    private decodingInterval: number | null = null;
    private nextMessageTimeout: number | null = null;
    private metricInterval: number | null = null;
    
    private isRunning = false;
    private isFetching = false;
    private retryCount = 0;
    
    // Rate Limiting & Circuit Breaker
    private lastTransmissionTime = 0;
    private lastErrorTime = 0;
    private errorCooldown = 0;
    private simulationMode = false; // Circuit breaker state
    
    private liveMetrics: LiveTickerMetric[] = [];
    private currentMetricTopicIndex = 0;

    private readonly METRIC_TOPICS = [
        { id: 'SPACE', query: 'current real-time solar wind speed km/s and Kp index. Return numbers.' },
        { id: 'CRYPTO', query: 'current live price of Bitcoin and Ethereum in USD. Return numbers.' },
        { id: 'ECONOMY', query: 'current price of Gold per ounce and S&P 500 index. Return numbers.' }
    ];
    
    // 5 minutes cooldown for heavy transmissions to respect quotas
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

    constructor() {
        this.loadState();
    }

    private loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const now = Date.now();
                this.lastTransmissionTime = parsed.lastTransmissionTime || 0;
                
                // If we were in simulation mode due to an error recently (within 10 mins), restore it
                if (parsed.simulationMode && (now - parsed.lastErrorTime < 600000)) {
                    this.simulationMode = true;
                    this.lastErrorTime = parsed.lastErrorTime;
                    this.errorCooldown = parsed.errorCooldown;
                    console.log("CosmosComms: Restored persisted Simulation Mode (Rate Limit Protection).");
                }
            }
        } catch (e) {
            console.warn("Failed to load comms state", e);
        }
    }

    private saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                lastTransmissionTime: this.lastTransmissionTime,
                lastErrorTime: this.lastErrorTime,
                errorCooldown: this.errorCooldown,
                simulationMode: this.simulationMode
            }));
        } catch (e) {
            console.warn("Failed to save comms state", e);
        }
    }

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
        
        // Initial Check: Should we fetch or simulate?
        const now = Date.now();
        const timeSinceLast = now - this.lastTransmissionTime;
        
        if (timeSinceLast > this.MIN_SYNC_INTERVAL && !this.simulationMode) {
            this.beginTransmission();
        } else {
            console.log(`CosmosComms: Skipping initial fetch. Cooldown active for ${(this.MIN_SYNC_INTERVAL - timeSinceLast)/1000}s or Sim Mode: ${this.simulationMode}`);
            if (this.simulationMode) this.generateSimulatedTransmission();
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

    private enableSimulationMode() {
        this.simulationMode = true;
        this.lastErrorTime = Date.now();
        this.errorCooldown = 600000; // 10 minutes
        this.saveState();
        console.warn("CosmosComms: Rate limit hit. Simulation Mode ENABLED for 10 minutes.");
        
        // Auto-disable after 10 mins
        setTimeout(() => {
            this.simulationMode = false;
            this.saveState();
            console.log("CosmosComms: Simulation Mode cooldown expired. Resuming live uplink.");
        }, 600000);
    }

    private async fetchLiveMetrics() {
        // Circuit Breaker Check
        if (this.simulationMode) {
            this.generateSimulatedMetrics();
            return;
        }

        if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
            this.generateSimulatedMetrics();
            return;
        }

        const topic = this.METRIC_TOPICS[this.currentMetricTopicIndex];
        this.currentMetricTopicIndex = (this.currentMetricTopicIndex + 1) % this.METRIC_TOPICS.length;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Fetch real-time data for: "${topic.query}".
                Return a JSON array of 2 key metrics found.
                Format: [{ "id": "UNIQUE_ID", "label": "SHORT_LABEL", "value": "VALUE_WITH_UNIT", "trend": "UP/DOWN/STABLE" }]
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
                const updatedList = [...this.liveMetrics];
                newMetrics.forEach(m => {
                    const idx = updatedList.findIndex(existing => existing.id === m.id);
                    if (idx >= 0) updatedList[idx] = m;
                    else updatedList.push(m);
                });
                
                this.liveMetrics = updatedList.slice(-6);
                this.emitMetrics();
            }
        } catch (e: any) {
            // Smart Error Handling
            const msg = e.message || e.toString();
            if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
                this.enableSimulationMode();
            }
            // Silent fail to simulation
            this.generateSimulatedMetrics();
        }
    }

    private generateSimulatedMetrics() {
        const simulated: LiveTickerMetric[] = [
            { id: 'sim_sol', label: 'SOLAR_FLUX', value: `${(140 + Math.random()*5).toFixed(1)} sfu`, trend: Math.random() > 0.5 ? 'UP' : 'STABLE' },
            { id: 'sim_btc', label: 'BTC_CAUSAL', value: `$${(98000 + Math.random()*1000).toFixed(0)}`, trend: 'UP' },
            { id: 'sim_kp', label: 'PLANETARY_K', value: `Kp=${(2 + Math.random()).toFixed(1)}`, trend: 'DOWN' },
            { id: 'sim_gold', label: 'XAU/USD', value: `$${(2650 + Math.random()*10).toFixed(2)}`, trend: 'STABLE' }
        ];
        
        const updatedList = [...this.liveMetrics];
        simulated.forEach(m => {
             const idx = updatedList.findIndex(existing => existing.id === m.id);
             if (idx >= 0) updatedList[idx] = m;
             else updatedList.push(m);
        });
        this.liveMetrics = updatedList.slice(-6);
        this.emitMetrics();
    }

    private scheduleNextTransmission(isError = false) {
        if (!this.isRunning) return;
        if (this.nextMessageTimeout) clearTimeout(this.nextMessageTimeout);

        if (this.simulationMode) {
             // In simulation mode, check back every minute, but don't call API
             this.nextMessageTimeout = window.setTimeout(() => this.beginTransmission(), 60000);
             return;
        }

        const isWaitingForKey = !process.env.API_KEY || process.env.API_KEY === 'undefined';
        const baseDelay = isWaitingForKey ? 10000 : (isError ? 60000 * Math.pow(2, this.retryCount) : 900000); 
        const jitter = Math.random() * 5000;
        const delay = Math.min(baseDelay + jitter, 3600000); 

        this.nextMessageTimeout = window.setTimeout(() => this.beginTransmission(), delay);
    }

    private generateSimulatedTransmission() {
        const SIM_MESSAGES = [
            { source: 'VOYAGER-1 (CACHED)', message: 'Heliopause density delta confirmed. Plasma wave instrument detecting interstellar medium resonance.', metric: '19.2 AU' },
            { source: 'DEEP_SPACE_NETWORK', message: 'Carrier signal locked on Goldstone array. Downloading spectral analysis of sector 7G.', metric: '-124 dBm' },
            { source: 'CHANDRA_XRAY', message: 'Accretion disk luminosity fluctuating. Possible singularity event in local cluster.', metric: '4.2 keV' },
            { source: 'LIGO_HANFORD', message: 'Gravitational wave event GW170817 replay. Neutron star merger signature verified.', metric: '1.4 M☉' }
        ];
        
        const data = SIM_MESSAGES[Math.floor(Math.random() * SIM_MESSAGES.length)];
        
        const transmissionId = `SIM_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;
        this.currentState = {
            ...this.currentState,
            id: transmissionId,
            source: data.source,
            message: data.message,
            realWorldMetric: data.metric,
            status: 'SIMULATION UPLINK ACTIVE',
            decodedCharacters: 0,
            frequency: 1.617 + (Math.random() * 0.005 - 0.0025),
            bandwidth: 10 + Math.random() * 40
        };
        this.emit();
        this.startDecoding();
    }

    private async beginTransmission() {
        if (this.isFetching || !this.isRunning) return;
        
        if (this.simulationMode || !process.env.API_KEY || process.env.API_KEY === 'undefined') {
            this.generateSimulatedTransmission();
            this.scheduleNextTransmission();
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
                Fetch the latest solar wind telemetry, Kp-index, or solar flare activity from NOAA Space Weather Prediction Center.
                Return JSON: {"source": "Observatory Name", "text": "Technical summary", "metric": "Key value"}
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
            this.saveState(); // Persist timestamp to prevent rapid re-fetch on reload

            this.currentState.source = source;
            this.currentState.message = text;
            this.currentState.realWorldMetric = metric;
            this.currentState.status = 'DECODING...';
            this.retryCount = 0;
            this.emit();

            this.startDecoding(); 

        } catch (error: any) {
            this.isFetching = false;
            
            const msg = error.message || error.toString();
            if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
                this.enableSimulationMode();
            } else {
                this.retryCount++;
            }
            
            // Fallback
            this.generateSimulatedTransmission();
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
