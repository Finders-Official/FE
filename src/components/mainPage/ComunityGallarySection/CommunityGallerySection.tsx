import { useEffect, useRef, useState, useCallback } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import CommunityGallerySectionCard from "./CommunityGallerySectionCard";
import { useCommunityPostsQuery } from "@/hooks/mainPage/useMainPageQueries";

export default function CommunityGallerySection() {
  const { data: posts, isLoading, isError } = useCommunityPostsQuery();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // 중앙에 가장 가까운 카드를 계산하여 activeIndex 업데이트
  const updateActiveIndex = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const centerX = scroller.scrollLeft + scroller.clientWidth / 2;
    let bestIdx = 0;
    let minDistance = Infinity;

    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const elCenter = el.offsetLeft + el.clientWidth / 2;
      const distance = Math.abs(centerX - elCenter);
      if (distance < minDistance) {
        minDistance = distance;
        bestIdx = idx;
      }
    });

    setActiveIndex(bestIdx);
  }, []);

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // 초기 마운트 시 2번째 카드 중앙 정렬 (데이터가 2개 이상일 때)
    if (posts.length >= 2) {
      requestAnimationFrame(() => {
        const secondItem = itemRefs.current[1];
        if (secondItem) {
          const targetLeft =
            secondItem.offsetLeft -
            (scroller.clientWidth - secondItem.clientWidth) / 2;
          scroller.scrollTo({
            left: targetLeft,
            behavior: "auto",
          });
          setActiveIndex(1);
        }
      });
    }

    // 스크롤 이벤트 바인딩 (rAF 스로틀링)
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveIndex);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(updateActiveIndex);

    return () => {
      cancelAnimationFrame(rafId);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [posts, updateActiveIndex]);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !posts || posts.length === 0) return null;

  return (
    <section className="flex flex-col gap-7 py-6">
      <SectionHeader
        title={"파인더들이 찍은 사진\n같이 보실래요?"}
        link="/photoFeed"
      />

      <div
        ref={scrollerRef}
        className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4"
        style={{ scrollPadding: "0 20px" }}
      >
        {posts.map((post, idx) => (
          <div
            key={post.postId}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            className="relative flex-none snap-center"
          >
            <div className="relative">
              <CommunityGallerySectionCard post={post} />
              {/* 비활성 카드 오버레이 (클릭 간섭 방지를 위해 pointer-events-none 적용) */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl bg-black transition-opacity duration-200 ${
                  idx === activeIndex ? "opacity-0" : "opacity-45"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
