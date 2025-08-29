import React from "react";
import { SelectProps } from "../types/SelectProps";

export function Select({ label, options, error, className, children, ...props }: SelectProps) {
  const baseClasses = "mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const normalClasses = "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
  const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
  
  const selectClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className || ""}`;
  
  return (
    <div>
      {label && (
        <label 
          htmlFor={props.id} 
          className={`block text-sm font-medium ${error ? 'text-red-700' : 'text-gray-700'} mb-1`}
        >
          {label}
        </label>
      )}
      <select 
        {...props} 
        className={selectClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      >
        {props.placeholder && (
          <option value="" disabled>
            {props.placeholder}
          </option>
        )}
        {options && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
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
