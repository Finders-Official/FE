import { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import {
  Header,
  Checkbox,
  TextArea,
  CTA_Button,
  ToastList,
  ToastItem,
} from "@/components/common";
import { TimeSlotChip } from "@/components/common/chips";
import { Calendar } from "@/components/photoLab";
import {
  MinusIcon,
  PlusIcon,
  ExclamationCircleIcon,
  CalendarFillIcon,
  BriefcaseFillIcon,
} from "@/assets/icon";
import {
  AM_TIME_SLOTS,
  PM_TIME_SLOTS,
  API_TO_TIME_SLOT,
  TIME_SLOT_TO_API,
  TASK_OPTIONS,
  FILM_ROLL_MIN,
  FILM_ROLL_MAX,
  REQUEST_MEMO_MAX_LENGTH,
  CAUTION_ITEMS,
} from "@/constants/photoLab";
import { useAvailableTimes, useCreateReservation } from "@/hooks/photoLab";
import type { TaskType } from "@/types/reservation";

interface LocationState {
  labName?: string;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoLabId } = useParams();
  const state = location.state as LocationState | null;
  const labId = photoLabId ? Number(photoLabId) : undefined;

  const labName = state?.labName ?? "현상소";

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [filmRollCount, setFilmRollCount] = useState(0);
  const [requestMemo, setRequestMemo] = useState("");
  const [cautionConfirmed, setCautionConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<React.ReactNode | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dateKey = selectedDate ? formatDateKey(selectedDate) : undefined;

  const { data: availableTimes } = useAvailableTimes(labId, dateKey);
  const { mutate: createReservation } = useCreateReservation();

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // 날짜 변경 시 시간 초기화
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleTaskToggle = useCallback((task: TaskType) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task],
    );
  }, []);

  const handleFilmRollDecrement = useCallback(() => {
    setFilmRollCount((prev) => Math.max(FILM_ROLL_MIN - 1, prev - 1));
  }, []);

  const handleFilmRollIncrement = useCallback(() => {
    setFilmRollCount((prev) => Math.min(FILM_ROLL_MAX, prev + 1));
  }, []);

  // API 시간을 프론트 시간으로 변환한 Set
  const availableTimeSet = useMemo(() => {
    if (!availableTimes) return null;
    return new Set(
      availableTimes.map((apiTime) => {
        const timeWithoutSeconds = apiTime.slice(0, 5); // 응답엣서 초 제거
        return API_TO_TIME_SLOT[timeWithoutSeconds] ?? timeWithoutSeconds;
      }),
    );
  }, [availableTimes]);

  // 시간 비활성화 여부 확인
  const isTimeDisabled = useCallback(
    (time: string): boolean => {
      if (!selectedDate) return true;
      if (!availableTimeSet) return true;
      return !availableTimeSet.has(time);
    },
    [selectedDate, availableTimeSet],
  );

  // 예약 버튼 활성화 조건
  const isReservationValid =
    selectedDate !== null &&
    selectedTime !== null &&
    selectedTasks.length > 0 &&
    filmRollCount >= 1 &&
    cautionConfirmed &&
    !isSubmitting;

  const showToast = useCallback((message: string, icon?: React.ReactNode) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);
    setToastIcon(icon ?? null);

    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setToastIcon(null);
      toastTimeoutRef.current = null;
    }, 3000);
  }, []);

  const handleReservation = useCallback(() => {
    // 날짜/시간 선택
    if (selectedDate === null || selectedTime === null) {
      showToast(
        "날짜 및 시간을 선택해주세요.",
        <CalendarFillIcon className="h-[1.125rem] w-[1.125rem] text-orange-500" />,
      );
      return;
    }

    // 작업 내용
    if (selectedTasks.length === 0 || filmRollCount < 1) {
      showToast(
        "작업 옵션을 선택해주세요.",
        <BriefcaseFillIcon className="h-[1.125rem] w-[1.125rem] text-orange-500" />,
      );
      return;
    }

    // 주의사항 확인
    if (!cautionConfirmed) {
      showToast(
        "주의사항을 확인해주세요.",
        <ExclamationCircleIcon className="h-[1.125rem] w-[1.125rem] text-orange-500" />,
      );
      return;
    }

    if (!labId || isSubmitting) return;

    setIsSubmitting(true);
    const apiTime = TIME_SLOT_TO_API[selectedTime] ?? selectedTime;

    createReservation(
      {
        photoLabId: labId,
        data: {
          reservationDate: formatDateKey(selectedDate),
          reservationTime: apiTime,
          taskTypes: selectedTasks,
          filmCount: filmRollCount,
          memo: requestMemo || undefined,
        },
      },
      {
        onSuccess: () => {
          navigate(`/photolab/${photoLabId}/reservation/complete`, {
            state: {
              labName,
              selectedDate,
              selectedTime,
              selectedTasks,
              filmRollCount,
              requestMemo,
            },
            replace: true,
          });
        },
        onError: () => {
          setIsSubmitting(false);
          showToast(
            "예약에 실패했습니다. 다시 시도해주세요.",
            <ExclamationCircleIcon className="h-[1.125rem] w-[1.125rem] text-orange-500" />,
          );
        },
      },
    );
  }, [
    createReservation,
    isSubmitting,
    labId,
    navigate,
    photoLabId,
    labName,
    selectedDate,
    selectedTime,
    selectedTasks,
    filmRollCount,
    requestMemo,
    cautionConfirmed,
    showToast,
  ]);

  return (
    <div className="flex w-full flex-col">
      <Header title={labName} showBack onBack={handleBack} />

      <main className="pb-32">
        {/* 날짜 선택 섹션 */}
        <section className="flex flex-col gap-4 py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            날짜와 시간을 선택해주세요
          </h2>

          <Calendar
            selectedDate={selectedDate ?? undefined}
            onDateSelect={handleDateSelect}
          />

          {/* 시간 선택 */}
          <div className="border-neutral-850 -mx-4 flex flex-col gap-5 border-t px-4 pt-5">
            {/* 오전 */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[1.15rem] font-normal text-white">
                오전
              </span>
              <div className="grid grid-cols-4 gap-2">
                {AM_TIME_SLOTS.map((time) => (
                  <TimeSlotChip
                    key={time}
                    time={time}
                    selected={selectedTime === time}
                    disabled={isTimeDisabled(time)}
                    onClick={() => handleTimeSelect(time)}
                  />
                ))}
              </div>
            </div>

            {/* 오후 */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[1.15rem] font-normal text-white">
                오후
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PM_TIME_SLOTS.map((time) => (
                  <TimeSlotChip
                    key={`pm-${time}`}
                    time={time}
                    selected={selectedTime === time}
                    disabled={isTimeDisabled(time)}
                    onClick={() => handleTimeSelect(time)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="bg-neutral-850 -mx-4 h-1.5" />

        {/* 작업 옵션 */}
        <section className="flex flex-col gap-5 py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            작업 옵션을 선택해주세요
          </h2>

          {/* 작업 종류 */}
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <span className="text-[1.15rem] font-normal text-white">
                작업 종류
              </span>
              <span className="text-base font-normal text-neutral-400">
                필요한 작업을 모두 선택해주세요
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {TASK_OPTIONS.map((option) => (
                <div key={option.type} className="flex items-center gap-2.5">
                  <Checkbox
                    checked={selectedTasks.includes(option.type)}
                    onChange={() => handleTaskToggle(option.type)}
                    iconClassName="h-[1.15rem] w-[1.15rem]"
                  />
                  <span
                    className="cursor-pointer text-[1.15rem] font-normal text-white"
                    onClick={() => handleTaskToggle(option.type)}
                  >
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 현상할 필름 롤 수 */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[1.15rem] font-normal text-white">
              현상할 필름 롤 수
            </span>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={handleFilmRollDecrement}
                disabled={filmRollCount <= 0}
                className="disabled:text-neutral-750 flex h-[1.43rem] w-[1.43rem] items-center justify-center rounded-full border border-current text-neutral-100"
                aria-label="롤 수 감소"
              >
                <MinusIcon className="h-[0.08rem] w-[0.633rem]" />
              </button>
              <span className="w-8 text-center text-[1.1rem] font-normal text-white">
                {filmRollCount}
              </span>
              <button
                type="button"
                onClick={handleFilmRollIncrement}
                disabled={filmRollCount >= FILM_ROLL_MAX}
                className="disabled:text-neutral-750 flex h-[1.43rem] w-[1.43rem] items-center justify-center rounded-full border border-current text-neutral-100"
                aria-label="롤 수 증가"
              >
                <PlusIcon className="h-[0.633rem] w-[0.633rem]" />
              </button>
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="border-neutral-850 -mx-4 border-t" />

        {/* 요청사항 섹션 */}
        <section className="flex flex-col gap-4 py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            요청사항을 적어주세요
          </h2>

          <TextArea
            value={requestMemo}
            onChange={setRequestMemo}
            placeholder="사장님께 전달할 말을 작성해주세요."
            maxLength={REQUEST_MEMO_MAX_LENGTH}
            emptyHint="max"
          />
        </section>

        <div className="border-neutral-850 -mx-4 border-t" />

        {/* 주의사항 */}
        <section className="flex flex-col gap-4 py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            주의사항
          </h2>

          <div className="flex flex-col gap-1.5 px-1.5">
            {CAUTION_ITEMS.map((item, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center">
                  <ExclamationCircleIcon className="h-4 w-4 text-neutral-200" />
                </div>
                <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] break-keep text-neutral-300">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-neutral-850 -mx-4 h-1.5" />

        {/* 주의사항 확인 체크박스 */}
        <div className="flex items-center gap-2 py-[1.875rem] pl-2">
          <Checkbox
            checked={cautionConfirmed}
            onChange={setCautionConfirmed}
            iconClassName="h-4 w-4"
          />
          <span
            className="cursor-pointer text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-100"
            onClick={() => setCautionConfirmed(!cautionConfirmed)}
          >
            위의 주의사항을 확인하였습니다.
          </span>
        </div>
      </main>

      {/* 예약하기 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-neutral-800 bg-neutral-900 px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <CTA_Button
          text="예약 완료하기"
          size="xlarge"
          color={isReservationValid ? "orange" : "black"}
          onClick={handleReservation}
        />
      </div>

      {/* 토스트 메시지 */}
      {toastMessage && (
        <ToastList>
          <ToastItem message={toastMessage} icon={toastIcon} />
        </ToastList>
      )}
    </div>
  );
}
