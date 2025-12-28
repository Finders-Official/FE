import RootLayout from "../layouts/RootLayout";
import LoginPage from "../pages/auth/LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: LoginPage,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

//Router 설정 파일
// 1. Footer 가 존재하는 레이아웃이면 FooterLayout 으로 감싸기
// 2. Header 가 존재하는 레이아웃이면 HeaderLayout 으로 감싸기
// 3. 둘 다 존재하는 레이아웃이면 HeaderFooterLayout 으로 감싸기
//Home 컴포넌트는 테스트용
