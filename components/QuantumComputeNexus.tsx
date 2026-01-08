
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SystemState } from '../types';
import { Tooltip } from './Tooltip';

interface QuantumComputeNexusProps {
    systemState: SystemState;
}

// --- QUANTUM MATH KERNEL ---
type Complex = { r: number; i: number };
const C = (r: number, i: number = 0): Complex => ({ r, i });
const add = (a: Complex, b: Complex): Complex => ({ r: a.r + b.r, i: a.i + b.i });
const mul = (a: Complex, b: Complex): Complex => ({ r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r });
const magSq = (a: Complex): number => a.r * a.r + a.i * a.i;
const conj = (a: Complex): Complex => ({ r: a.r, i: -a.i });

// State Vector: [c00, c01, c10, c11]
type StateVector = [Complex, Complex, Complex, Complex];
const ZERO_STATE: StateVector = [C(1), C(0), C(0), C(0)];

// Gates (4x4 Matrices)
// We treat the system as a 4-vector.
// 1-qubit gates are expanded via Kronecker product: G on Q0 -> G (x) I, G on Q1 -> I (x) G
const SQRT2_INV = 1 / Math.sqrt(2);

const applyGate = (state: StateVector, gate: string, target: 0 | 1): StateVector => {
    const s = state;
    const ns: StateVector = [C(0), C(0), C(0), C(0)];

    // Helper: Apply matrix to vector indices
    const apply2x2 = (indices: [number, number], mat: [[Complex, Complex], [Complex, Complex]]) => {
        const [i0, i1] = indices;
        const v0 = s[i0];
        const v1 = s[i1];
        ns[i0] = add(mul(mat[0][0], v0), mul(mat[0][1], v1));
        ns[i1] = add(mul(mat[1][0], v0), mul(mat[1][1], v1));
    };

    if (gate === 'CNOT') {
        // CNOT 0->1: |00>->|00>, |01>->|01>, |10>->|11>, |11>->|10>
        if (target === 1) { // Control 0, Target 1
            ns[0] = s[0]; ns[1] = s[1]; ns[2] = s[3]; ns[3] = s[2];
        } else { // Control 1, Target 0: |00>->|00>, |01>->|11>, |10>->|10>, |11>->|01>
            ns[0] = s[0]; ns[1] = s[3]; ns[2] = s[2]; ns[3] = s[1];
        }
        return ns;
    }

    // Single Qubit Gates
    let mat: [[Complex, Complex], [Complex, Complex]];
    switch(gate) {
        case 'H': mat = [[C(SQRT2_INV), C(SQRT2_INV)], [C(SQRT2_INV), C(-SQRT2_INV)]]; break;
        case 'X': mat = [[C(0), C(1)], [C(1), C(0)]]; break;
        case 'Z': mat = [[C(1), C(0)], [C(0), C(-1)]]; break;
        case 'S': mat = [[C(1), C(0)], [C(0), C(0, 1)]]; break; // Phase gate
        default: mat = [[C(1), C(0)], [C(0), C(1)]]; // Identity
    }

    if (target === 0) { // Q0 is MSB in |Q0 Q1> convention usually, but let's stick to tensor product Q0 (x) Q1.
        // If Q0 is first qubit (index 0 in tensor):
        // |0> state corresponds to index 0,1 (Q0=0)
        // |1> state corresponds to index 2,3 (Q0=1)
        // We apply gate to pairs (0,2) and (1,3)
        apply2x2([0, 2], mat);
        apply2x2([1, 3], mat);
    } else { // Q1
        // Apply to pairs (0,1) and (2,3)
        apply2x2([0, 1], mat);
        apply2x2([2, 3], mat);
    }
    return ns;
};

// --- DENSITY MATRIX UTILS ---
// Calculate reduced density matrix for a qubit to visualize on Bloch sphere
// Returns Bloch vector [x, y, z]
const getBlochVector = (sv: StateVector, qubit: 0 | 1): [number, number, number] => {
    // Density Matrix rho = |psi><psi|
    // rho_ij = c_i * conj(c_j)
    
    // Partial trace
    let rho_red: [[Complex, Complex], [Complex, Complex]];
    
    if (qubit === 0) { // Trace out Q1 (sum over indices 0,1 and 2,3 relative to Q1's basis)
        // Basis Q0: |0> is indices 0,1; |1> is indices 2,3
        // rho_00 = |c00|^2 + |c01|^2
        // rho_01 = c00*c10* + c01*c11*
        // rho_10 = c10*c00* + c11*c01*
        // rho_11 = |c10|^2 + |c11|^2
        rho_red = [
            [C(magSq(sv[0]) + magSq(sv[1])), add(mul(sv[0], conj(sv[2])), mul(sv[1], conj(sv[3])))],
            [add(mul(sv[2], conj(sv[0])), mul(sv[3], conj(sv[1]))), C(magSq(sv[2]) + magSq(sv[3]))]
        ];
    } else { // Trace out Q0
        // Basis Q1: |0> is 0,2; |1> is 1,3
        // rho_00 = |c00|^2 + |c10|^2
        // rho_01 = c00*c01* + c10*c11*
        // ...
        rho_red = [
            [C(magSq(sv[0]) + magSq(sv[2])), add(mul(sv[0], conj(sv[1])), mul(sv[2], conj(sv[3])))],
            [add(mul(sv[1], conj(sv[0])), mul(sv[3], conj(sv[2]))), C(magSq(sv[1]) + magSq(sv[3]))]
        ];
    }

    // Bloch Vector components from Density Matrix
    // x = 2 * Re(rho_01)
    // y = 2 * Im(rho_10) -- Note convention difference, usually 2*Im(rho_01) but rho_01 = x-iy so Im is -y.
    // z = rho_00 - rho_11
    
    const x = 2 * rho_red[0][1].r;
    const y = 2 * rho_red[1][0].i; // Using rho_10 for positive Imaginary component check
    const z = rho_red[0][0].r - rho_red[1][1].r;
    
    return [x, y, z];
};

interface GateOp {
    id: string;
    type: 'H' | 'X' | 'Z' | 'S' | 'CNOT';
    target: 0 | 1;
}

// ----------------------------------------------------------------------
// BLOCH SPHERE COMPONENT
// ----------------------------------------------------------------------
const BlochSphere: React.FC<{ 
    label: string; 
    vector: [number, number, number]; 
    color: string;
}> = ({ label, vector, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [x, y, z] = vector;
    const radiusLength = Math.sqrt(x*x + y*y + z*z);
    // If radius < 0.99, it's a mixed state (entangled)
    const purity = radiusLength; 

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const r = width * 0.35;

        const render = () => {
            const time = performance.now() / 2000;
            ctx.clearRect(0, 0, width, height);

            // 3D Projection Rotation
            const rotY = time * 0.5;
            
            // Project Bloch Vector
            // v_rot = Ry(rotY) * v
            const px = x * Math.cos(rotY) - y * Math.sin(rotY); // Actually rotating around Z in standard view, but let's just spin the view
            const py = y * Math.cos(rotY) + x * Math.sin(rotY);
            const pz = z;

            // Simple Isometric-ish projection
            // Screen X = px
            // Screen Y = -pz (Up is Z) + py*depth
            
            // Let's keep Z vertical fixed, rotate XY plane
            const viewX = px; 
            const viewY = py; // Depth
            const viewZ = pz;

            // Draw Sphere Wireframe
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();

            // Equator
            ctx.beginPath();
            ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Draw Vector
            const vx = cx + viewX * r;
            const vy = cy - viewZ * r + (viewY * r * 0.2); // Fake perspective

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(vx, vy);
            
            // Purity check: Entangled states have short vectors
            const isMixed = purity < 0.95;
            
            ctx.strokeStyle = isMixed ? '#f43f5e' : color;
            ctx.lineWidth = 2;
            if (isMixed) ctx.setLineDash([2, 2]);
            else ctx.setLineDash([]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Head
            ctx.beginPath();
            ctx.arc(vx, vy, 4 * purity + 1, 0, Math.PI * 2);
            ctx.fillStyle = isMixed ? '#f43f5e' : color;
            ctx.fill();
            
            // Origin
            ctx.beginPath();
            ctx.arc(cx, cy, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [vector, color, purity]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <canvas ref={canvasRef} width={200} height={200} className="w-32 h-32 md:w-48 md:h-48" />
                {purity < 0.9 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-500 bg-black/80 px-2 rounded border border-rose-500/50 animate-pulse pointer-events-none">
                        ENTANGLED
                    </div>
                )}
            </div>
            <div className="mt-2 text-center">
                <p className="text-[10px] font-orbitron text-slate-300 uppercase tracking-widest">{label}</p>
                <p className="text-[8px] font-mono text-slate-500">Purity: {purity.toFixed(2)}</p>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export const QuantumComputeNexus: React.FC<QuantumComputeNexusProps> = ({ systemState }) => {
    const [circuit, setCircuit] = useState<GateOp[]>([]);
    const [stateVector, setStateVector] = useState<StateVector>(ZERO_STATE);
    const [history, setHistory] = useState<StateVector[]>([]); // For undo?
    const [measurements, setMeasurements] = useState<number[]>([0,0,0,0]); // Counts for 00, 01, 10, 11
    const [isMeasuring, setIsMeasuring] = useState(false);

    // Re-calculate state vector whenever circuit changes
    useEffect(() => {
        let sv = ZERO_STATE;
        circuit.forEach(op => {
            sv = applyGate(sv, op.type, op.target);
        });
        setStateVector(sv);
    }, [circuit]);

    const addGate = (type: GateOp['type'], target: 0 | 1) => {
        if (circuit.length < 12) { // Max depth
            setCircuit(prev => [...prev, { id: Math.random().toString(36), type, target }]);
        }
    };

    const clearCircuit = () => {
        setCircuit([]);
        setMeasurements([0,0,0,0]);
    };

    const runMeasurement = async () => {
        setIsMeasuring(true);
        // Simulate 1024 shots
        const counts = [0,0,0,0];
        const probs = stateVector.map(c => magSq(c)); // |c|^2
        
        // Fast simulation
        for(let i=0; i<1024; i++) {
            const r = Math.random();
            let sum = 0;
            for(let j=0; j<4; j++) {
                sum += probs[j];
                if (r < sum) {
                    counts[j]++;
                    break;
                }
            }
        }
        
        // Visualize accumulation
        for (let i=0; i<10; i++) {
            await new Promise(r => setTimeout(r, 50));
            setMeasurements(counts.map(c => Math.floor(c * (i+1)/10)));
        }
        setMeasurements(counts);
        setIsMeasuring(false);
    };

    // Calculate Bloch Vectors for display
    const vec0 = getBlochVector(stateVector, 0);
    const vec1 = getBlochVector(stateVector, 1);

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-cyan-900/10 border border-cyan-500/30 flex items-center justify-center font-orbitron text-cyan-400 text-3xl animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        Ψ
                    </div>
                    <div>
                        <h2 className="font-orbitron text-4xl text-pearl tracking-tighter uppercase font-extrabold text-glow-pearl">Quantum Compute Nexus</h2>
                        <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mt-2 font-bold">2-Qubit State Vector Simulator</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                
                {/* LEFT: CONTROLS & CIRCUIT */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    
                    {/* Circuit Composer */}
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-6 shadow-inner relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-orbitron text-[10px] text-warm-grey uppercase tracking-[0.3em] font-bold">Circuit Composer</h4>
                            <button onClick={clearCircuit} className="text-[9px] text-rose-400 hover:text-white uppercase tracking-widest border border-rose-900/50 px-2 py-1 rounded bg-rose-950/20">Clear_Bus</button>
                        </div>
                        
                        <div className="relative h-32 w-full overflow-x-auto scrollbar-thin bg-black/40 rounded border border-white/5 flex items-center px-4">
                            {/* Qubit Lines */}
                            <div className="absolute left-0 right-0 top-10 h-px bg-slate-700/50" />
                            <div className="absolute left-0 right-0 top-20 h-px bg-slate-700/50" />
                            
                            {/* Gate Stream */}
                            <div className="flex gap-2 z-10">
                                <div className="w-8 flex flex-col gap-8 text-[10px] font-mono text-slate-500 font-bold pt-1">
                                    <span>Q0</span>
                                    <span>Q1</span>
                                </div>
                                {circuit.map((op, i) => (
                                    <div key={i} className="relative w-8 h-24 flex flex-col justify-center">
                                        <div 
                                            className={`w-8 h-8 flex items-center justify-center border text-[10px] font-bold rounded shadow-lg backdrop-blur-sm transition-all animate-scale-in
                                                ${op.target === 0 ? 'mt-[-40px]' : 'mt-[40px]'}
                                                ${op.type === 'H' ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300' : 
                                                  op.type === 'X' ? 'bg-cyan-900/40 border-cyan-500 text-cyan-300' :
                                                  op.type === 'CNOT' ? 'bg-white/10 border-white text-white rounded-full' :
                                                  'bg-slate-800 border-slate-600 text-slate-300'}
                                            `}
                                        >
                                            {op.type === 'CNOT' ? '⊕' : op.type}
                                        </div>
                                        {op.type === 'CNOT' && (
                                            <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-white/50 ${op.target === 1 ? 'top-4 h-10' : 'bottom-4 h-10'}`}></div>
                                        )}
                                        {op.type === 'CNOT' && (
                                            <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full ${op.target === 1 ? 'top-[14px]' : 'bottom-[14px]'}`}></div>
                                        )}
                                    </div>
                                ))}
                                <div className="w-8 h-24 border-l border-dashed border-white/20 ml-2" />
                            </div>
                        </div>

                        {/* Gate Palette */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="flex gap-2 items-center bg-white/5 p-2 rounded">
                                <span className="text-[9px] font-mono text-slate-500 w-6">Q0:</span>
                                {['H', 'X', 'Z', 'S'].map(g => (
                                    <button key={g} onClick={() => addGate(g as any, 0)} className="w-8 h-8 bg-slate-800 border border-slate-600 rounded hover:bg-cyan-900 hover:border-cyan-500 text-[10px] font-bold text-slate-300 transition-all">{g}</button>
                                ))}
                                <button onClick={() => addGate('CNOT', 1)} className="w-12 h-8 bg-slate-800 border border-slate-600 rounded hover:bg-violet-900 hover:border-violet-500 text-[10px] font-bold text-slate-300 transition-all" title="Control Q0, Target Q1">CNOT</button>
                            </div>
                            <div className="flex gap-2 items-center bg-white/5 p-2 rounded">
                                <span className="text-[9px] font-mono text-slate-500 w-6">Q1:</span>
                                {['H', 'X', 'Z', 'S'].map(g => (
                                    <button key={g} onClick={() => addGate(g as any, 1)} className="w-8 h-8 bg-slate-800 border border-slate-600 rounded hover:bg-cyan-900 hover:border-cyan-500 text-[10px] font-bold text-slate-300 transition-all">{g}</button>
                                ))}
                                <button onClick={() => addGate('CNOT', 0)} className="w-12 h-8 bg-slate-800 border border-slate-600 rounded hover:bg-violet-900 hover:border-violet-500 text-[10px] font-bold text-slate-300 transition-all" title="Control Q1, Target Q0">CNOT</button>
                            </div>
                        </div>
                    </div>

                    {/* Measurement Histogram */}
                    <div className="flex-1 bg-black/60 border border-white/10 rounded-xl p-6 flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-orbitron text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">Measurement Outcome [1024 Shots]</h4>
                            <button 
                                onClick={runMeasurement}
                                disabled={isMeasuring}
                                className={`px-6 py-2 bg-gold/10 border border-gold/40 text-gold font-orbitron text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all rounded-sm ${isMeasuring ? 'opacity-50' : ''}`}
                            >
                                {isMeasuring ? 'COLLAPSING...' : 'EXECUTE_MEASURE'}
                            </button>
                        </div>
                        <div className="flex-1 flex items-end gap-4 h-32 px-4 border-b border-white/10">
                            {['00', '01', '10', '11'].map((state, i) => {
                                const count = measurements[i];
                                const height = Math.max(1, (count / 1024) * 100);
                                const prob = (count / 10.24).toFixed(1);
                                return (
                                    <div key={state} className="flex-1 flex flex-col justify-end items-center group">
                                        <div className="text-[10px] font-mono text-pearl mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                                        <div 
                                            className="w-full bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-t-sm transition-all duration-500 relative" 
                                            style={{ height: `${height}%`, opacity: 0.6 + (height/200) }}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-0.5 bg-white/50" />
                                        </div>
                                        <div className="mt-2 text-center">
                                            <div className="font-mono text-[10px] font-bold text-slate-400">|{state}⟩</div>
                                            <div className="font-mono text-[9px] text-cyan-500">{prob}%</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: STATE VISUALIZATION */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-[#020202] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.1)_0%,transparent_70%)] pointer-events-none" />
                        <h4 className="absolute top-4 left-6 font-orbitron text-[10px] text-slate-500 uppercase tracking-widest font-bold">Reduced Density Matrix</h4>
                        
                        <div className="grid grid-cols-2 gap-8 mt-4">
                            <BlochSphere label="Qubit 0" vector={vec0} color="#22d3ee" />
                            <BlochSphere label="Qubit 1" vector={vec1} color="#f472b6" />
                        </div>

                        <div className="mt-8 w-full p-4 bg-white/5 rounded border border-white/5 text-center">
                            <p className="text-[10px] font-minerva italic text-slate-400">
                                "Vectors inside the sphere indicate mixed states due to entanglement. A zero-length vector represents a maximally entangled Bell state."
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-6">
                        <h4 className="font-orbitron text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">State Vector (Amplitudes)</h4>
                        <div className="space-y-2 font-mono text-[10px]">
                            {['00', '01', '10', '11'].map((s, i) => {
                                const amp = stateVector[i];
                                const prob = magSq(amp);
                                const isZero = prob < 0.001;
                                return (
                                    <div key={s} className={`flex justify-between items-center p-2 rounded ${isZero ? 'opacity-30' : 'bg-white/5 border border-white/10'}`}>
                                        <span className="text-slate-400">|{s}⟩</span>
                                        <span className="text-gold">{amp.r.toFixed(3)} {amp.i >= 0 ? '+' : ''}{amp.i.toFixed(3)}i</span>
                                        <span className="text-cyan-400 font-bold">{(prob * 100).toFixed(1)}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
