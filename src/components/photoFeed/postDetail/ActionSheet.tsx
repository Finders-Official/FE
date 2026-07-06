import SheetPopup from "./SheetPopup";

export type ActionSheetAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
};

interface ActionSheetProps {
  open: boolean;
  actions: ActionSheetAction[];
  onClose: () => void;
}

export default function ActionSheet({
  open,
  actions,
  onClose,
}: ActionSheetProps) {
  return (
    <SheetPopup
      open={open}
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="bg-neutral-875 my-4 w-full rounded-3xl border border-neutral-800 py-4 text-center text-[0.9375rem] text-neutral-100"
        >
          취소
        </button>
      }
    >
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={() => {
            a.onClick();
            onClose();
          }}
          className={`w-full py-4 text-center text-[0.9375rem] ${
            a.variant === "danger" ? "text-red-400" : "text-neutral-100"
          }`}
        >
          {a.label}
        </button>
      ))}
    </SheetPopup>
  );
}
