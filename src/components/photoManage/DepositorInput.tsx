interface DepositorInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DepositorInput({ value, onChange }: DepositorInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-[1rem] leading-[1.55] font-semibold tracking-[-0.02rem] text-neutral-100">
        입금자
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="입금자명을 입력해주세요"
        className="border-neutral-850 w-full rounded-[0.625rem] border bg-transparent px-4 py-[0.875rem] text-[1rem] leading-[1.55] tracking-[-0.02rem] text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
      />
    </div>
  );
}
