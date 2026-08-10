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
  mutate: vi.fn(),
}));

vi.mock("./useRegisterDeviceToken", () => ({
  useRegisterDeviceToken: (options?: typeof registerMock.options) => {
    registerMock.options = options;
    return { mutate: registerMock.mutate };
  },
}));

// 훅이 등록한 Capacitor 리스너를 테스트가 직접 발화시킨다
function getListener(event: string) {
  const call = vi
    .mocked(PushNotifications.addListener)
    .mock.calls.find(([name]) => name === event);

  if (!call) throw new Error(`${event} 리스너가 등록되지 않았다`);

  return call[1] as (payload: unknown) => unknown;
}

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
    vi.mocked(PushNotifications.addListener).mockClear();
    registerMock.mutate.mockClear();
    vi.mocked(navigate).mockClear();
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

  it("같은 토큰이 두 번 통보돼도 서버에는 한 번만 등록한다", async () => {
    // iOS는 초기 발급 시 registration과 tokenRefresh가 같은 값으로 둘 다 발생한다
    deferPermissions();
    renderHook(() => usePushNotifications(true, navigate));

    const onRegistration = getListener("registration");
    await onRegistration({ value: "fcm-token" });
    await onRegistration({ value: "fcm-token" });

    expect(registerMock.mutate).toHaveBeenCalledTimes(1);
  });

  it("등록에 실패한 토큰은 다시 등록을 시도할 수 있다", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    deferPermissions();
    renderHook(() => usePushNotifications(true, navigate));

    const onRegistration = getListener("registration");
    await onRegistration({ value: "fcm-token" });
    registerMock.options?.onError?.(new Error("500"));
    await onRegistration({ value: "fcm-token" });

    expect(registerMock.mutate).toHaveBeenCalledTimes(2);
    consoleError.mockRestore();
  });

  it("딥링크는 절대 경로일 때만 이동한다", async () => {
    // 슬래시 없는 값은 현재 위치 기준 상대 경로로 해석돼 엉뚱한 화면으로 간다
    deferPermissions();
    renderHook(() => usePushNotifications(true, navigate));

    const onAction = getListener("pushNotificationActionPerformed");
    await onAction({ notification: { data: { route: "photoFeed" } } });
    await onAction({ notification: { data: { route: "//evil.com" } } });

    expect(navigate).not.toHaveBeenCalled();

    await onAction({ notification: { data: { route: "/photoFeed" } } });

    expect(navigate).toHaveBeenCalledWith("/photoFeed");
  });
});
