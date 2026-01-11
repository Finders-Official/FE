export interface MyPageResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: MyPageData;
}

export interface MyPageData {
  member: Member;
  roleData: RoleData;
}

export interface Member {
  memberId: number;
  email: string;
  name: string;
  phone: string;
  role: "USER" | "OWNER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";
}

export interface RoleData {
  user: UserRoleInfo | null;
}

export interface UserRoleInfo {
  nickname: string;
  profileImage: string; // URL
  tokenBalance: number;
  favoritePhotoLabs: number;
  likedPosts: number;
  myPosts: number;
}
