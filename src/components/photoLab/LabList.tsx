import type { PhotoLabItem } from "@/types/photoLab";
import LabCard from "./LabCard";

interface LabListProps {
  labs: PhotoLabItem[];
  onFavoriteToggle?: (photoLabId: number) => void;
  onCardClick?: (photoLabId: number) => void;
  className?: string;
}

export default function LabList({
  labs,
  onFavoriteToggle,
  onCardClick,
  className = "",
}: LabListProps) {
  if (labs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-neutral-400">현상소가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {labs.map((lab) => (
        <LabCard
          key={lab.photoLabId}
          lab={lab}
          onFavoriteToggle={onFavoriteToggle}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}

export type { LabListProps };
