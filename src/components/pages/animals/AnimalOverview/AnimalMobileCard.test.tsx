import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSession } from "next-auth/react";

import AnimalMobileCard from "./AnimalMobileCard";

vi.mock("@/components/page-structure/Card/CardContainer", () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <div data-testid="card-container" onClick={onClick}>
      {children}
    </div>
  ),
}));
vi.mock("@/components/page-structure/Card/CardHeaderRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardDevider", () => ({ default: () => <hr /> }));
vi.mock("@/components/page-structure/Card/CardStatsRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardPriceRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardIconsRow", () => ({
  CardIconsRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../../page-structure/MobileView", () => ({}));

vi.mock("@/components/elements/Name/Name", () => ({
  Name: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mockPush,
      prefetch: vi.fn(),
      replace: vi.fn(),
    };
  },
}));

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

vi.mock("@/utils/AnimalUtil", () => ({ getAnimalImage: vi.fn() }));
vi.mock("@/utils/BiomeUtil", () => ({ getBiomeImage: vi.fn(), getShelterImage: vi.fn() }));

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert die Standard-Inhalte (Name, Preis) für einen normalen User und versteckt Admin-Buttons", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: "Spieler1", role: "Member" } },
      status: "authenticated",
    } as any);

    render(<AnimalMobileCard animal={mockAnimal} />);

    expect(screen.getByText("Löwe")).toBeInTheDocument();
    expect(screen.getByText("Preis: 1500")).toBeInTheDocument();
    expect(screen.queryByTestId("action-group-badge")).not.toBeInTheDocument();
  });

  test("zeigt die Admin-Buttons (ActionGroupBadge) an, wenn der User ein 'Director' ist", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: "Chef-Admin", role: "Director" } },
      status: "authenticated",
    } as any);

    render(<AnimalMobileCard animal={mockAnimal} />);

    expect(screen.getByTestId("action-group-badge")).toBeInTheDocument();
  });

  test("leitet den User beim Klick auf die Karte zur Detailseite weiter", () => {
    vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated" } as any);

    render(<AnimalMobileCard animal={mockAnimal} />);

    const card = screen.getByTestId("card-container");
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/animals/1");
  });
});
