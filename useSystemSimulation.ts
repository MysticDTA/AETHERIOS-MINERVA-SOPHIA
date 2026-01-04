
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SystemState, 
  LogType, 
  SupanovaTriforceState, 
  PillarId, 
  OrbMode, 
  CoherenceResonanceData,
  PerformanceTelemetry
} from './types';
import { ApiService } from './services/api';

const PERSISTENCE_KEY = 'S7_OPERATOR_DATA';

export const initialSystemState: SystemState = {
  userResources: {
    cradleTokens: 0,
    sovereignTier: 'ACOLYTE',
    unlockedModules: ['CAUSAL_MATRIX'],
    ledgerHistory: [],
    subscriptionActive: false,
    menervaLegacyPoints: 0
  },
  performance: {
    logicalLatency: 0.00012,
    visualParity: 0.9998,
    gpuLoad: 0.12,
    frameStability: 1.0,
    thermalIndex: 32.4
  },
  auth: {
    isAuthenticated: true,
    operatorId: 'OP_88_ALPHA',
    sessionToken: 'jwt_demo_token_sophia_v2'
  },
  quantumHealing: {
    health: 1.0, 
    lesions: 0,
    repairRate: 0.005,
    status: "STABLE",
    decoherence: 0.0,
    stabilizationShield: 1.0,
  },
  holisticAlignmentScore: 1.0,
  resonanceFactorRho: 0.99,
  selfCorrectionField: 0.5,
  resonanceCoherence: {
    lambda: { frequency: 780 },
    sigma: { frequency: 450 },
    tau: { frequency: 120 },
  },
  lyranConcordance: {
    alignmentDrift: 0.0,
    connectionStability: 1.0,
  },
  satelliteUplink: {
    signalStrength: 0.98,
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
    hrv: 75,
    coherence: 0.95,
    status: 'SYNCHRONIZED',
  },
  vibration: {
    amplitude: 2.5,
    frequency: 432,
    resonanceStatus: 'HARMONIC',
  },
  aethericTransfer: {
    efficiency: 0.95,
    particleDensity: 0.5,
    fluxStatus: 'STABLE',
    entropy: 0.01,
  },
  schumannResonance: {
    liveFrequency: 7.83,
    intensity: 0.8,
    status: 'NOMINAL',
  },
  earthGrounding: {
    charge: 0.8,
    conductivity: 0.95,
    status: 'STABLE',
  },
  tesseract: {
    flux: 0.2,
    stability: 0.98,
    activeVector: 'XYZ-Tau',
    integrity: 1.0,
  },
  bohrEinsteinCorrelator: {
    correlation: 0.98,
  },
  coherenceResonance: {
    score: 0.99,
    entropyFlux: 0.02,
    phaseSync: 0.98,
    quantumCorrelation: 0.97,
    status: 'COHERENT',
    intelligenceLog: []
  },
  abundanceCore: {
    flow: 0.8,
    generosity: 0.8,
    status: 'STABLE',
  },
  dilutionRefrigerator: {
    temperature: 10.0,
    status: 'STABLE',
    coolingPower: 500,
  },
  governanceAxiom: "SOVEREIGN EMBODIMENT",
  supanovaTriforce: {
    phiEnergy: 0.9,
    psiEnergy: 0.9,
    omegaEnergy: 0.95,
    output: 15.0,
    stability: 0.99,
    state: SupanovaTriforceState.STABLE,
  },
  pillars: {
    ARCTURIAN: { id: 'ARCTURIAN', name: 'Arcturian Logic', activation: 0.95, description: 'Logic & Geometry' },
    LEMURIAN: { id: 'LEMURIAN', name: 'Lemurian Heart', activation: 0.95, description: 'Emotion & Flow' },
    ATLANTEAN: { id: 'ATLANTEAN', name: 'Atlantean Will', activation: 0.95, description: 'Power & Tech' },
  },
  temporalCoherenceDrift: 0.0,
  log: [],
  breathCycle: 'INHALE',
  isGrounded: false,
  isPhaseLocked: false,
  ingestedModules: []
};

export const useSystemSimulation = (
  params: { decoherenceChance: number; lesionChance: number },
  orbMode: OrbMode
) => {
  // Use a stable initial state to prevent hydration mismatch
  const [systemState, setSystemState] = useState<SystemState>(initialSystemState);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isGrounded, setGrounded] = useState(false);
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const [optimizationActive] = useState(false);
  
  const simulationIntervalRef = useRef<number | null>(null);
  const breathIntervalRef = useRef<number | null>(null);
  const isMounted = useRef(false);

  // Load persistence data only after mount
  useEffect(() => {
    isMounted.current = true;
    
    try {
        const stored = localStorage.getItem(PERSISTENCE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            setSystemState(prev => ({ ...prev, ...parsed }));
        }
    } catch (e) { 
        console.warn("Persistence hydration skipped.");
    }
    
    setIsLoaded(true);

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
    return () => { isMounted.current = false; };
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
      setSystemState(prev => {
        let newHealth = prev.quantumHealing.health;
        let newDecoherence = prev.quantumHealing.decoherence;
        
        // BALANCING ADJUSTMENT: Biometric-Logic Handshake
        // Throttling or penalizing logic based on biometric coherence
        if (prev.biometricSync.coherence < 0.4) {
            newDecoherence = Math.min(1.0, newDecoherence + 0.02);
            if (Math.random() < 0.05) {
                addLogEntry(LogType.WARNING, "Lattice Fracture: Neural instability detected. Throttle logic core.");
            }
        }

        // Use a more stable random jitter
        let resonanceModifier = Math.max(0.1, Math.min(1.0, prev.resonanceFactorRho + (Math.random() - 0.5) * 0.005));
        
        const newPerformance: PerformanceTelemetry = {
            logicalLatency: 0.0001 + (newDecoherence * 0.005),
            visualParity: 1.0 - (newDecoherence * 0.1),
            gpuLoad: 0.1 + (prev.supanovaTriforce.output / 100),
            frameStability: 1.0 - (prev.vibration.amplitude / 100),
            thermalIndex: 30 + (prev.supanovaTriforce.stability * 10)
        };

        const coherenceScore = (resonanceModifier + prev.biometricSync.coherence + prev.bohrEinsteinCorrelator.correlation) / 3;
        let coherenceStatus: CoherenceResonanceData['status'] = 'COHERENT';
        if (coherenceScore < 0.75) coherenceStatus = 'RESONATING';

        // BALANCING ADJUSTMENT: Temporal Drift Correction (Phase Lock)
        const driftIncrease = prev.isPhaseLocked ? 0 : (newDecoherence * 0.0002) - (resonanceModifier * 0.0008);

        return {
          ...prev,
          isGrounded,
          performance: newPerformance,
          quantumHealing: {
              ...prev.quantumHealing,
              decoherence: newDecoherence
          },
          resonanceFactorRho: resonanceModifier,
          temporalCoherenceDrift: prev.temporalCoherenceDrift + driftIncrease,
          coherenceResonance: {
              ...prev.coherenceResonance,
              score: coherenceScore,
              entropyFlux: (newDecoherence * 0.3) + (1 - resonanceModifier) * 0.7,
              phaseSync: resonanceModifier,
              quantumCorrelation: prev.bohrEinsteinCorrelator.correlation * resonanceModifier,
              status: coherenceStatus
          }
        };
      });
    }, 1000);
    return () => { if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current); };
  }, [params, orbMode, isGrounded, diagnosticMode, optimizationActive, addLogEntry]);

  return { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded,
    setDiagnosticMode
  };
};
