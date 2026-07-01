import { useEffect, useRef, useState } from "react";
import type { RevealState } from "./hooks";

export interface PresenceEntry<T> {
  key: string;
  item: T;
  state: RevealState; // "closed" | "open" | "closing"
}

export function useAnimatedPresence<T>(
  items: T[],
  getKey: (item: T) => string,
  exitMs = 200,
): PresenceEntry<T>[] {
  const getKeyRef = useRef(getKey);
  getKeyRef.current = getKey;

  const [entries, setEntries] = useState<PresenceEntry<T>[]>(() =>
    items.map((item) => ({
      key: getKey(item),
      item,
      state: "open" as RevealState,
    })),
  );
  const timers = useRef(new Map<string, number>());

  useEffect(() => {
    const key = getKeyRef.current;
    const currentKeys = new Set(items.map(key));

    setEntries((prev) => {
      const prevKeys = new Set(prev.map((e) => e.key));

      const kept = prev.map((e): PresenceEntry<T> => {
        if (currentKeys.has(e.key)) {
          // 되살아난 경우(닫히던 중 재선택) 예약된 제거를 취소하고 open으로
          const timer = timers.current.get(e.key);
          if (timer) {
            clearTimeout(timer);
            timers.current.delete(e.key);
          }
          const item = items.find((it) => key(it) === e.key) as T;
          return {
            key: e.key,
            item,
            state: e.state === "closing" ? "open" : e.state,
          };
        }
        if (!timers.current.has(e.key)) {
          const id = window.setTimeout(() => {
            timers.current.delete(e.key);
            setEntries((cur) => cur.filter((x) => x.key !== e.key));
          }, exitMs);
          timers.current.set(e.key, id);
        }
        return { ...e, state: "closing" };
      });

      const added = items
        .filter((it) => !prevKeys.has(key(it)))
        .map(
          (it): PresenceEntry<T> => ({
            key: key(it),
            item: it,
            state: "closed",
          }),
        );

      return [...kept, ...added];
    });
  }, [items, exitMs]);

  // 새로 붙은 closed 항목을 다음 프레임에 open으로, 등장 애니메이션 트리거
  useEffect(() => {
    if (!entries.some((e) => e.state === "closed")) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setEntries((prev) =>
          prev.map((e) => (e.state === "closed" ? { ...e, state: "open" } : e)),
        ),
      ),
    );
    return () => cancelAnimationFrame(id);
  }, [entries]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((id) => clearTimeout(id));
      map.clear();
    };
  }, []);

  return entries;
}
