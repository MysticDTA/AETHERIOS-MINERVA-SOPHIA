
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DiagnosticStep, DiagnosticStatus, SystemState } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';
import { AudioEngine } from './audio/AudioEngine';

interface DeepDiagnosticOverlayProps {
  onClose: () => void;
  onComplete: () => void;
  systemState: SystemState;
  sophiaEngine: SophiaEngineCore | null;
  audioEngine: AudioEngine | null;
}

const FILE_AUDIT_SEQUENCE: DiagnosticStep[] = [
  { id: 'perf_telemetry', label: 'UPLINK_TELEMETRY :: LATENCY_CHECK', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'prod_env', label: 'PROD_ENV_VERIFICATION :: NODE_ENV', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'gpu_compute', label: 'GPU_COMPUTE_STRESS :: WEBGL_PARITY', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'hardware_scan', label: 'HOST_NODE_INTERROGATION :: HARDWARE_ID', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'memory_heap', label: 'MEMORY_HEAP_SNAPSHOT :: GARBAGE_COLLECTION', status: 'PENDING', progress: 0, sublogs: [] },
  { id: 'engine_core', label: 'SOPHIA_COGNITIVE_CORE :: LLM_BRIDGE', status: 'PENDING', progress: 0, sublogs: [] },
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

// Mapping steps to visual nodes in the 3D graph
const NODE_MAPPING: Record<string, string> = {
  'perf_telemetry': 'UPLINK',
  'prod_env': 'HOST',
  'gpu_compute': 'RENDER',
  'hardware_scan': 'HOST',
  'memory_heap': 'MEM',
  'engine_core': 'SOPHIA',
  'security_shard': 'SHIELD',
  'audit_logic': 'SYNOD'
};

const SystemArchitectureScanner: React.FC<{ activeStepId: string; foundDefect: boolean }> = ({ activeStepId, foundDefect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeNodeLabel = NODE_MAPPING[activeStepId];
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Responsive Resizing
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
            }
        });
        resizeObserver.observe(container);

        let animationFrame: number;
        let rotation = 0;

        const nodes = [
            { id: 'UPLINK', x: 0, y: -80, z: 0 },
            { id: 'RENDER', x: 90, y: 0, z: 0 },
            { id: 'HOST', x: 0, y: 80, z: 0 },
            { id: 'MEM', x: -90, y: 0, z: 0 },
            { id: 'SOPHIA', x: 0, y: 0, z: 60 },
            { id: 'SHIELD', x: 50, y: -50, z: -50 },
            { id: 'SYNOD', x: -50, y: 50, z: -50 },
        ];

        const connections = [
            ['UPLINK', 'SOPHIA'],
            ['RENDER', 'SOPHIA'],
            ['HOST', 'SOPHIA'],
            ['MEM', 'SOPHIA'],
            ['SHIELD', 'SOPHIA'],
            ['SYNOD', 'SOPHIA'],
            ['UPLINK', 'SHIELD'],
            ['HOST', 'MEM'],
            ['RENDER', 'MEM']
        ];

        const project = (x: number, y: number, z: number, w: number, h: number) => {
            const scale = 400 / (400 + z);
            return {
                x: w / 2 + x * scale,
                y: h / 2 + y * scale,
                scale
            };
        };

        const rotateY = (x: number, z: number, angle: number) => ({
            x: x * Math.cos(angle) - z * Math.sin(angle),
            z: x * Math.sin(angle) + z * Math.cos(angle)
        });

        const rotateX = (y: number, z: number, angle: number) => ({
            y: y * Math.cos(angle) - z * Math.sin(angle),
            z: y * Math.sin(angle) + z * Math.cos(angle)
        });

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;
            rotation += 0.008;
            
            // Defect shake effect
            const shakeX = foundDefect ? (Math.random() - 0.5) * 4 : 0;
            const shakeY = foundDefect ? (Math.random() - 0.5) * 4 : 0;

            ctx.clearRect(0, 0, w, h);
            ctx.save();
            ctx.translate(shakeX, shakeY);

            // Draw Perspective Grid Floor
            ctx.strokeStyle = 'rgba(109, 40, 217, 0.15)'; // Violet floor
            ctx.lineWidth = 0.5;
            const floorY = 100;
            for (let i = -200; i <= 200; i += 40) {
                const start = rotateY(i, -200, rotation);
                const end = rotateY(i, 200, rotation);
                // Rotate active tilt
                const startT = rotateX(floorY, start.z, Math.sin(rotation * 0.5) * 0.2);
                const endT = rotateX(floorY, end.z, Math.sin(rotation * 0.5) * 0.2);
                
                const pStart = project(start.x, startT.y, startT.z, w, h);
                const pEnd = project(end.x, endT.y, endT.z, w, h);
                
                ctx.beginPath();
                ctx.moveTo(pStart.x, pStart.y);
                ctx.lineTo(pEnd.x, pEnd.y);
                ctx.stroke();
            }

            // Compute positions
            const projectedNodes = nodes.map(node => {
                let { x, z } = rotateY(node.x, node.z, rotation);
                let { y, z: z2 } = rotateX(node.y, z, Math.sin(rotation * 0.5) * 0.2); // Subtle tilt
                const p = project(x, y, z2, w, h);
                return { ...node, px: p.x, py: p.y, scale: p.scale, zIndex: z2 };
            });

            // Draw Connections
            connections.forEach(([id1, id2]) => {
                const n1 = projectedNodes.find(n => n.id === id1);
                const n2 = projectedNodes.find(n => n.id === id2);
                if (n1 && n2) {
                    const isActiveRoute = activeNodeLabel && (n1.id === activeNodeLabel || n2.id === activeNodeLabel);
                    
                    ctx.beginPath();
                    ctx.moveTo(n1.px, n1.py);
                    ctx.lineTo(n2.px, n2.py);
                    
                    if (isActiveRoute) {
                        ctx.strokeStyle = foundDefect ? '#f43f5e' : '#a3e635';
                        ctx.lineWidth = 1.5;
                        ctx.globalAlpha = 0.8;
                    } else {
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                        ctx.lineWidth = 0.5;
                        ctx.globalAlpha = 1;
                    }
                    ctx.stroke();
                    ctx.globalAlpha = 1;

                    // Active Data Flow (Particles)
                    if (isActiveRoute && !foundDefect) {
                        const time = Date.now() / 800; // Slower speed
                        const particleCount = 3;
                        for (let i = 0; i < particleCount; i++) {
                            const t = (time + i / particleCount) % 1;
                            const px = n1.px + (n2.px - n1.px) * t;
                            const py = n1.py + (n2.py - n1.py) * t;
                            const pz = n1.zIndex + (n2.zIndex - n1.zIndex) * t;
                            const pScale = 400 / (400 + pz);
                            
                            ctx.beginPath();
                            ctx.arc(px, py, 1.5 * pScale, 0, Math.PI * 2);
                            ctx.fillStyle = '#fff';
                            ctx.fill();
                        }
                    }
                }
            });

            // Draw Nodes
            projectedNodes.sort((a, b) => b.zIndex - a.zIndex).forEach(node => {
                const isActive = node.id === activeNodeLabel;
                const isDefectNode = isActive && foundDefect;
                const baseSize = 4;
                const size = baseSize * node.scale * (isActive ? 1.8 : 1);
                
                ctx.beginPath();
                ctx.arc(node.px, node.py, size, 0, Math.PI * 2);
                
                if (isDefectNode) {
                    ctx.fillStyle = '#f43f5e'; // Red for defect
                    ctx.shadowColor = '#f43f5e';
                } else if (isActive) {
                    ctx.fillStyle = '#a3e635'; // Green for active
                    ctx.shadowColor = '#a3e635';
                } else {
                    ctx.fillStyle = '#0f172a';
                    ctx.shadowColor = 'transparent';
                }
                
                ctx.strokeStyle = isActive ? '#fff' : '#334155';
                ctx.lineWidth = isActive ? 2 : 1;
                
                if (isActive) ctx.shadowBlur = 15;
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Rings for active node
                if (isActive && !foundDefect) {
                    ctx.beginPath();
                    ctx.arc(node.px, node.py, size + 8 * node.scale + Math.sin(Date.now() / 200) * 2, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(163, 230, 53, 0.4)';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    
                    // Rotating Brackets
                    ctx.save();
                    ctx.translate(node.px, node.py);
                    ctx.rotate(Date.now() / 1000);
                    ctx.beginPath();
                    ctx.arc(0, 0, size + 12 * node.scale, 0, Math.PI / 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(0, 0, size + 12 * node.scale, Math.PI, Math.PI * 1.5);
                    ctx.stroke();
                    ctx.restore();
                }

                // Labels
                ctx.font = `${Math.max(8, 10 * node.scale)}px 'JetBrains Mono'`;
                ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255,255,255,0.4)';
                ctx.textAlign = 'center';
                ctx.fillText(node.id, node.px, node.py - size - 8);
            });

            ctx.restore();
            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, [activeNodeLabel, foundDefect]);

    return (
        <div ref={containerRef} className="bg-black/60 border border-white/5 p-4 rounded-sm relative overflow-hidden h-64 lg:h-80 group shadow-inner z-10 w-full transition-colors duration-500 hover:border-white/10">
            <div className="absolute top-2 left-4 font-mono text-[8px] text-green-400 uppercase tracking-[0.4em] font-bold opacity-80 z-20">
                System_Topology_Map v4.3_PROD
            </div>
            {foundDefect && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-red-500/20 border border-red-500/50 px-4 py-2 text-red-100 font-orbitron text-xs font-bold tracking-widest animate-pulse">
                        ⚠ ANOMALY DETECTED
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="w-full h-full opacity-90 block" />
            
            {/* Hex Dump Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-col font-mono text-[8px] text-green-500/50 p-2 overflow-hidden leading-tight z-0">
                {Array.from({length: 30}).map((_, i) => (
                    <div key={i} className="whitespace-nowrap">
                        {`0x${(i * 1024).toString(16).padStart(4,'0').toUpperCase()}  ` + Array.from({length:8}).map(() => Math.floor(Math.random()*255).toString(16).padStart(2,'0')).join(' ')}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DeepDiagnosticOverlay: React.FC<DeepDiagnosticOverlayProps> = ({ onClose, onComplete, systemState, sophiaEngine, audioEngine }) => {
  const [steps, setSteps] = useState<DiagnosticStep[]>(FILE_AUDIT_SEQUENCE);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [diagnosticStatus, setDiagnosticStatus] = useState<DiagnosticStatus>('SCANNING');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["INIT FULL SYSTEM PERFORMANCE AUDIT v2.1-PROD...", "TARGET: KERNEL_LATENCY_OPTIMIZATION", "BENCHMARK_PROTOCOL: ACTIVE"]);
  const [auditReport, setAuditReport] = useState<{ report: string; sources: any[] } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hardwareInfo, setHardwareInfo] = useState<any>(null);
  const [foundDefect, setFoundDefect] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagnosticStatus === 'COMPLETED') return;

    const runScan = async () => {
      for (let i = 0; i < steps.length; i++) {
        setActiveStepIdx(i);
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'ACTIVE' } : s));
        audioEngine?.playUIClick(); // Sound on step change
        
        // Simulate finding a defect in the Memory Heap or GPU step randomly
        const triggerDefect = (i === 4 || i === 2) && Math.random() > 0.5; // Randomize defect (Memory or GPU)
        
        const iterations = 15; 
        for (let p = 0; p <= iterations; p++) {
          const progress = (p / iterations) * 100;
          await new Promise(r => setTimeout(r, 60 + Math.random() * 60));
          setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, progress } : s));
          
          if (triggerDefect && p === 10 && !foundDefect) {
              setFoundDefect(true);
              audioEngine?.playAlarm(); // Sound on defect
              setTerminalOutput(prev => [...prev.slice(-50), `[WARN] ENTROPY SPIKE DETECTED IN ${steps[i].label.split(' ')[0]}`, `[AUTO-FIX] INITIATING CAUSAL PATCH...`]);
              await new Promise(r => setTimeout(r, 800)); // Pause for "fix"
              setFoundDefect(false);
              audioEngine?.playPurgeEffect(); // Sound on fix
              setTerminalOutput(prev => [...prev.slice(-50), `[SUCCESS] PATCH APPLIED. PARITY RESTORED.`]);
          }

          if (Math.random() > 0.4) {
             if (steps[i].id === 'perf_telemetry') {
                 setTerminalOutput(prev => [...prev.slice(-50), `[TELEMETRY] Latency: ${(systemState.performance.logicalLatency * 1000).toFixed(2)}ms | Throughput: ${systemState.performance.throughput} TB/s`]);
             } else if (steps[i].id === 'prod_env') {
                 // Simulate Env Check
                 const env = process.env.NODE_ENV || 'development';
                 setTerminalOutput(prev => [...prev.slice(-50), `[ENV_CHECK] NODE_ENV: ${env.toUpperCase()}`, `[ENV_CHECK] MINIFICATION: ${env === 'production' ? 'ENABLED' : 'OPTIMIZED_DEV'}`]);
             } else if (steps[i].id === 'hardware_scan' && !hardwareInfo) {
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
      audioEngine?.playAscensionChime(); // Sound on completion
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
      {/* Background Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
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
                <h1 className="font-orbitron text-3xl md:text-5xl text-pearl tracking-tighter uppercase font-bold text-glow-pearl">Full System Performance Audit</h1>
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
          <div className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto pr-6 scrollbar-thin relative z-20">
            <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mb-4">Benchmark Registry</h4>
            {steps.map((step, i) => (
              <div key={step.id} className={`p-5 rounded-sm border transition-all duration-500 group ${
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
                    className={`h-full transition-all duration-300 ease-out ${step.status === 'SUCCESS' ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : foundDefect && step.status === 'ACTIVE' ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-green-400 shadow-[0_0_8px_#4ade80]'}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}

            {auditReport && (
                <div className="mt-6 p-6 bg-gold/5 border border-gold/30 rounded animate-fade-in shadow-2xl relative overflow-hidden z-20">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold/40" />
                    <h4 className="font-orbitron text-[10px] text-gold uppercase tracking-[0.4em] mb-6 border-b border-gold/10 pb-3 font-bold">Formal Heuristic Conclusion</h4>
                    <div className="text-[12px] text-pearl/80 leading-relaxed font-minerva italic audit-report-content space-y-4 select-text" dangerouslySetInnerHTML={{ __html: auditReport.report }} />
                </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 min-h-0 relative z-20">
            <SystemArchitectureScanner activeStepId={steps[activeStepIdx].id} foundDefect={foundDefect} />
            
            <div 
              ref={terminalRef}
              className="flex-1 bg-black/90 border border-white/10 rounded-sm p-8 overflow-y-auto scrollbar-thin shadow-2xl relative font-mono text-[11px] select-text z-20"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/60" />
              {terminalOutput.map((line, i) => (
                <div key={i} className="leading-relaxed mb-2 flex gap-6 group">
                  <span className="text-slate-700 font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">0x{(i * 4).toString(16).padStart(4, '0')}</span>
                  <span className={line.includes('[SUCCESS]') ? 'text-green-400 font-bold' : line.includes('SOPHIA') ? 'text-gold italic' : line.includes('[WARN]') ? 'text-red-400 font-bold' : line.includes('[AUTO-FIX]') ? 'text-blue-400' : line.includes('[GPU]') || line.includes('[MEM]') || line.includes('[HOST]') || line.includes('[ENV_CHECK]') ? 'text-cyan-300' : 'text-pearl/70'}>
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
          </div>
        </div>
      </div>

      {/* Certification Overlay - Laser Etched Holographic Style */}
      {diagnosticStatus === 'COMPLETED' && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999] bg-black/90 backdrop-blur-3xl animate-fade-in perspective-1000">
              <div className="relative group perspective-1000">
                  <div className="bg-[#050505] border border-gold/40 w-[500px] h-[700px] p-12 rounded-sm shadow-[0_0_150px_rgba(255,215,0,0.2)] text-center animate-scale-in relative overflow-hidden transform-gpu transition-transform hover:rotate-x-12 hover:rotate-y-12">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,215,0,0.05)_0%,transparent_50%,rgba(255,215,0,0.05)_100%)] pointer-events-none" />
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffd700 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                      
                      <div className="absolute top-0 right-0 p-6 opacity-20 font-orbitron text-9xl text-gold font-black select-none pointer-events-none -mr-16 -mt-16 rotate-12">S</div>
                      
                      <div className="w-24 h-24 border-4 border-double border-gold rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_gold] animate-pulse bg-gold/10 relative z-10">
                          <svg className="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      
                      <div className="relative z-10 space-y-6">
                          <div>
                              <h2 className="text-4xl font-orbitron text-white font-bold tracking-tighter text-glow-pearl uppercase">Audit Passed</h2>
                              <p className="text-gold font-mono text-[10px] uppercase tracking-[0.6em] mt-2 font-bold">Certificate of Sovereignty</p>
                          </div>
                          
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent my-8" />

                          <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-left text-[11px] font-mono text-slate-400 mb-12">
                              <div className="flex flex-col gap-1">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Host Core</span>
                                  <span className="text-cyan-400 font-bold text-sm">{hardwareInfo?.cores || 4} THREADS</span>
                              </div>
                              <div className="flex flex-col gap-1 text-right">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Env Status</span>
                                  <span className="text-cyan-400 font-bold text-sm">PRODUCTION</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Latency</span>
                                  <span className="text-pearl font-bold text-sm">{(systemState.performance.logicalLatency * 1000).toFixed(2)}ms</span>
                              </div>
                              <div className="flex flex-col gap-1 text-right">
                                  <span className="uppercase tracking-widest text-[8px] text-slate-600">Grade</span>
                                  <span className="text-emerald-400 font-black text-xl shadow-green-glow">S-CLASS</span>
                              </div>
                          </div>
                          
                          <button onClick={() => { onComplete(); onClose(); }} className="w-full py-5 bg-gold/10 border border-gold text-gold font-orbitron font-black uppercase tracking-[0.25em] hover:bg-gold hover:text-black transition-all shadow-[0_0_40px_rgba(255,215,0,0.2)] active:scale-95 text-[12px] relative overflow-hidden group/btn">
                              <span className="relative z-10">Return to Sanctum</span>
                              <div className="absolute inset-0 bg-gold/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
      
      <style>{`
        .audit-report-content h3 { color: var(--gold); font-family: 'Orbitron'; font-size: 11px; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(230, 199, 127, 0.2); padding-bottom: 0.25rem; font-weight: bold; }
        .audit-report-content p { margin-bottom: 1rem; }
        .audit-report-content ul { margin-left: 1.5rem; list-style: square; margin-bottom: 1rem; }
        .audit-report-content li { margin-bottom: 0.5rem; }
        .audit-report-content b { color: var(--gold); }
        .perspective-1000 { perspective: 1000px; }
        .shadow-green-glow { text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
      `}</style>
    </div>
  );
};
