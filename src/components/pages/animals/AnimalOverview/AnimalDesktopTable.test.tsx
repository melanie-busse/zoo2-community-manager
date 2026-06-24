import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";

import AnimalDesktopTable from "./AnimalDesktopTable";
import { Animal } from "@/types/animal";

vi.mock("@/components/page-structure/Table/Table.styles", () => ({
  TableCellRight: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  TableThumbnail: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TableEmptyState: ({ children, colSpan }: { children: React.ReactNode; colSpan?: number }) => (
    <td colSpan={colSpan}>{children}</td>
  ),
}));

vi.mock("@/components/page-structure/Table/Table", () => ({
  default: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
}));

vi.mock("@/components/page-structure/Table/LinkedRow", () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <tr onClick={onClick} data-testid="table-row">
      {children}
    </tr>
  ),
}));

vi.mock("@/components/page-structure/Table/SortableTableHeader", () => ({
  default: ({ label, onSort }: { label: string; onSort: () => void }) => (
    <th onClick={onSort}>{label}</th>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "de",
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { name: "Test User", role: "Director" } },
    status: "authenticated",
  }),
}));

vi.mock("@/components/ui/badges/CurrencyBadge", () => ({
  default: ({ value }: { value: number }) => <span>{value}</span>,
}));

vi.mock("@/components/ui/badges/BiomeBadge", () => ({
  default: () => <span>BiomeBadge</span>,
}));

vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: () => <span>ShelterLevelBadge</span>,
}));

vi.mock("@/components/ui/badges/ThumbnailBadge", () => ({
  default: () => <span>ThumbnailBadge</span>,
}));

vi.mock("@/components/ui/badges/XPBadge", () => ({
  default: () => <span>XPBadge</span>,
}));

vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: () => <span>ActionGroupBadge</span>,
}));

vi.mock("@/utils/AnimalUtil", () => ({
  calculateTotalXP: () => 100,
  getAnimalImage: () => "/mock-image.png",
}));

vi.mock("@/utils/BiomeUtil", () => ({
  getBiomeImage: () => "/mock-biome.png",
  getBiomeName: () => "Mock-Biom",
  getShelterImage: () => "/mock-shelter.png",
}));

const mockToggleSort = vi.fn();
const mockSetSelectedAnimal = vi.fn();

let storeState = {
  currentItems: [] as Animal[],
  sortBy: "name",
  sortDirection: "asc" as const,
  toggleSort: mockToggleSort,
  setSelectedAnimal: mockSetSelectedAnimal,
};

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: (selector: (state: typeof storeState) => any) => selector(storeState),
}));

const mockAnimals = [
  {
    id: 1,
    price: 500,
    sellingPrice: 250,
    priceType: { name: "COINS" },
    biome: { id: 1, identifier: "grassland" },
    animaltext: [{ animalName: "Löwe" }],
  },
  {
    id: 2,
    price: 1200,
    sellingPrice: 600,
    priceType: { name: "COINS" },
    biome: { id: 2, identifier: "savanna" },
    animaltext: [],
  },
] as unknown as Animal[];

describe("AnimalDesktopTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeState.currentItems = mockAnimals;
    storeState.sortBy = "name";
    storeState.sortDirection = "asc";
  });

  test("rendert den Tiernamen, wenn er vorhanden ist", () => {
    render(<AnimalDesktopTable />);
    expect(screen.getByText("Löwe")).toBeInTheDocument();
  });

  test("fängt leere animaltext-Arrays ab und zeigt den Fallback-Text", () => {
    render(<AnimalDesktopTable />);
    expect(screen.getByText("Kein Name vorhanden")).toBeInTheDocument();
  });

  test("zeigt den korrekten Einkaufspreis an", () => {
    render(<AnimalDesktopTable />);
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  test("ruft setSelectedAnimal im Store auf, wenn eine Reihe geklickt wird", () => {
    render(<AnimalDesktopTable />);

    const rowCell = screen.getByText("Löwe");
    fireEvent.click(rowCell);

    expect(mockSetSelectedAnimal).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedAnimal).toHaveBeenCalledWith(mockAnimals[0]);
  });

  test("ruft toggleSort mit 'name' auf, wenn der Spaltenkopf für die Spezies geklickt wird", () => {
    render(<AnimalDesktopTable />);

    const speciesHeader = screen.getByText("Animals.species");
    fireEvent.click(speciesHeader);

    expect(mockToggleSort).toHaveBeenCalledTimes(1);
    expect(mockToggleSort).toHaveBeenCalledWith("name");
  });

  test("ruft toggleSort mit 'price' auf, wenn der Spaltenkopf für den Preis geklickt wird", () => {
    render(<AnimalDesktopTable />);

    const priceHeader = screen.getByText("Common.price");
    fireEvent.click(priceHeader);

    expect(mockToggleSort).toHaveBeenCalledTimes(1);
    expect(mockToggleSort).toHaveBeenCalledWith("price");
  });

  test("zeigt den Empty State mit Pfoten-Icon an, wenn das animals-Array im Store leer ist", () => {
    storeState.currentItems = [];

    render(<AnimalDesktopTable />);

    const emptyStateText = screen.getByText(/EmptyState.title 🐾/i);
    expect(emptyStateText).toBeInTheDocument();
    expect(screen.queryByText("Löwe")).not.toBeInTheDocument();
  });
});
