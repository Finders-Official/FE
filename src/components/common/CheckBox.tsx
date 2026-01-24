import { EmptyBoxIcon, CheckBoxIcon } from "@/assets/icon";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onClick?: (checked: boolean) => void;
};

export function Checkbox({ checked, onChange, onClick }: CheckboxProps) {
  const handleClick = () => {
    const nextChecked = !checked;

    onChange(nextChecked); // 기본 동작
    onClick?.(nextChecked); // 선택적 동작
  };
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={handleClick}
      className="inline-flex items-center justify-center"
    >
      {checked ? (
        <CheckBoxIcon className="h-4 w-4" />
      ) : (
        <EmptyBoxIcon className="h-4 w-4" />
      )}
    </button>
  );
}
