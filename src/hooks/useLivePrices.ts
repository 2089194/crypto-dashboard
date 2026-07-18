/**
 * useLivePrices
 * =============
 * Polls CoinGecko's lightweight /simple/price endpoint every TICK_INTERVAL ms
 * and merges price updates into the coin list returned by useMarkets.
 *
 * Design note:
 * In a production trading UI this would be a WebSocket connection (e.g. to a
 * market data feed). CoinGecko's free tier doesn't offer WS, so we simulate
 * the same "live tick" UX with a short-interval poll and track which cells
 * changed direction (up/down) so the UI can flash accordingly.
 *
 * The separation between a full /markets fetch (useMarkets) and this
 * lightweight price-only tick is deliberate — it mirrors how real trading
 * systems separate slow "reference data" from fast "market data" feeds.
 */

import { useEffect, useRef, useCallback } from 'react';
import { fetchLivePrices } from '../api/coingecko';
import type { CoinMarket, PriceUpdate, TickDirection } from '../types';

const TICK_INTERVAL = 15_000; // 15 seconds — respects CoinGecko free tier

interface UseLivePricesOptions {
  coins: CoinMarket[];
  onTick: (updates: PriceUpdate[]) => void;
  onTickDirection: (id: string, direction: TickDirection) => void;
  enabled: boolean;
}

export function useLivePrices({
  coins,
  onTick,
  onTickDirection,
  enabled,
}: UseLivePricesOptions): void {
  const prevPrices = useRef<Map<string, number>>(new Map());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    try {
      const prices = await fetchLivePrices();
      const updates: PriceUpdate[] = [];

      for (const [id, data] of Object.entries(prices)) {
        const prev = prevPrices.current.get(id);
        const direction: TickDirection =
          prev === undefined || data.usd === prev
            ? 'flat'
            : data.usd > prev
            ? 'up'
            : 'down';

        onTickDirection(id, direction);
        prevPrices.current.set(id, data.usd);

        updates.push({
          id,
          price: data.usd,
          change24h: data.usd_24h_change,
          timestamp: Date.now(),
        });
      }

      onTick(updates);
    } catch {
      // Swallow poll errors silently — stale data is better than a crash
      // A production implementation would log to an observability service
    }
  }, [onTick, onTickDirection]);

  useEffect(() => {
    // Seed prevPrices from the initial full market fetch
    for (const coin of coins) {
      prevPrices.current.set(coin.id, coin.current_price);
    }
  }, [coins]);

  useEffect(() => {
    if (!enabled || coins.length === 0) return;

    timerRef.current = setInterval(poll, TICK_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, coins.length, poll]);
}
