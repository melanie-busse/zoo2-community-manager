import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useAnimalStore } from "@/store/useAnimalStore";
import { useSession } from "next-auth/react";
import AnimalDetailContent from "./AnimalDetailContent";

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    return (key: string) => `${namespace}.${key}`;
  },
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("./AnimalDetails.styles", () => ({
  Wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TopBar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  MainGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PrimaryColumn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SecondaryColumn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DesktopCardContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ImageWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TitleRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TextContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TitleHeadlineRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  OriginRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ReleaseDate: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StatsGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StatsGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EnclosureBox: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SectionHeadline: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SpecialCoatGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StyledSpecialCoatCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SpecialCoatName: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  OriginRowSpecialCoat: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  XpTable: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  THRight: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  ActionWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  EmptyState: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/page-structure/Elements/Textarea", () => ({
  default: ({ label, text }: { label: string; text: string }) => (
    <div>
      <label>{label}</label>
      <p>{text}</p>
    </div>
  ),
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

vi.mock("@/components/page-structure/Elements/StatBox", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: () => <div data-testid="admin-action-badge">Admin Actions</div>,
}));
vi.mock("@/components/page-structure/Elements/OriginBadgeList", () => ({
  default: () => <div data-testid="origin-badges">Origins</div>,
}));
vi.mock("@/components/ui/badges/ImageBadge", () => ({
  default: () => <img alt="Animal Profile" src="/placeholder.png" />,
}));
vi.mock("@/components/ui/Formatted/FormattedDate", () => ({
  default: ({ date }: { date: any }) => <span>{date}</span>,
}));
vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: () => <div>ShelterLevel</div>,
}));
vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value }: { value: number }) => <div>Price: {value}</div>,
}));
vi.mock("@/components/ui/badges/XPBadge", () => ({
  default: ({ label }: { label: any }) => <div>XP: {label}</div>,
}));
vi.mock("@/components/ui/badges/PopularityBadge", () => ({
  default: () => <div>Popularity</div>,
}));
vi.mock("@/components/ui/badges/GameBadge", () => ({
  default: () => <div>GameBadge</div>,
}));
vi.mock("./SpecialCoatArea", () => ({
  default: () => <div data-testid="special-coat-area">Special Coat Area</div>,
}));

const mockSelectedAnimal = {
  id: 1,
  releaseDate: "2026-03-07",
  price: 5000,
  sellingPrice: 1000,
  popularity: 150,
  releaseExp: 250,
  shelterLevel: 3,
  breedingCost: 400,
  breedingDuration: 12,
  breedingProbability: 65,
  priceType: { name: "Diamond" },
  biome: { identifier: "grassland", name: "Grasland" },
  animaltext: [{ animalName: "Erdmännchen", animalDescription: "Wuselt flink im Sand herum." }],
  animalxp: [{ id: 101, xpTypeId: 1, xpDuration: 60, xpValue: 15 }],
  animalperenclosure: [{ numberAnimals: 2, numberEnclosure: 16 }],
  specialcoat: [
    {
      id: 50,
      name: "Alpino",
      image: "albino.png",
      releaseDate: "2026-05-01",
      origin: { name: "Magische Truhe", image: "chest.png" },
      specialCoatText: [{ name: "Albino-Variante" }],
    },
  ],
};

describe("AnimalDetailContent Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "User" } },
      status: "authenticated",
    } as any);
  });

  test("rendert Not-Found State, wenn kein Tier im Store selektiert ist", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: null } as any),
    );

    render(<AnimalDetailContent />);

    expect(screen.getByText("Common.not_found")).toBeInTheDocument();
  });

  test("rendert alle Header-Informationen, Beschreibungen und Kapazitäten für Standard-User", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockSelectedAnimal } as any),
    );

    render(<AnimalDetailContent />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Erdmännchen");
    expect(screen.getByText("2026-03-07")).toBeInTheDocument();

    expect(screen.getByText("Wuselt flink im Sand herum.")).toBeInTheDocument();

    expect(screen.getByText("12 h")).toBeInTheDocument();
    expect(screen.getByText("65 %")).toBeInTheDocument();

     expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();

    expect(screen.queryByTestId("admin-action-badge")).not.toBeInTheDocument();
  });

  test("rendert die TopBar mit Admin-Aktionen, wenn der User die Rolle 'Director' besitzt", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "Director" } },
      status: "authenticated",
    } as any);

    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockSelectedAnimal } as any),
    );

    render(<AnimalDetailContent />);

    expect(screen.getByTestId("admin-action-badge")).toBeInTheDocument();
  });

  test("zeigt den Empty State in der Kapazitäten-Tabelle, wenn keine Daten hinterlegt sind", () => {
    const animalWithoutCapacity = {
      ...mockSelectedAnimal,
      animalperenclosure: [],
    };

    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: animalWithoutCapacity } as any),
    );

    render(<AnimalDetailContent />);

    expect(screen.getByText("Common.loading_data")).toBeInTheDocument();
  });
});
