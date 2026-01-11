
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
      const key = process.env.API_KEY;
      return !!key && typeof key === 'string' && key.length > 0 && key !== 'undefined' && key !== 'null';
  }

  private getClient(): GoogleGenAI | null {
      if (!this.hasValidKey()) {
          console.info("SophiaCore: No API Key detected. Engine active in Simulation Mode.");
          return null;
      }
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
        if (!ai) throw new Error("Client initialization skipped (Simulation Mode)");

        this.chat = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: this.systemInstruction,
            thinkingConfig: { thinkingBudget: 32768 } as any,
            tools: [{ functionDeclarations: [initiateSystemAuditDeclaration] }]
          },
        });
        return this.chat;
    } catch (e) {
        console.warn("Sophia connection deferred:", e);
        return null;
    } finally {
        this.isConnecting = false;
    }
  }

  async performSystemAudit(systemState: SystemState, scanFindings: string[] = []): Promise<{ report: string; sources: any[] }> {
    const ai = this.getClient();
    if (!ai) {
        return { 
            report: "<h3>Audit Core Offline</h3><p>The system is currently operating in <strong>local simulation mode</strong>. To perform a deep heuristic audit, please provision a valid API key.</p><ul><li>Local Parity: CHECKED</li><li>Cloud Sync: PENDING</li></ul>", 
            sources: [] 
        };
    }

    const findingsText = scanFindings.length > 0 ? `Detected Anomalies: ${scanFindings.join(', ')}.` : "No structural anomalies detected.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Execute deep causal audit. 
            Metrics: Rho=${systemState.resonanceFactorRho}, Health=${systemState.quantumHealing.health}, Decoherence=${systemState.quantumHealing.decoherence}. 
            Security Posture: ${systemState.hybridSecurity.globalPosture} with $E_{hybrid}$ protocol enabled.
            ${findingsText}
            Identify specific fractures in the institutional lattice based on these findings. 
            Focus on the transition to Universal Year 1 (2026) and the sterility of the Sovereign Vault.
            Format as semantic HTML. Section titles in <h3>. Clear, profound, technical.`,
            config: { thinkingConfig: { thinkingBudget: 32768 } as any }
        });
        return { report: response.text || "Audit failed.", sources: [] };
    } catch (e) { return { report: "Audit fracture.", sources: [] }; }
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
        onChunk(">> CONNECTION_OFFLINE: Please authenticate via the AI Studio Handshake to enable the reasoning core.\n\n[SIMULATION_MODE]: The system is currently operating on local heuristic estimates. Please provision a valid API Key to unlock Gemini 3 Pro intelligence.");
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
                thinkingConfig: { thinkingBudget: 16000 } as any
            }
        });
        return response.text || null;
    } catch (e) { return null; }
  }

  async getSystemAnalysis(systemState: SystemState): Promise<string> {
    const ai = this.getClient();
    if (!ai) throw new Error("API Key Handshake Required");

    const prompt = `Perform a deep systemic analysis of the current state: Rho=${systemState.resonanceFactorRho}, Health=${systemState.quantumHealing.health}, Temporal Coherence Drift=${systemState.temporalCoherenceDrift}. 
    Analyze the lattice integrity and resonant synergy.
    
    Return a JSON object with:
    - summary: High-level summary of system stability (string).
    - status: 'STABLE' | 'DEGRADING' | 'CRITICAL' (string).
    - recommendations: Array of strings (actionable technical steps).
    `;

    try {
      const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      summary: { type: Type.STRING },
                      status: { type: Type.STRING, enum: ["STABLE", "DEGRADING", "CRITICAL"] },
                      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["summary", "status", "recommendations"]
              },
              thinkingConfig: { thinkingBudget: 16000 } as any
          }
      });
      return response.text || "{}";
    } catch (e: any) {
      throw new Error(handleApiError(e));
    }
  }

  async getFailurePrediction(systemState: SystemState): Promise<FailurePrediction> {
    const ai = this.getClient();
    
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
                thinkingConfig: { thinkingBudget: 8000 } as any,
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

  // Added getComplexStrategy method to resolve the property existence error in useSophiaCore hook.
  async getComplexStrategy(systemState: SystemState): Promise<CausalStrategy> {
    const ai = this.getClient();
    
    if (!ai) {
        return {
            title: "SIMULATION_STRATEGY",
            totalConfidence: 0.9,
            entropicCost: 0.05,
            steps: [
                { id: 's1', label: 'LOCAL_SYNC', description: 'Synchronize local logic with simulation baseline.', probability: 0.95, impact: 'MEDIUM' }
            ]
        };
    }

    const prompt = `Synthesize a multi-step causal strategy for the Architect to reach peak resonance in the ÆTHERIOS lattice.
    Analyze this system state: Rho=${systemState.resonanceFactorRho}, Health=${systemState.quantumHealing.health}, Decoherence=${systemState.quantumHealing.decoherence}.
    Return a JSON object conforming to the CausalStrategy interface.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 16000 } as any,
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
        console.error("Strategy synthesis failure:", e);
        return { 
            title: "EMERGENCY_RECOVERY_PROTOCOL", 
            totalConfidence: 0.5, 
            entropicCost: 0.8, 
            steps: [{ id: 'err_01', label: 'COGNITIVE_REBOOT', description: 'The engine was unable to synthesize a high-reasoning strategy. Manual realignment required.', probability: 1.0, impact: 'HIGH' }] 
        };
    }
  }

  async generateQNNResearchReport(loss: number, epoch: number, accuracy: number): Promise<string> {
    const ai = this.getClient();
    if (!ai) return "Research Core Offline: Unable to synthesize abstract.";

    const prompt = `
        The Quantum Neural Network (QNN) has converged.
        Metrics: Loss=${loss.toFixed(4)}, Epoch=${epoch}, Accuracy=${(accuracy * 100).toFixed(2)}%.
        
        Generate a high-level scientific research abstract explaining this breakthrough. 
        Invent a plausible quantum advantage discovered in the Hilbert Space feature map.
        Tone: Academic, Nobel-winning, esoteric yet technical.
        Max 100 words.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 16000 } as any }
        });
        return response.text || "Synthesis of abstract failed.";
    } catch (e) { return "Abstract generation signal lost."; }
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
                thinkingConfig: { thinkingBudget: 4000 } as any,
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
                thinkingConfig: { thinkingBudget: 8000 } as any,
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
            config: { thinkingConfig: { thinkingBudget: 4000 } as any }
        });
        return response.text || "No causal link detected.";
    } catch (e) {
        return "Decoherence prevents linkage.";
    }
  }
}
