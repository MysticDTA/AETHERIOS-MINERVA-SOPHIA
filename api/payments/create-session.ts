import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialize Stripe lazily to handle missing env vars gracefully
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is missing in Vercel Environment Variables");
  }
  return new Stripe(key, {
    apiVersion: '2024-12-18.acacia' as any,
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body;
    const stripe = getStripe();
    
    const host = req.headers.host;
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: priceId.includes('tokens') ? 'payment' : 'subscription',
      success_url: `${baseUrl}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?status=cancelled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("MINERVA_STRIPE_ERROR:", err.message);
    return res.status(500).json({ 
        error: "Payment Gateway Error", 
        details: process.env.NODE_ENV === 'development' ? err.message : "Internal system error during checkout initialization."
    });
  }
}