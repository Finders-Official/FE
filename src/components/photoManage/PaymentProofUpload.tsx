import { useRef } from "react";
import { UploadIcon } from "@/assets/icon";

interface PaymentProofUploadProps {
  preview: string | null;
  onFileSelect: (file: File, preview: string) => void;
}

export function PaymentProofUpload({
  preview,
  onFileSelect,
}: PaymentProofUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-[1.875rem] flex flex-col gap-4">
      {/* 안내 텍스트 */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[1rem] leading-[1.55] font-semibold tracking-[-0.02rem] text-neutral-100">
          입금 완료한 캡처본을 등록해주세요.
        </p>
        <p className="text-[0.8125rem] leading-[1.55] tracking-[-0.01625rem] text-neutral-400">
          보낸 이와 받는 이가 확인할 수 있는 사진을 첨부해주세요
        </p>
      </div>

      {/* 업로드 */}
      <div
        className="relative h-[7.3125rem] w-full overflow-hidden rounded-2xl"
        style={{
          backgroundImage: preview
            ? "none"
            : "repeating-conic-gradient(#6a6a6a 0% 25%, #5a5a5a 0% 50%)",
          backgroundSize: "2.5rem 2.5rem",
        }}
      >
        {preview && (
          <img
            src={preview}
            alt="입금 증빙"
            className="h-full w-full object-cover"
          />
        )}

        <button
          type="button"
          onClick={handleClick}
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/40 bg-black/60 px-7 py-4"
        >
          <UploadIcon className="h-6 w-6 text-neutral-100" />
          <span className="text-[1rem] leading-[1.55] font-semibold tracking-[-0.02rem] text-neutral-100">
            업로드 하기
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
