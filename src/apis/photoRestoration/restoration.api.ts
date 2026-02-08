import { useAuthStore } from "@/store/useAuth.store";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
}

interface PresignedUrlResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: {
    url: string;
    objectPath: string;
    expiresAtEpochSecond: number;
  };
}

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

  const response = await fetch(`${BASE_URL}/files/presigned-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ category, fileName, memberId }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown Error" }));
    console.error("Presigned URL 발급 실패 상세:", errorData);
    throw new Error(errorData.message || `발급 실패 (${response.status})`);
  }

  const result: PresignedUrlResponse = await response.json();

  // 서버가 준 경로와 업로드 URL을 나란히 출력하여 대조
  console.log(
    `%c[PresignedUrl 발급성공] ${category}`,
    "color: #00ff00; font-weight: bold;",
  );
  console.log(`- 서버가 준 objectPath: ${result.data.objectPath}`);
  console.log(
    `- GCS 업로드 URL: ${result.data.url.split("?")[0]}... (서명생략)`,
  );

  return result;
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

  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "image/png",
    },
  });

  if (!response.ok) {
    console.error("[GCS 업로드 실패] Status:", response.status);
    throw new Error("GCS 이미지 업로드 실패");
  }

  console.log(
    "%c[GCS 업로드 완료] Status: 200 OK",
    "color: #00bcff; font-weight: bold;",
  );
}

export interface RequestRestorationResponseData {
  id: number; // restorationId
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
  tokenUsed: number; // 서버가 확정한 사용 토큰(크레딧) 수
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

  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/restorations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ originalPath, maskPath }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    console.error(
      "%c[복원 요청 실패 상세]",
      "color: #ff0000; font-weight: bold;",
      errorJson,
    );
    throw new Error(errorJson.message || "복원 요청 실패");
  }

  const body =
    (await response.json()) as ApiResponse<RequestRestorationResponseData>;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 4. 상태 조회 (GET) - tokenUsed 포함
export async function getRestorationStatus(
  id: number,
): Promise<ApiResponse<RestorationStatusData>> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/restorations/${id}`, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) throw new Error("상태 조회 실패");

  const body = (await response.json()) as ApiResponse<RestorationStatusData>;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
