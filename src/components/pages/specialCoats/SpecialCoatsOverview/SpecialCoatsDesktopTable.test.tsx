import React from "react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SpecialCoatsDesktopTable from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsDesktopTable";

const mockUseSession = vi.fn();
vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

const mockToggleSort = vi.fn();
const mockSetSelectedSpecialCoat = vi.fn();

const mockSpecialCoats = [
  {
    id: 1,
    specialcoatstext: [{ name: "Polarfuchs", color: "Weiß" }],
    animal: {
      shelterLevel: 3,
      biome: { id: 100, identifier: "ice" },
    },
  },
];

vi.mock("@/store/useSpecialCoatStore", () => ({
  useSpecialCoatStore: (selector: any) =>
    selector({
      currentItems: mockSpecialCoats,
      sortBy: "name",
      sortDirection: "asc",
      toggleSort: mockToggleSort,
      setSelectedSpecialCoat: mockSetSelectedSpecialCoat,
    }),
}));

vi.mock("@/components/page-structure/Table/Table", () => ({
  default: ({ children }: any) => <table>{children}</table>,
}));
vi.mock("@/components/page-structure/Table/LinkedRow", () => ({
  default: ({ children, onClick }: any) => <tr onClick={onClick}>{children}</tr>,
}));
vi.mock("@/components/page-structure/Table/SortableTableHeader", () => ({
  default: ({ label, onSort }: any) => <th onClick={onSort}>{label}</th>,
}));
vi.mock("@/components/page-structure/Table/Table.styles", () => ({
  TableThumbnail: ({ children }: any) => <div>{children}</div>,
  TableCellRight: ({ children }: any) => <td>{children}</td>,
  TableEmptyState: ({ children, colSpan }: any) => <td colSpan={colSpan}>{children}</td>,
}));

vi.mock("@/components/ui/badges/ThumbnailBadge", () => ({ default: () => <span>[Image]</span> }));
vi.mock("@/components/ui/badges/BiomeBadge", () => ({ default: () => <span>[Biome]</span> }));
vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: ({ level }: any) => <span>Level {level}</span>,
}));
vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: () => <button>Actions</button>,
}));

vi.mock("@/utils/BiomeUtil", () => ({
  getBiomeImage: vi.fn(),
  getBiomeName: vi.fn(),
  getShelterImage: vi.fn(),
}));
vi.mock("@/utils/SpecialCoatUtil", () => ({ getSpecialCoatImage: vi.fn() }));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("SpecialCodesDesktopTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSession.mockReturnValue({ data: { user: { role: "User" } } });
  });

  test("rendert die Tabellenzeilen mit Namen und Farben korrekt", () => {
    render(<SpecialCoatsDesktopTable />);

    expect(screen.getByText("Polarfuchs")).toBeInTheDocument();
    expect(screen.getByText("Weiß")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.queryByText("Common.actions")).not.toBeInTheDocument();
  });

  test("zeigt Admin-Spalte und Aktionen an, wenn der User 'Director' ist", () => {
    mockUseSession.mockReturnValue({ data: { user: { role: "Director" } } });

    render(<SpecialCoatsDesktopTable />);

    expect(screen.getByText("Common.actions")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument(); // Der Button aus dem ActionGroupBadge Mock
  });

  test("triggert toggleSort beim Klick auf einen sortierbaren Header", () => {
    render(<SpecialCoatsDesktopTable />);

    const speciesHeader = screen.getByText("SpecialCoats.species");
    fireEvent.click(speciesHeader);

    expect(mockToggleSort).toHaveBeenCalledWith("name");
  });

  test("triggert setSelectedSpecialCoat beim Klick auf eine Zeile", () => {
    render(<SpecialCoatsDesktopTable />);

    const rowCell = screen.getByText("Polarfuchs");
    fireEvent.click(rowCell);

    expect(mockSetSelectedSpecialCoat).toHaveBeenCalledWith(mockSpecialCoats[0]);
  });
});
