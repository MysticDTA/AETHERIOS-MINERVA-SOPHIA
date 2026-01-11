
import React, { useEffect, useState, useRef } from 'react';
import { collaborationService } from '../services/collaborationService';
import { RemoteCursor } from '../types';

const CursorSvg: React.FC<{ color: string; name: string }> = ({ color, name }) => (
    <div className="absolute top-0 left-0 pointer-events-none transition-transform duration-100 ease-linear z-[9999]" style={{ color }}>
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
        >
            <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill={color}
                stroke="white"
                strokeWidth="1"
            />
        </svg>
        <div 
            className="absolute left-4 top-4 px-2 py-1 rounded bg-black/80 border border-white/10 text-[8px] font-mono uppercase tracking-widest whitespace-nowrap backdrop-blur-md shadow-lg"
            style={{ borderColor: color, color: '#fff' }}
        >
            {name}
        </div>
    </div>
);

export const CollaborationOverlay: React.FC = () => {
    const [cursors, setCursors] = useState<RemoteCursor[]>([]);
    
    useEffect(() => {
        // Subscribe to cursor updates
        const unsub = collaborationService.subscribe((activeCursors) => {
            setCursors(activeCursors);
        });

        // Broadcast local movement
        const handleMouseMove = (e: MouseEvent) => {
            collaborationService.broadcastCursor(e.clientX, e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            unsub();
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9000] overflow-hidden">
            {cursors.map((cursor) => (
                <div
                    key={cursor.id}
                    className="absolute transition-all duration-[200ms] ease-out will-change-transform"
                    style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
                >
                    <CursorSvg color={cursor.color} name={cursor.name} />
                </div>
            ))}
        </div>
    );
};
