"use client";

import React from 'react';
import { TableAction } from '@/hooks/table/useTableActions';

interface TableActionsProps {
  record: any;
  actions: TableAction[];
  getButtonClassName: (variant?: string) => string;
}

export default function TableActions({
  record,
  actions,
  getButtonClassName
}: TableActionsProps) {
  if (actions.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="table-actions">
      {actions.map((action, index) => (
        <button
          key={`${action.label}-${index}`}
          onClick={() => action.onClick(record)}
          className={getButtonClassName(action.variant)}
          title={action.label}
        >
          {action.icon && <span className="action-icon">{action.icon}</span>}
          <span className="action-label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
