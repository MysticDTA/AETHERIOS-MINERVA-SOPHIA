import { soundMap } from '../sounds';
import { SystemState } from '../../types';

type SoundName = keyof typeof soundMap;

export class AudioEngine {
  private audioContext: AudioContext;
  private buffers: Map<SoundName, AudioBuffer> = new Map();
  private currentLoop: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private isLoaded = false;
  private isSuspended = true;
  private masterGainNode: GainNode;
  private isMuted = false;
  
  // Dynamic ambience layers
  private dynamicHum: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private dynamicStatic: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private dynamicHeartbeat: { source: AudioBufferSourceNode; gain: GainNode } | null = null;


  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.isSuspended = this.audioContext.state === 'suspended';
    
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    // Initial volume ramp to prevent startup pop
    this.masterGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.masterGainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.5);
  }

  public async loadSounds(): Promise<void> {
    const soundPromises: Promise<void>[] = [];

    const dataUriToArrayBuffer = (dataUri: string): ArrayBuffer => {
        const B64_MARKER = ';base64,';
        const base64Index = dataUri.indexOf(B64_MARKER);
        if (base64Index === -1) {
            throw new Error('Invalid data URI format: missing base64 marker.');
        }
        const base64 = dataUri.substring(base64Index + B64_MARKER.length);

        // Trim whitespace from base64 string to prevent decoding errors
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
              console.error(`Failed to decode sound: ${String(soundName)}`, error);
              resolve(); // Resolve anyway to not block other sounds
            });
        } catch (error) {
          console.error(`Failed to load sound: ${String(soundName)}`, error);
          resolve(); // Resolve anyway
        }
      });
      soundPromises.push(promise);
    }
    
    await Promise.all(soundPromises);
    this.isLoaded = true;
  }

  public resumeContext = (): void => {
    if (this.isSuspended && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        this.isSuspended = false;
      });
    }
  }
  
  public setMasterVolume(level: number): void {
      if (this.masterGainNode && !this.isMuted) {
          // Smooth ramp to avoid zipper noise
          this.masterGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
          this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, this.audioContext.currentTime);
          this.masterGainNode.gain.linearRampToValueAtTime(level, this.audioContext.currentTime + 0.2);
      }
  }

  public toggleMute(): boolean {
      this.isMuted = !this.isMuted;
      if (this.masterGainNode) {
          const currentTime = this.audioContext.currentTime;
          this.masterGainNode.gain.cancelScheduledValues(currentTime);
          this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, currentTime);
          
          if (this.isMuted) {
              this.masterGainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.3);
          } else {
              this.masterGainNode.gain.linearRampToValueAtTime(0.5, currentTime + 0.3); // Restore to default or tracked volume
          }
      }
      return this.isMuted;
  }

  public getMasterVolume(): number {
      return this.masterGainNode?.gain.value || 0;
  }

  private playSound(name: SoundName, loop = false, volume = 1.0, playbackRate = 1.0): { source: AudioBufferSourceNode; gain: GainNode } | null {
    this.resumeContext();
    if (this.isSuspended) return null;

    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Audio buffer for "${String(name)}" not found.`);
      return null;
    }

    const gainNode = this.audioContext.createGain();
    // STABILIZATION: Start at 0 and ramp up to avoid popping (ADSR attack)
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
    
    gainNode.connect(this.masterGainNode);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.playbackRate.value = playbackRate;
    source.connect(gainNode);
    source.start();

    return { source, gain: gainNode };
  }

  public playEffect(name: SoundName): void {
    this.playSound(name, false, 0.7);
  }
  
  public playUIClick(): void {
    this.playSound('ui_click', false, 0.5);
  }

  public playUIScanStart(): void {
    this.playSound('ui_scan_start', false, 0.4);
  }

  public playUIConfirm(): void {
    this.playSound('ui_confirm', false, 0.6);
  }
  
  public playPurgeEffect(): void {
    this.playSound('ui_purge_flow', false, 0.7);
  }

  public playHeliumFlush(): void {
    this.playSound('ui_purge_flow', false, 0.6, 1.5); // Reuse purge sound, but faster
  }

  public playGroundingDischarge(): void {
    this.playSound('grounding_discharge', false, 0.6);
  }

  public playHighResonanceChime(): void {
    this.playSound('ui_chime_resonance', false, 0.6);
  }
  
  public playAlarm(): AudioBufferSourceNode | null {
      const sound = this.playSound('alarm_klaxon', true, 0.4);
      return sound ? sound.source : null;
  }

  public setMode(mode: string): void {
    if (!this.isLoaded) return;
    this.resumeContext();
    
    let soundName: SoundName | null = null;
    switch (mode) {
      case 'CRADLE OF PRESENCE':
        soundName = 'synthesis';
        break;
      case 'RECALIBRATING HARMONICS':
        soundName = 'injection';
        break;
      case 'REGENERATIVE CYCLE':
        soundName = 'renewal';
        break;
      case 'SYSTEM COMPOSURE FAILURE':
        soundName = 'eventHorizon';
        break;
      default:
        soundName = null;
        break;
    }
    
    if (this.currentLoop) {
      const { gain, source } = this.currentLoop;
      // STABILIZATION: Smooth fade out
      gain.gain.cancelScheduledValues(this.audioContext.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.5);
      source.stop(this.audioContext.currentTime + 0.5);
      this.currentLoop = null;
    }

    if (soundName) {
      const newLoop = this.playSound(soundName, true, 0.4); // playSound handles the fade-in
      if (newLoop) {
        this.currentLoop = newLoop;
      }
    }
  }
  
  public updateDynamicAmbience(state: SystemState): void {
      if (!this.isLoaded || this.isSuspended) return;

      const rampTime = 1.0;
      const currentTime = this.audioContext.currentTime;

      // 1. Health Drone (low health warning)
      if (!this.dynamicHum) {
          this.dynamicHum = this.playSound('dynamic_hum_base', true, 0);
      }
      if (this.dynamicHum) {
          const health = state.quantumHealing.health;
          const targetVolume = health < 0.7 ? (1 - health) * 0.5 : 0.0001;
          this.dynamicHum.gain.gain.linearRampToValueAtTime(targetVolume, currentTime + rampTime);
      }

      // 2. Decoherence Static
      if (!this.dynamicStatic) {
          this.dynamicStatic = this.playSound('dynamic_static_crackle', true, 0);
      }
      if (this.dynamicStatic) {
          const decoherence = state.quantumHealing.decoherence;
          const targetVolume = Math.max(0.0001, decoherence * 0.4);
          this.dynamicStatic.gain.gain.linearRampToValueAtTime(targetVolume, currentTime + rampTime);
      }

      // 3. Biometric Heartbeat
      if (!this.dynamicHeartbeat) {
          this.dynamicHeartbeat = this.playSound('dynamic_heartbeat', true, 0);
      }
      if (this.dynamicHeartbeat) {
          const { status, coherence } = state.biometricSync;
          let rate = 1.0;
          let volume = 0.0001;
          
          if (status === 'SYNCHRONIZED') {
              rate = 0.8;
              volume = Math.max(0.0001, coherence * 0.35);
          } else if (status === 'CALIBRATING') {
              rate = 1.2;
              volume = Math.max(0.0001, coherence * 0.4);
          } else if (status === 'UNSTABLE') {
              rate = 1.8;
              volume = 0.5;
          } else if (status === 'DECOUPLED') {
              rate = 2.5;
              volume = 0.6;
          }
          
          this.dynamicHeartbeat.source.playbackRate.linearRampToValueAtTime(rate, currentTime + rampTime);
          this.dynamicHeartbeat.gain.gain.linearRampToValueAtTime(volume, currentTime + rampTime);
      }
  }

  public stopAllSounds(): void {
    const fadeOut = (node: { source: AudioBufferSourceNode; gain: GainNode } | null) => {
        if (node) {
            node.gain.gain.cancelScheduledValues(this.audioContext.currentTime);
            node.gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.1);
            node.source.stop(this.audioContext.currentTime + 0.1);
        }
    };

    fadeOut(this.currentLoop); this.currentLoop = null;
    fadeOut(this.dynamicHum); this.dynamicHum = null;
    fadeOut(this.dynamicStatic); this.dynamicStatic = null;
    fadeOut(this.dynamicHeartbeat); this.dynamicHeartbeat = null;
  }
}