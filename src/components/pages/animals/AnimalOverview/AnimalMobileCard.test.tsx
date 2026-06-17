import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { useSession } from "next-auth/react";
import AnimalMobileCard from "./AnimalMobileCard";
import { theme } from "@/styles/theme";

// 1. Google Fonts mocken, um Ladefehler im JSDOM zu verhindern
vi.mock("next/font/google", () => ({
  Sedgwick_Ave_Display: () => ({ className: "mock-sedgwick", style: {} }),
  DM_Sans: () => ({ className: "mock-dm-sans", style: {} }),
  Playfair_Display: () => ({ className: "mock-playfair", style: {} }),
}));

// 2. NextAuth Client-Hook mocken
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

// 3. Kind-Komponenten mocken, um next-intl / useTranslations komplett zu umgehen
vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: () => <div data-testid="action-group-badge">Admin Actions</div>,
}));
vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value }: { value: number }) => <div>Preis: {value}</div>,
}));
vi.mock("@/components/ui/badges/GameBadge", () => ({
  default: () => <div data-testid="game-badge">GameBadge</div>,
}));
vi.mock("@/components/ui/badges/BiomeBadge", () => ({
  default: () => <div data-testid="biome-badge">BiomeBadge</div>,
}));
vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: ({ level }: { level: number }) => (
    <div data-testid="shelter-badge">Stall Level: {level}</div>
  ),
}));

describe("AnimalMobileCard", () => {
  const mockAnimal = {
    id: 1,
    name: "Löwe",
    price: 1500,
    shelterLevel: 4,
    priceType: { name: "Zoodollar" },
    biome: { identifier: "savanna", biomestext: [{ biomeName: "Savanne" }] },
    animaltext: [{ animalName: "Löwe" }],
  } as any;

  const mockOnClick = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert die Standard-Inhalte (Name, Preis) für einen normalen User und versteckt Admin-Buttons", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: "Spieler1", role: "Member" } },
      status: "authenticated",
    } as any);

    render(
      <ThemeProvider theme={theme as any}>
        <AnimalMobileCard
          animal={mockAnimal}
          onClickAction={mockOnClick}
          onEditAction={mockOnEdit}
          onDeleteAction={mockOnDelete}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Löwe")).toBeInTheDocument();
    expect(screen.getByText("Preis: 1500")).toBeInTheDocument();
    expect(screen.queryByTestId("action-group-badge")).not.toBeInTheDocument();
  });

  test("zeigt die Admin-Buttons (ActionGroupBadge) an, wenn der User ein 'Director' ist", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: "Chef-Admin", role: "Director" } },
      status: "authenticated",
    } as any);

    render(
      <ThemeProvider theme={theme as any}>
        <AnimalMobileCard
          animal={mockAnimal}
          onClickAction={mockOnClick}
          onEditAction={mockOnEdit}
          onDeleteAction={mockOnDelete}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("action-group-badge")).toBeInTheDocument();
  });

  test("löst onClickAction aus, wenn auf die Karte geklickt wird", () => {
    vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated" } as any);

    render(
      <ThemeProvider theme={theme as any}>
        <AnimalMobileCard
          animal={mockAnimal}
          onClickAction={mockOnClick}
          onEditAction={mockOnEdit}
          onDeleteAction={mockOnDelete}
        />
      </ThemeProvider>,
    );

    const cardText = screen.getByText("Löwe");
    fireEvent.click(cardText);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
