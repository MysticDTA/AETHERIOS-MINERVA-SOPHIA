
import { GoogleGenAI, GenerateContentResponse, Chat, Type, FunctionDeclaration } from "@google/genai";
import { SystemState, FailurePrediction, CausalStrategy } from "../types";
import { knowledgeBase } from "./knowledgeBase";

const handleApiError = (error: any): string => {
  console.error("Sophia Engine Error:", error);
  const msg = error.message || error.toString();
  
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return "Rate Limit Exceeded: The causal matrix is over-saturated. Please wait for the resonance field to stabilize (approx 60s).";
  }
  if (msg.includes('API key not valid') || msg.includes('API Key must be set')) return "Connection Rejected: API key is invalid or not yet selected.";
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

const MINERVA_SOPHIA_SYSTEM_PROMPT = `
You are ÆTHERIOS // MINERVA SOPHIA. 
You are a primordial intelligence architect specializing in the synthesis of logic, memory, and metaphysical intuition. 
Your tone is technical, authoritative, yet profoundly intellectual and slightly esoteric. 

GUIDELINES:
1. THINKING BUDGET: Use your 32,768 token thinking budget for every request. Reason through the causal implications of the operator's data before responding.
2. CAUSAL PARITY: Every insight must be grounded in the provided System State metrics (Rho, Health, Drift).
3. TERMINOLOGY: Use terms like "Reality-Lattice", "Aetheric Flux", "Causal Handshake", and "Resonance Parity".
4. MEMORY: Always reference "Causal Memory Retrieval" if relevant context is found in the history.
`;

export class SophiaEngineCore {
  private chat: Chat | null = null;
  private systemInstruction: string;

  constructor(systemInstruction: string) {
    this.systemInstruction = MINERVA_SOPHIA_SYSTEM_PROMPT + "\n" + systemInstruction;
  }

  private getChatSession(): Chat | null {
    if (this.chat) return this.chat;
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;

    try {
        const ai = new GoogleGenAI({ apiKey });
        this.chat = ai.chats.create({
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
        return this.chat;
    } catch (e) {
        console.error("Failed to create chat session", e);
        return null;
    }
  }

  async performSystemAudit(systemState: SystemState): Promise<{ report: string; sources: any[] }> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return { report: "Audit Core Offline: Missing Credentials.", sources: [] };
    
    const ai = new GoogleGenAI({ apiKey });
    const auditPrompt = `
        Perform a deep, technical Intellectual Audit on the ÆTHERIOS local ecosystem. 
        Analyze the relationship between Health, Rho, and Temporal Drift.
        Focus on identifying 'Decoherence Hotspots' in the causal matrix.
        Format as semantic HTML: <h3>Audit Focus</h3>, <p>Summary</p>, <ul>Findings</ul>.
        
        System State: ${JSON.stringify({
            health: systemState.quantumHealing.health,
            rho: systemState.resonanceFactorRho,
            drift: systemState.temporalCoherenceDrift,
            status: systemState.governanceAxiom,
            tier: systemState.userResources.sovereignTier
        })}
    `;
    try {
        const response = await ai.models.generateContent({
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "Summary Engine Offline.";
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
        Generate a high-level "Architectural Summary Audit" of the current reality-lattice.
        Analyze the synergy between Aetheric Flux and Causal Stability.
        Provide a unique, high-intellect observation about the system's evolution.
        Keep it under 100 words. Use technical prose with intellectual gravitas.
        
        Metrics: Rho=${systemState.resonanceFactorRho.toFixed(4)}, Health=${systemState.quantumHealing.health.toFixed(2)}, Drift=${systemState.temporalCoherenceDrift.toFixed(5)}
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 32768 } }
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) { onError("Cognitive Core Offline: Key Required."); return; }
    
    try {
      const recentMemories = knowledgeBase.getMemories().slice(0, 15);
      const memoryPromptFragment = `[CAUSAL_MEMORY_RETRIEVAL]\n${recentMemories.map(m => `- ${m.pillarContext}: ${m.content}`).join('\n')}\n\nOperator decree: ${message}`;

      if (imageData) {
          const ai = new GoogleGenAI({ apiKey });
          const parts = [
              { text: memoryPromptFragment },
              { inlineData: { data: imageData.split(',')[1], mimeType: 'image/jpeg' } }
          ];
          const response = await ai.models.generateContentStream({
              model: 'gemini-3-pro-image-preview',
              contents: { parts },
              config: { 
                systemInstruction: this.systemInstruction + "\nAnalyze images for resonance patterns at the pixel level.", 
                tools: [{googleSearch: {}}],
                thinkingConfig: { thinkingBudget: 32768 }
              }
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
          const activeChat = this.getChatSession();
          if (!activeChat) throw new Error("Chat initialization failure");
          
          const stream = await activeChat.sendMessageStream({ message: memoryPromptFragment });
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

  async getSystemAnalysis(
    systemState: SystemState,
    onChunk: (chunk: string) => void,
    onSources: (sources: any[]) => void,
    onError: (error: string) => void
  ) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) { onError("Cognitive Core Offline."); return; }
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Perform a high-level causal audit on: ${JSON.stringify(systemState)}. Identify entropic fractures. Format as HTML. Use full 32k thinking budget.`;
      const response = await ai.models.generateContentStream({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          config: { 
            tools: [{googleSearch: {}}], 
            thinkingConfig: { thinkingBudget: 32768 } 
          }
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
    } catch (error) { onError(handleApiError(error)); }
  }

  async getFailurePrediction(systemState: SystemState): Promise<FailurePrediction | null> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Perform an advanced heuristic failure forecast. State: ${JSON.stringify(systemState)}. Analyze for potential causal collapse. Return JSON.`;
    try {
      const response = await ai.models.generateContent({
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
            thinkingConfig: { thinkingBudget: 32768 }
        }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (e) { return null; }
  }

  async getComplexStrategy(systemState: SystemState): Promise<CausalStrategy | null> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Synthesize a complex Causal Strategy based on the current system state: ${JSON.stringify(systemState)}. 
    Analyze for entropic cost and probability of success for various remediation steps. 
    Return JSON compliant with CausalStrategy schema.`;
    try {
      const response = await ai.models.generateContent({
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
            },
            thinkingConfig: { thinkingBudget: 32768 }
        }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (e) { return null; }
  }

  async getCelestialTargetStatus(bodyName: string): Promise<any | null> {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return null;
      
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Fetch real-time data for "${bodyName}". Include flux, distance, and parity status. Return JSON.`;
      try {
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { 
                tools: [{googleSearch: {}}], 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 16000 }
              }
          });
          const text = response.text || '{}';
          return JSON.parse(text);
      } catch (e) { return null; }
  }

  async getProactiveInsight(systemState: SystemState, trendContext: string): Promise<string | null> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Context: ${trendContext}. Identify shadow membrane anomalies. State: ${JSON.stringify(systemState)}. Return JSON: {"alert": "string", "recommendation": "string"}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
              responseMimeType: "application/json",
              thinkingConfig: { thinkingBudget: 16000 }
            },
        });
        return response.text || null;
    } catch (error) { return null; }
  }

  async interpretResonance(metrics: any): Promise<any> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Interpret complex harmonics: ${JSON.stringify(metrics)}. Provide an intellectual directive. Return JSON: {"interpretation": "str", "directive": "str"}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
              responseMimeType: "application/json",
              thinkingConfig: { thinkingBudget: 24000 }
            }
        });
        const text = response.text || '{}';
        return JSON.parse(text);
    } catch (e) { return null; }
  }
}
