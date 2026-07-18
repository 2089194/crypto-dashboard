import React from 'react';
import { useMarkets } from './hooks/useMarkets';
import { useLivePrices } from './hooks/useLivePrices';
import { MarketTable } from './components/MarketTable';
import { formatTime } from './utils/format';

const App: React.FC = () => {
  const {
    data,
    sortedCoins,
    loading,
    error,
    sort,
    setSort,
    filter,
    setFilter,
    lastUpdated,
    tickDirections,
    applyPriceUpdates,
    applyTickDirection,
    refresh,
  } = useMarkets();

  // Wire up live price ticks once we have initial data
  useLivePrices({
    coins: data ?? [],
    onTick: applyPriceUpdates,
    onTickDirection: applyTickDirection,
    enabled: !!data && !loading,
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">
            <span className="title-dot" /> Crypto Dashboard
          </h1>
          <p className="app-subtitle">
            Live market data · Top 10 assets by market cap
          </p>
        </div>
        <div className="header-right">
          {lastUpdated && (
            <span className="last-updated">
              Updated {formatTime(lastUpdated)}
            </span>
          )}
          <span className={`status-pill ${data ? 'status-pill--live' : 'status-pill--loading'}`}>
            {data ? '● LIVE' : '○ LOADING'}
          </span>
          <button className="refresh-btn" onClick={refresh} disabled={loading} title="Force refresh">
            ↻
          </button>
        </div>
      </header>

      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="Filter by name or symbol…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {filter && (
          <button className="clear-btn" onClick={() => setFilter('')}>✕ Clear</button>
        )}
        <span className="row-count">
          {sortedCoins.length} asset{sortedCoins.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="error-banner">
          ⚠ {error} — showing cached data.{' '}
          <button className="retry-btn" onClick={refresh}>Retry</button>
        </div>
      )}

      {loading && !data ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Fetching market data…</p>
        </div>
      ) : (
        <MarketTable
          coins={sortedCoins}
          sort={sort}
          onSort={setSort}
          tickDirections={tickDirections}
        />
      )}

      <footer className="app-footer">
        Data: CoinGecko API (free tier) · Updates every 15s ·
        Built with React 18 + TypeScript + Vite ·{' '}
        <a href="https://github.com/[yourname]/crypto-dashboard" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;
