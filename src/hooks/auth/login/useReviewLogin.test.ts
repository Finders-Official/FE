import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { useReviewLogin } from "./useReviewLogin";

const { reviewLoginMock, setTokensMock, setUserMock } = vi.hoisted(() => ({
  reviewLoginMock: vi.fn(),
  setTokensMock: vi.fn(),
  setUserMock: vi.fn(),
}));

vi.mock("@/apis/auth", () => ({ reviewLogin: reviewLoginMock }));
vi.mock("@/utils/tokenStorage", () => ({
  tokenStorage: { setTokens: setTokensMock },
}));
vi.mock("@/store/useAuth.store", () => ({
  useAuthStore: (selector: (s: { setUser: typeof setUserMock }) => unknown) =>
    selector({ setUser: setUserMock }),
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client }, children);
}

const SUCCESS = {
  success: true,
  data: {
    accessToken: "access-token",
    member: { id: "9000000000000000001", nickname: "AppReview" },
  },
};

describe("useReviewLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("로그인에 성공하면 accessToken을 저장하고 signupToken은 비운다", async () => {
    reviewLoginMock.mockResolvedValue(SUCCESS);
    const { result } = renderHook(() => useReviewLogin(), { wrapper });

    result.current.mutate({
      username: "finders2026**",
      password: "pw",
    });

    await waitFor(() => expect(setTokensMock).toHaveBeenCalled());
    expect(setTokensMock).toHaveBeenCalledWith({
      accessToken: "access-token",
      signupToken: null,
    });
  });

  it("로그인에 성공하면 전역 사용자 정보를 채운다", async () => {
    reviewLoginMock.mockResolvedValue(SUCCESS);
    const { result } = renderHook(() => useReviewLogin(), { wrapper });

    result.current.mutate({ username: "finders2026**", password: "pw" });

    await waitFor(() => expect(setUserMock).toHaveBeenCalled());
    expect(setUserMock).toHaveBeenCalledWith({
      memberId: "9000000000000000001",
      nickname: "AppReview",
    });
  });

  it("성공 콜백이 주어지면 토큰 저장 이후에 호출한다", async () => {
    reviewLoginMock.mockResolvedValue(SUCCESS);
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useReviewLogin({ onSuccess }), {
      wrapper,
    });

    result.current.mutate({ username: "finders2026**", password: "pw" });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(setTokensMock).toHaveBeenCalled();
  });

  it("실패하면 토큰을 저장하지 않고 onError로 알린다", async () => {
    reviewLoginMock.mockRejectedValue(
      new Error("이메일 또는 비밀번호가 일치하지 않습니다."),
    );
    const onError = vi.fn();
    const { result } = renderHook(() => useReviewLogin({ onError }), {
      wrapper,
    });

    result.current.mutate({ username: "finders2026**", password: "wrong" });

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(setTokensMock).not.toHaveBeenCalled();
    expect(setUserMock).not.toHaveBeenCalled();
  });
});
