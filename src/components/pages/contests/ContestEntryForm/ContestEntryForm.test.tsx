import React from "react";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ContestEntryForm from "./ContestEntryForm";

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock("./ContestEntryForm.styles", () => ({
  HeaderSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DateRange: ({ children }: { children: React.ReactNode }) => <div data-testid="date-range">{children}</div>,
  Section: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AnimalSection: ({ children }: { children: React.ReactNode }) => <div data-testid="animal-section">{children}</div>,
  SpecialCoatSection: ({ children }: { children: React.ReactNode }) => <div data-testid="coat-section">{children}</div>,
  AnimalHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/pages/contests/ContestCreateForm/ContestCreateForm.styles", () => ({
  ButtonRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CancelButton: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button type="button" onClick={onClick} data-testid="cancel-button">{children}</button>
  ),
}));

vi.mock("@/components/page-structure/page/PageHeader", () => ({
  default: ({ text }: { text: string }) => <h1>{text}</h1>,
}));

vi.mock("@/components/ui/Formatted/FormattedDate", () => ({
  default: ({ date }: { date: any }) => <span>{String(date).slice(0, 10)}</span>,
}));

vi.mock("@/components/ui/form/Selectbox", () => ({
  default: ({ label, onChange, options }: any) => (
    <div>
      <label>{label}</label>
      <select data-testid="member-select" onChange={onChange}>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock("@/components/ui/form/DynamicRowInput", () => ({
  default: ({ onAdd }: { onAdd: () => void }) => (
    <div data-testid="dynamic-row-input">
      <button type="button" onClick={onAdd} data-testid="add-row">Zeile hinzufügen</button>
    </div>
  ),
}));

vi.mock("@/components/ui/badges/ThumbnailBadge", () => ({
  default: ({ name }: { name: string }) => <div data-testid="thumbnail">{name}</div>,
}));

vi.mock("@/components/ui/form/SubmitButton", () => ({
  default: ({ label }: { label: string }) => <button type="submit" data-testid="submit-button">{label}</button>,
}));

const mockContest = {
  id: 1,
  startDate: "2026-01-01T00:00:00.000Z",
  endDate: "2026-12-31T00:00:00.000Z",
  conteststatue: [
    {
      animal: {
        id: 100,
        name: "Löwe",
        image: "loewe.png",
        animaltext: [{ animalName: "Löwe" }],
        biome: { id: 1, identifier: "savanna" },
      },
    },
  ],
  contestspecialcoat: [
    {
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

const mockMembers = [
  { id: "1", name: "Alice Muster", upjersname: "Alice99" },
  { id: "2", name: "Bob Beispiel", upjersname: "Bob42" },
];

const mockHandlers = {
  addRow: vi.fn(),
  removeRow: vi.fn(),
  handleRowChange: vi.fn(),
};

describe("ContestEntryForm", () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  const onMemberChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert den Seitentitel", () => {
    render(
      <ContestEntryForm
        contest={mockContest as any}
        members={mockMembers as any}
        selectedMemberId=""
        onMemberChange={onMemberChange}
        entries={{}}
        columns={[]}
        handlers={mockHandlers}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  test("rendert die Mitglieder-Auswahlliste mit allen Mitgliedern", () => {
    render(
      <ContestEntryForm
        contest={mockContest as any}
        members={mockMembers as any}
        selectedMemberId=""
        onMemberChange={onMemberChange}
        entries={{}}
        columns={[]}
        handlers={mockHandlers}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );
    expect(screen.getByText("Alice99")).toBeInTheDocument();
    expect(screen.getByText("Bob42")).toBeInTheDocument();
  });

  test("rendert je einen DynamicRowInput für Statue und SpecialCoat", () => {
    render(
      <ContestEntryForm
        contest={mockContest as any}
        members={mockMembers as any}
        selectedMemberId=""
        onMemberChange={onMemberChange}
        entries={{}}
        columns={[]}
        handlers={mockHandlers}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );
    expect(screen.getAllByTestId("dynamic-row-input")).toHaveLength(2);
  });

  test("ruft onCancel auf wenn der Abbrechen-Button geklickt wird", async () => {
    render(
      <ContestEntryForm
        contest={mockContest as any}
        members={mockMembers as any}
        selectedMemberId=""
        onMemberChange={onMemberChange}
        entries={{}}
        columns={[]}
        handlers={mockHandlers}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("zeigt Speichern-Label wenn nicht submitting", () => {
    render(
      <ContestEntryForm
        contest={mockContest as any}
        members={mockMembers as any}
        selectedMemberId=""
        onMemberChange={onMemberChange}
        entries={{}}
        columns={[]}
        handlers={mockHandlers}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );
    expect(screen.getByTestId("submit-button")).toHaveTextContent("common.save");
  });

  test("zeigt Laden-Label während des Submitierens", () => {
    render(
      <ContestEntryForm
        contest={mockContest as any}
        members={mockMembers as any}
        selectedMemberId=""
        onMemberChange={onMemberChange}
        entries={{}}
        columns={[]}
        handlers={mockHandlers}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={true}
      />,
    );
    expect(screen.getByTestId("submit-button")).toHaveTextContent("common.saving");
  });

  test("ruft handlers.addRow auf wenn Zeile hinzugefügt wird", async () => {
    render(
      <ContestEntryForm
        contest={mockContest as any}
        members={mockMembers as any}
        selectedMemberId=""
        onMemberChange={onMemberChange}
        entries={{}}
        columns={[]}
        handlers={mockHandlers}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );
    const addButtons = screen.getAllByTestId("add-row");
    fireEvent.click(addButtons[0]);
    expect(mockHandlers.addRow).toHaveBeenCalledWith(100); // Löwen-ID
  });
});