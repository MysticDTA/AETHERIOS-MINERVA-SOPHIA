
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY_MISSING");
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
    const { priceId } = req.body;
    const stripe = getStripe();
    
    // Resolve frontend URL dynamically from headers
    const host = req.headers.host;
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const isTokenBundle = priceId.includes('tokens');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: isTokenBundle ? 'payment' : 'subscription',
      success_url: `${baseUrl}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?status=cancelled`,
      customer_email: req.body.email, // Optional: if passed from frontend
      
      // Institutional Refinements for Visa/Mastercard Portal Compliance
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      phone_number_collection: { enabled: true },
      
      allow_promotion_codes: true,
      metadata: {
        operator_id: req.body.operatorId || 'anonymous_node',
        portal_type: 'institutional_gold_v1.3.1'
      }
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error("STRIPE_HANDSHAKE_FAILURE:", err.message);
    return res.status(500).json({ 
        error: "Causal Conduit Error", 
        code: err.code || "UNKNOWN_ERROR",
        message: "The gateway was unable to establish a secure link with Stripe. Please check your project environment variables."
    });
  }
}
