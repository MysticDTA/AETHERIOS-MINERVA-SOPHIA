
class AudioAnalysisService {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private dataArray: Uint8Array | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private isActive = false;

    constructor() {
        // Lazy init to respect browser autoplay policies
    }

    public connectSource(stream: MediaStream) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256; // Trade-off between resolution and performance
        this.analyser.smoothingTimeConstant = 0.8;
        
        this.source = this.audioContext.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
        
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.isActive = true;
    }

    public disconnect() {
        this.isActive = false;
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
        // We keep the context alive for re-use, or could close it if strictly necessary
    }

    public getFrequencyData(): Uint8Array {
        if (!this.isActive || !this.analyser || !this.dataArray) {
            return new Uint8Array(0);
        }
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    public getEnergyMetrics() {
        if (!this.isActive || !this.dataArray) {
            return { bass: 0, mid: 0, high: 0, average: 0 };
        }

        const length = this.dataArray.length;
        const bassEnd = Math.floor(length * 0.1); // Lower 10%
        const midEnd = Math.floor(length * 0.5);  // Next 40%
        
        let bassSum = 0;
        let midSum = 0;
        let highSum = 0;
        let totalSum = 0;

        for (let i = 0; i < length; i++) {
            const val = this.dataArray[i] / 255.0; // Normalize 0-1
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
