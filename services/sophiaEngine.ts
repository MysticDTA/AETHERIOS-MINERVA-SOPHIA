import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { SystemState, FailurePrediction, CausalStrategy } from "../types";
import { knowledgeBase } from "./knowledgeBase";

const handleApiError = (error: any): string => {
  console.error("Sophia Engine Error:", error);
  const msg = error.message || error.toString();
  if (msg.includes('API key not valid')) return "Connection Rejected: API key is invalid.";
  if (msg.includes('400 Bad Request')) return "Command Error: Malformed request.";
  return "An internal coherence error occurred. Please try again.";
}

export class SophiaEngineCore {
  private chat: Chat | null = null;
  private systemInstruction: string;

  constructor(systemInstruction: string) {
    this.systemInstruction = systemInstruction;
    this.initializeChat();
  }

  private initializeChat() {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (currentAi) {
        try {
            this.chat = currentAi.chats.create({
              model: 'gemini-3-pro-preview',
              config: {
                systemInstruction: this.systemInstruction,
                tools: [{googleSearch: {}}],
                thinkingConfig: { thinkingBudget: 32768 }
              },
            });
        } catch (e) {
            console.error("Failed to create chat session", e);
        }
    }
  }

  async getComplexStrategy(systemState: SystemState): Promise<CausalStrategy | null> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return null;

    const prompt = `
      As the Strategy Architect for ÆTHERIOS, formulate a 3-step intervention protocol for the following system metrics. 
      The goal is to maximize Coherence Rho while minimizing Entropic Flux.
      
      Metrics: ${JSON.stringify({
          health: systemState.quantumHealing.health,
          decoherence: systemState.quantumHealing.decoherence,
          rho: systemState.resonanceFactorRho,
          drift: systemState.temporalCoherenceDrift
      })}
    `;

    try {
      const response = await currentAi.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Technical name of the strategy" },
              totalConfidence: { type: Type.NUMBER, description: "Likelihood of success (0-1)" },
              entropicCost: { type: Type.NUMBER, description: "Predicted increase in decoherence (0-1)" },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING, description: "Actionable command (e.g. 'Boost Tau Core')" },
                    description: { type: Type.STRING, description: "Technical reasoning" },
                    probability: { type: Type.NUMBER },
                    impact: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
                  },
                  required: ["id", "label", "description", "probability", "impact"]
                }
              }
            },
            required: ["title", "totalConfidence", "entropicCost", "steps"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Strategy Synthesis Error:", e);
      return null;
    }
  }

  async getSystemAnalysis(
    systemState: SystemState,
    onChunk: (chunk: string) => void,
    onSources: (sources: any[]) => void,
    onError: (error: string) => void
  ) {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) { onError("Cognitive Core Offline."); return; }
    try {
      const prompt = `
        Perform a high-level Intellectual Audit on the following system state. 
        Focus on identifying "Decoherence Hotspots", "Resonance Rho Synergies", and "Causal Parity Drift".
        Provide a concise, technical, and authoritative report. 
        Format as semantic HTML: <h3>Audit Focus</h3>, <p>Summary</p>, <ul>Findings</ul>.
        
        System State: ${JSON.stringify({
            health: systemState.quantumHealing.health,
            rho: systemState.resonanceFactorRho,
            drift: systemState.temporalCoherenceDrift,
            coherence: systemState.coherenceResonance.score,
            status: systemState.governanceAxiom
        })}
      `;
      
      const response = await currentAi.models.generateContentStream({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          config: { 
              tools: [{googleSearch: {}}],
              thinkingConfig: { thinkingBudget: 24576 }
          }
      });

      let aggregatedSources: any[] = [];
      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        if (c.text) onChunk(c.text);
        const sources = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (sources) {
            sources.forEach(source => {
                if (source.web?.uri && !aggregatedSources.some(s => s.web?.uri === source.web?.uri)) {
                    aggregatedSources.push(source);
                }
            });
        }
      }
      onSources(aggregatedSources);
    } catch (error) {
      onError(handleApiError(error));
    }
  }

  async getFailurePrediction(systemState: SystemState): Promise<FailurePrediction | null> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return null;

    const prompt = `
      Analyze this system telemetry for potential causal collapse or decoherence events within the next hour.
      Metrics: ${JSON.stringify({
          health: systemState.quantumHealing.health,
          lesions: systemState.quantumHealing.lesions,
          rho: systemState.resonanceFactorRho,
          decoherence: systemState.quantumHealing.decoherence,
          temporalDrift: systemState.temporalCoherenceDrift
      })}
      Return a FailurePrediction JSON object.
    `;

    try {
      const response = await currentAi.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              probability: { type: Type.NUMBER, description: "Likelihood of failure within 60 mins (0-1)" },
              estTimeToDecoherence: { type: Type.STRING, description: "Estimated time to event (e.g. '14 minutes')" },
              primaryRiskFactor: { type: Type.STRING, description: "Key technical reason for risk" },
              recommendedIntervention: { type: Type.STRING, description: "Suggested operator rite or protocol" },
              severity: { type: Type.STRING, enum: ['STABLE', 'MODERATE', 'CRITICAL'] }
            },
            required: ["probability", "estTimeToDecoherence", "primaryRiskFactor", "recommendedIntervention", "severity"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failure Prediction Error:", e);
      return null;
    }
  }

  async runConsoleStream(
    message: string,
    onChunk: (chunk: string) => void,
    onSources: (sources: any[]) => void,
    onError: (error: string) => void,
    imageData?: string
  ) {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) { onError("Cognitive Core Offline."); return; }
    try {
      const recentMemories = knowledgeBase.getMemories().slice(0, 15);
      const memoryPromptFragment = `[CAUSAL_MEMORY_RETRIEVAL]\n${recentMemories.map(m => `- ${m.pillarContext}: ${m.content}`).join('\n')}\n\nOperator decree: ${message}`;

      if (imageData) {
          const parts = [
              { text: memoryPromptFragment },
              { inlineData: { data: imageData.split(',')[1], mimeType: 'image/jpeg' } }
          ];
          const response = await currentAi.models.generateContentStream({
              model: 'gemini-3-pro-image-preview',
              contents: { parts },
              config: { systemInstruction: this.systemInstruction + "\nAnalyze images for resonance patterns.", tools: [{googleSearch: {}}] }
          });
          let aggregatedSources: any[] = [];
          for await (const chunk of response) {
            const c = chunk as GenerateContentResponse;
            if (c.text) onChunk(c.text);
            const sources = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (sources) {
                sources.forEach(source => {
                    if (source.web?.uri && !aggregatedSources.some(s => s.web?.uri === source.web?.uri)) aggregatedSources.push(source);
                });
            }
          }
          onSources(aggregatedSources);
      } else {
          if (!this.chat) throw new Error("Chat not initialized");
          const stream = await this.chat.sendMessageStream({ message: memoryPromptFragment });
          let aggregatedSources: any[] = [];
          for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            if (c.text) onChunk(c.text);
            const sources = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (sources) {
                sources.forEach(source => {
                    if (source.web?.uri && !aggregatedSources.some(s => s.web?.uri === source.web?.uri)) aggregatedSources.push(source);
                });
            }
          }
          onSources(aggregatedSources);
      }
    } catch (error) { onError(handleApiError(error)); }
  }

  async performSystemAudit(systemState: SystemState): Promise<{ report: string; sources: any[] }> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return { report: "Audit Core Offline.", sources: [] };
    const auditPrompt = `
        Perform a deep, technical Intellectual Audit on the ÆTHERIOS local ecosystem. 
        Analyze the relationship between Health, Rho, and Temporal Drift.
        Identify if 1.617 GHz (Golden Ratio Harmonic) is optimal for the current resonant load.
        Format as semantic HTML: <h3>Audit Focus</h3>, <p>Summary</p>, <ul>Findings</ul>.
        
        System State: ${JSON.stringify({
            health: systemState.quantumHealing.health,
            rho: systemState.resonanceFactorRho,
            drift: systemState.temporalCoherenceDrift,
            status: systemState.governanceAxiom
        })}
    `;
    try {
        const response = await currentAi.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: auditPrompt,
            config: { 
                tools: [{googleSearch: {}}],
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return {
            report: response.text || "Audit failed to synthesize report.",
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        };
    } catch (e) {
        return { report: handleApiError(e), sources: [] };
    }
  }

  async getCelestialTargetStatus(bodyName: string): Promise<any | null> {
      const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!currentAi) return null;
      const prompt = `Fetch real-time astrophysical telemetry for "${bodyName}". Return JSON: {"body": "Name", "flux": "Technical value", "dist": "Distance", "magnitude": "Mag", "status": "Summary"}`;
      try {
          const response = await currentAi.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { tools: [{googleSearch: {}}], responseMimeType: "application/json" }
          });
          return JSON.parse(response.text);
      } catch (e) { return null; }
  }

  async getProactiveInsight(systemState: SystemState, trendContext: string): Promise<string | null> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return null;
    const insightPrompt = `As SOPHIA, identify critical anomalies at the 1.617 GHz intercept. Return JSON: {"alert": "6 words", "recommendation": "15 words"}. State: ${JSON.stringify(systemState)}`;
    try {
        const response = await currentAi.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: insightPrompt,
            config: { 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 4000 }
            },
        });
        return response.text;
    } catch (error) { return null; }
  }

  async interpretResonance(metrics: any): Promise<any> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return null;
    const prompt = `Interpret resonance harmonics at 1.617 GHz: ${JSON.stringify(metrics)}. Return JSON: {"interpretation": "str", "directive": "str"}`;
    try {
        const response = await currentAi.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 8000 } }
        });
        return JSON.parse(response.text);
    } catch (e) { return null; }
  }
}
