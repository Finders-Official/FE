// MyPageLayout.tsx
import { Outlet, useMatches, useNavigate } from "react-router";
import Header from "@/components/common/Header";
import { TabBar } from "@/components/common/TabBar";

type Handle = { title?: string; isTab?: boolean };

export default function MyPageLayout() {
  const matches = useMatches();
  const navigate = useNavigate();

  const last = matches[matches.length - 1];
  const handle = (last.handle as Handle | undefined) ?? {};
  const title = handle.title ?? "마이페이지";

  const showBack = matches.length > 1; // 상황에 맞게 조절

  return (
    <div className="w-full pt-[3.275rem]">
      <Header title={title} showBack={showBack} onBack={() => navigate(-1)} />
      <main>
        <Outlet />
      </main>
      {handle.isTab && <TabBar />}
    </div>
  );
}
