import React from "react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import SpecialCoatsMobileCard from "./SpecialCoatsMobileCard";

const mockUseSession = vi.fn();
vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/components/page-structure/Card/CardContainer", () => ({
  default: ({ children, onClick }: any) => (
    <div data-testid="card-container" onClick={onClick}>
      {children}
    </div>
  ),
}));
vi.mock("@/components/page-structure/Card/CardHeaderRow", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardDevider", () => ({ default: () => <hr /> }));
vi.mock("@/components/page-structure/Card/CardStatsRow", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardPriceRow", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardIconsRow", () => ({
  CardIconsRow: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/elements/Name/Name", () => ({
  Name: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value, type }: any) => (
    <span>
      {value} {type}
    </span>
  ),
}));
vi.mock("@/components/ui/badges/GameBadge", () => ({ default: () => <span>[GameBadge]</span> }));
vi.mock("@/components/ui/badges/BiomeBadge", () => ({ default: () => <span>[BiomeBadge]</span> }));
vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: ({ level }: any) => <span>Level {level}</span>,
}));
vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: () => <button>AdminActions</button>,
}));

// 4. Utils stubs
vi.mock("@/utils/SpecialCoatUtil", () => ({ getSpecialCoatImage: vi.fn() }));
vi.mock("@/utils/BiomeUtil", () => ({ getBiomeImage: vi.fn(), getShelterImage: vi.fn() }));

const mockSpecialCoat = {
  id: 42,
  specialcoatstext: [{ color: "Saphirblau" }],
  animal: {
    animaltext: [{ animalName: "Pfau" }],
    price: 1500,
    priceType: { name: "Zoodollar" },
    shelterLevel: 2,
    biome: { identifier: "grassland" },
  },
} as any;

describe("SpecialCoatsMobileCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({ data: { user: { role: "User" } } });
  });

  test("sollte das Tier mit Namen, Farbe und Preis korrekt anzeigen", () => {
    render(<SpecialCoatsMobileCard specialCoat={mockSpecialCoat} />);

    expect(screen.getByText("Pfau")).toBeInTheDocument();
    expect(screen.getByText("Saphirblau -")).toBeInTheDocument();
    expect(screen.getByText("1500 Zoodollar")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();

    expect(screen.queryByText("AdminActions")).not.toBeInTheDocument();
  });

  test("sollte Admin-Aktionen einblenden, wenn der User ein 'Director' ist", () => {
    mockUseSession.mockReturnValue({ data: { user: { role: "Director" } } });

    render(<SpecialCoatsMobileCard specialCoat={mockSpecialCoat} />);

    expect(screen.getByText("AdminActions")).toBeInTheDocument();
  });

  test("sollte zur Detailseite navigieren, wenn man auf die Card klickt", () => {
    render(<SpecialCoatsMobileCard specialCoat={mockSpecialCoat} />);

    const card = screen.getByTestId("card-container");
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith("/specialcoat/42");
  });

  test("sollte null zurückgeben, wenn kein specialCoat vorhanden ist", () => {
    const { container } = render(<SpecialCoatsMobileCard specialCoat={null as any} />);
    expect(container.firstChild).toBeNull();
  });
});
