import type { LabPreview } from "@/types/photoLabSearch";
import LabPreviewItem from "@/components/photoLab/search/LabPreviewItem";

interface LabPreviewSectionProps {
  labs: LabPreview[];
  onLabClick?: (photoLabId: number) => void;
}

export default function LabPreviewSection({
  labs,
  onLabClick,
}: LabPreviewSectionProps) {
  if (labs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5">
      {labs.map((lab) => (
        <LabPreviewItem
          key={lab.photoLabId}
          lab={lab}
          onClick={() => onLabClick?.(lab.photoLabId)}
        />
      ))}
    </div>
  );
}
