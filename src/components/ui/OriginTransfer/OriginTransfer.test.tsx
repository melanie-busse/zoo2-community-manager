import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      "available": "Verfügbar",
      "chosen": "Ausgewählt",
      "searchPlaceholder": "Suchen...",
      "messages.no_more_items": "Keine weiteren gefunden",
      "messages.none_selected": "Keine ausgewählt",
      "messages.no_search_results": "Keine Treffer",
    };
    return map[key] ?? key;
  },
}));

vi.mock("styled-components", () => {
  const Component = ({ children }: any) => children;
  const tag = () => Component;
  return { default: new Proxy({}, { get: () => tag }) };
});

vi.mock("lucide-react", () => ({
  ChevronRight: () => <span data-testid="chevron-right" />,
  ChevronLeft: () => <span data-testid="chevron-left" />,
  Search: () => <span data-testid="search-icon" />,
}));

vi.mock("@/components/ui/form/InputField", () => ({
  default: ({ id, value, onChange, placeholder }: any) => (
    <input id={id} value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

vi.mock("./OriginTransfer.styles", () => ({
  TransferContainer: ({ children }: any) => <div data-testid="transfer-container">{children}</div>,
  Column: ({ children }: any) => <div data-testid="column">{children}</div>,
  ColumnTitle: ({ children }: any) => <div data-testid="column-title">{children}</div>,
  List: ({ children }: any) => <ul>{children}</ul>,
  Item: ({ children, onClick, $disabled, $selected }: any) => (
    <li onClick={$disabled ? undefined : onClick} data-disabled={$disabled} data-selected={$selected}>
      {children}
    </li>
  ),
  EmptyNote: ({ children }: any) => <p data-testid="empty-note">{children}</p>,
}));

import OriginTransfer from "./OriginTransfer";

const allOrigins = [
  { id: 1, name: "Savanne" },
  { id: 2, name: "Arktis" },
  { id: 3, name: "Dschungel" },
];

describe("OriginTransfer", () => {
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChange = vi.fn();
  });

  test("zeigt alle Items links wenn nichts ausgewählt", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[]} onChange={onChange} />);
    expect(screen.getByText("Savanne")).toBeInTheDocument();
    expect(screen.getByText("Arktis")).toBeInTheDocument();
    expect(screen.getByText("Dschungel")).toBeInTheDocument();
  });

  test("teilt Items korrekt auf links und rechts auf", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[2]} onChange={onChange} />);
    expect(screen.getByText("Savanne")).toBeInTheDocument();
    expect(screen.getByText("Arktis")).toBeInTheDocument();
    expect(screen.getByText("Dschungel")).toBeInTheDocument();
    // Arktis ist rechts ausgewählt, bleibt aber sichtbar
    const items = screen.getAllByText("Arktis");
    expect(items).toHaveLength(1);
  });

  test("ruft onChange mit hinzugefügter ID auf beim Klick nach rechts", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Savanne").closest("li")!);
    expect(onChange).toHaveBeenCalledWith([1]);
  });

  test("ruft onChange mit entfernter ID auf beim Klick nach links", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[1, 2]} onChange={onChange} />);
    // Item 1 ist rechts → Klick entfernt es
    const selectedItems = screen.getAllByText("Savanne");
    fireEvent.click(selectedItems[0].closest("li")!);
    expect(onChange).toHaveBeenCalledWith([2]);
  });

  test("blockiert Hinzufügen wenn maxSelected erreicht", () => {
    render(
      <OriginTransfer allOrigins={allOrigins} selectedIds={[1]} onChange={onChange} maxSelected={1} />,
    );
    const savanneItem = screen.getByText("Arktis").closest("li")!;
    expect(savanneItem).toHaveAttribute("data-disabled", "true");
    fireEvent.click(savanneItem);
    expect(onChange).not.toHaveBeenCalled();
  });

  test("filtert linke Liste nach Sucheingabe", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[]} onChange={onChange} />);
    const searchInput = screen.getByPlaceholderText("Suchen...");
    fireEvent.change(searchInput, { target: { value: "sav" } });
    expect(screen.getByText("Savanne")).toBeInTheDocument();
    expect(screen.queryByText("Arktis")).not.toBeInTheDocument();
    expect(screen.queryByText("Dschungel")).not.toBeInTheDocument();
  });

  test("zeigt Keine-Treffer-Hinweis bei leerem Suchergebnis", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[]} onChange={onChange} />);
    const searchInput = screen.getByPlaceholderText("Suchen...");
    fireEvent.change(searchInput, { target: { value: "xyz" } });
    expect(screen.getByText("Keine Treffer")).toBeInTheDocument();
  });

  test("zeigt Leer-Hinweis wenn alle Items ausgewählt sind", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[1, 2, 3]} onChange={onChange} />);
    expect(screen.getByText("Keine weiteren gefunden")).toBeInTheDocument();
  });

  test("zeigt Keine-ausgewählt-Hinweis wenn rechte Liste leer", () => {
    render(<OriginTransfer allOrigins={allOrigins} selectedIds={[]} onChange={onChange} />);
    expect(screen.getByText("Keine ausgewählt")).toBeInTheDocument();
  });

  test("rechtes Suchfeld erscheint erst ab mehr als 5 ausgewählten Items", () => {
    const manyOrigins = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

    const { rerender, container } = render(
      <OriginTransfer allOrigins={manyOrigins} selectedIds={[1, 2, 3, 4, 5]} onChange={onChange} />,
    );
    // 5 ausgewählt → rechtes Suchfeld fehlt noch
    expect(container.querySelector("#search-selected-origins")).toBeNull();

    rerender(
      <OriginTransfer allOrigins={manyOrigins} selectedIds={[1, 2, 3, 4, 5, 6]} onChange={onChange} />,
    );
    // 6 ausgewählt → rechtes Suchfeld erscheint
    expect(container.querySelector("#search-selected-origins")).not.toBeNull();
  });
});
