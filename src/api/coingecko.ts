/**
 * CoinGecko API client (free tier, no API key required)
 * https://www.coingecko.com/api/documentation
 *
 * Rate limits: ~30 requests/min on the free tier.
 * We poll every 15s to stay well within limits.
 */

import type { CoinMarket, SimplePriceResponse } from '../types';

const BASE = 'https://api.coingecko.com/api/v3';

// ── Tracked coins ─────────────────────────────────────────────────────────────
export const TRACKED_IDS = [
  'bitcoin',
  'ethereum',
  'solana',
  'binancecoin',
  'ripple',
  'cardano',
  'avalanche-2',
  'polkadot',
  'chainlink',
  'uniswap',
] as const;

export type CoinId = (typeof TRACKED_IDS)[number];

// ── Requests ──────────────────────────────────────────────────────────────────

/**
 * Fetch full market data for the tracked coins.
 * Used on initial load and periodic full refresh.
 */
export async function fetchMarkets(): Promise<CoinMarket[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    ids: TRACKED_IDS.join(','),
    order: 'market_cap_desc',
    per_page: String(TRACKED_IDS.length),
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h,7d',
  });

  const res = await fetch(`${BASE}/coins/markets?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`CoinGecko /markets error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<CoinMarket[]>;
}

/**
 * Lightweight price-only fetch for live tick updates.
 * Much smaller payload than /markets — used for the high-frequency poll.
 */
export async function fetchLivePrices(): Promise<SimplePriceResponse> {
  const params = new URLSearchParams({
    ids: TRACKED_IDS.join(','),
    vs_currencies: 'usd',
    include_24hr_change: 'true',
  });

  const res = await fetch(`${BASE}/simple/price?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`CoinGecko /simple/price error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SimplePriceResponse>;
}
