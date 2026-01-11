
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
        benefits: ["Personal Quantum Shield", "Heuristic Console Access", "Recursive Memory"],
        desc: 'Secure your individual node within the global lattice.',
        capabilities: [
            { label: 'Protection', val: 0.9 },
            { label: 'Reasoning', val: 0.4 },
            { label: 'Memory', val: 0.8 }
        ]
    },
    { 
        id: 'SOVEREIGN', 
        name: 'GLOBAL INSTITUTIONAL', 
        price: '$25,000/mo', 
        priceId: 'price_sovereign_gold_tier',
        color: '#ffd700', 
        benefits: ["Worldwide Quantum Defense Grid", "Multi-Sig Board Governance", "Global Causal Peering", "24/7 Sentinel Oversight"],
        desc: 'The worldwide standard for protecting generational wealth against entropic threats.',
        featured: true,
        capabilities: [
            { label: 'Global Shield', val: 1.0 },
            { label: 'Reasoning [32k]', val: 1.0 },
            { label: 'Zero Latency', val: 1.0 }
        ]
    },
    { 
        id: 'LEGACY_MENERVA', 
        name: 'SYNDICATE EQUITY', 
        price: 'POU (Price on Use)', 
        priceId: 'price_syndicate_gold',
        color: '#f8f5ec', 
        benefits: ["Revenue Share Logic", "White-Label Interface Deployment", "Syndicate Shard Ownership"],
        desc: 'Direct equity-based integration for Syndicate partners.',
        capabilities: [
            { label: 'Reasoning', val: 0.9 },
            { label: 'Equity', val: 1.0 },
            { label: 'Brand', val: 1.0 }
        ]
    }
];

const VisaLogo = () => (
    <svg className="h-3 w-auto fill-current" viewBox="0 0 32 10" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.6 0L9.4 8.7L7.8 2.8C7.6 2.1 7.3 1.8 6.4 1.6C4.8 1.3 2.3 1.1 0 1V2.6C1.6 3 3.3 3.5 4.3 4.8L7.1 10H10.6L16 0H12.6ZM20.1 0C19.2 0 18.5 0.5 18.2 1.1L15.6 10H19L19.7 7.7H23.9L24.3 10H27.5L24 0H20.1ZM20.8 2.2L23 6.3H20.6L20.8 2.2ZM32 0H28.6L26.3 10H29.5L32 0ZM10.5 0L7.6 10H4.2L7.1 0H10.5Z" />
    </svg>
);

const MastercardLogo = () => (
    <svg className="h-4 w-auto" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7.5" r="7" fill="currentColor" fillOpacity="0.6"/>
        <circle cx="17" cy="7.5" r="7" fill="currentColor" fillOpacity="0.6"/>
        <path d="M12 11.5a4.7 4.7 0 0 1 0-7 4.7 4.7 0 0 1 0 7z" fill="currentColor" fillOpacity="0.8"/>
    </svg>
);

const PaymentRailStatus: React.FC<{ processing: boolean }> = ({ processing }) => {
    const [status, setStatus] = useState<'SCANNING' | 'ONLINE' | 'PROCESSING' | 'ERROR'>('SCANNING');
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
                setLatency(Math.floor(Math.random() * 8) + 12); 
                setStatus('ONLINE');
            }
        }, 600);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (processing) setStatus('PROCESSING');
        else if (status === 'PROCESSING') setStatus('ONLINE');
    }, [processing]);

    return (
        <div className="flex flex-col gap-2 p-4 bg-black/80 border border-white/10 rounded-sm min-w-[240px] shadow-lg relative overflow-hidden group">
            {(status === 'SCANNING' || status === 'PROCESSING') && (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gold/10 to-transparent animate-shimmer pointer-events-none" />
            )}
            
            <div className="flex justify-between items-center border-b border-white/5 pb-2 relative z-10">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Secure_Payment_Rail</span>
                <span className={`text-[8px] font-mono font-bold ${status === 'ONLINE' ? 'text-emerald-400' : 'text-gold animate-pulse'}`}>
                    {status === 'ONLINE' ? 'TLS_1.3_LOCKED' : status === 'PROCESSING' ? 'TX_VERIFYING...' : 'ROUTING...'}
                </span>
            </div>
            <div className="flex gap-2 relative z-10">
                <div className={`flex-1 flex items-center justify-center bg-white/5 p-2 rounded-sm border transition-all cursor-help ${status === 'PROCESSING' ? 'border-gold shadow-[0_0_10px_rgba(230,199,127,0.3)]' : status === 'SCANNING' ? 'border-gold/30' : 'border-white/5 hover:border-blue-500/30'}`}>
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-300 transition-colors">
                        <VisaLogo />
                    </div>
                </div>
                <div className={`flex-1 flex items-center justify-center bg-white/5 p-2 rounded-sm border transition-all cursor-help ${status === 'PROCESSING' ? 'border-gold shadow-[0_0_10px_rgba(230,199,127,0.3)]' : status === 'SCANNING' ? 'border-gold/30' : 'border-white/5 hover:border-orange-500/30'}`}>
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-orange-300 transition-colors">
                        <MastercardLogo />
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center pt-1 relative z-10">
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

const ResourceProcurementComponent: React.FC<ResourceProcurementProps> = ({ systemState, setSystemState, addLogEntry }) => {
    const [procuringId, setProcuringId] = useState<string | null>(null);
    const [gatewayStatus, setGatewayStatus] = useState<'ONLINE' | 'SYNCING'>('SYNCING');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditLog, setAuditLog] = useState<string>('Initializing Handshake...');

    useEffect(() => {
        const timer = setTimeout(() => setGatewayStatus('ONLINE'), 1500);
        return () => clearTimeout(timer);
    }, []);

    const { sovereignTier } = systemState.userResources;
    const { sessionToken, operatorId } = systemState.auth;

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
        const tierMatch = TIER_CARDS.find(t => t.id === id);
        const priceId = tierMatch?.priceId || 'demo_gold_price';

        addLogEntry(LogType.SYSTEM, `STRIPE_SOVEREIGN: Initiating Multi-Sig Handshake [SHA-512]...`);
        
        try {
            const result = await ApiService.createCheckoutSession(priceId, operatorId, sessionToken);
            if (result?.url) {
                addLogEntry(LogType.SYSTEM, `ACQUISITION_SUCCESS: Capital Liquidation confirmed. Redirecting to Secure Portal...`);
                setTimeout(() => { window.location.href = result.url; }, 1000);
            } else {
                throw new Error("Conduit Error");
            }
        } catch (e: any) {
            addLogEntry(LogType.CRITICAL, `STRIPE_ERR: ${e.message || "Vault connection timed out."} Retrying link...`);
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

            <div className="relative p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-black to-black border-y border-gold/30 rounded-sm overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,1)] shrink-0 z-10 group isolate">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                />
                
                <div className="absolute top-0 bottom-0 w-1 bg-gold/30 blur-md animate-[scanline-sweep_6s_linear_infinite] pointer-events-none z-0 opacity-50" />

                <div className="flex flex-col xl:flex-row justify-between items-center gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-sm border border-gold/30 flex items-center justify-center font-orbitron text-gold font-black text-5xl shadow-[0_0_60px_rgba(255,215,0,0.15)] bg-black rotate-45 group-hover:rotate-0 transition-transform duration-[1000ms] ease-out z-10 relative">
                                <span className="-rotate-45 group-hover:rotate-0 transition-transform duration-[1000ms]">G</span>
                            </div>
                            <div className="absolute inset-0 border border-gold/10 rounded-sm scale-110 animate-pulse" />
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <span className="text-[9px] font-mono text-gold uppercase tracking-[0.6em] font-bold block mb-1">Vault_Access_Authorized</span>
                                <h1 className="font-minerva italic text-5xl text-pearl text-glow-pearl tracking-tighter leading-none">Global Acquisition</h1>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                    <div className={`w-1.5 h-1.5 rounded-full ${gatewayStatus === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gold animate-pulse'}`} />
                                    <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest font-bold">Protocol: v2.1_LOCKED</span>
                                </div>
                                <div className="h-px w-8 bg-white/20" />
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Capital Reserve: <span className="text-gold font-bold">OPTIMAL</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <PaymentRailStatus processing={isAuditing || procuringId !== null} />
                        <div className="h-16 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden xl:block" />
                        <div className="flex flex-col items-end gap-1 text-right">
                            <span className="text-[10px] font-orbitron text-gold uppercase tracking-[0.2em] font-bold">Worldwide-Tier Gateway</span>
                            <span className="text-[8px] font-mono text-slate-500 max-w-[120px] leading-tight">Institutional-grade encryption for high-volume global asset liquidation.</span>
                        </div>
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
                            "The ÆTHERIOS license offers exclusive access to the Quantum Protection Grid. This is an equity stake in the future of global security. Our Global Partners represent the 0.1% who direct the flow of causality."
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
                                        <div className="absolute -top-3 right-4 px-3 py-1 bg-gold text-dark-bg text-[9px] font-black uppercase tracking-[0.3em] rounded-sm shadow-xl">Worldwide</div>
                                    )}
                                    <div className="space-y-3">
                                        <h4 className="font-orbitron text-sm font-black tracking-[0.2em] uppercase leading-tight" style={{ color: tier.color }}>{tier.name}</h4>
                                        <p className="font-mono text-2xl text-pearl font-bold tracking-tighter">{tier.price}</p>
                                    </div>
                                    <div className="h-px bg-white/10 w-full" />
                                    <p className="text-[11px] text-warm-grey leading-relaxed font-minerva italic opacity-90 min-h-[50px]">"{tier.desc}"</p>
                                    
                                    <div className="space-y-2 bg-white/[0.02] p-3 rounded border border-white/5">
                                        {tier.capabilities?.map(cap => (
                                            <div key={cap.label}>
                                                <div className="flex justify-between text-[8px] font-mono uppercase text-slate-500 mb-1">
                                                    <span>{cap.label}</span>
                                                    <span>{(cap.val * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full transition-all duration-1000" style={{ width: `${cap.val * 100}%`, backgroundColor: tier.color, opacity: 0.8 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 flex-1 pt-2">
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
                                            <span className="relative z-10">{isActive ? 'VAULT_ACTIVE' : `Acquire_${tier.id === 'SOVEREIGN' ? 'Sovereign' : 'License'}`}</span>
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

export const ResourceProcurement = React.memo(ResourceProcurementComponent, (prev, next) => {
    // Return true if re-render is NOT needed
    if (prev.addLogEntry !== next.addLogEntry) return false;
    if (prev.setSystemState !== next.setSystemState) return false;
    
    const pState = prev.systemState;
    const nState = next.systemState;
    
    // Only re-render if critical data changes (Auth, Resources, Visual Indicators)
    if (pState.userResources !== nState.userResources) return false;
    if (pState.auth !== nState.auth) return false;
    
    // Performance metrics used in HUDs might trigger visual updates
    if (pState.resonanceFactorRho !== nState.resonanceFactorRho) return false;
    
    return true; 
});
