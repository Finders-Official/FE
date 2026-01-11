import RootLayout from "@/layouts/RootLayout";
import { LoginPage, OnBoardingPage } from "@/pages/auth";
import PhotoFeedPage from "@/pages/photoFeed/PhotoFeedPage";
import PostPage from "@/pages/photoFeed/PostPage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { FooterLayout } from "@/layouts/FooterLayout";
import NewPostPage from "@/pages/photoFeed/NewPostPage";
import { MyPage } from "@/pages/mypage/MyPage";
import { EditInfoPage } from "@/pages/mypage/EditInfoPage";
import { LikedPostPage } from "@/pages/mypage/LikedPostPage";
import { LikedPhotoLabPage } from "@/pages/mypage/LikedPhotoLabPage";
import { MyPostPage } from "@/pages/mypage/MyPostPage";
import FindPhotoLabPage from "@/pages/photoFeed/FindPhotoLabPage";
import ReviewPhotoLabPage from "@/pages/photoFeed/ReviewPhotoLabPage";
import MyPageLayout from "@/layouts/MyPageLayout";
import { NickNameEditPage } from "@/pages/mypage/NickNameEditPage";
import { PhoneEditPage } from "@/pages/mypage/PhoneEditPage";
import { SocialPage } from "@/pages/mypage/SocialPage";

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
        path: "/photoFeed/post/:postId",
        Component: PostPage,
      },
      {
        path: "/photoFeed/post/new",
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
      //마이페이지 전용 레이아웃
      {
        path: "/mypage",
        element: <MyPageLayout />,
        children: [
          {
            index: true,
            Component: MyPage,
            handle: { isTab: true, showBack: false },
          },
          {
            path: "edit-info",
            Component: EditInfoPage,
            handle: { title: "내정보 수정", isTab: true },
          },
          {
            path: "edit-info/nickname",
            Component: NickNameEditPage,
            handle: { title: "닉네임 변경" },
          },
          {
            path: "edit-info/phone",
            Component: PhoneEditPage,
            handle: { title: "전화번호 변경" },
          },
          {
            path: "edit-info/social",
            Component: SocialPage,
            handle: { title: "연동된 소셜계정" },
          },
          {
            path: "liked-posts",
            Component: LikedPostPage,
            handle: { title: "관심 게시글" },
          },
          {
            path: "liked-photolabs",
            Component: LikedPhotoLabPage,
            handle: { title: "관심 현상소" },
          },
          {
            path: "my-posts",
            Component: MyPostPage,
            handle: { title: "내가 쓴 글" },
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
