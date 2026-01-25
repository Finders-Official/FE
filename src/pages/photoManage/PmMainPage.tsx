import ProcessStep from "@/components/photoManage/ProcessStep";
import {
  DevelopPicIcon,
  ScanPicIcon,
  PrinterIcon,
  PrintPicIcon,
  DeliveryPicIcon,
  MenuIcon,
  DownloadIcon,
  PencilLineIcon,
  ClockIcon,
  TruckIcon,
  CheckEmptyIcon,
} from "@/assets/icon";
import Banner from "@/components/photoManage/Banner";
import { Header } from "@/components/common";
import { ActionButton } from "@/components/photoManage/ActionButton";
import { RecipientInfoCard } from "@/components/photoManage/RecipientInfoCard";
import { useNavigate } from "react-router";
import { DialogBox } from "@/components/common/DialogBox";
import { useState } from "react";
import { mocks } from "@/types/photomanage/process";
import type {
  Status,
  ReceiptMethod,
  PrintOrderStatus,
  DeliveryStatus,
} from "@/types/photomanage/process";

type StepConfig = {
  key: string;
  step: Status;
  receiptMethod?: ReceiptMethod;
  isCurrent: boolean;
  title: string;
  content: React.ReactNode;
  index: number;
  subComment?: React.ReactNode;
  buttons?: React.ReactNode;
  isLast?: boolean;
};

export default function PmMainPage() {
  const STATUS_INDEX_MAP: Record<Status, number> = {
    DEVELOP: 1,
    SCAN: 2,
    PRINT: 3,
    DELIVERY: 4,
  };

  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState(1);

  // mocks.develop, mocks.scan, mocks.print, mocks.deliveryShipped, mocks.deliveryCompleted, mocks.printPending, mocks.printConfirmed
  const mock = mocks.deliveryShipped;
  const status = mock.status as Status;
  const currentIndex = STATUS_INDEX_MAP[status];

  // 예상 완료 시간 포맷
  const formatEstimatedTime = (isoDate: string | null): string => {
    if (!isoDate) return "현재 확인 중";
    const date = new Date(isoDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const period = hour >= 12 ? "오후" : "오전";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${month}월 ${day}일 ${period} ${displayHour}시`;
  };

  // 발송일
  const formatShippedDate = (isoDate: string | null): string => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = dayNames[date.getDay()];
    return `${year}.${month}.${day}(${dayName})`;
  };

  const getPrintBannerContent = (printStatus?: PrintOrderStatus) => {
    if (!printStatus || printStatus === "PENDING") {
      return {
        icon: <PrintPicIcon />,
        title: "현상소에서 인화신청을 확인 중이에요",
        content: "인화가 확인되면 완료 시간을 알 수 있어요!",
      };
    }
    return {
      icon: <PrintPicIcon />,
      title: "인화 작업이 진행 중이에요",
      content: "배송이 시작되면 알려드릴게요!",
    };
  };

  // 배송 상태 텍스트
  const getDeliveryStatusText = (deliveryStatus?: DeliveryStatus): string => {
    switch (deliveryStatus) {
      case "SHIPPED":
        return "배송중";
      case "DELIVERED":
        return "배송 완료";
      default:
        return "배송 준비중";
    }
  };

  const bannerContent = {
    DEVELOP: {
      icon: <DevelopPicIcon />,
      title: "필름 현상중이에요",
      content: "현상이 완료되면 이곳에서 사진을 볼 수 있어요!",
    },
    SCAN: {
      icon: <ScanPicIcon />,
      title: "현상된 필름이 스캔 완료되었어요",
      content: "인화 신청과 사진 다운로드를 해주세요!",
    },
    DELIVERY: {
      icon: <DeliveryPicIcon />,
      title: "사진을 배송하고 있어요",
      content: "현상소에서 발송된 사진이 안전하게 이동 중이에요!",
    },
  } as const;

  // PRINT 상태는 인화 주문 상태에 따라 동적으로
  const currentBanner =
    status === "PRINT"
      ? getPrintBannerContent(mock.print?.status)
      : bannerContent[status as keyof typeof bannerContent];

  const steps: StepConfig[] = [
    {
      key: "DEVELOP",
      step: "DEVELOP",
      isCurrent: status === "DEVELOP",
      title: "필름 현상",
      content:
        status === "DEVELOP"
          ? "아직 현상이 완료되지 않았어요"
          : "어둠 속에서 이미지를 깨우는 중",
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
      buttons: (
        <div className="flex flex-col gap-[0.625rem]">
          <ActionButton
            leftIcon={<PrinterIcon />}
            message="인화 여부 확정하기"
            showNext={true}
            onClick={() => {
              setIsDialogOpen(true);
            }} // 모달창 열기
          />
          <ActionButton
            leftIcon={<DownloadIcon />}
            message="사진 다운로드 하러 가기"
            showNext={true}
            onClick={() => {
              navigate("/photoManage/download");
            }}
          />
        </div>
      ),
      index: 2,
    },
    {
      key: "PRINT",
      step: "PRINT",
      receiptMethod: mock.receiptMethod,
      isCurrent: status === "PRINT",
      title: "사진 인화",
      subComment:
        status === "PRINT" ? (
          <div>
            <p className="mb-[0.125rem] flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
              <ClockIcon className="h-3 w-3" />
              예상 작업 완료 시간:{" "}
              {formatEstimatedTime(mock.print?.estimatedAt ?? null)}
            </p>
            <hr className="mb-[0.375rem] border-orange-500/30" />
          </div>
        ) : undefined,
      content:
        status === "PRINT" && mock.deliveryInfo ? (
          <RecipientInfoCard
            items={[
              { label: "배송자명", value: mock.deliveryInfo.recipientName },
              { label: "연락처", value: mock.deliveryInfo.recipientPhone },
              { label: "주소", value: mock.deliveryInfo.address },
            ]}
          />
        ) : (
          "선명한 사진 프린트 작업"
        ),
      buttons:
        status === "PRINT" ? (
          <ActionButton
            leftIcon={<PencilLineIcon className="h-4 w-4" />}
            message="인화하는 동안 사진 자랑하러 가기"
            showNext={true}
            onClick={() => navigate("/photoFeed")}
          />
        ) : undefined,
      index: 3,
    },
    {
      key: "DELIVERY",
      step: "DELIVERY",
      receiptMethod: mock.receiptMethod,
      isCurrent: status === "DELIVERY",
      title: "수령/배송",
      subComment:
        status === "DELIVERY" ? (
          <div>
            <p className="mb-[0.125rem] flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
              {mock.delivery?.status === "DELIVERED" ? (
                <CheckEmptyIcon className="h-3 w-3" />
              ) : (
                <TruckIcon className="text-orange-450 h-3 w-3" />
              )}
              배송 상태: {getDeliveryStatusText(mock.delivery?.status)}
            </p>
            <hr className="mb-[0.375rem] border-orange-500/30" />
          </div>
        ) : undefined,
      content:
        status === "DELIVERY" && mock.delivery ? (
          <RecipientInfoCard
            items={[
              {
                label: "보낸 사람",
                value: mock.deliveryInfo?.recipientName ?? "-",
              },
              { label: "주소", value: mock.deliveryInfo?.address ?? "-" },
              {
                label: "발송일",
                value: formatShippedDate(mock.delivery.shippedAt),
              },
              { label: "택배사", value: mock.delivery.carrier ?? "-" },
              {
                label: "송장 번호",
                value: mock.delivery.trackingNumber ?? "-",
                copyValue: mock.delivery.trackingNumber ?? undefined,
              },
            ]}
          />
        ) : (
          "안전하게 포장하여 수령/배송"
        ),
      buttons:
        status === "DELIVERY" ? (
          <div className="flex flex-col gap-[0.625rem]">
            <ActionButton
              leftIcon={<TruckIcon className="text-orange-450 h-4.5 w-4.5" />}
              message="배송 조회하러 가기"
              showNext={true}
              onClick={() => {
                // TODO: 배송 조회 페이지로 이동
              }}
            />
            {mock.delivery?.status === "DELIVERED" && (
              <ActionButton
                leftIcon={<CheckEmptyIcon className="h-4 w-4" />}
                message="수령 확정 하기"
                showNext={true}
                onClick={() => {
                  // TODO: 수령 확정 처리
                }}
              />
            )}
          </div>
        ) : undefined,
      index: 4,
      isLast: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden pt-6">
      <div>
        <Header
          title=""
          rightAction={{
            type: "icon",
            icon: <MenuIcon />,
            onClick: () => {
              // TODO 메뉴 눌렀을 때
            },
          }}
        />
      </div>

      {/** 배너 */}
      <div>{currentBanner && <Banner {...currentBanner} />}</div>

      <main className="flex flex-col gap-[0.875rem] py-4">
        {isDialogOpen && dialogStep === 1 && (
          <DialogBox
            isOpen={isDialogOpen}
            title="인화하실건가요?"
            description="인화를 하면 실물로 사진을 받아볼 수 있어요!"
            confirmText="네"
            onConfirm={() => {
              setIsDialogOpen(false);
              navigate("/photoManage/print-request");
            }}
            cancelText="아니오"
            onCancel={() => setDialogStep(2)}
          />
        )}
        {isDialogOpen && dialogStep === 2 && (
          <DialogBox
            isOpen={isDialogOpen}
            title="소중한 추억, 화면 속에만 두실 건가요?"
            description={`지금 실물로 간직해 보세요
            물론, 나중에 인화도 언제든 가능해요!`}
            confirmText="지금 인화 할게요"
            onConfirm={() => {
              setIsDialogOpen(false);
              navigate("/photoManage/print-request");
            }}
            cancelText="다음에 할게요"
            onCancel={() => {
              setIsDialogOpen(false);
              setDialogStep(1);
            }}
          />
        )}
        <p className="flex justify-start text-[0.8125rem] text-white">
          작업 진행 상황
        </p>
        <div className="flex flex-col">
          {steps.map(
            ({ key, receiptMethod, subComment, buttons, isLast, ...rest }) => (
              <div key={key}>
                <ProcessStep
                  {...rest}
                  receiptMethod={receiptMethod}
                  currentIndex={currentIndex}
                  subComment={subComment}
                  buttons={buttons}
                  isLast={isLast}
                />
              </div>
            ),
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * PM-010 PmMainPage.tsx
 * Description: 현상관리 메인 페이지
 */
