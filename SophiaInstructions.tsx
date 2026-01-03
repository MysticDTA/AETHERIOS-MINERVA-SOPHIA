import React, { useState, useEffect } from 'react';

interface SophiaInstructionsProps {
  currentInstruction: string;
  onUpdate: (newInstruction: string) => void;
}

export const SophiaInstructions: React.FC<SophiaInstructionsProps> = ({ currentInstruction, onUpdate }) => {
  const [text, setText] = useState(currentInstruction);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setText(currentInstruction);
    setIsSaved(true);
  }, [currentInstruction]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsSaved(false);
  };

  const handleUpdateClick = () => {
    onUpdate(text);
    setIsSaved(true);
  };

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm">
      <h3 className="font-orbitron text-lg text-slate-300 mb-2 border-b border-slate-700 pb-2">SOPHIA System Instructions</h3>
      <p className="text-xs text-slate-400 mb-3">
        Modify SOPHIA's core persona and response guidelines. Changes take effect on the next message.
      </p>
      <textarea
        value={text}
        onChange={handleTextChange}
        className="w-full h-48 bg-slate-800/80 border border-slate-600 rounded-md p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
        placeholder="Enter new system instructions for SOPHIA..."
      />
      <button
        onClick={handleUpdateClick}
        disabled={isSaved}
        className="w-full mt-3 px-4 py-2 rounded-md bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-yellow-800/50"
      >
        {isSaved ? 'Instructions Updated' : 'Update Instructions'}
      </button>
    </div>
  );
};