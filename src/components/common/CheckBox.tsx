import { EmptyBoxIcon, CheckBoxIcon } from "@/assets/icon";

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
    <button
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
      className="inline-flex items-center justify-center"
    >
      {checked ? (
        <CheckBoxIcon className={iconClassName} />
      ) : (
        <EmptyBoxIcon className={iconClassName} />
      )}
    </button>
  );
}
