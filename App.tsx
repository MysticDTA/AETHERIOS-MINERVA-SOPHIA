
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSystemSimulation } from './useSystemSimulation';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SystemFooter } from './components/SystemFooter';
import { Dashboard } from './components/Dashboard';
import { Display3 } from './components/Display3';
import { Display4 } from './components/Display4';
import { Display5 } from './components/Display5';
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
import { BiometricHandshake } from './components/BiometricHandshake'; // ABC Upgrade
import { KingdomSiteCommander } from './components/KingdomSiteCommander'; // LIT Upgrade
import { AudioEngine } from './components/audio/AudioEngine';
import { SophiaEngineCore } from './services/sophiaEngine';
import { useInteractiveSubsystems } from './components/hooks/useInteractiveSubsystems';
import { useVoiceInterface } from './components/hooks/useVoiceInterface';
import { cosmosCommsService } from './services/cosmosCommsService';
import { knowledgeBase } from './services/knowledgeBase';
import { CoCreatorNexus } from './components/CoCreatorNexus';
import { NeuralQuantizer } from './components/NeuralQuantizer';
import { VoiceInterface } from './components/VoiceInterface';
import { QuantumDynastyLedger } from './components/QuantumDynastyLedger';
import { SovereignWelcome } from './components/SovereignWelcome';
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
  const [showDiagnostic, setShowDiagnostic] = useState(true); 
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [lastAuditReport, setLastAuditReport] = useState<{report: string, sources: any[]} | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const [authView, setAuthView] = useState<'LOGIN' | 'RESET' | 'BIO'>('LOGIN'); // Added BIO step
  
  const [sophiaEngine, setSophiaEngine] = useState<SophiaEngineCore | null>(null);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  
  const { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded, 
    setDiagnosticMode 
  } = useSystemSimulation(simulationParams, orbMode);

  useEffect(() => {
    if (systemState.userResources.sovereignTier === 'SOVEREIGN') {
        setSystemState(prev => ({
            ...prev,
            userResources: {
                ...prev.userResources,
                sovereignLiquidity: 22500000.00,
                manifestPulse: 10000000.00
            }
        }));
    }
  }, [systemState.userResources.sovereignTier]);

  const {
    calibrationTargetId,
    calibrationEffect,
    isPurgingAether,
    isDischargingGround,
    isFlushingHelium,
    isCalibratingDilution,
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

  const handleLogin = () => {
      // Transition to Biometric Handshake for Sovereign-class entry
      setAuthView('BIO');
      addLogEntry(LogType.SYSTEM, "Classical handshake verified. Initializing Aetheric Biometric Core...");
  };

  const handleBioVerification = () => {
      setSystemState(prev => ({
          ...prev,
          auth: { ...prev.auth, isAuthenticated: true, isBioVerified: true },
          userResources: { ...prev.userResources, sovereignTier: 'SOVEREIGN' } 
      }));
      addLogEntry(LogType.SYSTEM, "ABC Verified. Grand Rising Architect McBride.");
  };

  const renderPage = () => {
      if (showWelcome && systemState.userResources.sovereignTier === 'SOVEREIGN' && currentPage === 1) {
          return (
              <div className="absolute inset-0 z-50 animate-fade-in" onClick={() => setShowWelcome(false)}>
                  <SovereignWelcome 
                      liquidity={systemState.userResources.sovereignLiquidity || 22500000} 
                      manifestPulse={systemState.userResources.manifestPulse || 10000000} 
                  />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-orbitron text-[9px] text-pearl/20 uppercase tracking-[0.4em] animate-pulse">Click to enter Sanctum</div>
              </div>
          );
      }

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
          case 1: 
              return <Dashboard systemState={systemState} onTriggerScan={() => setShowDiagnostic(true)} scanCompleted={!!lastAuditReport} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => setCurrentPage(24)} onUpgrade={() => setCurrentPage(15)} audioEngine={audioEngineRef.current} />;
          case 28: // KINGDOM (LIT)
              return <KingdomSiteCommander />;
          case 3: 
              return <Display3 systemState={systemState} onRelayCalibration={handleRelayCalibration} onStarCalibrate={handleStarCalibration} calibrationTargetId={calibrationTargetId} calibrationEffect={calibrationEffect} setOrbMode={setOrbMode} sophiaEngine={sophiaEngine} />;
          case 4: 
              return <Display4 systemState={systemState} orbMode={orbMode} sophiaEngine={sophiaEngine} onSaveInsight={(text) => knowledgeBase.addMemory(text, 'SOPHIA_CHAT')} onToggleInstructionsModal={() => {}} onRelayCalibration={handleRelayCalibration} setOrbMode={setOrbMode} voiceInterface={voiceInterface} onTriggerAudit={() => setShowDiagnostic(true)} />;
          case 5: 
              return <Display5 systemState={systemState} setSystemState={setSystemState} sophiaEngine={sophiaEngine} audioEngine={audioEngineRef.current} />;
          case 6: 
              return <SubsystemsDisplay systemState={systemState} onGroundingDischarge={handleGroundingDischarge} isDischargingGround={isDischargingGround} />;
          case 27: // DYNASTY (SCEB)
              return <QuantumDynastyLedger systemState={systemState} />;
          case 25: 
              return <QuantumComputeNexus systemState={systemState} sophiaEngine={sophiaEngine} voiceStream={voiceInterface.userInputTranscription} />;
          case 22: 
              return <EventLog log={systemState.log} filter={'ALL'} onFilterChange={() => {}} />;
          case 23: 
              return <SecurityShieldAudit systemState={systemState} setSystemState={setSystemState} audioEngine={audioEngineRef.current} />;
          default:
              return <Dashboard systemState={systemState} onTriggerScan={() => setShowDiagnostic(true)} scanCompleted={!!lastAuditReport} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => setCurrentPage(24)} audioEngine={audioEngineRef.current} />;
      }
  };

  if (!systemState.auth.isAuthenticated) {
      return (
          <ThemeProvider>
              <ErrorBoundary>
                  {authView === 'LOGIN' ? (
                      <Login onLogin={handleLogin} onForgotPassword={() => setAuthView('RESET')} audioEngine={audioEngineRef.current} />
                  ) : authView === 'BIO' ? (
                      <BiometricHandshake onVerified={handleBioVerification} onFail={() => setAuthView('LOGIN')} />
                  ) : (
                      <PasswordReset onBack={() => setAuthView('LOGIN')} audioEngine={audioEngineRef.current} />
                  )}
              </ErrorBoundary>
          </ThemeProvider>
      );
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <ApiKeyGuard>
          <Layout breathCycle={systemState.breathCycle} isGrounded={systemState.isGrounded} resonanceFactor={systemState.resonanceFactorRho} drift={systemState.temporalCoherenceDrift} orbMode={orbMode} coherence={systemState.biometricSync.coherence}>
            <Header governanceAxiom={systemState.governanceAxiom} lesions={systemState.quantumHealing.lesions} currentPage={currentPage} onPageChange={setCurrentPage} audioEngine={audioEngineRef.current} tokens={systemState.userResources.cradleTokens} userTier={systemState.userResources.sovereignTier} transmissionStatus={cosmosCommsService['currentState']?.status} isVoiceActive={voiceInterface.isSessionActive} onToggleVoice={() => setShowVoicePanel(!showVoicePanel)} />
            <main className="flex-grow flex flex-col min-h-0 relative z-10 overflow-hidden">{renderPage()}</main>
            <div className="mt-4 shrink-0"><SystemFooter orbModes={ORB_MODES} currentMode={orbMode} setMode={setOrbMode} currentPage={currentPage} setCurrentPage={setCurrentPage} onOpenConfig={() => setShowConfig(true)} /></div>
            <Modal isOpen={showConfig} onClose={() => setShowConfig(false)}>
                <SimulationControls params={simulationParams} onParamsChange={(k, v) => setSimulationParams(p => ({ ...p, [k]: v }))} onScenarioChange={setSimulationParams} onManualReset={() => setSystemState(initialSystemState)} onGrounding={() => {setGrounded(true); setTimeout(() => setGrounded(false), 8000);}} isGrounded={systemState.isGrounded} audioEngine={audioEngineRef.current} />
            </Modal>
            {showDiagnostic && (
                <DeepDiagnosticOverlay onClose={() => setShowDiagnostic(false)} onComplete={() => setShowDiagnostic(false)} systemState={systemState} sophiaEngine={sophiaEngine} audioEngine={audioEngineRef.current} onReportGenerated={setLastAuditReport} />
            )}
          </Layout>
        </ApiKeyGuard>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
