
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
        id: 'ARCHITECT', 
        name: 'ARCHITECT LICENSE', 
        price: '$2,900/mo', 
        priceId: 'price_architect_monthly_gold',
        color: '#e6c77f', 
        benefits: ["Full Heuristic Console Access", "32,768 Reasoning Token Budget", "Deep Astrophysical Interpretation", "Recursive Persistent Memory"],
        desc: 'Establish a personal cognitive throne in the matrix.'
    },
    { 
        id: 'SOVEREIGN', 
        name: 'SOVEREIGN INSTITUTIONAL', 
        price: '$25,000/mo', 
        priceId: 'price_sovereign_gold_tier',
        color: '#ffd700', 
        benefits: ["Tier-0 Dedicated Reasoning Shards", "Multi-Sig Board Approval Gate", "Custom VPC Causal Peering", "24/7 Elite Architect Support", "Global Synod Priority Intercept"],
        desc: 'The definitive standard for Tier-1 Financial and Defense Institutions.',
        featured: true
    },
    { 
        id: 'LEGACY_MENERVA', 
        name: 'SYNDICATE PARTNERSHIP', 
        price: 'POU (Price on Use)', 
        priceId: 'price_syndicate_gold',
        color: '#f8f5ec', 
        benefits: ["Revenue Share Logic", "White-Label Interface Deployment", "Syndicate Shard Ownership", "Unlimited Reasoning Blocks"],
        desc: 'Direct equity-based integration for Syndicate partners.'
    }
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
        addLogEntry(LogType.SYSTEM, `ACQUISITION_PROTOCOL: [${id}] Verifying Corporate Liquidity...`);
        
        await new Promise(r => setTimeout(r, 2500));
        
        setIsAuditing(false);
        setShowCheckoutTerm(true);
        setHandshakeStep(1);
    };

    const handleFinalizePayment = async () => {
        setHandshakeStep(2);
        const tierMatch = TIER_CARDS.find(t => t.id === procuringId);
        const priceId = tierMatch?.priceId || 'demo_gold_price';

        addLogEntry(LogType.SYSTEM, `STRIPE_SOVEREIGN: Initiating Multi-Sig Handshake [SHA-512]...`);
        
        await new Promise(r => setTimeout(r, 2000));

        try {
            const result = await ApiService.createCheckoutSession(priceId, sessionToken);
            if (result?.url) {
                setHandshakeStep(3);
                addLogEntry(LogType.SYSTEM, `ACQUISITION_SUCCESS: Capital Liquidation confirmed. Redirecting...`);
                setTimeout(() => { window.location.href = result.url; }, 800);
            } else {
                throw new Error("Conduit Error");
            }
        } catch (e) {
            addLogEntry(LogType.CRITICAL, "STRIPE_ERR: Vault connection timed out. Retrying link...");
            setHandshakeStep(1);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-10 animate-fade-in overflow-y-auto pr-4 scrollbar-thin pb-20">
            {isAuditing && (
                <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-xl flex items-center justify-center">
                    <div className="flex flex-col items-center gap-8 p-16 bg-black border-2 border-gold rounded-sm shadow-[0_0_100px_rgba(255,215,0,0.2)] relative">
                        <div className="absolute inset-0 gold-shimmer-bg opacity-10" />
                        <div className="w-20 h-20 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                        <div className="text-center space-y-2">
                            <span className="font-orbitron text-gold text-sm tracking-[0.8em] uppercase block">Liquidity_Verification</span>
                            <span className="font-mono text-slate-500 text-[10px] uppercase">Node: 0xRESONANCE_VAULT_SFO</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative p-12 bg-gradient-to-br from-[#0a0a0a] to-[#020202] border border-gold/40 rounded-sm overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent animate-shimmer" />
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
                    <div className="flex items-center gap-10">
                        <div className="w-24 h-24 rounded-sm border-2 border-gold flex items-center justify-center font-orbitron text-gold font-black text-5xl shadow-[0_0_40px_rgba(255,215,0,0.3)] bg-gold/5 rotate-45 group">
                            <span className="-rotate-45 group-hover:scale-110 transition-transform">G</span>
                        </div>
                        <div className="space-y-3">
                            <h1 className="font-minerva italic text-6xl text-pearl text-glow-pearl tracking-tighter leading-tight uppercase">Sovereign Acquisition</h1>
                            <div className="flex items-center gap-6">
                                <span className="text-[11px] font-mono text-gold uppercase tracking-[0.5em] font-black">Capital Reserve: OPTIMAL</span>
                                <div className="h-4 w-px bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${gatewayStatus === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-gold animate-pulse'}`} />
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Vault_Protocol: v2.1_LOCKED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-4">
                            <img src="https://stripe.com/img/v3/payments/overview/logos/visa.svg" className="h-6 opacity-80 hover:opacity-100 transition-all filter brightness-150" />
                            <img src="https://stripe.com/img/v3/payments/overview/logos/mastercard.svg" className="h-6 opacity-80 hover:opacity-100 transition-all filter brightness-150" />
                        </div>
                        <span className="text-[11px] font-mono text-pearl bg-gold/10 px-4 py-1.5 border border-gold/40 rounded-sm uppercase tracking-widest font-bold">Gold-Tier Institutional Gateway</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                    <InstitutionalGateway />
                    <div className="mt-8 p-10 bg-black border border-white/5 rounded-sm flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 font-orbitron text-7xl font-black italic">VIP</div>
                        <h4 className="font-orbitron text-[12px] text-gold uppercase tracking-[0.5em] font-bold border-b border-gold/20 pb-4">Executive Briefing</h4>
                        <p className="text-[13px] font-minerva italic text-slate-400 leading-relaxed">
                            "The ÆTHERIOS license is more than access; it is an equity stake in future logic. Our Gold-Tier partners represent the 0.1% of architects who direct the flow of global causality."
                        </p>
                        <div className="pt-4 border-t border-white/5">
                             <p className="text-[10px] font-mono text-gold/60 uppercase">Managing Director: Desmond McBride</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <div className="flex items-center gap-6">
                            <div className="w-1.5 h-8 bg-gold shadow-[0_0_15px_#ffd700]" />
                            <h3 className="font-orbitron text-sm text-slate-300 uppercase tracking-[0.8em] font-black">Acquisition Matrix</h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest font-bold">AES-512_ENCRYPTED_VAULT</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TIER_CARDS.map(tier => {
                            const isActive = sovereignTier === tier.id;
                            const isFeatured = tier.featured;
                            return (
                                <div key={tier.id} className={`group bg-black border-2 p-10 rounded-sm transition-all duration-1000 flex flex-col gap-8 relative h-full transform hover:-translate-y-2 ${isActive ? 'border-pearl shadow-[0_0_60px_rgba(248,245,236,0.2)]' : isFeatured ? 'border-gold shadow-[0_0_80px_rgba(255,215,0,0.15)] bg-gold/[0.02]' : 'border-white/10 hover:border-gold/60'}`}>
                                    {isFeatured && (
                                        <div className="absolute -top-4 right-6 px-4 py-1.5 bg-gold text-dark-bg text-[10px] font-black uppercase tracking-[0.4em] rounded-sm shadow-2xl">Institutional_Standard</div>
                                    )}
                                    <div className="space-y-4">
                                        <h4 className="font-orbitron text-lg font-black tracking-[0.2em] uppercase leading-tight" style={{ color: tier.color }}>{tier.name}</h4>
                                        <p className="font-mono text-3xl text-pearl font-bold tracking-tighter">{tier.price}</p>
                                    </div>
                                    <div className="h-px bg-white/10 w-full" />
                                    <p className="text-[12px] text-warm-grey leading-relaxed font-minerva italic opacity-90 min-h-[60px]">"{tier.desc}"</p>
                                    <div className="space-y-4 flex-1">
                                        {tier.benefits.map((b, i) => (
                                            <div key={i} className="flex items-start gap-4 text-[11px] text-slate-300 font-mono group-hover:text-pearl transition-colors">
                                                <span className="text-gold font-bold mt-0.5">»</span>
                                                <span className="leading-snug opacity-80 group-hover:opacity-100 tracking-tight">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => handleInitializePayment(tier.id)}
                                        disabled={isActive || procuringId !== null}
                                        className={`w-full py-5 rounded-sm font-orbitron text-[11px] font-black uppercase tracking-[0.6em] transition-all border-2 relative overflow-hidden group/btn active:scale-95 ${isActive ? 'bg-white/10 border-white/20 text-slate-500 cursor-not-allowed' : 'bg-gold text-dark-bg border-gold hover:bg-white hover:border-white shadow-[0_0_40px_rgba(255,215,0,0.3)]'}`}
                                    >
                                        <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        <span className="relative z-10">{isActive ? 'VAULT_ACTIVE' : 'Liquidate_Capital'}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-auto py-12 px-16 bg-[#050505] border border-gold/40 rounded-sm flex flex-col md:flex-row justify-between items-center gap-10 shadow-[0_50px_120px_rgba(0,0,0,1)] border-l-8 border-l-gold">
                <div className="flex flex-col gap-3">
                    <span className="text-[16px] text-gold font-black uppercase tracking-[0.6em] text-glow-gold">Bespoke Architectural Inquiries</span>
                    <p className="text-[18px] font-minerva italic text-pearl/90 max-w-3xl leading-relaxed">"For corporations requiring Tier-0 private clusters or sovereign nation-state deployments, contact our Syndicate Lead directly."</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <a href="mailto:divinetruthascension@gmail.com" className="px-16 py-6 bg-gold text-dark-bg font-orbitron text-[14px] font-black uppercase tracking-[0.8em] hover:bg-white transition-all shadow-[0_0_60px_rgba(255,215,0,0.4)] active:scale-95 whitespace-nowrap">Contact_Architect</a>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ref: syndicate_acq_vault_88</span>
                </div>
            </div>
            
            <style>{`
                @keyframes shimmer {
                    0% { opacity: 0.3; transform: translateX(-100%); }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; transform: translateX(100%); }
                }
                .animate-shimmer { animation: shimmer 4s infinite linear; }
                .gold-shimmer-bg {
                    background: linear-gradient(45deg, transparent 40%, rgba(255,215,0,0.1) 50%, transparent 60%);
                    background-size: 200% 200%;
                    animation: shimmer 3s infinite linear;
                }
            `}</style>
        </div>
    );
};
