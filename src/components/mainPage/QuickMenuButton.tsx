// TODO: 파일 이름 QuickActionGrid로 변경

import { useRef, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import { MainCamera, MainFilm, MainSparkle } from "@/assets/icon";

export default function QuickActionGrid() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 시 처리 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // File 객체를 브라우저용 URL(문자열)로 변환
      const objectUrl = URL.createObjectURL(selectedFile);

      // navigate는 한 번만 호출하며, 키값은 'imageUrl'로 통일
      navigate("/restore/editor", {
        state: { imageUrl: objectUrl },
      });

      // (선택사항) 동일한 파일을 다시 선택할 수 있도록 input 초기화
      e.target.value = "";
    }
  };

  // 카드 클릭 시 숨겨진 input 트리거
  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* 숨겨진 파일 입력 필드 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <section className="mt-7.5 mb-7.5 grid h-51 grid-cols-2 grid-rows-2 gap-3 px-5">
        {/* 현상 맡기기 */}
        <ActionCard
          to="/"
          className="row-span-2 flex flex-col items-center justify-center gap-4 bg-linear-to-br from-[#2a2a2a] to-[#111111]"
        >
          <div className="flex size-12.5 items-center justify-center">
            <MainFilm className="size-full text-orange-500" strokeWidth={1.5} />
          </div>
          <span className="text-[16px] font-semibold text-neutral-100">
            현상 맡기기
          </span>
        </ActionCard>

        {/* 사진 복원하기 */}
        <ActionCard
          onClick={handleRestoreClick}
          className="flex flex-col items-center justify-center gap-2 bg-[#1C1C1E]"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-orange-500">
            <MainSparkle className="size-12 fill-white" strokeWidth={0} />
          </div>
          <span className="text-[1rem] font-semibold text-neutral-100">
            사진 복원하기
          </span>
        </ActionCard>

        {/* 필카 입문 101 */}
        <ActionCard
          to="/"
          className="flex flex-col items-center justify-center gap-2 bg-[#1C1C1E]"
        >
          <div className="flex size-8 items-center justify-center">
            <MainCamera className="size-8 text-[#FF5A00]" strokeWidth={2} />
          </div>
          <span className="mt-2.5 text-[16px] font-semibold text-neutral-100">
            필카 입문 101
          </span>
        </ActionCard>
      </section>
    </>
  );
}

interface ActionCardProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

function ActionCard({ to, onClick, className, children }: ActionCardProps) {
  const commonStyles = `relative overflow-hidden rounded-[20px] border border-white/5 shadow-inner transition-transform active:scale-[0.98] ${className} cursor-pointer`;

  const content = (
    <>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#FF5A00]/10 via-transparent to-transparent" />
      <div className="relative z-10 flex size-full flex-col items-center justify-center">
        {children}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={commonStyles}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={commonStyles}>
      {content}
    </div>
  );
}
