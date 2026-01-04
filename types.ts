
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
}

export type UserTier = 'ACOLYTE' | 'ARCHITECT' | 'SOVEREIGN' | 'LEGACY_MENERVA';

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

export interface SystemState {
  userResources: UserResources;
  auth: AuthState;
  quantumHealing: QuantumHealingData;
  performance: PerformanceTelemetry;
  holisticAlignmentScore: number;
  resonanceFactorRho: number;
  selfCorrectionField: number;
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
  temporalCoherenceDrift: number;
  log: LogEntry[];
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
  isPhaseLocked: boolean;
  ingestedModules: IngestedModule[];
}

export interface AuthState {
    isAuthenticated: boolean;
    operatorId: string | null;
    sessionToken: string | null;
}

export interface UserResources {
    cradleTokens: number;
    sovereignTier: UserTier;
    unlockedModules: string[];
    ledgerHistory: LedgerEntry[];
    subscriptionActive: boolean;
    stripeCustomerId?: string;
    menervaLegacyPoints: number;
}

export interface LedgerEntry {
    id: string;
    type: string;
    amount: number;
    timestamp: number;
    projectOrigin: 'MENERVA' | 'AETHERIOS';
}

export interface QuantumHealingData {
  health: number;
  lesions: number;
  repairRate: number;
  status: "STABLE" | "REPAIRING" | "DAMAGED";
  decoherence: number;
  stabilizationShield: number;
}

export interface CoreFrequency {
    frequency: number;
}

export interface ResonanceCoherenceData {
    lambda: CoreFrequency;
    sigma: CoreFrequency;
    tau: CoreFrequency;
}

export interface LyranConcordanceData {
    alignmentDrift: number;
    connectionStability: number;
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

export type SyncStatus = 'SYNCHRONIZED' | 'CALIBRATING' | 'UNSTABLE' | 'DECOUPLED';

export interface BiometricSyncData {
    hrv: number;
    coherence: number;
    status: SyncStatus;
}

export type VibrationStatus = 'HARMONIC' | 'DISCORDANT' | 'CRITICAL';

export interface VibrationData {
    amplitude: number;
    frequency: number;
    resonanceStatus: VibrationStatus;
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

export interface EarthGroundingData {
    charge: number;
    conductivity: number;
    status: 'CHARGING' | 'DISCHARGING' | 'STABLE' | 'WEAK';
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
    metricsAtTime: {
        rho: number;
        coherence: number;
        entropy: number;
    };
}

export interface AbundanceCoreData {
    flow: number;
    generosity: number;
    status: 'EXPANDING' | 'STABLE' | 'CONTRACTING';
}

export type DilutionRefrigeratorStatus = 'STABLE' | 'UNSTABLE' | 'BOOSTED' | 'OFFLINE';

export interface DilutionRefrigeratorData {
    temperature: number;
    status: DilutionRefrigeratorStatus;
    coolingPower: number;
}

export enum SupernovaTriforceState {
  IDLE = "IDLE",
  CHARGING = "CHARGING",
  STABLE = "STABLE",
  SUPERNOVA = "SUPERNOVA",
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

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
}

export enum LogType {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
  SYSTEM = "SYSTEM",
}

export type CommsStatus = 'AWAITING SIGNAL' | 'RECEIVING...' | 'DECODING...' | 'TRANSMISSION COMPLETE' | 'SIGNAL LOST';

export interface TransmissionState {
    source: string;
    message: string;
    decodedCharacters: number;
    status: CommsStatus;
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

export type OrbMode = 'STANDBY' | 'ANALYSIS' | 'SYNTHESIS' | 'REPAIR' | 'GROUNDING' | 'CONCORDANCE' | 'OFFLINE';

export interface OrbModeConfig {
  id: OrbMode;
  name: string;
  description: string;
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
  status: 'PENDING' | 'ACTIVE' | 'SUCCESS' | 'WARNING';
  progress: number;
  sublogs?: string[];
}

export type DiagnosticStatus = 'IDLE' | 'SCANNING' | 'ANALYZING' | 'PARITY_CHECK' | 'COMPLETED' | 'ERROR';

export interface SchematicNode {
    id: string;
    label: string;
    type: 'CORE' | 'SENSOR' | 'GATEWAY' | 'BRIDGE';
    status: 'OPTIMAL' | 'DEGRADED' | 'LOCKED';
    dependencies: string[];
}

export interface Scenario {
    name: string;
    description: string;
    params: {
        decoherenceChance: number;
        lesionChance: number;
    };
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
    fieldStatus: 'STABLE' | 'RESONATING' | 'DECOHERING';
    communities: CommunityData[];
}

export interface Collaborator {
    id: string;
    name: string;
    role: string;
    status: 'ONLINE' | 'SYNCHRONIZING' | 'IDLE';
    specialty: string;
    clearance: UserTier;
}

export interface InstitutionalEntity {
    id: string;
    name: string;
    type: 'BANK' | 'GOVERNMENT' | 'CORPORATION';
    observing: boolean;
    trustScore: number;
}
