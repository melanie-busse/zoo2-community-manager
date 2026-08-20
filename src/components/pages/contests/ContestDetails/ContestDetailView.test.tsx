import React from "react";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ContestDetailView from "./ContestDetailView";

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("./ContestDetailView.styles", () => ({
  RelativeWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AdminActions: ({ children }: { children: React.ReactNode }) => <div data-testid="admin-actions">{children}</div>,
  MetaInfo: ({ children }: { children: React.ReactNode }) => <div data-testid="meta-info">{children}</div>,
  ActionRow: ({ children }: { children: React.ReactNode }) => <div data-testid="action-row">{children}</div>,
  AnimalGrid: ({ children }: { children: React.ReactNode }) => <div data-testid="animal-grid">{children}</div>,
  AnimalCard: ({ children }: { children: React.ReactNode }) => <div data-testid="animal-card">{children}</div>,
  AnimalHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TitleGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  GrandTotal: ({ children }: { children: React.ReactNode }) => <div data-testid="grand-total">{children}</div>,
  List: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  ListHeader: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  Row: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  Name: ({ children }: { children: React.ReactNode }) => <span data-testid="member-name">{children}</span>,
  Points: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Empty: ({ children }: { children: React.ReactNode }) => <p data-testid="no-posts">{children}</p>,
}));

vi.mock("@/components/page-structure/page/PageHeader", () => ({
  default: ({ text }: { text: string }) => <h1>{text}</h1>,
}));

vi.mock("@/components/page-structure/page/ContentWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/Formatted/FormattedDate", () => ({
  default: ({ date }: { date: any }) => <span>{String(date).slice(0, 10)}</span>,
}));

vi.mock("@/components/ui/badges/ActionGroupBadge", () => ({
  default: ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <div data-testid="action-group">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

vi.mock("@/components/ui/badges/ThumbnailBadge", () => ({
  default: ({ name }: { name: string }) => <div data-testid="thumbnail">{name}</div>,
}));

vi.mock("@/components/ui/badges/RangBadge", () => ({
  default: ({ label }: { label: number }) => <span data-testid="rang-badge">{label}</span>,
}));

vi.mock("@/components/ui/form/SubmitButton", () => ({
  default: ({ label }: { label: string }) => <button type="submit">{label}</button>,
}));

const futureDate = "2099-12-31T00:00:00.000Z";
const pastDate = "2020-01-01T00:00:00.000Z";

const mockContest = {
  id: 1,
  startDate: "2026-01-01T00:00:00.000Z",
  endDate: futureDate,
  conteststatue: [],
  contestspecialcoat: [],
};

const mockAnimal = {
  id: 100,
  name: "Löwe",
  image: "loewe.png",
  animaltext: [{ animalName: "Löwe" }],
  biome: { id: 1, identifier: "savanna", name: "Savanna", biomestext: [] },
};

const mockAnalysis = [
  {
    animal: mockAnimal,
    stats: {
      rankedUser: [
        { name: "Alice", rawSum: 100, multiplier: 40, weighted: 4000 },
        { name: "Bob", rawSum: 50, multiplier: 30, weighted: 1500 },
      ],
      totalWeighted: 5500,
    },
  },
];

describe("ContestDetailView", () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert den Seitentitel", () => {
    render(
      <ContestDetailView
        contest={mockContest as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  test("zeigt ActionGroupBadge", () => {
    render(
      <ContestDetailView
        contest={mockContest as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByTestId("action-group")).toBeInTheDocument();
  });

  test("ruft onEdit auf wenn Edit-Button geklickt wird", async () => {
    render(
      <ContestDetailView
        contest={mockContest as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  test("zeigt den Eintragsbutton wenn Contest noch aktiv ist", () => {
    render(
      <ContestDetailView
        contest={mockContest as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByTestId("action-row")).toBeInTheDocument();
  });

  test("zeigt keinen Eintragsbutton wenn Contest abgelaufen ist", () => {
    const expiredContest = { ...mockContest, endDate: pastDate };
    render(
      <ContestDetailView
        contest={expiredContest as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.queryByTestId("action-row")).not.toBeInTheDocument();
  });

  test("rendert Rangliste mit Mitgliedsnamen und Punkten", () => {
    render(
      <ContestDetailView
        contest={mockContest as any}
        animals={mockAnalysis as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getAllByTestId("rang-badge")).toHaveLength(2);
  });

  test("zeigt Leer-Meldung wenn keine Einträge vorhanden sind", () => {
    const emptyAnalysis = [
      {
        animal: mockAnimal,
        stats: { rankedUser: [], totalWeighted: 0 },
      },
    ];
    render(
      <ContestDetailView
        contest={mockContest as any}
        animals={emptyAnalysis as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByTestId("no-posts")).toBeInTheDocument();
  });

  test("rendert Gesamtpunktzahl", () => {
    render(
      <ContestDetailView
        contest={mockContest as any}
        animals={mockAnalysis as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByTestId("grand-total")).toHaveTextContent("5");
  });
});