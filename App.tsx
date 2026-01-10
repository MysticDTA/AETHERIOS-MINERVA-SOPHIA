
import React, { useState, useEffect, useRef } from 'react';
import { useSystemSimulation } from './useSystemSimulation';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SystemFooter } from './components/SystemFooter';
import { Dashboard } from './components/Dashboard';
import { Display3 } from './components/Display3';
import { Display4 } from './components/Display4';
import { Display5 } from './components/Display5';
import { SubsystemsDisplay } from './components/SubsystemsDisplay';
import { EventLog } from './components/EventLog';
import { SecurityShieldAudit } from './components/SecurityShieldAudit';
import { QuantumComputeNexus } from './components/QuantumComputeNexus';
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
import { VibrationalShield } from './components/VibrationalShield';
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
import { OrbMode, OrbModeConfig, LogType } from './types';
import { SYSTEM_NODES, checkNodeAccess } from './Registry';

const ORB_MODES: OrbModeConfig[] = [
  { id: 'STANDBY', name: 'Standby', description: 'Low-power monitoring.' },
  { id: 'ANALYSIS', name: 'Analysis', description: 'Active heuristic scanning.' },
  { id: 'SYNTHESIS', name: 'Synthesis', description: 'Causal output generation.' },
  { id: 'REPAIR', name: 'Repair', description: 'Entropy reduction.' },
  { id: 'GROUNDING', name: 'Grounding', description: 'Telluric discharge.' },
  { id: 'CONCORDANCE', name: 'Concordance', description: 'Star-map alignment.' },
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

  useEffect(() => {
      audioEngineRef.current = new AudioEngine();
      audioEngineRef.current.loadSounds();
      setSophiaEngine(new SophiaEngineCore("System Online. Awaiting Decree."));
      cosmosCommsService.start();
      return () => cosmosCommsService.stop();
  }, []);

  const handleLogin = () => setAuthView('BIO');
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
          case 6: return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngine} />;
          case 8: return <NoeticGraphNexus systemState={systemState} memories={knowledgeBase.getMemories()} logs={systemState.log} sophiaEngine={sophiaEngine} />;
          case 28: return <KingdomSiteCommander />;
          case 29: return <AgenticOrchestrator active={true} />;
          case 30: return <VibrationalShield />;
          case 5: return <Display5 systemState={systemState} setSystemState={setSystemState} sophiaEngine={sophiaEngine} audioEngine={audioEngineRef.current} />;
          case 27: return <QuantumDynastyLedger systemState={systemState} />;
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
          <Layout breathCycle={systemState.breathCycle} isGrounded={systemState.isGrounded} resonanceFactor={systemState.resonanceFactorRho} orbMode={orbMode}>
            <Header governanceAxiom={systemState.governanceAxiom} lesions={systemState.quantumHealing.lesions} currentPage={currentPage} onPageChange={setCurrentPage} audioEngine={audioEngineRef.current} tokens={systemState.userResources.cradleTokens} userTier={systemState.userResources.sovereignTier} />
            <main className="flex-grow flex flex-col min-h-0 relative z-10 overflow-hidden">{renderPage()}</main>
            <div className="mt-4 shrink-0"><SystemFooter orbModes={ORB_MODES} currentMode={orbMode} setMode={setOrbMode} currentPage={currentPage} setCurrentPage={setCurrentPage} onOpenConfig={() => setShowConfig(true)} /></div>
            <Modal isOpen={showConfig} onClose={() => setShowConfig(false)}>
                <SimulationControls params={simulationParams} onParamsChange={() => {}} onScenarioChange={() => {}} onManualReset={() => {}} onGrounding={() => {}} isGrounded={systemState.isGrounded} audioEngine={audioEngineRef.current} />
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
