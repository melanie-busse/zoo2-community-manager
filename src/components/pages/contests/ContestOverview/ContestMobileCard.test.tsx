import React from "react";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ContestMobileCard from "./ContestMobileCard";

vi.mock("next-intl", () => ({
  useLocale: () => "de",
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("./ContestOverview.styles", () => ({
  Card: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div data-testid="card" onClick={onClick}>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DateInfo: ({ children }: { children: React.ReactNode }) => <div data-testid="date-info">{children}</div>,
  AnimalGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AnimalItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TinyName: ({ children }: { children: React.ReactNode }) => <span data-testid="tiny-name">{children}</span>,
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

vi.mock("lucide-react", () => ({
  Calendar: () => <svg data-testid="calendar-icon" />,
}));

import { useSession } from "next-auth/react";

const mockContest = {
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
};

describe("ContestMobileCard", () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const onClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "Member" } },
      status: "authenticated",
    } as any);
  });

  test("rendert den Statuen-Namen und SpecialCoat-Namen", () => {
    render(
      <ContestMobileCard contest={mockContest} onEdit={onEdit} onDelete={onDelete} />,
    );
    const names = screen.getAllByTestId("tiny-name");
    expect(names[0]).toHaveTextContent("Löwe");
    expect(names[1]).toHaveTextContent("Albino");
  });

  test("zeigt StatusBadge", () => {
    render(
      <ContestMobileCard contest={mockContest} onEdit={onEdit} onDelete={onDelete} />,
    );
    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
  });

  test("zeigt keine Admin-Aktionen für Member", () => {
    render(
      <ContestMobileCard contest={mockContest} onEdit={onEdit} onDelete={onDelete} />,
    );
    expect(screen.queryByTestId("action-group")).not.toBeInTheDocument();
  });

  test("zeigt Admin-Aktionen für Director", () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: "Director" } },
      status: "authenticated",
    } as any);

    render(
      <ContestMobileCard contest={mockContest} onEdit={onEdit} onDelete={onDelete} />,
    );
    expect(screen.getByTestId("action-group")).toBeInTheDocument();
  });

  test("ruft onClick auf wenn die Card angeklickt wird", async () => {
    render(
      <ContestMobileCard contest={mockContest} onClick={onClick} onEdit={onEdit} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByTestId("card"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("rendert ThumbnailBadge für Statuen mit Bild", () => {
    render(
      <ContestMobileCard contest={mockContest} onEdit={onEdit} onDelete={onDelete} />,
    );
    expect(screen.getAllByTestId("thumbnail").length).toBeGreaterThan(0);
  });
});