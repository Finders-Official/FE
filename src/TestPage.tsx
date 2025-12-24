export default function Home() {
  return (
    <div className="space-y-4 pt-10">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="text-slate-600">
        모바일에서는 꽉 차고, PC에서는 중앙 정렬된 최대 폭 레이아웃으로
        보입니다.
      </p>

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="text-sm font-medium">Card</div>
        <div className="mt-2 text-sm text-slate-600">
          여기에 페이지 컴포넌트들이 들어갑니다.
        </div>
      </div>
    </div>
  );
}
