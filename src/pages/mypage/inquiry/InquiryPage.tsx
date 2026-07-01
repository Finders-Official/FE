import { useCallback, useEffect, useRef, useState } from "react";
import { CTA_Button, PageSlide, TextArea, Toast } from "@/components/common";
import {
  EmptyOrderState,
  InquiryDropBox,
  InquiryListItem,
  InquiryNoticeCard,
} from "@/components/mypage";

import type { InquiryOption, InquiryType } from "@/types/mypage/inquiry";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useInquiriesInfinite } from "@/hooks/my";
import { useCreateInquiry } from "@/hooks/my/inquiries/useCreateInquiry";
import { useOutletContext } from "react-router";
import type { MyPageOutletContext } from "@/layouts/MyPageLayout";

// 스텝 타입 정의
type Step = "LIST" | "CREATE";

export function InquiryPage() {
  const [step, setStep] = useState<Step>("LIST");

  // 부모(Layout)가 내려준 setCustomOnBack 가져오기
  const context = useOutletContext<MyPageOutletContext | null>();
  const setCustomOnBack = context?.setCustomOnBack;

  // step이 CREATE일 때는 헤더 뒤로가기가 라우터 히스토리가 아닌 LIST로 돌아가게 함
  useEffect(() => {
    if (!setCustomOnBack) return;

    if (step === "CREATE") {
      setCustomOnBack(() => () => setStep("LIST"));
    } else {
      setCustomOnBack(null);
    }

    return () => setCustomOnBack(null);
  }, [step, setCustomOnBack]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <PageSlide
        step={step}
        direction={step === "CREATE" ? "forward" : "back"}
        className="flex flex-1 flex-col"
      >
        {step === "LIST" ? (
          <InquiryListView onGoToCreate={() => setStep("CREATE")} />
        ) : (
          <InquiryCreateView onSuccess={() => setStep("LIST")} />
        )}
      </PageSlide>
    </div>
  );
}

// ==========================================
// 1. 문의 내역 리스트 화면
// ==========================================
function InquiryListView({ onGoToCreate }: { onGoToCreate: () => void }) {
  // 무한 스크롤 API 훅 호출
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInquiriesInfinite(10);

  // 2차원 배열을 1차원 배열로 평탄화
  const inquiryList = data?.pages.flatMap((page) => page.data.inquiries) ?? [];
  const hasInquiries = inquiryList.length > 0;

  // --- 무한 스크롤 옵저버 로직 ---
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = useCallback(() => {
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;
    fetchNextPage(); // 바닥에 닿으면 다음 페이지 호출
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useInfiniteScroll({
    target: bottomRef,
    onIntersect,
    enabled: !isLoading && !isError,
    root: null,
    rootMargin: "200px", // 바닥에서 200px 남았을 때 미리 로딩 시작
    threshold: 0,
  });

  return (
    <>
      {/* overflow-y-auto */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner open={isLoading} />
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center text-neutral-400">
            <p>문의 내역을 불러오지 못했습니다.</p>
          </div>
        ) : hasInquiries ? (
          <div className="flex flex-col gap-2">
            <div className="text-center text-neutral-400">
              {/* 리스트 렌더링 */}
              {inquiryList.map((inquiry, index) => (
                <InquiryListItem
                  key={inquiry.id ?? `fallback-key-${index}`}
                  item={inquiry}
                />
              ))}

              {/* 추가 데이터 로딩 인디케이터 */}
              {isFetchingNextPage && (
                <div className="py-4 text-center text-sm text-neutral-400">
                  더 불러오는 중...
                </div>
              )}

              {/* 스크롤 감지용 센티널 */}
              <div ref={bottomRef} className="h-1 w-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyOrderState
              description={`파인더스 서비스에 대한\n문의를 남겨보세요.`}
            />
          </div>
        )}
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-10 shrink-0 border-t bg-neutral-900 py-5">
        <CTA_Button
          size="xlarge"
          text="문의하기"
          color="orange"
          onClick={onGoToCreate}
        />
      </footer>
    </>
  );
}

// ==========================================
// 2. 문의 작성 화면
// ==========================================
export function InquiryCreateView({ onSuccess }: { onSuccess: () => void }) {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryOption | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isContentValid = content.length >= 20;

  // Mutation 훅 호출
  const { mutate: createInquiry, isPending } = useCreateInquiry();

  const handleSubmitClick = () => {
    if (!selectedInquiry) {
      setToastMessage("문의 유형을 선택해 주세요.");
      return;
    }
    if (!isContentValid) {
      setToastMessage("문의 내용을 20자 이상 입력해 주세요.");
      return;
    }

    // API 전송 로직 실행
    createInquiry(
      {
        type: selectedInquiry.value as InquiryType,
        content: content,
        // photoLabId 나 objectPaths 가 필요하다면 여기에 추가 (현재 뷰에는 없음)
      },
      {
        // mutate 성공 시 실행될 콜백
        onSuccess: () => {
          onSuccess(); // 부모(InquiryPage)에서 넘겨준 setStep("LIST") 실행
        },
        onError: () => {
          setToastMessage(
            "문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.",
          );
        },
      },
    );
  };

  return (
    <>
      <main className="border-neutral-875 relative flex flex-1 flex-col gap-4 overflow-y-auto border-b py-4">
        {/* 문의 유형 */}

        <section className="flex flex-col gap-2">
          <label className="text-[0.9rem] text-neutral-200">문의 유형</label>

          <InquiryDropBox
            value={selectedInquiry}
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            onSelect={(option) => {
              setSelectedInquiry(option);

              setIsOpen(false);
            }}
          />
        </section>

        {/* 문의 내용 */}

        <section className="flex flex-col gap-2">
          <label className="text-[0.9rem] text-neutral-200">문의 내용</label>

          <TextArea
            type="content"
            value={content}
            onChange={setContent}
            placeholder="문의하실 내용이나 오류 내용을 입력해주세요"
            minLength={20}
            emptyHint="min"
          />
        </section>

        <section className="py-2">
          <InquiryNoticeCard />
        </section>

        <Toast
          open={!!toastMessage}
          onClose={() => setToastMessage(null)}
          duration={3000}
          placement="above-tab"
          message={toastMessage ?? ""}
        />
      </main>

      <footer className="border-neutral-850 mt-auto border-t py-5">
        <CTA_Button
          size="xlarge"
          text={isPending ? "제출 중..." : "문의하기"}
          // 로딩 중이거나 유효성 검사 실패 시 버튼 비활성화 색상 적용
          color={
            isContentValid && selectedInquiry && !isPending ? "orange" : "black"
          }
          onClick={handleSubmitClick}
        />
      </footer>
    </>
  );
}
