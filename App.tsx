
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { SystemState, OrbMode, OrbModeConfig, TransmissionState, LogType } from './types';
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
import { OrbControls } from './components/OrbControls';
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

const NAV_SEQUENCE = [1, 2, 3, 4, 16, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 21, 23, 22];

const App: React.FC = () => {
  const [simulationParams] = useState({ decoherenceChance: 0.005, lesionChance: 0.001 }); 
  const [scanCompleted, setScanCompleted] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [orbMode, setOrbMode] = useState<OrbMode>('STANDBY');
  const [systemInstruction] = useState<string>(AETHERIOS_MANIFEST);
  const [transmission, setTransmission] = useState<TransmissionState>(cosmosCommsService.initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDiagnosticScan, setShowDiagnosticScan] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
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

  const handleDiagnosticComplete = async () => {
    setSystemState(prev => ({
        ...prev,
        quantumHealing: { ...prev.quantumHealing, health: 1.0, lesions: 0, decoherence: 0, status: "STABLE" },
        resonanceFactorRho: 1.0,
    }));
    audioEngine.current?.playUIConfirm();
    setScanCompleted(true);
    setDiagnosticMode(false);
    setOrbMode('STANDBY');
    setIsUpgrading(false);
  };

  const voiceInterface = useVoiceInterface({ addLogEntry, systemInstruction, onSetOrbMode: setOrbMode });

  const {
    calibrationTargetId,
    calibrationEffect,
    isPurgingAether,
    isDischargingGround,
    isFlushingHelium,
    isCalibratingDilution,
    handlePillarBoost,
    handleRelayCalibration,
    handleStarCalibration,
    handlePurgeAethericFlow,
    handleGroundingDischarge,
    handleHeliumFlush,
    handleDilutionCalibration,
  } = useInteractiveSubsystems({ addLogEntry, setSystemState, systemState, audioEngine: audioEngine.current });

  const pageContent = useMemo(() => {
      switch (currentPage) {
          case 1: return <Dashboard systemState={systemState} onTriggerScan={handleTriggerScan} scanCompleted={scanCompleted} sophiaEngine={sophiaEngine.current} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => {}} />;
          case 2: return <SubsystemsDisplay systemState={systemState} onGroundingDischarge={handleGroundingDischarge} isDischargingGround={isDischargingGround} />;
          case 3: return <Display3 systemState={systemState} onRelayCalibration={handleRelayCalibration} onStarCalibrate={handleStarCalibration} calibrationTargetId={calibrationTargetId} calibrationEffect={calibrationEffect} setOrbMode={setOrbMode} sophiaEngine={sophiaEngine.current} />;
          case 4: return (
              <Display4 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngine.current} 
                onSaveInsight={(t) => knowledgeBase.addMemory(t, 'SOPHIA_CHAT')} 
                onToggleInstructionsModal={() => {}} 
                onRelayCalibration={handleRelayCalibration} 
                setOrbMode={setOrbMode} 
                voiceInterface={voiceInterface} 
                onTriggerAudit={handleTriggerScan} 
              />
          );
          case 5: return <Display5 systemState={systemState} setSystemState={setSystemState} sophiaEngine={sophiaEngine.current} />;
          case 6: return <Display6 systemState={systemState} onPillarBoost={handlePillarBoost} onHeliumFlush={handleHeliumFlush} isFlushingHelium={isFlushingHelium} onDilutionCalibrate={handleDilutionCalibration} isCalibratingDilution={isCalibratingDilution} />;
          case 7: return <Display7 systemState={systemState} transmission={transmission} memories={knowledgeBase.getMemories()} onMemoryChange={() => {}} />;
          case 8: return <Display8 systemState={systemState} onPurgeAethericFlow={handlePurgeAethericFlow} isPurgingAether={isPurgingAether} />;
          case 9: return <CollectiveCoherenceView systemState={systemState} sophiaEngine={sophiaEngine.current} />;
          case 10: return <Display10 systemState={systemState} />;
          case 11: return <Display11 systemState={systemState} />;
          case 12: return <Display12 systemState={systemState} />;
          case 13: return <div className="flex-1 min-h-0 bg-dark-surface/40 rounded-xl p-8 border border-white/5"><NeuralQuantizer orbMode={orbMode} /></div>;
          case 14: return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngine.current} />;
          case 15: return <ResourceProcurement systemState={systemState} setSystemState={setSystemState} addLogEntry={addLogEntry} />;
          case 16: return <SatelliteUplink systemState={systemState} sophiaEngine={sophiaEngine.current} setOrbMode={setOrbMode} />;
          case 17: return <DeploymentManifest systemState={systemState} onDeploySuccess={() => setCurrentPage(1)} />;
          case 18: return <VeoFluxSynthesizer systemState={systemState} />;
          case 19: return <SystemOptimizationTerminal systemState={systemState} onOptimizeComplete={() => setCurrentPage(1)} />;
          case 21: return <MenervaBridge systemState={systemState} />;
          case 23: return <SecurityShieldAudit systemState={systemState} />;
          case 22: return <div className="h-full"><EventLog log={systemState.log} filter={logFilter} onFilterChange={setLogFilter} /></div>;
          default: return <Dashboard systemState={systemState} onTriggerScan={handleTriggerScan} scanCompleted={scanCompleted} sophiaEngine={sophiaEngine.current} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => {}} />;
      }
  }, [currentPage, systemState, scanCompleted, orbMode, transmission, voiceInterface, calibrationTargetId, calibrationEffect, isPurgingAether, isDischargingGround, isFlushingHelium, isCalibratingDilution, handleTriggerScan, handleGroundingDischarge, handleRelayCalibration, handleStarCalibration, handlePillarBoost, handlePurgeAethericFlow, handleHeliumFlush, handleDilutionCalibration, logFilter]);

  const dashboardContent = (
    <ApiKeyGuard>
      <Layout 
        breathCycle={systemState.breathCycle} 
        isGrounded={systemState.isGrounded} 
        resonanceFactor={systemState.resonanceFactorRho}
        drift={systemState.temporalCoherenceDrift}
      >
        {showDiagnosticScan && (
          <ErrorBoundary>
            <DeepDiagnosticOverlay onClose={() => { setShowDiagnosticScan(false); setDiagnosticMode(false); setOrbMode('STANDBY'); setIsUpgrading(false); }} onComplete={handleDiagnosticComplete} systemState={systemState} sophiaEngine={sophiaEngine.current} />
          </ErrorBoundary>
        )}
        <Header governanceAxiom={systemState.governanceAxiom} lesions={systemState.quantumHealing.lesions} currentPage={currentPage} onPageChange={setCurrentPage} audioEngine={audioEngine.current} tokens={systemState.userResources.cradleTokens} userTier={systemState.userResources.sovereignTier} transmissionStatus={transmission.status} />
        <main className={`relative z-20 flex-grow flex flex-col mt-8 h-full min-h-0 ${isUpgrading ? 'causal-reweaving' : ''}`}>
          <ErrorBoundary>{pageContent}</ErrorBoundary>
        </main>
        <footer className="relative z-40 flex-shrink-0 w-full mt-6 pb-6 h-16 pointer-events-auto">
            <div className="bg-dark-surface/90 border border-white/10 backdrop-blur-2xl p-2.5 rounded-lg flex items-center justify-between shadow-2xl aether-pulse">
                <OrbControls modes={orbModes} currentMode={orbMode} setMode={setOrbMode} />
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(23)} className="px-4 py-2 bg-rose-950/20 border border-rose-500/40 text-rose-400 font-orbitron text-[9px] uppercase tracking-[0.2em] rounded-sm hover:bg-rose-500 hover:text-white transition-all font-bold">Security_Shield</button>
                  <button onClick={() => setCurrentPage(22)} className="px-4 py-2 bg-slate-900/10 border border-slate-500/20 text-slate-400 font-orbitron text-[9px] uppercase tracking-[0.2em] rounded-sm hover:bg-slate-500 hover:text-white transition-all font-bold">System_Logs</button>
                  <button onClick={() => setCurrentPage(21)} className="px-4 py-2 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[9px] uppercase tracking-[0.2em] rounded-sm hover:bg-gold hover:text-dark-bg transition-all font-bold">Menerva_Bridge</button>
                </div>
            </div>
        </footer>
      </Layout>
    </ApiKeyGuard>
  );

  return !isInitialized ? (
    <SovereignPortal onInitialize={handleInitializeNode} />
  ) : dashboardContent;
};

export default App;
