import { AppleIcon } from "@/assets/icon";
import { Press } from "@/components/common";

interface AppleButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}
export const AppleButton = ({ onClick, disabled }: AppleButtonProps) => {
  return (
    <Press
      type="button"
      disabled={disabled}
      className="inline-flex h-[3.125rem] w-full items-center justify-center gap-1 rounded-2xl bg-[#FFF] font-semibold text-white shadow-sm disabled:opacity-60"
      onClick={onClick}
    >
      <AppleIcon className="h-4.5 w-4.5" aria-hidden="true" />
      <span className="font-semibold text-[#000]">Apple로 계속하기</span>
    </Press>
  );
};
