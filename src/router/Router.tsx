import RootLayout from "@/layouts/RootLayout";
import { LoginPage, OnBoardingPage } from "@/pages/auth";
import PhotoFeedPage from "@/pages/photoFeed/PhotoFeedPage";
import PostPage from "@/pages/photoFeed/PostPage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { FooterLayout } from "@/layouts/FooterLayout";
import NewPostPage from "@/pages/photoFeed/NewPostPage";
import { MyPage } from "@/pages/mypage/MyPage";
import { EditInfoPage } from "@/pages/mypage/EditInfoPage";
import { LikedPostPage } from "@/pages/mypage/Liked-PostPage";
import { Liked_PhotoLabPage } from "@/pages/mypage/Liked-PhotoLabPage";
import { MyPostPage } from "@/pages/mypage/MyPostPage";
import FindPhotoLabPage from "@/pages/photoFeed/FindPhotoLabPage";
import ReviewPhotoLabPage from "@/pages/photoFeed/ReviewPhotoLabPage";
import PhotoDownloadPage from "@/pages/photoManage/PhotoDownloadPage";
import PmMainPage from "@/pages/photoManage/PmMainPage";

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
        path: "/photoFeed/lab/find",
        Component: FindPhotoLabPage,
      },
      {
        path: "/photoFeed/lab/review",
        Component: ReviewPhotoLabPage,
      },
      {
        path: "/photoFeed/post/1", //TODO: 임시 postId
        Component: PostPage,
      },
      {
        path: "/photoManage/download",
        Component: PhotoDownloadPage,
      },
      {
        path: "/photoManage/main",
        Component: PmMainPage,
      },
      {
        path: "/photoFeed/post/new",
        Component: NewPostPage,
      },
      // HeaderLayout.tsx로 이동 예정
      {
        path: "/mypage/liked-posts",
        Component: LikedPostPage,
      },
      {
        path: "/mypage/liked-photolabs",
        Component: Liked_PhotoLabPage,
      },
      {
        path: "/mypage/my-posts",
        Component: MyPostPage,
      },

      // FooterLayout 적용 필요한 페이지들
      {
        Component: FooterLayout,
        children: [
          {
            path: "/photoFeed",
            Component: PhotoFeedPage,
          },
          {
            path: "/mypage",
            Component: MyPage, // HeaderFooterLayout으로 이동 예정
          },
          {
            path: "/mypage/edit-info",
            Component: EditInfoPage, // HeaderFooterLayout으로 이동 예정
          },
        ],
      },
      {
        // HeaderLayout만 사용하는 페이지
      },
      {
        //HeaderFooteryLayout 사용하는 페이지
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
