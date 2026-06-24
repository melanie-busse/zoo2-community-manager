import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import HomeView from "@/components/pages/Home/HomeViex";

vi.mock("./HomeView.styles", () => ({
  FullPageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HeroSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ContentWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StatsBar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StatItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Icon: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  ActionGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  // 💡 WICHTIG: Wir mappen MenuCard auf ein echtes <a> Tag, damit hrefs sauber geprüft werden können
  MenuCard: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("HomeView", () => {
  const mockStats = {
    tierCount: 142,
    specialCoatCount: 35,
    habitatCount: 12,
  };

  const mockT = {
    stats_animals: "Tiere",
    stats_specialCoat: "Farbvarianten",
    stats_biomes: "Gehege",
    stats_regions: "Regionen",
    cards_lexicon_title: "Tierlexikon",
    cards_lexicon_text: "Alle Tiere im Blick",
    cards_specialCoat_title: "Farbvarianten",
    cards_specialCoat_text: "Züchte seltene Farben",
    cards_club_title: "Klub-Manager",
    cards_club_text: "Verwalte deine Mitglieder",
  };

  test("rendert die Hauptüberschrift und alle Statistiken korrekt", () => {
    render(<HomeView stats={mockStats} t={mockT} />);

    // Hauptüberschrift prüfen
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Zoo 2: Animal Park/i);

    // Dynamische Stats prüfen
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("Tiere")).toBeInTheDocument();

    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getAllByText("Farbvarianten")).toHaveLength(2);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Gehege")).toBeInTheDocument();

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("Regionen")).toBeInTheDocument();
  });

  test("rendert die Menükarten mit den korrekten Links (hrefs)", () => {
    render(<HomeView stats={mockStats} t={mockT} />);

    const lexiconHeading = screen.getByRole("heading", { name: "Tierlexikon" });
    const lexiconLink = lexiconHeading.closest("a");
    expect(lexiconLink).toHaveAttribute("href", "/AnimalOverview");

    const variantenHeading = screen.getByRole("heading", { name: "Farbvarianten" });
    const variantenLink = variantenHeading.closest("a");
    expect(variantenLink).toHaveAttribute("href", "/varianten");

    const klubHeading = screen.getByRole("heading", { name: "Klub-Manager" });
    const klubLink = klubHeading.closest("a");
    expect(klubLink).toHaveAttribute("href", "/klub");
  });
});
