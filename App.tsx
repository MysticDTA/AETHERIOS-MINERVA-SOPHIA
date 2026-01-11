
import React, { useState, useEffect, useRef } from 'react';
import { useSystemSimulation } from './useSystemSimulation';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SystemFooter } from './components/SystemFooter';
import { Dashboard } from './components/Dashboard';
import { Display4 } from './components/Display4';
import { Display5 } from './components/Display5';
import { Display7 } from './components/Display7';
import { Display10 } from './components/Display10';
import { ResourceProcurement } from './components/ResourceProcurement';
import { SecurityShieldAudit } from './components/SecurityShieldAudit';
import { DeepDiagnosticOverlay } from './components/DeepDiagnosticOverlay';
import { Modal } from './components/Modal';
import { SimulationControls } from './components/SimulationControls';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ApiKeyGuard } from './components/ApiKeyGuard';
import { Login } from './components/Login';
import { PasswordReset } from './components/PasswordReset';
import { BiometricHandshake } from './components/BiometricHandshake'; 
import { KingdomSiteCommander } from './components/KingdomSiteCommander'; 
import { AgenticOrchestrator } from './components/AgenticOrchestrator';
import { SystemSummary } from './components/SystemSummary';
import { NoeticGraphNexus } from './components/NoeticGraphNexus';
import { AudioEngine } from './components/audio/AudioEngine';
import { SophiaEngineCore } from './services/sophiaEngine';
import { useInteractiveSubsystems } from './components/hooks/useInteractiveSubsystems';
import { useVoiceInterface } from './components/hooks/useVoiceInterface';
import { cosmosCommsService } from './services/cosmosCommsService';
import { knowledgeBase } from './services/knowledgeBase';
import { QuantumDynastyLedger } from './components/QuantumDynastyLedger';
import { SovereignWelcome } from './components/SovereignWelcome';
import { ChronosCausalEngine } from './components/ChronosCausalEngine';
import { ModuleManager } from './components/ModuleManager';
import { OrbMode, OrbModeConfig, LogType } from './types';

const ORB_MODES: OrbModeConfig[] = [
  { id: 'STANDBY', name: 'Standby', description: 'Low-power monitoring.' },
  { id: 'ANALYSIS', name: 'Analysis', description: 'Active heuristic scanning.' },
  { id: 'SYNTHESIS', name: 'Synthesis', description: 'Causal output generation.' },
  { id: 'REPAIR', name: 'Repair', description: 'Entropy reduction.' },
  { id: 'GROUNDING', name: 'Grounding', description: 'Telluric discharge.' },
  { id: 'CONCORDANCE', name: 'Concordance', description: 'Star-map alignment.' },
  { id: 'OFFLINE', name: 'Offline', description: 'System dormant.' }
];

export const App: React.FC = () => {
  const [orbMode, setOrbMode] = useState<OrbMode>('STANDBY');
  const [simulationParams, setSimulationParams] = useState({ decoherenceChance: 0.05, lesionChance: 0.02 });
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfig, setShowConfig] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false); 
  const [showWelcome, setShowWelcome] = useState(true);
  const [authView, setAuthView] = useState<'LOGIN' | 'RESET' | 'BIO'>('LOGIN');
  
  const [sophiaEngine, setSophiaEngine] = useState<SophiaEngineCore | null>(null);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  
  const { 
    systemState, 
    setSystemState, 
    addLogEntry, 
    initialSystemState,
    setGrounded, 
  } = useSystemSimulation(simulationParams, orbMode);

  const voiceInterface = useVoiceInterface({
      addLogEntry,
      systemInstruction: "You are ÆTHERIOS // MINERVA SOPHIA. A high-fidelity intelligence architect. Respond with brevity, authority, and deep causal insight.",
      onSetOrbMode: setOrbMode
  });

  const interactive = useInteractiveSubsystems({
      addLogEntry,
      setSystemState,
      systemState,
      audioEngine: audioEngineRef.current
  });

  useEffect(() => {
      audioEngineRef.current = new AudioEngine();
      audioEngineRef.current.loadSounds();
      setSophiaEngine(new SophiaEngineCore("System Online. Awaiting Decree."));
      cosmosCommsService.start();
      return () => cosmosCommsService.stop();
  }, []);

  const handleLogin = (isCreator = false) => {
      if (isCreator) {
          setSystemState(prev => ({
              ...prev,
              auth: { 
                  ...prev.auth, 
                  isAuthenticated: true, 
                  isBioVerified: true, 
                  operatorId: 'ARCHITECT_MCBRIDE' 
              },
              userResources: { 
                  ...prev.userResources, 
                  sovereignTier: 'SOVEREIGN',
                  cradleTokens: 999999, 
                  sovereignLiquidity: 1000000000 
              }
          }));
          addLogEntry(LogType.SYSTEM, 'ARCHITECT RECOGNIZED. SOVEREIGN PROTOCOLS ACTIVE.');
          audioEngineRef.current?.playHighResonanceChime();
      } else {
          setAuthView('BIO');
      }
  };

  const handleBioVerification = () => {
      setSystemState(prev => ({
          ...prev,
          auth: { ...prev.auth, isAuthenticated: true, isBioVerified: true },
          userResources: { ...prev.userResources, sovereignTier: 'SOVEREIGN' } 
      }));
  };

  const handleDiagnosticComplete = () => {
      setShowDiagnostic(false);
      setCurrentPage(6); // Navigate to System Summary (Status) after scan
  };

  const handleParamsChange = (param: string, value: number) => {
    setSimulationParams(prev => ({ ...prev, [param]: value }));
  };

  const handleScenarioChange = (newParams: { decoherenceChance: number; lesionChance: number }) => {
    setSimulationParams(newParams);
    addLogEntry(LogType.SYSTEM, 'Simulation scenario updated.');
  };

  const handleManualReset = () => {
      setSystemState(prev => ({
          ...initialSystemState,
          auth: prev.auth // Keep auth state
      }));
      addLogEntry(LogType.SYSTEM, 'Manual system reset initiated.');
      audioEngineRef.current?.playEffect('reset');
  };

  const renderPage = () => {
      if (showWelcome && systemState.userResources.sovereignTier === 'SOVEREIGN' && currentPage === 1) {
          return (
              <div className="absolute inset-0 z-50 animate-fade-in" onClick={() => setShowWelcome(false)}>
                  <SovereignWelcome 
                      liquidity={systemState.userResources.sovereignLiquidity || 22500000} 
                      manifestPulse={systemState.userResources.manifestPulse || 10000000} 
                  />
              </div>
          );
      }

      switch (currentPage) {
          case 1: return <Dashboard systemState={systemState} onTriggerScan={() => setShowDiagnostic(true)} scanCompleted={false} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => {}} audioEngine={audioEngineRef.current} />;
          case 4: return <Display4 systemState={systemState} orbMode={orbMode} sophiaEngine={sophiaEngine} onSaveInsight={() => {}} onToggleInstructionsModal={() => {}} onRelayCalibration={interactive.handleRelayCalibration} setOrbMode={setOrbMode} voiceInterface={voiceInterface} />;
          case 5: return <Display5 systemState={systemState} setSystemState={setSystemState} sophiaEngine={sophiaEngine} audioEngine={audioEngineRef.current} />;
          case 6: return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngine} />;
          case 7: return <Display7 systemState={systemState} transmission={cosmosCommsService.currentState} memories={knowledgeBase.getMemories()} onMemoryChange={() => setSystemState(prev => ({...prev}))} />;
          case 8: return <NoeticGraphNexus systemState={systemState} memories={knowledgeBase.getMemories()} logs={systemState.log} sophiaEngine={sophiaEngine} />;
          case 10: return <Display10 systemState={systemState} />;
          case 15: return <ResourceProcurement systemState={systemState} setSystemState={setSystemState} addLogEntry={addLogEntry} />;
          case 27: return <QuantumDynastyLedger systemState={systemState} />;
          case 28: return <KingdomSiteCommander />;
          case 29: return <AgenticOrchestrator active={true} />;
          case 30: return <SecurityShieldAudit systemState={systemState} setSystemState={setSystemState} audioEngine={audioEngineRef.current} />;
          case 31: return <ChronosCausalEngine systemState={systemState} setSystemState={setSystemState} audioEngine={audioEngineRef.current} />;
          case 32: return <ModuleManager systemState={systemState} setSystemState={setSystemState} addLogEntry={addLogEntry} />;
          default: return <Dashboard systemState={systemState} onTriggerScan={() => setShowDiagnostic(true)} scanCompleted={false} sophiaEngine={sophiaEngine} setOrbMode={setOrbMode} orbMode={orbMode} onOptimize={() => {}} audioEngine={audioEngineRef.current} />;
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
          <Layout breathCycle={systemState.breathCycle} isGrounded={systemState.isGrounded} resonanceFactor={systemState.resonanceFactorRho} orbMode={orbMode} coherence={systemState.biometricSync.coherence}>
            <Header 
                governanceAxiom={systemState.governanceAxiom} 
                lesions={systemState.quantumHealing.lesions} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
                audioEngine={audioEngineRef.current} 
                tokens={systemState.userResources.cradleTokens} 
                userTier={systemState.userResources.sovereignTier}
                transmissionStatus={cosmosCommsService.currentState.status}
                onToggleVoice={() => setCurrentPage(4)}
                isVoiceActive={voiceInterface.isSessionActive}
            />
            <main className="flex-grow flex flex-col min-h-0 relative z-10 overflow-hidden">{renderPage()}</main>
            <div className="mt-4 shrink-0"><SystemFooter orbModes={ORB_MODES} currentMode={orbMode} setMode={setOrbMode} currentPage={currentPage} setCurrentPage={setCurrentPage} onOpenConfig={() => setShowConfig(true)} /></div>
            <Modal isOpen={showConfig} onClose={() => setShowConfig(false)}>
                <SimulationControls 
                    params={simulationParams} 
                    onParamsChange={handleParamsChange} 
                    onScenarioChange={handleScenarioChange} 
                    onManualReset={handleManualReset} 
                    onGrounding={() => setGrounded(true)} 
                    isGrounded={systemState.isGrounded} 
                    audioEngine={audioEngineRef.current} 
                />
            </Modal>
            {showDiagnostic && (
                <DeepDiagnosticOverlay onClose={() => setShowDiagnostic(false)} onComplete={handleDiagnosticComplete} systemState={systemState} sophiaEngine={sophiaEngine} audioEngine={audioEngineRef.current} />
            )}
          </Layout>
        </ApiKeyGuard>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
