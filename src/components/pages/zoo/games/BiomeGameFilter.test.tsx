import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

function makeElement(tag: string) {
  return () =>
    function StyledEl({ children, ...rest }: any) {
      return React.createElement(tag, rest, children);
    };
}

vi.mock("styled-components", () => ({
  default: Object.assign(
    (tag: any) =>
      function StyledEl({ children, ...rest }: any) {
        return React.createElement(tag, rest, children);
      },
    {
      select: makeElement("select"),
      div: makeElement("div"),
      input: makeElement("input"),
      span: makeElement("span"),
    },
  ),
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

  test("rendert das Suchfeld", () => {
    render(<BiomeGameFilter />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  test("Suchfeld hat den korrekten Placeholder", () => {
    render(<BiomeGameFilter />);
    expect(screen.getByTestId("search-input")).toHaveAttribute(
      "placeholder",
      "common.filter.search_placeholder",
    );
  });

  test("Eingabe im Suchfeld ruft setSearchTerm auf", () => {
    render(<BiomeGameFilter />);
    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "Teich" } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith("Teich");
  });

  test("zeigt Biom-Dropdown wenn mehr als ein Biom vorhanden", () => {
    render(<BiomeGameFilter />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("Biom-Dropdown enthält alle einzigartigen Biome sowie 'Alle Biome'", () => {
    render(<BiomeGameFilter />);
    const options = screen.getAllByRole("option");
    const values = options.map((o) => o.getAttribute("value"));
    expect(values).toContain("all");
    expect(values).toContain("grassland");
    expect(values).toContain("forest");
  });

  test("Auswahl eines Bioms ruft setSelectedBiomeIdentifier auf", () => {
    render(<BiomeGameFilter />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "forest" } });
    expect(mockSetSelectedBiomeIdentifier).toHaveBeenCalledWith("forest");
  });

  test("Auswahl von 'all' übergibt null", () => {
    render(<BiomeGameFilter />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "all" } });
    expect(mockSetSelectedBiomeIdentifier).toHaveBeenCalledWith(null);
  });

  test("kein Biom-Dropdown wenn alle Spiele dasselbe Biom haben", () => {
    currentStoreState = {
      ...currentStoreState,
      allGames: [
        { id: 1, identifier: "play_pond", biomeIdentifier: "grassland", texts: [{ name: "Teich" }] },
        { id: 2, identifier: "play_tree", biomeIdentifier: "grassland", texts: [{ name: "Baum" }] },
      ],
    };

    render(<BiomeGameFilter />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
