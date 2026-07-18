import React from 'react';
import { formatPct } from '../utils/format';

interface ChangeCellProps {
  value: number | null | undefined;
}

export const ChangeCell: React.FC<ChangeCellProps> = React.memo(({ value }) => {
  if (value == null) return <span className="change-cell change-cell--flat">—</span>;
  const cls = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  return (
    <span className={`change-cell change-cell--${cls}`}>
      {value > 0 ? '▲' : value < 0 ? '▼' : ''} {formatPct(value)}
    </span>
  );
});

ChangeCell.displayName = 'ChangeCell';
