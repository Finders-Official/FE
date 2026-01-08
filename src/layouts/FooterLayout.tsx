import { TabBar } from "@/components/common/TabBar";
import { Outlet } from "react-router";

export function FooterLayout() {
  return (
    <div>
      <Outlet />
      <TabBar />
    </div>
  );
}
