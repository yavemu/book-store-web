import React from "react";
import { TextareaProps } from "../types/TextareaProps";

interface ExtendedTextareaProps extends TextareaProps {
  error?: string;
}

export function Textarea({ label, error, className, ...props }: ExtendedTextareaProps) {
  const baseClasses = "mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const normalClasses = "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
  const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
  
  const textareaClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className || ""}`;
  
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
      <textarea 
        {...props} 
        className={textareaClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
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
