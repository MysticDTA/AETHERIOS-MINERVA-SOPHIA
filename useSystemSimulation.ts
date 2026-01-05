
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
  HarmonicInterferenceData
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
    thermalIndex: 32.4,
    throughput: 450,
    memoryUsage: 12.4
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
    seismicActivity: 0.02,
    telluricCurrent: 0.05,
    feedbackLoopStatus: 'IDLE'
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
  supernovaTriforce: {
    phiEnergy: 0.9,
    psiEnergy: 0.9,
    omegaEnergy: 0.95,
    output: 15.0,
    stability: 0.99,
    state: SupernovaTriforceState.STABLE,
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
  ingestedModules: [],
  globalResonance: {
    aggregateRho: 0.88,
    activeArchitects: 142,
    globalCarrierFrequency: 1.617,
    fieldStatus: 'STABLE',
    communities: [
        { id: 'c1', name: 'Sirius Collective', rho: 0.94, coherence: 0.92, stability: 0.98, activeNodes: 24, lastEvent: 'Harmonic Lock achieved.', location: { x: 25, y: 35 } },
        { id: 'c2', name: 'Omega Research', rho: 0.72, coherence: 0.65, stability: 0.81, activeNodes: 18, lastEvent: 'Minor decoherence spike detected.', location: { x: 65, y: 45 } },
        { id: 'c3', name: 'Arcturian Node', rho: 0.98, coherence: 0.99, stability: 0.97, activeNodes: 32, lastEvent: 'Peak Rho synergy verified.', location: { x: 45, y: 75 } },
        { id: 'c4', name: 'Lemurian Labs', rho: 0.85, coherence: 0.88, stability: 0.84, activeNodes: 12, lastEvent: 'Flow optimization active.', location: { x: 85, y: 25 } }
    ]
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
            // Merge stored data with initial structure to ensure new fields are present
            setSystemState(prev => ({ 
                ...initialSystemState,
                ...parsed,
                // Ensure deep merge for new nested objects if they didn't exist
                resonanceCoherence: { ...initialSystemState.resonanceCoherence, ...parsed.resonanceCoherence },
                harmonicInterference: { ...initialSystemState.harmonicInterference, ...parsed.harmonicInterference },
                globalResonance: { ...initialSystemState.globalResonance, ...parsed.globalResonance }
            }));
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
      tickRef.current += 1;
      
      setSystemState(prev => {
        let newDecoherence = prev.quantumHealing.decoherence;
        
        // INTELLIGENT DECOHERENCE CALCULATION
        if (prev.biometricSync.coherence < 0.4) {
            newDecoherence = Math.min(1.0, newDecoherence + 0.012);
        } else {
            // Self-correction active in SOVEREIGN state
            const correctionPower = (prev.resonanceFactorRho * 0.005) + (isGrounded ? 0.01 : 0);
            newDecoherence = Math.max(0, newDecoherence - correctionPower);
        }

        // UNIFIED RESONANCE FACTOR RHO
        const baseRho = (prev.biometricSync.coherence + prev.schumannResonance.intensity + prev.bohrEinsteinCorrelator.correlation) / 3;
        let resonanceModifier = Math.max(0.1, Math.min(1.0, baseRho + (Math.random() - 0.5) * 0.002));
        
        // --- WAVE PHYSICS SIMULATION ---
        const phaseShiftRate = 0.5; // degrees per tick
        
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

        // Calculate Harmonic Interference
        // Standing Wave Ratio (SWR) approx: (1 + ReflectionCoefficient) / (1 - ReflectionCoefficient)
        // We simulate ReflectionCoefficient based on phase alignment between Lambda and Global Carrier
        const phaseDiff = Math.abs(newLambda.phase - (tickRef.current % 360));
        const reflectionCoeff = Math.abs(Math.cos(phaseDiff * (Math.PI / 180))) * (1 - resonanceModifier); // Less reflection at high resonance
        const swr = (1 + reflectionCoeff) / (1 - reflectionCoeff);
        
        const constructive = Math.max(0, 1 - reflectionCoeff);
        const destructive = reflectionCoeff;
        const beatFreq = Math.abs(newLambda.frequency - prev.globalResonance.globalCarrierFrequency * 1000) / 1000; // Hz diff

        const newHarmonicInterference: HarmonicInterferenceData = {
            beatFrequency: beatFreq + (Math.random() * 0.01),
            constructiveInterference: constructive,
            destructiveInterference: destructive,
            standingWaveRatio: Math.min(5.0, swr)
        };

        // PERFORMANCE TELEMETRY
        const newPerformance: PerformanceTelemetry = {
            logicalLatency: 0.0001 + (newDecoherence * 0.008),
            visualParity: 1.0 - (newDecoherence * 0.15),
            gpuLoad: 0.1 + (prev.supernovaTriforce.output / 150) + (Math.random() * 0.04),
            frameStability: 1.0 - (prev.vibration.amplitude / 200),
            thermalIndex: 30 + (prev.supernovaTriforce.stability * 15),
            throughput: 400 + (resonanceModifier * 250) + (Math.random() * 40),
            memoryUsage: 12 + (newDecoherence * 6) + (Math.random() * 1.5)
        };

        const coherenceScore = (resonanceModifier + prev.biometricSync.coherence + prev.bohrEinsteinCorrelator.correlation) / 3;
        let coherenceStatus: CoherenceResonanceData['status'] = 'COHERENT';
        if (coherenceScore < 0.7) coherenceStatus = 'RESONATING';
        if (coherenceScore < 0.4) coherenceStatus = 'DECOHERING';
        if (coherenceScore < 0.2) coherenceStatus = 'CRITICAL';

        const driftIncrease = prev.isPhaseLocked ? -0.0005 : (newDecoherence * 0.0004);

        // Update Global Synod Simulation
        const jitter = (n: number) => Math.max(0.1, Math.min(1.0, n + (Math.random() - 0.5) * 0.01));
        const newGlobalResonance: GlobalResonanceState = {
            ...prev.globalResonance,
            aggregateRho: (resonanceModifier + prev.globalResonance.communities.reduce((acc, c) => acc + c.rho, 0)) / (prev.globalResonance.communities.length + 1),
            activeArchitects: Math.max(100, prev.globalResonance.activeArchitects + (Math.random() > 0.5 ? 1 : -1)),
            communities: prev.globalResonance.communities.map(c => ({
                ...c,
                rho: jitter(c.rho),
                coherence: jitter(c.coherence),
                stability: jitter(c.stability)
            }))
        };

        // --- EARTH GROUNDING FEEDBACK LOOP ---
        const seismicNoise = (Math.random() - 0.4) * 0.05; // Slightly biased towards stability
        const telluricInput = (Math.random() - 0.4) * 0.02;

        let newSeismicActivity = Math.max(0, Math.min(1, (prev.earthGrounding.seismicActivity || 0.02) + seismicNoise * 0.1));
        let newTelluricCurrent = Math.max(0, Math.min(1, (prev.earthGrounding.telluricCurrent || 0.05) + telluricInput * 0.1));

        let newConductivity = prev.earthGrounding.conductivity - (newSeismicActivity * 0.005);
        let newCharge = prev.earthGrounding.charge + (newTelluricCurrent * 0.005);
        let feedbackStatus: 'IDLE' | 'CORRECTING' = 'IDLE';

        // Auto-Stabilization Trigger
        if (newConductivity < 0.8 && newCharge > 0.2) {
            feedbackStatus = 'CORRECTING';
            newCharge -= 0.005; // Consume charge to stabilize
            newConductivity += 0.01; // Restore conductivity
        }

        newConductivity = Math.max(0, Math.min(1, newConductivity));
        newCharge = Math.max(0, Math.min(1, newCharge));

        return {
          ...prev,
          isGrounded,
          performance: newPerformance,
          quantumHealing: {
              ...prev.quantumHealing,
              decoherence: newDecoherence,
              health: Math.max(0, 1.0 - newDecoherence * 0.8),
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
          globalResonance: newGlobalResonance,
          earthGrounding: {
              ...prev.earthGrounding,
              seismicActivity: newSeismicActivity,
              telluricCurrent: newTelluricCurrent,
              charge: newCharge,
              conductivity: newConductivity,
              feedbackLoopStatus: feedbackStatus
          }
        };
      });
    }, 1000);
    return () => { if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current); };
  }, [orbMode, isGrounded, diagnosticMode, addLogEntry]);

  return { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded,
    setDiagnosticMode
  };
};
