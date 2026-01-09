import { ChevronLeftIcon } from "@/assets/icon";
import { MyPageTabs } from "@/components/mypage/MyPageTab";
import { OptionLink } from "@/components/mypage/OptionLink";
import { info } from "@/constants/mypage/info.constant";
import {
  managelist,
  servielist,
} from "@/constants/mypage/servicelist.constant";
import { NavLink } from "react-router";

export function MyPage() {
  const { member, roleData } = info;
  return (
    <div className="w-full pt-[5rem]">
      <header className="border-neutral-875 border-b-[0.4rem] p-[1rem]">
        <section className="mb-[1rem] flex items-center gap-3">
          {/* 프로필 이미지 */}
          <div className="border-radius-100 h-[3.75rem] w-[3.75rem] rounded-full border border-neutral-800"></div>
          {/* 이름 / 닉네임 */}
          <div className="flex flex-1 flex-col">
            <p className="font-light">{member.name}</p>
            <p className="font-normal">{roleData.user?.nickname}</p>
          </div>
          {/*이동 아이콘*/}
          <NavLink to="./edit-info">
            <ChevronLeftIcon className="h-[2rem] w-[1.5rem] rotate-180" />
          </NavLink>
        </section>
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
                  ? `${roleData.user?.tokenBalance ?? 0}장`
                  : undefined
              }
            />
          ))}
        </section>
        <section>
          <p className="p-[1rem]">고객 지원</p>
          {servielist.map(({ to, text, Icon }) => (
            <OptionLink to={to} text={text} Icon={Icon} />
          ))}
        </section>
      </main>
    </div>
  );
}
