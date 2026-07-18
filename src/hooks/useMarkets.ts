import { useState, useEffect, useCallback } from 'react';
import { fetchMarkets } from '../api/coingecko';
import type { CoinMarket, FetchState, SortState, SortKey, PriceUpdate, TickDirection } from '../types';

const FULL_REFRESH_INTERVAL = 60_000; // Full re-fetch every 60s

interface UseMarketsReturn extends FetchState<CoinMarket[]> {
  sortedCoins: CoinMarket[];
  sort: SortState;
  setSort: (key: SortKey) => void;
  filter: string;
  setFilter: (q: string) => void;
  tickDirections: Map<string, TickDirection>;
  applyPriceUpdates: (updates: PriceUpdate[]) => void;
  applyTickDirection: (id: string, direction: TickDirection) => void;
  refresh: () => void;
}

export function useMarkets(): UseMarketsReturn {
  const [state, setState] = useState<FetchState<CoinMarket[]>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });
  const [sort, setSortState] = useState<SortState>({
    key: 'market_cap_rank',
    direction: 'asc',
  });
  const [filter, setFilter] = useState('');
  const [tickDirections, setTickDirections] = useState<Map<string, TickDirection>>(new Map());

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetchMarkets();
      setState({ data, loading: false, error: null, lastUpdated: new Date() });
    } catch (err) {
      setState(s => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch market data',
      }));
    }
  }, []);

  // Initial load + periodic full refresh
  useEffect(() => {
    load();
    const timer = setInterval(load, FULL_REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [load]);

  // Merge lightweight price tick updates into the coin list
  const applyPriceUpdates = useCallback((updates: PriceUpdate[]) => {
    setState(s => {
      if (!s.data) return s;
      const map = new Map(updates.map(u => [u.id, u]));
      const updated = s.data.map(coin => {
        const tick = map.get(coin.id);
        if (!tick) return coin;
        return {
          ...coin,
          current_price: tick.price,
          price_change_percentage_24h: tick.change24h,
        };
      });
      return { ...s, data: updated, lastUpdated: new Date() };
    });
  }, []);

  const applyTickDirection = useCallback((id: string, direction: TickDirection) => {
    setTickDirections(prev => new Map(prev).set(id, direction));
    // Reset to 'flat' after 1.5s so the flash animation only shows briefly
    setTimeout(() => {
      setTickDirections(prev => new Map(prev).set(id, 'flat'));
    }, 1500);
  }, []);

  const setSort = useCallback((key: SortKey) => {
    setSortState(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Compute sorted + filtered view
  const sortedCoins = (() => {
    const coins = state.data ?? [];
    const filtered = filter.trim()
      ? coins.filter(
          c =>
            c.name.toLowerCase().includes(filter.toLowerCase()) ||
            c.symbol.toLowerCase().includes(filter.toLowerCase()),
        )
      : coins;

    return [...filtered].sort((a, b) => {
      const av = a[sort.key] ?? 0;
      const bv = b[sort.key] ?? 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  })();

  return {
    ...state,
    sortedCoins,
    sort,
    setSort,
    filter,
    setFilter,
    tickDirections,
    applyPriceUpdates,
    applyTickDirection,
    refresh: load,
  };
}
