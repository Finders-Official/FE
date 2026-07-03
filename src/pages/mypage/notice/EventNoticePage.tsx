import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useNoticeDetail } from "@/hooks/my";
import { formatYmdDot } from "@/utils/dateFormat";
import { useSearchParams } from "react-router";

export function EventNoticePage() {
  const [searchParams] = useSearchParams();

  // URL에서 ?id=... 값을 읽어옴 (TSID 문자열)
  const idParam = searchParams.get("id");
  const noticeId = idParam || null;

  // API 호출
  const { data: response, isLoading, isError } = useNoticeDetail(noticeId);

  // API에서 리턴된 상세 데이터 객체 추출
  const noticeDetail = response?.data;

  // 1. 로딩 상태 처리
  if (isLoading) {
    return <LoadingSpinner open={isLoading} />;
  }

  // 2. 에러 상태 또는 데이터가 비정상적일 때 처리
  if (isError || !noticeDetail) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-400">
        <p>공지사항을 불러오는 중 오류가 발생했거나 없는 공지입니다.</p>
      </div>
    );
  }

  // 3. 정상 데이터 날짜 포맷
  const date = formatYmdDot(noticeDetail.createdAt);
  return (
    <div className="flex flex-col gap-5.5">
      <header className="flex flex-col gap-3 px-1 py-5">
        <p className="text-[1.125rem] leading-[126%] font-normal tracking-[-0.02125rem]">
          {noticeDetail.title}
        </p>
        <p className="text-[0.9rem] leading-[155%] tracking-[-0.01625rem] text-neutral-600">
          {date}
        </p>
      </header>
      <main className="px-1">
        <p className="text-[1rem] leading-[155%] tracking-[-0.01875rem] whitespace-pre-wrap">
          {noticeDetail.content}
        </p>
      </main>
    </div>
  );
}
