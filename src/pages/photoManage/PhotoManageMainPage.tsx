import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
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
  CircleIcon,
} from "@/assets/icon";
import { Header } from "@/components/common";
import { ActionButton } from "@/components/photoManage/ActionButton";
import { RecipientInfoCard } from "@/components/photoManage/RecipientInfoCard";
import { DialogBox } from "@/components/common/DialogBox";
import BottomSheet from "@/components/common/BottomSheet";
import { getCurrentWork } from "@/apis/photoManage/currentWork.api";
import type {
  Status,
  ReceiptMethod,
  DevelopmentStatus,
  // DeliveryStatus,
  // MyCurrentWorkResponse as CurrentWorkData,
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

export default function PhotoManageMainPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState(1);

  const {
    data: currentWorkResponse,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["currentWork"],
    queryFn: getCurrentWork,
  });

  const workData = currentWorkResponse?.data;

  useEffect(() => {
    if (isSuccess && !workData) navigate("/development-history");
    if (isError) navigate("/development-history");
  }, [isSuccess, isError, workData, navigate]);

  /**
   * 상태 결정 로직: API 응답 객체의 존재 여부에 따라 우선순위 결정
   */
  // PhotoManageMainPage.tsx 내부 수정
  const getActiveStatus = (): Status => {
    if (!workData) return "DEVELOP";

    // 1. 배송 데이터가 '실제로' 존재하는지 ID로 확인
    if (workData.delivery && workData.delivery.deliveryId) return "DELIVERY";

    // 2. 인화 데이터가 '실제로' 존재하는지 ID로 확인
    if (workData.print && workData.print.printOrderId) return "PRINT";

    // 3. 현상 상태 매핑 (대문자 일치 확인)
    const devStatusMap: Record<DevelopmentStatus, Status> = {
      RECEIVED: "DEVELOP",
      DEVELOPING: "DEVELOP",
      SCANNING: "SCAN",
      COMPLETED: "SCAN",
    };

    const currentStatus = devStatusMap[workData.developmentStatus] ?? "DEVELOP";

    // 디버깅용 로그: 1단계가 안 켜진다면 이 값이 "DEVELOP"인지 확인하세요.
    console.log("현재 계산된 전체 상태(status):", currentStatus);

    return currentStatus;
  };
  const status: Status = getActiveStatus();
  const receiptMethod = workData?.print?.receiptMethod;

  const STATUS_INDEX_MAP: Record<Status, number> = {
    DEVELOP: 1,
    SCAN: 2,
    PRINT: 3,
    DELIVERY: 4,
  };
  const currentIndex = STATUS_INDEX_MAP[status];

  // --- 헬퍼 함수 ---
  const formatEstimatedTime = (isoDate: string | null): string => {
    if (!isoDate) return "현재 확인 중";
    const date = new Date(isoDate);
    const hour = date.getHours();
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${hour >= 12 ? "오후" : "오전"} ${
      hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    }시`;
  };

  const formatShippedDate = (isoDate: string | null): string => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate(),
    ).padStart(2, "0")}(${days[date.getDay()]})`;
  };

  // --- UI 데이터 맵 ---
  const getBannerContent = () => {
    const bannerMap = {
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
      PRINT: {
        icon: <PrintPicIcon />,
        title:
          workData?.print?.status === "PENDING"
            ? "현상소에서 확인 중이에요"
            : "인화 작업이 진행 중이에요",
        content: "배송이 시작되면 알려드릴게요!",
      },
      DELIVERY: {
        icon: <DeliveryPicIcon />,
        title:
          receiptMethod === "PICKUP"
            ? "사진 수령이 가능해요"
            : "사진을 배송하고 있어요",
        content:
          receiptMethod === "PICKUP"
            ? "현상소에 방문하여 사진을 찾아주세요!"
            : "현상소에서 발송된 사진이 이동 중이에요!",
      },
    };
    return bannerMap[status];
  };

  const currentBanner = getBannerContent();

  const steps: StepConfig[] = workData
    ? [
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
          buttons: status === "SCAN" && (
            <div className="flex flex-col gap-[0.625rem]">
              <ActionButton
                leftIcon={<PrinterIcon />}
                message="인화 여부 확정하기"
                showNext
                onClick={() => setIsDialogOpen(true)}
              />
              <ActionButton
                leftIcon={<DownloadIcon />}
                message="사진 다운로드 하러 가기"
                showNext
                onClick={() => navigate("/photoManage/download")}
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
              <p className="mb-[0.125rem] flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
                <ClockIcon className="h-3 w-3" />
                {workData.print.status === "PENDING"
                  ? "작업 예정 시간 확인 중"
                  : `예상 작업 완료 시간: ${formatEstimatedTime(workData.print.estimatedAt)}`}
              </p>
              <hr className="mb-[0.375rem] border-orange-500/30" />
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
              onClick={() => navigate("/photoFeed")}
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
              <p className="mb-[0.125rem] flex items-center gap-1 text-[0.8125rem] text-[#EC602D]">
                {workData.delivery.status === "DELIVERED" ? (
                  <CheckEmptyIcon className="h-3 w-3" />
                ) : (
                  <TruckIcon className="text-orange-450 h-3 w-3" />
                )}
                {workData.delivery.status === "DELIVERED"
                  ? "배송 완료"
                  : "배송 중"}
              </p>
              <hr className="mb-[0.375rem] border-orange-500/30" />
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
            <div className="flex flex-col gap-[0.625rem]">
              {receiptMethod === "DELIVERY" && (
                <ActionButton
                  leftIcon={
                    <TruckIcon className="text-orange-450 h-4.5 w-4.5" />
                  }
                  message="배송 조회하러 가기"
                  showNext
                  onClick={() => {}}
                />
              )}
              {workData.delivery?.status === "DELIVERED" && (
                <ActionButton
                  leftIcon={<CheckEmptyIcon className="h-4 w-4" />}
                  message="수령 확정 하기"
                  showNext
                  onClick={() => {}}
                />
              )}
            </div>
          ),
          index: 4,
          isLast: true,
        },
      ]
    : [];

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  if (!workData || !currentBanner) return null;

  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden pt-6">
      <Header
        title=""
        rightAction={{
          type: "icon",
          icon: <MenuIcon className="h-6 w-6 text-neutral-200" />,
          onClick: () =>
            navigate("/development-history", { state: { isMenu: true } }),
        }}
      />
      {/* 상단 비주얼 영역: status에 따라 변함 */}
      <div className="relative mt-15 flex justify-center">
        <CircleIcon className="h-[14.4375rem] w-[14.4375rem]" />
        <div className="absolute top-0 flex flex-col items-center text-center">
          <div className="flex h-[5.0625rem] w-[4.5rem] -translate-y-1/2">
            {currentBanner.icon}
          </div>
          <div className="flex -translate-y-1/2 flex-col gap-2">
            <h2 className="text-[1.25rem] font-semibold text-neutral-100">
              {currentBanner.title}
            </h2>
            <p className="text-[0.9375rem] text-neutral-100">
              {currentBanner.content}
            </p>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-[0.875rem] py-4">
        {isDialogOpen && (
          <DialogBox
            isOpen={isDialogOpen}
            title={
              dialogStep === 1
                ? "인화하실건가요?"
                : "소중한 추억, 화면 속에만 두실 건가요?"
            }
            description={
              dialogStep === 1
                ? "인화를 하면 실물로 사진을 받아볼 수 있어요!"
                : "지금 실물로 간직해 보세요. 나중에 인화도 언제든 가능해요!"
            }
            confirmText={dialogStep === 1 ? "네" : "지금 인화 할게요"}
            onConfirm={() => {
              setIsDialogOpen(false);
              navigate("/photoManage/print-request");
            }}
            cancelText={dialogStep === 1 ? "아니오" : "다음에 할게요"}
            onCancel={() =>
              dialogStep === 1 ? setDialogStep(2) : setIsDialogOpen(false)
            }
          />
        )}

        <BottomSheet
          open
          onClose={() => {}}
          sheetClassName="bg-neutral-900/60 backdrop-blur-3xl"
          isBackDrop={false}
        >
          <div className="flex h-full flex-col gap-4 p-4">
            <p className="mb-1 flex justify-start text-[0.8125rem] text-white">
              작업 진행 상황
            </p>
            <div className="flex flex-1 flex-col overflow-y-auto">
              {steps.map(
                ({
                  key,
                  isCurrent,
                  receiptMethod: stepMethod,
                  subComment,
                  buttons,
                  isLast,
                  ...rest
                }) => (
                  <div key={key}>
                    <ProcessStep
                      {...rest}
                      isCurrent={isCurrent}
                      receiptMethod={stepMethod}
                      currentIndex={currentIndex}
                      subComment={subComment}
                      buttons={buttons}
                      isLast={isLast}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="h-10 shrink-0 bg-transparent" />
          </div>
        </BottomSheet>
      </main>
    </div>
  );
}
