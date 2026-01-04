
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
  latency: number;
  throughput: number;
  gpu: number;
  memory: number;
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = React.memo(({ performance }) => {
  const [history, setHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newPoint: DataPoint = {
      time: timeStr,
      latency: performance.logicalLatency * 1000, 
      throughput: performance.throughput,
      gpu: performance.gpuLoad * 100,
      memory: performance.memoryUsage
    };

    setHistory(prev => {
      const next = [...prev, newPoint];
      // Restricted to 15 points for visual clarity and performance efficiency
      if (next.length > 15) return next.slice(1);
      return next;
    });
  }, [performance.logicalLatency, performance.throughput, performance.gpuLoad, performance.memoryUsage]);

  return (
    <div className="w-full bg-black/40 border border-white/5 p-6 rounded-xl flex flex-col gap-6 shadow-inner relative overflow-hidden group gpu-accel">
      <div className="absolute top-0 right-0 p-3 opacity-[0.02] font-orbitron text-7xl uppercase font-bold tracking-tighter select-none pointer-events-none">TELEMETRY</div>
      
      <div className="flex justify-between items-center z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-4 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <h3 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.4em] font-bold">Systemic Telemetry Stream</h3>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Throughput</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Latency</span>
           </div>
        </div>
      </div>

      <div className="h-48 w-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={history}>
            <defs>
              <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis yAxisId="left" orientation="left" stroke="#22d3ee" fontSize={8} tickFormatter={(val) => `${val.toFixed(0)}`} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#ffd700" fontSize={8} tickFormatter={(val) => `${val.toFixed(2)}`} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(8, 8, 8, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
              itemStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
              labelStyle={{ display: 'none' }}
              isAnimationActive={false}
            />
            <Area yAxisId="left" type="monotone" dataKey="throughput" stroke="#22d3ee" fillOpacity={1} fill="url(#colorThroughput)" strokeWidth={1.5} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#ffd700" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <Bar yAxisId="left" dataKey="gpu" fill="rgba(248, 245, 236, 0.05)" barSize={8} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="bg-black/20 p-2.5 rounded border border-white/5">
              <p className="text-[7px] text-slate-500 uppercase tracking-tighter mb-1">Peak Throughput</p>
              <p className="font-orbitron text-xs text-pearl">{(Math.max(...history.map(d => d.throughput), 0)).toFixed(1)} <span className="text-[7px] opacity-40">GB/s</span></p>
          </div>
          <div className="bg-black/20 p-2.5 rounded border border-white/5">
              <p className="text-[7px] text-slate-500 uppercase tracking-tighter mb-1">Avg Latency</p>
              <p className="font-orbitron text-xs text-gold">{(history.reduce((acc, d) => acc + d.latency, 0) / Math.max(1, history.length)).toFixed(3)} <span className="text-[7px] opacity-40">ms</span></p>
          </div>
          <div className="bg-black/20 p-2.5 rounded border border-white/5">
              <p className="text-[7px] text-slate-500 uppercase tracking-tighter mb-1">Memory Usage</p>
              <p className="font-orbitron text-xs text-cyan-400">{performance.memoryUsage.toFixed(1)} <span className="text-[7px] opacity-40">GB</span></p>
          </div>
          <div className="bg-black/20 p-2.5 rounded border border-white/5">
              <p className="text-[7px] text-slate-500 uppercase tracking-tighter mb-1">Load Balance</p>
              <p className="font-orbitron text-xs text-pearl">{(performance.gpuLoad * 100).toFixed(2)} <span className="text-[7px] opacity-40">%</span></p>
          </div>
      </div>
    </div>
  );
});
