import { AppleIcon, KakaoFillIcon } from "@/assets/icon";
import { useMe } from "@/hooks/member";
import type { SocialProvider } from "@/types/mypage/info";

function ProviderBadge({ provider }: { provider?: SocialProvider }) {
  if (provider === "KAKAO") {
    return (
      <>
        <KakaoFillIcon className="h-6 w-6 fill-orange-500" />
        <p>카카오</p>
      </>
    );
  }

  if (provider === "APPLE") {
    return (
      <>
        <AppleIcon className="h-6 w-6 text-neutral-100" />
        <p>Apple</p>
      </>
    );
  }

  return <p>{provider}</p>;
}

export function SocialPage() {
  const { data: meData } = useMe();

  const social = meData?.roleData.user?.socialAccounts?.[0];

  return (
    <div className="py-6">
      <main className="rounded-[0.625rem] border border-neutral-800 p-5 text-neutral-100">
        <p>{social?.email}</p>
        <div className="mt-3 flex items-center gap-2">
          <ProviderBadge provider={social?.provider} />
        </div>
      </main>
    </div>
  );
}
