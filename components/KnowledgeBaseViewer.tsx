import React, { useState } from 'react';
import { Memory } from '../types';
import { knowledgeBase } from '../services/knowledgeBase';

interface KnowledgeBaseViewerProps {
  memories: Memory[];
  onMemoryChange: () => void;
}

export const KnowledgeBaseViewer: React.FC<KnowledgeBaseViewerProps> = ({ memories, onMemoryChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    knowledgeBase.clearMemories();
    onMemoryChange();
    setShowConfirm(false);
  };

  return (
    <div className="w-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg h-full flex flex-col border-glow-gold backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2 border-b border-dark-border pb-2">
        <h3 className="font-orbitron text-lg text-warm-grey">Regenerative Memory</h3>
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)}
            disabled={memories.length === 0}
            className="px-2 py-0.5 rounded text-xs bg-rose-800/70 text-rose-300 hover:bg-rose-700/80 hover:text-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleClear} className="px-2 py-0.5 rounded text-xs bg-rose-600 text-white">Confirm</button>
            <button onClick={() => setShowConfirm(false)} className="px-2 py-0.5 rounded text-xs bg-slate-600 text-white">Cancel</button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0">
        {memories.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-8">Memory bank is empty. Save insights from SOPHIA.</p>
        ) : (
          memories.map(mem => (
            <div key={mem.id} className="p-2 rounded-md bg-slate-800/50 border border-dark-border/50">
              <p className="text-xs text-pearl">{mem.content}</p>
              <p className="text-right text-xs text-warm-grey mt-1">{new Date(mem.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};