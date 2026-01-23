import type { MyPageDataDto } from "@/types/mypage/info";

export const info: MyPageDataDto = {
  member: {
    memberId: 1,
    name: "전병국",
    phone: "010-1234-5678",
    role: "USER",
    status: "ACTIVE",
  },
  editable: {
    nickname: true,
    phone: true,
    profileImage: true,
  },
  roleData: {
    role: "USER",
    user: {
      nickname: "Bingguriguri",
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=256&h=256&q=80",
      creditBalance: 2,
      favoritePhotoLabs: 3,
      likedPosts: 12,
      myPosts: 5,
      socialAccounts: {
        provider: "KAKAO",
        email: "finders2026@gmail.com",
      },
    },
    owner: null,
    admin: null,
  },
};

//삭제 예정
