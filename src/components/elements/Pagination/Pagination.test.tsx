import { vi } from "vitest";

// 1. Next.js Google Fonts mocken, BEVOR das Theme geladen wird
vi.mock("next/font/google", () => ({
  Sedgwick_Ave_Display: () => ({ style: { fontFamily: "sans-serif" } }),
  DM_Sans: () => ({ style: { fontFamily: "sans-serif" } }),
  Playfair_Display: () => ({ style: { fontFamily: "serif" } }),
}));

import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Pagination from "./Pagination";
import { theme } from "@/styles/theme";

// next-intl mocken, damit die Tooltip-Texte als String zurückkommen
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Wir mocken die Tooltip-Komponente, um den Test schlank zu halten
// So testen wir wirklich nur die Buttons und die Anzeige der Pagination selbst
vi.mock("@/components/ui/tooltip/Tooltip", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Pagination", () => {
  test("rendert die Seitenzahlen korrekt und sperrt 'Zurück' auf der ersten Seite", () => {
    render(
      <ThemeProvider theme={theme as any}>
        <Pagination currentPage={1} totalPages={5} onNext={vi.fn()} onPrev={vi.fn()} />
      </ThemeProvider>,
    );

    // 1. Prüfen, ob die Anzeige "1 / 5" im DOM existiert (sucht flexibel über Elementgrenzen hinweg)
    expect(
      screen.getByText((content, element) => {
        const hasText = (node: Element | null) => node?.textContent?.replace(/\s+/g, "") === "1/5";
        const childrenDontHaveText = Array.from(element?.children || []).every(
          (child) => !hasText(child),
        );
        return hasText(element) && childrenDontHaveText;
      }),
    ).toBeInTheDocument();

    // 2. Buttons anhand ihrer Styled-Components-Rollen/Attribute finden
    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    // 3. Auf Seite 1 muss der Zurück-Button disabled sein, der Weiter-Button nicht
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test("ruft onNext und onPrev auf, wenn sich der User auf einer mittleren Seite befindet", () => {
    const onNextMock = vi.fn();
    const onPrevMock = vi.fn();

    render(
      <ThemeProvider theme={theme as any}>
        <Pagination currentPage={3} totalPages={5} onNext={onNextMock} onPrev={onPrevMock} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    // Beide Buttons müssen auf Seite 3 klickbar sein
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // Klicks simulieren
    fireEvent.click(prevButton);
    expect(onPrevMock).toHaveBeenCalledTimes(1);

    fireEvent.click(nextButton);
    expect(onNextMock).toHaveBeenCalledTimes(1);
  });

  test("sperrt den 'Weiter'-Button auf der letzten Seite", () => {
    render(
      <ThemeProvider theme={theme as any}>
        <Pagination currentPage={5} totalPages={5} onNext={vi.fn()} onPrev={vi.fn()} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    // Auf der letzten Seite muss Weiter disabled sein, Zurück aktiv
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});
