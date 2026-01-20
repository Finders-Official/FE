import type { PopularLab } from "@/types/photoLabSearch";
import PopularLabItem from "./PopularLabItem";

interface PopularLabSectionProps {
  labs: PopularLab[];
  onLabClick?: (photoLabId: number) => void;
}

export default function PopularLabSection({
  labs,
  onLabClick,
}: PopularLabSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
        최근 인기 현상소
      </h2>
      <div className="flex flex-col gap-2">
        {labs.map((lab) => (
          <PopularLabItem
            key={lab.photoLabId}
            rank={lab.rank}
            name={lab.name}
            onClick={() => onLabClick?.(lab.photoLabId)}
          />
        ))}
      </div>
    </section>
  );
}
