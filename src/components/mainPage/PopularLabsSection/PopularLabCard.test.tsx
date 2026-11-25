import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { photoLabPlaceholder } from "@/assets/images";
import type { Lab } from "@/apis/mainPage/mainPage.api";
import PopularLabCard from "./PopularLabCard";

vi.mock("@/hooks/mainPage/useRequireAuth", () => ({
  useRequireAuth: () => ({ requireAuthNavigate: vi.fn() }),
}));

function lab(mainImageUrl: string | null): Lab {
  return { photoLabId: "0QG2K3BR277D5", name: "가로다랩", mainImageUrl } as Lab;
}

describe("PopularLabCard", () => {
  it("대표 이미지가 없으면 준비중 플레이스홀더를 보여준다", () => {
    render(<PopularLabCard lab={lab(null)} />);

    expect(screen.getByRole("img", { name: "가로다랩" })).toHaveAttribute(
      "src",
      photoLabPlaceholder,
    );
  });

  it("대표 이미지가 있으면 그 주소를 쓴다", () => {
    const url =
      "https://storage.googleapis.com/bucket/photo-labs/1/images/naver-1.jpg";
    render(<PopularLabCard lab={lab(url)} />);

    expect(screen.getByRole("img", { name: "가로다랩" })).toHaveAttribute(
      "src",
      url,
    );
  });
});
