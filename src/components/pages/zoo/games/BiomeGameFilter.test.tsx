import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock("@/components/elements/Filter/FilterCard", () => ({
  default: ({ children }: any) => <div data-testid="filter-card">{children}</div>,
}));

vi.mock("@/components/elements/Filter/SearchInputField", () => ({
  SearchInputField: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="search-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockOnSelectAction = vi.fn();
vi.mock("@/components/ui/form/SelectBoxWithImage", () => ({
  default: ({ items, selectedValue, onSelectAction, allLabelKey, getLabel, getIdentifier }: any) => (
    <div data-testid="biome-select">
      <button data-testid="select-all" onClick={() => onSelectAction("all")}>
        {allLabelKey}
      </button>
      {items.map((item: any) => (
        <button
          key={getIdentifier(item)}
          data-testid={`select-${getIdentifier(item)}`}
          onClick={() => onSelectAction(getIdentifier(item))}
        >
          {getLabel(item)}
        </button>
      ))}
      <span data-testid="selected-value">{selectedValue}</span>
    </div>
  ),
}));

vi.mock("@/components/ui/badges/BiomeBadge", () => ({
  default: () => <span data-testid="biome-badge" />,
}));

vi.mock("@/utils/BiomeUtil", () => ({
  getBiomeImage: (b: any) => ({ path: `/images/biomes/${b.identifier}/area.webp`, alt: b.identifier, name: b.identifier }),
  getBiomeName: (b: any, fallback: string) => b.biomestext?.[0]?.biomeName ?? fallback,
}));

const mockSetSearchTerm = vi.fn();
const mockSetSelectedBiomeIdentifier = vi.fn();

let currentStoreState = {
  allGames: [
    { id: 1, identifier: "play_pond", biomeIdentifier: "grassland", texts: [{ name: "Teich" }] },
    { id: 2, identifier: "play_tree", biomeIdentifier: "forest", texts: [{ name: "Baum" }] },
  ],
  searchTerm: "",
  selectedBiomeIdentifier: null as string | null,
  setSearchTerm: mockSetSearchTerm,
  setSelectedBiomeIdentifier: mockSetSelectedBiomeIdentifier,
};

vi.mock("@/store/useGameStore", () => ({
  useGameStore: (selector: (state: typeof currentStoreState) => any) =>
    selector(currentStoreState),
}));

import BiomeGameFilter from "./BiomeGameFilter";

const mockBiomes = [
  { identifier: "grassland", biomestext: [{ biomeName: "Grasland" }] },
  { identifier: "forest", biomestext: [{ biomeName: "Wald" }] },
];

describe("BiomeGameFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentStoreState = {
      allGames: [
        { id: 1, identifier: "play_pond", biomeIdentifier: "grassland", texts: [{ name: "Teich" }] },
        { id: 2, identifier: "play_tree", biomeIdentifier: "forest", texts: [{ name: "Baum" }] },
      ],
      searchTerm: "",
      selectedBiomeIdentifier: null,
      setSearchTerm: mockSetSearchTerm,
      setSelectedBiomeIdentifier: mockSetSelectedBiomeIdentifier,
    };
  });

  test("rendert das Suchfeld mit game-spezifischem Placeholder", () => {
    render(<BiomeGameFilter biomes={mockBiomes} />);
    expect(screen.getByTestId("search-input")).toHaveAttribute(
      "placeholder",
      "game.search_placeholder",
    );
  });

  test("Eingabe im Suchfeld ruft setSearchTerm auf", () => {
    render(<BiomeGameFilter biomes={mockBiomes} />);
    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "Teich" } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith("Teich");
  });

  test("zeigt SelectBoxWithImage wenn mehr als ein Biom vorhanden", () => {
    render(<BiomeGameFilter biomes={mockBiomes} />);
    expect(screen.getByTestId("biome-select")).toBeInTheDocument();
  });

  test("zeigt nur Biome die tatsächlich in den Spielen vorkommen", () => {
    const biomesWithExtra = [
      ...mockBiomes,
      { identifier: "savanna", biomestext: [{ biomeName: "Savanne" }] },
    ];
    render(<BiomeGameFilter biomes={biomesWithExtra} />);
    expect(screen.queryByTestId("select-savanna")).not.toBeInTheDocument();
    expect(screen.getByTestId("select-grassland")).toBeInTheDocument();
    expect(screen.getByTestId("select-forest")).toBeInTheDocument();
  });

  test("Auswahl eines Bioms ruft setSelectedBiomeIdentifier auf", () => {
    render(<BiomeGameFilter biomes={mockBiomes} />);
    fireEvent.click(screen.getByTestId("select-forest"));
    expect(mockSetSelectedBiomeIdentifier).toHaveBeenCalledWith("forest");
  });

  test("Auswahl von 'all' übergibt null", () => {
    render(<BiomeGameFilter biomes={mockBiomes} />);
    fireEvent.click(screen.getByTestId("select-all"));
    expect(mockSetSelectedBiomeIdentifier).toHaveBeenCalledWith(null);
  });

  test("kein Biom-Select wenn alle Spiele dasselbe Biom haben", () => {
    currentStoreState = {
      ...currentStoreState,
      allGames: [
        { id: 1, identifier: "play_pond", biomeIdentifier: "grassland", texts: [{ name: "Teich" }] },
        { id: 2, identifier: "play_tree", biomeIdentifier: "grassland", texts: [{ name: "Baum" }] },
      ],
    };
    render(<BiomeGameFilter biomes={mockBiomes} />);
    expect(screen.queryByTestId("biome-select")).not.toBeInTheDocument();
  });

  test("zeigt den lokalisierten Biom-Namen via getLabel", () => {
    render(<BiomeGameFilter biomes={mockBiomes} />);
    expect(screen.getByText("Grasland")).toBeInTheDocument();
    expect(screen.getByText("Wald")).toBeInTheDocument();
  });
});
