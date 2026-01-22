import { useState, useCallback, useEffect } from "react";
import type { RecentSearch } from "@/types/photoLabSearch";

const STORAGE_KEY = "photolab_recent_searches";
const MAX_ITEMS = 20;

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadFromStorage(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(searches: RecentSearch[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() =>
    loadFromStorage(),
  );

  // localStorage 동기화
  useEffect(() => {
    saveToStorage(recentSearches);
  }, [recentSearches]);

  const addSearch = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      // 중복 제거
      const filtered = prev.filter((s) => s.keyword !== trimmed);
      const newSearch: RecentSearch = {
        id: generateId(),
        keyword: trimmed,
        timestamp: Date.now(),
      };
      // 최신순, 최대 20개
      return [newSearch, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const removeSearch = useCallback((id: string) => {
    setRecentSearches((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setRecentSearches([]);
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll,
  };
}
