import React from 'react';
import type { SortKey, SortState } from '../types';

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  align?: 'left' | 'right';
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({ label, sortKey, sort, onSort, align = 'right' }) => {
  const active = sort.key === sortKey;
  const arrow = active ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : '';
  return (
    <th
      className={`col-header col-header--${align} ${active ? 'col-header--active' : ''}`}
      onClick={() => onSort(sortKey)}
      title={`Sort by ${label}`}
    >
      {label}{arrow}
    </th>
  );
};
