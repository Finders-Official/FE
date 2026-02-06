import type {
  StepConfig,
  Status,
  ReceiptMethod,
  MyCurrentWorkResponse,
} from "@/types/photomanage/process";
import {
  PrinterIcon,
  DownloadIcon,
  PencilLineIcon,
  ClockIcon,
  TruckIcon,
  CheckEmptyIcon,
} from "@/assets/icon";
import { ActionButton } from "@/components/photoManage/ActionButton";
import { RecipientInfoCard } from "@/components/photoManage/RecipientInfoCard";
import { formatEstimatedTime, formatShippedDate } from "@/utils/dateFormat";

type BuildStepsArgs = {
  workData: MyCurrentWorkResponse;
  status: Status;
  receiptMethod?: ReceiptMethod;

  onOpenPrintConfirmDialog: () => void;
  onGoDownload: () => void;
  onGoFeed: () => void;
  onGoTrackDelivery: () => void;
  onConfirmReceived: () => void;
};

export function buildProcessSteps({
  workData,
  status,
  receiptMethod,
  onOpenPrintConfirmDialog,
  onGoDownload,
  onGoFeed,
  onGoTrackDelivery,
  onConfirmReceived,
}: BuildStepsArgs): StepConfig[] {
  return [
    {
      key: "DEVELOP",
      step: "DEVELOP",
      isCurrent: status === "DEVELOP",
      title: "필름 현상",
      content: status === "DEVELOP" && (
        <div className="flex items-center gap-2 text-[0.8125rem] text-[#EC602D]">
          <ClockIcon className="h-3 w-3" />
          <p className="">
            {`작업 완료 시간: ${formatEstimatedTime(workData.compltedAt)}`}
          </p>
        </div>
      ),
      index: 1,
    },
    {
      key: "SCAN",
      step: "SCAN",
      isCurrent: status === "SCAN",
      title: "디지털 스캔",
      content:
        status === "SCAN"
          ? "인화여부를 확정해야 다음 단계로 넘어가요!"
          : "고해상도 디지털 파일로 변환",
      buttons: status === "SCAN" && (
        <div className="flex flex-col gap-2.5">
          <ActionButton
            leftIcon={<PrinterIcon />}
            message="인화 여부 확정하기"
            showNext
            onClick={onOpenPrintConfirmDialog}
          />
          <ActionButton
            leftIcon={<DownloadIcon />}
            message="사진 다운로드 하러 가기"
            showNext
            onClick={onGoDownload}
          />
        </div>
      ),
      index: 2,
    },
    {
      key: "PRINT",
      step: "PRINT",
      receiptMethod,
      isCurrent: status === "PRINT",
      title: "사진 인화",
      subComment: status === "PRINT" && workData.print && (
        <div>
          <p className="mb-0.5 flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
            <ClockIcon className="h-3 w-3" />
            {workData.print.status === "PENDING"
              ? "작업 예정 시간 확인 중"
              : `예상 작업 완료 시간: ${formatEstimatedTime(workData.print.estimatedAt)}`}
          </p>
          <hr className="mb-1.5 border-orange-500/30" />
        </div>
      ),
      content:
        status === "PRINT" && workData.print?.status === "PRINTING"
          ? "종이 위에 추억이 새겨지는 중..."
          : "선명한 사진 프린트 작업",
      buttons: status === "PRINT" && (
        <ActionButton
          leftIcon={<PencilLineIcon className="h-4 w-4" />}
          message="인화하는 동안 사진 자랑하러 가기"
          showNext
          onClick={onGoFeed}
        />
      ),
      index: 3,
    },
    {
      key: "DELIVERY",
      step: "DELIVERY",
      receiptMethod,
      isCurrent: status === "DELIVERY",
      title: receiptMethod === "PICKUP" ? "방문 수령" : "택배 배송",
      subComment: status === "DELIVERY" && workData.delivery && (
        <div>
          <p className="mb-0.5 flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
            {workData.delivery.status === "DELIVERED" ? (
              <CheckEmptyIcon className="h-3 w-3" />
            ) : (
              <TruckIcon className="text-orange-450 h-3 w-3" />
            )}
            {workData.delivery.status === "DELIVERED" ? "배송 완료" : "배송 중"}
          </p>
          <hr className="mb-1.5 border-orange-500/30" />
        </div>
      ),
      content:
        status === "DELIVERY" && workData.delivery ? (
          <RecipientInfoCard
            items={[
              {
                label: "발송일",
                value: formatShippedDate(workData.delivery.shippedAt),
              },
              { label: "택배사", value: workData.delivery.carrier ?? "-" },
              {
                label: "송장 번호",
                value: workData.delivery.trackingNumber ?? "-",
                copyValue: workData.delivery.trackingNumber ?? undefined,
              },
            ]}
          />
        ) : receiptMethod === "PICKUP" ? (
          "현상소 방문 후 수령해 주세요"
        ) : (
          "안전하게 포장하여 배송"
        ),
      buttons: status === "DELIVERY" && (
        <div className="flex flex-col gap-2.5">
          {receiptMethod === "DELIVERY" && (
            <ActionButton
              leftIcon={<TruckIcon className="text-orange-450 h-4.5 w-4.5" />}
              message="배송 조회하러 가기"
              showNext
              onClick={onGoTrackDelivery}
            />
          )}
          {workData.delivery?.status === "DELIVERED" && (
            <ActionButton
              leftIcon={<CheckEmptyIcon className="h-4 w-4" />}
              message="수령 확정 하기"
              showNext
              onClick={onConfirmReceived}
            />
          )}
        </div>
      ),
      index: 4,
      isLast: true,
    },
  ];
}
