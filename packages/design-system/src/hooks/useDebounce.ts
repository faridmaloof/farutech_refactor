import { useState, useCallback, useEffect } from 'react';

export interface UseDebounceOptions {
  delay?: number;
}

export function useDebounce<T>(value: T, { delay = 300 }: UseDebounceOptions = {}): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export interface UseDebouncedCallbackOptions {
  delay?: number;
  leading?: boolean;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  { delay = 300, leading = false }: UseDebouncedCallbackOptions = {}
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isLeading, setIsLeading] = useState(leading);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (leading && !timeoutId) {
      callback(...args);
      setIsLeading(false);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      if (!leading || !isLeading) {
        callback(...args);
      }
      setIsLeading(leading);
      setTimeoutId(null);
    }, delay);

    setTimeoutId(newTimeoutId);
  }, [callback, delay, leading, isLeading, timeoutId]);

  return debouncedCallback as T;
}
