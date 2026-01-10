import { EmptyBoxIcon, CheckBoxIcon } from "@/assets/icon";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center justify-center"
    >
      {checked ? (
        <CheckBoxIcon className="h-4 w-4 text-orange-500 [&_path]:fill-white" />
      ) : (
        <EmptyBoxIcon className="h-4 w-4" />
      )}
    </button>
  );
}
