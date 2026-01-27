// 메인 페이지 연결하고 삭제할 파일 입니다.

import type { ChangeEvent } from "react";
import { useNewPostState } from "@/store/useNewPostState.store";
interface PhotoSelectProps {
  onSelect: () => void;
}

const PhotoSelectPage = ({ onSelect }: PhotoSelectProps) => {
  const { setFiles } = useNewPostState();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFiles([selectedFile]);
      onSelect(); // 다음 단계로 이동 트리거
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-5">
      <h2 className="mb-2 text-[22px] font-bold text-neutral-100">
        복원할 사진을 선택해주세요
      </h2>
      <p className="mb-10 text-[15px] text-neutral-400">
        훼손된 사진을 AI가 깨끗하게 복원해드려요
      </p>

      {/* 업로드 버튼 */}
      <label className="bg-neutral-875 hover:bg-neutral-850 flex aspect-[3/4] w-full max-w-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-700 transition-colors hover:border-neutral-500 active:scale-[0.98]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
          {/* 플러스 아이콘 */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-neutral-400"
          >
            <path
              d="M12 5V19"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12H19"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[16px] font-semibold text-neutral-200">
          사진 업로드하기
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default PhotoSelectPage;
