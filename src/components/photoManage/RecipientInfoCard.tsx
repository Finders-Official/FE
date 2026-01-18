interface InfoItem {
  label: string;
  value: string;
}

interface RecipientInfoCardProps {
  items: InfoItem[];
}

export function RecipientInfoCard({ items }: RecipientInfoCardProps) {
  return (
    <div className="flex flex-col gap-[0.25rem] text-[0.8125rem]">
      {items.map((item) => (
        <div key={item.label} className="flex gap-[0.5rem]">
          <span className="text-neutral-400">{item.label}</span>
          <span className="text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
