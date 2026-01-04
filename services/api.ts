
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
   * Supports metadata for cross-project integration (Menerva vs Aetherios).
   */
  static async createCheckoutSession(priceId: string, token: string | null, origin: 'MENERVA' | 'AETHERIOS' = 'AETHERIOS'): Promise<{ url: string } | null> {
    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ 
            priceId,
            metadata: {
                project_origin: origin,
                causal_lock: 'true'
            }
        }),
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
   * Now includes Menerva legacy points and project synchronization status.
   */
  static async syncOperatorProfile(token: string | null): Promise<{ tier: UserTier; tokens: number; legacyPoints: number } | null> {
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
