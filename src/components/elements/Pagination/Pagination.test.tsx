import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import Pagination from "./Pagination";

vi.mock("./Pagination.styles", () => ({
  SignpostAssembly: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PageIndicator: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignpostButton: ({
    disabled,
    onClick,
    $direction,
  }: {
    disabled: boolean;
    onClick: () => void;
    $direction: string;
  }) => <button onClick={onClick} disabled={disabled} data-testid={`btn-${$direction}`} />,
}));

vi.mock("@/components/ui/tooltip/Tooltip", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("Pagination", () => {
  const mockNext = vi.fn();
  const mockPrev = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert null, wenn es nur eine oder weniger Seiten gibt", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        filteredCount={5}
        itemsPerPage={10}
        onNext={mockNext}
        onPrev={mockPrev}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("rendert die Seitenzahlen korrekt und sperrt 'Zurück' auf der ersten Seite", () => {
    render(
      <Pagination
        currentPage={1}
        filteredCount={50}
        itemsPerPage={10}
        onNext={mockNext}
        onPrev={mockPrev}
      />,
    );

    expect(
      screen.getByText((content, element) => {
        const hasText = (node: Element | null) => node?.textContent?.replace(/\s+/g, "") === "1/5";
        const childrenDontHaveText = Array.from(element?.children || []).every(
          (child) => !hasText(child),
        );
        return hasText(element) && childrenDontHaveText;
      }),
    ).toBeInTheDocument();

    const prevButton = screen.getByTestId("btn-prev");
    const nextButton = screen.getByTestId("btn-next");

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test("ruft onNext und onPrev auf, wenn sich der User auf einer mittleren Seite befindet", () => {
    render(
      <Pagination
        currentPage={3}
        filteredCount={50}
        itemsPerPage={10}
        onNext={mockNext}
        onPrev={mockPrev}
      />,
    );

    const prevButton = screen.getByTestId("btn-prev");
    const nextButton = screen.getByTestId("btn-next");

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(prevButton);
    expect(mockPrev).toHaveBeenCalledTimes(1);

    fireEvent.click(nextButton);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test("sperrt den 'Weiter'-Button auf der letzten Seite", () => {
    render(
      <Pagination
        currentPage={5}
        filteredCount={50}
        itemsPerPage={10}
        onNext={mockNext}
        onPrev={mockPrev}
      />,
    );

    const prevButton = screen.getByTestId("btn-prev");
    const nextButton = screen.getByTestId("btn-next");

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});
