import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any fast-changing value (e.g. search query or input fields)
 * @param value The value to debounce
 * @param delayMs The debounce delay in milliseconds (default 300ms)
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export default useDebounce;
