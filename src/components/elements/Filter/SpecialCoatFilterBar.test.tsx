import React from "react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import SpecialCoatFilterBar from "./SpecialCoatFilterBar";

vi.mock("@/components/elements/Filter/Filter.styles", () => ({
  FilterBar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SearchInput: (props: any) => <input {...props} />,
  ScaledBadge: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StatusDot: () => <span />,
  CheckboxLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}));

vi.mock("@/utils/BiomeUtil", () => ({
  getBiomeName: (biome: any) => biome.identifier,
  getBiomeImage: () => "/mock-biome.png",
  getShelterImage: () => "/mock-shelter.png",
}));

vi.mock("@/components/ui/form/SelectBoxWithImage", () => ({
  default: ({ items, onSelectAction, allLabelKey }: any) => (
    <div>
      <button onClick={() => onSelectAction(items[0] ? "mocked_value" : "all")}>
        {allLabelKey}
      </button>
    </div>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => (key === "filter.search_placeholder" ? "Suche..." : key),
}));

const mockSetSearchTerm = vi.fn();
const mockSetSelectedBiome = vi.fn();
const mockSetSelectedShelterLevel = vi.fn();
const mockSetInventoryStatus = vi.fn();
const mockSetContestOnly = vi.fn();

const mockCoats = [
  {
    id: 1,
    ownedAmount: 2,
    animal: { id: 10, shelterLevel: 1, biome: { id: 100, identifier: "grassland" } },
  },
];

vi.mock("@/store/useSpecialCoatStore", () => ({
  useSpecialCoatStore: (selector: any) =>
    selector({
      allSpecialCoats: mockCoats,
      searchTerm: "",
      selectedBiome: null,
      selectedShelterLevel: null,
      inventoryStatus: "all",
      contestOnly: false,
      setSearchTerm: mockSetSearchTerm,
      setSelectedBiome: mockSetSelectedBiome,
      setSelectedShelterLevel: mockSetSelectedShelterLevel,
      setInventoryStatusFilter: mockSetInventoryStatus,
      setContestOnly: mockSetContestOnly,
    }),
}));

describe("SpecialCoatFilterBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("aktualisiert den Suchbegriff im Store, wenn der User tippt", () => {
    render(<SpecialCoatFilterBar />);

    const input = screen.getByPlaceholderText("Suche...");
    fireEvent.change(input, { target: { value: "Löwe" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("Löwe");
  });

  test("ruft setInventoryStatusFilter auf, wenn der Status-Filter bedient wird", () => {
    render(<SpecialCoatFilterBar />);

    const statusButton = screen.getByText("all_status");
    fireEvent.click(statusButton);

    expect(mockSetInventoryStatus).toHaveBeenCalled();
  });

  test("ruft setSelectedBiome auf, wenn ein Biome-Filter bedient wird", () => {
    render(<SpecialCoatFilterBar />);

    const biomeButton = screen.getByText("all_enclosures");
    fireEvent.click(biomeButton);

    expect(mockSetSelectedBiome).toHaveBeenCalled();
  });

  test("ruft setSelectedShelterLevel auf, wenn ein Level-Filter bedient wird", () => {
    render(<SpecialCoatFilterBar />);

    const levelButton = screen.getByText("all_levels");
    fireEvent.click(levelButton);

    expect(mockSetSelectedShelterLevel).toHaveBeenCalled();
  });
});