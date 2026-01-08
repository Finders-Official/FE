import { KakaoIcon } from "@/assets/icon";

export const TabBar = () => {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[5.5625rem] w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-[1.5rem] py-[1.25rem]">
      {/*
      1.홈버튼 -> /mainpage
      2. 현상소 보기 버튼 -> photolab-list
      3.사진 수다 버튼 -> /photofeed 
      4.현상 관리 버튼 -> development-manage
      5. 마이페이지 버튼 -> /mypage
      */}
      <nav className="grid h-full grid-cols-5 gap-1">
        <button
          type="button"
          className="flex flex-col items-center justify-center"
        >
          <KakaoIcon className="h-[1.5rem] w-[1.5rem]" fill="orange-500" />
          <label className="mt-auto text-center text-xs text-neutral-300">
            홈
          </label>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center"
        >
          <KakaoIcon className="h-[1.5rem] w-[1.5rem]" />
          <label className="mt-auto text-center text-xs text-neutral-300">
            현상소 보기
          </label>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center"
        >
          <KakaoIcon className="h-[1.5rem] w-[1.5rem]" />
          <label className="mt-auto text-center text-xs text-neutral-300">
            사진수다
          </label>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center"
        >
          <KakaoIcon className="h-[1.5rem] w-[1.5rem]" />
          <label className="mt-auto text-center text-xs text-neutral-300">
            현상 관리
          </label>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center"
        >
          <KakaoIcon className="h-[1.5rem] w-[1.5rem]" />
          <label className="mt-auto text-center text-xs text-neutral-300">
            마이페이지
          </label>
        </button>
      </nav>
    </div>
  );
};

// 해당 버튼에 해당하는 페이지로 이동했을 때 버튼색 orange-500으로 설정해 해당 페이지에 있다는 것을 인지시켜주기
// TabBar 는 FooterLayout 에서 사용됨
