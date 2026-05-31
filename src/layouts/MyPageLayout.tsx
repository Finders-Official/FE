// MyPageLayout.tsx
import { Outlet, useMatches, useNavigate } from "react-router";
import Header from "@/components/common/Header";
import { TabBar } from "@/components/common/TabBar";

type Handle = {
  title?: string;
  isTab?: boolean;
  showBack?: boolean;
  hideHeader?: boolean;
};

export default function MyPageLayout() {
  const matches = useMatches();
  const navigate = useNavigate();

  const last = matches[matches.length - 1];
  const handle = (last.handle as Handle | undefined) ?? {};
  const title = handle.title ?? "마이페이지";

  const isTab = handle.isTab ?? false;
  const showBack = handle.showBack ?? true;
  const hideHeader = handle.hideHeader ?? false;

  return (
    <div className="flex min-h-0 w-full flex-col">
      {!hideHeader && (
        <Header title={title} showBack={showBack} onBack={() => navigate(-1)} />
      )}
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      {isTab && <TabBar />}
    </div>
  );
}
