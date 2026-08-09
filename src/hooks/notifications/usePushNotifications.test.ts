import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import type { NavigateFunction } from "react-router";
import { PushNotifications } from "@capacitor/push-notifications";
import { usePushNotifications } from "./usePushNotifications";

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => true,
    getPlatform: () => "android",
  },
  registerPlugin: () => ({ getToken: vi.fn() }),
}));

vi.mock("@capacitor/push-notifications", () => ({
  PushNotifications: {
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    requestPermissions: vi.fn(),
    register: vi.fn(),
  },
}));

const setToken = vi.fn();
vi.mock("@/store/usePushToken.store", () => ({
  usePushTokenStore: (selector: (state: { setToken: unknown }) => unknown) =>
    selector({ setToken }),
}));

// 훅이 넘긴 onSuccess/onError를 테스트가 직접 호출하기 위해 붙잡아 둔다
const registerMock = vi.hoisted(() => ({
  options: undefined as
    | {
        onSuccess?: (data: unknown, variables: { token: string }) => void;
        onError?: (error: Error) => void;
      }
    | undefined,
}));

vi.mock("./useRegisterDeviceToken", () => ({
  useRegisterDeviceToken: (options?: typeof registerMock.options) => {
    registerMock.options = options;
    return { mutate: vi.fn() };
  },
}));

const navigate = vi.fn() as unknown as NavigateFunction;

// requestPermissions의 resolve 시점을 테스트가 직접 제어하기 위한 지연 Promise
function deferPermissions() {
  let grant!: () => void;
  const pending = new Promise<{ receive: string }>((resolve) => {
    grant = () => resolve({ receive: "granted" });
  });
  vi.mocked(PushNotifications.requestPermissions).mockReturnValue(
    pending as ReturnType<typeof PushNotifications.requestPermissions>,
  );
  return grant;
}

describe("usePushNotifications", () => {
  beforeEach(() => {
    vi.mocked(PushNotifications.register).mockClear();
    setToken.mockClear();
  });

  it("권한 허용이 마운트 중에 끝나면 register를 호출한다", async () => {
    const grant = deferPermissions();
    renderHook(() => usePushNotifications(true, navigate));

    grant();
    await vi.waitFor(() =>
      expect(PushNotifications.register).toHaveBeenCalledTimes(1),
    );
  });

  it("권한 응답 전에 unmount되면 register를 호출하지 않는다", async () => {
    const grant = deferPermissions();
    const { unmount } = renderHook(() => usePushNotifications(true, navigate));

    // 리스너가 제거된 뒤 register가 호출되면 registration 이벤트가 유실된다
    unmount();
    grant();
    await Promise.resolve();

    expect(PushNotifications.register).not.toHaveBeenCalled();
  });

  it("서버 등록이 성공해야 로컬 토큰 참조를 채운다", () => {
    deferPermissions();
    renderHook(() => usePushNotifications(true, navigate));

    registerMock.options?.onSuccess?.(undefined, { token: "fcm-token" });

    expect(setToken).toHaveBeenCalledWith("fcm-token");
  });

  it("서버 등록이 실패하면 로컬 토큰 참조를 채우지 않는다", () => {
    // 실패한 토큰을 등록된 것으로 남기면 해제 API가 엉뚱한 값을 보낸다
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    deferPermissions();
    renderHook(() => usePushNotifications(true, navigate));

    registerMock.options?.onError?.(new Error("500"));

    expect(setToken).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
