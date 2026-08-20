import React from "react";
import { render, screen } from "@testing-library/react";

import { describe, test, expect, vi, beforeEach } from "vitest";
import ContestOverviewContent from "./ContestOverviewContent";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { role: "Member" } } }),
}));

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => "de",
}));

vi.mock("./ContestOverview.styles", () => ({
  DesktopOnly: ({ children }: { children: React.ReactNode }) => <div data-testid="desktop">{children}</div>,
  MobileOnly: ({ children }: { children: React.ReactNode }) => <div data-testid="mobile">{children}</div>,
}));

vi.mock("@/components/page-structure/page/PageHeader", () => ({
  default: ({ text }: { text: string }) => <h1>{text}</h1>,
}));

vi.mock("@/components/elements/EmptyState/EmptyState", () => ({
  default: ({ object }: { object: string }) => <div data-testid="empty-state">{object}</div>,
}));

vi.mock("./ContestDesktopTable", () => ({
  default: ({ contests }: { contests: any[] }) => (
    <div data-testid="desktop-table">{contests.length} Contests</div>
  ),
}));

vi.mock("./ContestMobileCard", () => ({
  default: ({ contest }: { contest: any }) => (
    <div data-testid={`mobile-card-${contest.id}`}>{contest.id}</div>
  ),
}));

const mockContests = [
  {
    id: 1,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    active: 1,
    conteststatue: [],
    contestspecialcoat: [],
  },
  {
    id: 2,
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    active: 0,
    conteststatue: [],
    contestspecialcoat: [],
  },
];

describe("ContestOverviewContent", () => {
  const handleEdit = vi.fn();
  const handleDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert den Seitentitel", () => {
    render(
      <ContestOverviewContent
        contests={mockContests}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  test("zeigt die Desktop-Tabelle und Mobile-Cards wenn Contests vorhanden sind", () => {
    render(
      <ContestOverviewContent
        contests={mockContests}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );
    expect(screen.getByTestId("desktop-table")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-card-2")).toBeInTheDocument();
  });

  test("zeigt den Empty State wenn keine Contests vorhanden sind", () => {
    render(
      <ContestOverviewContent
        contests={[]}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByTestId("desktop-table")).not.toBeInTheDocument();
  });

  test("übergibt handleEdit und handleDelete an ContestDesktopTable", () => {
    render(
      <ContestOverviewContent
        contests={mockContests}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />,
    );
    expect(screen.getByTestId("desktop-table")).toHaveTextContent("2 Contests");
  });
});