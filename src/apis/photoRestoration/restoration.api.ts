import { axiosInstance } from "@/lib/axiosInstance";
import { useAuthStore } from "@/store/useAuth.store";
import { jwtDecode } from "jwt-decode";
import type { ApiResponse } from "@/types/common/apiResponse";
import { issuePresignedUrl } from "@/apis/file/presignedUrl.api";
import { uploadToPresignedUrl as uploadToPresignedUrlApi } from "@/apis/file/fileUpload.api";
import type { PresignedUrlIssueResDto } from "@/types/file/presignedUrl";

export type PresignedUrlResponse = ApiResponse<PresignedUrlIssueResDto>;

type JwtPayload = {
  id?: number;
  memberId?: number;
  sub?: string | number;
};

export function getMemberIdFromToken(token: string): number {
  const decoded = jwtDecode<JwtPayload>(token);
  const memberId = Number(decoded.id ?? decoded.memberId ?? decoded.sub);

  if (!Number.isInteger(memberId) || memberId <= 0) {
    throw new Error("No valid memberId found in token");
  }

  return memberId;
}

// 1. Presigned URL 발급 요청
export async function getPresignedUrl(
  category: "RESTORATION_ORIGINAL" | "RESTORATION_MASK",
  fileName: string,
): Promise<PresignedUrlResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("로그인이 필요합니다.");

  const storeMemberId = useAuthStore.getState().user?.memberId;
  const memberId = storeMemberId ?? getMemberIdFromToken(token);

  if (!memberId) throw new Error("회원 정보를 확인할 수 없습니다.");

  const response = await issuePresignedUrl({
    category,
    fileName,
    memberId,
  });

  console.log(
    `%c[PresignedUrl 발급성공] ${category}`,
    "color: #00ff00; font-weight: bold;",
  );
  console.log(`- 서버가 준 objectPath: ${response.data.objectPath}`);
  console.log(
    `- GCS 업로드 URL: ${response.data.url.split("?")[0]}... (서명생략)`,
  );

  return response;
}

// 2. GCS 직접 업로드 (PUT)
export async function uploadToGCS(
  url: string,
  file: Blob | File,
): Promise<void> {
  console.log(
    `%c[GCS 업로드 시작] Target: ${url.split("?")[0]}`,
    "color: #00bcff;",
  );

  try {
    await uploadToPresignedUrlApi({
      url,
      file,
      contentType: file.type || "image/png",
    });
  } catch (error) {
    console.error("[GCS 업로드 실패]", error);
    throw new Error("GCS 이미지 업로드 실패");
  }

  console.log(
    "%c[GCS 업로드 완료] Status: 200 OK",
    "color: #00bcff; font-weight: bold;",
  );
}

export interface RequestRestorationResponseData {
  id: number;
}

export type RestorationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface RestorationStatusData {
  id: number;
  originalUrl: string;
  restoredUrl: string | null;
  restoredWidth: number | null;
  restoredHeight: number | null;
  status: RestorationStatus;
  tokenUsed: number;
  feedbackRating: "GOOD" | "BAD" | null;
  feedbackComment: string | null;
  errorMessage: string | null;
  createdAt: string;
}

// 3. 복원 요청 (POST)
export async function requestRestoration(
  originalPath: string,
  maskPath: string,
): Promise<ApiResponse<RequestRestorationResponseData>> {
  // 실제로 서버에 쏘기 직전의 JSON 바디 확인
  console.log(
    "%c[복원 요청 전송 데이터]",
    "color: #ff9900; font-weight: bold;",
  );
  console.table({ originalPath, maskPath });

  const response = await axiosInstance.post<
    ApiResponse<RequestRestorationResponseData>
  >("/restorations", {
    originalPath,
    maskPath,
  });

  const body = response.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 4. 상태 조회 (GET) - tokenUsed 포함
export async function getRestorationStatus(
  id: number,
): Promise<ApiResponse<RestorationStatusData>> {
  const response = await axiosInstance.get<ApiResponse<RestorationStatusData>>(
    `/restorations/${id}`,
  );

  const body = response.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
