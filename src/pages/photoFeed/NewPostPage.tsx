import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useSelectedPhotos } from "@/store/useSelectedPhotos";

export default function NewPostPage() {
  const navigate = useNavigate();
  const files = useSelectedPhotos((s) => s.files);

  // 1) 파일이 없으면(직접 URL로 들어왔거나 새로고침) 다시 선택 페이지로
  useEffect(() => {
    if (files.length === 0) {
      navigate("/photoFeed");
    }
  }, [files, navigate]);

  // 최대 10장 제한 (선택 단계에서 제한하는 게 더 좋지만, 여기서도 안전장치)
  const limitedFiles = useMemo(() => files.slice(0, 10), [files]);

  // 2) File -> objectURL로 변환 (img src로 사용)
  const previewUrls = useMemo(() => {
    return limitedFiles.map((file) => URL.createObjectURL(file));
  }, [limitedFiles]);

  // 3) 페이지 나갈 때 objectURL 해제(메모리 누수 방지)
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/** 선택된 사진 */}
      <div className="mb-4">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
          {previewUrls.map((url, idx) => (
            <div
              key={url}
              className="h-32 w-32 shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-800"
            >
              <img
                src={url}
                alt={`선택한 사진 ${idx + 1}`}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/** 내용 작성 */}

      {/** 유의사항 */}

      {/** 다음 버튼 */}
    </div>
  );
}

/**
 * CO-022 NewPostPage.tsx
 * Description: 텍스트 입력 페이지
 */
