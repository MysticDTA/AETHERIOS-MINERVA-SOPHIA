
class AudioAnalysisService {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private dataArray: Uint8Array | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private isActive = false;
    private historyBuffer: number[] = [];

    constructor() {
        // Service initialized, waiting for stream connection via user interaction
    }

    public connectSource(stream: MediaStream) {
        try {
            // Lazy load AudioContext to comply with browser policies
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Create Analyser for high-fidelity spectral data
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048; 
            this.analyser.smoothingTimeConstant = 0.85; // Smooths out jitter for a more "organic" feel
            
            // Connect Stream
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.analyser);
            
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isActive = true;
            console.log("[AudioAnalysis] Bio-Acoustic Sensors Active. Listening for Resonance.");
        } catch (e) {
            console.error("[AudioAnalysis] Failed to connect bio-source:", e);
        }
    }

    public disconnect() {
        this.isActive = false;
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
        // We keep audioContext alive for re-connection
    }

    public getFrequencyData(): Uint8Array {
        if (!this.isActive || !this.analyser || !this.dataArray) {
            return new Uint8Array(0);
        }
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    /**
     * Calculates Psychoacoustic Resonance and Signal Stability (Coherence)
     * Returns normalized 0-1 values derived from real physics.
     */
    public getRealTimeMetrics() {
        if (!this.isActive || !this.analyser || !this.dataArray) {
            return { resonance: 0, coherence: 0, entropy: 0 };
        }

        this.analyser.getByteFrequencyData(this.dataArray);
        const length = this.dataArray.length;
        
        // 1. Calculate Resonance (Total Energy / RMS)
        // High volume/energy = High Resonance
        let sumSquares = 0;
        for (let i = 0; i < length; i++) {
            const val = this.dataArray[i] / 255; 
            sumSquares += val * val;
        }
        const rms = Math.sqrt(sumSquares / length);
        // Scale RMS to be more responsive (0.0 - 0.5 usually) -> map to 0.0 - 1.0
        // We clamp it to 1.0. A quiet room is ~0.
        const resonance = Math.min(1.0, rms * 5); 

        // 2. Calculate Coherence (Stability of the signal over time)
        // We track the variance of the resonance over the last 30 frames (~1.5s)
        this.historyBuffer.push(resonance);
        if (this.historyBuffer.length > 30) this.historyBuffer.shift();
        
        const mean = this.historyBuffer.reduce((a, b) => a + b, 0) / this.historyBuffer.length;
        const variance = this.historyBuffer.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.historyBuffer.length;
        const stdDev = Math.sqrt(variance);
        
        // Low deviation = High Coherence (Steady tone/voice/silence). High deviation = Low Coherence (Chaotic noise).
        // Invert stdDev: 0 dev = 1 coherence.
        // We use a non-linear curve to highlight stability.
        const coherence = Math.max(0, 1.0 - (stdDev * 6)); 

        // 3. Entropy (High frequency noise ratio)
        // Check upper 30% of spectrum for chaotic energy
        let noiseEnergy = 0;
        const noiseStart = Math.floor(length * 0.7);
        for(let i = noiseStart; i < length; i++) {
            noiseEnergy += this.dataArray[i];
        }
        // Normalize noise energy relative to the number of bins checked
        const entropyRaw = (noiseEnergy / (length - noiseStart)) / 255;
        // Amplify for visibility: even small high-freq noise is entropy
        const entropy = Math.min(1.0, entropyRaw * 8); 

        return { resonance, coherence, entropy };
    }

    public getEnergyMetrics() {
        if (!this.isActive || !this.dataArray) {
            return { bass: 0, mid: 0, high: 0, average: 0 };
        }

        const length = this.dataArray.length;
        // Frequency bands (approximate for 2048 FFT size)
        const bassEnd = Math.floor(length * 0.05); // ~0-1000Hz
        const midEnd = Math.floor(length * 0.4);   // ~1000-8000Hz
        
        let bassSum = 0, midSum = 0, highSum = 0, totalSum = 0;

        for (let i = 0; i < length; i++) {
            const val = this.dataArray[i] / 255.0;
            totalSum += val;
            
            if (i < bassEnd) bassSum += val;
            else if (i < midEnd) midSum += val;
            else highSum += val;
        }

        return {
            bass: bassSum / bassEnd || 0,
            mid: midSum / (midEnd - bassEnd) || 0,
            high: highSum / (length - midEnd) || 0,
            average: totalSum / length || 0
        };
    }
}

export const audioAnalysisService = new AudioAnalysisService();
