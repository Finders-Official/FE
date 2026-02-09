import NoticeSectionCard from "./NoticeSectionCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { usePhotoLabNotices } from "@/hooks/photoLab";

export default function NoticeSection() {
  const { data: notices, isLoading, isError } = usePhotoLabNotices();

  if (isLoading) return null;
  if (isError || !notices || notices.length === 0) return null;

  return (
    <section className="flex flex-col gap-3.5 py-6">
      {/* 헤더 */}
      <SectionHeader title="현상소에서 알려드립니다" />

      {/* 가로 스크롤 리스트 */}
      <div className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-20">
        {notices.map((notice, index) => (
          <div key={index} className="flex-none snap-start">
            <NoticeSectionCard notice={notice} />
          </div>
        ))}
      </div>
    </section>
  );
}
