import { OptionLink } from "@/components/mypage/OptionLink";
import { info } from "@/constants/mypage/info.constant";

export function EditInfoPage() {
  const { member, roleData } = info;
  return (
    <div>
      <header className="border-neutral-850 flex items-center justify-center border-b-[0.4rem] py-10">
        <div className="border-radius-100 h-[5rem] w-[5rem] rounded-full border border-neutral-800"></div>
      </header>
      <main className="py-4">
        <OptionLink
          to="./nickname"
          text="닉네임"
          info={roleData.user?.nickname}
          infoColor="gray"
        />
        <div className="flex justify-between p-4">
          <p>이름</p>
          <p className="mr-8 text-neutral-500">{member.name}</p>
        </div>
        <OptionLink
          to="./phone"
          text="연락처"
          info={member.phone}
          infoColor="gray"
        />
        <OptionLink
          to="./social"
          text="연동된 소셜 계정"
          info="Kakao"
          infoColor="gray"
        />
        <button className="p-4">로그아웃</button>
      </main>
    </div>
  );
}
