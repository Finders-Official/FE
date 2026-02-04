import { useCallback } from "react";
import type { PostImage } from "@/types/photoFeed/postPreview";
import { useIssuePresignedUrl, useUploadToPresignedUrl } from "@/hooks/file";
import { useCreatePost } from "@/hooks/photoFeed/posts/useCreatePost";

type ImageMeta = { width: number; height: number };

type SubmitArgs = {
  title: string;
  content: string;
  files: File[];
  imageMetas: ImageMeta[];
  memberId?: number | null;

  labId?: number;
  isSelfDeveloped: boolean;
  reviewContent?: string;
};

type Options = {
  onSuccess?: (postId: number) => void;
  onError?: (e: unknown) => void;
};

export function useCreatePostWithUpload(options?: Options) {
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
      const postImages: PostImage[] = presignedList.map((p, idx) => ({
        imageUrl: p.objectPath,
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

      return postId;
    },
    [issuePresigned, uploadToPresigned, createPost],
  );

  const isPending =
    issuePresigned.isPending ||
    uploadToPresigned.isPending ||
    createPost.isPending;

  return { submit, isPending };
}
