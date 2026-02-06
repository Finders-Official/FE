import { MapPinIcon } from "@/assets/icon";
import type { Address } from "@/types/photomanage/address";

interface AddressCardProps {
  isSelected: boolean;
  onClick: () => void;
  address: Address;
}

export function AddressCard({
  isSelected,
  onClick,
  address,
}: AddressCardProps) {
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
        <p>{address.addressName}</p>
      </section>
      <p className="text-sm text-neutral-300">
        [{address.zipcode}] {address.address}
      </p>
      {address.addressDetail && (
        <p className="text-sm text-neutral-400">{address.addressDetail}</p>
      )}
    </button>
  );
}
