import { MapPinIcon } from "@/assets/icon";

interface AddressCardProps {
  isSelected: boolean;
  onClick: () => void;
}

export function AddressCard({ isSelected, onClick }: AddressCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl p-6 text-left",
        "border transition",
        isSelected ? "border-orange-500" : "border-neutral-800",
      ].join(" ")}
    >
      <section className="mb-2 flex items-center gap-2">
        <MapPinIcon className="h-4 w-4" />
        <p>우리집</p>
      </section>
      <p>서울특별시 동작구 흑석동 123-123</p>
      <p>123호</p>
    </button>
  );
}
