import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

// 레이아웃
import RootLayout from "@/layouts/RootLayout";
import { FooterLayout } from "@/layouts/FooterLayout";
import MyPageLayout from "@/layouts/MyPageLayout";
import { PhotoManageLayout } from "@/layouts/PhotoManageLayout";

// 로그인, 회원가입 페이지
import {
  KakaoCallbackPage,
  LoginPage,
  OnBoardingPage,
  TermsPage,
} from "@/pages/auth";

// 메인페이지
import MainPage from "@/pages/mainPage/MainPage";
import DevelopmentHistoryPage from "@/pages/developmentHistory/DevelopmentHistoryPage";
import FilmCameraGuideDetailPage from "@/pages/filmCameraGuide/FilmCameraGuideDetailPage";
import FilmCameraGuidePage from "@/pages/filmCameraGuide/FilmCameraGuidePage";
import PhotoRestorationPage from "@/pages/photoRestoration/PhotoRestorationPage";

// 현상관리 페이지
import { DetailInfoPage } from "@/pages/photoManage/DetailInfoPage";
import PhotoDownloadPage from "@/pages/photoManage/PhotoDownloadPage";
import PhotoManageMainPage from "@/pages/photoManage/PhotoManageMainPage";
import { PickUpMethodPage } from "@/pages/photoManage/PickUpMethodPage";
import { PrintOptionPage } from "@/pages/photoManage/PrintOptionPage";
import { PrintRequestPage } from "@/pages/photoManage/PrintRequestPage";
import { SelectAddressPage } from "@/pages/photoManage/SelectAddressPage";
import SplashPage from "@/pages/photoManage/SplashPage";
import TransactionPage from "@/pages/photoManage/TransactionPage";

// 사진수다 페이지
import FindPhotoLabPage from "@/pages/photoFeed/FindPhotoLabPage";
import NewPostPage from "@/pages/photoFeed/NewPostPage";
import PhotoFeedPage from "@/pages/photoFeed/PhotoFeedPage";
import PhotoFeedSearchPage from "@/pages/photoFeed/PhotoFeedSearchPage";
import PostPage from "@/pages/photoFeed/PostPage";
import ReviewPhotoLabPage from "@/pages/photoFeed/ReviewPhotoLabPage";

// 현상소 보기 페이지
import PhotoLabDetailPage from "@/pages/photoLab/PhotoLabDetailPage";
import PhotoLabPage from "@/pages/photoLab/PhotoLabPage";
import PhotoLabSearchPage from "@/pages/photoLab/PhotoLabSearchPage";
import ReservationCompletePage from "@/pages/photoLab/ReservationCompletePage";
import ReservationPage from "@/pages/photoLab/ReservationPage";

// 마이페이지
import {
  EditInfoPage,
  LikedPhotoLabPage,
  LikedPostPage,
  MyPage,
  MyPostPage,
  NickNameEditPage,
  PhoneEditPage,
  SocialPage,
  WithDrawPage,
} from "@/pages/mypage";
import { AddressDetailPage } from "@/pages/photoManage/AddressDetailPage";

type RouteHandle =
  | {
      title?: string;
      isTab?: boolean;
      showBack?: boolean;
    }
  | undefined;

// 공통적으로 쓰는 handle 생성기(타이틀 오타/중복 방지)
const h = (handle: RouteHandle) => handle;

// ------------------
// 도메인별 라우트 묶음
// ------------------
const authRoutes = [
  { path: "login", Component: LoginPage },
  { path: "kakao/callback", Component: KakaoCallbackPage },
  { path: "onboarding", Component: OnBoardingPage },
  { path: "terms", Component: TermsPage },
];

const guideRoutes = [
  { path: "film-camera-guide", Component: FilmCameraGuidePage },
  { path: "film-camera-guide/:id", Component: FilmCameraGuideDetailPage },
  { path: "restore/editor", Component: PhotoRestorationPage },
];

const photoFeedStandaloneRoutes = [
  { path: "photoFeed/search", Component: PhotoFeedSearchPage },
  { path: "photoFeed/lab/find", Component: FindPhotoLabPage },
  { path: "photoFeed/lab/review", Component: ReviewPhotoLabPage },
  { path: "photoFeed/post/:postId", Component: PostPage },
  { path: "photoFeed/post/new", Component: NewPostPage },
];

const photoLabStandaloneRoutes = [
  { path: "photolab/search", Component: PhotoLabSearchPage },
  { path: "photolab/:photoLabId", Component: PhotoLabDetailPage },
  { path: "photolab/:photoLabId/reservation", Component: ReservationPage },
  {
    path: "photolab/:photoLabId/reservation/complete",
    Component: ReservationCompletePage,
  },
];

const photoManageStandaloneRoutes = [
  { path: "photoManage/download", Component: PhotoDownloadPage },
];

// FooterLayout이 필요한 페이지들
const footerRoutes = [
  { path: "mainpage", Component: MainPage },
  { path: "photoFeed", Component: PhotoFeedPage },
  { path: "photolab", Component: PhotoLabPage },
  { path: "photoManage/main", Component: PhotoManageMainPage },
  { path: "development-history", Component: DevelopmentHistoryPage },
  { path: "photoManage/splash", Component: SplashPage },
];

// PhotoManageLayout 하위(공통 prefix: photoManage)
const photoManageRoutes = [
  {
    path: "print-request",
    Component: PrintRequestPage,
    handle: h({ title: "인화 요청하기" }),
  },
  {
    path: "pickup-method",
    Component: PickUpMethodPage,
    handle: h({ title: "인화 요청하기" }),
  },
  {
    path: "select-address",
    Component: SelectAddressPage,
    handle: h({ title: "주소 입력하기" }),
  },
  {
    path: "select-address/detail",
    Component: DetailInfoPage,
    handle: h({ title: "상세 정보 입력하기" }),
  },
  {
    path: "print-option",
    Component: PrintOptionPage,
    handle: h({ title: "결제 내역" }),
  },
  {
    path: "transaction",
    Component: TransactionPage,
    handle: h({ title: "송금하기" }),
  },
  {
    path: "address-detail",
    Component: AddressDetailPage,
    handle: h({ title: "상세 정보 입력하기" }),
  },
];

// MyPageLayout 하위(공통 prefix: mypage)
const mypageRoutes = [
  {
    index: true,
    Component: MyPage,
    handle: h({ isTab: true, showBack: false }),
  },
  {
    path: "edit-info",
    Component: EditInfoPage,
    handle: h({ title: "내정보 수정", isTab: true }),
  },
  {
    path: "edit-info/nickname",
    Component: NickNameEditPage,
    handle: h({ title: "닉네임 변경" }),
  },
  {
    path: "edit-info/phone",
    Component: PhoneEditPage,
    handle: h({ title: "전화번호 변경" }),
  },
  {
    path: "edit-info/social",
    Component: SocialPage,
    handle: h({ title: "연동된 소셜계정" }),
  },
  {
    path: "liked-posts",
    Component: LikedPostPage,
    handle: h({ title: "관심 게시글" }),
  },
  {
    path: "liked-photolabs",
    Component: LikedPhotoLabPage,
    handle: h({ title: "관심 현상소" }),
  },
  {
    path: "my-posts",
    Component: MyPostPage,
    handle: h({ title: "내가 쓴 글" }),
  },
  {
    path: "edit-info/withdraw",
    Component: WithDrawPage,
    handle: h({ title: "회원 탈퇴" }),
  },
];

// ---------------
//  최종 router
// ---------------
const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/auth/login" /> },

      // auth prefix를 한 번만
      { path: "auth", children: authRoutes },

      // 단독 라우트들
      ...guideRoutes,
      ...photoFeedStandaloneRoutes,
      ...photoLabStandaloneRoutes,
      ...photoManageStandaloneRoutes,

      // FooterLayout 그룹
      {
        Component: FooterLayout,
        children: footerRoutes,
      },

      // photoManage prefix 올려서 중복 제거
      {
        path: "photoManage",
        Component: PhotoManageLayout,
        children: photoManageRoutes,
      },

      // mypage prefix 올려서 중복 제거
      {
        path: "mypage",
        element: <MyPageLayout />,
        children: mypageRoutes,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
