
import React from 'react';

// Global shared types for SOPHIA DV99 / Alliance System

// Ensure 3D modules are recognized even if types are missing in CI
declare module 'three';
declare module '@react-three/fiber';
declare module '@react-three/drei';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
    SpeechRecognition: any;
    webkitRecognition: any;
    webkitSpeechRecognition: any;
  }

  // Extend JSX.IntrinsicElements to recognize React Three Fiber elements
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      ambientLight: any;
      pointLight: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      primitive: any;
    }
  }
}

export type UserTier = 'ACOLYTE' | 'ARCHITECT' | 'SOVEREIGN' | 'LEGACY_MENERVA';

export interface Collaborator {
    id: string;
    name: string;
    role: string;
    status: string;
    specialty: string;
    clearance: UserTier;
}

export interface PerformanceTelemetry {
    logicalLatency: number; 
    visualParity: number; 
    gpuLoad: number; 
    frameStability: number; 
    thermalIndex: number; 
    throughput: number;
    memoryUsage: number;
}

export interface IngestedModule {
    id: string;
    name: string;
    originProject: 'MENERVA' | 'AETHERIOS';
    status: 'MOUNTED' | 'SYNCING' | 'ERROR';
    entryPoint: string;
    dataShard?: Record<string, any>;
}

export interface UserResources {
    cradleTokens: number;
    sovereignTier: UserTier;
    unlockedModules: string[];
    ledgerHistory: any[];
    subscriptionActive: boolean;
    menervaLegacyPoints: number;
}

export interface AuthState {
    isAuthenticated: boolean;
    operatorId: string;
    sessionToken: string;
}

export interface QuantumHealingData {
    health: number;
    lesions: number;
    repairRate: number;
    status: string;
    decoherence: number;
    stabilizationShield: number;
}

export interface FrequencyMetric {
    frequency: number;      // in zHz
    amplitude: number;      // 0.0 - 1.0
    phase: number;          // 0 - 360 degrees
    harmonicIndex: number;  // 1 = Fundamental, 2 = 1st Harmonic, etc.
}

export interface ResonanceCoherenceData {
    lambda: FrequencyMetric;
    sigma: FrequencyMetric;
    tau: FrequencyMetric;
}

export interface HarmonicInterferenceData {
    beatFrequency: number;          // Hz difference between local/global
    constructiveInterference: number; // 0.0 - 1.0
    destructiveInterference: number;  // 0.0 - 1.0
    standingWaveRatio: number;        // SWR (1.0 is perfect match)
}

export interface LyranConcordanceData {
    alignmentDrift: number;
    connectionStability: number;
}

export interface SatelliteUplinkData {
    signalStrength: number;
    lockStatus: SatelliteLockStatus;
    downlinkBandwidth: number;
    uplinkBandwidth: number;
    hevoLatency: number;
    transmissionProtocol: string;
    activeSarMode: string;
    hyperspectralStatus: string;
}

export type SatelliteLockStatus = 'LOCKED' | 'ACQUIRING' | 'DRIFTING' | 'OFFLINE';

export interface GalacticRelay {
    id: string;
    name: string;
    status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    latency: number;
}

export interface BiometricSyncData {
    hrv: number;
    coherence: number;
    status: SyncStatus;
}

export type SyncStatus = 'SYNCHRONIZED' | 'CALIBRATING' | 'UNSTABLE' | 'DECOUPLED';

export interface VibrationData {
    amplitude: number;
    frequency: number;
    resonanceStatus: VibrationStatus;
}

export type VibrationStatus = 'HARMONIC' | 'DISCORDANT' | 'CRITICAL';

export interface AethericTransferData {
    efficiency: number;
    particleDensity: number;
    fluxStatus: AethericTransferStatus;
    entropy: number;
}

export type AethericTransferStatus = 'STABLE' | 'TURBULENT' | 'STAGNANT';

export interface SchumannResonanceData {
    liveFrequency: number;
    intensity: number;
    status: SchumannResonanceStatus;
}

export type SchumannResonanceStatus = 'NOMINAL' | 'ELEVATED' | 'SUPPRESSED';

export interface EarthGroundingData {
    charge: number;
    conductivity: number;
    status: 'STABLE' | 'CHARGING' | 'DISCHARGING' | 'WEAK';
    seismicActivity: number;
    telluricCurrent: number;
    feedbackLoopStatus: 'IDLE' | 'CORRECTING';
}

export interface TesseractData {
    flux: number;
    stability: number;
    activeVector: string;
    integrity: number;
}

export interface BohrEinsteinCorrelatorData {
    correlation: number;
}

export interface CoherenceResonanceData {
    score: number;
    entropyFlux: number;
    phaseSync: number;
    quantumCorrelation: number;
    status: 'COHERENT' | 'RESONATING' | 'DECOHERING' | 'CRITICAL';
    intelligenceLog: ResonanceIntelligenceEntry[];
}

export interface ResonanceIntelligenceEntry {
    id: string;
    timestamp: number;
    interpretation: string;
    directive: string;
    metricsAtTime: { rho: number; coherence: number; entropy: number };
}

export interface AbundanceCoreData {
    flow: number;
    generosity: number;
    status: 'EXPANDING' | 'STABLE' | 'CONTRACTING';
}

export interface DilutionRefrigeratorData {
    temperature: number;
    status: DilutionRefrigeratorStatus;
    coolingPower: number;
}

export type DilutionRefrigeratorStatus = 'STABLE' | 'UNSTABLE' | 'BOOSTED' | 'OFFLINE';

export interface SupernovaTriforceData {
    phiEnergy: number;
    psiEnergy: number;
    omegaEnergy: number;
    output: number;
    stability: number;
    state: SupernovaTriforceState;
}

export enum SupernovaTriforceState {
    IDLE = 'IDLE',
    CHARGING = 'CHARGING',
    SUPERNOVA = 'SUPERNOVA',
    STABLE = 'STABLE'
}

export type PillarId = 'ARCTURIAN' | 'LEMURIAN' | 'ATLANTEAN';

export interface PillarData {
    id: PillarId;
    name: string;
    activation: number;
    description: string;
}

export interface LogEntry {
    id: string;
    type: LogType;
    message: string;
    timestamp: number;
}

export enum LogType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    CRITICAL = 'CRITICAL',
    SYSTEM = 'SYSTEM'
}

export type OrbMode = 'STANDBY' | 'ANALYSIS' | 'SYNTHESIS' | 'REPAIR' | 'GROUNDING' | 'CONCORDANCE' | 'OFFLINE';

export interface OrbModeConfig {
    id: OrbMode;
    name: string;
    description: string;
}

export interface TransmissionState {
    id: string;
    source: string;
    message: string;
    decodedCharacters: number;
    status: CommsStatus;
    frequency: number;
    bandwidth: number;
    realWorldMetric?: string;
}

export type CommsStatus = 'AWAITING SIGNAL' | 'RECEIVING...' | 'DECODING...' | 'TRANSMISSION COMPLETE' | 'SIGNAL LOST';

export interface Memory {
    id: string;
    content: string;
    timestamp: number;
    pillarContext: string;
}

export interface AppSettings {
    memoryConsent: boolean;
}

export interface FailurePrediction {
    probability: number;
    estTimeToDecoherence: string;
    primaryRiskFactor: string;
    recommendedIntervention: string;
    severity: 'STABLE' | 'MODERATE' | 'CRITICAL';
    forecastTrend: 'ASCENDING' | 'DESCENDING' | 'STABLE';
}

export interface CausalStrategy {
    title: string;
    totalConfidence: number;
    entropicCost: number;
    steps: {
        id: string;
        label: string;
        description: string;
        probability: number;
        impact: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
}

export interface DiagnosticStep {
    id: string;
    label: string;
    status: 'PENDING' | 'ACTIVE' | 'SUCCESS' | 'ERROR';
    progress: number;
    sublogs: string[];
}

export type DiagnosticStatus = 'IDLE' | 'SCANNING' | 'PARITY_CHECK' | 'COMPLETED';

export interface Scenario {
    name: string;
    description: string;
    params: {
        decoherenceChance: number;
        lesionChance: number;
    };
}

export interface GlobalResonanceState {
    aggregateRho: number;
    activeArchitects: number;
    fieldStatus: 'STABLE' | 'RESONATING' | 'DECOHERING';
    globalCarrierFrequency: number;
    communities: CommunityData[];
}

export interface CommunityData {
    id: string;
    name: string;
    rho: number;
    coherence: number;
    stability: number;
    activeNodes: number;
    lastEvent: string;
    location: { x: number, y: number };
}

export interface InstitutionalEntity {
    id: string;
    name: string;
    type: 'BANK' | 'GOVERNMENT' | 'RESEARCH';
    observing: boolean;
    trustScore: number;
}

export interface SchematicNode {
    id: string;
    label: string;
    type: 'CORE' | 'BRIDGE' | 'SENSOR' | 'GATEWAY';
    status: 'OPTIMAL' | 'LOCKED' | 'OFFLINE';
    dependencies: string[];
}

export interface VoiceInteraction {
    id: string;
    user: string;
    sophia: string;
    timestamp: number;
}

export interface SystemState {
  userResources: UserResources;
  auth: AuthState;
  quantumHealing: QuantumHealingData;
  performance: PerformanceTelemetry;
  holisticAlignmentScore: number;
  resonanceFactorRho: number;
  selfCorrectionField: number;
  resonanceCoherence: ResonanceCoherenceData;
  harmonicInterference: HarmonicInterferenceData;
  lyranConcordance: LyranConcordanceData;
  satelliteUplink: SatelliteUplinkData;
  galacticRelayNetwork: Record<string, GalacticRelay>;
  biometricSync: BiometricSyncData;
  vibration: VibrationData;
  aethericTransfer: AethericTransferData;
  schumannResonance: SchumannResonanceData;
  earthGrounding: EarthGroundingData;
  tesseract: TesseractData;
  bohrEinsteinCorrelator: BohrEinsteinCorrelatorData;
  coherenceResonance: CoherenceResonanceData;
  abundanceCore: AbundanceCoreData;
  dilutionRefrigerator: DilutionRefrigeratorData;
  governanceAxiom: string;
  supernovaTriforce: SupernovaTriforceData;
  pillars: Record<PillarId, PillarData>;
  temporalCoherenceDrift: number;
  log: LogEntry[];
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  isPhaseLocked: boolean;
  ingestedModules: IngestedModule[];
  globalResonance: GlobalResonanceState;
}
