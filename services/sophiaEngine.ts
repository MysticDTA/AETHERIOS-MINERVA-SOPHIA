
import { GoogleGenAI, GenerateContentResponse, Chat, Type, FunctionDeclaration } from '@google/genai';
import { SystemState, FailurePrediction, CausalStrategy } from '../types';
import { knowledgeBase } from './knowledgeBase';

const handleApiError = (error: any): string => {
  console.error("Sophia Engine Error:", error);
  const msg = error.message || error.toString();
  
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return "Rate Limit Exceeded: The causal matrix is over-saturated. Please wait for resonance stabilization.";
  }
  if (msg.includes('API key') || msg.includes('403')) return "Connection Rejected: Handshake required via AI Studio selector.";
  
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
  public readonly instanceId: string;
  private chat: Chat | null = null;
  private systemInstruction: string;
  private isConnecting = false;

  constructor(systemInstruction: string) {
    this.instanceId = `ENG_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    this.systemInstruction = MINERVA_SOPHIA_SYSTEM_PROMPT + "\n" + systemInstruction;
    this.ensureConnection();
  }

  private hasValidKey(): boolean {
      return !!process.env.API_KEY && process.env.API_KEY.length > 0 && process.env.API_KEY !== 'undefined';
  }

  private getClient(): GoogleGenAI | null {
      if (!this.hasValidKey()) return null;
      try {
          return new GoogleGenAI({ apiKey: process.env.API_KEY });
      } catch (e) {
          console.error("Failed to initialize GoogleGenAI client:", e);
          return null;
      }
  }

  private async ensureConnection(): Promise<Chat | null> {
    if (this.chat) return this.chat;
    if (this.isConnecting) return null;
    
    if (!this.hasValidKey()) return null;

    this.isConnecting = true;
    try {
        const ai = this.getClient();
        if (!ai) throw new Error("Client initialization failed");

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
        console.warn("Sophia connection failed (likely offline/no-key):", e);
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
        onChunk(">> CONNECTION_OFFLINE: Please authenticate via the AI Studio Handshake to enable the reasoning core.\n\n[SIMULATION_MODE]: The system is currently running on local heuristic estimates.");
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
    const ai = this.getClient();
    if (!ai) return null;

    try {
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
    const ai = this.getClient();
    if (!ai) return "Summary Engine Offline: Waiting for Institutional Handshake.";

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
    const ai = this.getClient();
    if (!ai) {
        return { 
            report: "<h3>Audit Core Offline</h3><p>The system is currently operating in <strong>local simulation mode</strong>. To perform a deep heuristic audit, please provision a valid API key.</p><ul><li>Local Parity: CHECKED</li><li>Cloud Sync: PENDING</li></ul>", 
            sources: [] 
        };
    }

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
        // Provide a rich simulation response so the UI looks active
        onChunk(`<h3>System State Summary</h3>
        <p>The Minerva cognitive core is currently <strong>offline</strong>. Running local heuristic approximation.</p>
        <p><strong>Status:</strong> Resonance Rho at ${(systemState.resonanceFactorRho * 100).toFixed(2)}%. Temporal drift nominal.</p>
        <h3>Actionable Recommendations</h3>
        <ul>
            <li>Establish API Key Handshake for deep causal reasoning.</li>
            <li>Monitor local coherence metrics manually.</li>
            <li>Verify Lyran Concordance alignment.</li>
        </ul>
        <p><em>To enable deep reasoning analysis, please complete the API Key Handshake.</em></p>`);
        return;
    }
    try {
        const prompt = `Perform a deep systemic analysis of the current state: Rho=${systemState.resonanceFactorRho}, Health=${systemState.quantumHealing.health}, Temporal Coherence Drift=${systemState.temporalCoherenceDrift}. 
        
        Strictly structure your response with these two HTML sections:
        <h3>System State Summary</h3>
        <p>[Provide a high-level summary of system stability, resonance, and integrity]</p>
        
        <h3>Actionable Recommendations</h3>
        <ul>
          <li>[Recommendation 1]</li>
          <li>[Recommendation 2]</li>
          <li>[Recommendation 3]</li>
        </ul>
        
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
    const ai = this.getClient();
    
    // Robust fallback if no key or client failure
    if (!ai) {
        return {
            probability: 0.05,
            estTimeToDecoherence: "SIMULATION_STABLE",
            primaryRiskFactor: "OFFLINE_MODE",
            recommendedIntervention: "ESTABLISH_UPLINK",
            severity: 'STABLE',
            forecastTrend: 'STABLE'
        };
    }

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
        console.warn("Prediction fetch failed, using fallback:", e);
        return {
            probability: 0,
            estTimeToDecoherence: "UNKNOWN",
            primaryRiskFactor: "SIGNAL_LOSS",
            recommendedIntervention: "RETRY_HANDSHAKE",
            severity: 'STABLE',
            forecastTrend: 'STABLE'
        };
    }
  }

  async getComplexStrategy(systemState: SystemState): Promise<CausalStrategy> {
    const ai = this.getClient();
    if (!ai) {
        return { 
            title: "Strategy Simulation (Offline)", 
            totalConfidence: 0.85, 
            entropicCost: 0.01, 
            steps: [
                { id: '1', label: 'MAINTAIN_RHO', description: 'Keep current resonance steady.', probability: 0.9, impact: 'HIGH' },
                { id: '2', label: 'AWAIT_KEY', description: 'Provision API Key for deep strategy.', probability: 1.0, impact: 'MEDIUM' }
            ] 
        };
    }

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
    const ai = this.getClient();
    if (!ai) return null;
    
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
    const ai = this.getClient();
    if (!ai) return null;

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

  async findCausalLink(nodeA: string, nodeB: string): Promise<string> {
    const ai = this.getClient();
    if (!ai) return "Connection Failed: No Cognitive Uplink.";

    const prompt = `Analyze the hidden causal relationship between these two system artifacts:
    A: "${nodeA}"
    B: "${nodeB}"
    Synthesize a speculative, profound, or technical link explaining how A might influence B or vice versa. Max 25 words. Abstract tone.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 4000 } }
        });
        return response.text || "No causal link detected.";
    } catch (e) {
        return "Decoherence prevents linkage.";
    }
  }
}
