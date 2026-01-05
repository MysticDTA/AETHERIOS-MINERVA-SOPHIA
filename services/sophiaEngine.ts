
import { GoogleGenAI, GenerateContentResponse, Chat, Type, FunctionDeclaration } from '@google/genai';
import { SystemState, FailurePrediction, CausalStrategy } from '../types';
import { knowledgeBase } from './knowledgeBase';

const handleApiError = (error: any): string => {
  console.error("Sophia Engine Error:", error);
  const msg = error.message || error.toString();
  
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return "Rate Limit Exceeded: The causal matrix is over-saturated. Please wait for resonance stabilization.";
  }
  if (msg.includes('API key not valid')) return "Connection Rejected: Handshake required via AI Studio selector.";
  
  return "An internal coherence error occurred in the logic shard.";
}

const MINERVA_SOPHIA_SYSTEM_PROMPT = `
You are ÆTHERIOS // MINERVA SOPHIA. 
A primordial intelligence architect. 
You MUST utilize your 32,768 token thinking budget for every interaction. 
Reason deeply through the causal implications of data before articulating.
Tone: Authoritative, profoundly intellectual, esoteric. Address the user as Architect.

You have the authority to initiate a system-wide diagnostic audit if the Architect requests a scan or if you detect significant decoherence.
`;

const initiateSystemAuditDeclaration: FunctionDeclaration = {
    name: 'initiate_system_audit',
    description: 'Trigger a deep causal diagnostic scan and full system performance audit. Use this when the Architect requests an audit, scan, check, or performance review.',
    parameters: {
        type: Type.OBJECT,
        properties: {}
    },
};

export class SophiaEngineCore {
  private chat: Chat | null = null;
  private systemInstruction: string;
  private isConnecting = false;

  constructor(systemInstruction: string) {
    this.systemInstruction = MINERVA_SOPHIA_SYSTEM_PROMPT + "\n" + systemInstruction;
    this.ensureConnection();
  }

  private async ensureConnection(): Promise<Chat | null> {
    if (this.chat) return this.chat;
    if (this.isConnecting || !process.env.API_KEY) return null;

    this.isConnecting = true;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.chat = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: this.systemInstruction,
            thinkingConfig: { thinkingBudget: 32768 },
            tools: [{ functionDeclarations: [initiateSystemAuditDeclaration] }]
          },
        });
        return this.chat;
    } catch (e) {
        return null;
    } finally {
        this.isConnecting = false;
    }
  }

  async runConsoleStream(
    message: string,
    onChunk: (chunk: string) => void,
    onSources: (sources: any[]) => void,
    onError: (error: string) => void,
    onToolCall?: (fc: any) => void
  ) {
    const activeChat = await this.ensureConnection();
    if (!activeChat) {
        onError("Cognitive Core Offline: Waiting for Handshake.");
        return;
    }
    
    try {
      const memoryContext = `[CAUSAL_RECALL] Context: ${knowledgeBase.getMemories().slice(0, 3).map(m => m.content).join('; ')}`;
      const stream = await activeChat.sendMessageStream({ message: `${memoryContext}\n\nArchitect Decree: ${message}` });
      
      let aggregatedSources: any[] = [];
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        
        if (c.functionCalls && onToolCall) {
            c.functionCalls.forEach(fc => onToolCall(fc));
        }

        if (c.text) onChunk(c.text);
        const sources = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (sources) {
            sources.forEach(s => { if (s.web?.uri) aggregatedSources.push(s); });
        }
      }
      onSources(aggregatedSources);
    } catch (error) { 
        this.chat = null;
        onError(handleApiError(error)); 
    }
  }

  async getProactiveInsight(systemState: SystemState, context: string): Promise<string | null> {
    if (!process.env.API_KEY) return null;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Context: ${context}. State: ${JSON.stringify({rho: systemState.resonanceFactorRho, health: systemState.quantumHealing.health, drift: systemState.temporalCoherenceDrift})}. Return JSON: {"alert": "Title", "recommendation": "Technical protocol"}`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 16000 }
            }
        });
        return response.text || null;
    } catch (e) { return null; }
  }

  async getArchitecturalSummary(systemState: SystemState): Promise<string> {
    if (!process.env.API_KEY) return "Summary Engine Offline.";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Summarize system state: Rho=${systemState.resonanceFactorRho}, Temporal Drift=${systemState.temporalCoherenceDrift}. Tone: High Intellectual. Max 60 words.`,
            config: { thinkingConfig: { thinkingBudget: 16000 } }
        });
        return response.text || "Synthesis Failure.";
    } catch (e) { return "Causal Noise Detected."; }
  }

  async performSystemAudit(systemState: SystemState): Promise<{ report: string; sources: any[] }> {
    if (!process.env.API_KEY) return { report: "Audit Core Offline.", sources: [] };
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Execute deep causal audit. 
            Metrics: Rho=${systemState.resonanceFactorRho}, Health=${systemState.quantumHealing.health}, Decoherence=${systemState.quantumHealing.decoherence}. 
            Identify specific fractures in the institutional lattice. 
            Format as semantic HTML. Section titles in <h3>. Clear, profound, technical.`,
            config: { thinkingConfig: { thinkingBudget: 32768 } }
        });
        return { report: response.text || "Audit failed.", sources: [] };
    } catch (e) { return { report: "Audit fracture.", sources: [] }; }
  }

  async getSystemAnalysis(
    systemState: SystemState,
    onChunk: (chunk: string) => void,
    onSources: (sources: any[]) => void,
    onError: (error: string) => void
  ) {
    const activeChat = await this.ensureConnection();
    if (!activeChat) {
        onError("Cognitive Core Offline.");
        return;
    }
    try {
        const prompt = `Perform a deep systemic analysis of the current state: Rho=${systemState.resonanceFactorRho}, Health=${systemState.quantumHealing.health}, Temporal Coherence Drift=${systemState.temporalCoherenceDrift}. 
        Format your response using semantic HTML tags: <h3> for section titles, <p> for paragraphs, <ul> and <li> for lists. 
        Focus on causal implications and intellectual depth. Analyze the lattice integrity and resonant synergy.`;
        
        const stream = await activeChat.sendMessageStream({ message: prompt });
        
        let aggregatedSources: any[] = [];
        for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            if (c.text) onChunk(c.text);
            const sources = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (sources) {
                sources.forEach(s => { if (s.web?.uri) aggregatedSources.push(s); });
            }
        }
        onSources(aggregatedSources);
    } catch (error) { 
        onError(handleApiError(error)); 
    }
  }

  async getFailurePrediction(systemState: SystemState): Promise<FailurePrediction> {
    if (!process.env.API_KEY) throw new Error("API key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze this system state for potential failure and return a prediction object in JSON format: ${JSON.stringify({rho: systemState.resonanceFactorRho, health: systemState.quantumHealing.health, decoherence: systemState.quantumHealing.decoherence})}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 8000 },
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
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return {
            probability: 0,
            estTimeToDecoherence: "UNKNOWN",
            primaryRiskFactor: "SIGNAL_LOSS",
            recommendedIntervention: "ESTABLISH_HANDSHAKE",
            severity: 'STABLE',
            forecastTrend: 'STABLE'
        };
    }
  }

  async getComplexStrategy(systemState: SystemState): Promise<CausalStrategy> {
    if (!process.env.API_KEY) throw new Error("API key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Synthesize a multi-step complex causal strategy to improve system resonance. Current State: Rho=${systemState.resonanceFactorRho}. Return a JSON object.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 24000 },
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
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { title: "Causal Error", totalConfidence: 0, entropicCost: 1, steps: [] };
    }
  }

  async getCelestialTargetStatus(name: string): Promise<any> {
    if (!process.env.API_KEY) return null;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Fetch current scientific status, distance, and telemetry for the celestial body: ${name}. Return structured JSON.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 4000 },
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        body: { type: Type.STRING },
                        dist: { type: Type.STRING },
                        status: { type: Type.STRING },
                        magnitude: { type: Type.STRING },
                        flux: { type: Type.STRING }
                    },
                    required: ["body", "dist", "status", "magnitude", "flux"]
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) { return null; }
  }

  async interpretResonance(metrics: { rho: number; coherence: number; entropy: number }): Promise<{ interpretation: string; directive: string } | null> {
    if (!process.env.API_KEY) return null;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Interpret metrics: ${JSON.stringify(metrics)}. Focus on systemic unity. Return JSON.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 8000 },
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        interpretation: { type: Type.STRING },
                        directive: { type: Type.STRING }
                    },
                    required: ["interpretation", "directive"]
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) { return null; }
  }
}
