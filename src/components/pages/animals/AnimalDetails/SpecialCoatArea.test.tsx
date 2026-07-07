import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useAnimalStore } from "@/store/useAnimalStore";
import SpecialCoatArea from "./SpecialCoatArea";

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("./SpecialCoatCard", () => ({
  default: ({ specialCoat }: any) => (
    <div data-testid="special-coat-card">{specialCoat.id}</div>
  ),
}));

vi.mock("./AnimalDetails.styles", () => ({
  SectionHeadline: ({ children }: any) => (
    <h2 data-testid="section-headline">{children}</h2>
  ),
  SpecialCoatGrid: ({ children }: any) => (
    <div data-testid="coat-grid">{children}</div>
  ),
}));

const mockCoats = [
  { id: 50, specialcoatstext: [{ name: "Albino" }] },
  { id: 51, specialcoatstext: [{ name: "Melanist" }] },
];

describe("SpecialCoatArea", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert nichts, wenn das Tier keine Farbvarianten hat", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: { id: 1, specialcoat: [] } } as any),
    );

    const { container } = render(<SpecialCoatArea />);

    expect(container).toBeEmptyDOMElement();
  });

  test("rendert nichts, wenn kein Tier im Store ist", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: null } as any),
    );

    const { container } = render(<SpecialCoatArea />);

    expect(container).toBeEmptyDOMElement();
  });

  test("rendert die Section-Headline und das Grid, wenn Farbvarianten vorhanden sind", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: { id: 1, specialcoat: mockCoats } } as any),
    );

    render(<SpecialCoatArea />);

    expect(screen.getByTestId("section-headline")).toBeInTheDocument();
    expect(screen.getByTestId("coat-grid")).toBeInTheDocument();
  });

  test("rendert für jede Farbvariante eine SpecialCoatCard", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: { id: 1, specialcoat: mockCoats } } as any),
    );

    render(<SpecialCoatArea />);

    const cards = screen.getAllByTestId("special-coat-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("50");
    expect(cards[1]).toHaveTextContent("51");
  });

  test("zeigt den korrekten Übersetzungsschlüssel in der Headline", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: { id: 1, specialcoat: mockCoats } } as any),
    );

    render(<SpecialCoatArea />);

    expect(screen.getByTestId("section-headline")).toHaveTextContent("Animals.colorVariants");
  });
});