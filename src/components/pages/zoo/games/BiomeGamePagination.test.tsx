import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import BiomeGamePagination from "./BiomeGamePagination";

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

const storeState = {
  currentPage: 2,
  filteredCount: 50,
  itemsPerPage: 20,
  nextPage: mockNextPage,
  prevPage: mockPrevPage,
};

vi.mock("@/store/useGameStore", () => ({
  useGameStore: (selector: (state: typeof storeState) => any) => selector(storeState),
}));

describe("BiomeGamePagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("übergibt korrekte State-Werte aus dem Store an Pagination", () => {
    render(<BiomeGamePagination />);

    expect(mockPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 2,
        filteredCount: 50,
        itemsPerPage: 20,
      }),
    );
  });

  test("ruft nextPage und prevPage aus dem Store auf", () => {
    render(<BiomeGamePagination />);

    fireEvent.click(screen.getByTestId("mock-pagination"));

    expect(mockNextPage).toHaveBeenCalledTimes(1);
    expect(mockPrevPage).toHaveBeenCalledTimes(1);
  });
});
