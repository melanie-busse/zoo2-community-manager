import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import HomeView from "@/components/pages/Home/HomeViex";

// Wir mocken next/font/google wieder direkt am Anfang der Datei
vi.mock("next/font/google", () => ({
  Sedgwick_Ave_Display: () => ({ style: { fontFamily: "sans-serif" } }),
  DM_Sans: () => ({ style: { fontFamily: "sans-serif" } }),
  Playfair_Display: () => ({ style: { fontFamily: "serif" } }),
}));

describe("HomeView", () => {
  // 1. Mock-Daten vorbereiten
  const mockStats = {
    tierCount: 142,
    specialCoatCount: 35,
    habitatCount: 12,
  };

  // Ein einfaches Mock-Objekt für die Übersetzungen
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
    render(
      <ThemeProvider theme={theme as any}>
        <HomeView stats={mockStats} t={mockT} />
      </ThemeProvider>,
    );

    // Hauptüberschrift prüfen
    expect(screen.getByText(/Zoo 2: Animal Park/i)).toBeInTheDocument();

    // Dynamische Stats prüfen
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("Tiere")).toBeInTheDocument();

    expect(screen.getByText("35")).toBeInTheDocument();
    // GEÄNDERT: Da "Farbvarianten" 2x vorkommt (Stats & Card), nutzen wir getAllByText
    expect(screen.getAllByText("Farbvarianten")).toHaveLength(2);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Gehege")).toBeInTheDocument();

    // Hartcodierte Stat prüfen
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("Regionen")).toBeInTheDocument();
  });

  test("rendert die Menükarten mit den korrekten Links (hrefs)", () => {
    render(
      <ThemeProvider theme={theme as any}>
        <HomeView stats={mockStats} t={mockT} />
      </ThemeProvider>,
    );

    // Menükarten anhand ihrer Titel prüfen
    expect(screen.getByText("Tierlexikon")).toBeInTheDocument();
    expect(screen.getByText("Alle Tiere im Blick")).toBeInTheDocument();

    // Links (hrefs) überprüfen. Da MenuCard wahrscheinlich auf next/link oder einem <a> basiert,
    // suchen wir nach der Rolle "link" und filtern über den Text
    const lexiconLink = screen.getByRole("link", { name: /🐾 Tierlexikon Alle Tiere im Blick/i });
    expect(lexiconLink).toHaveAttribute("href", "/AnimalOverview");

    const variantenLink = screen.getByRole("link", {
      name: /🎨 Farbvarianten Züchte seltene Farben/i,
    });
    expect(variantenLink).toHaveAttribute("href", "/varianten");

    const klubLink = screen.getByRole("link", {
      name: /🏆 Klub-Manager Verwalte deine Mitglieder/i,
    });
    expect(klubLink).toHaveAttribute("href", "/klub");
  });
});
