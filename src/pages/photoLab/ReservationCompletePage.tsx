import { useNavigate, useLocation, useParams } from "react-router";
import { Header, ConfirmationIcon, TextArea } from "@/components/common";
import { LabLocationSection } from "@/components/photoLab/detail";
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon,
  ChatBubbleIcon,
  PencilLineIcon,
} from "@/assets/icon";

// Mock data - 추후 API로 연동
const MOCK_MEMO = "안녕하세요. 처음으로 현상 맡깁니다.\n친절하게 안내해주세요!";
const DEFAULT_LAB_MESSAGE =
  "예약이 확정되었습니다. 당일취소 불가능하며 1시간 전 연락주시면 일정 변경 가능합니다. 감사합니다:)";
// 위치도 API response에 추가 가능한지 확인 필요
const MOCK_LOCATION = {
  address: "서울 동작구 상도로 00길 00",
  distanceKm: 1.5,
  location: {
    latitude: 37.50287963116875,
    longitude: 126.94790892178148,
  },
};

interface LocationState {
  labName?: string;
}

export default function ReservationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoLabId } = useParams();

  const state = location.state as LocationState | null;
  const labName = state?.labName ?? "파인더스 상도점";

  const handleClose = () => {
    navigate(`/photolab/${photoLabId}`, { replace: true });
  };

  return (
    <div className="flex w-full flex-col">
      <Header
        title={labName}
        rightAction={{
          type: "icon",
          icon: <XMarkIcon className="h-3.5 w-3.5 text-neutral-200" />,
          onClick: handleClose,
        }}
      />

      <main className="pb-32">
        {/* 예약 성공 메시지 */}
        <section className="border-neutral-850 -mx-4 flex flex-col items-center gap-[1.375rem] border-b-[6px] px-4 py-[1.875rem]">
          <ConfirmationIcon className="h-[3rem] w-[3rem]" />
          <div className="flex flex-col items-center gap-0.5">
            <h1 className="text-[1.125rem] leading-[155%] font-semibold tracking-[-0.02em]">
              <span className="text-orange-500">현상소 예약</span>
              <span className="text-neutral-100">이 완료되었어요</span>
            </h1>
            <p className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-500">
              정성을 담아 소중한 추억을 현상해드릴게요
            </p>
          </div>
        </section>

        {/* 예약 내역 */}
        <section className="flex flex-col gap-[1.125rem] py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            예약 내역
          </h2>

          <div className="flex flex-col gap-5">
            {/* 일정 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center">
                  <CalendarIcon className="h-3.5 w-3.5 text-neutral-200" />
                </div>
                <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                  일정
                </span>
              </div>
              <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                2025. 12. 12(금) 오전 11:00
              </span>
            </div>

            {/* 예상 완료 시점 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center">
                  <ClockIcon className="h-3.5 w-3.5 text-neutral-200" />
                </div>
                <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                  예상 완료 시점
                </span>
              </div>
              <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                2025. 12. 12(금) 오후 3:00
              </span>
            </div>

            {/* 작업 옵션 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center">
                  <BriefcaseIcon className="h-3.5 w-3.5 text-neutral-200" />
                </div>
                <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                  작업 옵션
                </span>
              </div>
              <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                현상 • 스캔 • 2롤
              </span>
            </div>

            {/* 요청사항 - 없으면 안보임 */}
            {MOCK_MEMO && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <ChatBubbleIcon className="h-3.5 w-3.5 text-neutral-200" />
                  </div>
                  <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                    요청사항
                  </span>
                </div>
                <TextArea value={MOCK_MEMO} onChange={() => {}} disabled />
              </div>
            )}

            {/* 현상소에서 드리는 글 - 없으면 안보임 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center">
                  <PencilLineIcon className="h-3.5 w-3.5 text-neutral-200" />
                </div>
                <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                  {labName}에서 드리는 글
                </span>
              </div>
              <TextArea
                value={DEFAULT_LAB_MESSAGE}
                onChange={() => {}}
                disabled
              />
            </div>
          </div>
        </section>

        {/* 위치 */}
        <LabLocationSection
          address={MOCK_LOCATION.address}
          distanceKm={MOCK_LOCATION.distanceKm}
          location={MOCK_LOCATION.location}
          labName={labName}
        />
      </main>
    </div>
  );
}
