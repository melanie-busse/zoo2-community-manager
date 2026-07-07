import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatHeaderCard from "./SpecialCoatHeaderCard";

vi.mock("@/store/useSpecialCoatStore", () => ({
  useSpecialCoatStore: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/components/pages/animals/AnimalDetails/AnimalDetails.styles", () => ({
  DesktopCardContainer: ({ children }: any) => <div>{children}</div>,
  ImageWrapper: ({ children }: any) => <div>{children}</div>,
  InfoSection: ({ children }: any) => <div>{children}</div>,
  TitleRow: ({ children }: any) => <div>{children}</div>,
  TextContent: ({ children }: any) => <div>{children}</div>,
  TitleHeadlineRow: ({ children }: any) => <div>{children}</div>,
  OriginRow: ({ children }: any) => <div>{children}</div>,
  ReleaseDate: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/badges/OriginBadge", () => ({
  default: () => <div data-testid="origin-badge">OriginBadge</div>,
}));

vi.mock("@/components/ui/tooltip/Tooltip", () => ({
  default: ({ children, text }: any) => <div title={text}>{children}</div>,
}));

vi.mock("@/components/ui/Formatted/FormattedDate", () => ({
  default: ({ date }: { date: any }) => <span data-testid="release-date">{String(date)}</span>,
}));

const mockSpecialCoat = {
  id: 7,
  image: "albino.png",
  releaseDate: "2026-06-01",
  specialcoatstext: [{ languageCode: "de", name: "Albino", color: "Weiß" }],
  specialcoatsorigin: [
    { id: 1, specialCoatId: 7, originId: 2, origin: { id: 2, name: "Shop", image: "shop.webp" } },
    { id: 2, specialCoatId: 7, originId: 3, origin: { id: 3, name: "Event", image: "event.webp" } },
  ],
} as any;

describe("SpecialCoatHeaderCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert null, wenn kein SpecialCoat im Store ist", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: null } as any),
    );

    const { container } = render(<SpecialCoatHeaderCard />);

    expect(container).toBeEmptyDOMElement();
  });

  test("zeigt den Namen der Farbvariante als Überschrift", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: mockSpecialCoat } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Albino");
  });

  test("zeigt die Farbe der Farbvariante an", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: mockSpecialCoat } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.getByText("Weiß")).toBeInTheDocument();
  });

  test("zeigt das Release-Datum an", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: mockSpecialCoat } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.getByTestId("release-date")).toHaveTextContent("2026-06-01");
  });

  test("rendert einen OriginBadge pro Herkunft", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: mockSpecialCoat } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.getAllByTestId("origin-badge")).toHaveLength(2);
  });

  test("zeigt den Tooltip-Text der Herkunft", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: mockSpecialCoat } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.getByTitle("Shop")).toBeInTheDocument();
    expect(screen.getByTitle("Event")).toBeInTheDocument();
  });

  test("nutzt das Placeholder-Bild, wenn kein Bild gesetzt ist", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({
        selectedSpecialCoat: { ...mockSpecialCoat, image: null },
      } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/placeholder.jpg");
  });

  test("baut den korrekten Bildpfad auf", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: mockSpecialCoat } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/specialCoat/albino.png");
  });

  test("zeigt keine Farbanzeige, wenn die Farbe leer ist", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({
        selectedSpecialCoat: {
          ...mockSpecialCoat,
          specialcoatstext: [{ languageCode: "de", name: "Albino", color: "" }],
        },
      } as any),
    );

    render(<SpecialCoatHeaderCard />);

    expect(screen.queryByText(/SpecialCoat\.color/)).not.toBeInTheDocument();
  });
});