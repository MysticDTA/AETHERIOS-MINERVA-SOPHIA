import React, { useState, useEffect } from 'react';
import { SystemState, UserTier, LogType } from '../types';
import { Tooltip } from './Tooltip';
import { ApiService } from '../services/api';
import { InstitutionalGateway } from './InstitutionalGateway';

interface ResourceProcurementProps {
  systemState: SystemState;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
  addLogEntry: (type: LogType, message: string) => void;
}

const TIER_CARDS = [
    { 
        id: 'ACOLYTE', 
        name: 'ACOLYTE (GUEST)', 
        price: 'FREE', 
        color: '#67e8f9', 
        benefits: ['Basic Telemetry Readout', 'Vocal Handshake (Limited)', 'Public Spectrum Monitoring'],
        desc: 'Observe the ÆTHERIOS lattice from the outer ring.'
    },
    { 
        id: 'ARCHITECT', 
        name: 'ARCHITECT LICENCE', 
        price: '$29/mo', 
        priceId: 'price_architect_monthly_0x88',
        color: '#e6c77f', 
        benefits: ["Full Heuristic Console Access", "32,768 Reasoning Token Budget", "Deep Astrophysical Interpretation", "Recursive Persistent Memory"],
        desc: 'Establish a personal cognitive throne in the matrix.'
    },
    { 
        id: 'SOVEREIGN', 
        name: 'RESONANCE COLLECTIVE', 
        price: '$149/mo', 
        priceId: 'price_sovereign_monthly_0x99',
        color: '#f8f5ec', 
        benefits: ["Shared Community Dashboard", "Collective Coherence Tracking", "Decoherence Hotspot Alerts", "24/7 Global Resonance Monitoring"],
        desc: 'The ultimate tool for communities and research labs.'
    }
];

const BUNDLES = [
    { id: 'b1', name: 'Logic Packet', amount: 50, cost: '$9', priceId: 'price_tokens_50', desc: '50 Reasoning Blocks' },
    { id: 'b2', name: 'Causal Core', amount: 250, cost: '$39', priceId: 'price_tokens_250', desc: '250 Reasoning Blocks' },
    { id: 'b3', name: 'Infinity Node', amount: 1000, cost: '$120', priceId: 'price_tokens_1000', desc: '1,000 Reasoning Blocks' },
];

export const ResourceProcurement: React.FC<ResourceProcurementProps> = ({ systemState, setSystemState, addLogEntry }) => {
    const [procuringId, setProcuringId] = useState<string | null>(null);
    const [handshakeStep, setHandshakeStep] = useState(0);
    const [showCheckoutTerm, setShowCheckoutTerm] = useState(false);
    const [gatewayStatus, setGatewayStatus] = useState<'ONLINE' | 'SYNCING'>('SYNCING');
    const [isAuditing, setIsAuditing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setGatewayStatus('ONLINE'), 1500);
        return () => clearTimeout(timer);
    }, []);

    const { sovereignTier } = systemState.userResources;
    const { sessionToken } = systemState.auth;

    const handleInitializePayment = async (id: string) => {
        setProcuringId(id);
        setIsAuditing(true);
        addLogEntry(LogType.SYSTEM, `OPERATOR: [${id}] Analyzing causal compatibility...`);
        
        // Causal Compatibility Audit Simulation
        await new Promise(r => setTimeout(r, 2000));
        
        setIsAuditing(false);
        setShowCheckoutTerm(true);
        setHandshakeStep(1);
    };

    const handleFinalizePayment = async () => {
        setHandshakeStep(2);
        const tierMatch = TIER_CARDS.find(t => t.id === procuringId);
        const bundleMatch = BUNDLES.find(b => b.id === procuringId);
        const priceId = tierMatch?.priceId || bundleMatch?.priceId || 'demo_price_id';

        addLogEntry(LogType.SYSTEM, `STRIPE_GATEWAY: Initiating multi-sig encryption [SHA-256]...`);
        
        await new Promise(r => setTimeout(r, 1800));

        try {
            const result = await ApiService.createCheckoutSession(priceId, sessionToken);
            if (result?.url) {
                setHandshakeStep(3);
                addLogEntry(LogType.SYSTEM, `STRIPE_GATEWAY: Handshake confirmed. Redirecting to Causal Matrix.`);
                setTimeout(() => { window.location.href = result.url; }, 800);
            } else {
                throw new Error("Gateway disconnected");
            }
        } catch (e) {
            addLogEntry(LogType.CRITICAL, "BACKEND_DESYNC: Stripe conduit failed. Operator status cached locally.");
            setHandshakeStep(1);
            setTimeout(() => setShowCheckoutTerm(false), 3000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-10 animate-fade-in overflow-y-auto pr-4 scrollbar-thin select-none pb-20">
            {/* Auditing Overlay */}
            {isAuditing && (
                <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-6 p-12 bg-[#050505] border border-gold/40 rounded shadow-[0_0_50px_rgba(230,199,127,0.2)]">
                        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                        <span className="font-orbitron text-gold text-[10px] tracking-[0.5em] uppercase animate-pulse">Causal_Compatibility_Audit</span>
                    </div>
                </div>
            )}

            {/* Elite Branding Header */}
            <div className="relative p-10 bg-[#0a0a0a]/80 border border-gold/30 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(230,199,127,0.1)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-full border-2 border-gold/40 flex items-center justify-center font-orbitron text-gold font-bold text-3xl shadow-[0_0_30px_rgba(230,199,127,0.25)] bg-gold/5 animate-pulse">Ω</div>
                        <div className="space-y-2">
                            <h1 className="font-minerva italic text-4xl text-pearl text-glow-pearl tracking-tight leading-tight">Causal Procurement</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] font-bold">Node Identity: {systemState.auth.operatorId}</span>
                                <div className="h-3 w-px bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${gatewayStatus === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gold animate-pulse'}`} />
                                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Stripe_Gateway: {gatewayStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                            <img src="https://stripe.com/img/v3/payments/overview/logos/visa.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help" title="Verified by Visa" />
                            <img src="https://stripe.com/img/v3/payments/overview/logos/mastercard.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help" title="Mastercard Identity Check" />
                        </div>
                        <span className="text-[10px] font-mono text-pearl bg-white/5 px-3 py-1 border border-white/10 rounded uppercase">PCI-DSS Compliant Gateway</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Institutional Recognition Panel */}
                <div className="lg:col-span-4">
                    <InstitutionalGateway />
                </div>

                {/* License Matrix */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-6 bg-gold" />
                            <h3 className="font-orbitron text-[12px] text-slate-500 uppercase tracking-[0.5em] font-bold">Resonance Licensing Protocols</h3>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Sovereign Encryption [AES-256]</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TIER_CARDS.map(tier => {
                            const isActive = sovereignTier === tier.id;
                            return (
                                <div key={tier.id} className={`group bg-[#111]/60 border p-8 rounded-2xl transition-all duration-700 flex flex-col gap-6 relative h-full ${isActive ? 'border-pearl shadow-[0_0_50px_rgba(248,245,236,0.15)] ring-1 ring-pearl/20' : 'border-white/5 hover:border-gold/40 hover:bg-gold/[0.02]'}`}>
                                    {isActive && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-pearl text-dark-bg text-[9px] font-bold uppercase tracking-[0.5em] rounded-full shadow-2xl animate-pulse">Current Clearance</div>
                                    )}
                                    <div className="text-center space-y-3">
                                        <h4 className="font-orbitron text-base font-bold tracking-widest uppercase" style={{ color: tier.color }}>{tier.name}</h4>
                                        <p className="font-mono text-xl text-pearl">{tier.price}</p>
                                    </div>
                                    <div className="h-px bg-white/5 w-full" />
                                    <p className="text-[11px] text-warm-grey leading-relaxed font-minerva italic opacity-80 min-h-[50px] text-center">"{tier.desc}"</p>
                                    <div className="space-y-3 flex-1">
                                        {tier.benefits.map((b, i) => (
                                            <div key={i} className="flex items-start gap-3 text-[10px] text-slate-300 font-mono group-hover:text-pearl transition-colors">
                                                <span className="text-gold/60 mt-0.5">▶</span>
                                                <span className="leading-tight opacity-70 group-hover:opacity-100">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => handleInitializePayment(tier.id)}
                                        disabled={isActive || procuringId !== null}
                                        className={`w-full py-4 rounded-sm font-orbitron text-[9px] font-bold uppercase tracking-[0.5em] transition-all border relative overflow-hidden group/btn active:scale-98 ${isActive ? 'bg-white/5 border-white/10 text-slate-600 cursor-not-allowed' : 'bg-gold/10 border-gold/40 text-gold hover:bg-gold hover:text-dark-bg shadow-lg'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        <span className="relative z-10">{isActive ? 'NODE_ACTIVE' : 'Initialize Protocol'}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Token Infusions */}
            <div className="p-10 bg-black/40 border border-white/5 rounded-2xl shadow-inner">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded border border-white/10 flex items-center justify-center font-orbitron text-xl text-pearl">Σ</div>
                        <h3 className="font-orbitron text-[11px] text-slate-500 uppercase tracking-[0.4em] font-bold">Cradle Reasoning Infusions</h3>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Handshake Verified</span>
                        <div className="h-6 w-px bg-white/5" />
                        <span className="text-[9px] font-mono text-slate-500">Node: 0xREASON_88</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BUNDLES.map(bundle => (
                        <button 
                            key={bundle.id}
                            onClick={() => handleInitializePayment(bundle.id)}
                            className="bg-dark-surface/40 border border-white/5 p-8 rounded-xl flex flex-col items-center gap-4 hover:border-gold/50 hover:bg-gold/[0.04] transition-all group/bundle active:scale-95 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover/bundle:opacity-100 transition-opacity" />
                            <span className="font-orbitron text-warm-grey text-[10px] uppercase tracking-[0.3em] group-hover/bundle:text-gold transition-colors">{bundle.name}</span>
                            <span className="font-mono text-4xl text-pearl font-bold tracking-tighter group-hover/bundle:scale-110 transition-transform">{bundle.cost}</span>
                            <div className="px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-full text-[9px] font-mono text-gold uppercase tracking-widest group-hover/bundle:bg-gold group-hover/bundle:text-dark-bg transition-all">
                                {bundle.amount} Tokens
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium Checkout Overlay */}
            {showCheckoutTerm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-fade-in p-8 md:p-20 overflow-hidden">
                    <div className="max-w-2xl w-full bg-[#0a0a0a] border-2 border-gold/40 p-12 rounded-sm shadow-[0_0_100px_rgba(230,199,127,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] font-orbitron text-[80px] pointer-events-none select-none uppercase tracking-widest">STRIPE</div>
                        
                        <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-[#635bff] text-3xl shadow-2xl animate-pulse">S</div>
                                <div className="space-y-1">
                                    <span className="font-sans font-extrabold text-white tracking-tighter text-2xl">Stripe Secure Bridge</span>
                                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Grade 07 Encryption Initialized // TLS 1.3</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCheckoutTerm(false)} className="p-3 text-slate-500 hover:text-rose-500 transition-all active:scale-90"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg></button>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="bg-black/60 p-8 border border-white/5 rounded-sm shadow-inner group-hover:border-gold/20 transition-all duration-1000">
                                <p className="text-[10px] text-slate-500 uppercase mb-4 tracking-[0.4em] font-bold">Transaction Blueprint</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-pearl font-orbitron text-2xl tracking-widest">{TIER_CARDS.find(t=>t.id===procuringId)?.name || BUNDLES.find(b=>b.id===procuringId)?.name}</span>
                                    <span className="font-mono text-gold text-2xl font-bold">{TIER_CARDS.find(t=>t.id===procuringId)?.price || BUNDLES.find(b=>b.id===procuringId)?.cost}</span>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                                        <span className="text-[8px] font-mono text-slate-500 uppercase">3D-Secure V2</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                                        <span className="text-[8px] font-mono text-slate-500 uppercase">PCI Compliant</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className={`flex justify-between text-[11px] font-mono transition-all duration-1000 ${handshakeStep >= 1 ? 'text-green-400 font-bold' : 'text-slate-700'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-1 rounded-full ${handshakeStep >= 1 ? 'bg-green-500' : 'bg-slate-800'}`} />
                                            <span>SSL_ENCRYPTION_CHANNEL</span>
                                        </div>
                                        <span>{handshakeStep >= 1 ? 'LOCKED' : '...'}</span>
                                    </div>
                                    <div className={`flex justify-between text-[11px] font-mono transition-all duration-1000 ${handshakeStep >= 2 ? 'text-green-400 font-bold' : 'text-slate-700'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-1 rounded-full ${handshakeStep >= 2 ? 'bg-green-500' : 'bg-slate-800'}`} />
                                            <span>GATEWAY_AUTHORIZATION</span>
                                        </div>
                                        <span>{handshakeStep >= 2 ? 'LOCKED' : '...'}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleFinalizePayment} 
                                    disabled={handshakeStep > 1} 
                                    className={`w-full py-6 rounded-sm font-orbitron font-bold text-[13px] tracking-[0.8em] transition-all relative overflow-hidden group shadow-2xl ${handshakeStep > 1 ? 'bg-slate-900 border border-white/5 text-slate-600 cursor-wait' : 'bg-[#635bff] border border-[#7a73ff] text-white hover:bg-[#7a73ff] hover:scale-[1.02] active:scale-95'}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <span className="relative z-10">
                                        {handshakeStep === 1 ? 'OPEN CAUSAL BRIDGE' : handshakeStep === 2 ? 'SYNCHRONIZING...' : 'TRANSACTION_COMPLETE'}
                                    </span>
                                </button>
                                <div className="flex justify-center gap-6 opacity-40 mt-4">
                                    <img src="https://stripe.com/img/v3/payments/overview/logos/visa.svg" className="h-3" />
                                    <img src="https://stripe.com/img/v3/payments/overview/logos/mastercard.svg" className="h-3" />
                                    <img src="https://stripe.com/img/v3/payments/overview/logos/amex.svg" className="h-3" />
                                </div>
                                <p className="text-[9px] text-center text-slate-600 uppercase tracking-[0.6em] opacity-40 font-bold mt-2">Secured by Minerva SOPHIA Causal Guard</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};