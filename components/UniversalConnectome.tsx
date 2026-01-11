
import React, { useRef, useEffect } from 'react';
import { OrbMode } from '../types';

interface UniversalConnectomeProps {
    rho: number;
    coherence: number;
    orbMode: OrbMode;
}

export const UniversalConnectome: React.FC<UniversalConnectomeProps> = ({ rho, coherence, orbMode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let time = 0;
        let animationFrame: number;

        // Configuration based on system state
        const getLineColor = () => {
            if (orbMode === 'OFFLINE') return 'rgba(239, 68, 68, 0.1)'; // Red
            if (rho > 0.9) return 'rgba(255, 215, 0, 0.15)'; // Gold
            if (rho < 0.5) return 'rgba(244, 63, 94, 0.1)'; // Rose
            return 'rgba(109, 40, 217, 0.1)'; // Violet
        };

        const render = () => {
            time += 0.005 + (rho * 0.01);
            ctx.clearRect(0, 0, width, height);
            
            const cx = width / 2;
            const cy = height / 2;
            const maxRadius = Math.max(width, height) * 0.6;

            // Draw The Universal Lattice (Spiderweb / Neural Net)
            ctx.strokeStyle = getLineColor();
            ctx.lineWidth = 1;

            const rings = 5;
            const spokes = 12;

            // Rotating Rings
            for (let i = 1; i <= rings; i++) {
                const r = (i / rings) * maxRadius;
                // Add "breathing" effect based on coherence
                const breathe = Math.sin(time * 2 + i) * (50 * (1 - coherence)); 
                const radius = r + breathe;

                ctx.beginPath();
                ctx.arc(cx, cy, Math.max(0, radius), 0, Math.PI * 2);
                ctx.stroke();
                
                // Nodes on rings
                const nodes = 8;
                for(let n = 0; n < nodes; n++) {
                    const theta = (n / nodes) * Math.PI * 2 + time * (i % 2 === 0 ? 1 : -1) * 0.2;
                    const nx = cx + Math.cos(theta) * radius;
                    const ny = cy + Math.sin(theta) * radius;
                    
                    ctx.fillStyle = getLineColor().replace('0.1', '0.4');
                    ctx.beginPath();
                    ctx.arc(nx, ny, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Radial Spokes (Connecting Center to Edge)
            for (let i = 0; i < spokes; i++) {
                const angle = (i / spokes) * Math.PI * 2 + (time * 0.1);
                
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                
                // Distort lines if entropy (low rho) is high
                if (rho < 0.6) {
                    const midX = cx + Math.cos(angle) * (maxRadius * 0.5) + (Math.random() - 0.5) * 20;
                    const midY = cy + Math.sin(angle) * (maxRadius * 0.5) + (Math.random() - 0.5) * 20;
                    ctx.lineTo(midX, midY);
                }
                
                ctx.lineTo(cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius);
                ctx.stroke();
            }

            // Data Packets (Flowing Energy)
            if (orbMode !== 'STANDBY') {
                const packetCount = Math.floor(rho * 20);
                for(let p=0; p<packetCount; p++) {
                    const progress = (time * (1 + p*0.2)) % 1;
                    const ringIndex = (p % rings) + 1;
                    const r = (ringIndex / rings) * maxRadius;
                    const angle = (p / packetCount) * Math.PI * 2 + time;
                    
                    const px = cx + Math.cos(angle) * r;
                    const py = cy + Math.sin(angle) * r;

                    ctx.fillStyle = '#fff';
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrame);
        };
    }, [rho, coherence, orbMode]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-[5] mix-blend-screen transition-opacity duration-1000"
            style={{ opacity: 0.6 }} // Subtle overlay
        />
    );
};
