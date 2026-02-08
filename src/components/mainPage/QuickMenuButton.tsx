import { useRef, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import { MainCamera, MainFilm, RestoraionSparkleIcon } from "@/assets/icon";
import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";
import { useAuthStore } from "@/store/useAuth.store";

export default function QuickActionGrid() {
  const navigate = useNavigate();
  const { requireAuthNavigate } = useRequireAuth();

  const user = useAuthStore((s) => s.user);
  const isAuthed = Boolean(user && user.memberId > 0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    const objectUrl = URL.createObjectURL(selectedFile);

    navigate("/restore/editor", {
      state: { imageUrl: objectUrl },
    });

    e.target.value = "";
  };

  const handleRestoreClick = () => {
    if (!isAuthed) {
      requireAuthNavigate("/photoRestoration");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <section className="mt-7.5 mb-7.5 grid h-51 grid-cols-2 grid-rows-2 gap-3">
        {/* 현상 맡기기 */}
        <ActionCard
          onClick={() => requireAuthNavigate("/photolab")}
          className="row-span-2 flex flex-col items-center justify-center gap-4 bg-linear-to-br from-[#2a2a2a] to-[#111111]"
        >
          <div className="flex size-12.5 items-center justify-center">
            <MainFilm className="size-full text-orange-500" />
          </div>
          <span className="mt-2 text-[1rem] font-semibold text-neutral-100">
            현상 맡기기
          </span>
        </ActionCard>

        {/* 사진 복원하기 */}
        <ActionCard
          onClick={handleRestoreClick}
          className="flex flex-col items-center justify-center gap-2 bg-[#1C1C1E]"
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-orange-500">
            <RestoraionSparkleIcon
              className="size-6 fill-white"
              strokeWidth={0}
            />
          </div>
          <span className="mt-2 text-[1rem] font-semibold text-neutral-100">
            사진 복원하기
          </span>
        </ActionCard>

        {/* 필카 입문 101 */}
        <ActionCard
          onClick={() => requireAuthNavigate("/film-camera-guide")}
          className="flex flex-col items-center justify-center gap-2 bg-[#1C1C1E]"
        >
          <div className="flex size-8 items-center justify-center">
            <MainCamera className="size-8 text-[#FF5A00]" strokeWidth={2} />
          </div>
          <span className="mt-2 text-[1rem] font-semibold text-neutral-100">
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
  const commonStyles = `relative cursor-pointer overflow-hidden rounded-[1.25rem] border border-white/15 shadow-inner transition-transform active:scale-[0.98] ${className ?? ""}`;

  const content = (
    <>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#FF5A00]/30 via-transparent to-transparent" />
      <div className="relative z-10 flex size-full flex-col items-center justify-center">
        {children}
      </div>
    </>
  );

  return to ? (
    <Link to={to} className={commonStyles}>
      {content}
    </Link>
  ) : (
    <div onClick={onClick} className={commonStyles}>
      {content}
    </div>
  );
}
