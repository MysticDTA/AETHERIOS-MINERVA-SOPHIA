
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === 'undefined' || key === '') {
    return null; // Return null instead of throwing to allow fallback logic
  }
  return new Stripe(key, {
    apiVersion: '2024-12-18.acacia' as any,
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { priceId, operatorId } = req.body;
    
    // Resolve frontend URL dynamically from headers
    const host = req.headers.host;
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const stripe = getStripe();

    // Determine Tier based on priceId logic
    let targetTier = 'ACOLYTE';
    if (priceId.includes('architect')) targetTier = 'ARCHITECT';
    else if (priceId.includes('sovereign')) targetTier = 'SOVEREIGN';
    else if (priceId.includes('syndicate')) targetTier = 'LEGACY_MENERVA';

    // --- SIMULATION MODE (If no Stripe Key) ---
    if (!stripe) {
        console.warn("[Stripe] Secret Key missing. Simulating Checkout Session.");
        // Simulate a slight network delay to mimic handshake
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        return res.status(200).json({ 
            url: `${baseUrl}?status=success&session_id=mock_sess_${Date.now()}_simulated&tier=${targetTier}`, 
            id: `cs_sim_${Date.now()}` 
        });
    }

    // --- PRODUCTION MODE ---
    const isTokenBundle = priceId.includes('tokens');

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: isTokenBundle ? 'payment' : 'subscription',
      success_url: `${baseUrl}?status=success&session_id={CHECKOUT_SESSION_ID}&tier=${targetTier}`,
      cancel_url: `${baseUrl}?status=cancelled`,
      customer_email: req.body.email,
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      metadata: {
        operator_id: operatorId || 'anonymous_node',
        portal_type: 'institutional_gold_v1.3.1',
        target_tier: targetTier
      }
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error("STRIPE_HANDSHAKE_FAILURE:", err.message);
    // Return a 500 but with a specific error code structure the frontend can parse if needed
    return res.status(500).json({ 
        error: "Causal Conduit Error", 
        code: err.code || "UNKNOWN_ERROR",
        message: "The gateway was unable to establish a secure link with Stripe. Please check your project environment variables."
    });
  }
}
