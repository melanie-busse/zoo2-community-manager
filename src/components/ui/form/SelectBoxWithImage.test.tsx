import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import SelectBoxWithImage from "./SelectBoxWithImage";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/hooks/useClickOutside", () => ({
  useClickOutside: vi.fn(),
}));

vi.mock("@/components/elements/Filter/Filter.styles", () => ({
  SelectWrapper: ({ children }: any) => <div>{children}</div>,
  SelectHeader: ({ children, onClick }: any) => <div onClick={onClick}>{children}</div>,
  SelectedValue: ({ children }: any) => <div>{children}</div>,
  Label: ({ children }: any) => <span>{children}</span>,
  OptionsList: ({ children }: any) => <div>{children}</div>,
  Option: ({ children, onClick }: any) => <div onClick={onClick}>{children}</div>,
}));

vi.mock("@/components/ui/icons/Chevron", () => ({
  default: () => <span>▼</span>,
}));

const items = [
  { id: 1, name: "Hauptzoo" },
  { id: 2, name: "Tannenhain" },
];

const defaultProps = {
  items,
  selectedValue: "all",
  onSelectAction: vi.fn(),
  allLabelKey: "no_region",
  getIdentifier: (item: { id: number; name: string }) => String(item.id),
  renderBadge: (item: { id: number; name: string }) => <span>{item.name}</span>,
};

describe("SelectBoxWithImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("zeigt allLabelKey-Text wenn showLabel=true und kein Element ausgewählt", () => {
    render(<SelectBoxWithImage {...defaultProps} showLabel={true} />);
    expect(screen.getByText("filter.no_region")).toBeInTheDocument();
  });

  test("zeigt – wenn showLabel=false und kein Element ausgewählt", () => {
    render(<SelectBoxWithImage {...defaultProps} showLabel={false} />);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  test("öffnet Dropdown beim Klick und zeigt Optionen", () => {
    render(<SelectBoxWithImage {...defaultProps} />);
    fireEvent.click(screen.getByText("filter.no_region"));
    expect(screen.getByText("Hauptzoo")).toBeInTheDocument();
    expect(screen.getByText("Tannenhain")).toBeInTheDocument();
  });

  test("ruft onSelectAction mit 'all' auf beim Klick auf die erste Option", () => {
    const onSelectAction = vi.fn();
    render(<SelectBoxWithImage {...defaultProps} onSelectAction={onSelectAction} />);
    fireEvent.click(screen.getByText("filter.no_region"));
    fireEvent.click(screen.getAllByText("filter.no_region")[1]);
    expect(onSelectAction).toHaveBeenCalledWith("all");
  });

  test("ruft onSelectAction mit Identifier auf beim Klick auf ein Element", () => {
    const onSelectAction = vi.fn();
    render(<SelectBoxWithImage {...defaultProps} onSelectAction={onSelectAction} />);
    fireEvent.click(screen.getByText("filter.no_region"));
    fireEvent.click(screen.getByText("Hauptzoo"));
    expect(onSelectAction).toHaveBeenCalledWith("1");
  });

  test("zeigt renderAllBadge statt Text wenn übergeben", () => {
    render(
      <SelectBoxWithImage
        {...defaultProps}
        renderAllBadge={() => <img alt="globus" src="/icons/globus.png" />}
      />,
    );
    expect(screen.getByAltText("globus")).toBeInTheDocument();
  });

  test("zeigt ausgewähltes Element-Badge im Header", () => {
    render(<SelectBoxWithImage {...defaultProps} selectedValue="2" />);
    expect(screen.getByText("Tannenhain")).toBeInTheDocument();
  });
});