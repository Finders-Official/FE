import { AppleIcon } from "@/assets/icon";

interface AppleButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}
export const AppleButton = ({ onClick, disabled }: AppleButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-[3.125rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#040505] font-semibold text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
      onClick={onClick}
    >
      <AppleIcon className="h-5.5 w-5.5" aria-label="Apple Logo" />
      <span className="font-normal">Apple로 계속하기</span>
    </button>
  );
};

export default AppleButton;
