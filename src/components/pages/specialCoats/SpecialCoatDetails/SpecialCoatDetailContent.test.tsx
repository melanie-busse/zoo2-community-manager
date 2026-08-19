import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { useAnimalStore } from "@/store/useAnimalStore";
import { useSession } from "next-auth/react";
import SpecialCoatDetailContent from "./SpecialCoatDetailContent";

vi.mock("@/store/useSpecialCoatStore", () => ({
  useSpecialCoatStore: vi.fn(),
}));

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/pages/animals/AnimalDetails/AnimalDetails.styles", () => ({
  Wrapper: ({ children }: any) => <div>{children}</div>,
  TopBar: ({ children }: any) => <div>{children}</div>,
  MainGrid: ({ children }: any) => <div>{children}</div>,
  PrimaryColumn: ({ children }: any) => <div>{children}</div>,
  SecondaryColumn: ({ children }: any) => <div>{children}</div>,
  DesktopCardContainer: ({ children }: any) => <div>{children}</div>,
  ImageWrapper: ({ children }: any) => <div>{children}</div>,
  InfoSection: ({ children }: any) => <div>{children}</div>,
  TitleRow: ({ children }: any) => <div>{children}</div>,
  TextContent: ({ children }: any) => <div>{children}</div>,
  TitleHeadlineRow: ({ children }: any) => <div>{children}</div>,
  OriginRow: ({ children }: any) => <div>{children}</div>,
  ReleaseDate: ({ children }: any) => <div>{children}</div>,
  XpTable: ({ children }: any) => <table>{children}</table>,
  THRight: ({ children }: any) => <th>{children}</th>,
  ActionWrapper: ({ children }: any) => <div>{children}</div>,
  TableHeader: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  EmptyState: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: () => <div data-testid="admin-action-badge">Admin Actions</div>,
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

vi.mock("@/components/ui/badges/ShelterLevelBadge", () => ({
  default: () => <div>ShelterLevel</div>,
}));
vi.mock("@/components/ui/badges/PriceBadge", () => ({
  default: ({ value }: { value: number }) => <div>Price: {value}</div>,
}));
vi.mock("@/components/ui/badges/XPBadge", () => ({
  default: ({ label }: { label: any }) => <div>XP: {label}</div>,
}));
vi.mock("@/components/ui/badges/OriginBadge", () => ({
  default: () => <div>OriginBadge</div>,
}));
vi.mock("@/components/ui/tooltip/Tooltip", () => ({
  default: ({ children }: any) => <>{children}</>,
}));
vi.mock("@/components/ui/Formatted/FormattedDate", () => ({
  default: ({ date }: { date: any }) => <span>{String(date)}</span>,
}));
vi.mock("@/utils/BiomeUtil", () => ({
  getShelterImage: () => ({ path: "/shelter.png", alt: "shelter" }),
}));


const mockSpecialCoat = {
  id: 7,
  animalId: 1,
  image: "albino.png",
  releaseDate: "2026-06-01",
  isContestSpecialCoat: true,
  chanceBaseWithOneParent: 5.5,
  specialcoatstext: [{ languageCode: "de", name: "Albino", color: "Weiß" }],
  specialcoatsorigin: [
    { id: 1, specialCoatId: 7, originId: 2, origin: { id: 2, name: "Shop", image: "shop.webp" } },
  ],
} as any;

const mockAnimal = {
  id: 1,
  shelterLevel: 2,
  breedingCost: 300,
  breedingDuration: 8,
  breedingProbability: 50,
  biome: { identifier: "grassland", name: "Grasland" },
  animaltext: [{ animalName: "Löwe", animalDescription: "König der Savanne." }],
  animalxp: [{ id: 10, xptype: { id: 1 }, xpDuration: 30, xpValue: 10 }],
  animalperenclosure: [{ numberAnimals: 2, numberEnclosure: 12 }],
} as any;

describe("SpecialCoatDetailContent Integration Test", () => {
  const mockSetEditingSpecialCoat = vi.fn();
  const mockDeleteSpecialCoat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "User" } },
      status: "authenticated",
    } as any);
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({
        selectedSpecialCoat: mockSpecialCoat,
        setEditingSpecialCoat: mockSetEditingSpecialCoat,
        deleteSpecialCoat: mockDeleteSpecialCoat,
      } as any),
    );
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: mockAnimal } as any),
    );
  });

  test("rendert Not-Found State, wenn kein SpecialCoat im Store ist", () => {
    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({ selectedSpecialCoat: null } as any),
    );

    render(<SpecialCoatDetailContent />);

    expect(screen.getByText("common.not_found")).toBeInTheDocument();
  });

  test("rendert Name und Farbe des SpecialCoats", () => {
    render(<SpecialCoatDetailContent />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Albino");
    expect(screen.getByText("Weiß")).toBeInTheDocument();
  });

  test("rendert die Zuchtdaten aus dem Animal-Store", () => {
    render(<SpecialCoatDetailContent />);

    expect(screen.getByText("Price: 300")).toBeInTheDocument();
    expect(screen.getByText("8 h")).toBeInTheDocument();
    expect(screen.getByText("50 %")).toBeInTheDocument();
  });

  test("rendert die Zuchtwahrscheinlichkeiten des SpecialCoats in der BreedingSection", () => {
    render(<SpecialCoatDetailContent />);

    expect(screen.getByText("5.5 %")).toBeInTheDocument();
    expect(screen.getByText("specialCoat.breeding.title")).toBeInTheDocument();
  });

  test("rendert die Basischancen aus dem SpecialCoat in der BreedingSection", () => {
    render(<SpecialCoatDetailContent />);

    expect(screen.getByText("Basischance")).toBeInTheDocument();
    expect(screen.getByText("Eventchance")).toBeInTheDocument();
  });

  test("zeigt keinen Admin-Badge für normale User", () => {
    render(<SpecialCoatDetailContent />);

    expect(screen.queryByTestId("admin-action-badge")).not.toBeInTheDocument();
  });

  test("zeigt Admin-Badge für Director-Rolle", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "Director" } },
      status: "authenticated",
    } as any);

    render(<SpecialCoatDetailContent />);

    expect(screen.getByTestId("admin-action-badge")).toBeInTheDocument();
  });

  test("zeigt keine BreedingSection, wenn kein Tier im Store vorhanden ist", () => {
    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({ selectedAnimal: null } as any),
    );

    render(<SpecialCoatDetailContent />);

    expect(screen.queryByText("specialCoat.breeding.title")).not.toBeInTheDocument();
  });

  test("zeigt Contest-Badge im Header, wenn isContestSpecialCoat true ist", () => {
    render(<SpecialCoatDetailContent />);

    expect(screen.getByText("specialCoat.breeding.isContestSpecialCoat")).toBeInTheDocument();
  });
});
