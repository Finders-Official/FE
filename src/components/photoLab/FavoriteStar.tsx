import { StarIcon, StarFillIcon } from "@/assets/icon";
import { Press, IconSwap, NumberPopIn } from "@/components/common";
import { useOptimisticFavorite } from "@/hooks/photoLab";

interface FavoriteStarProps {
  photoLabId: string;
  isFavorite: boolean;
  favoriteCount: number;
  onToggle?: (photoLabId: string, currentIsFavorite: boolean) => void;
  className?: string;
}

export function FavoriteStar({
  photoLabId,
  isFavorite,
  favoriteCount,
  onToggle,
  className = "",
}: FavoriteStarProps) {
  const {
    isFavorite: fav,
    favoriteCount: count,
    toggle,
  } = useOptimisticFavorite({
    isFavorite,
    favoriteCount,
    onToggle: (current) => onToggle?.(photoLabId, current),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Press
        type="button"
        onClick={handleClick}
        className="flex h-6 w-6 shrink-0 items-center justify-center"
        aria-label={fav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        aria-pressed={fav}
      >
        <IconSwap
          active={fav}
          bounce
          className="h-6 w-6 place-items-center"
          iconA={
            <StarIcon className="h-[1.125rem] w-[1.125rem] text-neutral-300" />
          }
          iconB={<StarFillIcon className="h-6 w-6" />}
        />
      </Press>
      <p className="text-[0.625rem] leading-[128%] font-thin tracking-[-0.02em] text-neutral-400">
        <NumberPopIn value={count} />
      </p>
    </div>
  );
}
