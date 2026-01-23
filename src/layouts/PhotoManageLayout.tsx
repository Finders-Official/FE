import { Header } from "@/components/common";
import { Outlet, useMatches, useNavigate } from "react-router";

type Handle = { title: string };

export function PhotoManageLayout() {
  const matches = useMatches();
  const navigate = useNavigate();

  const last = matches.at(-1); // matches[matches.length - 1]보다 안전/가독성 좋음

  const handle = (last?.handle as Partial<Handle> | undefined) ?? {};

  const title = handle.title ?? "";

  return (
    <div className="flex min-h-0 w-full flex-col">
      <Header title={title} showBack={true} onBack={() => navigate(-1)} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
