import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@/utils/test-utils";

import ZooStatisticCard from "./ZooStatisticCard";
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
vi.mock("@/components/ui/badges/BiomeBadge", () => ({
  default: () => <div data-testid="biome-badge" />,
}));
vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value, type }: { value: number; type: string }) => (
    <div data-testid={`price-badge-${type}`}>{value}</div>
  ),
}));
vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: ({ level }: { level: number }) => <div data-testid={`shelter-${level}`} />,
}));
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return { ...actual, useTranslations: () => (key: string) => key };
});

const mockStat: BiomeStatistic = {
  biomeId: 1,
  biomeName: "Grasland",
  biomeIdentifier: "grassland",
  region: "Hauptzoo",
  totalAnimals: 30,
  animalsForZoodollar: 20,
  animalsForDiamond: 10,
  totalSpecialCoats: 15,
  shelterLevelCounts: { 0: 2, 1: 7, 2: 14, 3: 7 },
  contestStatues: 5,
  contestSpecialCoats: 12,
};

describe("ZooStatisticCard", () => {
  test("zeigt den Biom-Namen an", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByText("Grasland")).toBeInTheDocument();
  });

  test("zeigt die Region an", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByText("Hauptzoo")).toBeInTheDocument();
  });

  test("zeigt keine Region wenn null", () => {
    render(<ZooStatisticCard stat={{ ...mockStat, region: null }} />);
    expect(screen.queryByText("Hauptzoo")).not.toBeInTheDocument();
  });

  test("zeigt Gesamtzahl der Tiere an", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  test("zeigt Zoodollar- und Diamanten-Verteilung an", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByTestId("price-badge-Zoodollar")).toHaveTextContent("20");
    expect(screen.getByTestId("price-badge-Diamond")).toHaveTextContent("10");
  });

  test("zeigt Gesamtzahl der Farbvarianten an", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  test("rendert alle 4 Stalllevel-Badges", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByTestId("shelter-0")).toBeInTheDocument();
    expect(screen.getByTestId("shelter-1")).toBeInTheDocument();
    expect(screen.getByTestId("shelter-2")).toBeInTheDocument();
    expect(screen.getByTestId("shelter-3")).toBeInTheDocument();
  });

  test("zeigt Wettbewerbstiere und Statuen an", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  test("zeigt die Anzahl pro Stalllevel an", () => {
    render(<ZooStatisticCard stat={mockStat} />);
    expect(screen.getByText("× 2")).toBeInTheDocument();
    expect(screen.getAllByText("× 7")).toHaveLength(2);
    expect(screen.getByText("× 14")).toBeInTheDocument();
  });
});