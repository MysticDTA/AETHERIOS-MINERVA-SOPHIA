
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ComposedChart, Bar 
} from 'recharts';
import { PerformanceTelemetry } from '../types';

interface PerformanceMetricsChartProps {
  performance: PerformanceTelemetry;
}

interface DataPoint {
  time: string;
  cpu: number;      // CPU Load %
  memory: number;   // Memory Usage GB
  fps: number;      // Frame Rate
  latency: number;  // ms
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = React.memo(({ performance }) => {
  const [history, setHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Transform raw telemetry into requested display metrics
    const newPoint: DataPoint = {
      time: timeStr,
      // Mapping logical latency to a simulated CPU load for visualization
      cpu: Math.min(100, (performance.logicalLatency * 50000) + (performance.gpuLoad * 20)),
      memory: performance.memoryUsage,
      // Derived FPS from frame stability
      fps: Math.round(60 * performance.frameStability),
      latency: performance.logicalLatency * 1000,
    };

    setHistory(prev => {
      const next = [...prev, newPoint];
      // Keep 20 points for a smoother, more informative history
      if (next.length > 20) return next.slice(1);
      return next;
    });
  }, [performance]);

  return (
    <div className="w-full bg-black/40 border border-white/5 p-6 rounded-xl flex flex-col gap-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group gpu-accel transition-all duration-700 hover:border-white/10">
      <div className="absolute top-0 right-0 p-3 opacity-[0.02] font-orbitron text-7xl uppercase font-black tracking-tighter select-none pointer-events-none">PERF_MON</div>
      
      <div className="flex justify-between items-center z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-4 bg-emerald-400 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold">Resonance System Diagnostics</h3>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]" />
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">CPU</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_5px_gold]" />
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">FPS</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_5px_#f43f5e]" />
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">MEM</span>
           </div>
        </div>
      </div>

      <div className="h-48 w-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={history}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis yAxisId="left" orientation="left" stroke="#22d3ee" fontSize={8} tickFormatter={(val) => `${val}%`} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" stroke="#ffd700" fontSize={8} tickFormatter={(val) => `${val}`} axisLine={false} tickLine={false} domain={[0, 70]} />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(5, 5, 5, 0.95)', 
                border: '1px solid rgba(255,215,0,0.2)', 
                borderRadius: '2px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
              }}
              itemStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', padding: '2px 0' }}
              labelStyle={{ color: '#b6b0a0', fontSize: '8px', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}
              isAnimationActive={false}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            />
            
            <Area yAxisId="left" type="monotone" dataKey="cpu" name="CPU LOAD" stroke="#22d3ee" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} isAnimationActive={false} />
            <Area yAxisId="left" type="monotone" dataKey="memory" name="MEMORY USAGE" stroke="#f43f5e" fillOpacity={1} fill="url(#colorMem)" strokeWidth={1} strokeDasharray="3 3" isAnimationActive={false} />
            <Line yAxisId="right" type="stepAfter" dataKey="fps" name="FRAME RATE" stroke="#ffd700" strokeWidth={2} dot={false} isAnimationActive={false} />
            
            {/* Visual Pulse Bar for Real-time Feedback */}
            <Bar yAxisId="left" dataKey="latency" name="LATENCY" fill="rgba(248, 245, 236, 0.05)" barSize={4} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="bg-black/40 p-4 rounded border border-white/5 group-hover:border-cyan-500/30 transition-all shadow-inner">
              <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1.5 font-bold">CPU Utilization</p>
              <div className="flex items-baseline gap-2">
                <p className="font-orbitron text-xl text-pearl">{(history[history.length-1]?.cpu || 0).toFixed(1)}<span className="text-[10px] opacity-40 ml-1">%</span></p>
                <span className="text-[8px] font-mono text-cyan-400">NOMINAL</span>
              </div>
          </div>
          <div className="bg-black/40 p-4 rounded border border-white/5 group-hover:border-gold/30 transition-all shadow-inner">
              <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1.5 font-bold">Frame Interval</p>
              <div className="flex items-baseline gap-2">
                <p className="font-orbitron text-xl text-gold">{(history[history.length-1]?.fps || 0)}<span className="text-[10px] opacity-40 ml-1">FPS</span></p>
                <span className={`text-[8px] font-mono ${(history[history.length-1]?.fps || 0) > 55 ? 'text-green-400' : 'text-rose-400'}`}>
                    {(history[history.length-1]?.fps || 0) > 55 ? 'STABLE' : 'DROPPING'}
                </span>
              </div>
          </div>
          <div className="bg-black/40 p-4 rounded border border-white/5 group-hover:border-rose-500/30 transition-all shadow-inner">
              <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1.5 font-bold">Memory Pool</p>
              <div className="flex items-baseline gap-2">
                <p className="font-orbitron text-xl text-rose-400">{performance.memoryUsage.toFixed(1)}<span className="text-[10px] opacity-40 ml-1">GB</span></p>
                <span className="text-[8px] font-mono text-slate-600">USED</span>
              </div>
          </div>
      </div>
    </div>
  );
});
