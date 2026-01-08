
import { soundMap } from '../sounds';
import { SystemState } from '../../types';

type SoundName = keyof typeof soundMap;

/**
 * AETHERIOS Institutional Audio Engine
 * Manages high-fidelity spatialized sound effects and persistent resonance loops.
 * Optimizes the sensory experience for the Architect's terminal.
 */
export class AudioEngine {
  private audioContext: AudioContext;
  private buffers: Map<SoundName, AudioBuffer> = new Map();
  private currentLoop: { source: AudioBufferSourceNode; gain: GainNode; name: SoundName } | null = null;
  private isLoaded = false;
  private isSuspended = true;
  private masterGainNode: GainNode;
  private isMuted = false;
  
  // Dynamic ambience layers for deeper immersion
  private dynamicHum: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private dynamicStatic: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private dynamicHeartbeat: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.isSuspended = this.audioContext.state === 'suspended';
    
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    
    // Initialize with a precision volume ramp
    this.masterGainNode.gain.setValueAtTime(0.0001, this.audioContext.currentTime);
    this.masterGainNode.gain.exponentialRampToValueAtTime(0.5, this.audioContext.currentTime + 1.0);
  }

  /**
   * Decodes institutional sound shards from the soundMap.
   * Converts base64 telemetry data into PCM buffers.
   */
  public async loadSounds(): Promise<void> {
    const soundPromises: Promise<void>[] = [];

    const dataUriToArrayBuffer = (dataUri: string): ArrayBuffer => {
        const B64_MARKER = ';base64,';
        const base64Index = dataUri.indexOf(B64_MARKER);
        if (base64Index === -1) {
            throw new Error('Invalid data URI format: missing base64 marker.');
        }
        const base64 = dataUri.substring(base64Index + B64_MARKER.length);
        const binaryString = window.atob(base64.trim());
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    for (const name of Object.keys(soundMap)) {
      const soundName = name as SoundName;
      const promise = new Promise<void>((resolve) => {
        try {
          const arrayBuffer = dataUriToArrayBuffer(soundMap[soundName]);
          this.audioContext.decodeAudioData(arrayBuffer)
            .then(audioBuffer => {
              this.buffers.set(soundName, audioBuffer);
              resolve();
            })
            .catch(error => {
              console.error(`FAILED_SONIC_DECODE: ${String(soundName)}`, error);
              resolve();
            });
        } catch (error) {
          console.error(`FAILED_SONIC_LOAD: ${String(soundName)}`, error);
          resolve();
        }
      });
      soundPromises.push(promise);
    }
    
    await Promise.all(soundPromises);
    this.isLoaded = true;
  }

  /**
   * Re-establishes the causal audio link after user interaction.
   */
  public resumeContext = (): Promise<void> => {
    if (this.audioContext.state === 'suspended') {
      return this.audioContext.resume().then(() => {
        this.isSuspended = false;
      });
    }
    return Promise.resolve();
  }
  
  public setMasterVolume(level: number): void {
      if (this.masterGainNode && !this.isMuted) {
          const clampedLevel = Math.max(0.0001, Math.min(1.0, level));
          this.masterGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
          this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, this.audioContext.currentTime);
          this.masterGainNode.gain.exponentialRampToValueAtTime(clampedLevel, this.audioContext.currentTime + 0.3);
      }
  }

  public toggleMute(): boolean {
      this.isMuted = !this.isMuted;
      if (this.masterGainNode) {
          const currentTime = this.audioContext.currentTime;
          this.masterGainNode.gain.cancelScheduledValues(currentTime);
          this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, currentTime);
          
          if (this.isMuted) {
              this.masterGainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.4);
          } else {
              this.masterGainNode.gain.exponentialRampToValueAtTime(0.5, currentTime + 0.4);
          }
      }
      return this.isMuted;
  }

  public getMasterVolume(): number {
      return this.masterGainNode?.gain.value || 0;
  }

  private playSound(name: SoundName, loop = false, volume = 1.0, playbackRate = 1.0): { source: AudioBufferSourceNode; gain: GainNode; name: SoundName } | null {
    if (!this.isLoaded) return null;

    const buffer = this.buffers.get(name);
    if (!buffer) return null;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.0001, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(volume, this.audioContext.currentTime + 0.1); 
    
    gainNode.connect(this.masterGainNode);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.playbackRate.value = playbackRate;
    source.connect(gainNode);
    source.start();

    return { source, gain: gainNode, name };
  }

  public playEffect(name: SoundName): void {
    this.playSound(name, false, 0.7);
  }
  
  public playUIClick(): void {
    this.playSound('ui_click', false, 0.4);
  }

  public playUIScanStart(): void {
    this.playSound('ui_scan_start', false, 0.35);
  }

  public playUIConfirm(): void {
    this.playSound('ui_confirm', false, 0.5);
  }

  public playAscensionChime(): void {
      this.playSound('ui_chime_resonance', false, 1.0, 0.5);
      this.playSound('synthesis', false, 0.4, 2.0);
  }
  
  public playPurgeEffect(): void {
    this.playSound('ui_purge_flow', false, 0.6);
  }

  public playHeliumFlush(): void {
    this.playSound('ui_purge_flow', false, 0.5, 1.8); 
  }

  public playGroundingDischarge(): void {
    this.playSound('grounding_discharge', false, 0.65);
  }

  public playHighResonanceChime(): void {
    this.playSound('ui_chime_resonance', false, 0.7);
  }
  
  public playAlarm(): AudioBufferSourceNode | null {
      const sound = this.playSound('alarm_klaxon', true, 0.35);
      return sound ? sound.source : null;
  }

  /**
   * Sets the core background resonance based on OrbMode or Governance Axiom.
   */
  public setMode(mode: string): void {
    if (!this.isLoaded) return;
    
    let soundName: SoundName | null = null;
    
    // Map OrbModes and Axioms to specific loops
    switch (mode) {
      case 'STANDBY':
      case 'CRADLE OF PRESENCE':
        soundName = 'synthesis'; // Calm baseline
        break;
      case 'ANALYSIS':
      case 'RECALIBRATING HARMONICS':
        soundName = 'analysis_loop'; // Active thought
        break;
      case 'SYNTHESIS':
      case 'SOVEREIGN EMBODIMENT':
      case 'CONCORDANCE':
        soundName = 'synthesis'; // Harmonic flow
        break;
      case 'REPAIR':
      case 'REGENERATIVE CYCLE':
        soundName = 'repair_loop'; // Healing tone
        break;
      case 'GROUNDING':
        soundName = 'grounding_loop'; // Deep rumble
        break;
      case 'OFFLINE':
      case 'SYSTEM COMPOSURE FAILURE':
        soundName = 'offline_loop'; // Static
        break;
      default:
        soundName = 'synthesis';
        break;
    }
    
    // If the requested sound is already playing, do nothing to prevent gaps
    if (this.currentLoop && this.currentLoop.name === soundName) {
        return;
    }

    // Fade out current loop
    if (this.currentLoop) {
      const { gain, source } = this.currentLoop;
      gain.gain.cancelScheduledValues(this.audioContext.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 1.0);
      source.stop(this.audioContext.currentTime + 1.1);
      this.currentLoop = null;
    }

    // Start new loop
    if (soundName) {
      const newLoop = this.playSound(soundName, true, 0.35);
      if (newLoop) {
        this.currentLoop = newLoop;
      }
    }
  }
  
  /**
   * Adjusts ambient sound textures based on real-time system diagnostics.
   * Higher decoherence increases spectral static. Lower health adds a mechanical hum.
   */
  public updateDynamicAmbience(state: SystemState): void {
      if (!this.isLoaded || this.isSuspended) return;

      const rampTime = 1.5;
      const currentTime = this.audioContext.currentTime;

      // Mechanical Hum based on system health (low health = louder hum)
      if (!this.dynamicHum) {
          this.dynamicHum = this.playSound('dynamic_hum_base', true, 0.0001);
      }
      if (this.dynamicHum) {
          const health = state.quantumHealing.health;
          const targetVolume = health < 0.75 ? (1 - health) * 0.4 : 0.0001;
          this.dynamicHum.gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetVolume), currentTime + rampTime);
      }

      // Spectral Crackle based on decoherence (high decoherence = louder static)
      if (!this.dynamicStatic) {
          this.dynamicStatic = this.playSound('dynamic_static_crackle', true, 0.0001);
      }
      if (this.dynamicStatic) {
          const decoherence = state.quantumHealing.decoherence;
          const targetVolume = Math.max(0.0001, decoherence * 0.35);
          this.dynamicStatic.gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetVolume), currentTime + rampTime);
      }

      // Biometric Heartbeat pulse linked to HRV coherence
      if (!this.dynamicHeartbeat) {
          this.dynamicHeartbeat = this.playSound('dynamic_heartbeat', true, 0.0001);
      }
      if (this.dynamicHeartbeat) {
          const { status, coherence } = state.biometricSync;
          let rate = 1.0;
          let volume = 0.0001;
          
          if (status === 'SYNCHRONIZED') {
              rate = 0.75;
              volume = Math.max(0.0001, coherence * 0.3);
          } else if (status === 'CALIBRATING') {
              rate = 1.1;
              volume = Math.max(0.0001, coherence * 0.35);
          } else if (status === 'UNSTABLE') {
              rate = 1.6;
              volume = 0.4;
          } else if (status === 'DECOUPLED') {
              rate = 2.2;
              volume = 0.55;
          }
          
          this.dynamicHeartbeat.source.playbackRate.exponentialRampToValueAtTime(Math.max(0.1, rate), currentTime + rampTime);
          this.dynamicHeartbeat.gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), currentTime + rampTime);
      }
  }

  public stopAllSounds(): void {
    const fadeOut = (node: { source: AudioBufferSourceNode; gain: GainNode } | null) => {
        if (node) {
            node.gain.gain.cancelScheduledValues(this.audioContext.currentTime);
            node.gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.2);
            node.source.stop(this.audioContext.currentTime + 0.25);
        }
    };

    fadeOut(this.currentLoop); this.currentLoop = null;
    fadeOut(this.dynamicHum); this.dynamicHum = null;
    fadeOut(this.dynamicStatic); this.dynamicStatic = null;
    fadeOut(this.dynamicHeartbeat); this.dynamicHeartbeat = null;
  }
}
