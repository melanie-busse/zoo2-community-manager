import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import SpecialCoatCard from "./SpecialCoatCard";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/utils/DateUtil", () => ({
  formatLocaleDate: vi.fn(() => "01.06.2026"),
}));

const mockPush = vi.fn();
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/ui/badges/SpecialCoatBadge", () => ({
  default: ({ displayName }: { displayName: string }) => (
    <div data-testid="special-coat-badge">{displayName}</div>
  ),
}));

vi.mock("./AnimalDetails.styles", () => ({
  StyledSpecialCoatCard: ({ children, title, onClick }: any) => (
    <div data-testid="coat-card" title={title} onClick={onClick}>
      {children}
    </div>
  ),
  SpecialCoatName: ({ children }: any) => <span data-testid="coat-name">{children}</span>,
  ReleaseDate: ({ children }: any) => <div data-testid="release-date">{children}</div>,
  OriginContainer: ({ children }: any) => <div data-testid="origin-container">{children}</div>,
  OriginRowSpecialCoat: ({ children, title }: any) => (
    <div data-testid="origin-row" title={title}>
      {children}
    </div>
  ),
}));

const mockCoat = {
  id: 50,
  image: "albino.png",
  releaseDate: "2026-06-01",
  specialcoatstext: [{ name: "Albino-Fuchs", languageCode: "de", color: "Weiß" }],
  specialcoatsorigin: [
    { origin: { id: 1, name: "Magische Truhe", image: "chest.png" } },
    { origin: { id: 2, name: "Shop", image: "shop.png" } },
  ],
} as any;

describe("SpecialCoatCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("zeigt den Namen der Farbvariante aus specialcoatstext an", () => {
    render(<SpecialCoatCard specialCoat={mockCoat} />);

    expect(screen.getByTestId("coat-name")).toHaveTextContent("Albino-Fuchs");
    expect(screen.getByTestId("coat-card")).toHaveAttribute("title", "Albino-Fuchs");
  });

  test("zeigt das formatierte Release-Datum an", () => {
    render(<SpecialCoatCard specialCoat={mockCoat} />);

    expect(screen.getByTestId("release-date")).toHaveTextContent("01.06.2026");
  });

  test("rendert ein SpecialCoatBadge mit dem korrekten Namen", () => {
    render(<SpecialCoatCard specialCoat={mockCoat} />);

    expect(screen.getByTestId("special-coat-badge")).toHaveTextContent("Albino-Fuchs");
  });

  test("rendert Origin-Bilder, wenn Origins vorhanden sind", () => {
    render(<SpecialCoatCard specialCoat={mockCoat} />);

    expect(screen.getByTestId("origin-container")).toBeInTheDocument();
    const originRows = screen.getAllByTestId("origin-row");
    expect(originRows).toHaveLength(2);
    expect(originRows[0]).toHaveAttribute("title", "Magische Truhe");
    expect(originRows[1]).toHaveAttribute("title", "Shop");
  });

  test("rendert keinen Origin-Container, wenn keine Origins vorhanden sind", () => {
    const coatWithoutOrigins = { ...mockCoat, specialcoatsorigin: [] };

    render(<SpecialCoatCard specialCoat={coatWithoutOrigins} />);

    expect(screen.queryByTestId("origin-container")).not.toBeInTheDocument();
  });

  test("zeigt '---' als Release-Datum, wenn kein Datum vorhanden ist", () => {
    const coatWithoutDate = { ...mockCoat, releaseDate: null };

    render(<SpecialCoatCard specialCoat={coatWithoutDate} />);

    expect(screen.getByTestId("release-date")).toHaveTextContent("---");
  });

  test("navigiert zur SpecialCoat-Detailseite beim Klick auf die Karte", () => {
    render(<SpecialCoatCard specialCoat={mockCoat} />);

    screen.getByTestId("coat-card").click();

    expect(mockPush).toHaveBeenCalledWith("/specialcoats/50");
  });

  test("zeigt einen leeren Namen, wenn specialcoatstext fehlt", () => {
    const coatWithoutText = { ...mockCoat, specialcoatstext: [] };

    render(<SpecialCoatCard specialCoat={coatWithoutText} />);

    expect(screen.getByTestId("coat-name")).toHaveTextContent("");
  });
});
