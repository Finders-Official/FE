import { useEffect, useState } from "react";
import { CTA_Button, TextArea, ToastItem } from "@/components/common";
import {
  EmptyOrderState,
  InquiryDropBox,
  InquiryListItem,
  InquiryNoticeCard,
} from "@/components/mypage";

import type { InquiryItem, InquiryOption } from "@/types/mypage/inquiry";

const MOCK_INQUIRIES: InquiryItem[] = [
  {
    id: 1,
    type: "SERVICE_ERROR",
    content: "문의 내용은 다음과 같습니다.\n좋은하루 되세요. 감사합니다.",
    status: "PENDING",
    createdAt: "2025-01-01T10:00:00Z",
    hasReply: false,
  },
  {
    id: 2,
    type: "ACCOUNT_INFO",
    content: "회원정보 변경을 요청합니다.\n확인 후 처리 부탁드립니다.",
    status: "COMPLETED",
    createdAt: "2025-01-02T11:00:00Z",
    hasReply: true,
    replyContent: "답변 내용은 다음과 같습니다.\n좋은하루 되세요. 감사합니다.",
    replyCreatedAt: "2025-01-03T09:00:00Z",
  },
  {
    id: 3,
    type: "PROMOTION",
    content: "친구 초대 크레딧이 아직 안 들어왔어요.\n언제 지급되나요?",
    status: "PENDING",
    createdAt: "2025-01-04T15:30:00Z",
    hasReply: false,
  },
  {
    id: 4,
    type: "PAYMENT",
    content: "어제 결제한 건이 중복 결제된 것 같습니다.\n환불 부탁드립니다.",
    status: "COMPLETED",
    createdAt: "2025-01-05T08:20:00Z",
    hasReply: true,
    replyContent:
      "중복 결제 내역 확인되어 환불 처리 완료했습니다.\n이용에 불편을 드려 죄송합니다.",
    replyCreatedAt: "2025-01-05T14:10:00Z",
  },
];

// 스텝 타입 정의
type Step = "LIST" | "CREATE";

export function InquiryPage() {
  const [step, setStep] = useState<Step>("LIST");

  return (
    <div className="flex h-full flex-1 flex-col">
      {step === "LIST" ? (
        <InquiryListView onGoToCreate={() => setStep("CREATE")} />
      ) : (
        <InquiryCreateView
          onSubmit={() => {
            // TODO: API 전송 로직
            // 전송 성공 후 다시 리스트로 돌아가기
            setStep("LIST");
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// 1. 문의 내역 리스트 화면
// ==========================================
function InquiryListView({ onGoToCreate }: { onGoToCreate: () => void }) {
  // TODO: API에서 받아온 문의 내역 데이터
  const hasInquiries = MOCK_INQUIRIES.length > 0;

  return (
    <>
      <main className="flex flex-1 flex-col overflow-y-auto">
        {hasInquiries ? (
          <div className="flex flex-col gap-2">
            {/* 이미지에 있는 문의내역 아코디언 아이템들이 들어갈 자리 */}
            <div className="text-center text-neutral-400">
              {/*  목 데이터를 순회하며 아이템 컴포넌트 렌더링 */}
              {MOCK_INQUIRIES.map((inquiry) => (
                <InquiryListItem key={inquiry.id} item={inquiry} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyOrderState description="파인더스 서비스에 대한\n 문의를 남겨보세요." />
          </div>
        )}
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-10 shrink-0 border-t bg-neutral-900 py-5">
        <CTA_Button
          size="xlarge"
          text="문의하기"
          color="orange"
          onClick={onGoToCreate} // 클릭 시 CREATE 뷰로 전환
        />
      </footer>
    </>
  );
}

// ==========================================
// 2. 문의 작성 화면
// ==========================================
export function InquiryCreateView({ onSubmit }: { onSubmit: () => void }) {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryOption | null>(
    null,
  );

  // 토스트 메시지 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isContentValid = content.length >= 20;

  // 토스트 타이머 관리: 메시지가 생기면 3초 뒤에 삭제
  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSubmitClick = () => {
    // 1. 문의 유형 선택 안 했을 때
    if (!selectedInquiry) {
      setToastMessage("문의 유형을 선택해 주세요.");
      return;
    }

    // 2. 내용이 20자 미만일 때
    if (!isContentValid) {
      setToastMessage("문의 내용을 20자 이상 입력해 주세요.");
      return;
    }

    // 통과 시 실제 제출 로직 실행
    onSubmit();
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

        {/* 토스트 렌더링 영역 */}
        {toastMessage && (
          <div className="fixed bottom-[var(--tabbar-height)] ml-4 flex animate-[finders-fade-in_500ms_ease-in-out_forwards] items-center justify-center">
            <ToastItem message={toastMessage} />
          </div>
        )}
      </main>

      <footer className="border-neutral-850 mt-auto border-t py-5">
        <CTA_Button
          size="xlarge"
          text="문의하기"
          color={isContentValid && selectedInquiry ? "orange" : "black"}
          onClick={handleSubmitClick}
        />
      </footer>
    </>
  );
}
