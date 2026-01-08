
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

const PaymentRailStatus: React.FC = () => {
    const [status, setStatus] = useState<'SCANNING' | 'ONLINE' | 'ERROR'>('SCANNING');
    const [latency, setLatency] = useState<number | null>(null);
    const [region, setRegion] = useState('INIT_LINK');

    useEffect(() => {
        const regions = ['US_EAST_VA', 'EU_FRANKFURT', 'ASIA_TOKYO', 'GLOBAL_EDGE'];
        let step = 0;

        const interval = setInterval(() => {
            if (step < regions.length) {
                setRegion(regions[step]);
                step++;
            } else {
                clearInterval(interval);
                setLatency(Math.floor(Math.random() * 8) + 12); // 12-20ms
                setStatus('ONLINE');
            }
        }, 600);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-2 p-3 bg-black/60 border border-white/10 rounded-sm min-w-[220px] shadow-lg relative overflow-hidden group">
            {status === 'SCANNING' && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gold/50 animate-shimmer" />
            )}
            
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Global_Payment_Rails</span>
                <span className={`text-[8px] font-mono font-bold ${status === 'ONLINE' ? 'text-emerald-400' : 'text-gold animate-pulse'}`}>
                    {status === 'ONLINE' ? 'TLS_1.3_LOCKED' : 'ROUTING...'}
                </span>
            </div>
            <div className="flex gap-2">
                <div className={`flex-1 flex items-center justify-between bg-white/5 p-2 rounded-sm border transition-all cursor-help ${status === 'SCANNING' ? 'border-gold/30' : 'border-white/5 hover:border-blue-500/30'}`}>
                    <div className="flex items-center gap-2">
                        <img src="https://stripe.com/img/v3/payments/overview/logos/visa.svg" className="h-3 opacity-90 filter brightness-125" alt="Visa" />
                        <span className="text-[7px] font-mono text-slate-300 uppercase tracking-tight group-hover:text-blue-200">VISA_NET</span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'ONLINE' ? 'bg-blue-500 shadow-[0_0_5px_#3b82f6]' : 'bg-slate-700'} animate-pulse`} />
                </div>
                <div className={`flex-1 flex items-center justify-between bg-white/5 p-2 rounded-sm border transition-all cursor-help ${status === 'SCANNING' ? 'border-gold/30' : 'border-white/5 hover:border-orange-500/30'}`}>
                    <div className="flex items-center gap-2">
                        <img src="https://stripe.com/img/v3/payments/overview/logos/mastercard.svg" className="h-3 opacity-90 filter brightness-125" alt="Mastercard" />
                        <span className="text-[7px] font-mono text-slate-300 uppercase tracking-tight group-hover:text-orange-200">MC_GRID</span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'ONLINE' ? 'bg-orange-500 shadow-[0_0_5px_#f97316]' : 'bg-slate-700'} animate-pulse`} />
                </div>
            </div>
            <div className="flex justify-between items-center pt-1">
                <div className="flex gap-2 items-center">
                    <span className="text-[7px] font-mono text-slate-600 uppercase">Route:</span>
                    <span className="text-[7px] font-mono text-pearl">{region}</span>
                </div>
                <span className={`text-[7px] font-mono font-bold ${status === 'ONLINE' ? 'text-gold' : 'text-slate-500'}`}>
                    {status === 'ONLINE' ? `${latency}ms` : 'PINGING'}
                </span>
            </div>
        </div>
    );
};

export const ResourceProcurement: React.FC<ResourceProcurementProps> = ({ systemState, setSystemState, addLogEntry }) => {
    const [procuringId, setProcuringId] = useState<string | null>(null);
    const [handshakeStep, setHandshakeStep] = useState(0);
    const [gatewayStatus, setGatewayStatus] = useState<'ONLINE' | 'SYNCING'>('SYNCING');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditLog, setAuditLog] = useState<string>('Initializing Handshake...');

    useEffect(() => {
        const timer = setTimeout(() => setGatewayStatus('ONLINE'), 1500);
        return () => clearTimeout(timer);
    }, []);

    const { sovereignTier } = systemState.userResources;
    const { sessionToken } = systemState.auth;

    const handleInitializePayment = async (id: string) => {
        setProcuringId(id);
        setIsAuditing(true);
        
        const logs = [
            `ACQUISITION_PROTOCOL: [${id}] Initiated`,
            "Verifying Corporate Liquidity...",
            "Checking OFAC Compliance Ledger...",
            "Syncing Institutional Keys...",
            "Establishing Secure Enclave..."
        ];

        for (const log of logs) {
            setAuditLog(log);
            addLogEntry(LogType.SYSTEM, log);
            await new Promise(r => setTimeout(r, 800));
        }
        
        setIsAuditing(false);
        handleFinalizePayment(id);
    };

    // Simulated ascension for demo purposes
    const handleSimulateAscension = (id: UserTier) => {
        addLogEntry(LogType.SYSTEM, `DEBUG_DIRECTIVE: Manual tier override to ${id} authorized.`);
        setSystemState(prev => ({
            ...prev,
            userResources: {
                ...prev.userResources,
                sovereignTier: id,
                cradleTokens: prev.userResources.cradleTokens + 5000
            }
        }));
    };

    const handleFinalizePayment = async (id: string) => {
        setHandshakeStep(2);
        const tierMatch = TIER_CARDS.find(t => t.id === id);
        const priceId = tierMatch?.priceId || 'demo_gold_price';

        addLogEntry(LogType.SYSTEM, `STRIPE_SOVEREIGN: Initiating Multi-Sig Handshake [SHA-512]...`);
        
        try {
            const result = await ApiService.createCheckoutSession(priceId, sessionToken);
            if (result?.url) {
                setHandshakeStep(3);
                addLogEntry(LogType.SYSTEM, `ACQUISITION_SUCCESS: Capital Liquidation confirmed. Redirecting to Secure Portal...`);
                // Slight delay for visual confirmation
                setTimeout(() => { window.location.href = result.url; }, 1000);
            } else {
                throw new Error("Conduit Error");
            }
        } catch (e: any) {
            addLogEntry(LogType.CRITICAL, `STRIPE_ERR: ${e.message || "Vault connection timed out."} Retrying link...`);
            setHandshakeStep(1);
            setProcuringId(null);
        }
    };

    return (
        <div className="w-full h-full min-h-0 flex flex-col gap-8 animate-fade-in overflow-y-auto pr-2 scrollbar-thin pb-32">
            {isAuditing && (
                <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-8 p-12 bg-black border border-gold rounded-sm shadow-[0_0_150px_rgba(255,215,0,0.15)] relative max-w-lg w-full">
                        <div className="absolute inset-0 gold-shimmer-bg opacity-10 pointer-events-none" />
                        
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-gold/10 border-t-gold rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_gold]" />
                            </div>
                        </div>
                        
                        <div className="text-center space-y-3 w-full">
                            <span className="font-orbitron text-gold text-sm tracking-[0.4em] uppercase block font-bold">Liquidity_Verification</span>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                            <p className="font-mono text-pearl text-[11px] uppercase tracking-widest animate-pulse">{auditLog}</p>
                        </div>
                        
                        <div className="absolute bottom-4 left-0 w-full text-center">
                            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">Node: 0xRESONANCE_VAULT_SFO</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Sovereign Acquisition Banner */}
            <div className="relative p-8 bg-gradient-to-br from-[#0a0a0a] to-[#020202] border border-gold/40 rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] shrink-0 z-10 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent animate-shimmer" />
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-sm border-2 border-gold flex items-center justify-center font-orbitron text-gold font-black text-4xl shadow-[0_0_40px_rgba(255,215,0,0.3)] bg-gold/5 rotate-45 group-hover:rotate-0 transition-transform duration-700">
                            <span className="-rotate-45 group-hover:rotate-0 transition-transform duration-700">G</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="font-minerva italic text-4xl md:text-5xl text-pearl text-glow-pearl tracking-tighter leading-tight uppercase">Sovereign Acquisition</h1>
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] font-black">Capital Reserve: OPTIMAL</span>
                                <div className="h-4 w-px bg-white/10 hidden md:block" />
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${gatewayStatus === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-gold animate-pulse'}`} />
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Vault_Protocol: v2.1_LOCKED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
                        <PaymentRailStatus />
                        <span className="text-[9px] font-mono text-pearl bg-gold/10 px-3 py-1 border border-gold/40 rounded-sm uppercase tracking-widest font-bold whitespace-nowrap">Gold-Tier Institutional Gateway</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 shrink-0">
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <InstitutionalGateway />
                    <div className="p-8 bg-black border border-white/5 rounded-sm flex flex-col gap-4 shadow-2xl relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 p-3 opacity-5 font-orbitron text-6xl font-black italic">VIP</div>
                        <h4 className="font-orbitron text-[11px] text-gold uppercase tracking-[0.5em] font-bold border-b border-gold/20 pb-3">Executive Briefing</h4>
                        <p className="text-[12px] font-minerva italic text-slate-400 leading-relaxed">
                            "The ÆTHERIOS license is more than access; it is an equity stake in future logic. Our Gold-Tier partners represent the 0.1% of architects who direct the flow of global causality."
                        </p>
                        <div className="pt-3 border-t border-white/5">
                             <p className="text-[9px] font-mono text-gold/60 uppercase">Managing Director: Desmond McBride</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-6 bg-gold shadow-[0_0_15px_#ffd700]" />
                            <h3 className="font-orbitron text-xs text-slate-300 uppercase tracking-[0.6em] font-black">Acquisition Matrix</h3>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold">AES-512_ENCRYPTED_VAULT</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TIER_CARDS.map(tier => {
                            const isActive = sovereignTier === tier.id;
                            const isFeatured = tier.featured;
                            return (
                                <div key={tier.id} className={`group bg-black border-2 p-6 rounded-sm transition-all duration-1000 flex flex-col gap-6 relative h-full transform hover:-translate-y-1 ${isActive ? 'border-pearl shadow-[0_0_60px_rgba(248,245,236,0.2)]' : isFeatured ? 'border-gold shadow-[0_0_80px_rgba(255,215,0,0.15)] bg-gold/[0.02]' : 'border-white/10 hover:border-gold/60'}`}>
                                    {isFeatured && (
                                        <div className="absolute -top-3 right-4 px-3 py-1 bg-gold text-dark-bg text-[9px] font-black uppercase tracking-[0.3em] rounded-sm shadow-xl">Institutional</div>
                                    )}
                                    <div className="space-y-3">
                                        <h4 className="font-orbitron text-sm font-black tracking-[0.2em] uppercase leading-tight" style={{ color: tier.color }}>{tier.name}</h4>
                                        <p className="font-mono text-2xl text-pearl font-bold tracking-tighter">{tier.price}</p>
                                    </div>
                                    <div className="h-px bg-white/10 w-full" />
                                    <p className="text-[11px] text-warm-grey leading-relaxed font-minerva italic opacity-90 min-h-[50px]">"{tier.desc}"</p>
                                    <div className="space-y-3 flex-1">
                                        {tier.benefits.map((b, i) => (
                                            <div key={i} className="flex items-start gap-3 text-[10px] text-slate-300 font-mono group-hover:text-pearl transition-colors">
                                                <span className="text-gold font-bold mt-0.5">»</span>
                                                <span className="leading-snug opacity-80 group-hover:opacity-100 tracking-tight">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-2 pt-2">
                                        <button 
                                            onClick={() => handleInitializePayment(tier.id)}
                                            disabled={isActive || procuringId !== null}
                                            className={`w-full py-4 rounded-sm font-orbitron text-[10px] font-black uppercase tracking-[0.4em] transition-all border-2 relative overflow-hidden group/btn active:scale-95 ${isActive ? 'bg-white/10 border-white/20 text-slate-500 cursor-not-allowed' : 'bg-gold text-dark-bg border-gold hover:bg-white hover:border-white shadow-[0_0_40px_rgba(255,215,0,0.3)]'}`}
                                        >
                                            <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover:btn:translate-x-full transition-transform duration-1000" />
                                            <span className="relative z-10">{isActive ? 'VAULT_ACTIVE' : 'Liquidate_Capital'}</span>
                                        </button>
                                        {!isActive && (
                                            <button 
                                                onClick={() => handleSimulateAscension(tier.id as UserTier)}
                                                className="text-[8px] font-mono text-slate-700 hover:text-gold uppercase tracking-widest transition-colors mt-1 opacity-50 hover:opacity-100"
                                            >
                                                [Bypass_Wait] :: Simulate_Ascension
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-auto py-8 px-10 bg-[#050505] border border-gold/40 rounded-sm flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_50px_120px_rgba(0,0,0,1)] border-l-4 border-l-gold shrink-0">
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <span className="text-[14px] text-gold font-black uppercase tracking-[0.5em] text-glow-gold">Bespoke Architectural Inquiries</span>
                    <p className="text-[14px] font-minerva italic text-pearl/90 max-w-2xl leading-relaxed">"For corporations requiring Tier-0 private clusters or sovereign nation-state deployments, contact our Syndicate Lead directly."</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <a href="mailto:divinetruthascension@gmail.com" className="px-10 py-4 bg-gold text-dark-bg font-orbitron text-[12px] font-black uppercase tracking-[0.6em] hover:bg-white transition-all shadow-[0_0_60px_rgba(255,215,0,0.4)] active:scale-95 whitespace-nowrap rounded-sm">Contact_Architect</a>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Ref: syndicate_acq_vault_88</span>
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
