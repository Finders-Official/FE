import type { ApiResponse } from "../common/apiResponse";

export type Role = "USER" | "OWNER" | "ADMIN";
export type MemberStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";

export interface MemberDto {
  memberId: number;
  name: string;
  phone: string;
  role: Role;
  status: MemberStatus;
}

export type EditableKey = "nickname" | "phone" | "profileImage";
export type EditableDto = Record<EditableKey, boolean>;

export type SocialProvider =
  | "KAKAO"
  | "APPLE"
  | "GOOGLE"
  | "NAVER"
  | (string & {});

export interface SocialAccountDto {
  provider: SocialProvider;
  email: string | null;
}

export interface UserRoleDto {
  nickname: string;
  profileImage: string; // URL
  creditBalance: number;
  favoritePhotoLabs: number;
  likedPosts: number;
  myPosts: number;

  socialAccounts: SocialAccountDto[];
}

export interface OwnerRoleDto {
  nickname: string;
}
export interface AdminRoleDto {
  nickname: string;
}

export type RoleDataDto =
  | { role: "USER"; user: UserRoleDto; owner: null; admin: null }
  | { role: "OWNER"; user: null; owner: OwnerRoleDto; admin: null }
  | { role: "ADMIN"; user: null; owner: null; admin: AdminRoleDto };

export interface MyPageDataDto {
  member: MemberDto;
  editable: EditableDto;
  roleData: RoleDataDto;
}

export type MyPageResponse = ApiResponse<MyPageDataDto>;

export type EditMeReqDto = {
  nickname?: string;
  phone?: string;
  verifiedPhoneToken?: string;
  profileImageUrl?: string;
};

export type WithDrawResData = Record<string, never>;
export type WithDrawResponse = ApiResponse<WithDrawResData>;
