import React, { useState, useCallback } from 'react';
import { SystemState, LogType, PillarId } from '../../types';
import { AudioEngine } from '../audio/AudioEngine';

const STAR_COUNT = 7;

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
            if (relay.status === 'DEGRADED' && Math.random() < 0.8) {
                newState.galacticRelayNetwork[relayId] = { ...relay, status: 'ONLINE' };
                success = true;
            } else if (relay.status === 'OFFLINE' && Math.random() < 0.3) {
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
            return newState;
        });
    }, [addLogEntry, systemState.galacticRelayNetwork, setSystemState, audioEngine]);

    const handleStarCalibration = useCallback((starId: number) => {
        const isSuccess = starId === calibrationTargetId;
        setCalibrationEffect({ starId, success: isSuccess });
        setTimeout(() => setCalibrationEffect(null), 800);

        if (isSuccess) {
            // ADJUSTMENT: Temporal Drift Correction (Phase Lock)
            addLogEntry(LogType.INFO, `Lyran node ${starId} calibrated. Temporal Phase Lock active (60s).`);
            audioEngine?.playUIConfirm();
            setSystemState(prev => ({
                ...prev,
                lyranConcordance: {
                    ...prev.lyranConcordance,
                    connectionStability: Math.min(1, prev.lyranConcordance.connectionStability + 0.1),
                    alignmentDrift: Math.max(0, prev.lyranConcordance.alignmentDrift - 0.05)
                },
                isPhaseLocked: true
            }));
            
            setTimeout(() => {
                setSystemState(prev => ({ ...prev, isPhaseLocked: false }));
                addLogEntry(LogType.INFO, "Temporal Phase Lock expired. Drift accumulation resumed.");
            }, 60000);

            let newTarget = calibrationTargetId;
            while (newTarget === calibrationTargetId) {
                newTarget = Math.floor(Math.random() * STAR_COUNT) + 1;
            }
            setCalibrationTargetId(newTarget);
        } else {
            addLogEntry(LogType.WARNING, `Incorrect node calibration attempt on Lyran node ${starId}.`);
            audioEngine?.playUIClick();
            setSystemState(prev => ({
                ...prev,
                lyranConcordance: {
                    ...prev.lyranConcordance,
                    alignmentDrift: Math.min(1, prev.lyranConcordance.alignmentDrift + 0.02)
                }
            }));
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
            newState.quantumHealing.decoherence = Math.min(1, prev.quantumHealing.decoherence + 0.05);
            return newState;
        });
        setTimeout(() => setIsPurgingAether(false), 10000);
    }, [isPurgingAether, addLogEntry, setSystemState, audioEngine]);

    const handleGroundingDischarge = useCallback(() => {
        if (isDischargingGround || systemState.earthGrounding.charge < 0.75) return;
        setIsDischargingGround(true);
        addLogEntry(LogType.SYSTEM, 'Earth Grounding Core discharge sequence initiated.');
        audioEngine?.playGroundingDischarge();
        
        // ADJUSTMENT: Entropy Damping scaling with Schumann Intensity
        const intensityFactor = systemState.schumannResonance.intensity;
        const reduction = 0.5 * (intensityFactor * 2);
        
        setSystemState(prev => ({
            ...prev,
            earthGrounding: { ...prev.earthGrounding, status: 'DISCHARGING', charge: 0 },
            quantumHealing: { ...prev.quantumHealing, decoherence: Math.max(0, prev.quantumHealing.decoherence - reduction) }
        }));
        
        addLogEntry(LogType.INFO, `Core discharge successful. Entropy reduction: ${(reduction * 100).toFixed(0)}%.`);
        setTimeout(() => setIsDischargingGround(false), 15000);
    }, [isDischargingGround, addLogEntry, setSystemState, systemState.earthGrounding.charge, systemState.schumannResonance.intensity, audioEngine]);
    
    const handleHeliumFlush = useCallback(() => {
        if (isFlushingHelium) return;
        setIsFlushingHelium(true);
        addLogEntry(LogType.SYSTEM, 'Dilution Refrigerator Helium-3 flush initiated.');
        audioEngine?.playHeliumFlush();
        setSystemState(prev => ({
            ...prev,
            dilutionRefrigerator: {
                ...prev.dilutionRefrigerator,
                status: 'BOOSTED',
                temperature: 5,
                coolingPower: prev.dilutionRefrigerator.coolingPower + 400,
            }
        }));
        setTimeout(() => setIsFlushingHelium(false), 10000);
    }, [isFlushingHelium, addLogEntry, setSystemState, audioEngine]);

    const handleDilutionCalibration = useCallback(() => {
        if (isCalibratingDilution) return;
        setIsCalibratingDilution(true);
        addLogEntry(LogType.SYSTEM, 'Dilution Refrigerator thermal calibration sequence active.');
        audioEngine?.playUIConfirm();
        setTimeout(() => {
            setSystemState(prev => ({
                ...prev,
                dilutionRefrigerator: { ...prev.dilutionRefrigerator, status: 'STABLE', temperature: 10.0 }
            }));
            setIsCalibratingDilution(false);
            addLogEntry(LogType.INFO, 'Thermal calibration complete. Mixing chamber stable at 10.0 mK.');
        }, 3000);
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