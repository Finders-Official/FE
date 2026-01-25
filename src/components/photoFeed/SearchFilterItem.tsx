import { EmptyCircleIcon, CircleFillIcon } from "@/assets/icon";

type Props = {
  text: string;
  selected: boolean;
  onSelect: () => void;
};

export default function SearchFilterItem({ text, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between"
      role="radio"
      aria-checked={selected}
    >
      <span className="text-base font-light text-white">{text}</span>
      {selected ? (
        <CircleFillIcon className="h-6 w-6 text-orange-500" />
      ) : (
        <EmptyCircleIcon className="h-6 w-6 text-neutral-500" />
      )}
    </button>
  );
}
