import React from "react";
import { SelectProps } from "../types/SelectProps";

interface SelectWithCreateProps extends SelectProps {
  onCreateNew?: () => void;
  createLabel?: string;
  showCreateButton?: boolean;
  loading?: boolean;
}

export function SelectWithCreate({ 
  label, 
  children, 
  onCreateNew,
  createLabel = "Crear nuevo",
  showCreateButton = true,
  loading = false,
  error,
  ...props 
}: SelectWithCreateProps) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          {showCreateButton && onCreateNew && (
            <button
              type="button"
              onClick={onCreateNew}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title={createLabel}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </button>
          )}
        </div>
      )}
      
      <select 
        {...props}
        disabled={props.disabled || loading}
        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        } ${props.className || ""}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      >
        {children}
      </select>
      
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}