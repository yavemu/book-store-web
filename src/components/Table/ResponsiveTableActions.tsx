"use client";

import React, { useState } from 'react';
import { TableAction } from '@/hooks/table/useTableActions';

interface ResponsiveTableActionsProps {
  record: any;
  actions: TableAction[];
  getButtonClassName: (variant?: string) => string;
  compact?: boolean;
  maxVisibleActions?: number;
}

export default function ResponsiveTableActions({
  record,
  actions,
  getButtonClassName,
  compact = false,
  maxVisibleActions = 2
}: ResponsiveTableActionsProps) {
  const [showAll, setShowAll] = useState(false);

  if (actions.length === 0) {
    return <span>-</span>;
  }

  const visibleActions = compact && !showAll 
    ? actions.slice(0, maxVisibleActions)
    : actions;
  
  const hiddenActionsCount = actions.length - maxVisibleActions;

  if (compact) {
    return (
      <div className="table-actions-compact">
        <div className="flex gap-1">
          {visibleActions.map((action, index) => (
            <button
              key={`${action.label}-${index}`}
              onClick={() => action.onClick(record)}
              className={`${getButtonClassName(action.variant)} compact-action-btn`}
              title={action.label}
            >
              {action.icon ? (
                <span className="text-sm">{action.icon}</span>
              ) : (
                <span className="text-xs">{action.label.charAt(0)}</span>
              )}
            </button>
          ))}
          
          {hiddenActionsCount > 0 && !showAll && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAll(true);
              }}
              className="compact-action-btn bg-gray-100 text-gray-600 hover:bg-gray-200"
              title={`${hiddenActionsCount} acciones más`}
            >
              <span className="text-xs">+{hiddenActionsCount}</span>
            </button>
          )}
        </div>

        {/* Dropdown con todas las acciones en mobile */}
        {showAll && compact && (
          <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
            {actions.map((action, index) => (
              <button
                key={`dropdown-${action.label}-${index}`}
                onClick={() => {
                  action.onClick(record);
                  setShowAll(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            ))}
            <button
              onClick={() => setShowAll(false)}
              className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 border-t border-gray-200"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    );
  }

  // Versión completa para desktop
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