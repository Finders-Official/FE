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
  PackageIcon,
} from "@/assets/icon";
import { ActionButton } from "@/components/photoManage/ActionButton";
import { RecipientInfoCard } from "@/components/photoManage/RecipientInfoCard";
import { formatEstimatedTime, formatShippedDate } from "@/utils/dateFormat";
import { getEarlyFinishedHours } from "@/utils/getEarlyFinishedHours";

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
  // 전체 주소지 생성
  const getFullAddress = (
    address: string | null,
    addressDetail: string | null,
  ) => {
    return [address, addressDetail].filter(Boolean).join(" ");
  };

  const earlyHours = workData.print
    ? getEarlyFinishedHours(
        workData.print.estimatedAt,
        workData.print.completedAt,
      )
    : -1;

  // 인화 단계 content
  const getPrintContent = () => {
    // 인화 단계인 경우
    if (status === "PRINT" && workData.print) {
      // 직접 수령인 경우
      if (receiptMethod === "PICKUP") {
        return (
          <RecipientInfoCard
            items={[
              {
                label: "수령 방식",
                value: "직접 수령",
              },
            ]}
          />
        );
      }
      // 배송인 경우
      else {
        return (
          <RecipientInfoCard
            items={[
              {
                label: "배송자명",
                value: workData.delivery?.recipient ?? "-",
              },
              {
                label: "연락처",
                value: workData.delivery?.recipientNumber ?? "-",
              },
              {
                label: "주소",
                value:
                  getFullAddress(
                    workData.delivery?.recipientAddress ?? null,
                    workData.delivery?.AddressDetail ?? null,
                  ) || "-",
              },
            ]}
          />
        );
      }
    } else {
      // 그 외의 단계인 경우
      return "선명한 사진 프린트 작업";
    }
  };

  // 수령/배송 단계 subContent
  const getDeliverySubComtent = () => {
    // 배송
    if (workData.print?.receiptMethod === "DELIVERY") {
      return (
        <div>
          <p className="mb-0.5 flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
            <PackageIcon className="h-3 w-3" />
            {workData.delivery?.status === "SHIPPED"
              ? "배송 상태: 배송중"
              : "배송 상태: 배송 완료"}
          </p>
          <hr className="mb-1.5 border-orange-500/30" />
        </div>
      );
    }

    // 직접수령
    if (
      workData.print?.receiptMethod === "PICKUP" &&
      workData.print?.status === "SHIPPED"
    ) {
      return (
        <>
          <div>
            <p className="mb-0.5 flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
              <ClockIcon className="h-3 w-3" />
              {`작업 완료 시간: ${formatEstimatedTime(workData.print.completedAt)}`}
            </p>
            <hr className="mb-1.5 border-orange-500/30" />
          </div>

          {earlyHours !== -1 && (
            <div>
              <p className="mb-0.5 flex items-center gap-1 text-[0.8125rem]">
                {`예상 작업 시간보다 ${earlyHours}시간 빨리 완료되었어요!`}
              </p>
            </div>
          )}
        </>
      );
    }
  };

  // 수령/배송 단계 content
  // 수령/배송 단계 content
  const getDeliveryContent = () => {
    if (status !== "DELIVERY") return null;
    if (!workData.print) return null;

    // 배송
    if (receiptMethod === "DELIVERY" && workData.delivery) {
      return (
        <RecipientInfoCard
          items={[
            {
              label: "보낸 사람",
              value: workData.delivery.sender ?? "-",
            },
            {
              label: "주소",
              value:
                getFullAddress(
                  workData.delivery.recipientAddress,
                  workData.delivery.AddressDetail,
                ) || "-",
            },
            {
              label: "발송일",
              value: formatShippedDate(workData.delivery.shippedAt) ?? "-",
            },
            { label: "택배사", value: workData.delivery.carrier ?? "-" },
            {
              label: "송장 번호",
              value: workData.delivery.trackingNumber ?? "-",
              copyValue: workData.delivery.trackingNumber ?? undefined,
            },
          ]}
        />
      );
    }

    // 직접 수령
    return (
      <RecipientInfoCard
        items={[
          { label: "수령 방식", value: "직접 수령" },
          {
            label: "수령 상태",
            value: workData.print.status === "SHIPPED" ? "미수령" : "수령 완료",
          },
        ]}
      />
    );
  };

  return [
    {
      key: "DEVELOP",
      step: "DEVELOP",
      isCurrent: status === "DEVELOP",
      title: "필름 현상",
      content:
        status === "DEVELOP" ? (
          <div className="flex items-center gap-2 text-[0.8125rem] text-[#EC602D]">
            <ClockIcon className="h-3 w-3" />
            <p className="">
              {`작업 완료 시간: ${formatEstimatedTime(workData.completedAt)}`}
            </p>
          </div>
        ) : (
          <p className="">어둠 속에서 이미지를 깨우는 중</p>
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
            leftIcon={<PrinterIcon className="h-4 w-4" />}
            message="인화 여부 확정하기"
            showNext
            onClick={onOpenPrintConfirmDialog}
          />
          <ActionButton
            leftIcon={<DownloadIcon className="h-4 w-4" />}
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
            {workData.print.estimatedAt
              ? `예상 작업 완료 시간: ${formatEstimatedTime(workData.print.estimatedAt)}`
              : "예상 작업 완료 시간: 현재 확인 중"}
          </p>
          <hr className="mb-1.5 border-orange-500/30" />
        </div>
      ),
      content: getPrintContent(),
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
      title: "수령/배송",
      subComment: status === "DELIVERY" && getDeliverySubComtent(),
      content: getDeliveryContent(),
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
