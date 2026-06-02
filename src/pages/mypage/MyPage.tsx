import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { InfoBar } from "@/components/mypage/InfoBar";
import { MyPageTabs } from "@/components/mypage/MyPageTab";
import { OptionLink } from "@/components/mypage/OptionLink";
import {
  managelist,
  servicelist,
} from "@/constants/mypage/servicelist.constant";
import { useMe } from "@/hooks/member";

export function MyPage() {
  const { data: me, isLoading } = useMe();

  return (
    <div className="relative">
      <header className="rounded-tl-lg rounded-tr-lg border-b-neutral-600 bg-orange-500 p-[1rem]">
        <InfoBar
          name={me?.member.name}
          nickname={me?.roleData.user?.nickname}
          profile={me?.roleData?.user?.profileImage}
        />
        <MyPageTabs />
      </header>

      <main>
        <section className="border-0.25 border-neutral-850 border-b py-4">
          {managelist.map((item) => {
            const isTicket = item.text === "크레딧 개수";

            return (
              <OptionLink
                key={item.text}
                {...item}
                info={
                  isTicket
                    ? `${me?.roleData.user?.creditBalance ?? 0}개`
                    : undefined
                }
              />
            );
          })}
        </section>
        <section className="py-4">
          {servicelist.map((item) => {
            return (
              <OptionLink key={item.text} {...item} onClick={item.onClick} />
            );
          })}
        </section>
      </main>

      <LoadingSpinner open={isLoading} />
    </div>
  );
}
