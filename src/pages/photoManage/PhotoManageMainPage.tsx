import {
  DevelopPicIcon,
  ScanPicIcon,
  PrintPicIcon,
  DeliveryPicIcon,
  MenuIcon,
} from "@/assets/icon";
import { Header } from "@/components/common";
import { useNavigate } from "react-router";
import BottomSheet from "@/components/common/BottomSheet";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWork } from "@/apis/photoManage/currentWork.api";
import type { CurrentWorkData } from "@/types/photomanage";

const WorkDetails = ({ data }: { data: CurrentWorkData }) => {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4 text-white">
      <div className="text-center">
        <p className="font-semibold">{data.photoLabName}</p>
        <p className="text-sm text-neutral-400">
          Created at: {formatDate(data.createdAt)}
        </p>
      </div>

      {data.print && (
        <div className="rounded-lg bg-neutral-800 p-3">
          <h3 className="mb-2 font-bold">Print Info</h3>
          <div className="text-sm">
            <p>Status: {data.print.status}</p>
            <p>Receipt Method: {data.print.receiptMethod}</p>
            {data.print.completedAt && (
              <p>Completed: {formatDate(data.print.completedAt)}</p>
            )}
          </div>
        </div>
      )}

      {data.delivery && (
        <div className="rounded-lg bg-neutral-800 p-3">
          <h3 className="mb-2 font-bold">Delivery Info</h3>
          <div className="text-sm">
            <p>Status: {data.delivery.status}</p>
            <p>Carrier: {data.delivery.carrier}</p>
            <p>Tracking: {data.delivery.trackingNumber}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function PhotoManageMainPage() {
  const navigate = useNavigate();
  const {
    data: currentWorkResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentWork"],
    queryFn: getCurrentWork,
  });

  const workData = currentWorkResponse?.data;
  const status = workData?.developmentStatus;

  const getPrintBannerContent = () => {
    if (!workData?.print || workData.print.status === "PENDING") {
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

  const bannerContent = {
    DEVELOPING: {
      icon: <DevelopPicIcon />,
      title: "필름 현상중이에요",
      content: "현상이 완료되면 이곳에서 사진을 볼 수 있어요!",
    },
    SCANNING: {
      icon: <ScanPicIcon />,
      title: "현상된 필름이 스캔 완료되었어요",
      content: "인화 신청과 사진 다운로드를 해주세요!",
    },
    PRINTING: {
      icon: <DeliveryPicIcon />,
      title: "사진을 배송하고 있어요",
      content: "현상소에서 발송된 사진이 안전하게 이동 중이에요!",
    },
    DELIVERING: {
      icon: <DeliveryPicIcon />,
      title: "사진을 배송하고 있어요",
      content: "현상소에서 발송된 사진이 안전하게 이동 중이에요!",
    },
  } as const;

  const currentBanner =
    status === "printing"
      ? getPrintBannerContent()
      : status
        ? bannerContent[status as keyof typeof bannerContent]
        : null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !workData || !currentBanner) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden pt-6">
      <div className="flex flex-col">
        <div>
          <Header
            title=""
            rightAction={{
              type: "icon",
              icon: <MenuIcon className="h-6 w-6 text-neutral-200" />,
              onClick: () => {
                navigate("/development-history", {
                  state: { isMenu: true },
                });
              },
            }}
          />
        </div>

        {/* 상단 배너 */}
        <div className="relative mt-15 flex justify-center">
          <div className="absolute top-0 flex flex-col items-center text-center">
            {/* 아이콘 */}
            <div className="flex h-[5.0625rem] w-[4.5rem] -translate-y-1/2">
              {currentBanner.icon}
            </div>

            {/* 텍스트 */}
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
      </div>

      <main className="flex flex-col gap-[0.875rem] py-4">
        {/* 작업 진행 상황 바텀 시트*/}
        <BottomSheet
          open
          onClose={() => {}}
          sheetClassName="bg-neutral-900/60 backdrop-blur-3xl"
          isBackDrop={false}
        >
          <WorkDetails data={workData} />
        </BottomSheet>
      </main>
    </div>
  );
}
