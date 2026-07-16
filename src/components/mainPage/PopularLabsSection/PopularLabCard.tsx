import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";
import type { Lab } from "@/apis/mainPage/mainPage.api";
import { Press } from "@/components/common";

interface PopularLabCardProps {
  lab: Lab;
}

export default function PopularLabCard({ lab }: PopularLabCardProps) {
  const { requireAuthNavigate } = useRequireAuth();
  const apiBase = import.meta.env.VITE_PUBLIC_API_URL;
  const origin = apiBase.replace(/\/api\/?$/, "");

  const raw = (lab.mainImageUrl ?? "").trim();

  const imageUrl = raw.startsWith("http")
    ? raw
    : `${origin}/${raw.replace(/^\/+/, "")}`;

  const fallbackImage =
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80";

  return (
    <Press
      as="div"
      onClick={() => requireAuthNavigate(`/photolab/${lab.photoLabId}`)}
      className="relative block aspect-163/230 w-full cursor-pointer overflow-hidden rounded-[0.625rem] border border-neutral-800"
    >
      <img
        src={imageUrl}
        alt={lab.name}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImage;
        }}
      />

      <div
        className="absolute right-0 bottom-16.25 left-0 z-10 h-13.25 w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(22, 22, 22, 0) 0%, rgba(20, 20, 20, 0.677885) 28.37%, #131313 100%)",
        }}
      />

      <div className="absolute right-0 bottom-0 left-0 z-20 flex h-16.25 items-center rounded-b-[0.625rem] bg-neutral-900 px-2.5">
        <h3 className="w-full truncate text-[0.875rem] leading-[140%] font-semibold tracking-[-0.02em] text-neutral-100">
          {lab.name}
        </h3>
      </div>
    </Press>
  );
}
