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

  navigator.geolocation.getCurrentPosition(
    (position) => {
      emitChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isLoading: false,
        error: null,
        locationAgreed: true,
      });
    },
    (error) => {
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
