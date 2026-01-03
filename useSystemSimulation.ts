import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SystemState, 
  LogType, 
  SupanovaTriforceState, 
  PillarId, 
  PillarData, 
  OrbMode, 
  GalacticRelay,
  CoherenceResonanceData,
  UserTier,
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
    subscriptionActive: false
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
    'RELAY_GAMMA': { id: 'RELAY_GAMMA', name: 'Andromeda Bridge', status: 'ONLINE', latency: 150 },
    'RELAY_DELTA': { id: 'RELAY_DELTA', name: 'Pleiades Node', status: 'ONLINE', latency: 60 },
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
};

export const useSystemSimulation = (
  params: { decoherenceChance: number; lesionChance: number },
  orbMode: OrbMode
) => {
  const [systemState, setSystemState] = useState<SystemState>(() => {
    try {
        const stored = localStorage.getItem(PERSISTENCE_KEY);
        return stored ? { ...initialSystemState, userResources: { ...initialSystemState.userResources, ...JSON.parse(stored) } } : initialSystemState;
    } catch (e) { return initialSystemState; }
  });

  const [isGrounded, setGrounded] = useState(false);
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const [optimizationActive, setOptimizationActive] = useState(false);
  
  const simulationIntervalRef = useRef<number | null>(null);
  const breathIntervalRef = useRef<number | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
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
    const dataToStore = {
        sovereignTier: systemState.userResources.sovereignTier,
        cradleTokens: systemState.userResources.cradleTokens,
        ledgerHistory: systemState.userResources.ledgerHistory
    };
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(dataToStore));
  }, [systemState.userResources]);

  const addLogEntry = useCallback((type: LogType, message: string) => {
    if (!isMounted.current) return;
    setSystemState(prev => ({
      ...prev,
      log: [{ id: Math.random().toString(36).substring(7), type, message, timestamp: Date.now() }, ...prev.log].slice(0, 50) 
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
        let newLesions = prev.quantumHealing.lesions;
        let newDecoherence = prev.quantumHealing.decoherence;
        let newShield = prev.quantumHealing.stabilizationShield;
        let newRepairRate = 0.003;
        let newAxiom = prev.governanceAxiom;
        
        const diagnosticJitter = diagnosticMode ? (Math.random() - 0.5) * 0.06 : 0;
        let resonanceModifier = Math.max(0, Math.min(1, prev.resonanceFactorRho + diagnosticJitter));
        
        // Performance Telemetry Calculation
        const newPerformance: PerformanceTelemetry = {
            logicalLatency: 0.0001 + (newDecoherence * 0.005),
            visualParity: 1.0 - (newDecoherence * 0.1),
            gpuLoad: 0.1 + (prev.supanovaTriforce.output / 100),
            frameStability: 1.0 - (prev.vibration.amplitude / 100),
            thermalIndex: 30 + (prev.supanovaTriforce.stability * 10)
        };

        if (optimizationActive) {
            newDecoherence = Math.max(0, newDecoherence - 0.12);
            newHealth = Math.min(1.0, newHealth + 0.08);
            if (Math.random() > 0.4) newLesions = Math.max(0, newLesions - 1);
            resonanceModifier = Math.min(1, resonanceModifier + 0.05);
            newShield = Math.min(1, newShield + 0.05);
        }

        const entropyModifier = isGrounded ? 0.04 : (orbMode === 'GROUNDING' ? 0.15 : 1.0);
        const shieldProtection = newShield * 0.85;

        if (Math.random() < params.decoherenceChance * entropyModifier && !optimizationActive) {
            newDecoherence += (0.02 * (1 - shieldProtection));
        }
        if (Math.random() < params.lesionChance * entropyModifier && newShield < 0.25) {
            newLesions += 1;
        }

        if (newDecoherence < 0.08 && resonanceModifier > 0.92) {
            newShield = Math.min(1, newShield + 0.006);
        } else if (!optimizationActive) {
            newShield = Math.max(0, newShield - (newDecoherence * 0.008));
        }

        if (newDecoherence < 0.15 && newLesions === 0) {
            newHealth = Math.min(1, newHealth + 0.002 * resonanceModifier);
        }
        newDecoherence = Math.max(0, newDecoherence - (0.0015 + (resonanceModifier * 0.0025)));

        switch (orbMode) {
            case 'REPAIR':
                newRepairRate = 0.12;
                if (newLesions > 0 && Math.random() > 0.55) newLesions -= 1;
                newDecoherence = Math.max(0, newDecoherence - 0.06);
                break;
            case 'GROUNDING':
                newDecoherence = Math.max(0, newDecoherence - 0.09);
                newHealth = Math.min(1, newHealth + 0.012);
                newShield = Math.min(1, newShield + 0.025);
                break;
            case 'SYNTHESIS':
                newRepairRate = 0.06;
                break;
            case 'OFFLINE':
                newHealth -= 0.0015;
                newShield = Math.max(0, newShield - 0.012);
                break;
        }

        newHealth = Math.max(0, Math.min(1, newHealth + newRepairRate - (newDecoherence * 0.006) - (newLesions * 0.012)));
        
        if (newHealth < 0.08 || newLesions > 9) {
            newAxiom = 'SYSTEM COMPOSURE FAILURE';
        } else if (newHealth < 0.35) {
            newAxiom = 'REGENERATIVE CYCLE';
        } else if (newDecoherence > 0.55) {
            newAxiom = 'RECALIBRATING HARMONICS';
        } else if (newHealth > 0.92 && newDecoherence < 0.04) {
            newAxiom = 'SOVEREIGN EMBODIMENT';
        } else {
            newAxiom = 'CRADLE OF PRESENCE';
        }

        const newPillars = { ...prev.pillars };
        (Object.keys(newPillars) as PillarId[]).forEach(id => {
            if (Math.random() > 0.996 && !optimizationActive) {
                newPillars[id] = { ...newPillars[id], activation: Math.max(0.15, newPillars[id].activation - 0.004) };
            } else if (optimizationActive) {
                newPillars[id] = { ...newPillars[id], activation: Math.min(1.0, newPillars[id].activation + 0.015) };
            }
        });

        const newTriforce = { ...prev.supanovaTriforce };
        newTriforce.phiEnergy = Math.min(1, Math.max(0.15, newTriforce.phiEnergy + (Math.random() - 0.5) * 0.008));
        newTriforce.psiEnergy = Math.min(1, Math.max(0.15, newTriforce.psiEnergy + (Math.random() - 0.5) * 0.008));
        newTriforce.omegaEnergy = Math.min(1, Math.max(0.15, newTriforce.omegaEnergy + (Math.random() - 0.5) * 0.008));
        const avgEnergy = (newTriforce.phiEnergy + newTriforce.psiEnergy + newTriforce.omegaEnergy) / 3;
        newTriforce.stability = avgEnergy * (1 - newDecoherence * 0.25);
        newTriforce.output = avgEnergy * 32.4; 
        
        if (newTriforce.stability < 0.12) newTriforce.state = SupanovaTriforceState.SUPERNOVA;
        else if (prev.breathCycle === 'INHALE') newTriforce.state = SupanovaTriforceState.CHARGING;
        else newTriforce.state = SupanovaTriforceState.STABLE;

        const newLyran = { ...prev.lyranConcordance };
        if (orbMode === 'CONCORDANCE' || optimizationActive) {
            newLyran.alignmentDrift = Math.max(0, newLyran.alignmentDrift - 0.04);
            newLyran.connectionStability = Math.min(1, newLyran.connectionStability + 0.04);
        } else {
            newLyran.alignmentDrift = Math.min(1, newLyran.alignmentDrift + (Math.random() * 0.00025)); 
        }

        const pillarAverage = (Object.values(newPillars) as PillarData[]).reduce<number>((acc, p) => acc + p.activation, 0) / 3;
        const resonanceRho = optimizationActive ? Math.min(1.0, resonanceModifier + 0.08) : (pillarAverage * 0.4 + newTriforce.stability * 0.4 + newLyran.connectionStability * 0.2);
        
        let newDrift = prev.temporalCoherenceDrift;
        newDrift += (newDecoherence * 0.00015) - (resonanceRho * 0.0006); 
        newDrift = Math.max(0, Math.min(1, newDrift));

        const coherenceScore = (resonanceRho + prev.biometricSync.coherence + prev.bohrEinsteinCorrelator.correlation) / 3;
        let coherenceStatus: CoherenceResonanceData['status'] = 'COHERENT';
        if (coherenceScore < 0.78) coherenceStatus = 'RESONATING';
        if (coherenceScore < 0.48) coherenceStatus = 'DECOHERING';
        if (coherenceScore < 0.18) coherenceStatus = 'CRITICAL';

        return {
          ...prev,
          isGrounded,
          performance: newPerformance,
          quantumHealing: {
            health: newHealth,
            lesions: newLesions,
            repairRate: newRepairRate,
            status: newHealth > 0.9 ? "STABLE" : newHealth > 0.4 ? "REPAIRING" : "DAMAGED",
            decoherence: newDecoherence,
            stabilizationShield: newShield,
          },
          governanceAxiom: newAxiom,
          pillars: newPillars,
          supanovaTriforce: newTriforce,
          lyranConcordance: newLyran,
          resonanceFactorRho: resonanceRho,
          temporalCoherenceDrift: newDrift,
          coherenceResonance: {
              ...prev.coherenceResonance,
              score: coherenceScore,
              entropyFlux: (newDecoherence * 0.4) + (1 - resonanceRho) * 0.6,
              phaseSync: resonanceRho * (1 - newLyran.alignmentDrift),
              quantumCorrelation: prev.bohrEinsteinCorrelator.correlation * resonanceRho,
              status: coherenceStatus
          }
        };
      });
    }, 1000);
    return () => { if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current); };
  }, [params, orbMode, isGrounded, diagnosticMode, optimizationActive]);

  return { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded,
    setDiagnosticMode,
    setOptimizationActive,
    optimizationActive
  };
};
