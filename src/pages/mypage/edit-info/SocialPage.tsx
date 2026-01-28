import { KakaoFillIcon } from "@/assets/icon";
import { useMe } from "@/hooks/member";

export function SocialPage() {
  const { data: meData } = useMe();

  const social = meData?.roleData.user?.socialAccounts?.[0];

  return (
    <div className="py-6">
      <main className="rounded-md border border-neutral-800 p-5 text-neutral-100">
        <p>{social?.email}</p>
        <div className="mt-3 flex gap-2">
          <KakaoFillIcon className="h-6 w-6 fill-orange-500" />
          <p>{social?.provider}</p>
        </div>
      </main>
    </div>
  );
}
