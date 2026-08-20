import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ContestDesktopTable from "./ContestDesktopTable";

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => "de",
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("./ContestOverview.styles", () => ({
  DateWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Divider: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  StatueRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AnimalCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ColorVariantWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TdColorVariant: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  ThPeriod: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  ThStatus: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  ThColorVariant: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
}));

vi.mock("@/components/page-structure/Table/Table", () => ({
  default: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
}));

vi.mock("@/components/page-structure/Table/LinkedRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

vi.mock("@/components/page-structure/Table/ActionsHeadline", () => ({
  default: ({ text }: { text: string }) => <th>{text}</th>,
}));

vi.mock("@/components/ui/badges/ThumbnailBadge", () => ({
  default: ({ name }: { name: string }) => <div data-testid="thumbnail">{name}</div>,
}));

vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <div data-testid="action-group">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

vi.mock("@/components/ui/badges/StatusBadge", () => ({
  StatusBadge: ({ isActive }: { isActive: boolean }) => (
    <span data-testid="status-badge">{isActive ? "aktiv" : "inaktiv"}</span>
  ),
}));

vi.mock("@/utils/ContestUtil", () => ({
  getStatueName: (animal: any, fallback: string) => animal.animaltext?.[0]?.animalName ?? fallback,
}));

vi.mock("@/utils/AnimalUtil", () => ({
  getAnimalImage: (animal: any) => ({ path: `/images/animals/${animal.image}`, name: animal.name, alt: animal.name }),
}));

vi.mock("@/utils/SpecialCoatUtil", () => ({
  getSpecialCoatImage: (coat: any) => ({ path: `/images/specialcoats/${coat.image}`, name: coat.id, alt: coat.id }),
}));

import { useSession } from "next-auth/react";

const mockContests = [
  {
    id: 1,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T00:00:00.000Z",
    conteststatue: [
      {
        id: 10,
        animal: {
          id: 100,
          name: "Löwe",
          image: "loewe.png",
          animaltext: [{ animalName: "Löwe" }],
          biome: { id: 1, identifier: "savanna", name: "Savanna" },
        },
      },
    ],
    contestspecialcoat: [
      {
        id: 20,
        specialCoatId: 5,
        specialcoat: {
          id: 5,
          image: "albino.png",
          specialcoatstext: [{ name: "Albino" }],
          animal: {
            id: 100,
            animaltext: [{ animalName: "Löwe" }],
            biome: { id: 1, identifier: "savanna" },
          },
        },
      },
    ],
  },
];

describe("ContestDesktopTable", () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "Member" } },
      status: "authenticated",
    } as any);
  });

  test("rendert den Statuen-Namen", () => {
    render(<ContestDesktopTable contests={mockContests} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText("Löwe")).toBeInTheDocument();
  });

  test("rendert den Special-Coat-Namen", () => {
    render(<ContestDesktopTable contests={mockContests} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getAllByText("Albino").length).toBeGreaterThan(0);
  });

  test("zeigt StatusBadge für jeden Contest", () => {
    render(<ContestDesktopTable contests={mockContests} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
  });

  test("zeigt keine Admin-Aktionen für Member", () => {
    render(<ContestDesktopTable contests={mockContests} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.queryByTestId("action-group")).not.toBeInTheDocument();
  });

  test("zeigt Admin-Aktionen für Director", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "Director" } },
      status: "authenticated",
    } as any);

    render(<ContestDesktopTable contests={mockContests} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByTestId("action-group")).toBeInTheDocument();
  });

  test("rendert leere Tabelle wenn keine Contests übergeben werden", () => {
    render(<ContestDesktopTable contests={[]} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.queryByTestId("status-badge")).not.toBeInTheDocument();
  });
});