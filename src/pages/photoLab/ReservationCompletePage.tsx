import { useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { Header } from "@/components/common";
import { LabLocationSection } from "@/components/photoLab/detail";
import {
  ReservationSuccessMessage,
  ReservationDetailSection,
} from "@/components/photoLab/reservation";
import { XMarkIcon } from "@/assets/icon";
import { useReservationDetail } from "@/hooks/photoLab";
import { TASK_OPTIONS } from "@/constants/photoLab";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface LocationState {
  reservationId?: number;
}

export default function ReservationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoLabId } = useParams();
  const labId = photoLabId ? Number(photoLabId) : undefined;

  const state = location.state as LocationState | null;
  const reservationId = state?.reservationId;

  const { data: reservation } = useReservationDetail(labId, reservationId);

  // 일정
  const schedule = useMemo(() => {
    if (!reservation) return "";
    const date = new Date(reservation.reservationDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];

    const [hour] = reservation.reservationTime.split(":").map(Number);
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const period = isPM ? "오후" : "오전";

    return `${year}. ${month}. ${day}(${weekday}) ${period} ${displayHour}:00`;
  }, [reservation]);

  // 작업 요약
  const taskSummary = useMemo(() => {
    if (!reservation) return "";
    const taskLabels = reservation.taskTypes.map(
      (type) => TASK_OPTIONS.find((opt) => opt.type === type)?.label ?? type,
    );
    return [...taskLabels, `${reservation.filmCount}롤`].join(" • ");
  }, [reservation]);

  // 예상 완료 시점
  const estimatedCompletion = useMemo(() => {
    if (!reservation?.compltedAt) return undefined;
    const date = new Date(reservation.compltedAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];

    const hour = date.getHours();
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const period = isPM ? "오후" : "오전";

    return `${year}. ${month}. ${day}(${weekday}) ${period} ${displayHour}:00`;
  }, [reservation]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClose = () => {
    navigate(`/photolab/${photoLabId}`, { replace: true });
  };

  if (!reservation) {
    return null;
  }

  return (
    <div className="flex w-full flex-col">
      <Header
        title={reservation.storeName}
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
          estimatedCompletion={estimatedCompletion}
          taskSummary={taskSummary}
          memo={reservation.memo ?? undefined}
          labName={reservation.storeName}
          labMessage={reservation.photoLabNotice ?? undefined}
        />

        <LabLocationSection
          address=""
          distanceKm={null}
          location={{
            latitude: reservation.latitude,
            longitude: reservation.longtitude,
          }}
          labName={reservation.storeName}
        />
      </main>
    </div>
  );
}
