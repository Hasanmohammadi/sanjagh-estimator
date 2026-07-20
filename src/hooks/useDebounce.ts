// hooks/useDebounce.ts
import { useEffect, useRef, useState } from "react";

type UseDebounceOptions<T> = {
  skipFirstRender?: boolean;
  enabled?: boolean;
  callback?: (value: T) => void;
};

export function useDebounce<T>(
  value: T,
  delay: number,
  options: UseDebounceOptions<T> = {},
): { debouncedValue: T; isWaiting: boolean } {
  const { skipFirstRender = true, enabled = true, callback } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isWaiting, setIsWaiting] = useState(false);
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use ref for callback to avoid dependency issues
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Use ref for enabled to avoid dependency issues
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // Stringify value to detect actual changes
  const valueRef = useRef(JSON.stringify(value));

  useEffect(() => {
    const currentValueString = JSON.stringify(value);

    // Skip if value hasn't actually changed
    if (valueRef.current === currentValueString) {
      return;
    }
    valueRef.current = currentValueString;

    // Skip first render
    if (skipFirstRender && isFirstRender.current) {
      isFirstRender.current = false;
      setDebouncedValue(value);
      return;
    }

    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // If disabled, update immediately
    if (!enabledRef.current) {
      setDebouncedValue(value);
      setIsWaiting(false);
      return;
    }

    setIsWaiting(true);

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsWaiting(false);
      callbackRef.current?.(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay, skipFirstRender]);

  return { debouncedValue, isWaiting };
}
