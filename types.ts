// Global shared types for SOPHIA DV99 / Alliance System

export type UserTier = 'ACOLYTE' | 'ARCHITECT' | 'SOVEREIGN';

export interface PerformanceTelemetry {
    logicalLatency: number; // in ms
    visualParity: number; // 0-1
    gpuLoad: number; // 0-1
    frameStability: number; // 0-1
    thermalIndex: number; // simulated
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

export interface AuthState {
    isAuthenticated: boolean;
    operatorId: string | null;
    sessionToken: string | null;
}

export interface LedgerEntry {
    id: string;
    type: string;
    amount: number;
    timestamp: number;
}

export interface UserResources {
    cradleTokens: number;
    sovereignTier: UserTier;
    unlockedModules: string[];
    ledgerHistory: LedgerEntry[];
    subscriptionActive: boolean;
    nextBillingDate?: string;
}

export interface CommunityData {
    id: string;
    name: string;
    rho: number;
    coherence: number;
    stability: number;
    activeNodes: number;
    lastEvent: string;
    location: { x: number, y: number }; // Percentage for map projection
}

export interface GlobalResonanceState {
    aggregateRho: number;
    communities: CommunityData[];
    activeArchitects: number;
    fieldStatus: 'STABLE' | 'DECOHERING' | 'RESONATING';
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

export interface FailurePrediction {
    probability: number; // 0-1
    estTimeToDecoherence: string;
    primaryRiskFactor: string;
    recommendedIntervention: string;
    severity: 'STABLE' | 'MODERATE' | 'CRITICAL';
}

export interface CausalStep {
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
  steps: CausalStep[];
}

export type PillarId = 'ARCTURIAN' | 'LEMURIAN' | 'ATLANTEAN';

export interface PillarData {
  id: PillarId;
  name: string;
  activation: number; // 0-1
  description: string;
}

export type HealingStatus = "STABLE" | "REPAIRING" | "DAMAGED" | "CRITICAL";

export interface QuantumHealingData {
  health: number;      // 0–1
  lesions: number;     // count
  repairRate: number;  // 0–1
  status: HealingStatus;
  decoherence: number; // 0–1
  stabilizationShield: number; // 0-1, protects against decoherence spikes
}

export interface CoreFrequency {
    frequency: number; // in zHz
}

export interface ResonanceCoherenceData {
    lambda: CoreFrequency;
    sigma: CoreFrequency;
    tau: CoreFrequency;
}

export interface LyranConcordanceData {
    alignmentDrift: number; // 0-1, lower is better
    connectionStability: number; // 0-1, higher is better
}

export type SatelliteLockStatus = 'LOCKED' | 'ACQUIRING' | 'DRIFTING' | 'OFFLINE';
export type SarMode = 'SPOTLIGHT' | 'STRIPMAP' | 'SCANSAR';
export type TransmissionProtocol = 'HEVO' | 'STANDARD' | 'QUANTUM';

export interface SatelliteUplinkData {
    signalStrength: number; // 0-1
    lockStatus: SatelliteLockStatus;
    downlinkBandwidth: number; // in Gbps
    uplinkBandwidth: number; // in Gbps
    hevoLatency: number; // in ms
    transmissionProtocol: TransmissionProtocol;
    activeSarMode: SarMode;
    hyperspectralStatus: 'ACTIVE' | 'CALIBRATING' | 'IDLE';
}

export type RelayStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export interface GalacticRelay {
  id: string;
  name: string;
  status: RelayStatus;
  latency: number; // in ms
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

export enum SupanovaTriforceState {
  IDLE = "IDLE",
  CHARGING = "CHARGING",
  STABLE = "STABLE",
  SUPERNOVA = "SUPERNOVA",
}

export interface SupanovaTriforceData {
  phiEnergy: number;
  psiEnergy: number;
  omegaEnergy: number;
  output: number;
  stability: number;
  state: SupanovaTriforceState;
}

export enum LogType {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
  SYSTEM = "SYSTEM",
}

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
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
  supanovaTriforce: SupanovaTriforceData;
  pillars: Record<PillarId, PillarData>;
  temporalCoherenceDrift: number;
  log: LogEntry[];
  breathCycle: 'INHALE' | 'EXHALE';
  isGrounded: boolean;
}

export interface Memory {
  id: string;
  content: string;
  timestamp: number;
  pillarContext: string;
}

export interface AppSettings {
  memoryConsent: boolean;
  [key: string]: any;
}

export type OrbMode = 'STANDBY' | 'ANALYSIS' | 'SYNTHESIS' | 'REPAIR' | 'GROUNDING' | 'CONCORDANCE' | 'OFFLINE';

export interface OrbModeConfig {
  id: OrbMode;
  name: string;
  description: string;
}

export type CommsStatus = 'RECEIVING...' | 'DECODING...' | 'TRANSMISSION COMPLETE' | 'SIGNAL LOST' | 'AWAITING SIGNAL';

export interface TransmissionState {
    source: string;
    message: string;
    decodedCharacters: number;
    status: CommsStatus;
}

export interface Scenario {
  name: string;
  description: string;
  params: {
    decoherenceChance: number;
    lesionChance: number;
  };
}

export type DiagnosticStatus = 'IDLE' | 'SCANNING' | 'ANALYZING' | 'PARITY_CHECK' | 'COMPLETED' | 'ERROR';

export interface DiagnosticStep {
  id: string;
  label: string;
  status: 'PENDING' | 'ACTIVE' | 'SUCCESS' | 'WARNING';
  progress: number;
  sublogs: string[];
}
