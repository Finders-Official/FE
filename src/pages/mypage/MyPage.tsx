import { InfoBar } from "@/components/mypage/InfoBar";
import { MyPageTabs } from "@/components/mypage/MyPageTab";
import { OptionLink } from "@/components/mypage/OptionLink";
import { info } from "@/constants/mypage/info.constant";
import {
  managelist,
  servielist,
} from "@/constants/mypage/servicelist.constant";

export function MyPage() {
  const { member, roleData } = info;
  const { user } = roleData;
  return (
    <div className="w-full pt-[5rem]">
      <header className="border-neutral-875 border-b-[0.4rem] p-[1rem]">
        <InfoBar name={member.name} nickname={user?.nickname} />
        <MyPageTabs />
      </header>
      <main>
        <section className="border-neutral-875 border-b">
          {managelist.map((item) => (
            <OptionLink
              key={item.text}
              {...item}
              info={
                item.text === "티켓 충전"
                  ? `${user?.tokenBalance ?? 0}장`
                  : undefined
              }
            />
          ))}
        </section>
        <section>
          <h1 className="p-[1rem]">고객 지원</h1>
          {servielist.map(({ to, text, Icon }) => (
            <OptionLink to={to} text={text} Icon={Icon} />
          ))}
        </section>
      </main>
    </div>
  );
}

// 1. 라우팅 별 페이지 만들기
// 2. 헤더는 나중에 pull 받아서 사용 예정
// 3. 관심 현상소 mock data 4개 렌더링 예정 -> UR 030.
// 4. 관심 게시글 mock data 사용 예정 -> UR 040.
// 5. 내가 쓴 글 mock data 4개 사용 예정 -> UR 050.
