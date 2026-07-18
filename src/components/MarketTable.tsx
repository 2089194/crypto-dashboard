/**
 * MarketTable
 * ===========
 * The core data grid. Renders a sortable, filterable table of live crypto
 * market data. Each row uses React.memo to prevent unnecessary re-renders
 * when only one coin's price updates — critical for performance when many
 * rows are visible simultaneously.
 *
 * This is the component most directly analogous to the "live grids" Elwood
 * describes — the goal is the same: large, fast-moving datasets displayed
 * clearly, accurately, and without lag.
 */

import React from 'react';
import type { CoinMarket, SortState, SortKey, TickDirection } from '../types';
import { PriceCell } from './PriceCell';
import { ChangeCell } from './ChangeCell';
import { SortableHeader } from './SortableHeader';
import { formatLarge } from '../utils/format';

interface RowProps {
  coin: CoinMarket;
  direction: TickDirection;
}

// Memoised row — only re-renders when this coin's data actually changes
const CoinRow: React.FC<RowProps> = React.memo(({ coin, direction }) => (
  <tr className={`coin-row coin-row--${direction}`}>
    <td className="col-rank">{coin.market_cap_rank}</td>
    <td className="col-name">
      <img src={coin.image} alt={coin.name} className="coin-icon" width={20} height={20} />
      <span className="coin-name">{coin.name}</span>
      <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
    </td>
    <td className="col-price">
      <PriceCell price={coin.current_price} direction={direction} />
    </td>
    <td className="col-change">
      <ChangeCell value={coin.price_change_percentage_24h} />
    </td>
    <td className="col-change">
      <ChangeCell value={coin.price_change_percentage_7d_in_currency} />
    </td>
    <td className="col-large">{formatLarge(coin.total_volume)}</td>
    <td className="col-large">{formatLarge(coin.market_cap)}</td>
    <td className="col-range">
      <span className="range-low">{formatLarge(coin.low_24h)}</span>
      <span className="range-sep"> / </span>
      <span className="range-high">{formatLarge(coin.high_24h)}</span>
    </td>
  </tr>
));

CoinRow.displayName = 'CoinRow';

interface MarketTableProps {
  coins: CoinMarket[];
  sort: SortState;
  onSort: (key: SortKey) => void;
  tickDirections: Map<string, TickDirection>;
}

export const MarketTable: React.FC<MarketTableProps> = ({ coins, sort, onSort, tickDirections }) => {
  if (coins.length === 0) {
    return <div className="empty-state">No coins match your search.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="market-table">
        <thead>
          <tr>
            <SortableHeader label="#"          sortKey="market_cap_rank"                    sort={sort} onSort={onSort} align="left" />
            <th className="col-header col-header--left">Asset</th>
            <SortableHeader label="Price"      sortKey="current_price"                      sort={sort} onSort={onSort} />
            <SortableHeader label="24h %"      sortKey="price_change_percentage_24h"        sort={sort} onSort={onSort} />
            <SortableHeader label="7d %"       sortKey="price_change_percentage_7d_in_currency" sort={sort} onSort={onSort} />
            <SortableHeader label="Volume 24h" sortKey="total_volume"                       sort={sort} onSort={onSort} />
            <SortableHeader label="Market Cap" sortKey="market_cap"                         sort={sort} onSort={onSort} />
            <th className="col-header col-header--right">24h Range</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <CoinRow
              key={coin.id}
              coin={coin}
              direction={tickDirections.get(coin.id) ?? 'flat'}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
