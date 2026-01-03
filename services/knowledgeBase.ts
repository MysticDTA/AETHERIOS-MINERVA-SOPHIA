import { Memory, AppSettings } from '../types';

const MEMORY_KEY = 'sophia_knowledge_base';
const SETTINGS_KEY = 'sophia_app_settings';

class KnowledgeBase {
  private memories: Memory[] = [];
  private settings: AppSettings = {
    memoryConsent: true, // Default to true for this demo
  };

  constructor() {
    this.loadMemories();
    this.loadSettings();
  }

  private loadMemories() {
    try {
      const stored = localStorage.getItem(MEMORY_KEY);
      if (stored) {
        this.memories = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load memories from localStorage", e);
      this.memories = [];
    }
  }
  
  private loadSettings() {
      try {
          const stored = localStorage.getItem(SETTINGS_KEY);
          if (stored) {
              this.settings = { ...this.settings, ...JSON.parse(stored) };
          }
      } catch (e) {
          console.error("Failed to load settings from localStorage", e);
      }
  }

  private saveMemories() {
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify(this.memories));
    } catch (e) {
      console.error("Failed to save memories to localStorage", e);
    }
  }
  
  private saveSettings() {
      try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      } catch (e) {
          console.error("Failed to save settings to localStorage", e);
      }
  }
  
  getSettings(): AppSettings {
      return this.settings;
  }
  
  updateSettings(newSettings: Partial<AppSettings>) {
      this.settings = { ...this.settings, ...newSettings };
      this.saveSettings();
  }

  addMemory(content: string, pillarContext: string) {
    if (!this.settings.memoryConsent) return;
    
    const newMemory: Memory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      content,
      timestamp: Date.now(),
      pillarContext,
    };
    this.memories.unshift(newMemory); // add to beginning
    if (this.memories.length > 100) { // cap memory size
        this.memories.pop();
    }
    this.saveMemories();
  }

  getMemories(): Memory[] {
    return this.memories;
  }
  
  clearMemories() {
      this.memories = [];
      this.saveMemories();
  }
}

export const knowledgeBase = new KnowledgeBase();
