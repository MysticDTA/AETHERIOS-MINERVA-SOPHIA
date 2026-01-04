
import React, { useState, useCallback } from 'react';
import { SystemState, LogType, PillarId } from '../../types';
import { AudioEngine } from '../audio/AudioEngine';

const STAR_COUNT = 7; // From LyranStarMap component

interface useInteractiveSubsystemsProps {
    addLogEntry: (type: LogType, message: string) => void;
    setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
    systemState: SystemState;
    audioEngine: AudioEngine | null;
}

export const useInteractiveSubsystems = ({ addLogEntry, setSystemState, systemState, audioEngine }: useInteractiveSubsystemsProps) => {
    const [calibrationTargetId, setCalibrationTargetId] = useState<number | null>(() => Math.floor(Math.random() * STAR_COUNT) + 1);
    const [calibrationEffect, setCalibrationEffect] = useState<{ starId: number, success: boolean } | null>(null);
    const [isPurgingAether, setIsPurgingAether] = useState(false);
    const [isDischargingGround, setIsDischargingGround] = useState(false);
    const [isFlushingHelium, setIsFlushingHelium] = useState(false);
    const [isCalibratingDilution, setIsCalibratingDilution] = useState(false);

    const handlePillarBoost = useCallback((pillarId: PillarId) => {
        addLogEntry(LogType.SYSTEM, `Operator initiated energy boost for ${systemState.pillars[pillarId].name} Cradle.`);
        audioEngine?.playUIConfirm();
        setSystemState(prev => {
            const newState = { ...prev, pillars: { ...prev.pillars } };
            const currentActivation = newState.pillars[pillarId].activation;
            newState.pillars[pillarId] = { ...newState.pillars[pillarId], activation: Math.min(1.0, currentActivation + 0.1) };
            const cost = Math.random() * 0.05;
            newState.quantumHealing.decoherence = Math.min(1, newState.quantumHealing.decoherence + cost);
            addLogEntry(LogType.WARNING, `Resonance boost caused ${(cost * 100).toFixed(2)}% decoherence spike.`);
            return newState;
        });
    }, [addLogEntry, systemState.pillars, setSystemState, audioEngine]);

    const handleRelayCalibration = useCallback((relayId: string) => {
        addLogEntry(LogType.SYSTEM, `Attempting to calibrate ${systemState.galacticRelayNetwork[relayId].name} relay...`);
        audioEngine?.playUIClick();
        setSystemState(prev => {
            const newState = { ...prev, galacticRelayNetwork: { ...prev.galacticRelayNetwork } };
            const relay = newState.galacticRelayNetwork[relayId];
            let success = false;
            if (relay.status === 'DEGRADED' && Math.random() < 0.8) { // 80% success
                newState.galacticRelayNetwork[relayId] = { ...relay, status: 'ONLINE' };
                success = true;
            } else if (relay.status === 'OFFLINE' && Math.random() < 0.3) { // 30% success to bring back to degraded
                newState.galacticRelayNetwork[relayId] = { ...relay, status: 'DEGRADED' };
                success = true;
            }
            if (success) {
                addLogEntry(LogType.INFO, `Calibration successful. ${relay.name} status improved.`);
                audioEngine?.playUIConfirm();
            } else {
                addLogEntry(LogType.WARNING, `Calibration failed for ${relay.name}.`);
            }
            const cost = Math.random() * 0.03;
            newState.quantumHealing.decoherence = Math.min(1, newState.quantumHealing.decoherence + cost);
            addLogEntry(LogType.WARNING, `Relay calibration caused ${(cost * 100).toFixed(2)}% decoherence spike.`);
            return newState;
        });
    }, [addLogEntry, systemState.galacticRelayNetwork, setSystemState, audioEngine]);

    const handleStarCalibration = useCallback((starId: number) => {
        const isSuccess = starId === calibrationTargetId;
        setCalibrationEffect({ starId, success: isSuccess });
        setTimeout(() => setCalibrationEffect(null), 800);

        if (isSuccess) {
            addLogEntry(LogType.INFO, `Lyran node ${starId} calibrated successfully.`);
            audioEngine?.playUIConfirm();
            setSystemState(prev => {
                const newState = { ...prev };
                newState.lyranConcordance.connectionStability = Math.min(1, prev.lyranConcordance.connectionStability + 0.05);
                newState.lyranConcordance.alignmentDrift = Math.max(0, prev.lyranConcordance.alignmentDrift - 0.02);
                const cost = Math.random() * 0.015;
                newState.quantumHealing.decoherence = Math.min(1, newState.quantumHealing.decoherence + cost);
                return newState;
            });
            let newTarget = calibrationTargetId;
            while (newTarget === calibrationTargetId) {
                newTarget = Math.floor(Math.random() * STAR_COUNT) + 1;
            }
            setCalibrationTargetId(newTarget);
        } else {
            addLogEntry(LogType.WARNING, `Incorrect node calibration attempt on Lyran node ${starId}.`);
            audioEngine?.playUIClick();
            setSystemState(prev => {
                const newState = { ...prev };
                newState.lyranConcordance.alignmentDrift = Math.min(1, prev.lyranConcordance.alignmentDrift + 0.01);
                return newState;
            });
        }
    }, [calibrationTargetId, addLogEntry, setSystemState, audioEngine]);

    const handlePurgeAethericFlow = useCallback(() => {
        if (isPurgingAether) return;
        setIsPurgingAether(true);
        addLogEntry(LogType.SYSTEM, 'Aetheric flow purge initiated.');
        audioEngine?.playPurgeEffect();
        setSystemState(prev => {
            const newState = { ...prev };
            newState.aethericTransfer.fluxStatus = 'STABLE';
            newState.aethericTransfer.efficiency = Math.min(1, prev.aethericTransfer.efficiency + 0.2);
            newState.supanovaTriforce.psiEnergy = Math.max(0, prev.supanovaTriforce.psiEnergy - 0.1);
            newState.quantumHealing.decoherence = Math.min(1, prev.quantumHealing.decoherence + 0.05);
            addLogEntry(LogType.WARNING, 'Flow purge caused minor decoherence spike and drained coherence field energy.');
            return newState;
        });
        setTimeout(() => {
            setIsPurgingAether(false);
            addLogEntry(LogType.INFO, 'Aetheric purge conduit has cooled down.');
        }, 10000); // 10 second cooldown
    }, [isPurgingAether, addLogEntry, setSystemState, audioEngine]);

    const handleGroundingDischarge = useCallback(() => {
        if (isDischargingGround || systemState.earthGrounding.charge < 0.75) return;
        setIsDischargingGround(true);
        addLogEntry(LogType.SYSTEM, 'Earth Grounding Core discharge sequence initiated.');
        audioEngine?.playGroundingDischarge();
        setSystemState(prev => {
            const newState = { ...prev };
            newState.earthGrounding.status = 'DISCHARGING';
            newState.earthGrounding.charge = Math.max(0, prev.earthGrounding.charge - 0.75);
            newState.quantumHealing.decoherence = Math.max(0, prev.quantumHealing.decoherence - 0.5);
            addLogEntry(LogType.INFO, 'Core discharge successful. System decoherence rapidly reduced.');
            return newState;
        });
        setTimeout(() => setIsDischargingGround(false), 15000); // 15 second cooldown
    }, [isDischargingGround, addLogEntry, setSystemState, systemState.earthGrounding.charge, audioEngine]);
    
    const handleHeliumFlush = useCallback(() => {
        if (isFlushingHelium) return;
        setIsFlushingHelium(true);
        addLogEntry(LogType.SYSTEM, 'Dilution Refrigerator Helium-3 flush initiated.');
        audioEngine?.playHeliumFlush();
        setSystemState(prev => {
            const newState = { ...prev };
            newState.dilutionRefrigerator = {
                ...prev.dilutionRefrigerator,
                status: 'BOOSTED',
                temperature: Math.max(5, prev.dilutionRefrigerator.temperature - 20),
                coolingPower: prev.dilutionRefrigerator.coolingPower + 400,
            };
            const cost = 0.03;
            newState.quantumHealing.decoherence = Math.min(1, prev.quantumHealing.decoherence + cost);
            addLogEntry(LogType.WARNING, `Helium-3 flush caused a minor ${(cost * 100).toFixed(2)}% decoherence spike.`);
            return newState;
        });

        setTimeout(() => {
            setIsFlushingHelium(false);
            addLogEntry(LogType.INFO, 'Dilution Refrigerator has returned to normal operation.');
            // No need to reset status here, the simulation loop will take over
        }, 10000); // 10 second boost duration
    }, [isFlushingHelium, addLogEntry, setSystemState, audioEngine]);

    const handleDilutionCalibration = useCallback(() => {
        if (isCalibratingDilution) return;
        setIsCalibratingDilution(true);
        addLogEntry(LogType.SYSTEM, 'Dilution Refrigerator thermal calibration sequence active.');
        audioEngine?.playUIConfirm(); // Reuse confirm sound
        
        // Immediate visual feedback is handled by the component via isCalibratingDilution prop
        
        setTimeout(() => {
            setSystemState(prev => {
                const newState = { ...prev };
                newState.dilutionRefrigerator = {
                    ...prev.dilutionRefrigerator,
                    status: 'STABLE',
                    temperature: 10.0, // Reset to nominal
                };
                addLogEntry(LogType.INFO, 'Thermal calibration complete. Mixing chamber stable at 10.0 mK.');
                return newState;
            });
            setIsCalibratingDilution(false);
        }, 3000); // 3 second calibration time
    }, [isCalibratingDilution, addLogEntry, setSystemState, audioEngine]);

    return {
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
    };
};
