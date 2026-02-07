import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { InfoBar } from "@/components/mypage/InfoBar";
import { MyPageTabs } from "@/components/mypage/MyPageTab";
import { OptionLink } from "@/components/mypage/OptionLink";
import { managelist } from "@/constants/mypage/servicelist.constant";
import { useMe } from "@/hooks/member";

export function MyPage() {
  const { data: me, isLoading } = useMe();

  return (
    <div className="relative">
      <header className="rounded-tl-lg rounded-tr-lg bg-orange-500 p-[1rem]">
        <InfoBar
          name={me?.member.name}
          nickname={me?.roleData.user?.nickname}
          profile={me?.roleData.user?.profileImage}
        />
        <MyPageTabs />
      </header>
      <main>
        <section className="py-4">
          {managelist.map((item) => (
            <OptionLink
              key={item.text}
              {...item}
              info={
                item.text === "티켓 충전"
                  ? `${me?.roleData.user?.creditBalance ?? 0}개`
                  : undefined
              }
            />
          ))}
        </section>
      </main>
      <LoadingSpinner open={isLoading} />
    </div>
  );
}
