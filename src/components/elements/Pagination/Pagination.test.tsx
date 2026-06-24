import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import Pagination from "./Pagination";

vi.mock("./Pagination.styles", () => ({
  SignpostAssembly: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PageIndicator: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  // Hier mappen wir das auf einen echten Button und reichen disabled weiter
  SignpostButton: ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
    <button onClick={onClick} disabled={disabled} />
  ),
}));

vi.mock("@/components/ui/tooltip/Tooltip", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockNextPage = vi.fn();
const mockPrevPage = vi.fn();

let storeState = {
  currentPage: 1,
  filteredCount: 50,
  itemsPerPage: 10,
  nextPage: mockNextPage,
  prevPage: mockPrevPage,
};

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: (selector: (state: typeof storeState) => any) => selector(storeState),
}));

describe("Pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Standard-Zustand vor jedem Test wiederherstellen (Seite 1 von 5)
    storeState.currentPage = 1;
    storeState.filteredCount = 50;
    storeState.itemsPerPage = 10;
  });

  test("rendert null, wenn es nur eine oder weniger Seiten gibt", () => {
    storeState.filteredCount = 5;

    const { container } = render(<Pagination />);
    expect(container.firstChild).toBeNull();
  });

  test("rendert die Seitenzahlen korrekt und sperrt 'Zurück' auf der ersten Seite", () => {
    render(<Pagination />);

    expect(
      screen.getByText((content, element) => {
        const hasText = (node: Element | null) => node?.textContent?.replace(/\s+/g, "") === "1/5";
        const childrenDontHaveText = Array.from(element?.children || []).every(
          (child) => !hasText(child),
        );
        return hasText(element) && childrenDontHaveText;
      }),
    ).toBeInTheDocument();

     const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test("ruft nextPage und prevPage auf, wenn sich der User auf einer mittleren Seite befindet", () => {
    storeState.currentPage = 3; // Auf Seite 3 springen

    render(<Pagination />);

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(prevButton);
    expect(mockPrevPage).toHaveBeenCalledTimes(1);

    fireEvent.click(nextButton);
    expect(mockNextPage).toHaveBeenCalledTimes(1);
  });

  test("sperrt den 'Weiter'-Button auf der letzten Seite", () => {
    storeState.currentPage = 5;

    render(<Pagination />);

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});
