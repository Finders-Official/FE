import type { MyPageData } from "@/types/mypage/info";

export const info: MyPageData = {
  member: {
    memberId: 1,
    name: "전병국",
    email: "byeongguk.jeon@email.com",
    phone: "01012345678",
    role: "USER",
    status: "ACTIVE",
  },
  roleData: {
    user: {
      nickname: "파인더",
      profileImage: "https://cdn.finders.com/profile/1.png",
      tokenBalance: 2,
      favoritePhotoLabs: 3,
      likedPosts: 12,
      myPosts: 5,
    },
  },
};
