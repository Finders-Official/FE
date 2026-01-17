export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
}

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

export interface SocialAccountDto {
  provider: string;
  email: string;
}

export interface UserRoleDto {
  nickname: string;
  profileImage: string; // URL
  creditBalance: number;
  favoritePhotoLabs: number;
  likedPosts: number;
  myPosts: number;
  socialAccounts: SocialAccountDto;
}

// owner/admin도 생길 거면 똑같이 DTO 정의해두기
export interface OwnerRoleDto {
  nickname: string;
  // TODO: 서버 스펙 나오면 채우기
}
export interface AdminRoleDto {
  nickname: string;
  // TODO: 서버 스펙 나오면 채우기
}

/*
roleData를 "role"로 좁힐 수 있게(discriminated union) 만들기 member.role에 맞는 것만 채운다고 가정
 */
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
