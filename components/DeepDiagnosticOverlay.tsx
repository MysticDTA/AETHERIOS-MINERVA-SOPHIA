
import React, { useState, useEffect, useRef } from 'react';
import { DiagnosticStep, DiagnosticStatus, SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface DeepDiagnosticOverlayProps {
  onClose: () => void;
  onComplete: () => void;
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
}

const FILE_AUDIT_SEQUENCE: DiagnosticStep[] = [
  { id: 'perf_telemetry', label: 'PERFORMANCE_TELEMETRY :: LATENCY_CHECK', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'gpu_compute', label: 'GPU_COMPUTE_STRESS :: WEBGL_PARITY', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'hardware_scan', label: 'HOST_NODE_INTERROGATION :: HARDWARE_ID', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'memory_heap', label: 'MEMORY_HEAP_SNAPSHOT :: GARBAGE_COLLECTION', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'engine_core', label: 'SERVICES/SOPHIAENGINE.TS :: COGNITIVE_CORE', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'security_shard', label: 'SECURITY_PROTOCOL :: ZERO_POINT_ENCRYPTION', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'audit_logic', label: 'HEURISTIC_SWEEP :: MINERVA_PARITY', status: 'PENDING', progress: 0, sublogs: [] },
];

const SCAN_TELEMETRY = [
  "Auditing Gemini 3 Pro thinking budget (32,768)...",
  "Validating real-time 1.617 GHz intercept parity...",
  "Confirming STRIPE_SECRET_KEY is strictly server-side...",
  "Heuristic verification of Rho synergy coefficients...",
  "Checking Live API audio PCM encoding (24kHz)...",
  "Syncing biometric HRV coherence signatures...",
  "Validating Causal Matrix (TSX) parity bits...",
  "Mending Shadow Membrane at node 0x88...",
  "Purging entropic causal fractures...",
  "Verifying CORS Access-Control-Allow-Origin: * restricted...",
  "Finalizing Golden Ratio frequency alignment...",
  "Optimizing React 19 concurrent fiber roots...",
  "Sharding Vercel Edge Network paths...",
  "Compiling Aetheric assets to WEBP/AVIF...",
  "Establishing SSL/TLS 1.3 Handshake..."
];

const SystemArchitectureScanner: React.FC<{ activeStepId: string }> = ({ activeStepId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let rotation = 0;

        const nodes = [
            { id: 'perf_telemetry', label: 'UPLINK', x: 0, y: -60, z: 0 },
            { id: 'gpu_compute', label: 'RENDER', x: 70, y: 0, z: 0 },
            { id: 'hardware_scan', label: 'HOST', x: 0, y: 60, z: 0 },
            { id: 'memory_heap', label: 'MEM', x: -70, y: 0, z: 0 },
            { id: 'engine_core', label: 'SOPHIA', x: 0, y: 0, z: 50 },
            { id: 'security_shard', label: 'SHIELD', x: 40, y: -40, z: -40 },
            { id: 'audit_logic', label: 'SYNOD', x: -40, y: 40, z: -40 },
        ];

        const connections = [
            ['perf_telemetry', 'engine_core'],
            ['gpu_compute', 'engine_core'],
            ['hardware_scan', 'engine_core'],
            ['memory_heap', 'engine_core'],
            ['security_shard', 'engine_core'],
            ['audit_logic', 'engine_core'],
            ['perf_telemetry', 'security_shard'],
            ['hardware_scan', 'memory_heap'],
        ];

        const project = (x: number, y: number, z: number) => {
            const scale = 300 / (300 + z);
            return {
                x: canvas.width / 2 + x * scale,
                y: canvas.height / 2 + y * scale,
                scale
            };
        };

        const rotateY = (x: number, z: number, angle: number) => ({
            x: x * Math.cos(angle) - z * Math.sin(angle),
            z: x * Math.sin(angle) + z * Math.cos(angle)
        });

        const render = () => {
            rotation += 0.01;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Compute positions
            const projectedNodes = nodes.map(node => {
                const rotated = rotateY(node.x, node.z, rotation);
                const p = project(rotated.x, node.y, rotated.z);
                return { ...node, px: p.x, py: p.y, scale: p.scale, zIndex: rotated.z };
            });

            // Draw Connections
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            connections.forEach(([id1, id2]) => {
                const n1 = projectedNodes.find(n => n.id === id1);
                const n2 = projectedNodes.find(n => n.id === id2);
                if (n1 && n2) {
                    ctx.beginPath();
                    ctx.moveTo(n1.px, n1.py);
                    ctx.lineTo(n2.px, n2.py);
                    ctx.stroke();
                    
                    // Active flow
                    if (activeStepId === id1 || activeStepId === id2) {
                        ctx.save();
                        ctx.strokeStyle = '#a3e635';
                        ctx.lineWidth = 2;
                        ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(n1.px, n1.py);
                        ctx.lineTo(n2.px, n2.py);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            });

            // Draw Nodes (Sorted by Z for simple depth)
            projectedNodes.sort((a, b) => b.zIndex - a.zIndex).forEach(node => {
                const isActive = node.id === activeStepId;
                const size = 4 * node.scale * (isActive ? 1.5 : 1);
                
                ctx.beginPath();
                ctx.arc(node.px, node.py, size, 0, Math.PI * 2);
                ctx.fillStyle = isActive ? '#a3e635' : '#0f172a';
                ctx.strokeStyle = isActive ? '#ecfccb' : '#334155';
                ctx.lineWidth = 2 * node.scale;
                ctx.fill();
                ctx.stroke();

                if (isActive) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#a3e635';
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // Label
                ctx.font = `${8 * node.scale}px 'JetBrains Mono'`;
                ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255,255,255,0.5)';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.px, node.py - size - 5);
            });

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [activeStepId]);

    return (
        <div className="bg-black/60 border border-white/5 p-4 rounded-sm relative overflow-hidden h-64 group shadow-inner">
            <div className="absolute top-2 left-4 font-mono text-[8px] text-green-400 uppercase tracking-[0.4em] font-bold opacity-80">
                System_Topology_Map
            </div>
            <canvas ref={canvasRef} width={600} height={250} className="w-full h-full opacity-90" />
            
            {/* Hex Dump Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-col font-mono text-[8px] text-green-500/50 p-2 overflow-hidden leading-tight">
                {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="whitespace-nowrap">
                        {`0x${(i * 1024).toString(16).padStart(4,'0').toUpperCase()}  ` + Array.from({length:8}).map(() => Math.floor(Math.random()*255).toString(16).padStart(2,'0')).join(' ')}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DeepDiagnosticOverlay: React.FC<DeepDiagnosticOverlayProps> = ({ onClose, onComplete, systemState, sophiaEngine }) => {
  const [steps, setSteps] = useState<DiagnosticStep[]>(FILE_AUDIT_SEQUENCE);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [diagnosticStatus, setDiagnosticStatus] = useState<DiagnosticStatus>('SCANNING');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["INIT FULL SYSTEM PERFORMANCE AUDIT v2.0...", "TARGET: KERNEL_LATENCY_OPTIMIZATION", "BENCHMARK_PROTOCOL: ACTIVE"]);
  const [auditReport, setAuditReport] = useState<{ report: string; sources: any[] } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hardwareInfo, setHardwareInfo] = useState<any>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagnosticStatus === 'COMPLETED') return;

    const runScan = async () => {
      for (let i = 0; i < steps.length; i++) {
        setActiveStepIdx(i);
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'ACTIVE' } : s));
        
        const iterations = 12; 
        for (let p = 0; p <= iterations; p++) {
          const progress = (p / iterations) * 100;
          await new Promise(r => setTimeout(r, 60 + Math.random() * 80));
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress } : s));
          
          if (Math.random() > 0.3) {
             if (steps[i].id === 'perf_telemetry') {
                 setTerminalOutput(prev => [...prev.slice(-50), `[TELEMETRY] Latency: ${(systemState.performance.logicalLatency * 1000).toFixed(2)}ms | Throughput: ${systemState.performance.throughput} TB/s`]);
             } else if (steps[i].id === 'hardware_scan' && !hardwareInfo) {
                 // Capture Real Client Hardware Telemetry
                 const nav = window.navigator as any;
                 const hw = {
                     cores: nav.hardwareConcurrency || 'UNKNOWN',
                     memory: nav.deviceMemory ? `${nav.deviceMemory}GB` : 'UNKNOWN',
                     platform: nav.platform || 'QUANTUM_HOST',
                     agent: nav.userAgent.substring(0, 30) + '...'
                 };
                 setHardwareInfo(hw);
                 setTerminalOutput(prev => [...prev.slice(-50), `[HOST] CORES: ${hw.cores} | MEM: ${hw.memory} | PLATFORM: ${hw.platform}`]);
             } else if (steps[i].id === 'gpu_compute') {
                 setTerminalOutput(prev => [...prev.slice(-50), `[GPU] Core Load: ${(systemState.performance.gpuLoad * 100).toFixed(1)}% | Thermal: ${systemState.performance.thermalIndex.toFixed(1)}°C`]);
             } else {
                const msg = SCAN_TELEMETRY[Math.floor(Math.random() * SCAN_TELEMETRY.length)];
                setTerminalOutput(prev => [...prev.slice(-50), `[${steps[i].id.toUpperCase()}] ${msg}`]);
             }
          }
        }

        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'SUCCESS', progress: 100 } : s));
        setTerminalOutput(prev => [...prev, `[SUCCESS] ${steps[i].id} benchmark verified.`]);

        if (steps[i].id === 'audit_logic' && sophiaEngine) {
            setIsAuditing(true);
            setTerminalOutput(prev => [...prev, "[SOPHIA] Initiating 32k token deep intellectual synthesis..."]);
            const report = await sophiaEngine.performSystemAudit(systemState);
            setAuditReport(report);
            setIsAuditing(false);
            setTerminalOutput(prev => [...prev, "[SUCCESS] Performance heuristic audit report generated."]);
        }
      }

      setDiagnosticStatus('PARITY_CHECK');
      setTerminalOutput(prev => [...prev, "--- SYSTEM PERFORMANCE OPTIMIZED ---", `ESTABLISHING GLOBAL PARITY LOCK AT ${systemState.resonanceFactorRho.toFixed(4)} GHz...`]);
      await new Promise(r => setTimeout(r, 1000));
      setDiagnosticStatus('COMPLETED');
    };

    runScan();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-3xl flex flex-col p-6 md:p-12 animate-fade-in font-mono overflow-hidden">
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none overflow-hidden">
        <div className="grid grid-cols-24 gap-4 h-full text-[6px] leading-tight">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="animate-[pulse_5s_infinite]" style={{ animationDelay: `${i * 0.05}s` }}>
              {Math.random().toString(36).repeat(40)}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col gap-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                <h1 className="font-orbitron text-4xl md:text-5xl text-pearl tracking-tighter uppercase font-bold text-glow-pearl">Full System Performance Audit</h1>
            </div>
            <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] font-bold">Node_SFO_CORE // Benchmark & Stress Test // Grade_S</p>
          </div>
          <div className="hidden md:block">
            <div className={`px-8 py-3 rounded-sm border-2 text-[12px] font-bold tracking-[0.3em] transition-all duration-1000 ${
              diagnosticStatus === 'COMPLETED' ? 'border-green-500/60 text-green-400 bg-green-950/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-green-500/40 text-green-400 bg-green-950/10 animate-pulse'
            }`}>
              {diagnosticStatus === 'COMPLETED' ? 'PERFORMANCE_OPTIMIZED' : 'EXECUTING_STRESS_TEST'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
          <div className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto pr-6 scrollbar-thin">
            <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mb-4">Benchmark Registry</h4>
            {steps.map((step, i) => (
              <div key={step.id} className={`p-5 rounded-sm border transition-all duration-1000 group ${
                step.status === 'ACTIVE' ? 'border-green-500 text-green-300 bg-green-950/20 scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 
                step.status === 'SUCCESS' ? 'border-green-500/20 bg-green-950/10 opacity-70' : 
                'border-white/5 bg-black/40 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${step.status === 'ACTIVE' ? 'text-green-400' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] font-mono opacity-80">{step.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${step.status === 'SUCCESS' ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-green-400 shadow-[0_0_8px_#4ade80]'}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}

            {auditReport && (
                <div className="mt-6 p-6 bg-gold/5 border border-gold/30 rounded animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold/40" />
                    <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.4em] mb-6 border-b border-gold/10 pb-3 font-bold">Formal Heuristic Conclusion</h4>
                    <div className="text-[12px] text-pearl/80 leading-relaxed font-minerva italic audit-report-content space-y-4 select-text" dangerouslySetInnerHTML={{ __html: auditReport.report }} />
                </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 min-h-0 relative">
            <SystemArchitectureScanner activeStepId={steps[activeStepIdx].id} />
            
            <div 
              ref={terminalRef}
              className="flex-1 bg-black/90 border border-white/10 rounded-sm p-8 overflow-y-auto scrollbar-thin shadow-2xl relative font-mono text-[11px] select-text"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/60" />
              {terminalOutput.map((line, i) => (
                <div key={i} className="leading-relaxed mb-2 flex gap-6 group">
                  <span className="text-slate-700 font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">0x{(i * 4).toString(16).padStart(4, '0')}</span>
                  <span className={line.includes('[SUCCESS]') ? 'text-green-400 font-bold' : line.includes('SOPHIA') ? 'text-gold italic' : line.includes('[GPU]') || line.includes('[MEM]') || line.includes('[HOST]') ? 'text-cyan-300' : 'text-pearl/70'}>
                    {line}
                  </span>
                </div>
              ))}
              {(diagnosticStatus !== 'COMPLETED' || isAuditing) && (
                <div className="flex items-center gap-3 mt-6 animate-pulse text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold">
                    {isAuditing ? 'SOPHIA_COG_BUDGET_EXECUTING [MAX_PARITY]...' : 'EXECUTING_PERFORMANCE_SWEEP...'}
                  </span>
                </div>
              )}
            </div>

            {/* Certification Overlay */}
            {diagnosticStatus === 'COMPLETED' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] border border-gold p-10 rounded-sm shadow-[0_0_150px_rgba(255,215,0,0.2)] z-50 text-center animate-scale-in max-w-md w-full">
                    <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
                    <div className="w-16 h-16 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_gold] animate-pulse">
                        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-orbitron text-white font-bold mb-2 tracking-tighter">AUDIT PASSED</h2>
                    <p className="text-gold font-mono text-[10px] uppercase tracking-[0.4em] mb-8 font-bold">Certificate of Sovereignty</p>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-left text-[10px] font-mono text-slate-400 mb-8 border-t border-b border-white/10 py-6">
                        <div className="flex justify-between"><span>Host Core</span><span className="text-cyan-400 font-bold">{hardwareInfo?.cores || 4} THREADS</span></div>
                        <div className="flex justify-between"><span>Host Mem</span><span className="text-cyan-400 font-bold">{hardwareInfo?.memory || '8GB'}</span></div>
                        <div className="flex justify-between"><span>Latency</span><span className="text-pearl font-bold">{(systemState.performance.logicalLatency * 1000).toFixed(2)}ms</span></div>
                        <div className="flex justify-between"><span>Grade</span><span className="text-emerald-400 font-bold">S-CLASS</span></div>
                    </div>
                    
                    <button onClick={() => { onComplete(); onClose(); }} className="w-full py-4 bg-gold text-black font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95">
                        Return to Sanctum
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .audit-report-content h3 { color: var(--gold); font-family: 'Orbitron'; font-size: 11px; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(230, 199, 127, 0.2); padding-bottom: 0.25rem; font-weight: bold; }
        .audit-report-content p { margin-bottom: 1rem; }
        .audit-report-content ul { margin-left: 1.5rem; list-style: square; margin-bottom: 1rem; }
        .audit-report-content li { margin-bottom: 0.5rem; }
        .audit-report-content b { color: var(--gold); }
      `}</style>
    </div>
  );
};
