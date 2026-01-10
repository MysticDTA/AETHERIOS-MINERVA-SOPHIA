
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { LogEntry, LogType } from '../types';

interface EventLogProps {
  log: LogEntry[];
  filter: LogType | 'ALL';
  onFilterChange: (filter: LogType | 'ALL') => void;
}

const getLogTypeColor = (type: LogType) => {
  switch (type) {
    case LogType.INFO: return 'text-slate-400';
    case LogType.WARNING: return 'text-yellow-400 font-medium';
    case LogType.CRITICAL: return 'text-rose-500 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]';
    case LogType.SYSTEM: return 'text-violet-400';
    default: return 'text-slate-500';
  }
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const EventLog: React.FC<EventLogProps> = ({ log, filter, onFilterChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const filters: (LogType | 'ALL')[] = ['ALL', LogType.SYSTEM, LogType.CRITICAL, LogType.WARNING, LogType.INFO];

  const filteredLog = useMemo(() => {
    return log.filter(entry => filter === 'ALL' || entry.type === filter);
  }, [log, filter]);

  useEffect(() => {
    if (scrollRef.current) {
        // Since we are using flex-col-reverse, this stays at the 'bottom' (latest)
        scrollRef.current.scrollTop = 0;
    }
  }, [filteredLog]);

  return (
    <div className="bg-[#0a0a0a]/70 border border-white/[0.08] p-5 rounded-xl h-full flex flex-col backdrop-blur-3xl shadow-2xl overflow-hidden transition-all duration-500 group">
      <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3 shrink-0">
        <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Event Stream</h3>
        <div className="flex gap-1.5">
          {filters.map(f => (
            <button 
                key={f} 
                onClick={() => onFilterChange(f)} 
                className={`px-2.5 py-1 rounded-sm text-[8px] font-bold uppercase transition-all border ${filter === f ? 'bg-pearl text-dark-bg border-pearl shadow-[0_0_10px_rgba(248,245,236,0.2)]' : 'bg-white/5 text-slate-500 border-transparent hover:text-pearl hover:bg-white/10'}`}
            >
                {f === 'ALL' ? 'ALL' : f.substring(0, 4)}
            </button>
          ))}
        </div>
      </div>
      <div 
        ref={scrollRef} 
        className="overflow-y-auto flex-1 pr-3 clear-scrolling-window scrollbar-thin"
      >
        <div className="flex flex-col-reverse space-y-2 space-y-reverse">
            {filteredLog.map(entry => (
            <div key={entry.id} className="text-[10px] py-1.5 px-3 rounded-sm hover:bg-white/[0.03] transition-colors group flex gap-4 font-mono leading-relaxed items-start border-l border-transparent hover:border-white/10">
                <span className={`shrink-0 opacity-80 uppercase tracking-tighter pt-0.5 ${getLogTypeColor(entry.type)}`}>
                    [{entry.type.substring(0, 4)}]
                </span>
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors flex-1">{entry.message}</span>
                <span className="shrink-0 text-[9px] text-slate-700 group-hover:text-slate-500 opacity-60 font-mono pt-0.5">
                    {formatTimestamp(entry.timestamp)}
                </span>
            </div>
            ))}
            {filteredLog.length === 0 && (
                <div className="h-20 flex items-center justify-center italic text-slate-600 text-[10px] uppercase tracking-widest opacity-40">
                    No matching logs in buffer.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
