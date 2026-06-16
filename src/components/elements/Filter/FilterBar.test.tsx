import { vi } from "vitest";

// 1. Next.js Google Fonts mocken, BEVOR das Theme geladen wird
vi.mock("next/font/google", () => ({
  Sedgwick_Ave_Display: () => ({ style: { fontFamily: "sans-serif" } }),
  DM_Sans: () => ({ style: { fontFamily: "sans-serif" } }),
  Playfair_Display: () => ({ style: { fontFamily: "serif" } }),
}));

import React from "react";
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import FilterBar from "./FilterBar";
import { theme } from "@/styles/theme";

// 1. Die Next.js Navigation-Mocks erstellen
const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/animals",
  useSearchParams: () => mockSearchParams,
}));

// 2. next-intl mocken
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock-Daten für Tiere vorbereiten
const mockAnimalsForFilter = [
  {
    id: 1,
    shelterLevel: 2,
    biome: { id: 10, name: "Desert", biomestext: [{ biomeName: "Wüste" }] },
  } as any,
];

describe("FilterBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams(); // Suchparameter vor jedem Test zurücksetzen
  });

  test("aktualisiert die URL-Parameter, wenn der User einen Suchbegriff eingibt", () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterBar animals={mockAnimalsForFilter} />
      </ThemeProvider>,
    );

    // Das Inputfeld über den Übersetzungs-Key des Placeholders finden
    const searchInput = screen.getByPlaceholderText("Filter.search_placeholder");

    // "Löwe" in das Feld eintippen
    fireEvent.change(searchInput, { target: { value: "Löwe" } });

    // Prüfen, ob router.push mit der korrekten URL aufgerufen wurde
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/animals?search=L%C3%B6we&page=1", { scroll: false });
  });

  test("aktualisiert die URL-Parameter, wenn ein Biome ausgewählt wird", () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterBar animals={mockAnimalsForFilter} />
      </ThemeProvider>,
    );

    // 1. Das Dropdown-Header-Element für Gehege öffnen
    const biomeDropdownHeader = screen.getByText("Filter.all_enclosures");
    fireEvent.click(biomeDropdownHeader);

    // 2. Nach "Wüste" suchen, da getBiomeName() das aus biomestext extrahiert
    const biomeOption = screen.getByText("Wüste");
    fireEvent.click(biomeOption);

    // 3. Prüfen, ob der Filter den ermittelten Namen in die URL packt
    expect(mockPush).toHaveBeenCalledWith("/animals?biome=W%C3%BCste&page=1", { scroll: false });
  });

  test("liest bestehende URL-Parameter aus und befüllt die Filter-Inputs", () => {
    // URL mit bestehenden Filtern simulieren
    mockSearchParams = new URLSearchParams("search=Erdmännchen&biome=Desert");

    render(
      <ThemeProvider theme={theme}>
        <FilterBar animals={mockAnimalsForFilter} />
      </ThemeProvider>,
    );

    const searchInput = screen.getByPlaceholderText(
      "Filter.search_placeholder",
    ) as HTMLInputElement;

    // Das Feld muss den Wert aus der URL enthalten
    expect(searchInput.value).toBe("Erdmännchen");
  });

  test("aktualisiert die URL-Parameter, wenn ein Shelter-Level ausgewählt wird", () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterBar animals={mockAnimalsForFilter} />
      </ThemeProvider>,
    );

    // 1. Das Dropdown-Header-Element für die Level öffnen
    // Da standardmäßig nichts ausgewählt ist, greift der All-Label-Key "Filter.all_levels"
    const levelDropdownHeader = screen.getByText("Filter.all_levels");
    fireEvent.click(levelDropdownHeader);

    // 2. Das Level-Item auswählen
    // Unser mockAnimalsForFilter hat "shelterLevel: 2". Die Komponente gibt das als Text "2" aus.
    const levelOption = screen.getByText("2");
    fireEvent.click(levelOption);

    // 3. Prüfen, ob der Level-Parameter korrekt an den Router übergeben wird
    expect(mockPush).toHaveBeenCalledWith("/animals?level=2&page=1", { scroll: false });
  });
});
