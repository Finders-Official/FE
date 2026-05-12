import { CTA_Button, TextArea } from "@/components/common";
import { InquiryNoticeCard } from "@/components/mypage";
import { useState } from "react";

export function InquiryPage() {
  const [content, setContent] = useState("");
  return (
    <div className="flex h-full flex-1 flex-col">
      <main className="border-neutral-875 flex flex-col gap-4 border-b py-4">
        {/* 문의 유형 */}
        <section className="gap2 flex flex-col">
          <label className="text-[0.9rem] text-neutral-200">문의 유형</label>
        </section>

        {/* 문의 내용 */}
        <section className="flex flex-col gap-2">
          <label className="text-[0.9rem] text-neutral-200">문의 내용</label>
          <TextArea
            type="content"
            value={content}
            onChange={setContent}
            placeholder="문의하실 내용이나 오류 내용을 입력해주세요"
            minLength={20}
            emptyHint="min"
          />
        </section>
      </main>
      <section className="px-4 py-6">
        <InquiryNoticeCard />
      </section>
      <footer className="border-neutral-850 mt-auto border-t py-5">
        <CTA_Button size="xlarge" text="문의하기" color="black" />
      </footer>
    </div>
  );
}
