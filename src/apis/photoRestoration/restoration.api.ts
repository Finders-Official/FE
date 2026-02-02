const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

interface PresignedUrlResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    url: string; // GCS 업로드용 URL
    objectPath: string; // 나중에 복원 요청에 보낼 경로
    expiresAtEpochSecond: number;
  };
}

// JWT 토큰에서 memberId(혹은 sub)를 추출하는 헬퍼 함수
function getMemberIdFromToken(token: string): number {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return Number(decoded.id || decoded.memberId || decoded.sub || 0);
  } catch (e) {
    console.error("토큰 디코딩 실패", e);
    return 0;
  }
}

// 1. Presigned URL 발급 요청
export async function getPresignedUrl(
  category: "RESTORATION_ORIGINAL" | "RESTORATION_MASK",
  fileName: string,
) {
  const token = localStorage.getItem("accessToken");

  // 토큰이 없으면 에러
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  // 토큰에서 memberId 추출
  const memberId = getMemberIdFromToken(token);

  const response = await fetch(`${BASE_URL}/files/presigned-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      category,
      fileName,
      memberId,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown Error" }));
    console.error("Presigned URL Error Detail:", errorData);
    throw new Error(
      errorData.message || `Presigned URL 발급 실패 (${response.status})`,
    );
  }

  return response.json() as Promise<PresignedUrlResponse>;
}

// 2. GCS 직접 업로드 (PUT)
export async function uploadToGCS(url: string, file: Blob | File) {
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "image/png",
    },
  });
  if (!response.ok) throw new Error("GCS 이미지 업로드 실패");
}

// 3. 복원 요청 (POST)
export async function requestRestoration(
  originalPath: string,
  maskPath: string,
) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/restorations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ originalPath, maskPath }),
  });
  if (!response.ok) throw new Error("복원 요청 실패");
  return response.json();
}

// 4. 상태 조회 (GET)
export async function getRestorationStatus(id: number) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/restorations/${id}`, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error("상태 조회 실패");
  return response.json();
}
