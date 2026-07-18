// ── API response shapes ───────────────────────────────────────────────────────

/** Raw coin object returned by CoinGecko /coins/markets */
export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  last_updated: string;
}

/** CoinGecko /simple/price response shape */
export type SimplePriceResponse = Record<
  string,
  { usd: number; usd_24h_change: number }
>;

// ── Application state shapes ──────────────────────────────────────────────────

export type SortKey =
  | 'market_cap_rank'
  | 'current_price'
  | 'price_change_percentage_24h'
  | 'price_change_percentage_7d_in_currency'
  | 'total_volume'
  | 'market_cap';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// ── Live price update shape (simulated WebSocket-style polling) ───────────────

export interface PriceUpdate {
  id: string;
  price: number;
  change24h: number;
  timestamp: number;
}

export type TickDirection = 'up' | 'down' | 'flat';
