
import React, { useRef, useEffect, useState } from 'react';
import { SystemState } from '../types';
import { AudioEngine } from './audio/AudioEngine';

interface EntropicStreamLoomProps {
    entropy: number;
    onStabilize: (amount: number) => void;
    audioEngine?: AudioEngine | null;
}

interface Thread {
    baseX: number;
    currentX: number;
    velocity: number;
    tension: number;
    friction: number;
    color: string;
    amplitude: number;
    phase: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

export const EntropicStreamLoom: React.FC<EntropicStreamLoomProps> = ({ entropy, onStabilize, audioEngine }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isInteracting, setIsInteracting] = useState(false);
    
    // Physics State
    const threadsRef = useRef<Thread[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
    const isDragging = useRef(false);

    // Initialize Threads
    useEffect(() => {
        const count = 45; // Increased density for high-fidelity look
        const threads: Thread[] = [];
        for(let i=0; i<count; i++) {
            threads.push({
                baseX: 0, // Set in render
                currentX: 0,
                velocity: 0,
                tension: 0.05 + Math.random() * 0.05,
                friction: 0.92, // Smoother damping
                color: '#4b5563', // Default slate
                amplitude: 0,
                phase: Math.random() * Math.PI * 2
            });
        }
        threadsRef.current = threads;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency on canvas bg
        if (!ctx) return;

        let animationFrame: number;
        let time = 0;

        const render = () => {
            time += 0.05;
            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;
            const gap = width / (threadsRef.current.length + 1);

            // Clear with trail for motion blur effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.4)'; 
            ctx.fillRect(0, 0, width, height);

            // Mouse Interaction Physics
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const mdx = mx - mouseRef.current.px; // Mouse delta X
            
            // Render Threads
            threadsRef.current.forEach((t, i) => {
                const x = (i + 1) * gap;
                t.baseX = x;

                // 1. External Entropy Force (Chaos)
                // If not interacting, entropy adds chaotic energy
                const chaos = Math.sin(time + t.phase) * (entropy * 60); 
                
                // 2. Mouse Interaction (The "Comb")
                let force = 0;
                if (isDragging.current) {
                    const dist = Math.abs(mx - t.currentX);
                    // UX Optimization: Widen interaction radius to 60px for easier "grabbing"
                    if (dist < 60) {
                        const influence = (1 - dist / 60);
                        force = mdx * influence * 0.8;
                        
                        // "Smoothing" effect: Reduce inherent amplitude when touched
                        t.amplitude *= 0.9;
                        
                        // Spawn particles on high-velocity interaction
                        if (Math.abs(mdx) > 3 && Math.random() > 0.85) {
                            particlesRef.current.push({
                                x: t.currentX,
                                y: my + (Math.random() - 0.5) * 20,
                                vx: (Math.random() - 0.5) * 4 + mdx * 0.2,
                                vy: (Math.random() - 0.5) * 4,
                                life: 1.0,
                                color: '#ffd700'
                            });
                            // Trigger stabilization callback occasionally
                            if (Math.random() > 0.9) onStabilize(0.005);
                        }
                    }
                }

                // 3. Physics Integration
                const acceleration = (t.baseX + chaos - t.currentX) * t.tension + force;
                t.velocity += acceleration;
                t.velocity *= t.friction;
                t.currentX += t.velocity;

                // 4. Visuals
                // Color based on velocity (Stability)
                const speed = Math.abs(t.velocity);
                let color = '#4b5563'; // Slate (Stable)
                if (speed > 5) color = '#f43f5e'; // Red (Chaotic)
                else if (speed > 2) color = '#a78bfa'; // Violet (Active)
                else if (speed < 0.5 && entropy < 0.1) color = '#ffd700'; // Gold (Harmonic)

                ctx.beginPath();
                ctx.moveTo(t.currentX, 0);
                
                // Bezier curve for organic tension feel
                const cp1x = t.currentX + (t.velocity * 12);
                const cp1y = height / 3;
                const cp2x = t.currentX - (t.velocity * 12);
                const cp2y = (height / 3) * 2;
                
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.currentX, height);
                
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                
                // Performance: Only apply shadow blur if thread is active or entropy is high
                if (speed > 2 || entropy > 0.2) {
                    ctx.shadowBlur = speed * 1.5;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.stroke();
            });

            // Render Particles - Optimized Loop
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.04;
                
                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Update Mouse History
            mouseRef.current.px = mx;
            mouseRef.current.py = my;

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [entropy, onStabilize]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        }
    };

    return (
        <div className="w-full h-full bg-dark-surface/50 border border-dark-border/50 p-4 rounded-lg border-glow-gold backdrop-blur-sm flex flex-col relative group">
            <div className="flex justify-between items-center mb-2 z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isInteracting ? 'bg-gold animate-ping' : 'bg-slate-600'}`} />
                    <h3 className="font-orbitron text-md text-warm-grey">Causal Entropic Loom</h3>
                </div>
                <span className={`font-mono text-xs ${entropy > 0.3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ENTROPY: {(entropy * 100).toFixed(1)}%
                </span>
            </div>

            <div 
                className="flex-1 relative bg-black/40 rounded-lg overflow-hidden border border-white/5 cursor-col-resize shadow-inner transition-colors duration-300 hover:border-gold/30"
                onMouseDown={() => { isDragging.current = true; setIsInteracting(true); audioEngine?.playEffect('synthesis'); }}
                onMouseUp={() => { isDragging.current = false; setIsInteracting(false); }}
                onMouseLeave={() => { isDragging.current = false; setIsInteracting(false); }}
                onMouseMove={handleMouseMove}
            >
                <canvas ref={canvasRef} className="w-full h-full block" />
                
                {/* Instruction Overlay */}
                {!isInteracting && entropy > 0.2 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.4em] opacity-60 animate-pulse bg-black/50 px-3 py-1 rounded">
                            Drag to Smooth Causal Threads
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-2 text-center">
                <p className="text-[9px] font-minerva italic text-slate-500">
                    "Manually dampen the vibration of the reality lattice to reduce system noise."
                </p>
            </div>
        </div>
    );
};
