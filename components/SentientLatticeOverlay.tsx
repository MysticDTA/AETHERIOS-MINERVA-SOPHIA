
import React, { useEffect, useRef } from 'react';
import { OrbMode } from '../types';

interface SentientLatticeOverlayProps {
    orbMode: OrbMode;
    rho: number; // Resonance factor (0-1)
    coherence: number; // Biometric coherence (0-1)
}

const MODE_COLORS: Record<OrbMode, string> = {
    STANDBY: '#ffd700',   // Gold
    ANALYSIS: '#a78bfa',  // Violet
    SYNTHESIS: '#f472b6', // Pink
    REPAIR: '#2dd4bf',    // Teal
    GROUNDING: '#fb923c', // Orange
    CONCORDANCE: '#60a5fa', // Blue
    OFFLINE: '#334155'    // Slate
};

export const SentientLatticeOverlay: React.FC<SentientLatticeOverlayProps> = ({ orbMode, rho, coherence }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Node initialization
        const nodeCount = Math.floor((width * height) / 25000); // Responsive density
        const nodes: { x: number; y: number; vx: number; vy: number; radius: number; phase: number }[] = [];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            // System State Influences
            const activeColor = MODE_COLORS[orbMode];
            const jitter = (1 - rho) * 2; // More jitter at low resonance
            const connectionDistance = 120 + coherence * 50; // Longer connections at high coherence
            const speedMultiplier = 0.5 + rho * 0.5;

            ctx.fillStyle = activeColor;
            ctx.strokeStyle = activeColor;

            nodes.forEach((node, i) => {
                // Physics Update
                node.x += node.vx * speedMultiplier + (Math.random() - 0.5) * jitter;
                node.y += node.vy * speedMultiplier + (Math.random() - 0.5) * jitter;

                // Mouse Interaction (Gravity Well)
                const dx = mouseRef.current.x - node.x;
                const dy = mouseRef.current.y - node.y;
                const distMouse = Math.sqrt(dx * dx + dy * dy);
                if (distMouse < 200) {
                    node.x += dx * 0.02;
                    node.y += dy * 0.02;
                }

                // Bounce off edges
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                // Pulse Effect
                node.phase += 0.05;
                const visualRadius = node.radius + Math.sin(node.phase) * 0.5;

                // Draw Node
                ctx.globalAlpha = 0.3 + (rho * 0.4);
                ctx.beginPath();
                ctx.arc(node.x, node.y, Math.max(0.1, visualRadius), 0, Math.PI * 2);
                ctx.fill();

                // Draw Connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dX = node.x - other.x;
                    const dY = node.y - other.y;
                    const dist = Math.sqrt(dX * dX + dY * dY);

                    if (dist < connectionDistance) {
                        ctx.globalAlpha = (1 - dist / connectionDistance) * 0.15 * rho;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
                
                // Draw Mouse Connection
                if (distMouse < 150) {
                    ctx.globalAlpha = (1 - distMouse / 150) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                    ctx.stroke();
                }
            });

            animationFrame = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [orbMode, rho, coherence]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000" style={{ opacity: 0.6 }} />;
};
