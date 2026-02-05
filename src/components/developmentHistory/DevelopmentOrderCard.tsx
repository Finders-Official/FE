import { ChevronLeftIcon } from "@/assets/icon";

interface DevelopmentOrderCardProps {
  item: {
    id: number;
    shopName: string;
    shopAddress: string;
    status: string;
    date: string; // "2026-01-29T08:41:34"
    tags: string;
    price: number;
    deliveryAddress?: string;
    thumbnailUrl: string;
    resultImageUrls: string[];
  };
  onOpenViewer: (images: string[]) => void;
}

const DevelopmentOrderCard = ({
  item,
  onOpenViewer,
}: DevelopmentOrderCardProps) => {
  // 만료일 계산 로직 (createdAt + 30일)
  const calculateExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 30);

    // YY/M/D 형식으로 변환
    const yy = String(date.getFullYear()).slice(-0);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${yy}/${m}/${d} 저장 만료`;
  };

  const expiryText = calculateExpiry(item.date);

  return (
    <div className="flex flex-col gap-4.5 rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-6">
      {/* 상단 날짜 및 상태 */}
      <div className="flex justify-start gap-1 text-[0.8125rem] font-normal tracking-[-0.02em] text-neutral-200">
        <span>{item.date.split("T")[0]}</span> {/* 시간 제외 날짜만 표시 */}
        <span>·</span>
        <span>{item.status}</span>
      </div>

      {/* 샵 정보 */}
      <div className="flex items-center gap-5">
        <div className="h-15 w-15 shrink-0 overflow-hidden rounded-[0.625rem] bg-[#333]">
          <img
            src={item.thumbnailUrl}
            alt={item.shopName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200">
            {item.shopName}
          </h3>
          <p className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-600">
            {item.shopAddress}
          </p>
        </div>
      </div>

      <div className="bg-neutral-875 flex flex-col gap-3 rounded-2xl p-5">
        {/* 맡기신 작업 */}
        <div className="flex items-start gap-5">
          <span className="w-17.75 shrink-0 text-[0.9375rem] font-semibold tracking-[-0.02em] text-neutral-200">
            맡기신 작업
          </span>
          <span className="flex-1 text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] break-keep text-neutral-400">
            {item.tags}
          </span>
        </div>

        {/* 총액 */}
        <div className="flex items-start gap-5">
          <span className="w-17.75 shrink-0 text-[0.9375rem] font-semibold tracking-[-0.02em] text-neutral-200">
            총액
          </span>
          <span className="flex-1 text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-400">
            {item.price.toLocaleString()}원
          </span>
        </div>

        {/* 배송지 (데이터 있을 경우만) */}
        {item.deliveryAddress && (
          <div className="flex items-start gap-5">
            <span className="w-17.75 shrink-0 text-[0.9375rem] font-semibold tracking-[-0.02em] text-neutral-200">
              배송지
            </span>
            <span className="flex-1 text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] break-keep text-neutral-400">
              {item.deliveryAddress}
            </span>
          </div>
        )}
      </div>

      {/* 결과물 보기 버튼 및 만료일 안내 */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onOpenViewer(item.resultImageUrls)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex flex-col items-start gap-1">
            <span className="text-[0.9375rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200">
              스캔 사진 결과 보기
            </span>
            <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-600">
              {expiryText}
            </span>
          </div>
          <ChevronLeftIcon className="h-4 w-4 rotate-180 text-neutral-200" />
        </button>

        {/* 썸네일 리스트 */}
        <div className="scrollbar-hide flex gap-2.75 overflow-x-auto pb-1">
          {item.resultImageUrls.map((url, idx) => (
            <div
              key={idx}
              className="h-19 w-24 shrink-0 overflow-hidden rounded-[0.625rem] bg-[#333]"
            >
              <img
                src={url}
                alt={`result-${idx}`}
                className="h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevelopmentOrderCard;
