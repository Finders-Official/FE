import { useEffect, useRef } from "react";
import { CopyIcon, MapPinIcon } from "@/assets/icon";
import { CopyButton } from "@/components/common";
import customPinUrl from "@/assets/icon/custom-pin.svg";
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
        Marker: new (options: { position: unknown; image?: unknown }) => {
          setMap: (map: unknown) => void;
        };
        MarkerImage: new (
          src: string,
          size: unknown,
          options?: { offset: unknown },
        ) => unknown;
        Size: new (width: number, height: number) => unknown;
        Point: new (x: number, y: number) => unknown;
        CustomOverlay: new (options: {
          content: string;
          position: unknown;
          yAnchor?: number;
        }) => {
          setMap: (map: unknown | null) => void;
        };
      };
    };
  }
}

interface LabLocationSectionProps {
  address: string;
  addressDetail?: string;
  distanceKm: number | null;
  location?: PhotoLabLocation;
  labName: string;
  className?: string;
}

export default function LabLocationSection({
  address,
  addressDetail,
  distanceKm,
  location,
  labName,
  className = "",
}: LabLocationSectionProps) {
  const fullAddress = addressDetail ? `${address} ${addressDetail}` : address;
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !location) return;

    let marker: { setMap: (map: unknown | null) => void } | null = null;

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

      // 커스텀 마커 이미지
      const imageSize = new kakao.maps.Size(63, 63);
      const imageOption = { offset: new kakao.maps.Point(31, 31) };
      const markerImage = new kakao.maps.MarkerImage(
        customPinUrl,
        imageSize,
        imageOption,
      );

      marker = new kakao.maps.Marker({
        position: position,
        image: markerImage,
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
    // 최적화를 위한 원시값 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.latitude, location?.longitude]);

  const handleDirectionsClick = () => {
    if (!location) return;
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
          <CopyButton
            text={fullAddress}
            toastMessage="주소가 복사되었습니다."
            className="flex w-full items-center gap-1.5"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center">
              <CopyIcon className="h-4 w-4 text-neutral-200" />
            </div>
            <span className="min-w-0 flex-1 truncate text-left text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
              {fullAddress}
            </span>
          </CopyButton>
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
