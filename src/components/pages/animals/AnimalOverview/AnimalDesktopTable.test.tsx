import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import AnimalDesktopTable from "./AnimalDesktopTable";
import { Animal } from "@/types/animal";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";

// 1. next-intl mocken: Jetzt mit useTranslations UND useLocale
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "de", // Gibt einfach standardmäßig "de" für Deutsch zurück
}));

// 2. next-auth mocken: Eine Dummy-Session zurückgeben, damit useSession() nicht abstürzt
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { name: "Test User", role: "Director" } },
    status: "authenticated",
  }),
}));

// Next.js Google Fonts mocken, damit das Theme nicht abstürzt
vi.mock("next/font/google", () => ({
  Sedgwick_Ave_Display: () => ({ className: "mock-sedgwick", style: {} }),
  DM_Sans: () => ({ className: "mock-dm-sans", style: {} }),
  Playfair_Display: () => ({ className: "mock-playfair", style: {} }),
}));

// Die CurrencyBadge komplett mocken, damit sie im Test nicht abstürzt
vi.mock("@/components/ui/badges/CurrencyBadge", () => ({
  // Falls es ein Default-Export ist:
  default: ({ value }: { value: number }) => <span>{value}</span>,
  // Falls es ein Named-Export ist, nutze stattdessen:
  // CurrencyBadge: ({ value }: { value: number }) => <span>{value}</span>,
}));

// Ein paar Mock-Daten für den Test definieren
const mockAnimals = [
  {
    id: 1,
    price: 500, // Von sellingPrice auf price geändert
    priceType: {
      name: "COINS", // Damit animal.priceType?.name existiert!
    },
    biome: {
      id: 1,
      name: "Grassland",
    },
    animaltext: [{ animalName: "Löwe" }],
  },
  {
    id: 2,
    price: 1200, // Von sellingPrice auf price geändert
    priceType: {
      name: "COINS",
    },
    biome: {
      id: 2,
      name: "Savanna",
    },
    animaltext: [],
  },
] as unknown as Animal[];

const defaultProps = {
  sortBy: "name",
  sortDirection: "asc" as const, // 'as const' sorgt dafür, dass TS den String exakt matcht
  onSort: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("AnimalDesktopTable", () => {
  test("rendert den Tiernamen, wenn er vorhanden ist", () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={[mockAnimals[0]]} {...defaultProps} />
      </ThemeProvider>,
    );

    expect(screen.getByText("Löwe")).toBeInTheDocument();
  });

  test("fängt leere animaltext-Arrays ab und zeigt den Fallback-Text", () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={[mockAnimals[1]]} {...defaultProps} />
      </ThemeProvider>,
    );

    expect(screen.getByText("Kein Name vorhanden")).toBeInTheDocument();
  });

  test("zeigt den korrekten Verkaufspreis an", () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={[mockAnimals[0]]} {...defaultProps} />
      </ThemeProvider>,
    );

    expect(screen.getByText("500")).toBeInTheDocument();
  });

  test("ruft onDelete mit der korrekten ID auf, wenn der Lösch-Button geklickt wird", () => {
    const onDeleteMock = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={[mockAnimals[0]]} {...defaultProps} onDelete={onDeleteMock} />
      </ThemeProvider>,
    );

    // Da config.defaultAlt für das Trash-Icon "Delete" ist, suchen wir genau danach:
    const deleteButton = screen.getByRole("button", { name: "Delete" });

    // Den Klick ausführen
    fireEvent.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    // Da die Props eurer Tabelle (id: string) verlangen, übergeben wir die ID als String
    expect(onDeleteMock).toHaveBeenCalledWith("1");
  });

  test("ruft onEdit mit der korrekten ID auf, wenn der Bearbeiten-Button geklickt wird", () => {
    // 1. Frischen Mock für die Edit-Funktion erstellen
    const onEditMock = vi.fn();

    // 2. Komponente rendern (mit unserem Zoo-Direktor in der Session)
    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={[mockAnimals[0]]} {...defaultProps} onEdit={onEditMock} />
      </ThemeProvider>,
    );

    // 3. Den Bearbeiten-Button über sein Alt-Text-Label "Edit" greifen
    const editButton = screen.getByRole("button", { name: "Edit" });

    // 4. Klick simulieren
    fireEvent.click(editButton);

    // 5. Assertions: Wurde es einmal und mit der String-ID aufgerufen?
    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith("1");
  });

  test("ruft onSort mit 'name' auf, wenn der Spaltenkopf für die Spezies geklickt wird", () => {
    // 1. Frischen Mock für die Sortier-Funktion erstellen
    const onSortMock = vi.fn();

    // 2. Tabelle rendern
    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={mockAnimals} {...defaultProps} onSort={onSortMock} />
      </ThemeProvider>,
    );

    // 3. Den Spaltenkopf anhand des Übersetzungstextes (Keys) finden
    const speciesHeader = screen.getByText("Animals.species");

    // 4. Klick auf den Spaltenkopf simulieren
    fireEvent.click(speciesHeader);

    // 5. Prüfen, ob die Funktion mit dem korrekten Sortier-Key gefeuert wurde
    expect(onSortMock).toHaveBeenCalledTimes(1);
    expect(onSortMock).toHaveBeenCalledWith("name");
  });

  test("ruft onSort mit 'price' auf, wenn der Spaltenkopf für den Preis geklickt wird", () => {
    const onSortMock = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={mockAnimals} {...defaultProps} onSort={onSortMock} />
      </ThemeProvider>,
    );

    const priceHeader = screen.getByText("Common.price");
    fireEvent.click(priceHeader);

    expect(onSortMock).toHaveBeenCalledTimes(1);
    expect(onSortMock).toHaveBeenCalledWith("price");
  });

  test("zeigt den Empty State mit Pfoten-Icon an, wenn das animals-Array leer ist", () => {
    // 1. Wir rendern die Tabelle bewusst mit einem leeren Array []
    render(
      <ThemeProvider theme={theme}>
        <AnimalDesktopTable animals={[]} {...defaultProps} />
      </ThemeProvider>,
    );

    // 2. Wir prüfen, ob der Übersetzungstext inklusive des Pfoten-Icons im DOM existiert
    const emptyStateText = screen.getByText(/EmptyState.title 🐾/i);
    expect(emptyStateText).toBeInTheDocument();

    // 3. Optionaler Bonus-Check: Sicherstellen, dass KEIN Tiername (wie "Löwe") fälschlicherweise gelistet wird
    const lionText = screen.queryByText("Löwe");
    expect(lionText).not.toBeInTheDocument();
  });
});
