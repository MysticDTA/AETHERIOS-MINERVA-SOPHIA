
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SystemState, Memory, LogEntry } from '../types';
import { SophiaEngineCore } from '../services/sophiaEngine';

interface NoeticGraphNexusProps {
    systemState: SystemState;
    memories: Memory[];
    logs: LogEntry[];
    sophiaEngine: SophiaEngineCore | null;
}

interface GraphNode {
    id: string;
    label: string;
    type: 'ARCHITECT' | 'MEMORY' | 'LOG' | 'SUBSYSTEM';
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    fullText: string;
    pulsePhase: number;
}

interface GraphLink {
    source: string;
    target: string;
    strength: number;
    label?: string; 
}

export const NoeticGraphNexus: React.FC<NoeticGraphNexusProps> = ({ systemState, memories, logs, sophiaEngine }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Graph State
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [links, setLinks] = useState<GraphLink[]>([]);
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
    const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>([]);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [synthResult, setSynthResult] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const cx = width / 2;
        const cy = height / 2;

        const newNodes: GraphNode[] = [];

        // 1. Central Architect Node
        newNodes.push({
            id: 'ARCHITECT',
            label: 'ARCHITECT_PRIME',
            type: 'ARCHITECT',
            x: cx, y: cy, vx: 0, vy: 0,
            radius: 30,
            color: '#ffd700', 
            fullText: `Operator ID: ${systemState.auth.operatorId}\nClearance: ${systemState.userResources.sovereignTier}`,
            pulsePhase: 0
        });

        // 2. Subsystems
        ['Resonance', 'Uplink', 'Quantum', 'Vocal'].forEach((sys, i) => {
            newNodes.push({
                id: `SYS_${sys}`,
                label: sys.toUpperCase(),
                type: 'SUBSYSTEM',
                x: cx + (Math.random() - 0.5) * 200,
                y: cy + (Math.random() - 0.5) * 200,
                vx: 0, vy: 0,
                radius: 15,
                color: '#67e8f9', 
                fullText: `Subsystem: ${sys}\nStatus: ONLINE`,
                pulsePhase: Math.random() * Math.PI
            });
        });

        // 3. Recent Memories
        memories.slice(0, 8).forEach((mem, i) => {
            newNodes.push({
                id: mem.id,
                label: 'MEMORY_BLOCK',
                type: 'MEMORY',
                x: cx + (Math.random() - 0.5) * 400,
                y: cy + (Math.random() - 0.5) * 400,
                vx: 0, vy: 0,
                radius: 10,
                color: '#a78bfa', 
                fullText: mem.content,
                pulsePhase: Math.random() * Math.PI
            });
        });

        // 4. Logs
        logs.filter(l => l.type !== 'INFO').slice(0, 10).forEach((log, i) => {
            newNodes.push({
                id: log.id,
                label: log.type,
                type: 'LOG',
                x: cx + (Math.random() - 0.5) * 500,
                y: cy + (Math.random() - 0.5) * 500,
                vx: 0, vy: 0,
                radius: 6,
                color: log.type === 'CRITICAL' ? '#f43f5e' : '#94a3b8',
                fullText: log.message,
                pulsePhase: Math.random() * Math.PI
            });
        });

        setNodes(newNodes);
        
        const newLinks: GraphLink[] = newNodes
            .filter(n => n.type === 'SUBSYSTEM')
            .map(n => ({ source: 'ARCHITECT', target: n.id, strength: 0.1 }));
        setLinks(newLinks);

    }, [memories.length, logs.length]); 

    // Physics Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const updatePhysics = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            canvas.width = width;
            canvas.height = height;
            const cx = width / 2;
            const cy = height / 2;

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                
                const dxCenter = cx - node.x;
                const dyCenter = cy - node.y;
                node.vx += dxCenter * 0.0005;
                node.vy += dyCenter * 0.0005;

                for (let j = 0; j < nodes.length; j++) {
                    if (i === j) continue;
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                    const force = 100 / (dist * dist);
                    node.vx += (dx / dist) * force;
                    node.vy += (dy / dist) * force;
                }

                node.vx *= 0.92;
                node.vy *= 0.92;
                node.x += node.vx;
                node.y += node.vy;

                // Quantum Jitter
                node.x += (Math.random() - 0.5) * 0.5;
                node.y += (Math.random() - 0.5) * 0.5;

                node.x = Math.max(20, Math.min(width - 20, node.x));
                node.y = Math.max(20, Math.min(height - 20, node.y));
            }
        };

        const render = () => {
            time += 0.05;
            updatePhysics();
            
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Links
            ctx.lineWidth = 1;
            links.forEach(link => {
                const src = nodes.find(n => n.id === link.source);
                const tgt = nodes.find(n => n.id === link.target);
                if (src && tgt) {
                    ctx.beginPath();
                    ctx.moveTo(src.x, src.y);
                    ctx.lineTo(tgt.x, tgt.y);
                    // Entanglement style line
                    ctx.strokeStyle = link.label ? '#a3e635' : `rgba(255, 255, 255, ${0.1 + Math.sin(time + src.x) * 0.05})`; 
                    ctx.setLineDash(link.label ? [] : [4, 4]);
                    ctx.lineDashOffset = -time * 2;
                    ctx.stroke();
                    ctx.setLineDash([]);

                    if (link.label) {
                        const mx = (src.x + tgt.x) / 2;
                        const my = (src.y + tgt.y) / 2;
                        ctx.fillStyle = '#a3e635';
                        ctx.font = '10px monospace';
                        ctx.fillText('⚡ ENTANGLED', mx, my);
                    }
                }
            });

            // Draw Nodes
            nodes.forEach(node => {
                const isSelected = selectedNodes.some(n => n.id === node.id);
                const isHovered = hoveredNode?.id === node.id;

                const pulse = Math.sin(time + node.pulsePhase) * 2;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + pulse, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                
                ctx.shadowBlur = isSelected ? 30 : isHovered ? 20 : 10;
                ctx.shadowColor = node.color;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Probability cloud ring
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
                ctx.strokeStyle = node.color;
                ctx.globalAlpha = 0.2;
                ctx.stroke();
                ctx.globalAlpha = 1;

                if (isSelected) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                if (node.radius > 10 || isHovered) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '9px "Orbitron"';
                    ctx.textAlign = 'center';
                    ctx.fillText(node.label, node.x, node.y + node.radius + 14);
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [nodes, links, selectedNodes, hoveredNode]);

    const handleCanvasClick = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clicked = nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius + 5);

        if (clicked) {
            setSelectedNodes(prev => {
                if (prev.some(n => n.id === clicked.id)) {
                    return prev.filter(n => n.id !== clicked.id);
                }
                if (prev.length >= 2) return [clicked];
                return [...prev, clicked];
            });
        } else {
            setSelectedNodes([]);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const hovered = nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius + 5);
        setHoveredNode(hovered || null);
    };

    const handleSynthesize = async () => {
        if (selectedNodes.length !== 2 || !sophiaEngine) return;
        setIsSynthesizing(true);
        setSynthResult(null);

        const linkDesc = await sophiaEngine.findCausalLink(selectedNodes[0].fullText, selectedNodes[1].fullText);
        setSynthResult(linkDesc);
        
        setLinks(prev => [...prev, {
            source: selectedNodes[0].id,
            target: selectedNodes[1].id,
            strength: 1,
            label: linkDesc
        }]);

        setIsSynthesizing(false);
    };

    return (
        <div className="w-full h-full flex flex-col animate-fade-in relative bg-[#020202]">
            <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
                <div>
                    <h2 className="font-orbitron text-2xl text-pearl uppercase font-black tracking-tighter text-glow-pearl">Noetic Graph State</h2>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 bg-black/50 px-2 py-1 rounded inline-block">
                        Graph_State_Vector: {nodes.length}Q
                    </p>
                </div>
                <div className="pointer-events-auto flex flex-col gap-2 items-end">
                    <div className="flex gap-2">
                        {selectedNodes.map((n, i) => (
                            <span key={n.id} className="text-[9px] font-mono bg-violet-900/40 text-violet-200 border border-violet-500/30 px-3 py-1 rounded">
                                NODE_{i+1}: {n.label}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={handleSynthesize}
                        disabled={selectedNodes.length !== 2 || isSynthesizing}
                        className={`px-6 py-2 rounded-sm font-orbitron text-[10px] uppercase tracking-[0.2em] border transition-all ${
                            selectedNodes.length === 2 
                            ? 'bg-gold text-black border-gold hover:bg-white hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                            : 'bg-black/40 text-slate-600 border-white/10 cursor-not-allowed'
                        }`}
                    >
                        {isSynthesizing ? 'Entangling...' : 'Synthesize Entanglement'}
                    </button>
                </div>
            </div>

            {synthResult && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 max-w-lg w-full">
                    <div className="bg-black/80 border border-gold/40 p-6 rounded-lg backdrop-blur-xl shadow-[0_0_50px_rgba(230,199,127,0.1)] text-center relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gold shadow-[0_0_10px_gold]" />
                        <span className="text-[8px] font-mono text-gold uppercase tracking-[0.4em] font-bold block mb-3">Discovery Collapsed</span>
                        <p className="font-minerva italic text-lg text-pearl/90 leading-relaxed">
                            "{synthResult}"
                        </p>
                    </div>
                </div>
            )}

            {hoveredNode && !synthResult && (
                <div className="absolute bottom-6 left-6 z-20 max-w-sm pointer-events-none animate-fade-in">
                    <div className="bg-slate-900/90 border border-white/10 p-4 rounded-lg backdrop-blur-md shadow-2xl">
                        <h4 className="text-[10px] font-orbitron text-pearl uppercase font-bold mb-2 tracking-widest border-b border-white/10 pb-2">{hoveredNode.label}</h4>
                        <p className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
                            {hoveredNode.fullText.substring(0, 150)}{hoveredNode.fullText.length > 150 ? '...' : ''}
                        </p>
                    </div>
                </div>
            )}

            <div ref={containerRef} className="flex-1 cursor-crosshair relative z-10">
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-full block"
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                />
            </div>
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
    );
};
