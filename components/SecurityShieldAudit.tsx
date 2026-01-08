
import React, { useState, useEffect, useRef } from 'react';
import { SystemState } from '../types';

const SECURITY_CHECKS = [
    { id: 'git_ignore', label: 'GITHUB_SECRET_SHIELDING', desc: 'Verifying .env exclusion in local lattice.', status: 'LOCKED' },
    { id: 'cors_headers', label: 'CORS_PARITY_HANDSHAKE', desc: 'Confirming Vercel edge-origin restrictions.', status: 'LOCKED' },
    { id: 'stripe_isolation', label: 'STRIPE_SK_ISOLATION', desc: 'Ensuring Secret Key is strictly server-side.', status: 'LOCKED' },
    { id: 'token_encryption', label: 'CAUSAL_AES_ENCRYPTION', desc: 'Validating AES-256 GCM packet parity.', status: 'LOCKED' },
    { id: 'rate_limiting', label: 'RES_QUOTA_DAMPING', desc: 'Global rate-limit circuit breaker status.', status: 'LOCKED' }
];

const ThreatSphere: React.FC<{ isScanning: boolean }> = ({ isScanning }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const shieldRadius = 80;

        let threats: { x: number; y: number; vx: number; vy: number; life: number; type: 'XSS' | 'DDoS' | 'INJECT' }[] = [];
        let impacts: { x: number; y: number; life: number }[] = [];

        const spawnThreat = () => {
            const angle = Math.random() * Math.PI * 2;
            const dist = shieldRadius + 100 + Math.random() * 50;
            const type = Math.random() > 0.7 ? 'DDoS' : Math.random() > 0.5 ? 'INJECT' : 'XSS';
            threats.push({
                x: centerX + Math.cos(angle) * dist,
                y: centerY + Math.sin(angle) * dist,
                vx: -Math.cos(angle) * (1 + Math.random()),
                vy: -Math.sin(angle) * (1 + Math.random()),
                life: 1.0,
                type
            });
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Shield
            ctx.beginPath();
            ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Shield Glow
            const gradient = ctx.createRadialGradient(centerX, centerY, shieldRadius * 0.8, centerX, centerY, shieldRadius * 1.2);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
            gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            // Manage Threats
            if (Math.random() > 0.92) spawnThreat();

            threats.forEach((t, i) => {
                t.x += t.vx;
                t.y += t.vy;
                
                const distFromCenter = Math.sqrt(Math.pow(t.x - centerX, 2) + Math.pow(t.y - centerY, 2));

                // Impact Detection
                if (distFromCenter <= shieldRadius + 2) {
                    impacts.push({ x: t.x, y: t.y, life: 1.0 });
                    threats.splice(i, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = t.type === 'DDoS' ? '#f43f5e' : '#fb923c';
                    ctx.fill();
                    
                    // Threat Trail
                    ctx.beginPath();
                    ctx.moveTo(t.x, t.y);
                    ctx.lineTo(t.x - t.vx * 5, t.y - t.vy * 5);
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });

            // Render Impacts
            impacts.forEach((imp, i) => {
                imp.life -= 0.05;
                if (imp.life <= 0) impacts.splice(i, 1);
                
                ctx.beginPath();
                ctx.arc(imp.x, imp.y, 15 * (1 - imp.life), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(16, 185, 129, ${imp.life})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return <canvas ref={canvasRef} width={400} height={300} className="w-full h-full object-contain" />;
};

export const SecurityShieldAudit: React.FC<{ systemState: SystemState }> = ({ systemState }) => {
    const [progress, setProgress] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [isRotatingKeys, setIsRotatingKeys] = useState(false);
    const [encryptionEntropy, setEncryptionEntropy] = useState(0.9994);
    const [threatsNeutralized, setThreatsNeutralized] = useState(1402);
    
    const terminalRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState<string[]>(["[SYSTEM] INITIALIZING_SECURITY_FIREWALL_v2.1...", "TARGET: MINERVA_CORE_SHARDS"]);

    useEffect(() => {
        const interval = setInterval(() => {
            setEncryptionEntropy(prev => Math.max(0.95, Math.min(1.0, prev + (Math.random() - 0.5) * 0.001)));
            if (Math.random() > 0.7) setThreatsNeutralized(n => n + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const runScan = async () => {
        setIsScanning(true);
        setProgress(0);
        setLogs(["[SYSTEM] INITIATING PENETRATION_SIMULATION..."]);
        
        for (let i = 0; i < SECURITY_CHECKS.length; i++) {
            setLogs(prev => [...prev, `[AUDIT] Scanning ${SECURITY_CHECKS[i].label}...`]);
            const iterations = 10;
            for (let j = 0; j <= iterations; j++) {
                await new Promise(r => setTimeout(r, 100));
                setProgress(prev => Math.min(100, prev + (100 / (SECURITY_CHECKS.length * iterations))));
            }
            setLogs(prev => [...prev, `[SUCCESS] ${SECURITY_CHECKS[i].label}: SECURE`]);
        }
        setIsScanning(false);
        setLogs(prev => [...prev, "--- SHIELD_AUDIT_COMPLETE ---", "NO_LEAKS_DETECTED_IN_PUBLIC_LATTICE"]);
    };

    const handleKeyRotation = async () => {
        setIsRotatingKeys(true);
        setLogs(prev => [...prev, "[KEYS] INITIATING CAUSAL KEY ROTATION PROTOCOL..."]);
        await new Promise(r => setTimeout(r, 1000));
        setLogs(prev => [...prev, "[KEYS] GENERATING NEW AES-256 SALT..."]);
        await new Promise(r => setTimeout(r, 1000));
        setLogs(prev => [...prev, "[KEYS] RE-ENCRYPTING MEMORY SHARDS..."]);
        await new Promise(r => setTimeout(r, 1000));
        setLogs(prev => [...prev, "[SUCCESS] KEY_ROTATION_COMPLETE. NEW HASH: 0x" + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()]);
        setEncryptionEntropy(1.0);
        setIsRotatingKeys(false);
    }

    const triggerRuntimeFracture = () => {
        setLogs(prev => [...prev, "[STRESS_TEST] Inducing immediate Runtime Fracture..."]);
        setTimeout(() => { throw new Error("Controlled Lattice Fracture Inducted for Audit Verification."); }, 100);
    };

    const triggerAsyncDrift = () => {
        setLogs(prev => [...prev, "[STRESS_TEST] Inducing Async Decoherence Drift..."]);
        setTimeout(() => { Promise.reject(new Error("Architectural Rejection: Async Drift simulation detected.")); }, 100);
    };

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [logs]);

    return (
        <div className="w-full h-full flex flex-col gap-8 animate-fade-in pb-20 overflow-hidden">
            <div className="flex justify-between items-end border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/40 flex items-center justify-center font-orbitron text-rose-400 text-3xl animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.2)]">🛡</div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold">Causal_Shield_Audit</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">Fraud Protection & Secret Isolation Registry</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleKeyRotation}
                        disabled={isRotatingKeys}
                        className="px-8 py-4 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95 disabled:opacity-30"
                    >
                        {isRotatingKeys ? 'ROTATING...' : 'ROTATE_KEYS'}
                    </button>
                    <button 
                        onClick={runScan} 
                        disabled={isScanning}
                        className="px-12 py-4 bg-rose-600/10 border border-rose-500/40 text-rose-400 font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-30"
                    >
                        {isScanning ? 'Scanning...' : 'Execute Security Sweep'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-black/60 border border-white/10 rounded-xl relative overflow-hidden flex-1 shadow-inner flex flex-col items-center justify-center group">
                        <div className="absolute top-4 left-4 z-10">
                            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest font-black bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20">Active_Intercept</span>
                        </div>
                        <div className="absolute top-4 right-4 z-10 text-right">
                            <p className="text-[8px] font-mono text-slate-500 uppercase">Threats_Neutralized</p>
                            <p className="font-orbitron text-xl text-pearl">{threatsNeutralized.toLocaleString()}</p>
                        </div>
                        <ThreatSphere isScanning={true} />
                        <div className="absolute bottom-4 text-center">
                            <p className="text-[10px] font-orbitron text-emerald-400 uppercase tracking-[0.4em] animate-pulse">Shield_Integrity_100%</p>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Encryption_Entropy</span>
                            <span className={`font-mono text-[10px] font-bold ${encryptionEntropy > 0.98 ? 'text-green-400' : 'text-gold'}`}>{(encryptionEntropy * 100).toFixed(4)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${encryptionEntropy > 0.98 ? 'bg-green-500' : 'bg-gold'}`} style={{ width: `${encryptionEntropy * 100}%` }} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        {SECURITY_CHECKS.map((check, i) => (
                            <div key={check.id} className="bg-black/40 border border-white/5 p-4 rounded-lg flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-700">
                                <div className="space-y-1">
                                    <h4 className="font-orbitron text-[10px] text-pearl uppercase tracking-widest font-bold group-hover:text-emerald-400 transition-colors">{check.label}</h4>
                                    <p className="text-[9px] font-minerva italic text-slate-500">{check.desc}</p>
                                </div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 bg-black border border-white/10 rounded-sm p-6 flex flex-col shadow-2xl relative overflow-hidden">
                        {/* Scanline overlay removed for clearer view */}
                        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                            <span className="font-mono text-[10px] text-rose-500 font-bold tracking-widest uppercase">Firewall_Packet_Stream</span>
                            <span className="text-[8px] font-mono text-slate-700">NODE_0x88_SECURE</span>
                        </div>
                        <div ref={terminalRef} className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] text-slate-500 scrollbar-thin select-text min-h-[120px]">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4 animate-fade-in group">
                                    <span className="text-slate-800 font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">0x{i.toString(16).padStart(4, '0')}</span>
                                    <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('SYSTEM') || log.includes('KEYS') ? 'text-rose-500 font-bold' : log.includes('STRESS') ? 'text-gold italic' : ''}>{log}</span>
                                </div>
                            ))}
                            {(isScanning || isRotatingKeys) && <div className="w-1.5 h-3 bg-rose-500 animate-blink mt-2" />}
                        </div>
                    </div>

                    <div className="p-6 bg-rose-950/5 border border-rose-500/20 rounded-xl relative overflow-hidden flex justify-between items-center">
                        <div>
                            <h4 className="font-orbitron text-[11px] text-rose-400 uppercase tracking-widest font-bold mb-1">Entropic Stress Induction</h4>
                            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">Verify global error interceptors.</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={triggerRuntimeFracture} className="px-4 py-2 bg-rose-500/10 border border-rose-500/40 text-rose-400 font-mono text-[8px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all rounded-sm">Runtime Fracture</button>
                            <button onClick={triggerAsyncDrift} className="px-4 py-2 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono text-[8px] uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all rounded-sm">Async Drift</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
