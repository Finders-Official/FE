import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useIssuePresignedUrl, useUploadToPresignedUrl } from "@/hooks/file";
import { useCreatePost } from "@/hooks/photoFeed/posts/useCreatePost";
import type { PostRequestImage } from "@/types/photoFeed/postDetail";

type ImageMeta = { width: number; height: number };

type SubmitArgs = {
  title: string;
  content: string;
  files: File[];
  imageMetas: ImageMeta[];
  memberId?: string | null;

  labId?: string;
  isSelfDeveloped: boolean;
  reviewContent?: string;
};

type Options = {
  onSuccess?: (postId: string) => void;
  onError?: (e: unknown) => void;
};

export function useCreatePostWithUpload(options?: Options) {
  const queryClient = useQueryClient();
  const issuePresigned = useIssuePresignedUrl();
  const uploadToPresigned = useUploadToPresignedUrl();

  const createPost = useCreatePost({
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  const submit = useCallback(
    async (args: SubmitArgs) => {
      const {
        title,
        content,
        files,
        imageMetas,
        memberId,
        labId,
        isSelfDeveloped,
        reviewContent,
      } = args;

      if (!files?.length) throw new Error("업로드할 파일이 없습니다.");

      // 1) presigned 발급
      const presignedResults = await Promise.all(
        files.map((file) =>
          issuePresigned.mutateAsync({
            category: "POST_IMAGE",
            ...(memberId != null && { memberId }),
            fileName: file.name,
          }),
        ),
      );

      const presignedList = presignedResults.map((res) => {
        if (!res.success) throw new Error(res.message);
        return res.data; // { url, objectPath, expiresAtEpochSecond }
      });

      // 2) 업로드
      await Promise.all(
        presignedList.map((p, idx) =>
          uploadToPresigned.mutateAsync({
            url: p.url,
            file: files[idx],
            contentType: files[idx].type,
          }),
        ),
      );

      // 3) createPost에 넣을 images 생성 (objectPath 기반)
      const postImages: PostRequestImage[] = presignedList.map((p, idx) => ({
        objectPath: p.objectPath,
        width: imageMetas[idx].width,
        height: imageMetas[idx].height,
      }));

      // 4) 게시글 생성
      const postId = await createPost.mutateAsync({
        title,
        content,
        images: postImages,
        isSelfDeveloped,
        labId,
        reviewContent,
      });

      // 5) 사진수다 피드 최신화 (새 글이 바로 보이도록)
      // 등록 성공 시 상세 페이지로 이동해 피드 쿼리가 비활성 상태이므로,
      // refetchType: "all"로 마운트 여부와 무관하게 즉시 갱신한다.
      queryClient.invalidateQueries({
        queryKey: ["photoFeed"],
        refetchType: "all",
      });

      return postId;
    },
    [issuePresigned, uploadToPresigned, createPost, queryClient],
  );

  const isPending =
    issuePresigned.isPending ||
    uploadToPresigned.isPending ||
    createPost.isPending;

  return { submit, isPending };
}
