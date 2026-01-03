
/**
 * STRIPE BACKEND ENDPOINT EXAMPLE (Node.js / Express)
 * This code would live on your server or as a Vercel Function.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-session
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { priceId } = req.body;
    const sessionToken = req.headers.authorization; // Use this to verify the user in your DB

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId, // From your Stripe Dashboard
        quantity: 1,
      }],
      mode: 'subscription', // or 'payment' for tokens
      success_url: `${process.env.FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${process.env.FRONTEND_URL}?status=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
