import RootLayout from "@/layouts/RootLayout";
import { LoginPage, OnBoardingPage } from "@/pages/auth";
import PhotoFeedPage from "@/pages/photoFeed/PhotoFeedPage";
import PostPage from "@/pages/photoFeed/PostPage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { FooterLayout } from "@/layouts/FooterLayout";
import NewPostPage from "@/pages/photoFeed/NewPostPage";
import { MyPage } from "@/pages/mypage/MyPage";
import { EditInfoPage } from "@/pages/mypage/edit-info/EditInfoPage";
import { LikedPostPage } from "@/pages/mypage/LikedPostPage";
import { LikedPhotoLabPage } from "@/pages/mypage/LikedPhotoLabPage";
import { MyPostPage } from "@/pages/mypage/MyPostPage";
import FindPhotoLabPage from "@/pages/photoFeed/FindPhotoLabPage";
import ReviewPhotoLabPage from "@/pages/photoFeed/ReviewPhotoLabPage";
import MyPageLayout from "@/layouts/MyPageLayout";
import { NickNameEditPage } from "@/pages/mypage/edit-info/NickNameEditPage";
import { PhoneEditPage } from "@/pages/mypage/edit-info/PhoneEditPage";
import { SocialPage } from "@/pages/mypage/edit-info/SocialPage";
import PhotoDownloadPage from "@/pages/photoManage/PhotoDownloadPage";
import FilmCameraGuidePage from "@/pages/filmCameraGuide/FilmCameraGuidePage";
import FilmCameraGuideDetailPage from "@/pages/filmCameraGuide/FilmCameraGuideDetailPage";
import PhotoLabPage from "@/pages/photoLab/PhotoLabPage";
import PhotoLabSearchPage from "@/pages/photoLab/PhotoLabSearchPage";
import PhotoLabDetailPage from "@/pages/photoLab/PhotoLabDetailPage";
import ReservationPage from "@/pages/photoLab/ReservationPage";
import TestPage from "@/pages/TestPage";
import PmMainPage from "@/pages/photoManage/PmMainPage";
import { PhotoManageLayout } from "@/layouts/PhotoManageLayout";
import { PrintRequestPage } from "@/pages/photoManage/PrintRequestPage";
import { SelectAddressPage } from "@/pages/photoManage/SelectAddressPage";
import { DetailInfoPage } from "@/pages/photoManage/DetailInfoPage";
import { PrintOptionPage } from "@/pages/photoManage/PrintOptionPage";
import { PickUpMethodPage } from "@/pages/photoManage/PickUpMethodPage";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/auth/login" /> }, // 기본 경로 설정
      {
        path: "/test",
        Component: TestPage,
      },
      {
        path: "/auth/login",
        Component: LoginPage,
      },
      {
        path: "/auth/onboarding",
        Component: OnBoardingPage,
      },
      {
        path: "/filmCameraGuide",
        Component: FilmCameraGuidePage,
      },
      {
        path: `/filmCameraGuide/:id`,
        Component: FilmCameraGuideDetailPage,
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
        path: "/photolab/search",
        Component: PhotoLabSearchPage,
      },
      {
        path: "/photolab/:photoLabId",
        Component: PhotoLabDetailPage,
      },
      {
        path: "/photolab/:photoLabId/reservation",
        Component: ReservationPage,
      },
      {
        path: "/photoManage/main",
        Component: PmMainPage,
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
          {
            path: "/photolab",
            Component: PhotoLabPage,
          },
          {
            path: "/mypage",
            Component: MyPage, // HeaderFooterLayout으로 이동 예정
          },
          {
            path: "/mypage/edit-info",
            Component: EditInfoPage, // HeaderFooterLayout으로 이동 예정
          },
          {
            path: "/photoManage/main",
            Component: PmMainPage,
          },
        ],
      },
      //마이페이지 전용 레이아웃
      {
        Component: PhotoManageLayout,
        children: [
          {
            path: "/photoManage/print-request",
            Component: PrintRequestPage,
            handle: { title: "인화 요청하기" },
          },
          {
            path: "/photoManage/pickup-method",
            Component: PickUpMethodPage,
            handle: { title: "인화 요청하기" },
          },
          {
            path: "/photoManage/select-address",
            Component: SelectAddressPage,
            handle: { title: "주소 입력하기" },
          },
          {
            path: "/photoManage/select-address/detail",
            Component: DetailInfoPage,
            handle: { title: "상세 정보 입력하기" },
          },
          {
            path: "/photoManage/print-option",
            Component: PrintOptionPage,
            handle: { title: "결제 내역" },
          },
        ],
      },
      {
        //HeaderFooteryLayout 사용하는 페이지

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
