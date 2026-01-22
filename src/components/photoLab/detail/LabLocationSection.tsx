import { useEffect, useRef } from "react";
import { CopyIcon, MapPinIcon } from "@/assets/icon";
import type { PhotoLabLocation } from "@/types/photoLab";

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number },
        ) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: { position: unknown }) => {
          setMap: (map: unknown) => void;
        };
      };
    };
  }
}

interface LabLocationSectionProps {
  address: string;
  distanceKm: number;
  location: PhotoLabLocation;
  labName: string;
  className?: string;
}

export default function LabLocationSection({
  address,
  distanceKm,
  location,
  labName,
  className = "",
}: LabLocationSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let marker: { setMap: (map: unknown) => void } | null = null;

    const initMap = () => {
      const { kakao } = window;
      if (!kakao?.maps || !mapContainerRef.current) return;

      const position = new kakao.maps.LatLng(
        location.latitude,
        location.longitude,
      );

      const map = new kakao.maps.Map(mapContainerRef.current, {
        center: position,
        level: 3,
      });

      marker = new kakao.maps.Marker({
        position: position,
      });

      marker.setMap(map);
    };

    if (window.kakao?.maps) {
      window.kakao.maps.load(initMap);
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [location.latitude, location.longitude]);

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address);
  };

  const handleDirectionsClick = () => {
    const encodedName = encodeURIComponent(labName);
    const kakaoMapUrl = `https://map.kakao.com/link/to/${encodedName},${location.latitude},${location.longitude}`;
    window.open(kakaoMapUrl, "_blank");
  };

  return (
    <div className={`py-[1.875rem] ${className}`}>
      {/* 헤더 */}
      <div className="mb-4 flex flex-col gap-1.5">
        <h3 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
          위치
        </h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="flex items-center gap-1.5"
          >
            <div className="flex h-6 w-6 items-center justify-center">
              <CopyIcon className="h-4 w-4 text-neutral-200" />
            </div>
            <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
              {" "}
              {/* 유저에게 뭔가 줄 반응이 필요함 */}
              {address}
            </span>
          </button>
          <p className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-300">
            지금 내 위치에서 약 {distanceKm}km 거리에 있어요
          </p>
        </div>
      </div>

      {/* 지도 */}
      <div
        ref={mapContainerRef}
        className="mb-4 h-[12.1875rem] w-full rounded-[0.625rem] bg-neutral-700"
      />

      {/* 가는 길 보기 버튼 */}
      <button
        type="button"
        onClick={handleDirectionsClick}
        className="flex h-[3.5rem] w-full items-center justify-center gap-2 rounded-[0.625rem] border border-neutral-600"
      >
        <MapPinIcon className="h-4 w-3.5 text-neutral-300" />
        <span className="text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200">
          가는 길 보기
        </span>
      </button>
    </div>
  );
}
