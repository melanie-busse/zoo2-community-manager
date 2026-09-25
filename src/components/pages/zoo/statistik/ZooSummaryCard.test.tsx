import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@/utils/test-utils";

import ZooSummaryCard from "./ZooSummaryCard";
import { BiomeStatistic } from "@/types/zooStatistic";

vi.mock("@/components/page-structure/Card/CardContainer", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardHeaderRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/page-structure/Card/CardDevider", () => ({ default: () => <hr /> }));
vi.mock("@/components/page-structure/Card/CardStatsRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value, type }: { value: number; type: string }) => (
    <div data-testid={`price-badge-${type}`}>{value}</div>
  ),
}));
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return { ...actual, useTranslations: () => (key: string) => key };
});

const makeStat = (overrides: Partial<BiomeStatistic> = {}): BiomeStatistic => ({
  biomeId: 1,
  biomeName: "Grasland",
  biomeIdentifier: "grassland",
  region: "Hauptzoo",
  totalAnimals: 10,
  animalsForZoodollar: 6,
  animalsForDiamond: 4,
  totalSpecialCoats: 5,
  shelterLevelCounts: { 0: 1, 1: 2, 2: 3, 3: 4 },
  contestStatues: 2,
  contestSpecialCoats: 3,
  ...overrides,
});

const mockStats: BiomeStatistic[] = [
  makeStat({ biomeId: 1, totalAnimals: 10, animalsForZoodollar: 6, animalsForDiamond: 4, totalSpecialCoats: 5, shelterLevelCounts: { 0: 1, 1: 2, 2: 3, 3: 4 }, contestStatues: 2, contestSpecialCoats: 3 }),
  makeStat({ biomeId: 2, totalAnimals: 20, animalsForZoodollar: 14, animalsForDiamond: 6, totalSpecialCoats: 8, shelterLevelCounts: { 0: 2, 1: 4, 2: 6, 3: 8 }, contestStatues: 5, contestSpecialCoats: 7 }),
];

describe("ZooSummaryCard", () => {
  test("zeigt die Anzahl der Biome an", () => {
    render(<ZooSummaryCard biomeStatistics={mockStats} />);
    expect(screen.getByText("summary.biomes")).toBeInTheDocument();
  });

  test("zeigt die Anzahl eindeutiger Regionen an", () => {
    const stats = [
      makeStat({ biomeId: 1, region: "Hauptzoo" }),
      makeStat({ biomeId: 2, region: "Hauptzoo" }),
      makeStat({ biomeId: 3, region: "FirGrove" }),
      makeStat({ biomeId: 4, region: null }),
    ];
    render(<ZooSummaryCard biomeStatistics={stats} />);
    expect(screen.getByText("summary.regions")).toBeInTheDocument();
  });

  test("summiert Gesamtzahl der Tiere korrekt", () => {
    render(<ZooSummaryCard biomeStatistics={mockStats} />);
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  test("summiert Gesamtzahl der Farbvarianten korrekt", () => {
    render(<ZooSummaryCard biomeStatistics={mockStats} />);
    expect(screen.getByText("13")).toBeInTheDocument();
  });

  test("summiert Zoodollar- und Diamanten-Tiere korrekt", () => {
    render(<ZooSummaryCard biomeStatistics={mockStats} />);
    expect(screen.getByTestId("price-badge-Zoodollar")).toHaveTextContent("20");
    expect(screen.getByTestId("price-badge-Diamond")).toHaveTextContent("10");
  });

  test("summiert Wettbewerbstiere korrekt", () => {
    render(<ZooSummaryCard biomeStatistics={mockStats} />);
    const label = screen.getByText("contest.contestAnimals");
    expect(label.nextElementSibling).toHaveTextContent("10");
  });

  test("summiert Statuen korrekt", () => {
    render(<ZooSummaryCard biomeStatistics={mockStats} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  test("summiert Stalllevel-Counts korrekt", () => {
    render(<ZooSummaryCard biomeStatistics={mockStats} />);
    // Level 0: 1+2=3, Level 1: 2+4=6, Level 2: 3+6=9, Level 3: 4+8=12
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  test("funktioniert mit leerem Array", () => {
    render(<ZooSummaryCard biomeStatistics={[]} />);
    expect(screen.getByText("summary.biomes")).toBeInTheDocument();
  });
});