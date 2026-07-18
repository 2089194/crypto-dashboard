# Crypto Dashboard

A real-time cryptocurrency market data dashboard built with **React 18**, **TypeScript**, and **Vite**. Tracks the top 10 assets by market cap using the CoinGecko public API, with live price tick updates every 15 seconds.

Built to develop hands-on experience with the React + TypeScript stack and the specific problem of displaying large, fast-moving datasets clearly and efficiently — directly relevant to data-intensive trading and fintech UI development.

---

## Features

- **Live price ticks** — lightweight poll every 15s merges price updates into the grid with green/red flash animations on change
- **Sortable columns** — click any column header to sort ascending/descending (rank, price, 24h%, 7d%, volume, market cap)
- **Real-time filter** — instant client-side search by name or symbol
- **Performance-conscious rendering** — `React.memo` on every row prevents unnecessary re-renders when only one coin's price updates; CSS class-based animations rather than inline style recalculation
- **Full TypeScript** — strict mode, typed API responses, typed component props throughout
- **Responsive** — secondary columns hidden on mobile, core data always visible
- **Error resilience** — poll errors are swallowed silently (stale data > crash); full-refresh errors surface a retry banner

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 | Industry standard; hooks model maps cleanly onto live data flows |
| Language | TypeScript (strict) | Catches shape mismatches at compile time — critical when API responses change |
| Build tool | Vite | Fast HMR, minimal config, native ESM |
| Data | CoinGecko free API | No API key required; realistic market data shapes |
| Styling | Plain CSS with variables | Zero runtime overhead vs CSS-in-JS; full control over animation timing |

---

## Architecture notes

**Two-tier data fetching:** `useMarkets` fetches full market data on load and every 60s. `useLivePrices` polls the lightweight `/simple/price` endpoint every 15s for price-only updates. This mirrors how real trading systems separate slow reference data from fast market data feeds — the full fetch is expensive, the tick is cheap.

**Tick direction tracking:** `useLivePrices` compares each new price against the previous value, emits `up`/`down`/`flat`, and the UI flashes the row accordingly. The direction resets to `flat` after 1.5s so animations only trigger on genuine changes, not on every render.

**Memoised rows:** each `CoinRow` is wrapped in `React.memo`. When a price tick arrives for Bitcoin, only the Bitcoin row re-renders — the other 9 rows are skipped entirely. This becomes significant as the grid grows.

---

## Quickstart

```bash
git clone https://github.com/2089194/crypto-dashboard
cd crypto-dashboard
npm install
npm run dev
```

Open `http://localhost:5173`.

```bash
npm run build       # Production build
npm run type-check  # TypeScript check without emit
npm run preview     # Preview production build locally
```

---

## Author

[github.com/2089194]
