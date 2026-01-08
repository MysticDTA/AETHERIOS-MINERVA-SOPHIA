
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSystemSimulation } from './useSystemSimulation';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SystemFooter } from './components/SystemFooter';
import { Dashboard } from './components/Dashboard';
import { Display3 } from './components/Display3';
import { Display4 } from './components/Display4';
import { Display5 } from './components/Display5';
import { Display6 } from './components/Display6';
import { Display7 } from './components/Display7';
import { Display8 } from './components/Display8';
import { Display10 } from './components/Display10';
import { Display11 } from './components/Display11';
import { Display12 } from './components/Display12';
import { CollectiveCoherenceView } from './components/CollectiveCoherenceView';
import { SubsystemsDisplay } from './components/SubsystemsDisplay';
import { SystemSummary } from './components/SystemSummary';
import { ResourceProcurement } from './components/ResourceProcurement';
import { SatelliteUplink } from './components/SatelliteUplink';
import { DeploymentManifest } from './components/DeploymentManifest';
import { VeoFluxSynthesizer } from './components/VeoFluxSynthesizer';
import { ModuleManager } from './components/ModuleManager';
import { MenervaBridge } from './components/MenervaBridge';
import { EventLog } from './components/EventLog';
import { SecurityShieldAudit } from './components/SecurityShieldAudit';
import { QuantumComputeNexus } from './components/QuantumComputeNexus';
import { NoeticGraphNexus } from './components/NoeticGraphNexus';
import { SystemOptimizationTerminal } from './components/SystemOptimizationTerminal';
import { DeepDiagnosticOverlay } from './components/DeepDiagnosticOverlay';
import { EventHorizonScreen } from './components/EventHorizonScreen';
import { AccessDeniedScreen } from './components/AccessDeniedScreen';
import { Modal } from './components/Modal';
import { SimulationControls } from './components/SimulationControls';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ApiKeyGuard } from './components/ApiKeyGuard';
import { Login } from './components/Login';
import { PasswordReset } from './components/PasswordReset';
import { AudioEngine } from './components/audio/AudioEngine';
import { SophiaEngineCore } from './services/sophiaEngine';
import { useInteractiveSubsystems } from './components/hooks/useInteractiveSubsystems';
import { useVoiceInterface } from './components/hooks/useVoiceInterface';
import { cosmosCommsService } from './services/cosmosCommsService';
import { knowledgeBase } from './services/knowledgeBase';
import { CoCreatorNexus } from './components/CoCreatorNexus';
import { NeuralQuantizer } from './components/NeuralQuantizer';
import { OrbMode, OrbModeConfig, LogType } from './types';
import { SYSTEM_NODES, checkNodeAccess } from './Registry';

const ORB_MODES: OrbModeConfig[] = [
  { id: 'STANDBY', name: 'Standby', description: 'Low-power monitoring state.' },
  { id: 'ANALYSIS', name: 'Analysis', description: 'Active heuristic scanning and logic audit.' },
  { id: 'SYNTHESIS', name: 'Synthesis', description: 'Generative causal output.' },
  { id: 'REPAIR', name: 'Repair', description: 'System-wide entropy reduction.' },
  { id: 'GROUNDING', name: 'Grounding', description: 'Earth-resonance stabilization.' },
  { id: 'CONCORDANCE', name: 'Concordance', description: 'Lyran star-map alignment.' },
  { id: 'OFFLINE', name: 'Offline', description: 'Severed connection.' },
];

export const App: React.FC = () => {
  const [orbMode, setOrbMode] = useState<OrbMode>('STANDBY');
  const [simulationParams, setSimulationParams] = useState({ decoherenceChance: 0.05, lesionChance: 0.02 });
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfig, setShowConfig] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(true); // Auto-start diagnostic
  const [lastAuditReport, setLastAuditReport] = useState<{report: string, sources: any[]} | null>(null);
  
  // Auth State for View Switching
  const [authView, setAuthView] = useState<'LOGIN' | 'RESET'>('LOGIN');
  
  const [sophiaEngine, setSophiaEngine] = useState<SophiaEngineCore | null>(null);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  
  // Custom Hooks
  const { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded, 
    setDiagnosticMode 
  } = useSystemSimulation(simulationParams, orbMode);

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
  } = useInteractiveSubsystems({ 
      addLogEntry, 
      setSystemState, 
      systemState, 
      audioEngine: audioEngineRef.current 
  });

  const voiceInterface = useVoiceInterface({
      addLogEntry,
      systemInstruction: "You are Sophia, the Causal Resonance Engine. Speak with precision.",
      onSetOrbMode: setOrbMode
  });

  // Services Initialization
  useEffect(() => {
      audioEngineRef.current = new AudioEngine();
      audioEngineRef.current.loadSounds();
      setSophiaEngine(new SophiaEngineCore("System Online. Awaiting Architect Decree."));
      cosmosCommsService.start();
      
      const handleUserInteraction = () => {
          audioEngineRef.current?.resumeContext();
          window.removeEventListener('click', handleUserInteraction);
      };
      window.addEventListener('click', handleUserInteraction);

      return () => cosmosCommsService.stop();
  }, []);

  // Audio Mode Sync
  useEffect(() => {
      audioEngineRef.current?.setMode(orbMode);
      audioEngineRef.current?.updateDynamicAmbience(systemState);
  }, [systemState.governanceAxiom, systemState, orbMode]);

  const handleManualReset = () => {
      setSystemState(initialSystemState);
      addLogEntry(LogType.SYSTEM, 'Manual system reset triggered. Entropy cleared.');
      audioEngineRef.current?.playEffect('reset');
  };

  const handleLogin = () => {
      setSystemState(prev => ({
          ...prev,
          auth: { ...prev.auth, isAuthenticated: true }
      }));
      addLogEntry(LogType.SYSTEM, "Operator Verified. Sovereign Gate Opened.");
  };

  const renderPage = () => {
      const nodeConfig = SYSTEM_NODES.find(n => n.id === currentPage);
      
      if (nodeConfig && !checkNodeAccess(systemState.userResources.sovereignTier, nodeConfig.requiredTier)) {
          return (
              <AccessDeniedScreen 
                  requiredTier={nodeConfig.requiredTier} 
                  currentTier={systemState.userResources.sovereignTier}
                  onNavigateToVault={() => setCurrentPage(15)} 
              />
          );
      }

      switch (currentPage) {
          case 1: // SANCTUM
              return <Dashboard 
                  systemState={systemState} 
                  onTriggerScan={() => setShowDiagnostic(true)} 
                  scanCompleted={false} 
                  sophiaEngine={sophiaEngine}
                  setOrbMode={setOrbMode}
                  orbMode={orbMode}
                  onOptimize={() => {}}
                  onUpgrade={() => setCurrentPage(15)}
                  audioEngine={audioEngineRef.current}
              />;
          case 2: // LATTICE
              return <CoCreatorNexus />;
          case 3: // STARMAP
              return <Display3 
                  systemState={systemState}
                  onRelayCalibration={handleRelayCalibration}
                  onStarCalibrate={handleStarCalibration}
                  calibrationTargetId={calibrationTargetId}
                  calibrationEffect={calibrationEffect}
                  setOrbMode={setOrbMode}
                  sophiaEngine={sophiaEngine}
              />;
          case 4: // CRADLE
              return <Display4 
                  systemState={systemState}
                  orbMode={orbMode}
                  sophiaEngine={sophiaEngine}
                  onSaveInsight={(text) => knowledgeBase.addMemory(text, 'SOPHIA_CHAT')}
                  onToggleInstructionsModal={() => {}}
                  onRelayCalibration={handleRelayCalibration}
                  setOrbMode={setOrbMode}
                  voiceInterface={voiceInterface}
                  onTriggerAudit={() => setShowDiagnostic(true)}
              />;
          case 5: // HARMONY
              return <Display5 
                  systemState={systemState}
                  setSystemState={setSystemState}
                  sophiaEngine={sophiaEngine}
                  audioEngine={audioEngineRef.current}
              />;
          case 6: // MATRIX
              return <SubsystemsDisplay 
                  systemState={systemState}
                  onGroundingDischarge={handleGroundingDischarge}
                  isDischargingGround={isDischargingGround}
              />;
          case 7: // COMS
              return <Display7 
                  systemState={systemState}
                  transmission={cosmosCommsService['currentState']} 
                  memories={knowledgeBase.getMemories()}
                  onMemoryChange={() => {}}
              />;
          case 8: // FLOW
              return <Display8 
                  systemState={systemState}
                  onPurgeAethericFlow={handlePurgeAethericFlow}
                  isPurgingAether={isPurgingAether}
              />;
          case 9: // SYNOD
              return <CollectiveCoherenceView systemState={systemState} sophiaEngine={sophiaEngine} />;
          case 10: // BREATH
              return <Display10 systemState={systemState} />;
          case 11: // CORE
              return <Display11 systemState={systemState} />;
          case 12: // AURA
              return <Display12 systemState={systemState} />;
          case 13: // NEURON
              return <div className="h-full bg-black/20 rounded-xl overflow-hidden relative">
                  <NeuralQuantizer orbMode={orbMode} systemState={systemState} />
                  <div className="absolute top-4 left-4 font-orbitron text-pearl">Neural Quantizer Matrix</div>
              </div>;
          case 14: // SUMMARY
              return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngine} existingReport={lastAuditReport} />;
          case 15: // VAULT
              return <ResourceProcurement systemState={systemState} setSystemState={setSystemState} addLogEntry={addLogEntry} />;
          case 16: // ORBIT
              return <SatelliteUplink systemState={systemState} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} />;
          case 17: // READY
              return <DeploymentManifest systemState={systemState} onDeploySuccess={() => addLogEntry(LogType.SYSTEM, 'Deployment to Edge verified.')} />;
          case 18: // VEO
              return <VeoFluxSynthesizer systemState={systemState} />;
          case 19: // AUDIT (Page View)
              return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngine} existingReport={lastAuditReport} />;
          case 20: // MODULES
              return <ModuleManager systemState={systemState} />;
          case 21: // BRIDGE
              return <MenervaBridge systemState={systemState} />;
          case 22: // LOGS
              return <EventLog log={systemState.log} filter={'ALL'} onFilterChange={() => {}} />;
          case 23: // SHIELD
              return <SecurityShieldAudit systemState={systemState} setSystemState={setSystemState} audioEngine={audioEngineRef.current} />;
          case 25: // QUANTUM
              return <QuantumComputeNexus 
                  systemState={systemState} 
                  sophiaEngine={sophiaEngine} 
                  voiceStream={voiceInterface.userInputTranscription}
              />;
          case 26: // NOETIC
              return <NoeticGraphNexus systemState={systemState} memories={knowledgeBase.getMemories()} logs={systemState.log} sophiaEngine={sophiaEngine} />;
          default:
              return <Dashboard 
                  systemState={systemState} 
                  onTriggerScan={() => setShowDiagnostic(true)} 
                  scanCompleted={false} 
                  sophiaEngine={sophiaEngine}
                  setOrbMode={setOrbMode}
                  orbMode={orbMode}
                  onOptimize={() => {}}
                  audioEngine={audioEngineRef.current}
              />;
      }
  };

  // --- AUTHENTICATION GATE ---
  if (!systemState.auth.isAuthenticated) {
      return (
          <ThemeProvider>
              <ErrorBoundary>
                  {authView === 'LOGIN' ? (
                      <Login 
                          onLogin={handleLogin} 
                          onForgotPassword={() => setAuthView('RESET')}
                          audioEngine={audioEngineRef.current} 
                      />
                  ) : (
                      <PasswordReset 
                          onBack={() => setAuthView('LOGIN')}
                          audioEngine={audioEngineRef.current}
                      />
                  )}
              </ErrorBoundary>
          </ThemeProvider>
      );
  }

  // --- EVENT HORIZON ---
  if (systemState.quantumHealing.decoherence >= 1.0) {
      return (
          <ThemeProvider>
              <EventHorizonScreen 
                  audioEngine={audioEngineRef.current} 
                  onManualReset={handleManualReset} 
              />
          </ThemeProvider>
      );
  }

  // --- MAIN APP ---
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <ApiKeyGuard>
          <Layout 
            breathCycle={systemState.breathCycle} 
            isGrounded={systemState.isGrounded}
            resonanceFactor={systemState.resonanceFactorRho}
            drift={systemState.temporalCoherenceDrift}
            orbMode={orbMode}
            coherence={systemState.biometricSync.coherence}
          >
            <Header 
                governanceAxiom={systemState.governanceAxiom}
                lesions={systemState.quantumHealing.lesions}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                audioEngine={audioEngineRef.current}
                tokens={systemState.userResources.cradleTokens}
                userTier={systemState.userResources.sovereignTier}
                transmissionStatus={cosmosCommsService['currentState']?.status} 
                isVoiceActive={voiceInterface.isSessionActive}
                onToggleVoice={voiceInterface.isSessionActive ? voiceInterface.closeVoiceSession : voiceInterface.startVoiceSession}
            />

            <main className="flex-grow flex flex-col min-h-0 relative z-10 overflow-hidden">
                {renderPage()}
            </main>

            <div className="mt-4 shrink-0">
                <SystemFooter 
                    orbModes={ORB_MODES}
                    currentMode={orbMode}
                    setMode={setOrbMode}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    onOpenConfig={() => setShowConfig(true)}
                />
            </div>

            {/* Overlays */}
            <Modal isOpen={showConfig} onClose={() => setShowConfig(false)}>
                <SimulationControls 
                    params={simulationParams}
                    onParamsChange={(k, v) => setSimulationParams(p => ({ ...p, [k]: v }))}
                    onScenarioChange={setSimulationParams}
                    onManualReset={handleManualReset}
                    onGrounding={() => {
                        setGrounded(true);
                        setTimeout(() => setGrounded(false), 8000);
                    }}
                    isGrounded={systemState.isGrounded}
                    audioEngine={audioEngineRef.current}
                />
            </Modal>

            {showDiagnostic && (
                <DeepDiagnosticOverlay 
                    onClose={() => setShowDiagnostic(false)}
                    onComplete={() => {
                        setShowDiagnostic(false);
                        addLogEntry(LogType.SYSTEM, 'Deep heuristic audit completed. Core stabilized.');
                        setCurrentPage(19); // Navigate to Full Audit Report
                    }}
                    systemState={systemState}
                    sophiaEngine={sophiaEngine}
                    audioEngine={audioEngineRef.current}
                    onReportGenerated={setLastAuditReport}
                />
            )}
          </Layout>
        </ApiKeyGuard>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
