
import React from 'react';
import { ThreeElements } from '@react-three/fiber';

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
  
  namespace JSX {
    interface IntrinsicElements {
        // React Three Fiber elements
        ambientLight: any;
        pointLight: any;
        group: any;
        mesh: any;
        sphereGeometry: any;
        meshBasicMaterial: any;
        cylinderGeometry: any;
        gridHelper: any;
        color: any;

        [elemName: string]: any;
    }
  }
}

export type UserTier = 'ACOLYTE' | 'ARCHITECT' | 'SOVEREIGN' | 'LEGACY_MENERVA';

export interface NegotiationNode {
    id: string;
    target: 'SINGAPORE_NODE' | 'SWISS_NODE' | 'LONDON_NODE';
    status: 'NEGOTIATING' | 'VERIFYING_STERILITY' | 'CONTRACT_READY' | 'INCINERATED';
    ripeness: number; // 0-1
    lastHeuristic: string;
}

export interface EstateTelemetry {
    id: string;
    site: 'LEYDENS_HILL' | 'KINGSCLIFF';
    spatialVolumeSv: number;
    lidarDensity: number;
    pulleyParity: number; // 400lb capacity sync
    lastDroneScan: number;
}

export interface VibrationalShieldState {
    globalFrequency: number; // Hz
    blockedShadowAttempts: number;
    lastIncineratedSignature: string;
    vibrationStatus: 'PURE' | 'INTERFERENCE_DETECTED' | 'INCINERATING';
}

export type OrbMode = 'STANDBY' | 'ANALYSIS' | 'SYNTHESIS' | 'REPAIR' | 'GROUNDING' | 'CONCORDANCE' | 'OFFLINE';

export enum LogType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    CRITICAL = 'CRITICAL',
    SYSTEM = 'SYSTEM'
}

// Missing types added for application-wide consistency

export interface OrbModeConfig {
  id: OrbMode;
  name: string;
  description: string;
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

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
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
    steps: Array<{
        id: string;
        label: string;
        description: string;
        probability: number;
        impact: 'LOW' | 'MEDIUM' | 'HIGH';
    }>;
}

export type CommsStatus = 'AWAITING SIGNAL' | 'RECEIVING...' | 'DECODING...' | 'TRANSMISSION COMPLETE' | 'SIGNAL LOST';

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

export interface PerformanceTelemetry {
    logicalLatency: number;
    visualParity: number;
    gpuLoad: number;
    frameStability: number;
    thermalIndex: number;
    throughput: number;
    memoryUsage: number;
}

export interface QuantumHealingData {
    health: number;
    lesions: number;
    repairRate?: number;
    status: string;
    decoherence: number;
    stabilizationShield: number;
}

export type CipherSuite = 'AES-256-GCM' | 'CRYSTALS-KYBER' | 'DILITHIUM' | 'FALCON' | 'SPHINCS+';

export interface HybridSecurityLayer {
    id: string;
    type: 'CLASSICAL' | 'POST_QUANTUM';
    algorithm: CipherSuite;
    status: string;
    entropyBitDepth: number;
}

export interface HybridSecurityState {
    globalPosture: string;
    activeLayers: HybridSecurityLayer[];
    quantumResistanceScore: number;
    threatMitigationIndex: number;
    lastHardenTimestamp: number;
}

export interface HarmonicNode {
    frequency: number;
    amplitude: number;
    phase: number;
    harmonicIndex: number;
}

export interface ResonanceCoherenceData {
    lambda: HarmonicNode;
    sigma: HarmonicNode;
    tau: HarmonicNode;
}

export interface HarmonicInterferenceData {
    beatFrequency: number;
    constructiveInterference: number;
    destructiveInterference: number;
    standingWaveRatio: number;
}

export interface LyranConcordanceData {
    alignmentDrift: number;
    connectionStability: number;
}

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

export type SyncStatus = 'SYNCHRONIZED' | 'CALIBRATING' | 'UNSTABLE' | 'DECOUPLED';

export interface BiometricSyncData {
    hrv: number;
    coherence: number;
    status: SyncStatus;
}

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

export interface ResonanceIntelligenceEntry {
    id: string;
    timestamp: number;
    interpretation: string;
    directive: string;
    metricsAtTime: { rho: number; coherence: number; entropy: number };
}

export interface CoherenceResonanceData {
    score: number;
    entropyFlux: number;
    phaseSync: number;
    quantumCorrelation: number;
    status: 'COHERENT' | 'RESONATING' | 'DECOHERING' | 'CRITICAL';
    intelligenceLog: ResonanceIntelligenceEntry[];
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

export enum SupernovaTriforceState {
    STABLE = 'STABLE',
    CHARGING = 'CHARGING',
    SUPERNOVA = 'SUPERNOVA',
    IDLE = 'IDLE'
}

export interface SupernovaTriforceData {
    phiEnergy: number;
    psiEnergy: number;
    omegaEnergy: number;
    output: number;
    stability: number;
    state: SupernovaTriforceState;
}

export type PillarId = 'ARCTURIAN' | 'LEMURIAN' | 'ATLANTEAN';

export interface PillarData {
    id: PillarId;
    name: string;
    activation: number;
    description: string;
}

export interface IngestedModule {
    id: string;
    name: string;
    originProject: 'MENERVA' | 'AETHERIOS';
    status: 'MOUNTED' | 'SYNCING';
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
    location: { x: number; y: number };
}

export interface GlobalResonanceState {
    aggregateRho: number;
    activeArchitects: number;
    globalCarrierFrequency: number;
    fieldStatus: 'STABLE' | 'RESONATING' | 'DECOHERING';
    communities: CommunityData[];
}

export interface SchematicNode {
    id: string;
    label: string;
    type: string;
    status: string;
    dependencies: string[];
}

export interface InstitutionalEntity {
    id: string;
    name: string;
    type: 'BANK' | 'GOVERNMENT';
    observing: boolean;
    trustScore: number;
}

export interface DiagnosticStep {
    id: string;
    label: string;
    status: 'PENDING' | 'ACTIVE' | 'SUCCESS';
    progress: number;
    sublogs: string[];
}

export type DiagnosticStatus = 'SCANNING' | 'PARITY_CHECK' | 'COMPLETED';

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

export interface LedgerTransaction {
    id: string;
    hash: string;
    type: string;
    amount: number;
    currency: string;
    timestamp: number;
    status: string;
    counterparty: string;
}

export interface Collaborator {
    id: string;
    name: string;
    role: string;
    status: string;
    specialty: string;
    clearance: UserTier;
}

export interface Scenario {
    name: string;
    description: string;
    params: { decoherenceChance: number; lesionChance: number };
}

export interface VoiceInteraction {
    id: string;
    user: string;
    sophia: string;
    timestamp: number;
}

export interface SanctuaryState {
    lightingZone: 'ZEN' | 'FOCUS' | 'ENTERTAIN' | 'OFF';
    climate: { temp: number; humidity: number; mode: 'COOL' | 'HEAT' | 'ECO' };
    security: { status: 'ARMED_STAY' | 'ARMED_AWAY' | 'DISARMED'; perimeter: 'SECURE' | 'BREACH' };
    activeMedia: string;
}

export interface VehicleTelemetry {
    id: string;
    model: 'ROLLS_ROYCE_CULLINAN';
    status: 'PARKED' | 'TRANSIT' | 'IDLE';
    location: { lat: number; lng: number; label: string };
    cabinTemp: number;
    fuelLevel: number;
    securityLink: 'ENCRYPTED' | 'SEARCHING';
}

export type TimelineType = 'GOLDEN' | 'INERTIAL' | 'SHADOW';

export interface ChronosState {
    activeTimeline: TimelineType;
    projectedRho: number;
    timelineStability: number;
    anchorStatus: 'UNLOCKED' | 'ANCHORING' | 'LOCKED';
    butterflyVariance: number; // 0-1, how much a small change affects output
    forecastHorizon: number; // Days into future
}

export interface SystemState {
  userResources: {
    cradleTokens: number;
    sovereignTier: UserTier;
    sovereignLiquidity: number; 
    manifestPulse: number; 
    unlockedModules: string[];
    ledgerHistory: any[];
    subscriptionActive: boolean;
    menervaLegacyPoints: number;
  };
  performance: PerformanceTelemetry;
  auth: {
    isAuthenticated: boolean;
    isBioVerified: boolean;
    operatorId: string;
    sessionToken: string;
  };
  agenticOrchestrator: {
    activeNegotiations: NegotiationNode[];
    isAutonomicActive: boolean;
  };
  estateCommander: EstateTelemetry[];
  sanctuary: SanctuaryState; 
  vehicle: VehicleTelemetry; 
  chronos: ChronosState; // New Chronos Engine State
  vibrationalShield: VibrationalShieldState;
  resonanceFactorRho: number;
  temporalCoherenceDrift: number;
  quantumHealing: QuantumHealingData;
  biometricSync: BiometricSyncData;
  governanceAxiom: string;
  log: LogEntry[];
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  hybridSecurity: HybridSecurityState;
  holisticAlignmentScore: number;
  selfCorrectionField: number;
  resonanceCoherence: ResonanceCoherenceData;
  harmonicInterference: HarmonicInterferenceData;
  lyranConcordance: LyranConcordanceData;
  satelliteUplink: SatelliteUplinkData;
  galacticRelayNetwork: Record<string, GalacticRelay>;
  vibration: VibrationData;
  aethericTransfer: AethericTransferData;
  schumannResonance: SchumannResonanceData;
  earthGrounding: EarthGroundingData;
  tesseract: TesseractData;
  bohrEinsteinCorrelator: BohrEinsteinCorrelatorData;
  coherenceResonance: CoherenceResonanceData;
  abundanceCore: AbundanceCoreData;
  dilutionRefrigerator: DilutionRefrigeratorData;
  supernovaTriforce: SupernovaTriforceData;
  pillars: Record<PillarId, PillarData>;
  isPhaseLocked: boolean;
  ingestedModules: IngestedModule[];
  globalResonance: GlobalResonanceState;
  legalEstate: {
    abnTrustId: string;
    wrapperStatus: string;
    inheritanceNodes: any[];
    legalHash: string;
  };
  lidarTelemetry: {
    siteId: string;
    pointCloudStability: number;
    droneUplinkStatus: string;
    lastScanTimestamp: number;
    constructionProgress: number;
  };
}
