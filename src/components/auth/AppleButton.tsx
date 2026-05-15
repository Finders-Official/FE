import { AppleIcon } from "@/assets/icon";

interface AppleButtonProps {
  onClick?: () => void;
}
export const AppleButton = ({ onClick }: AppleButtonProps) => {
  return (
    <button
      type="button"
      className="inline-flex h-[3.125rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#040505] font-semibold text-white shadow-sm active:scale-[0.99]"
      onClick={onClick}
    >
      <AppleIcon className="h-6 w-6" aria-label="Apple Logo" />
      <span>애플로 로그인</span>
    </button>
  );
};

export default AppleButton;
