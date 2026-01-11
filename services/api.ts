
import { LogType, UserTier } from '../types';

export class ApiService {
  private static getBaseUrl() {
      // In production (Vercel), we rely on relative paths or a specific environment URL
      if (typeof window === 'undefined') return process.env.FRONTEND_URL || '';
      return ''; // Client side uses relative paths
  }

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
  static async createCheckoutSession(
      priceId: string, 
      operatorId: string,
      token: string | null, 
      origin: 'MENERVA' | 'AETHERIOS' = 'AETHERIOS'
  ): Promise<{ url: string } | null> {
    const baseUrl = this.getBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/payments/create-session`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ 
            priceId,
            operatorId,
            metadata: {
                project_origin: origin,
                causal_lock: 'true',
                deployment_v: '1.3.1_radiant'
            }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gateway Desynchronized: Handshake Failed.');
      }
      
      return await response.json();
    } catch (err: any) {
      console.error("MINERVA_API_ERROR [Procurement]:", err);
      // Ensure the UI gets a clean error message, even if fetch completely fails (e.g. offline)
      if (err.message.includes('fetch')) {
          throw new Error("Gateway Offline: Unable to contact institutional payment rail.");
      }
      throw err;
    }
  }

  /**
   * Fetches the latest operator data from the Vercel backend.
   * Includes high-resonance synchronization status.
   */
  static async syncOperatorProfile(token: string | null): Promise<{ tier: UserTier; tokens: number; legacyPoints: number } | null> {
    const baseUrl = this.getBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/operator/profile`, {
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
