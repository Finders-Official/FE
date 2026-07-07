import { useSyncExternalStore } from "react";

interface GeolocationResult {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
  locationAgreed: boolean;
}

const defaultState: GeolocationResult = {
  latitude: null,
  longitude: null,
  isLoading: true,
  error: null,
  locationAgreed: false,
};

let cachedState: GeolocationResult = defaultState;
let listeners: Array<() => void> = [];

function emitChange(next: GeolocationResult) {
  cachedState = next;
  listeners.forEach((l) => l());
}

let requested = false;

const FALLBACK_TIMEOUT_MS = 12000;

function requestLocation() {
  if (requested) return;
  requested = true;

  if (!navigator.geolocation) {
    emitChange({
      latitude: null,
      longitude: null,
      isLoading: false,
      error: "Geolocation not supported",
      locationAgreed: false,
    });
    return;
  }

  const fallbackTimer = setTimeout(() => {
    requested = false;
    emitChange({
      latitude: null,
      longitude: null,
      isLoading: false,
      error: "Geolocation timeout",
      locationAgreed: false,
    });
  }, FALLBACK_TIMEOUT_MS);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      clearTimeout(fallbackTimer);
      emitChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isLoading: false,
        error: null,
        locationAgreed: true,
      });
    },
    (error) => {
      clearTimeout(fallbackTimer);
      requested = false;
      emitChange({
        latitude: null,
        longitude: null,
        isLoading: false,
        error: error.message,
        locationAgreed: false,
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5분 위치 캐시
    },
  );
}

// 위치 권한 요청 + 위치 캐시
export function prefetchGeolocation(): void {
  requestLocation();
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  requestLocation();
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return cachedState;
}

export function useGeolocation(): GeolocationResult {
  return useSyncExternalStore(subscribe, getSnapshot);
}
