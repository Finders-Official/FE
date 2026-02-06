import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import ProcessStep from "@/components/photoManage/ProcessStep";
import { MenuIcon, CircleIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { DialogBox } from "@/components/common/DialogBox";
import BottomSheet from "@/components/common/BottomSheet";
import { getCurrentWork } from "@/apis/photoManage/currentWork.api";
import { type Status } from "@/types/photomanage/process";
import { buildProcessSteps } from "@/lib/buildProcessSteps";
import { getActiveStatus } from "@/utils/getActiveStatus";
import { STATUS_INDEX_MAP } from "@/constants/photomanage/status.constant";
import { getBannerContent } from "@/lib/getBannerContent";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";

export default function PhotoManageMainPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState(1);

  // 진행 상황 조회
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
  const setDevelopmentOrderId = usePrintOrderStore(
    (s) => s.setDevelopmentOrderId,
  );

  useEffect(() => {
    if (isSuccess && !workData) navigate("/development-history");
    if (isError) navigate("/development-history");
    if (workData) setDevelopmentOrderId(workData.developmentOrderId);
  }, [isSuccess, isError, workData, navigate, setDevelopmentOrderId]);

  const status: Status = getActiveStatus(workData);
  const receiptMethod = workData?.print?.receiptMethod;
  const currentIndex = STATUS_INDEX_MAP[status];

  const currentBanner = getBannerContent({
    status,
    receiptMethod,
    printStatus: workData?.print?.status,
  });

  const steps = workData
    ? buildProcessSteps({
        workData,
        status,
        receiptMethod,
        onOpenPrintConfirmDialog: () => setIsDialogOpen(true),
        onGoDownload: () => navigate("/photoManage/download"),
        onGoFeed: () => navigate("/photoFeed"),
        onGoTrackDelivery: () => {},
        onConfirmReceived: () => {},
      })
    : [];

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>로딩중...</p>
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
        <CircleIcon className="h-57.75 w-57.75" />
        <div className="absolute top-0 flex flex-col items-center text-center">
          <div className="flex h-20.25 w-18 -translate-y-1/2">
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

      <main className="flex flex-col gap-3.5 py-4">
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
          collapsedRatio={0.7}
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
