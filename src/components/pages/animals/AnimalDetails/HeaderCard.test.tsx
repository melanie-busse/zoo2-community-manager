import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useAnimalStore } from "@/store/useAnimalStore";
import HeaderCard from "./HeaderCard";

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/utils/BiomeUtil", () => ({
  getShelterImage: vi.fn(() => ({ path: "/shelter.png", alt: "Shelter", name: "Shelter" })),
}));

vi.mock("@/components/ui/Formatted/FormattedDate", () => ({
  default: ({ date }: { date: any }) => <span data-testid="release-date">{String(date)}</span>,
}));

vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value, type }: { value: number; type: string }) => (
    <div data-testid={`price-badge-${type.toLowerCase()}`}>Price: {value}</div>
  ),
}));

vi.mock("@/components/ui/badges/PopularityBadge", () => ({
  default: ({ popularity }: { popularity: number }) => (
    <div data-testid="popularity-badge">Popularity: {popularity}</div>
  ),
}));

vi.mock("@/components/ui/badges/XPBadge", () => ({
  default: ({ label }: { label: any }) => <div data-testid="xp-badge">XP: {label}</div>,
}));

vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: () => <div data-testid="shelter-level-badge">ShelterLevel</div>,
}));

vi.mock("@/components/ui/badges/GameBadge", () => ({
  default: () => <div data-testid="game-badge">GameBadge</div>,
}));

vi.mock("@/components/ui/badges/ImageBadge", () => ({
  default: () => <img data-testid="image-badge" alt="Animal" src="/placeholder.png" />,
}));

vi.mock("@/components/page-structure/Elements/OriginBadgeList", () => ({
  default: () => <div data-testid="origin-badge-list">Origins</div>,
}));

vi.mock("@/components/page-structure/Elements/StatBox", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("./AnimalDetails.styles", () => ({
  DesktopCardContainer: ({ children }: any) => <div data-testid="header-card">{children}</div>,
  ImageWrapper: ({ children }: any) => <div>{children}</div>,
  InfoSection: ({ children }: any) => <div>{children}</div>,
  TitleRow: ({ children }: any) => <div>{children}</div>,
  TextContent: ({ children }: any) => <div>{children}</div>,
  TitleHeadlineRow: ({ children }: any) => <div>{children}</div>,
  OriginRow: ({ children }: any) => <div>{children}</div>,
  ReleaseDate: ({ children }: any) => <div>{children}</div>,
  StatsGrid: ({ children }: any) => <div>{children}</div>,
  StatsGroup: ({ children }: any) => <div>{children}</div>,
  EnclosureBox: ({ children }: any) => <div>{children}</div>,
}));

const mockAnimal = {
  id: 1,
  releaseDate: "2026-03-07",
  price: 5000,
  sellingPrice: 1000,
  popularity: 150,
  releaseExp: 250,
  shelterLevel: 3,
  priceType: { name: "Diamond" },
  biome: { identifier: "grassland", name: "Grasland" },
  animaltext: [{ animalName: "Erdmännchen" }],
};

describe("HeaderCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert nichts, wenn kein Tier im Store ist", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: null } as any),
    );

    const { container } = render(<HeaderCard />);

    expect(container).toBeEmptyDOMElement();
  });

  test("rendert den Tiernamen als h1", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<HeaderCard />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Erdmännchen");
  });

  test("rendert das Release-Datum via FormattedDate", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<HeaderCard />);

    expect(screen.getByTestId("release-date")).toHaveTextContent("2026-03-07");
  });

  test("rendert Diamond-PriceBadge für priceType 'Diamond'", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<HeaderCard />);

    expect(screen.getByTestId("price-badge-diamond")).toHaveTextContent("5000");
  });

  test("rendert Zoodollar-PriceBadge für priceType != 'Diamond'", () => {
    const zoodollarAnimal = { ...mockAnimal, priceType: { name: "Zoodollar" } };
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: zoodollarAnimal } as any),
    );

    render(<HeaderCard />);

    // Kaufpreis wird als Zoodollar gerendert
    const zoodollarBadges = screen.getAllByTestId("price-badge-zoodollar");
    expect(zoodollarBadges.length).toBeGreaterThanOrEqual(1);
  });

  test("rendert PopularityBadge mit dem korrekten Wert", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<HeaderCard />);

    expect(screen.getByTestId("popularity-badge")).toHaveTextContent("150");
  });

  test("rendert XPBadge mit dem Release-XP-Wert", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<HeaderCard />);

    expect(screen.getByTestId("xp-badge")).toHaveTextContent("250");
  });

  test("rendert OriginBadgeList und ImageBadge", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<HeaderCard />);

    expect(screen.getByTestId("origin-badge-list")).toBeInTheDocument();
    expect(screen.getByTestId("image-badge")).toBeInTheDocument();
  });
});