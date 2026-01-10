
import React from 'react';
import { ThreeElements } from '@react-three/fiber';

// Global shared types for SOPHIA DV99 / Alliance System

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

  /* Fix for Three.js JSX intrinsic elements errors by extending both global and React JSX namespaces */
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

export type UserTier = 'ACOLYTE' | 'ARCHITECT' | 'SOVEREIGN' | 'LEGACY_MENERVA';

export type CipherSuite = 'AES-256-GCM' | 'CRYSTALS-KYBER' | 'DILITHIUM' | 'FALCON' | 'SPHINCS+';

export interface CryptoLayer {
    id: string;
    type: 'CLASSICAL' | 'POST_QUANTUM';
    algorithm: CipherSuite;
    status: 'ACTIVE' | 'CALIBRATING' | 'DEGRADED';
    entropyBitDepth: number;
}

export interface HybridSecurityState {
    globalPosture: 'STABLE' | 'QUANTUM_READY' | 'VULNERABLE';
    activeLayers: CryptoLayer[];
    quantumResistanceScore: number; 
    threatMitigationIndex: number;
    lastHardenTimestamp: number;
}

export interface UserResources {
    cradleTokens: number;
    sovereignTier: UserTier;
    unlockedModules: string[];
    ledgerHistory: any[];
    subscriptionActive: boolean;
    menervaLegacyPoints: number;
    sovereignLiquidity: number; 
    manifestPulse: number; 
}

export interface AuthState {
    isAuthenticated: boolean;
    isBioVerified: boolean; 
    operatorId: string;
    sessionToken: string;
}

export interface LegalEstateBinding { 
    abnTrustId: string;
    wrapperStatus: 'SEALED' | 'EXECUTING' | 'PENDING';
    inheritanceNodes: { id: string, name: string, maturity: string, status: 'STASIS' | 'LIQUID' }[];
    legalHash: string;
}

export interface LidarTelemetry { 
    siteId: string;
    pointCloudStability: number;
    droneUplinkStatus: 'ACTIVE' | 'OFFLINE';
    lastScanTimestamp: number;
    constructionProgress: number;
}

export interface LogEntry {
    id: string;
    type: LogType;
    message: string;
    timestamp: number;
}

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

export interface CausalStrategyStep {
    id: string;
    label: string;
    description: string;
    probability: number;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CausalStrategy {
    title: string;
    totalConfidence: number;
    entropicCost: number;
    steps: CausalStrategyStep[];
}

export interface TesseractData {
    flux: number;
    stability: number;
    activeVector: string;
    integrity: number;
}

export type CommsStatus = 'AWAITING SIGNAL' | 'RECEIVING...' | 'DECODING...' | 'TRANSMISSION COMPLETE' | 'SIGNAL LOST';

export interface PillarData {
    id: PillarId;
    name: string;
    activation: number;
    description: string;
}

export type PillarId = 'ARCTURIAN' | 'LEMURIAN' | 'ATLANTEAN';

export interface HarmonicMetric {
    frequency: number;
    amplitude: number;
    phase: number;
    harmonicIndex: number;
}

export interface ResonanceCoherenceData {
    lambda: HarmonicMetric;
    sigma: HarmonicMetric;
    tau: HarmonicMetric;
}

export interface LyranConcordanceData {
    alignmentDrift: number;
    connectionStability: number;
}

export type SyncStatus = 'SYNCHRONIZED' | 'CALIBRATING' | 'UNSTABLE' | 'DECOUPLED';

export interface BiometricSyncData {
    hrv: number;
    coherence: number;
    status: SyncStatus;
}

export type AethericTransferStatus = 'STABLE' | 'TURBULENT' | 'STAGNANT';

export interface AethericTransferData {
    efficiency: number;
    particleDensity: number;
    fluxStatus: AethericTransferStatus;
    entropy: number;
}

export type SchumannResonanceStatus = 'NOMINAL' | 'ELEVATED' | 'SUPPRESSED';

export interface SchumannResonanceData {
    liveFrequency: number;
    intensity: number;
    status: SchumannResonanceStatus;
}

export interface BohrEinsteinCorrelatorData {
    correlation: number;
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

export type SatelliteLockStatus = 'LOCKED' | 'ACQUIRING' | 'DRIFTING' | 'OFFLINE';

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

export interface GalacticRelay {
    id: string;
    name: string;
    status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    latency: number;
}

export enum SupernovaTriforceState {
    IDLE = 'IDLE',
    CHARGING = 'CHARGING',
    STABLE = 'STABLE',
    SUPERNOVA = 'SUPERNOVA'
}

export interface SupernovaTriforceData {
    phiEnergy: number;
    psiEnergy: number;
    omegaEnergy: number;
    output: number;
    stability: number;
    state: SupernovaTriforceState;
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
    status: 'MOUNTED' | 'SYNCING' | 'OFFLINE';
    entryPoint: string;
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

export interface GlobalResonanceState {
    aggregateRho: number;
    activeArchitects: number;
    globalCarrierFrequency: number;
    fieldStatus: 'STABLE' | 'RESONATING' | 'DECOHERING';
    communities: CommunityData[];
}

export interface HarmonicInterferenceData {
    beatFrequency: number;
    constructiveInterference: number;
    destructiveInterference: number;
    standingWaveRatio: number;
}

export interface ResonanceIntelligenceEntry {
    id: string;
    timestamp: number;
    interpretation: string;
    directive: string;
    metricsAtTime: { rho: number, coherence: number, entropy: number };
}

export interface VoiceInteraction {
    id: string;
    user: string;
    sophia: string;
    timestamp: number;
}

export interface QuantumHealingData {
    health: number;
    lesions: number;
    repairRate: number;
    status: string;
    decoherence: number;
    stabilizationShield: number;
}

export interface DiagnosticStep {
    id: string;
    label: string;
    status: 'PENDING' | 'ACTIVE' | 'SUCCESS' | 'ERROR';
    progress: number;
    sublogs: string[];
}

export type DiagnosticStatus = 'SCANNING' | 'PARITY_CHECK' | 'COMPLETED';

export interface SchematicNode {
    id: string;
    label: string;
    type: 'CORE' | 'BRIDGE' | 'SENSOR' | 'GATEWAY';
    status: 'OPTIMAL' | 'LOCKED' | 'DEGRADED';
    dependencies: string[];
}

export interface LedgerTransaction {
    id: string;
    hash: string;
    type: 'SYSTEM_UPGRADE' | 'RESOURCE_TRANSFER' | 'CREDENTIAL_LOCK';
    amount: number;
    currency: string;
    timestamp: number;
    status: 'VERIFIED' | 'PENDING' | 'REJECTED';
    counterparty: string;
}

export interface DynastyEpoch {
    id: number;
    label: string;
    startBlock: number;
    endBlock: number;
    sovereignId: string;
    totalVolume: number;
    resonanceAvg: number;
    status: 'SEALED' | 'ACTIVE';
    transactions: LedgerTransaction[];
}

export type VibrationStatus = 'HARMONIC' | 'DISCORDANT' | 'CRITICAL';

export interface VibrationData {
    amplitude: number;
    frequency: number;
    resonanceStatus: VibrationStatus;
}

/* Added missing exported members to fix import errors across components */

export interface Scenario {
    name: string;
    description: string;
    params: {
        decoherenceChance: number;
        lesionChance: number;
    };
}

export interface CoherenceResonanceData {
    score: number;
    status: string;
    intelligenceLog: ResonanceIntelligenceEntry[];
    entropyFlux: number;
    phaseSync: number;
    quantumCorrelation: number;
}

export interface EarthGroundingData {
    charge: number;
    conductivity: number;
    status: string;
    seismicActivity: number;
    telluricCurrent: number;
    feedbackLoopStatus: string;
}

export interface AbundanceCoreData {
    flow: number;
    generosity: number;
    status: string;
}

export type DilutionRefrigeratorStatus = 'STABLE' | 'UNSTABLE' | 'BOOSTED' | 'OFFLINE';

export interface DilutionRefrigeratorData {
    temperature: number;
    status: DilutionRefrigeratorStatus;
    coolingPower: number;
}

export interface Collaborator {
    id: string;
    name: string;
    role: string;
    status: string;
    specialty: string;
    clearance: UserTier;
}

export interface InstitutionalEntity {
    id: string;
    name: string;
    type: 'BANK' | 'GOVERNMENT' | 'RESEARCH';
    observing: boolean;
    trustScore: number;
}

export interface SystemState {
  userResources: UserResources;
  auth: AuthState;
  legalEstate: LegalEstateBinding;
  lidarTelemetry: LidarTelemetry;
  quantumHealing: QuantumHealingData;
  performance: PerformanceTelemetry;
  resonanceFactorRho: number;
  temporalCoherenceDrift: number;
  resonanceCoherence: ResonanceCoherenceData;
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
  log: LogEntry[];
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  isPhaseLocked: boolean;
  ingestedModules: IngestedModule[];
  globalResonance: GlobalResonanceState;
  hybridSecurity: HybridSecurityState;
  harmonicInterference: HarmonicInterferenceData;
  holisticAlignmentScore: number;
  selfCorrectionField: number;
}

export interface OrbModeConfig {
    id: string;
    name: string;
    description: string;
}

export type OrbMode = 'STANDBY' | 'ANALYSIS' | 'SYNTHESIS' | 'REPAIR' | 'GROUNDING' | 'CONCORDANCE' | 'OFFLINE';

export enum LogType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    CRITICAL = 'CRITICAL',
    SYSTEM = 'SYSTEM'
}
