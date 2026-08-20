import React from "react";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ContestCreateFormContent } from "./ContestCreateFormContent";

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock("./ContestCreateForm.styles", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InputGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CheckboxGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  checkboxContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SectionHeadline: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  ButtonRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CancelButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick} data-testid="cancel-button">{children}</button>
  ),
}));

vi.mock("@/components/ui/form/SubmitButton", () => ({
  default: ({ label }: { label: string }) => (
    <button type="submit" data-testid="submit-button">{label}</button>
  ),
}));

vi.mock("@/components/ui/form/Label", () => ({
  default: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}));

vi.mock("@/components/ui/OriginTransfer/OriginTransfer", () => ({
  default: ({ onChange, selectedIds }: { onChange: (ids: number[]) => void; selectedIds: number[] }) => (
    <div data-testid="origin-transfer" data-selected={selectedIds.join(",")}>
      <button type="button" onClick={() => onChange([1])}>Auswahl ändern</button>
    </div>
  ),
}));

describe("ContestCreateFormContent", () => {
  const handleFormSubmit = vi.fn();
  const setFormData = vi.fn();
  const onStatueIdsChange = vi.fn();
  const onSpecialCoatIdsChange = vi.fn();
  const onCancel = vi.fn();

  const defaultProps = {
    handleFormSubmit,
    formData: { startDate: "2026-01-01", endDate: "2026-12-31", active: 0 },
    setFormData,
    selectedStatues: [],
    availableStatues: [{ id: 1, name: "Löwe" }, { id: 2, name: "Tiger" }],
    onStatueIdsChange,
    specialCoatItems: [{ id: 5, name: "Albino" }],
    selectedSpecialCoatIds: [],
    onSpecialCoatIdsChange,
    isSubmitting: false,
    onCancel,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert die Datumsfelder", () => {
    render(<ContestCreateFormContent {...defaultProps} />);
    const dateInputs = screen.getAllByDisplayValue(/2026/);
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  test("rendert den Aktiv-Checkbox", () => {
    render(<ContestCreateFormContent {...defaultProps} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  test("zeigt Abbrechen-Button wenn onCancel übergeben wird", () => {
    render(<ContestCreateFormContent {...defaultProps} />);
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
  });

  test("zeigt keinen Abbrechen-Button ohne onCancel", () => {
    render(<ContestCreateFormContent {...defaultProps} onCancel={undefined} />);
    expect(screen.queryByTestId("cancel-button")).not.toBeInTheDocument();
  });

  test("ruft onCancel auf beim Klick auf Abbrechen", async () => {
    render(<ContestCreateFormContent {...defaultProps} />);
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("zeigt Speicher-Label wenn nicht submitting", () => {
    render(<ContestCreateFormContent {...defaultProps} />);
    expect(screen.getByTestId("submit-button")).toHaveTextContent("contest.contestForm.saveContest");
  });

  test("zeigt Laden-Label während des Submitierens", () => {
    render(<ContestCreateFormContent {...defaultProps} isSubmitting={true} />);
    expect(screen.getByTestId("submit-button")).toHaveTextContent("common.save_changes");
  });

  test("zeigt Statuen-Zähler korrekt", () => {
    const props = {
      ...defaultProps,
      selectedStatues: [{ id: 1, name: "Löwe" }],
    };
    render(<ContestCreateFormContent {...props} />);
    expect(screen.getAllByText(/1 \/ 3/)[0]).toBeInTheDocument();
  });

  test("zeigt SpecialCoat-Zähler korrekt", () => {
    const props = {
      ...defaultProps,
      selectedSpecialCoatIds: [5],
    };
    render(<ContestCreateFormContent {...props} />);
    expect(screen.getAllByText(/1 \/ 1/)[0]).toBeInTheDocument();
  });

  test("ruft onStatueIdsChange auf wenn Statuen geändert werden", async () => {
    render(<ContestCreateFormContent {...defaultProps} />);
    const buttons = screen.getAllByText("Auswahl ändern");
    fireEvent.click(buttons[0]);
    expect(onStatueIdsChange).toHaveBeenCalledWith([1]);
  });
});