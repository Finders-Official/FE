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
      <div>
        {status == "DEVELOP" && (
          <Banner
            icon={<DevelopPicIcon />}
            title="필름 현상중이에요"
            content="현상이 완료되면 이곳에서 사진을 볼 수 있어요!"
          />
        )}
        {status == "SCAN" && (
          <Banner
            icon={<ScanPicIcon />}
            title="현상된 필름이 스캔 완료되었어요"
            content="인화 신청과 사진 다운로드를 해주세요!"
          />
        )}
        {status == "PRINT" && (
          <Banner
            icon={<PrintPicIcon />}
            title="현상소에서 인화신청을 확인 중이에요"
            content="인화가 확인되면 완료 시간을 알 수 있어요"
          />
        )}
        {status == "DELIVERY" && (
          <Banner
            icon={<DeliveryPicIcon />}
            title="사진을 배송하고 있어요"
            content="현상소에서 발송된 사진이 안전하게 이동 중이에요!"
          />
        )}
      </div>

      <main className="flex flex-col gap-[14px] py-4">
        <p className="flex justify-start text-[13px] text-white">
          작업 진행 상황
        </p>
        <div className="flex flex-col">
          {/** 필름 현상 단계 */}
          <div>
            <ProcessStep
              step="DEVELOP"
              isCurrent={status === "DEVELOP"}
              title="필름 현상"
              content={
                status === "DEVELOP"
                  ? "아직 현상이 완료되지 않았어요"
                  : "어둠 속에서 이미지를 깨우는 중"
              }
              index={1}
              currentIndex={currentIndex}
            />
          </div>
          {/** 디지털 스캔 단계 */}
          <div>
            <ProcessStep
              step="SCAN"
              isCurrent={status === "SCAN"}
              title="디지털 스캔"
              content={
                status === "SCAN"
                  ? "인화여부를 확정해야 다음 단계로 넘어가요!"
                  : "고해상도 디지털 파일로 변환"
              }
              index={2}
              currentIndex={currentIndex}
            />
          </div>
          {/** 사진 인화 단계 */}
          <div>
            <ProcessStep
              step={
                mock.receiptMethod === "DELIVERY"
                  ? "PRINT_DELIVERY"
                  : "PRINT_PICKUP"
              }
              isCurrent={status === "PRINT"}
              title="사진 인화"
              // TODO 알아서 데이터 넣으셔
              subComment={
                <div>
                  <p className="text-[13px] text-orange-500">
                    예상 작업 완료 시간: 현재 확인 중
                  </p>
                  <br className="text-orange-500" />
                </div>
              }
              // TODO 알아서 데이터 넣으셔
              content={<p>배송지 정보</p>}
              // TODO 알아서 데이터 넣으셔
              children={<p>Action 버튼</p>}
              index={3}
              currentIndex={currentIndex}
            />
          </div>

          {/** 수령 및 배송 단계 */}
          <div>
            <ProcessStep
              step="DELIVERY"
              isCurrent={status === "DELIVERY"}
              title="수령/배송"
              // TODO 알아서 데이터 넣으셔
              subComment={
                <div>
                  <p className="text-[13px] text-orange-500">
                    배송 상태: 배송중
                  </p>
                  <br className="text-orange-500" />
                </div>
              }
              // TODO 알아서 데이터 넣으셔
              content={<p>배송지 정보</p>}
              // TODO: Action 버튼 넣으세여
              children={<p>Action 버튼</p>}
              index={4}
              currentIndex={currentIndex}
              isLast={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * PM-010 PmMainPage.tsx
 * Description: 현상관리 메인 페이지
 */
