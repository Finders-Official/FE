interface ReservationInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function ReservationInfoRow({
  icon,
  label,
  value,
}: ReservationInfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
        <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
          {label}
        </span>
      </div>
      <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
        {value}
      </span>
    </div>
  );
}
