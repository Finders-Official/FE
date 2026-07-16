import { EmptyCircleIcon, CircleFillIcon } from "@/assets/icon";
import { IconSwap, Press } from "@/components/common";

type Props = {
  text: string;
  selected: boolean;
  onSelect: () => void;
};

export default function SearchFilterItem({ text, selected, onSelect }: Props) {
  return (
    <Press
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between"
      role="radio"
      aria-checked={selected}
    >
      <span className="text-base font-light text-white">{text}</span>
      <IconSwap
        active={selected}
        className="h-6 w-6"
        iconA={<EmptyCircleIcon className="h-6 w-6 text-neutral-500" />}
        iconB={<CircleFillIcon className="h-6 w-6 text-orange-500" />}
      />
    </Press>
  );
}
