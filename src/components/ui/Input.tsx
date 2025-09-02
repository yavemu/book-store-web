import { useRef, useEffect, useCallback } from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = ''
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);
  const wasFocusedRef = useRef<boolean>(false);

  // Preserve cursor position and focus when value changes
  useEffect(() => {
    if (inputRef.current && wasFocusedRef.current) {
      const input = inputRef.current;
      const cursorPosition = cursorPositionRef.current;
      
      // Restore focus if it was focused before
      if (document.activeElement !== input) {
        input.focus();
      }
      
      // Restore cursor position
      try {
        input.setSelectionRange(cursorPosition, cursorPosition);
      } catch (error) {
        // Silent fail for cursor position restoration
      }
    }
  }, [value]);

  // Track focus state
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    wasFocusedRef.current = true;
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    wasFocusedRef.current = false;
  }, []);

  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    
    // Save cursor position before state update
    cursorPositionRef.current = input.selectionStart || 0;
    
    onChange(newValue);
  }, [onChange]);

  // Handle paste events specifically
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    
    // Save cursor position before paste
    const cursorPos = input.selectionStart || 0;
    cursorPositionRef.current = cursorPos;
    
    // Let the paste happen naturally, then update state
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const newValue = inputRef.current.value;
        const newCursorPos = inputRef.current.selectionStart || 0;
        cursorPositionRef.current = newCursorPos;
        
        if (newValue !== value) {
          onChange(newValue);
        }
      }
    });
  }, [onChange, value]);

  // Handle copy events
  const handleCopy = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    
    // Save cursor position after copy
    setTimeout(() => {
      if (inputRef.current === document.activeElement) {
        cursorPositionRef.current = inputRef.current.selectionStart || 0;
      }
    }, 0);
  }, []);

  return (
    <input
      ref={inputRef}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      onCopy={handleCopy}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      required={required}
      className={`search-input ${className}`}
    />
  );
}