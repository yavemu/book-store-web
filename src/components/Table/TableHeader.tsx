"use client";

import React from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showCreateButton?: boolean;
  showStats?: boolean;
  totalItems?: number;
  totalPages?: number;
}

export default function TableHeader({
  children,
  showSearch = false,
  showCreateButton = false,
  showStats = false,
  totalItems = 0,
  totalPages = 0
}: TableHeaderProps) {
  return (
    <div className="table-header">
      {(showSearch || showStats) && (
        <div className="header-left">
          {children}
          {showStats && (
            <div className="table-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{totalItems}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Páginas:</span>
                <span className="stat-value">{totalPages}</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {showCreateButton && (
        <div className="header-right">
          {children}
        </div>
      )}
    </div>
  );
}