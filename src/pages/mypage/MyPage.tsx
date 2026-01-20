import { InfoBar, MyPageTabs, OptionLink } from "@/components/mypage";
import { info } from "@/constants/mypage/info.constant";
import {
  managelist,
  servicelist,
} from "@/constants/mypage/servicelist.constant";

export function MyPage() {
  // 내 정보 조희 api 연동 -> 데이터 값 캐싱 활용 예정 (zustand 사용 x)
  const { member, roleData } = info;
  const { user } = roleData;
  return (
    <div>
      <header className="rounded-tl-lg rounded-tr-lg bg-orange-500 p-[1rem]">
        <InfoBar
          name={member.name}
          nickname={user?.nickname}
          profile={user?.profileImage}
        />
        <MyPageTabs />
      </header>
      <main>
        <section className="border-neutral-875 border-b py-4">
          {managelist.map((item) => (
            <OptionLink
              key={item.text}
              {...item}
              info={
                item.text === "티켓 충전"
                  ? `${user?.creditBalance ?? 0}개`
                  : undefined
              }
            />
          ))}
        </section>
        <section>
          {servicelist.map(({ to, text, Icon }) => (
            <OptionLink key={text} to={to} text={text} Icon={Icon} />
          ))}
        </section>
      </main>
    </div>
  );
}
