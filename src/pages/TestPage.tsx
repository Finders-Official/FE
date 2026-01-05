import { Header, Icon } from "@/components/common";
import { SearchIcon, CloseIcon, ShareIcon } from "@/assets/icon";

export default function TestPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="px-4 text-sm text-neutral-400">1. 뒤로가기 + 검색</p>
        <Header
          title="현상 맡기기"
          showBack
          onBack={() => console.log("back")}
          rightAction={{
            type: "icon",
            icon: (
              <Icon className="text-neutral-200">
                <SearchIcon />
              </Icon>
            ),
            onClick: () => console.log("search"),
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="px-4 text-sm text-neutral-400">2. 뒤로가기 + 저장</p>
        <Header
          title="탄 사진 복원하기"
          showBack
          onBack={() => console.log("back")}
          rightAction={{
            type: "text",
            text: "다음",
            onClick: () => console.log("save"),
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="px-4 text-sm text-neutral-400">
          3. 뒤로가기 + 저장 (disabled)
        </p>
        <Header
          title="탄 사진 복원하기"
          showBack
          onBack={() => console.log("back")}
          rightAction={{
            type: "text",
            text: "다음",
            onClick: () => console.log("save"),
            disabled: true,
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="px-4 text-sm text-neutral-400">
          4. 뒤로가기 + 저장 (loading)
        </p>
        <Header
          title="탄 사진 복원하기"
          showBack
          onBack={() => console.log("back")}
          rightAction={{
            type: "text",
            text: "저장",
            onClick: () => console.log("save"),
            loading: true,
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="px-4 text-sm text-neutral-400">5. 닫기 버튼</p>
        <Header
          title="파인더스 상도점"
          rightAction={{
            type: "icon",
            icon: (
              <Icon className="text-neutral-200">
                <CloseIcon />
              </Icon>
            ),
            onClick: () => console.log("close"),
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="px-4 text-sm text-neutral-400">6. 제목만</p>
        <Header title="홈" />
      </div>

      <div className="space-y-2">
        <p className="px-4 text-sm text-neutral-400">7. 뒤로가기 + 공유</p>
        <Header
          title="저장완료"
          showBack
          onBack={() => console.log("back")}
          rightAction={{
            type: "icon",
            icon: (
              <Icon className="text-neutral-200">
                <ShareIcon />
              </Icon>
            ),
            onClick: () => console.log("share"),
          }}
        />
      </div>
    </div>
  );
}
