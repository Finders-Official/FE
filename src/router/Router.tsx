import RootLayout from "@/layouts/RootLayout";
import OnBoardingPage from "@/pages/auth/OnBoarding";
import LoginPage from "@/pages/auth/LoginPage";
import PhotoFeedPage from "@/pages/photoFeed/PhotoFeedPage";
import PostPage from "@/pages/photoFeed/PostPage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { FooterLayout } from "@/layouts/FooterLayout";
import NewPostPage from "@/pages/photoFeed/NewPostPage";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/auth/login" /> }, // 기본 경로 설정
      {
        path: "/auth/login",
        Component: LoginPage,
      },
      {
        path: "/auth/onboarding",
        Component: OnBoardingPage,
      },
      {
        path: "/post/:postId",
        Component: PostPage,
      },
      {
        path: "/post/new",
        Component: NewPostPage,
      },

      // FooterLayout 적용 필요한 페이지들
      {
        Component: FooterLayout,
        children: [
          {
            path: "/photoFeed",
            Component: PhotoFeedPage,
          },
        ],
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
