import ProcessStep from "@/components/photoManage/ProcessStep";
import {
  DevelopPicIcon,
  ScanPicIcon,
  PrintPicIcon,
  DeliveryPicIcon,
  MenuIcon,
} from "@/assets/icon";
import Banner from "@/components/photoManage/Banner";
import { Header } from "@/components/common";
import { deliveryMock } from "@/types/process";

type Status = "DEVELOP" | "SCAN" | "PRINT" | "DELIVERY";
type StepId =
  | "DEVELOP"
  | "SCAN"
  | "PRINT_DELIVERY"
  | "PRINT_PICKUP"
  | "DELIVERY";

type StepConfig = {
  key: string;
  step: StepId;
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

  const mock = deliveryMock;
  const status = mock.status as Status;
  const currentIndex = STATUS_INDEX_MAP[status];

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
    PRINT: {
      icon: <PrintPicIcon />,
      title: "현상소에서 인화신청을 확인 중이에요",
      content: "인화가 확인되면 완료 시간을 알 수 있어요",
    },
    DELIVERY: {
      icon: <DeliveryPicIcon />,
      title: "사진을 배송하고 있어요",
      content: "현상소에서 발송된 사진이 안전하게 이동 중이에요!",
    },
  } as const;

  const currentBanner = bannerContent[status];

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
      index: 2,
    },
    {
      key: "PRINT",
      step:
        mock.receiptMethod === "DELIVERY" ? "PRINT_DELIVERY" : "PRINT_PICKUP",
      isCurrent: status === "PRINT",
      title: "사진 인화",
      subComment: (
        <div>
          <p className="mb-[0.125rem] text-[0.8125rem] text-[#EC602D]">
            예상 작업 완료 시간: 현재 확인 중
          </p>
          <hr className="mb-[0.375rem] border-orange-500/30" />
        </div>
      ),
      content: <p>배송지 정보</p>,
      buttons: <p>Action 버튼 컴포넌트들</p>,
      index: 3,
    },
    {
      key: "DELIVERY",
      step: "DELIVERY",
      isCurrent: status === "DELIVERY",
      title: "수령/배송",
      subComment: (
        <div>
          <p className="mb-[0.125rem] text-[0.8125rem] text-[#EC602D]">
            배송 상태: 배송중
          </p>
          <hr className="mb-[0.375rem] border-orange-500/30" />
        </div>
      ),
      content: <p>배송지 정보</p>,
      buttons: <p>Action 버튼 컴포넌트들</p>,
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
        <p className="flex justify-start text-[0.8125rem] text-white">
          작업 진행 상황
        </p>
        <div className="flex flex-col">
          {steps.map(({ key, subComment, buttons, isLast, ...rest }) => (
            <div key={key}>
              <ProcessStep
                {...rest}
                currentIndex={currentIndex}
                {...(subComment !== undefined ? { subComment } : {})}
                {...(buttons !== undefined ? { buttons } : {})}
                {...(isLast !== undefined ? { isLast } : {})}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/**
 * PM-010 PmMainPage.tsx
 * Description: 현상관리 메인 페이지
 */
