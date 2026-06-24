import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

import EmptyState from "./EmptyState";

vi.mock("@/components/elements/EmptyState/EmptyState.styles", () => ({
  OuterContainer: ({ children }: any) => <div>{children}</div>,
  Container: ({ children }: any) => <div>{children}</div>,
  SpeechBubble: ({ children }: any) => <div>{children}</div>,
  UppyPortraitFrame: ({ children }: any) => <div>{children}</div>,
  ResetButton: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

vi.mock("next/image", () => ({
  default: ({ alt }: any) => <img alt={alt} />,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("EmptyState", () => {
  test("rendert Fallback-Texte, wenn keine Props übergeben werden", () => {
    render(<EmptyState object="animal" />);

    expect(screen.getByText("EmptyState.animal.title")).toBeInTheDocument();
    expect(screen.getByText("EmptyState.message")).toBeInTheDocument();
  });

  test("führt den onResetAction Callback bei Klick aus", () => {
    const mockReset = vi.fn();
    render(<EmptyState object="animal" onResetAction={mockReset} />);

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
