import { useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { Header } from "@/components/common";
import { LabLocationSection } from "@/components/photoLab/detail";
import {
  ReservationSuccessMessage,
  ReservationDetailSection,
} from "@/components/photoLab/reservation";
import { XMarkIcon } from "@/assets/icon";
import { usePhotoLabDetail } from "@/hooks/photoLab";
import { TASK_OPTIONS } from "@/constants/photoLab";
import type { TaskType } from "@/types/reservation";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface LocationState {
  reservationId?: number;
  labName?: string;
  selectedDate?: string;
  selectedTime?: string;
  selectedTasks?: TaskType[];
  filmRollCount?: number;
  requestMemo?: string;
}

export default function ReservationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoLabId } = useParams();
  const labId = photoLabId ? Number(photoLabId) : undefined;

  const state = location.state as LocationState | null;
  const labName = state?.labName ?? "현상소";
  const memo = state?.requestMemo;
  const selectedDate = state?.selectedDate;
  const selectedTime = state?.selectedTime;
  const selectedTasks = state?.selectedTasks;
  const filmRollCount = state?.filmRollCount;

  const { data: labDetail } = usePhotoLabDetail(labId);

  // 일정
  const schedule = useMemo(() => {
    if (!selectedDate || !selectedTime) return "";
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];

    const [hour] = selectedTime.split(":").map(Number);
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const period = isPM ? "오후" : "오전";

    return `${year}. ${month}. ${day}(${weekday}) ${period} ${displayHour}:00`;
  }, [selectedDate, selectedTime]);

  // 작업 요약
  const taskSummary = useMemo(() => {
    if (!selectedTasks || !filmRollCount) return "";
    const taskLabels = selectedTasks.map(
      (type) => TASK_OPTIONS.find((opt) => opt.type === type)?.label ?? type,
    );
    return [...taskLabels, `${filmRollCount}롤`].join(" • ");
  }, [selectedTasks, filmRollCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <ReservationSuccessMessage />

        <ReservationDetailSection
          schedule={schedule}
          taskSummary={taskSummary}
          memo={memo}
          labName={labName}
        />

        {labDetail && labDetail.distanceKm !== null && (
          <LabLocationSection
            address={labDetail.address}
            distanceKm={labDetail.distanceKm}
            location={{
              latitude: labDetail.latitude,
              longitude: labDetail.longitude,
            }}
            labName={labName}
          />
        )}
      </main>
    </div>
  );
}
