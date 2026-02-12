import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

export function useDebouncedTrue(value: boolean, delayMs: number) {
  const [v, setV] = useState(value);

  useEffect(() => {
    if (!value) {
      // OFF는 즉시
      setV(false);
      return;
    }

    // ON만 지연
    const id = window.setTimeout(() => setV(true), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return v;
}
