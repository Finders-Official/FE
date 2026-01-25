import { EmptyCircleIcon, CircleFillIcon } from "@/assets/icon";

type SearchFilterProps = {
  text: string;
  isSelected: boolean;
  onClick?: () => void;
};

export default function SearchFilter({
  text,
  isSelected,
  onClick,
}: SearchFilterProps) {
  return (
    <div className="justify-between">
      <span>{text}</span>
      <button type="button" onClick={onClick}>
        {isSelected ? <CircleFillIcon /> : <EmptyCircleIcon />}
      </button>
    </div>
  );
}
