
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
}

interface GraphLink {
    source: string;
    target: string;
    strength: number;
    label?: string; // AI generated label
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

    // Initialize Graph Data from Props
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
            color: '#ffd700', // Gold
            fullText: `Operator ID: ${systemState.auth.operatorId}\nClearance: ${systemState.userResources.sovereignTier}`
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
                color: '#67e8f9', // Cyan
                fullText: `Subsystem: ${sys}\nStatus: ONLINE`
            });
        });

        // 3. Recent Memories (Limit 8)
        memories.slice(0, 8).forEach((mem, i) => {
            newNodes.push({
                id: mem.id,
                label: 'MEMORY_BLOCK',
                type: 'MEMORY',
                x: cx + (Math.random() - 0.5) * 400,
                y: cy + (Math.random() - 0.5) * 400,
                vx: 0, vy: 0,
                radius: 10,
                color: '#a78bfa', // Violet
                fullText: mem.content
            });
        });

        // 4. Recent Logs (Limit 10, filtered for significance)
        logs.filter(l => l.type !== 'INFO').slice(0, 10).forEach((log, i) => {
            newNodes.push({
                id: log.id,
                label: log.type,
                type: 'LOG',
                x: cx + (Math.random() - 0.5) * 500,
                y: cy + (Math.random() - 0.5) * 500,
                vx: 0, vy: 0,
                radius: 6,
                color: log.type === 'CRITICAL' ? '#f43f5e' : '#94a3b8', // Red or Slate
                fullText: log.message
            });
        });

        setNodes(newNodes);
        
        // Initial Links (Star topology from Architect to Subsystems)
        const newLinks: GraphLink[] = newNodes
            .filter(n => n.type === 'SUBSYSTEM')
            .map(n => ({ source: 'ARCHITECT', target: n.id, strength: 0.1 }));
        setLinks(newLinks);

    }, [memories.length, logs.length]); // Re-init on count change

    // Physics Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const updatePhysics = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            canvas.width = width;
            canvas.height = height;
            const cx = width / 2;
            const cy = height / 2;

            // Repulsion & Attraction
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                
                // Pull to center
                const dxCenter = cx - node.x;
                const dyCenter = cy - node.y;
                node.vx += dxCenter * 0.0005;
                node.vy += dyCenter * 0.0005;

                // Repel others
                for (let j = 0; j < nodes.length; j++) {
                    if (i === j) continue;
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                    const force = 100 / (dist * dist); // Inverse square
                    node.vx += (dx / dist) * force;
                    node.vy += (dy / dist) * force;
                }

                // Damping
                node.vx *= 0.92;
                node.vy *= 0.92;
                node.x += node.vx;
                node.y += node.vy;

                // Bounds
                node.x = Math.max(20, Math.min(width - 20, node.x));
                node.y = Math.max(20, Math.min(height - 20, node.y));
            }
        };

        const render = () => {
            updatePhysics();
            
            // Clear
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
                    ctx.strokeStyle = link.label ? '#a3e635' : 'rgba(255, 255, 255, 0.1)'; // Green if synthesized
                    ctx.setLineDash(link.label ? [] : [5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Draw Label if exists
                    if (link.label) {
                        const mx = (src.x + tgt.x) / 2;
                        const my = (src.y + tgt.y) / 2;
                        ctx.fillStyle = '#a3e635';
                        ctx.font = '10px monospace';
                        ctx.fillText('⚡ CAUSAL_LINK', mx, my);
                    }
                }
            });

            // Draw Nodes
            nodes.forEach(node => {
                const isSelected = selectedNodes.some(n => n.id === node.id);
                const isHovered = hoveredNode?.id === node.id;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                
                // Glow
                ctx.shadowBlur = isSelected ? 20 : isHovered ? 15 : 0;
                ctx.shadowColor = node.color;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Selection Ring
                if (isSelected) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Label
                if (node.radius > 10 || isHovered) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '9px "Orbitron"';
                    ctx.textAlign = 'center';
                    ctx.fillText(node.label, node.x, node.y + node.radius + 12);
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [nodes, links, selectedNodes, hoveredNode]);

    // Interaction Handlers
    const handleCanvasClick = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find clicked node
        const clicked = nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius + 5);

        if (clicked) {
            setSelectedNodes(prev => {
                if (prev.some(n => n.id === clicked.id)) {
                    return prev.filter(n => n.id !== clicked.id); // Deselect
                }
                if (prev.length >= 2) {
                    return [clicked]; // Start new selection pair
                }
                return [...prev, clicked];
            });
        } else {
            setSelectedNodes([]); // Click bg clears selection
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
        
        // Add visual link
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
            {/* Header / Controls */}
            <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
                <div>
                    <h2 className="font-orbitron text-2xl text-pearl uppercase font-black tracking-tighter text-glow-pearl">Noetic Causal Graph</h2>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 bg-black/50 px-2 py-1 rounded inline-block">
                        Nodes: {nodes.length} | Links: {links.length}
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
                        {isSynthesizing ? 'Triangulating...' : 'Synthesize Connection'}
                    </button>
                </div>
            </div>

            {/* Synth Result Overlay */}
            {synthResult && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 max-w-lg w-full">
                    <div className="bg-black/80 border border-gold/40 p-6 rounded-lg backdrop-blur-xl shadow-[0_0_50px_rgba(230,199,127,0.1)] text-center relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gold shadow-[0_0_10px_gold]" />
                        <span className="text-[8px] font-mono text-gold uppercase tracking-[0.4em] font-bold block mb-3">Heuristic Discovery</span>
                        <p className="font-minerva italic text-lg text-pearl/90 leading-relaxed">
                            "{synthResult}"
                        </p>
                    </div>
                </div>
            )}

            {/* Hover Tooltip */}
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

            {/* The Graph */}
            <div ref={containerRef} className="flex-1 cursor-crosshair relative z-10">
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-full block"
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                />
            </div>
            
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
    );
};
