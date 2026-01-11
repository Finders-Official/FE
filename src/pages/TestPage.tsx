import { Header } from "@/components/common";
import { TagBadge, LabNewsBanner } from "@/components/photoLab";

export default function TestPage() {
  return (
    <div className="flex w-full flex-col">
      <Header title="PhotoLab 컴포넌트 테스트" />

      <div className="flex flex-col gap-6 p-4">
        {/* TagBadge */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-neutral-100">
            TagBadge
          </h2>
          <div className="flex flex-wrap gap-2">
            <TagBadge label="따뜻한 색감" />
            <TagBadge label="빈티지한" />
            <TagBadge label="택배 접수" />
            <TagBadge label="청량한" />
            <TagBadge label="영화용 필름" />
          </div>
        </section>

        {/* LabNewsBanner */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-neutral-100">
            LabNewsBanner (5초마다 롤링)
          </h2>
          <LabNewsBanner
            newsList={[
              {
                id: 1,
                type: "공지",
                labName: "파인더스 동작점",
                content: "택배 접수 시작합니다",
              },
              {
                id: 2,
                type: "이벤트",
                labName: "파인더스 홍대점",
                content: "첫 방문 고객 대상 500원 할인",
              },
            ]}
            intervalMs={5000}
          />
        </section>
      </div>
    </div>
  );
}
