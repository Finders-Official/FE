import { useLayoutEffect, useMemo } from "react";
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
import { formatKoreanDateTime } from "@/utils/dateFormat";

interface LocationState {
  reservationId?: number;
  distanceKm?: number | null;
}

export default function ReservationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoLabId } = useParams();
  const labId = photoLabId ? Number(photoLabId) : undefined;

  const state = location.state as LocationState | null;
  const reservationId = state?.reservationId;
  const distanceKm = state?.distanceKm ?? null;

  const { data: reservation } = useReservationDetail(labId, reservationId);

  // 일정
  const schedule = useMemo(() => {
    if (!reservation) return "";
    return formatKoreanDateTime(
      reservation.reservationDate,
      reservation.reservationTime,
    );
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
    if (!reservation?.estimatedCompletion) return undefined;
    return formatKoreanDateTime(reservation.estimatedCompletion);
  }, [reservation]);

  useLayoutEffect(() => {
    document.getElementById("root")?.scrollTo(0, 0);
  }, []);

  const handleClose = () => {
    navigate(-1);
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
          address={reservation.address}
          addressDetail={reservation.addressDetail}
          distanceKm={distanceKm}
          location={{
            latitude: reservation.latitude,
            longitude: reservation.longitude,
          }}
          labName={reservation.storeName}
        />
      </main>
    </div>
  );
}
