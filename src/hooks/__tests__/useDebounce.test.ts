import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('useDebounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by 400ms (less than delay)
    act(() => {
      jest.advanceTimersByTime(400);
    });
    
    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast-forward time by another 100ms (total 500ms)
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    // First change
    rerender({ value: 'change1', delay: 500 });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Second change before first completes
    rerender({ value: 'change2', delay: 500 });
    
    // Fast-forward by 300ms (total 600ms from first change, 300ms from second)
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Should still be initial because timer was reset
    expect(result.current).toBe('initial');
    
    // Fast-forward by another 200ms to complete the debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Should now be change2
    expect(result.current).toBe('change2');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 100 }
      }
    );

    rerender({ value: 'updated', delay: 100 });
    
    act(() => {
      jest.advanceTimersByTime(99);
    });
    expect(result.current).toBe('initial');
    
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle complex object values', () => {
    const initialObj = { name: 'John', age: 25 };
    const updatedObj = { name: 'Jane', age: 30 };
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 300 }
      }
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj, delay: 300 });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(result.current).toEqual(updatedObj);
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    rerender({ value: 'updated', delay: 200 });
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(result.current).toBe('updated');
  });

  it('should cleanup timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    rerender({ value: 'updated', delay: 500 });
    
    // Unmount before timeout completes
    unmount();
    
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // No errors should occur and no memory leaks
    expect(jest.getTimerCount()).toBe(0);
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 }
      }
    );

    rerender({ value: 'updated', delay: 0 });
    
    act(() => {
      jest.advanceTimersByTime(0);
    });
    
    expect(result.current).toBe('updated');
  });
});