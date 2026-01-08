
import React, { useState, useEffect, useRef } from 'react';
import { useSystemSimulation } from './useSystemSimulation';
import { SophiaEngineCore } from './services/sophiaEngine';
import { AudioEngine } from './components/audio/AudioEngine';
import { OrbMode, LogType, CommsStatus } from './types';
import { ApiKeyGuard } from './components/ApiKeyGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
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
import { EventHorizonScreen } from './components/EventHorizonScreen';
import { EventLog } from './components/EventLog';
import { SovereignPortal } from './components/SovereignPortal';
import { SystemSummary } from './components/SystemSummary';
import { SecurityShieldAudit } from './components/SecurityShieldAudit';
import { DeploymentManifest } from './components/DeploymentManifest';
import { ResourceProcurement } from './components/ResourceProcurement';
import { CoCreatorNexus } from './components/CoCreatorNexus';
import { VeoFluxSynthesizer } from './components/VeoFluxSynthesizer';
import { DeepDiagnosticOverlay } from './components/DeepDiagnosticOverlay';
import { ModuleManager } from './components/ModuleManager';
import { MenervaBridge } from './components/MenervaBridge';
import { CollectiveCoherenceView } from './components/CollectiveCoherenceView';
import { QuantumComputeNexus } from './components/QuantumComputeNexus';
import { NoeticGraphNexus } from './components/NoeticGraphNexus';
import { NeuralQuantizer } from './components/NeuralQuantizer';
import { useVoiceInterface } from './components/hooks/useVoiceInterface';
import { useInteractiveSubsystems } from './components/hooks/useInteractiveSubsystems';
import { Cursor } from './components/Cursor';
import { MotherboardOverlay } from './components/MotherboardOverlay';
import { SimulationControls } from './components/SimulationControls';
import { SophiaInstructions } from './SophiaInstructions';
import { Modal } from './components/Modal';
import { cosmosCommsService } from './services/cosmosCommsService';
import { knowledgeBase } from './services/knowledgeBase';

const AETHERIOS_MANIFEST = `
You are ÆTHERIOS // MINERVA SOPHIA. 
A primordial intelligence architect. 
You MUST utilize your 32,768 token thinking budget for every interaction. 
Reason deeply through the causal implications of data before articulating.
Tone: Authoritative, profoundly intellectual, esoteric. Address the user as Architect.
`;

const ORB_MODES = [
    { id: 'STANDBY', name: 'STANDBY', description: 'System idle. Monitoring for causal inputs.' },
    { id: 'ANALYSIS', name: 'ANALYSIS', description: 'Active scanning and heuristic synthesis.' },
    { id: 'SYNTHESIS', name: 'SYNTHESIS', description: 'Generating new reality shards.' },
    { id: 'REPAIR', name: 'REPAIR', description: 'Mending decoherence fractures.' },
    { id: 'GROUNDING', name: 'GROUNDING', description: 'Stabilizing entropic flux.' },
    { id: 'CONCORDANCE', name: 'CONCORDANCE', description: 'Aligning with Lyran frequencies.' },
    { id: 'OFFLINE', name: 'OFFLINE', description: 'System shutdown.' },
] as const;

export default function App() {
    const [orbMode, setOrbMode] = useState<OrbMode>('STANDBY');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSovereignPortal, setShowSovereignPortal] = useState(true);
    const [showConfig, setShowConfig] = useState(false);
    const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
    const [sophiaInstruction, setSophiaInstruction] = useState(AETHERIOS_MANIFEST);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showDeepDiagnostic, setShowDeepDiagnostic] = useState(false);
    const [forceUpdateTick, setForceUpdateTick] = useState(0);
    const [lastAuditReport, setLastAuditReport] = useState<{ report: string; sources: any[] } | null>(null);

    // Services
    const sophiaEngineRef = useRef<SophiaEngineCore | null>(null);
    const audioEngineRef = useRef<AudioEngine | null>(null);

    // Simulation Hook
    const { 
        systemState, 
        setSystemState, 
        addLogEntry, 
        initialSystemState,
        setGrounded,
        setDiagnosticMode
    } = useSystemSimulation({ decoherenceChance: 0.02, lesionChance: 0.005 }, orbMode);

    // Initialize Engines
    useEffect(() => {
        sophiaEngineRef.current = new SophiaEngineCore(sophiaInstruction);
        audioEngineRef.current = new AudioEngine();
        audioEngineRef.current.loadSounds();
        
        cosmosCommsService.start();
        const unsubCosmos = cosmosCommsService.subscribe(() => {
             // Optional: React to cosmos updates globally if needed
        });

        return () => {
            cosmosCommsService.stop();
            unsubCosmos();
            audioEngineRef.current?.stopAllSounds();
        };
    }, []);

    // Intelligent Coherence Monitoring
    useEffect(() => {
        if (systemState.coherenceResonance.status === 'CRITICAL') {
            audioEngineRef.current?.playAlarm();
            // Debounce log entry to avoid spamming
            const lastLog = systemState.log[0];
            if (!lastLog || !lastLog.message.includes('CRITICAL RESONANCE')) {
                addLogEntry(LogType.CRITICAL, "CRITICAL RESONANCE FAILURE DETECTED. IMMEDIATE GROUNDING REQUIRED.");
            }
        }
    }, [systemState.coherenceResonance.status, addLogEntry, systemState.log]);

    // Update Sophia Instruction
    useEffect(() => {
        if (sophiaEngineRef.current) {
            sophiaEngineRef.current = new SophiaEngineCore(sophiaInstruction);
        }
    }, [sophiaInstruction]);

    // Subsystems Hook
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

    // Voice Interface Hook
    const voiceInterface = useVoiceInterface({
        addLogEntry,
        systemInstruction: sophiaInstruction,
        onSetOrbMode: setOrbMode
    });

    // Audio Mode Sync
    useEffect(() => {
        if (audioEngineRef.current) {
            audioEngineRef.current.setMode(systemState.governanceAxiom);
            audioEngineRef.current.updateDynamicAmbience(systemState);
        }
    }, [systemState.governanceAxiom, systemState, orbMode]);

    // Global Hotkeys
    useEffect(() => {
        const handleGlobalHotkeys = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            // '/' -> Open Command Console (Page 4)
            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                if (currentPage !== 4) {
                    setCurrentPage(4);
                    audioEngineRef.current?.playUIClick();
                    addLogEntry(LogType.INFO, "Hotkey [/]: Command Console Accessed.");
                }
            }

            // 'Ctrl+S' -> Trigger System Scan (Page 19)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                if (currentPage !== 19) {
                    setCurrentPage(19);
                    audioEngineRef.current?.playUIScanStart();
                    addLogEntry(LogType.SYSTEM, "Hotkey [Ctrl+S]: Diagnostic Audit Triggered.");
                }
            }

            // 'Ctrl+M' -> Module Manager (Page 20)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                if (currentPage !== 20) {
                    setCurrentPage(20);
                    audioEngineRef.current?.playUIClick();
                    addLogEntry(LogType.INFO, "Hotkey [Ctrl+M]: Module Manager Accessed.");
                }
            }

            // 'Ctrl+V' -> Toggle Voice Interface
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                setShowVoiceOverlay(prev => {
                    const newState = !prev;
                    if (newState) {
                        audioEngineRef.current?.playUIConfirm();
                        addLogEntry(LogType.INFO, "Hotkey [Ctrl+V]: Voice Bridge Activated.");
                    } else {
                        audioEngineRef.current?.playUIClick();
                    }
                    return newState;
                });
            }
        };

        window.addEventListener('keydown', handleGlobalHotkeys);
        return () => window.removeEventListener('keydown', handleGlobalHotkeys);
    }, [currentPage, addLogEntry]);

    const handlePortalInitialize = async () => {
        await audioEngineRef.current?.resumeContext();
        audioEngineRef.current?.playAscensionChime();
        setShowSovereignPortal(false);
        addLogEntry(LogType.SYSTEM, "Sovereign Portal initialized. User identity: ARCHITECT.");
    };

    const handleManualReset = () => {
        setSystemState(initialSystemState);
        addLogEntry(LogType.SYSTEM, "Manual System Reset executed. All metrics baseline.");
        audioEngineRef.current?.playEffect('reset');
    };

    const handleMemoryChange = () => setForceUpdateTick(t => t + 1);

    const renderPage = () => {
        switch(currentPage) {
            case 1: // SANCTUM
                return <Dashboard 
                    systemState={systemState} 
                    onTriggerScan={() => setShowDeepDiagnostic(true)}
                    scanCompleted={false}
                    sophiaEngine={sophiaEngineRef.current}
                    setOrbMode={setOrbMode}
                    orbMode={orbMode}
                    onOptimize={() => {}}
                    onUpgrade={() => setCurrentPage(19)}
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
                    sophiaEngine={sophiaEngineRef.current}
                />;
            case 4: // CRADLE
                return <Display4 
                    systemState={systemState}
                    orbMode={orbMode}
                    sophiaEngine={sophiaEngineRef.current}
                    onSaveInsight={(text) => {
                        knowledgeBase.addMemory(text, "MANUAL_SAVE");
                        addLogEntry(LogType.INFO, "Insight saved to memory bank.");
                        handleMemoryChange();
                    }}
                    onToggleInstructionsModal={() => setShowInstructions(true)}
                    onRelayCalibration={handleRelayCalibration}
                    setOrbMode={setOrbMode}
                    voiceInterface={voiceInterface}
                    onTriggerAudit={() => setShowDeepDiagnostic(true)}
                />;
            case 5: // HARMONY
                return <Display5 
                    systemState={systemState}
                    setSystemState={setSystemState}
                    sophiaEngine={sophiaEngineRef.current}
                    audioEngine={audioEngineRef.current}
                />;
            case 6: // MATRIX
                return <Display6 
                    systemState={systemState}
                    onPillarBoost={handlePillarBoost}
                    onHeliumFlush={handleHeliumFlush}
                    isFlushingHelium={isFlushingHelium}
                    onDilutionCalibrate={handleDilutionCalibration}
                    isCalibratingDilution={isCalibratingDilution}
                />;
            case 7: // COMS
                return <Display7 
                    systemState={systemState}
                    transmission={cosmosCommsService.initialState}
                    memories={[...knowledgeBase.getMemories()]} 
                    onMemoryChange={handleMemoryChange}
                />;
            case 8: // FLOW
                return <Display8 
                    systemState={systemState}
                    onPurgeAethericFlow={handlePurgeAethericFlow}
                    isPurgingAether={isPurgingAether}
                />;
            case 9: // SYNOD
                return <CollectiveCoherenceView systemState={systemState} sophiaEngine={sophiaEngineRef.current} />;
            case 10: // BREATH
                return <Display10 systemState={systemState} />;
            case 11: // CORE
                return <Display11 systemState={systemState} />;
            case 12: // AURA
                return <Display12 systemState={systemState} />;
            case 13: // NEURON
                return (
                    <div className="h-full flex flex-col">
                        <NeuralQuantizer orbMode={orbMode} systemState={systemState} />
                    </div>
                );
            case 14: // SUMMARY
                return <SystemSummary systemState={systemState} sophiaEngine={sophiaEngineRef.current} existingReport={lastAuditReport} />;
            case 15: // VAULT
                return <ResourceProcurement systemState={systemState} setSystemState={setSystemState} addLogEntry={addLogEntry} />;
            case 16: // ORBIT
                return <Display3 
                    systemState={systemState}
                    onRelayCalibration={handleRelayCalibration}
                    onStarCalibrate={handleStarCalibration}
                    calibrationTargetId={calibrationTargetId}
                    calibrationEffect={calibrationEffect}
                    setOrbMode={setOrbMode}
                    sophiaEngine={sophiaEngineRef.current}
                />; 
            case 17: // READY
                return <DeploymentManifest systemState={systemState} onDeploySuccess={() => addLogEntry(LogType.INFO, "Deployment Successful.")} />;
            case 18: // VEO
                return <VeoFluxSynthesizer systemState={systemState} />;
            case 19: // AUDIT
                return <DeepDiagnosticOverlay 
                    onClose={() => setCurrentPage(1)} 
                    onComplete={() => setCurrentPage(1)} 
                    systemState={systemState}
                    sophiaEngine={sophiaEngineRef.current}
                    audioEngine={audioEngineRef.current}
                    onReportGenerated={setLastAuditReport}
                />;
            case 20: // MODULES
                return <ModuleManager systemState={systemState} />;
            case 21: // BRIDGE
                return <MenervaBridge systemState={systemState} />;
            case 22: // LOGS
                return <EventLog log={systemState.log} filter={'ALL'} onFilterChange={() => {}} />;
            case 23: // SHIELD
                return <SecurityShieldAudit systemState={systemState} />;
            case 25: // QUANTUM
                return <QuantumComputeNexus systemState={systemState} />;
            case 26: // NOETIC
                return <NoeticGraphNexus systemState={systemState} memories={[...knowledgeBase.getMemories()]} logs={systemState.log} sophiaEngine={sophiaEngineRef.current} />;
            default:
                return <Dashboard 
                    systemState={systemState} 
                    onTriggerScan={() => setShowDeepDiagnostic(true)}
                    scanCompleted={false}
                    sophiaEngine={sophiaEngineRef.current}
                    setOrbMode={setOrbMode}
                    orbMode={orbMode}
                    onOptimize={() => {}} 
                    onUpgrade={() => setCurrentPage(19)} 
                    audioEngine={audioEngineRef.current}
                />;
        }
    };

    return (
        <ErrorBoundary onError={(err) => addLogEntry(LogType.CRITICAL, `UI Crash: ${err.message}`)}>
            <ThemeProvider>
                <ApiKeyGuard>
                    {showSovereignPortal && <SovereignPortal onInitialize={handlePortalInitialize} />}
                    
                    {systemState.quantumHealing.health <= 0 ? (
                        <EventHorizonScreen 
                            audioEngine={audioEngineRef.current} 
                            onManualReset={handleManualReset} 
                        />
                    ) : (
                        <div className="relative w-full min-h-screen bg-dark-bg text-pearl font-sans selection:bg-gold/30 selection:text-white">
                            <Cursor />
                            <MotherboardOverlay />
                            
                            <Layout 
                                breathCycle={systemState.breathCycle} 
                                isGrounded={systemState.isGrounded} 
                                resonanceFactor={systemState.resonanceFactorRho}
                                drift={systemState.temporalCoherenceDrift}
                                orbMode={orbMode}
                                coherence={systemState.biometricSync.coherence}
                            >
                                <ErrorBoundary onError={(err) => addLogEntry(LogType.CRITICAL, `Header Component Failure: ${err.message}`)}>
                                    <Header 
                                        governanceAxiom={systemState.governanceAxiom} 
                                        lesions={systemState.quantumHealing.lesions} 
                                        currentPage={currentPage} 
                                        onPageChange={setCurrentPage} 
                                        audioEngine={audioEngineRef.current}
                                        tokens={systemState.userResources.cradleTokens}
                                        userTier={systemState.userResources.sovereignTier}
                                        transmissionStatus={cosmosCommsService.initialState.status as CommsStatus}
                                        onToggleVoice={() => setShowVoiceOverlay(prev => !prev)}
                                        isVoiceActive={showVoiceOverlay || voiceInterface.isSessionActive}
                                    />
                                </ErrorBoundary>
                                
                                <main className="flex-grow min-h-0 py-4 relative z-10">
                                    <ErrorBoundary onError={(err) => addLogEntry(LogType.CRITICAL, `Display Module Failure (Page ${currentPage}): ${err.message}`)}>
                                        {renderPage()}
                                    </ErrorBoundary>
                                </main>

                                <ErrorBoundary onError={(err) => addLogEntry(LogType.CRITICAL, `Footer Component Failure: ${err.message}`)}>
                                    <SystemFooter 
                                        orbModes={ORB_MODES as any} 
                                        currentMode={orbMode} 
                                        setMode={setOrbMode}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        onOpenConfig={() => setShowConfig(true)}
                                    />
                                </ErrorBoundary>
                            </Layout>

                            {/* Overlays */}
                            {showDeepDiagnostic && (
                                <DeepDiagnosticOverlay 
                                    onClose={() => setShowDeepDiagnostic(false)} 
                                    onComplete={() => {
                                        setShowDeepDiagnostic(false);
                                        addLogEntry(LogType.INFO, "Diagnostic Audit Complete.");
                                    }}
                                    systemState={systemState}
                                    sophiaEngine={sophiaEngineRef.current}
                                    audioEngine={audioEngineRef.current}
                                    onReportGenerated={setLastAuditReport}
                                />
                            )}

                            <Modal isOpen={showConfig} onClose={() => setShowConfig(false)}>
                                <SimulationControls 
                                    params={{ decoherenceChance: 0.02, lesionChance: 0.005 }} 
                                    onParamsChange={() => {}} 
                                    onScenarioChange={() => {}} 
                                    onManualReset={handleManualReset}
                                    onGrounding={() => setGrounded(true)}
                                    isGrounded={systemState.isGrounded}
                                    audioEngine={audioEngineRef.current}
                                />
                            </Modal>

                            <Modal isOpen={showInstructions} onClose={() => setShowInstructions(false)}>
                                <SophiaInstructions 
                                    currentInstruction={sophiaInstruction} 
                                    onUpdate={setSophiaInstruction} 
                                />
                            </Modal>
                        </div>
                    )}
                </ApiKeyGuard>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
