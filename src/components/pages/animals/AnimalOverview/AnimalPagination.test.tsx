import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import AnimalPagination from "./AnimalPagination";

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
  currentPage: 2,
  filteredCount: 30,
  itemsPerPage: 10,
  nextPage: mockNextPage,
  prevPage: mockPrevPage,
};

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: (selector: (state: typeof storeState) => any) => selector(storeState),
}));

describe("AnimalPagination (Wrapper)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("sollte die korrekten State-Werte aus dem Store an die Pagination-Komponente übergeben", () => {
    render(<AnimalPagination />);

    expect(mockPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 2,
        filteredCount: 30,
        itemsPerPage: 10,
      }),
    );
  });

  test("sollte die Store-Actions auslösen, wenn onNext und onPrev aufgerufen werden", () => {
    render(<AnimalPagination />);

    const paginationEl = screen.getByTestId("mock-pagination");

    fireEvent.click(paginationEl);

    expect(mockNextPage).toHaveBeenCalledTimes(1);
    expect(mockPrevPage).toHaveBeenCalledTimes(1);
  });
});
