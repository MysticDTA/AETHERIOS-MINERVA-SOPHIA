
import { LogType, UserTier } from '../types';

export class ApiService {
  private static getHeaders(token?: string | null) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Initializes a Stripe Checkout session.
   * Path matches the Vercel serverless function location.
   */
  static async createCheckoutSession(priceId: string, token: string | null): Promise<{ url: string } | null> {
    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gateway unavailable.');
      }
      
      return await response.json();
    } catch (err) {
      console.error("MINERVA_API_ERROR [Checkout]:", err);
      return null;
    }
  }

  /**
   * Fetches the latest operator data from the Vercel backend.
   */
  static async syncOperatorProfile(token: string | null): Promise<{ tier: UserTier; tokens: number } | null> {
    try {
      const response = await fetch('/api/operator/profile', {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      return null;
    }
  }
}
