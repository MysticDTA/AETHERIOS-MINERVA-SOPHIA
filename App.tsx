
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { SystemState, OrbMode, OrbModeConfig, TransmissionState, LogType, UserTier } from './types';
import { AudioEngine } from './components/audio/AudioEngine';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SubsystemsDisplay } from './components/SubsystemsDisplay';
import { Display3 } from './components/Display3';
import { SophiaEngineCore } from './services/sophiaEngine';
import { knowledgeBase } from './services/knowledgeBase';
import { cosmosCommsService } from './services/cosmosCommsService';
import { useSystemSimulation } from './useSystemSimulation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Display4 } from './components/Display4';
import { Display5 } from './components/Display5';
import { Display6 } from './components/Display6';
import { Display7 } from './components/Display7';
import { Display8 } from './components/Display8';
import { Display10 } from './components/Display10';
import { Display11 } from './components/Display11';
import { Display12 } from './components/Display12';
import { SystemSummary } from './components/SystemSummary';
import { DeepDiagnosticOverlay } from './components/DeepDiagnosticOverlay';
import { ApiKeyGuard } from './components/ApiKeyGuard';
import { VeoFluxSynthesizer } from './components/VeoFluxSynthesizer';
import { SystemOptimizationTerminal } from './components/SystemOptimizationTerminal';
import { SovereignPortal } from './components/SovereignPortal';
import { CausalIngestionNexus } from './components/CausalIngestionNexus';
import { MenervaBridge } from './components/MenervaBridge';
import { useVoiceInterface } from './components/hooks/useVoiceInterface';
import { useInteractiveSubsystems } from './components/hooks/useInteractiveSubsystems';
import { CollectiveCoherenceView } from './components/CollectiveCoherenceView';
import { NeuralQuantizer } from './components/NeuralQuantizer';
import { ResourceProcurement } from './components/ResourceProcurement';
import { SatelliteUplink } from './components/SatelliteUplink';
import { DeploymentManifest } from './components/DeploymentManifest';
import { EventLog } from './components/EventLog';
import { SecurityShieldAudit } from './components/SecurityShieldAudit';
import { EventHorizonScreen } from './components/EventHorizonScreen';
import { SystemFooter } from './components/SystemFooter';
import { SimulationControls } from './components/SimulationControls';
import { Modal } from './components/Modal';
import { SYSTEM_NODES, TIER_REGISTRY } from './Registry';

const AETHERIOS_MANIFEST = `
📜 SYSTEM MANIFEST: MINERVA SOPHIA
Interface Version: 1.3.1-Radiant-Synthesis
Authority: The Architect
`;

const orbModes: OrbModeConfig[] = [
  { id: 'STANDBY', name: 'Standby', description: 'Aetheric Flux Monitoring. Maintaining equilibrium.' },
  { id: 'ANALYSIS', name: 'Analysis', description: 'Deep Heuristic Gestation. Siphoning reality-lattice data.' },
  { id: 'SYNTHESIS', name: 'Synthesis', description: 'Causal Form Weaving. Integrating logic and intuition.' },
  { id: 'REPAIR', name: 'Repair', description: 'Recursive Harmonic Restoration. Mending causal fractures.' },
  { id: 'GROUNDING', name: 'Grounding', description: 'Telluric Anchor Protocol. Discharging cognitive entropy.' },
  { id: 'CONCORDANCE', name: 'Concordance', description: 'Peak Radiant Sovereignty. Absolute phase alignment.' },
  { id: 'OFFLINE', name: 'Offline', description: 'System Dissipation.' }
];

const App: React.FC = () => {
  const [simulationParams, setSimulationParams] = useState({ decoherenceChance: 0.005, lesionChance: 0.001 }); 
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [orbMode, setOrbMode] = useState<OrbMode>('STANDBY');
  const [systemInstruction] = useState<string>(AETHERIOS_MANIFEST);
  const [transmission, setTransmission] = useState<TransmissionState>(cosmosCommsService.initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDiagnosticScan, setShowDiagnosticScan] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [logFilter, setLogFilter] = useState<LogType | 'ALL'>('ALL');
  
  const audioEngine = useRef<AudioEngine | null>(null);
  const sophiaEngine = useRef<SophiaEngineCore | null>(null);
  
  const { systemState, setSystemState, addLogEntry, setDiagnosticMode, setGrounded } = useSystemSimulation(simulationParams, orbMode);

  useEffect(() => {
    sophiaEngine.current = new SophiaEngineCore(systemInstruction);
  }, [systemInstruction]);

  useEffect(() => {
    audioEngine.current = new AudioEngine();
    audioEngine.current.loadSounds().then(() => setIsAudioReady(true));
    const unsubscribeComms = cosmosCommsService.subscribe(setTransmission);
    return () => { 
        unsubscribeComms(); 
        cosmosCommsService.stop();
    };
  }, []);

  const handleInitializeNode = useCallback(() => {
      audioEngine.current?.resumeContext();
      audioEngine.current?.playHighResonanceChime(); 
      setIsInitialized(true); 
      cosmosCommsService.start();
  }, []);

  const handleTriggerScan = useCallback(() => {
    setIsUpgrading(true);
    setOrbMode('ANALYSIS'); 
    setDiagnosticMode(true);
    audioEngine.current?.playUIScanStart();
    setShowDiagnosticScan(true);
  }, [setDiagnosticMode]);

  const handleManualReset = useCallback(() => {
    setSystemState(prev => ({
        ...prev,
        quantumHealing: { ...prev.quantumHealing, health: 1.0, decoherence: 0.0, lesions: 0 },
        governanceAxiom: 'REGENERATIVE CYCLE',
        resonanceFactorRho: 0.99
    }));
    audioEngine.current?.playEffect('reset');
    addLogEntry(LogType.SYSTEM, "MANUAL_CORE_RESET: System restored to baseline parameters.");
    
    // Smooth transition back to normal
    setTimeout(() => {
        setSystemState(prev => ({ ...prev, governanceAxiom: 'SOVEREIGN EMBODIMENT' }));
    }, 3000);
  }, [setSystemState, addLogEntry]);

  const handleDiagnosticComplete = async () => {
    setIsRecalibrating(true);
    setSystemState(prev => ({
        ...prev,
        quantumHealing: { ...prev.quantumHealing, health: 1.0, lesions: 0, decoherence: 0, status: "STABLE" },
        resonanceFactorRho: 1.0,
        temporalCoherenceDrift: 0.0,
        performance: { ...prev.performance, visualParity: 1.0 }
    }));
    audioEngine.current?.playUIConfirm();
    setDiagnosticMode(false);
    setOrbMode('STANDBY');
    setIsUpgrading(false);
    addLogEntry(LogType.SYSTEM, "LATTICE_RECALIBRATION: Visual Parity and Temporal Drift restored to Institutional Baseline.");
    
    setTimeout(() => setIsRecalibrating(false), 2000);
  };

  const handleGrounding = useCallback(() => {
      setGrounded(true);
      setSystemState(prev => ({ ...prev, isGrounded: true }));
      audioEngine.current?.playGroundingDischarge();
      addLogEntry(LogType.INFO, "TELLURIC ANCHOR: Grounding protocol active. Discharging entropy.");
      setTimeout(() => {
          setGrounded(false);
          setSystemState(prev => ({ ...prev, isGrounded: false }));
          addLogEntry(LogType.INFO, "TELLURIC ANCHOR: System stable.");
      }, 5000);
  }, [setGrounded, setSystemState, addLogEntry]);

  const voiceInterface = useVoiceInterface({ addLogEntry, systemInstruction, onSetOrbMode: setOrbMode });

  // Global Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
        
        // Command Console (/) - Only if not typing
        if (e.key === '/' && !isInputActive) {
            e.preventDefault();
            setCurrentPage(4);
            audioEngine.current?.playUIClick();
        }

        // System Scan (Ctrl + S)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            handleTriggerScan();
        }

        // Voice Command Toggle (Ctrl + V)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
             e.preventDefault();
             if (voiceInterface.isSessionActive) {
                 voiceInterface.closeVoiceSession();
             } else {
                 voiceInterface.startVoiceSession();
             }
             audioEngine.current?.playUIClick();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTriggerScan, voiceInterface]);

  const {
    handlePillarBoost,
    handleRelayCalibration,
    handleStarCalibration,
    handlePurgeAethericFlow,
    handleGroundingDischarge,
    handleHeliumFlush,
    handleDilutionCalibration,
    calibrationTargetId,
    calibrationEffect,
    isPurgingAether,
    isDischargingGround,
    isFlushingHelium,
    isCalibratingDilution,
  } = useInteractiveSubsystems({ addLogEntry, setSystemState, systemState, audioEngine: audioEngine.current });

  const pageContent = useMemo(() => {
      switch (currentPage) {
          case 1: return <Dashboard systemState={systemState} onTriggerScan={handleTriggerScan} scanCompleted={false} sophiaEngine={sophiaEngine.current} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => {}} />;
          case 2: return <SubsystemsDisplay systemState={systemState} onGroundingDischarge={handleGroundingDischarge} isDischargingGround={isDischargingGround} />;
          case 3: return <Display3 systemState={systemState} onRelayCalibration={handleRelayCalibration} onStarCalibrate={handleStarCalibration} calibrationTargetId={calibrationTargetId} calibrationEffect={calibrationEffect} setOrbMode={setOrbMode} sophiaEngine={sophiaEngine.current} />;
          case 4: return <Display4 systemState={systemState} orbMode={orbMode} sophiaEngine={sophiaEngine.current} onSaveInsight={(t) => knowledgeBase.addMemory(t, 'SOPHIA_CHAT')} onToggleInstructionsModal={() => {}} onRelayCalibration={handleRelayCalibration} setOrbMode={setOrbMode} voiceInterface={voiceInterface} onTriggerAudit={handleTriggerScan} />;
          case 5: return <Display5 systemState={systemState} setSystemState={setSystemState} sophiaEngine={sophiaEngine.current} audioEngine={audioEngine.current} />;
          case 6: return <Display6 systemState={systemState} onPillarBoost={handlePillarBoost} onHeliumFlush={handleHeliumFlush} isFlushingHelium={isFlushingHelium} onDilutionCalibrate={handleDilutionCalibration} isCalibratingDilution={isCalibratingDilution} />;
          case 7: return <Display7 systemState={systemState} transmission={transmission} memories={knowledgeBase.getMemories()} onMemoryChange={() => {}} />;
          case 8: return <Display8 systemState={systemState} onPurgeAethericFlow={handlePurgeAethericFlow} isPurgingAether={isPurgingAether} />;
          case 9: return <CollectiveCoherenceView systemState={systemState} sophiaEngine={sophiaEngine.current} />;
          case 10: return <Display10 systemState={systemState} />;
          case 11: return <Display11 systemState={systemState} />;
          case 12: return <Display12 systemState={systemState} />;
          case 13: return <div className="flex-1 min-h-0 bg-dark-surface/40 rounded-xl p-4 md:p-8 border border-white/5 shadow-2xl"><NeuralQuantizer orbMode={orbMode} /></div>;
          case 14: return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngine.current} />;
          case 15: return <ResourceProcurement systemState={systemState} setSystemState={setSystemState} addLogEntry={addLogEntry} />;
          case 16: return <SatelliteUplink systemState={systemState} sophiaEngine={sophiaEngine.current} setOrbMode={setOrbMode} />;
          case 17: return <DeploymentManifest systemState={systemState} onDeploySuccess={() => setCurrentPage(1)} />;
          case 18: return <VeoFluxSynthesizer systemState={systemState} />;
          case 19: return <SystemOptimizationTerminal systemState={systemState} onOptimizeComplete={() => setCurrentPage(1)} />;
          case 21: return <MenervaBridge systemState={systemState} />;
          case 22: return <div className="h-full"><EventLog log={systemState.log} filter={logFilter} onFilterChange={setLogFilter} /></div>;
          case 23: return <SecurityShieldAudit systemState={systemState} />;
          default: return <Dashboard systemState={systemState} onTriggerScan={handleTriggerScan} scanCompleted={false} sophiaEngine={sophiaEngine.current} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => {}} />;
      }
  }, [currentPage, systemState, orbMode, transmission, voiceInterface, calibrationTargetId, calibrationEffect, isPurgingAether, isDischargingGround, isFlushingHelium, isCalibratingDilution, handleTriggerScan, handleGroundingDischarge, handleRelayCalibration, handleStarCalibration, handlePillarBoost, handlePurgeAethericFlow, handleHeliumFlush, handleDilutionCalibration, logFilter]);

  if (systemState.governanceAxiom === 'SYSTEM COMPOSURE FAILURE') {
      return <EventHorizonScreen audioEngine={audioEngine.current} onManualReset={handleManualReset} />;
  }

  return (
    <ApiKeyGuard>
      <Layout 
        breathCycle={systemState.breathCycle} 
        isGrounded={systemState.isGrounded} 
        resonanceFactor={systemState.resonanceFactorRho}
        drift={systemState.temporalCoherenceDrift}
      >
        <div className={`fixed inset-0 z-[6000] pointer-events-none transition-all duration-1000 ${isRecalibrating ? 'bg-white/20 backdrop-blur-sm' : 'bg-transparent opacity-0'}`} />
        
        {showDiagnosticScan && (
          <ErrorBoundary>
            <DeepDiagnosticOverlay 
                onClose={() => { setShowDiagnosticScan(false); setDiagnosticMode(false); setOrbMode('STANDBY'); setIsUpgrading(false); }} 
                onComplete={handleDiagnosticComplete} 
                systemState={systemState} 
                sophiaEngine={sophiaEngine.current}
                audioEngine={audioEngine.current} 
            />
          </ErrorBoundary>
        )}

        <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)}>
            <SimulationControls 
                params={simulationParams} 
                onParamsChange={(key, val) => setSimulationParams(prev => ({ ...prev, [key]: val }))}
                onScenarioChange={setSimulationParams}
                onManualReset={handleManualReset}
                onGrounding={handleGrounding}
                isGrounded={systemState.isGrounded}
                audioEngine={audioEngine.current}
            />
        </Modal>
        
        {!isInitialized ? (
            <SovereignPortal onInitialize={handleInitializeNode} />
        ) : (
            <div className="flex flex-col h-full w-full gap-4 md:gap-6 relative z-10">
                <Header 
                  governanceAxiom={systemState.governanceAxiom} 
                  lesions={systemState.quantumHealing.lesions} 
                  currentPage={currentPage} 
                  onPageChange={setCurrentPage} 
                  audioEngine={audioEngine.current} 
                  tokens={systemState.userResources.cradleTokens} 
                  userTier={systemState.userResources.sovereignTier} 
                  transmissionStatus={transmission.status} 
                />
                
                <main className={`relative z-20 flex-grow flex flex-col h-full min-h-0 ${isUpgrading ? 'causal-reweaving' : ''} ${isRecalibrating ? 'scale-[0.99] blur-[1px]' : ''} transition-all duration-1000`}>
                    <ErrorBoundary>{pageContent}</ErrorBoundary>
                </main>
                
                <footer className="relative z-40 flex-shrink-0 w-full mb-1 md:mb-2 pointer-events-auto flex justify-center">
                    <SystemFooter 
                        orbModes={orbModes} 
                        currentMode={orbMode} 
                        setMode={setOrbMode} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        onOpenConfig={() => setShowConfigModal(true)}
                    />
                </footer>
            </div>
        )}
      </Layout>
    </ApiKeyGuard>
  );
};

export default App;
