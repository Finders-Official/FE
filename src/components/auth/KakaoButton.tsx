import { KakaoIcon } from "@/assets/icon";
import { Press } from "@/components/common";

interface KakaoButtonProps {
  onClick?: () => void;
}
export const KakaoButton = ({ onClick }: KakaoButtonProps) => {
  return (
    <Press
      type="button"
      className="inline-flex h-[3.125rem] w-full items-center justify-center gap-1 rounded-2xl bg-[#FEE500] font-semibold text-neutral-900 shadow-sm"
      onClick={onClick}
    >
      <KakaoIcon className="h-4 w-4" />
      <span className="font-semibold">카카오로 계속하기</span>
    </Press>
  );
};
