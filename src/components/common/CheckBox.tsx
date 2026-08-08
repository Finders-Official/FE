import { EmptyBoxIcon, CheckBoxIcon } from "@/assets/icon";
import { IconSwap, Press } from "@/components/common/motion";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  iconClassName?: string;
  onClick?: (checked: boolean) => void;
  ariaLabel?: string;
};

export function Checkbox({
  checked,
  onChange,
  iconClassName = "h-4 w-4",
  onClick,
  ariaLabel,
}: CheckboxProps) {
  const handleClick = () => {
    const nextChecked = !checked;

    onChange(nextChecked); // 기본 동작
    onClick?.(nextChecked); // 선택적 동작
  };
  return (
    <Press
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
      className="inline-flex items-center justify-center"
    >
      <IconSwap
        active={checked}
        className={iconClassName}
        iconA={<EmptyBoxIcon className={iconClassName} />}
        iconB={<CheckBoxIcon className={iconClassName} />}
      />
    </Press>
  );
}
