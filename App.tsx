
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
import { SYSTEM_NODES } from './Registry';

const AETHERIOS_MANIFEST = `
📜 SYSTEM MANIFEST: MINERVA SOPHIA
Interface Version: 1.3.1-Radiant-Synthesis
Authority: The Architect
`;

const orbModes: OrbModeConfig[] = [
  { id: 'STANDBY', name: 'Standby', description: 'Aetheric Flux Monitoring. Maintaining equilibrium.' },
  { id: 'ANALYSIS', name: 'Analysis', description: 'Deep Heuristic Gestation. Siphoning reality-lattice data.' },
  { id: 'SYNTHESIS', name: 'Synthesis', description: 'Constructing new reality paradigms via Golden Ratio algorithms.' },
  { id: 'REPAIR', name: 'Repair', description: 'System-wide decoherence mending and causal fracture healing.' },
  { id: 'GROUNDING', name: 'Grounding', description: 'Discharging entropic buildup into the telluric grid.' },
  { id: 'CONCORDANCE', name: 'Concordance', description: 'Aligning local node frequencies with the Lyran carrier wave.' },
  { id: 'OFFLINE', name: 'Offline', description: 'Severing all uplink connections. Safe mode active.' },
];

const App: React.FC = () => {
    // State
    const [orbMode, setOrbMode] = useState<OrbMode>('STANDBY');
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfig, setShowConfig] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [memories, setMemories] = useState(knowledgeBase.getMemories());

    // Engines
    const audioEngineRef = useRef<AudioEngine | null>(null);
    const sophiaEngineRef = useRef<SophiaEngineCore | null>(null);

    // Initialize Audio Engine once
    useEffect(() => {
        audioEngineRef.current = new AudioEngine();
        audioEngineRef.current.loadSounds();
        sophiaEngineRef.current = new SophiaEngineCore(AETHERIOS_MANIFEST);
    }, []);

    // Simulation Hook
    const { 
        systemState, 
        setSystemState, 
        addLogEntry, 
        setGrounded, 
    } = useSystemSimulation(
        { decoherenceChance: 0.05, lesionChance: 0.01 }, // Default params
        orbMode
    );

    // Voice Hook
    const voiceInterface = useVoiceInterface({
        addLogEntry,
        systemInstruction: AETHERIOS_MANIFEST,
        onSetOrbMode: setOrbMode
    });

    // Effect to update audio engine mode
    useEffect(() => {
        if (audioEngineRef.current) {
            audioEngineRef.current.setMode(systemState.governanceAxiom);
            audioEngineRef.current.updateDynamicAmbience(systemState);
        }
    }, [systemState, orbMode]);

    // Handlers
    const handleManualReset = useCallback(() => {
        window.location.reload();
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleMemoriesChange = useCallback(() => {
        setMemories(knowledgeBase.getMemories());
    }, []);

    // Interactive Subsystems
    const interactive = useInteractiveSubsystems({
        addLogEntry,
        setSystemState,
        systemState,
        audioEngine: audioEngineRef.current
    });

    // Resume Audio Context on interaction
    const handleInteraction = () => {
        audioEngineRef.current?.resumeContext();
    };

    // Cosmos Comms Service
    const [transmission, setTransmission] = useState(cosmosCommsService.initialState);
    useEffect(() => {
        if (currentPage === 7) cosmosCommsService.start();
        else cosmosCommsService.stop();
        
        const unsub = cosmosCommsService.subscribe(setTransmission);
        return () => {
            unsub();
            cosmosCommsService.stop();
        }
    }, [currentPage]);

    // Render Page Content
    const renderPage = () => {
        switch(currentPage) {
            case 1: return <Dashboard 
                systemState={systemState} 
                onTriggerScan={() => setCurrentPage(19)} 
                scanCompleted={false} 
                sophiaEngine={sophiaEngineRef.current} 
                setOrbMode={setOrbMode}
                orbMode={orbMode}
                onOptimize={() => setCurrentPage(14)}
            />;
            case 2: return <Display6 
                systemState={systemState}
                onPillarBoost={interactive.handlePillarBoost}
                onHeliumFlush={interactive.handleHeliumFlush}
                isFlushingHelium={interactive.isFlushingHelium}
                onDilutionCalibrate={interactive.handleDilutionCalibration}
                isCalibratingDilution={interactive.isCalibratingDilution}
            />; // Mapped Display6 to LATTICE
            case 3: return <Display3 
                systemState={systemState} 
                onRelayCalibration={interactive.handleRelayCalibration} 
                onStarCalibrate={interactive.handleStarCalibration}
                calibrationTargetId={interactive.calibrationTargetId}
                calibrationEffect={interactive.calibrationEffect}
                setOrbMode={setOrbMode}
                sophiaEngine={sophiaEngineRef.current}
            />;
            case 4: return <Display4 
                systemState={systemState} 
                orbMode={orbMode} 
                sophiaEngine={sophiaEngineRef.current} 
                onSaveInsight={(text) => { knowledgeBase.addMemory(text, 'SOPHIA_CHAT'); handleMemoriesChange(); }} 
                onToggleInstructionsModal={() => {}} 
                onRelayCalibration={interactive.handleRelayCalibration}
                setOrbMode={setOrbMode}
                voiceInterface={voiceInterface}
                onTriggerAudit={() => setCurrentPage(19)}
            />;
            case 5: return <Display5 
                systemState={systemState} 
                setSystemState={setSystemState}
                sophiaEngine={sophiaEngineRef.current}
                audioEngine={audioEngineRef.current}
            />;
            case 6: return <SubsystemsDisplay 
                systemState={systemState}
                onGroundingDischarge={interactive.handleGroundingDischarge}
                isDischargingGround={interactive.isDischargingGround}
            />; // Mapped SubsystemsDisplay to MATRIX
            case 7: return <Display7 
                systemState={systemState}
                transmission={transmission}
                memories={memories}
                onMemoryChange={handleMemoriesChange}
            />;
            case 8: return <Display8 
                systemState={systemState}
                onPurgeAethericFlow={interactive.handlePurgeAethericFlow}
                isPurgingAether={interactive.isPurgingAether}
            />;
            case 9: return <CollectiveCoherenceView systemState={systemState} sophiaEngine={sophiaEngineRef.current} />;
            case 10: return <Display10 systemState={systemState} />;
            case 11: return <Display11 systemState={systemState} />;
            case 12: return <Display12 systemState={systemState} />;
            case 13: return <NeuralQuantizer orbMode={orbMode} />;
            case 14: return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngineRef.current} />;
            case 15: return <ResourceProcurement systemState={systemState} setSystemState={setSystemState} addLogEntry={addLogEntry} />;
            case 16: return <SatelliteUplink systemState={systemState} sophiaEngine={sophiaEngineRef.current} setOrbMode={setOrbMode} />;
            case 17: return <DeploymentManifest systemState={systemState} onDeploySuccess={() => setIsDeploying(true)} />;
            case 18: return <VeoFluxSynthesizer systemState={systemState} />;
            case 19: return <DeepDiagnosticOverlay 
                onClose={() => setCurrentPage(1)} 
                onComplete={() => setCurrentPage(14)} 
                systemState={systemState} 
                sophiaEngine={sophiaEngineRef.current} 
                audioEngine={audioEngineRef.current} 
            />;
            case 21: return <MenervaBridge systemState={systemState} />;
            case 22: return <EventLog log={systemState.log} filter={LogType.INFO} onFilterChange={() => {}} />;
            case 23: return <SecurityShieldAudit systemState={systemState} />;
            default: return <Dashboard 
                systemState={systemState} 
                onTriggerScan={() => setCurrentPage(19)} 
                scanCompleted={false} 
                sophiaEngine={sophiaEngineRef.current} 
                setOrbMode={setOrbMode}
                orbMode={orbMode}
                onOptimize={() => setCurrentPage(14)}
            />;
        }
    };

    if (systemState.governanceAxiom === 'SYSTEM COMPOSURE FAILURE') {
        return <EventHorizonScreen audioEngine={audioEngineRef.current} onManualReset={handleManualReset} />;
    }

    return (
        <ApiKeyGuard>
            <Layout 
                breathCycle={systemState.breathCycle} 
                isGrounded={systemState.isGrounded}
                resonanceFactor={systemState.resonanceFactorRho}
                drift={systemState.temporalCoherenceDrift}
            >
                <div onClick={handleInteraction} className="h-full flex flex-col">
                    <Header 
                        governanceAxiom={systemState.governanceAxiom}
                        lesions={systemState.quantumHealing.lesions}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        audioEngine={audioEngineRef.current}
                        tokens={systemState.userResources.cradleTokens}
                        userTier={systemState.userResources.sovereignTier}
                        transmissionStatus={transmission.status}
                    />
                    
                    <main className="flex-grow min-h-0 py-4 relative">
                        <ErrorBoundary>
                            {renderPage()}
                        </ErrorBoundary>
                    </main>

                    <SystemFooter 
                        orbModes={orbModes}
                        currentMode={orbMode}
                        setMode={setOrbMode}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        onOpenConfig={() => setShowConfig(true)}
                    />

                    <Modal isOpen={showConfig} onClose={() => setShowConfig(false)}>
                        <SimulationControls 
                            params={{ decoherenceChance: 0.05, lesionChance: 0.01 }} 
                            onParamsChange={() => {}}
                            onScenarioChange={() => {}}
                            onManualReset={handleManualReset}
                            onGrounding={() => { setGrounded(true); setTimeout(() => setGrounded(false), 5000); }}
                            isGrounded={systemState.isGrounded}
                            audioEngine={audioEngineRef.current}
                        />
                    </Modal>
                    
                    {isDeploying && (
                        <SovereignPortal onInitialize={() => setIsDeploying(false)} />
                    )}
                </div>
            </Layout>
        </ApiKeyGuard>
    );
};

export default App;
