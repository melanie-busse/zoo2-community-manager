import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useAnimalStore } from "@/store/useAnimalStore";
import AccordionCard from "./AccordionCard";

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

vi.mock("@/components/ui/Formatted/XpDateFormat", () => ({
  formatMinutes: vi.fn((min: number) => `${min} min`),
}));

vi.mock("@/constants/Xp", () => ({
  XP: {
    1: { key: "feed", icon: "/icons/feed.png" },
  },
}));

vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value }: { value: number }) => (
    <div data-testid="price-badge">Price: {value}</div>
  ),
}));

vi.mock("@/components/ui/badges/XPBadge", () => ({
  default: ({ label }: { label: any }) => <div data-testid="xp-badge">XP: {label}</div>,
}));

vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: () => <div data-testid="shelter-badge">ShelterLevel</div>,
}));

vi.mock("@/components/page-structure/Elements/InfoAccordion", () => ({
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <details open>
      <summary>{title}</summary>
      {children}
    </details>
  ),
}));

vi.mock("@/components/ui/DataRow", () => ({
  default: ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <span>{label}</span>
      {children}
    </div>
  ),
}));

vi.mock("./AnimalDetails.styles", () => ({
  XpTable: ({ children }: any) => <table>{children}</table>,
  THRight: ({ children }: any) => <th>{children}</th>,
  ActionWrapper: ({ children }: any) => <div>{children}</div>,
  TableHeader: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  EmptyState: ({ children }: any) => <div data-testid="empty-state">{children}</div>,
}));

const mockAnimal = {
  id: 1,
  shelterLevel: 3,
  breedingCost: 400,
  breedingDuration: 12,
  breedingProbability: 65,
  biome: { identifier: "grassland", name: "Grasland" },
  animalxp: [{ id: 1, xpTypeId: 1, xpDuration: 60, xpValue: 15 }],
  animalperenclosure: [
    { numberAnimals: 2, numberEnclosure: 16 },
    { numberAnimals: 4, numberEnclosure: 32 },
  ],
};

describe("AccordionCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert nichts, wenn kein Tier im Store ist", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: null } as any),
    );

    const { container } = render(<AccordionCard />);

    expect(container).toBeEmptyDOMElement();
  });

  test("rendert Zucht-Informationen: Dauer und Wahrscheinlichkeit", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<AccordionCard />);

    expect(screen.getByText("12 h")).toBeInTheDocument();
    expect(screen.getByText("65 %")).toBeInTheDocument();
  });

  test("rendert den Zuchtpreis via PriceBadge", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<AccordionCard />);

    expect(screen.getByTestId("price-badge")).toHaveTextContent("400");
  });

  test("rendert XP-Zeilen mit formatierter Dauer", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<AccordionCard />);

    expect(screen.getByText("60 min")).toBeInTheDocument();
    expect(screen.getByTestId("xp-badge")).toHaveTextContent("15");
  });

  test("rendert Kapazitäts-Tabelle mit allen Zeilen", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );

    render(<AccordionCard />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("32")).toBeInTheDocument();
  });

  test("rendert den Empty State, wenn keine Kapazitätsdaten vorhanden sind", () => {
    const animalWithoutCapacity = { ...mockAnimal, animalperenclosure: [] };
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: animalWithoutCapacity } as any),
    );

    render(<AccordionCard />);

    expect(screen.getByTestId("empty-state")).toHaveTextContent("Common.loading_data");
  });

  test("rendert keine XP-Zeilen, wenn keine XP-Daten vorhanden sind", () => {
    const animalWithoutXp = { ...mockAnimal, animalxp: [] };
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: animalWithoutXp } as any),
    );

    render(<AccordionCard />);

    expect(screen.queryByTestId("xp-badge")).not.toBeInTheDocument();
  });
});