import { useCallback } from "react";
import { useNewPostState } from "@/store/useNewPostState.store";
import type { PostRequest } from "@/types/photoFeed/post";
import { getImageSize } from "@/store/useNewPostState.store";
import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import { tokenStorage } from "@/utils/tokenStorage";

type PresignedUrlResponse = {
  url: string;
  objectPath: string;
  expiresAt: number;
};

async function getPresignedUrl(file: File, token: string) {
  const { data } = await axiosInstance.post<ApiResponse<PresignedUrlResponse>>(
    "/api/files/presigned-url",
    {
      category: "POST_IMAGE",
      memberId: 1,
      fileName: file.name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data.data;
}

async function putToGcs(url: string, file: File) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error("GCS 업로드 실패");
}

export function useGcsUpload() {
  const upload = useCallback(async (file: File) => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      throw new Error("로그인이 필요합니다. (accessToken 없음)");
    }

    const { url, objectPath } = await getPresignedUrl(file, accessToken);
    await putToGcs(url, file);

    return objectPath;
  }, []);

  return { upload };
}

export function useCreatePostWithImage() {
  const { upload } = useGcsUpload();

  const create = useCallback(async () => {
    const state = useNewPostState.getState();
    const file = state.files[0];
    if (!file) throw new Error("이미지를 선택해 주세요");

    // width/height + objectPath 병렬
    const [{ width, height }, objectPath] = await Promise.all([
      getImageSize(file),
      upload(file),
    ]);

    const body: PostRequest = {
      title: state.title,
      content: state.content,
      isSelfDeveloped: state.isSelfDeveloped,
      image: {
        imageUrl: objectPath, // objectPath 넣는 자리
        width,
        height,
      },
      ...(state.labId != null ? { labId: state.labId } : {}),
      ...(state.reviewContent ? { reviewContent: state.reviewContent } : {}),
    };

    const { data } = await axiosInstance.post("/api/posts", body);
    return data;
  }, [upload]);

  return { create };
}
