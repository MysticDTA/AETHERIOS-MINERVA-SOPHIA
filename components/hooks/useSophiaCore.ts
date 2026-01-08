
import { useState, useCallback, useRef, useEffect } from 'react';
import { SystemState, FailurePrediction, CausalStrategy } from '../../types';
import { SophiaEngineCore } from '../../services/sophiaEngine';

interface SophiaCoreHook {
  analysis: string;
  sources: any[];
  prediction: FailurePrediction | null;
  strategy: CausalStrategy | null;
  isLoading: boolean;
  isPredicting: boolean;
  isStrategizing: boolean;
  error: string | null;
  runAnalysis: () => Promise<void>;
  runPrediction: () => Promise<void>;
  runStrategySynthesis: () => Promise<void>;
}

export const useSophiaCore = (
  sophiaEngine: SophiaEngineCore | null,
  systemState: SystemState
): SophiaCoreHook => {
  const [analysis, setAnalysis] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<FailurePrediction | null>(null);
  const [strategy, setStrategy] = useState<CausalStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isStrategizing, setIsStrategizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const systemStateRef = useRef(systemState);
  useEffect(() => {
    systemStateRef.current = systemState;
  }, [systemState]);

  const runAnalysis = useCallback(async () => {
    if (!sophiaEngine || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnalysis('');
    setSources([]);

    try {
      const result = await sophiaEngine.getSystemAnalysis(systemStateRef.current);
      setAnalysis(result);
    } catch (e: any) {
        console.error("Critical error during analysis execution:", e);
        setError(e.message || "A critical error occurred while attempting to run the analysis.");
    } finally {
        setIsLoading(false);
    }
  }, [sophiaEngine, isLoading]);

  const runPrediction = useCallback(async () => {
    if (!sophiaEngine || isPredicting) return;
    setIsPredicting(true);
    try {
      const res = await sophiaEngine.getFailurePrediction(systemStateRef.current);
      setPrediction(res);
    } catch (e) {
      console.warn("Prediction sequence bypassed:", e);
    } finally {
      setIsPredicting(false);
    }
  }, [sophiaEngine, isPredicting]);

  const runStrategySynthesis = useCallback(async () => {
    if (!sophiaEngine || isStrategizing) return;
    setIsStrategizing(true);
    try {
        const res = await sophiaEngine.getComplexStrategy(systemStateRef.current);
        setStrategy(res);
    } catch (e) {
        console.warn("Strategy synthesis skipped:", e);
    } finally {
        setIsStrategizing(false);
    }
  }, [sophiaEngine, isStrategizing]);

  return { analysis, sources, prediction, strategy, isLoading, isPredicting, isStrategizing, error, runAnalysis, runPrediction, runStrategySynthesis };
};
