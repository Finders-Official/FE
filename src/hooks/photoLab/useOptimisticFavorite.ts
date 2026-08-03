import { useState } from "react";

interface UseOptimisticFavoriteParams {
  isFavorite: boolean;
  favoriteCount: number;
  onToggle?: (currentIsFavorite: boolean) => void;
}

interface UseOptimisticFavoriteResult {
  isFavorite: boolean;
  favoriteCount: number;
  toggle: () => void;
}

export function useOptimisticFavorite({
  isFavorite: serverFavorite,
  favoriteCount: serverCount,
  onToggle,
}: UseOptimisticFavoriteParams): UseOptimisticFavoriteResult {
  const [favorite, setFavorite] = useState(serverFavorite);
  const [count, setCount] = useState(serverCount);
  const [prevServerFavorite, setPrevServerFavorite] = useState(serverFavorite);
  const [prevServerCount, setPrevServerCount] = useState(serverCount);

  if (serverFavorite !== prevServerFavorite) {
    setPrevServerFavorite(serverFavorite);
    setFavorite(serverFavorite);
  }
  if (serverCount !== prevServerCount) {
    setPrevServerCount(serverCount);
    setCount(serverCount);
  }

  const toggle = () => {
    const next = !favorite;
    onToggle?.(favorite); // 서버엔 현재값 전달
    setFavorite(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
  };

  return { isFavorite: favorite, favoriteCount: count, toggle };
}
