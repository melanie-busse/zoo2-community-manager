import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import SpecialCoatsPagination from "./SpecialCoatsPagination";

const mockPagination = vi.fn<(props: any) => void>(() => <div data-testid="mock-pagination" />);
vi.mock("@/components/elements/Pagination/Pagination", () => ({
  default: (props: any) => {
    mockPagination(props);
    return (
      <div
        data-testid="mock-pagination"
        onClick={() => {
          props.onNext();
          props.onPrev();
        }}
      />
    );
  },
}));

const mockNextPage = vi.fn();
const mockPrevPage = vi.fn();

let storeState = {
  currentPage: 1,
  filteredItems: new Array(24),
  itemsPerPage: 12,
  nextPage: mockNextPage,
  prevPage: mockPrevPage,
};

vi.mock("@/store/useSpecialCoatStore", () => ({
  useSpecialCoatStore: (selector: (state: typeof storeState) => any) => selector(storeState),
}));

describe("SpecialCoatsPagination (Wrapper)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("sollte die korrekten State-Werte (inklusive filteredItems.length) an die Pagination übergeben", () => {
    render(<SpecialCoatsPagination />);

    expect(mockPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 1,
        filteredCount: 24,
        itemsPerPage: 12,
      }),
    );
  });

  test("sollte die Store-Actions für die Farbvarianten auslösen", () => {
    render(<SpecialCoatsPagination />);

    const paginationEl = screen.getByTestId("mock-pagination");
    fireEvent.click(paginationEl);

    expect(mockNextPage).toHaveBeenCalledTimes(1);
    expect(mockPrevPage).toHaveBeenCalledTimes(1);
  });
});
