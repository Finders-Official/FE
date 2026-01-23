import { EmptyBoxIcon, CheckBoxIcon } from "@/assets/icon";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  iconClassName?: string;
};

export function Checkbox({
  checked,
  onChange,
  iconClassName = "h-4 w-4",
}: CheckboxProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
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
