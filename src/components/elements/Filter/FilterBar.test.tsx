import React from "react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import FilterBar from "./FilterBar";

vi.mock("@/components/elements/Filter/Filter.styles", () => ({
  FilterBar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SearchInput: (props: any) => <input {...props} />,
  ScaledBadge: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockSetSearchTerm = vi.fn();
const mockSetSelectedBiome = vi.fn();
const mockSetSelectedLevel = vi.fn();

let storeState = {
  allAnimals: [
    {
      id: 1,
      shelterLevel: 2,
      biome: { id: 10, name: "Desert", biomestext: [{ biomeName: "Wüste" }] },
    },
  ],
  searchTerm: "",
  selectedBiome: null,
  selectedLevel: null,
  setSearchTerm: mockSetSearchTerm,
  setSelectedBiome: mockSetSelectedBiome,
  setSelectedLevel: mockSetSelectedLevel,
};

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: (selector: (state: typeof storeState) => any) => selector(storeState),
}));

vi.mock("@/components/elements/Filter/CustomBadgeFilter", () => ({
  default: ({ items, onSelectAction, allLabelKey }: any) => (
    <div>
      <button onClick={() => onSelectAction(items[0])}>{allLabelKey}</button>
    </div>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => (key === "Filter.search_placeholder" ? "Suche..." : key),
}));

describe("FilterBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeState.searchTerm = "";
  });

  test("aktualisiert den Suchbegriff im Store, wenn der User tippt", () => {
    render(<FilterBar />);

    const input = screen.getByPlaceholderText("Suche...");
    fireEvent.change(input, { target: { value: "Löwe" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("Löwe");
  });

  test("ruft setSelectedBiome auf, wenn ein Biome ausgewählt wird", () => {
    render(<FilterBar />);

    const biomeButton = screen.getByText("all_enclosures");
    fireEvent.click(biomeButton);

    expect(mockSetSelectedBiome).toHaveBeenCalled();
  });

  test("ruft setSelectedLevel auf, wenn ein Shelter-Level ausgewählt wird", () => {
    render(<FilterBar />);

    const levelButton = screen.getByText("all_levels");
    fireEvent.click(levelButton);

    expect(mockSetSelectedLevel).toHaveBeenCalled();
  });
});
