import { KakaoFillIcon } from "@/assets/icon";
import { info } from "@/constants/mypage/info.constant";

export function SocialPage() {
  return (
    <div className="py-6">
      <main className="rounded-md border border-neutral-800 p-5 text-neutral-100">
        <p>{info.member.email}</p>
        <div className="mt-3 flex gap-2">
          <KakaoFillIcon className="h-6 w-6 fill-orange-500" />
          <p>카카오톡</p>
        </div>
      </main>
    </div>
  );
}
