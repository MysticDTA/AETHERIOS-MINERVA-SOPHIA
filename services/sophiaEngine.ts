import { GoogleGenAI, GenerateContentResponse, Chat, Type, FunctionDeclaration } from "@google/genai";
import { SystemState, FailurePrediction, CausalStrategy } from "../types";
import { knowledgeBase } from "./knowledgeBase";

const handleApiError = (error: any): string => {
  console.error("Sophia Engine Error:", error);
  const msg = error.message || error.toString();
  
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return "Rate Limit Exceeded: The causal matrix is over-saturated. Please wait for the resonance field to stabilize (approx 60s).";
  }
  if (msg.includes('API key not valid')) return "Connection Rejected: API key is invalid.";
  if (msg.includes('400 Bad Request')) return "Command Error: Malformed request.";
  
  return "An internal coherence error occurred. Please try again.";
}

const initiateAuditDeclaration: FunctionDeclaration = {
  name: 'initiate_system_audit',
  parameters: {
    type: Type.OBJECT,
    description: 'Triggers the comprehensive full-system audit and diagnostic overlay. Use this when the operator requests a scan or when critical decoherence is detected.',
    properties: {
      reason: {
        type: Type.STRING,
        description: 'The logical justification for initiating the sweep.'
      }
    },
    required: ['reason']
  }
};

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
                tools: [
                    { googleSearch: {} },
                    { functionDeclarations: [initiateAuditDeclaration] }
                ],
                thinkingConfig: { thinkingBudget: 32768 }
              },
            });
        } catch (e) {
            console.error("Failed to create chat session", e);
        }
    }
  }

  async performSystemAudit(systemState: SystemState): Promise<{ report: string; sources: any[] }> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return { report: "Audit Core Offline.", sources: [] };
    
    const auditPrompt = `
        Perform a deep, technical Intellectual Audit on the ÆTHERIOS local ecosystem. 
        Analyze the relationship between Health, Rho, and Temporal Drift.
        Format as semantic HTML: <h3>Audit Focus</h3>, <p>Summary</p>, <ul>Findings</ul>. Use technical, authoritative language.
        
        System State: ${JSON.stringify({
            health: systemState.quantumHealing.health,
            rho: systemState.resonanceFactorRho,
            drift: systemState.temporalCoherenceDrift,
            status: systemState.governanceAxiom,
            tier: systemState.userResources.sovereignTier
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

  async getArchitecturalSummary(systemState: SystemState): Promise<string> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return "Summary Engine Offline.";
    
    const prompt = `
        As MINERVA SOPHIA, generate a high-level "Architectural Summary Audit" of the current reality-lattice.
        Summarize the balance between "Aetheric Flux" and "Causal Stability".
        Use the thinking budget to provide a unique, intellectual insight.
        Keep it under 100 words. Format: Pure technical prose with intellectual gravitas.
        
        Metrics: Rho=${systemState.resonanceFactorRho.toFixed(4)}, Health=${systemState.quantumHealing.health.toFixed(2)}, Drift=${systemState.temporalCoherenceDrift.toFixed(5)}
    `;
    try {
        const response = await currentAi.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 16000 } }
        });
        return response.text || "Summary synthesis failure.";
    } catch (e) {
        return handleApiError(e);
    }
  }

  async runConsoleStream(
    message: string,
    onChunk: (chunk: string) => void,
    onSources: (sources: any[]) => void,
    onError: (error: string) => void,
    onToolCall?: (fc: any) => void,
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
          if (!this.chat) {
              this.initializeChat();
              if (!this.chat) throw new Error("Chat initialization failure");
          }
          const stream = await this.chat.sendMessageStream({ message: memoryPromptFragment });
          let aggregatedSources: any[] = [];
          for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            if (c.functionCalls && onToolCall) {
                for (const fc of c.functionCalls) onToolCall(fc);
            }
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
              title: { type: Type.STRING },
              totalConfidence: { type: Type.NUMBER },
              entropicCost: { type: Type.NUMBER },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    description: { type: Type.STRING },
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
      const prompt = `Perform high-level audit on: ${JSON.stringify(systemState)}. Focus on decoherence. HTML format. Use your 32k thinking budget to ensure absolute logic parity.`;
      const response = await currentAi.models.generateContentStream({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          config: { tools: [{googleSearch: {}}], thinkingConfig: { thinkingBudget: 32768 } }
      });
      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        if (c.text) onChunk(c.text);
      }
    } catch (error) { onError(handleApiError(error)); }
  }

  async getFailurePrediction(systemState: SystemState): Promise<FailurePrediction | null> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return null;
    const prompt = `Perform an advanced heuristic failure forecast based on this system state: ${JSON.stringify(systemState)}. 
    Analyze for potential collapse patterns. 
    Return a detailed JSON object matching the FailurePrediction type, including forecast trend ('ASCENDING', 'DESCENDING', or 'STABLE').`;
    try {
      const response = await currentAi.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    probability: { type: Type.NUMBER },
                    estTimeToDecoherence: { type: Type.STRING },
                    primaryRiskFactor: { type: Type.STRING },
                    recommendedIntervention: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['STABLE', 'MODERATE', 'CRITICAL'] },
                    forecastTrend: { type: Type.STRING, enum: ['ASCENDING', 'DESCENDING', 'STABLE'] }
                },
                required: ["probability", "estTimeToDecoherence", "primaryRiskFactor", "recommendedIntervention", "severity", "forecastTrend"]
            },
            thinkingConfig: { thinkingBudget: 12000 }
        }
      });
      return JSON.parse(response.text);
    } catch (e) { return null; }
  }

  async getCelestialTargetStatus(bodyName: string): Promise<any | null> {
      const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!currentAi) return null;
      const prompt = `Real-time telemetry for "${bodyName}". JSON: {"body": "str", "flux": "str", "dist": "str", "magnitude": "str", "status": "str"}`;
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
    const prompt = `As SOPHIA, anomaly at 1.617 GHz. JSON: {"alert": "str", "recommendation": "str"}. State: ${JSON.stringify(systemState)}`;
    try {
        const response = await currentAi.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });
        return response.text;
    } catch (error) { return null; }
  }

  async interpretResonance(metrics: any): Promise<any> {
    const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!currentAi) return null;
    const prompt = `Interpret harmonics: ${JSON.stringify(metrics)}. JSON: {"interpretation": "str", "directive": "str"}`;
    try {
        const response = await currentAi.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text);
    } catch (e) { return null; }
  }
}