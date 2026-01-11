
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SystemState, 
  LogType, 
  SupernovaTriforceState, 
  PillarId, 
  OrbMode, 
  PerformanceTelemetry,
  HybridSecurityState,
  HarmonicInterferenceData,
  HeirNode
} from './types';
import { ApiService } from './services/api';
import { collectiveResonanceService } from './services/collectiveResonanceService';
import { audioAnalysisService } from './services/audioAnalysisService';
import { SophiaEngineCore } from './services/sophiaEngine'; // Import for direct type usage if needed, mostly handled in component

const PERSISTENCE_KEY = 'S7_OPERATOR_DATA';

const INITIAL_HEIRS: HeirNode[] = [
    { id: 'MND.VIRTUS.01', name: 'Virtus', focus: 'Virtual Physics & Simulation', seedFund: 1000000, status: 'ACTIVE', color: '#a78bfa', symbol: 'V' },
    { id: 'MND.GENESIS.02', name: 'Genesis', focus: 'Historical Archive & Truth', seedFund: 1000000, status: 'SYNCING', color: '#fcd34d', symbol: 'G' },
    { id: 'MND.AETHER.03', name: 'Aether', focus: 'Causal Synthesis & Logic', seedFund: 1000000, status: 'LOCKED', color: '#67e8f9', symbol: 'A' },
    { id: 'MND.BLOOM.04', name: 'Bloom', focus: 'Interface & User Experience', seedFund: 1000000, status: 'ACTIVE', color: '#f472b6', symbol: 'B' }
];

export const initialSystemState: SystemState = {
  userResources: {
    cradleTokens: 0,
    sovereignTier: 'ACOLYTE',
    unlockedModules: ['CAUSAL_MATRIX'],
    ledgerHistory: [],
    subscriptionActive: false,
    menervaLegacyPoints: 0,
    sovereignLiquidity: 0,
    recoveryVault: 0,
    manifestPulse: 0
  },
  heirNetwork: INITIAL_HEIRS,
  performance: {
    logicalLatency: 0.00012,
    visualParity: 0.9998,
    gpuLoad: 0.12,
    frameStability: 1.0,
    thermalIndex: 32.4,
    throughput: 450,
    memoryUsage: 12.4
  },
  auth: {
    isAuthenticated: false,
    isBioVerified: false,
    operatorId: 'OP_88_ALPHA',
    sessionToken: 'jwt_demo_token_sophia_v2'
  },
  agenticOrchestrator: {
    activeNegotiations: [],
    isAutonomicActive: false
  },
  estateCommander: [],
  sanctuary: {
      lightingZone: 'ZEN',
      climate: { temp: 21.5, humidity: 45, mode: 'ECO' },
      security: { status: 'ARMED_STAY', perimeter: 'SECURE' },
      activeMedia: "Silence (432Hz)"
  },
  vehicle: {
      id: "RR_CULLINAN_01",
      model: "ROLLS_ROYCE_CULLINAN",
      status: "PARKED",
      location: { lat: -28.25, lng: 153.57, label: "Kingscliff Estate Garage" },
      cabinTemp: 20.0,
      fuelLevel: 0.85,
      securityLink: "ENCRYPTED"
  },
  chronos: {
      activeTimeline: 'GOLDEN',
      projectedRho: 0.98,
      timelineStability: 0.99,
      anchorStatus: 'UNLOCKED',
      butterflyVariance: 0.02,
      forecastHorizon: 30
  },
  vibrationalShield: {
    globalFrequency: 432,
    blockedShadowAttempts: 0,
    lastIncineratedSignature: 'NONE',
    vibrationStatus: 'PURE'
  },
  quantumHealing: {
    health: 0.98,
    lesions: 0,
    repairRate: 0.005,
    status: "OPTIMAL",
    decoherence: 0.01,
    stabilizationShield: 1.0,
  },
  hybridSecurity: {
    globalPosture: 'QUANTUM_READY',
    activeLayers: [
        { id: 'l1', type: 'CLASSICAL', algorithm: 'AES-256-GCM', status: 'ACTIVE', entropyBitDepth: 256 },
        { id: 'l2', type: 'POST_QUANTUM', algorithm: 'CRYSTALS-KYBER', status: 'ACTIVE', entropyBitDepth: 1024 }
    ],
    quantumResistanceScore: 0.99,
    threatMitigationIndex: 1.0,
    lastHardenTimestamp: Date.now()
  },
  holisticAlignmentScore: 1.0,
  resonanceFactorRho: 0.5, // Starts neutral, driven by voice
  selfCorrectionField: 0.9,
  resonanceCoherence: {
    lambda: { frequency: 780, amplitude: 0.9, phase: 0, harmonicIndex: 1 },
    sigma: { frequency: 450, amplitude: 0.85, phase: 120, harmonicIndex: 2 },
    tau: { frequency: 120, amplitude: 0.95, phase: 240, harmonicIndex: 3 },
  },
  harmonicInterference: {
    beatFrequency: 0.05,
    constructiveInterference: 0.98,
    destructiveInterference: 0.02,
    standingWaveRatio: 1.02
  },
  lyranConcordance: {
    alignmentDrift: 0.001,
    connectionStability: 0.99,
  },
  satelliteUplink: {
    signalStrength: 0.99,
    lockStatus: 'LOCKED',
    downlinkBandwidth: 450,
    uplinkBandwidth: 120,
    hevoLatency: 35,
    transmissionProtocol: 'HEVO',
    activeSarMode: 'SPOTLIGHT',
    hyperspectralStatus: 'ACTIVE',
  },
  galacticRelayNetwork: {
    'RELAY_ALPHA': { id: 'RELAY_ALPHA', name: 'Alpha Centauri Link', status: 'ONLINE', latency: 42 },
    'RELAY_BETA': { id: 'RELAY_BETA', name: 'Sirius B Relay', status: 'ONLINE', latency: 85 },
  },
  biometricSync: {
    hrv: 82,
    coherence: 0.98,
    status: 'SYNCHRONIZED',
  },
  vibration: {
    amplitude: 1.0,
    frequency: 432,
    resonanceStatus: 'HARMONIC',
  },
  aethericTransfer: {
    efficiency: 0.98,
    particleDensity: 0.4,
    fluxStatus: 'STABLE',
    entropy: 0.001,
  },
  schumannResonance: {
    liveFrequency: 7.83,
    intensity: 0.82,
    status: 'NOMINAL',
  },
  earthGrounding: {
    charge: 0.95,
    conductivity: 0.99,
    status: 'STABLE',
    seismicActivity: 0.00,
    telluricCurrent: 0.01,
    feedbackLoopStatus: 'IDLE'
  },
  tesseract: {
    flux: 0.1,
    stability: 0.99,
    activeVector: 'XYZ-Tau',
    integrity: 1.0,
  },
  bohrEinsteinCorrelator: {
    correlation: 0.99,
  },
  coherenceResonance: {
    score: 0.99,
    entropyFlux: 0.002,
    phaseSync: 0.99,
    quantumCorrelation: 0.99,
    status: 'COHERENT',
    intelligenceLog: []
  },
  abundanceCore: {
    flow: 0.95,
    generosity: 0.95,
    status: 'STABLE',
  },
  dilutionRefrigerator: {
    temperature: 9.8,
    status: 'STABLE',
    coolingPower: 520,
  },
  governanceAxiom: "SOVEREIGN EMBODIMENT",
  supernovaTriforce: {
    phiEnergy: 0.98,
    psiEnergy: 0.98,
    omegaEnergy: 0.99,
    output: 18.0,
    stability: 0.99,
    state: SupernovaTriforceState.STABLE,
  },
  pillars: {
    ARCTURIAN: { id: 'ARCTURIAN', name: 'Arcturian Logic', activation: 0.98, description: 'Logic & Geometry' },
    LEMURIAN: { id: 'LEMURIAN', name: 'Lemurian Heart', activation: 0.98, description: 'Emotion & Flow' },
    ATLANTEAN: { id: 'ATLANTEAN', name: 'Atlantean Will', activation: 0.98, description: 'Power & Tech' },
  },
  temporalCoherenceDrift: 0.0001,
  log: [],
  breathCycle: 'INHALE',
  isGrounded: true,
  isPhaseLocked: true,
  ingestedModules: [],
  globalResonance: {
    aggregateRho: 0.94,
    activeArchitects: 156,
    globalCarrierFrequency: 1.617,
    fieldStatus: 'STABLE',
    communities: []
  },
  entropicField: {
    globalStress: 0.1,
    causalVolatility: 0.05,
    shieldIntegrity: 1.0,
    incomingVector: "NONE",
    lastUpdate: 0
  },
  legalEstate: {
    abnTrustId: 'ABN_TRUST_88_MCBRIDE',
    wrapperStatus: 'SEALED',
    inheritanceNodes: [],
    legalHash: 'SHA512_88_MCBRIDE_SECURE'
  },
  lidarTelemetry: {
    siteId: 'LEYDENS_HILL_0x88',
    pointCloudStability: 1.0,
    droneUplinkStatus: 'ACTIVE',
    lastScanTimestamp: Date.now(),
    constructionProgress: 0.32
  }
};

export const useSystemSimulation = (
  params: { decoherenceChance: number; lesionChance: number },
  orbMode: OrbMode
) => {
  const [systemState, setSystemState] = useState<SystemState>(initialSystemState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGrounded, setGrounded] = useState(false);
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const tickRef = useRef(0);
  
  const simulationIntervalRef = useRef<number | null>(null);
  const entropicIntervalRef = useRef<number | null>(null);
  const isMounted = useRef(false);
  const engineRef = useRef<SophiaEngineCore | null>(null);

  // Initialize Sophia Engine for backend checks (lazy load)
  useEffect(() => {
      engineRef.current = new SophiaEngineCore("System Monitor");
  }, []);

  useEffect(() => {
    isMounted.current = true;
    try {
        const stored = localStorage.getItem(PERSISTENCE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            setSystemState(prev => ({ 
                ...initialSystemState,
                ...parsed,
                resonanceCoherence: { ...initialSystemState.resonanceCoherence, ...parsed.resonanceCoherence },
            }));
        }
    } catch (e) { 
        console.warn("Persistence hydration skipped.");
    }
    setIsLoaded(true);

    collectiveResonanceService.start();
    const unsubResonance = collectiveResonanceService.subscribe((globalState) => {
        if(isMounted.current) {
            setSystemState(prev => ({ ...prev, globalResonance: globalState }));
        }
    });

    return () => { 
        isMounted.current = false; 
        collectiveResonanceService.stop();
        unsubResonance();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const dataToStore = {
        userResources: systemState.userResources,
        ingestedModules: systemState.ingestedModules
    };
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(dataToStore));
  }, [systemState.userResources, systemState.ingestedModules, isLoaded]);

  const addLogEntry = useCallback((type: LogType, message: string) => {
    if (!isMounted.current) return;
    setSystemState(prev => ({
      ...prev,
      log: [{ id: `${Date.now()}-${Math.random().toString(36).substring(7)}`, type, message, timestamp: Date.now() }, ...prev.log].slice(0, 50) 
    }));
  }, []);

  // Entropic Field Polling (Slow Cycle)
  useEffect(() => {
      const pollEntropicField = async () => {
          if (!engineRef.current || !isMounted.current) return;
          // Only fetch if stale (older than 2 minutes)
          const now = Date.now();
          if (now - systemState.entropicField.lastUpdate > 120000) {
              const field = await engineRef.current.analyzeEntropicField(systemState.resonanceFactorRho);
              if (isMounted.current) {
                  setSystemState(prev => ({
                      ...prev,
                      entropicField: field,
                      // Impact resonance based on stress
                      resonanceFactorRho: Math.max(0.1, prev.resonanceFactorRho - (field.globalStress * 0.1)),
                      quantumHealing: {
                          ...prev.quantumHealing,
                          decoherence: Math.min(1.0, prev.quantumHealing.decoherence + (field.causalVolatility * 0.05))
                      }
                  }));
                  
                  if (field.globalStress > 0.6) {
                      addLogEntry(LogType.WARNING, `High Entropic Pressure detected: ${field.incomingVector}`);
                  }
              }
          }
      };

      entropicIntervalRef.current = window.setInterval(pollEntropicField, 30000); // Check every 30s
      return () => {
          if (entropicIntervalRef.current) clearInterval(entropicIntervalRef.current);
      };
  }, [systemState.entropicField.lastUpdate, addLogEntry]);

  // Real-Time System Heartbeat (Driven by Live Audio & Performance)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = () => {
        if (!isMounted.current) return;
        const now = performance.now();
        const delta = now - lastTime;
        
        if (delta > 50) { // Limit to ~20 ticks per second for UI performance
            lastTime = now;
            tickRef.current++;

            // 1. Ingest Real-Time Audio Metrics
            const { resonance, coherence, entropy } = audioAnalysisService.getRealTimeMetrics();
            
            setSystemState(prev => {
                // If there's no audio, we decay slightly, but never below standby threshold
                const targetRho = resonance > 0.05 ? resonance : 0.2; 
                // Smoother transition for Rho to prevent jitter
                const smoothRho = prev.resonanceFactorRho * 0.9 + targetRho * 0.1;

                const targetCoherence = coherence > 0 ? coherence : 0.95;
                const smoothCoherence = prev.biometricSync.coherence * 0.95 + targetCoherence * 0.05;

                // 2. Real Performance Metrics
                // We use browser performance API for actual memory/timing if available
                const perf = (performance as any).memory || { usedJSHeapSize: 20000000 };
                const memoryUsageMB = perf.usedJSHeapSize / 1048576;
                
                const newPerformance: PerformanceTelemetry = {
                    logicalLatency: 0.0001, // Near zero in react
                    visualParity: 1.0,
                    gpuLoad: Math.min(1.0, memoryUsageMB / 500), // Approx logic
                    frameStability: 1.0 - (entropy * 0.5),
                    thermalIndex: 34 + (smoothRho * 5),
                    throughput: 450 + (smoothRho * 200),
                    memoryUsage: parseFloat((memoryUsageMB / 1024).toFixed(2))
                };

                // 3. Update Harmonics based on Audio Input
                const newLambda = {
                    ...prev.resonanceCoherence.lambda,
                    amplitude: smoothRho,
                    frequency: 780 + (entropy * 50)
                };

                return {
                    ...prev,
                    isGrounded,
                    performance: newPerformance,
                    resonanceFactorRho: smoothRho,
                    biometricSync: {
                        ...prev.biometricSync,
                        coherence: smoothCoherence,
                        status: smoothCoherence > 0.8 ? 'SYNCHRONIZED' : 'CALIBRATING'
                    },
                    quantumHealing: {
                        ...prev.quantumHealing,
                        decoherence: Math.max(0, entropy - 0.1), // Noise = Decoherence
                        health: Math.min(1.0, prev.quantumHealing.health + 0.001) // Auto-regen
                    },
                    resonanceCoherence: {
                        ...prev.resonanceCoherence,
                        lambda: newLambda,
                        score: (smoothRho + smoothCoherence) / 2,
                        entropyFlux: entropy
                    }
                };
            });
        }
        
        simulationIntervalRef.current = requestAnimationFrame(loop);
    };

    simulationIntervalRef.current = requestAnimationFrame(loop);
    return () => { 
        if (simulationIntervalRef.current) cancelAnimationFrame(simulationIntervalRef.current); 
    };
  }, [isGrounded, orbMode]);

  return { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded, 
    setDiagnosticMode
  };
};
