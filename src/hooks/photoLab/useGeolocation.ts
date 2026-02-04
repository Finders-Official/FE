import { useSyncExternalStore } from "react";

interface GeolocationResult {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
}

const defaultState: GeolocationResult = {
  latitude: null,
  longitude: null,
  isLoading: true,
  error: null,
};

let cachedState: GeolocationResult = defaultState;
let listeners: Array<() => void> = [];

function emitChange(next: GeolocationResult) {
  cachedState = next;
  listeners.forEach((l) => l());
}

let requested = false;

function requestLocation() {
  if (requested) return;
  requested = true;

  if (!navigator.geolocation) {
    emitChange({
      latitude: null,
      longitude: null,
      isLoading: false,
      error: "Geolocation not supported",
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      emitChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isLoading: false,
        error: null,
      });
    },
    (error) => {
      emitChange({
        latitude: null,
        longitude: null,
        isLoading: false,
        error: error.message,
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5분 위치 캐시
    },
  );
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
