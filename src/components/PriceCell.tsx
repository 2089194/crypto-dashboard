/**
 * PriceCell
 * =========
 * Renders a price value and flashes green/red for 1.5s when a live tick
 * arrives with a higher/lower price than the previous value.
 *
 * Uses CSS classes rather than inline style recalculation on every render
 * to keep paint cost minimal — important when many cells update simultaneously
 * in a real-time data grid.
 */

import React from 'react';
import type { TickDirection } from '../types';
import { formatPrice } from '../utils/format';

interface PriceCellProps {
  price: number;
  direction: TickDirection;
}

export const PriceCell: React.FC<PriceCellProps> = React.memo(({ price, direction }) => {
  return (
    <span className={`price-cell price-cell--${direction}`}>
      {formatPrice(price)}
    </span>
  );
});

PriceCell.displayName = 'PriceCell';
