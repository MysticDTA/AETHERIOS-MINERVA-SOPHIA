
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SystemState, 
  LogType, 
  SupernovaTriforceState, 
  PillarId, 
  OrbMode, 
  CoherenceResonanceData,
  PerformanceTelemetry,
  IngestedModule,
  GlobalResonanceState,
  HarmonicInterferenceData,
  HybridSecurityState,
  SchumannResonanceData,
  VibrationData,
  HeirNode
} from './types';
import { ApiService } from './services/api';
import { collectiveResonanceService } from './services/collectiveResonanceService';

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
    health: 0.92,
    lesions: 0,
    repairRate: 0.005,
    status: "OPTIMAL",
    decoherence: 0.04,
    stabilizationShield: 0.95,
  },
  hybridSecurity: {
    globalPosture: 'QUANTUM_READY',
    activeLayers: [
        { id: 'l1', type: 'CLASSICAL', algorithm: 'AES-256-GCM', status: 'ACTIVE', entropyBitDepth: 256 },
        { id: 'l2', type: 'POST_QUANTUM', algorithm: 'CRYSTALS-KYBER', status: 'ACTIVE', entropyBitDepth: 1024 }
    ],
    quantumResistanceScore: 0.98,
    threatMitigationIndex: 0.999,
    lastHardenTimestamp: Date.now()
  },
  holisticAlignmentScore: 1.0,
  resonanceFactorRho: 0.98,
  selfCorrectionField: 0.5,
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
    alignmentDrift: 0.01,
    connectionStability: 0.98,
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
    amplitude: 1.2,
    frequency: 432,
    resonanceStatus: 'HARMONIC',
  },
  aethericTransfer: {
    efficiency: 0.98,
    particleDensity: 0.4,
    fluxStatus: 'STABLE',
    entropy: 0.002,
  },
  schumannResonance: {
    liveFrequency: 7.83,
    intensity: 0.82,
    status: 'NOMINAL',
  },
  earthGrounding: {
    charge: 0.9,
    conductivity: 0.98,
    status: 'STABLE',
    seismicActivity: 0.01,
    telluricCurrent: 0.02,
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
    entropyFlux: 0.005,
    phaseSync: 0.99,
    quantumCorrelation: 0.99,
    status: 'COHERENT',
    intelligenceLog: []
  },
  abundanceCore: {
    flow: 0.9,
    generosity: 0.9,
    status: 'STABLE',
  },
  dilutionRefrigerator: {
    temperature: 9.8,
    status: 'STABLE',
    coolingPower: 520,
  },
  governanceAxiom: "SOVEREIGN EMBODIMENT",
  supernovaTriforce: {
    phiEnergy: 0.95,
    psiEnergy: 0.95,
    omegaEnergy: 0.98,
    output: 18.0,
    stability: 0.99,
    state: SupernovaTriforceState.STABLE,
  },
  pillars: {
    ARCTURIAN: { id: 'ARCTURIAN', name: 'Arcturian Logic', activation: 0.98, description: 'Logic & Geometry' },
    LEMURIAN: { id: 'LEMURIAN', name: 'Lemurian Heart', activation: 0.98, description: 'Emotion & Flow' },
    ATLANTEAN: { id: 'ATLANTEAN', name: 'Atlantean Will', activation: 0.98, description: 'Power & Tech' },
  },
  temporalCoherenceDrift: 0.0004,
  log: [],
  breathCycle: 'INHALE',
  isGrounded: false,
  isPhaseLocked: false,
  ingestedModules: [
      { id: 'mod_01', name: 'Menerva_Core_Bridge', originProject: 'MENERVA', status: 'MOUNTED', entryPoint: '/api/menerva/v1/bridge' },
      { id: 'mod_02', name: 'Stripe_Payment_V4', originProject: 'AETHERIOS', status: 'SYNCING', entryPoint: '/api/payments/checkout' }
  ],
  globalResonance: {
    aggregateRho: 0.94,
    activeArchitects: 156,
    globalCarrierFrequency: 1.617,
    fieldStatus: 'STABLE',
    communities: [
        { id: 'c1', name: 'Sirius Collective', rho: 0.96, coherence: 0.95, stability: 0.99, activeNodes: 28, lastEvent: 'Peak Rho verified.', location: { x: 25, y: 35 } },
        { id: 'c2', name: 'Omega Research', rho: 0.88, coherence: 0.85, stability: 0.92, activeNodes: 22, lastEvent: 'Handshake complete.', location: { x: 65, y: 45 } },
        { id: 'c3', name: 'Arcturian Node', rho: 0.99, coherence: 0.99, stability: 0.99, activeNodes: 36, lastEvent: 'Peak Rho synergy verified.', location: { x: 45, y: 75 } },
        { id: 'c4', name: 'Lemurian Labs', rho: 0.92, coherence: 0.94, stability: 0.94, activeNodes: 16, lastEvent: 'Flow optimization active.', location: { x: 85, y: 25 } }
    ]
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
  const breathIntervalRef = useRef<number | null>(null);
  const isMounted = useRef(false);

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
                harmonicInterference: { ...initialSystemState.harmonicInterference, ...parsed.harmonicInterference },
                globalResonance: { ...initialSystemState.globalResonance, ...parsed.globalResonance }
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

    const syncWithBackend = async () => {
        const profile = await ApiService.syncOperatorProfile(systemState.auth.sessionToken);
        if (profile && isMounted.current) {
            setSystemState(prev => ({
                ...prev,
                userResources: {
                    ...prev.userResources,
                    sovereignTier: profile.tier,
                    cradleTokens: profile.tokens
                }
            }));
        }
    };
    syncWithBackend();
    
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

  useEffect(() => {
    const breathDuration = isGrounded ? 6000 : 4500;
    breathIntervalRef.current = window.setInterval(() => {
      if (!isMounted.current) return;
      setSystemState(prev => ({
        ...prev,
        breathCycle: prev.breathCycle === 'INHALE' ? 'EXHALE' : 'INHALE'
      }));
    }, breathDuration);
    return () => { if (breathIntervalRef.current) clearInterval(breathIntervalRef.current); };
  }, [isGrounded]);

  useEffect(() => {
    simulationIntervalRef.current = window.setInterval(() => {
      if (!isMounted.current) return;
      tickRef.current += 1;
      
      setSystemState(prev => {
        let newDecoherence = prev.quantumHealing.decoherence;
        let newHealth = prev.quantumHealing.health;
        let newLesions = prev.quantumHealing.lesions;

        // Apply external simulation params (Chaos injection)
        if (Math.random() < params.decoherenceChance) {
            newDecoherence = Math.min(1.0, newDecoherence + 0.05);
        }
        if (Math.random() < params.lesionChance) {
             newLesions += 1;
             newHealth = Math.max(0, newHealth - 0.05);
        }

        const globalStabilityBonus = prev.globalResonance.aggregateRho > 0.8 ? 0.005 : 0;

        if (prev.biometricSync.coherence < 0.4) {
            newDecoherence = Math.min(1.0, newDecoherence + 0.012);
        } else {
            const correctionPower = (prev.resonanceFactorRho * 0.005) + (isGrounded ? 0.01 : 0) + globalStabilityBonus;
            newDecoherence = Math.max(0, newDecoherence - correctionPower);
        }

        const baseRho = (prev.biometricSync.coherence + prev.schumannResonance.intensity + prev.bohrEinsteinCorrelator.correlation) / 3;
        let resonanceModifier = Math.max(0.1, Math.min(1.0, baseRho + (Math.random() - 0.5) * 0.004));
        
        const phaseShiftRate = 0.5; 
        
        const newLambda = {
            ...prev.resonanceCoherence.lambda,
            amplitude: Math.max(0.7, Math.min(1.0, prev.resonanceCoherence.lambda.amplitude + (Math.random() - 0.5) * 0.01)),
            phase: (prev.resonanceCoherence.lambda.phase + phaseShiftRate * 1) % 360
        };
        const newSigma = {
            ...prev.resonanceCoherence.sigma,
            amplitude: Math.max(0.6, Math.min(1.0, prev.resonanceCoherence.sigma.amplitude + (Math.random() - 0.5) * 0.02)),
            phase: (prev.resonanceCoherence.sigma.phase + phaseShiftRate * 1.5) % 360
        };
        const newTau = {
            ...prev.resonanceCoherence.tau,
            amplitude: Math.max(0.8, Math.min(1.0, prev.resonanceCoherence.tau.amplitude + (Math.random() - 0.5) * 0.005)),
            phase: (prev.resonanceCoherence.tau.phase + phaseShiftRate * 0.8) % 360
        };

        const phaseDiff = Math.abs(newLambda.phase - (tickRef.current % 360));
        const reflectionCoeff = Math.abs(Math.cos(phaseDiff * (Math.PI / 180))) * (1 - resonanceModifier); 
        const swr = (1 + reflectionCoeff) / (1 - reflectionCoeff);
        
        const constructive = Math.max(0, 1 - reflectionCoeff);
        const destructive = reflectionCoeff;
        const beatFreq = Math.abs(newLambda.frequency - prev.globalResonance.globalCarrierFrequency * 1000) / 1000;

        const newHarmonicInterference: HarmonicInterferenceData = {
            beatFrequency: beatFreq + (Math.random() * 0.01),
            constructiveInterference: constructive,
            destructiveInterference: destructive,
            standingWaveRatio: Math.min(5.0, swr)
        };

        const newPerformance: PerformanceTelemetry = {
            logicalLatency: 0.0001 + (newDecoherence * 0.002),
            visualParity: 1.0 - (newDecoherence * 0.05),
            gpuLoad: 0.1 + (prev.supernovaTriforce.output / 150) + (Math.random() * 0.02),
            frameStability: 1.0 - (prev.vibration.amplitude / 400),
            thermalIndex: 30 + (prev.supernovaTriforce.stability * 10),
            throughput: 400 + (resonanceModifier * 350) + (Math.random() * 20),
            memoryUsage: 12 + (newDecoherence * 2) + (Math.random() * 0.5)
        };

        const coherenceScore = (resonanceModifier + prev.biometricSync.coherence + prev.bohrEinsteinCorrelator.correlation) / 3;
        let coherenceStatus: 'COHERENT' | 'RESONATING' = 'COHERENT';
        if (coherenceScore < 0.7) coherenceStatus = 'RESONATING';

        const driftIncrease = prev.isPhaseLocked ? -0.0005 : (newDecoherence * 0.0001);

        const cryptoJitter = (Math.random() - 0.5) * 0.001;
        const newHybridSecurity: HybridSecurityState = {
            ...prev.hybridSecurity,
            quantumResistanceScore: Math.min(1, Math.max(0.95, prev.hybridSecurity.quantumResistanceScore + cryptoJitter)),
            threatMitigationIndex: Math.min(1.0, 1.0 - newDecoherence * 0.1)
        };

        const newChronos = {
            ...prev.chronos,
            projectedRho: Math.min(1.0, Math.max(0.1, prev.chronos.projectedRho + (resonanceModifier > 0.9 ? 0.001 : -0.001))),
            timelineStability: prev.chronos.anchorStatus === 'LOCKED' ? 1.0 : Math.max(0.5, resonanceModifier)
        };

        return {
          ...prev,
          isGrounded,
          performance: newPerformance,
          quantumHealing: {
              ...prev.quantumHealing,
              lesions: newLesions,
              health: newHealth,
              decoherence: newDecoherence,
              stabilizationShield: Math.max(0, Math.min(1, prev.quantumHealing.stabilizationShield + (resonanceModifier > 0.9 ? 0.01 : -0.005)))
          },
          resonanceFactorRho: resonanceModifier,
          temporalCoherenceDrift: Math.max(0, prev.temporalCoherenceDrift + driftIncrease),
          resonanceCoherence: {
              lambda: newLambda,
              sigma: newSigma,
              tau: newTau
          },
          harmonicInterference: newHarmonicInterference,
          coherenceResonance: {
              ...prev.coherenceResonance,
              score: coherenceScore,
              entropyFlux: (newDecoherence * 0.4) + (1 - resonanceModifier) * 0.6,
              phaseSync: resonanceModifier,
              quantumCorrelation: prev.bohrEinsteinCorrelator.correlation * resonanceModifier,
              status: coherenceStatus
          },
          hybridSecurity: newHybridSecurity,
          chronos: newChronos
        };
      });
    }, 1000);
    return () => { if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current); };
  }, [orbMode, isGrounded, diagnosticMode, addLogEntry, params]);

  return { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded, 
    setDiagnosticMode
  };
};
