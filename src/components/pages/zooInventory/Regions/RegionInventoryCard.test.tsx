import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@/utils/test-utils";
import RegionInventoryCard from "./RegionInventoryCard";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock("@/components/page-structure/Card/CardContainer", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/page-structure/Card/CardHeaderRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const baseRegion = {
  id: 1,
  identifier: "MainZoo",
  regionTexts: [{ name: "Hauptzoo" }],
  breedingCenterSlots: [{ slot: 1 }, { slot: 2 }],
  admissionsBooths: [{ booth_level: 1 }, { booth_level: 2 }],
  guestLounges: [{ id: 10 }],
  desingBoutique: [{ id: 20 }],
  clubHouse: [{ id: 30 }],
};

const noOp = () => {};

describe("RegionInventoryCard", () => {
  test("zeigt Zuchtplätze-Select an wenn Region Slots hat", () => {
    render(
      <RegionInventoryCard region={baseRegion} inventory={null} onFieldChange={noOp} />
    );
    expect(screen.getByText("region.inventory.breeding_slots_unlocked")).toBeInTheDocument();
  });

  test("zeigt Zuchtplätze-Select nicht an wenn Region keine Slots hat", () => {
    const region = { ...baseRegion, breedingCenterSlots: [] };
    render(<RegionInventoryCard region={region} inventory={null} onFieldChange={noOp} />);
    expect(screen.queryByText("region.inventory.breeding_slots_unlocked")).not.toBeInTheDocument();
  });

  test("zeigt Eingangskasse-Select an wenn Region Booths hat", () => {
    render(
      <RegionInventoryCard region={baseRegion} inventory={null} onFieldChange={noOp} />
    );
    expect(screen.getByText("region.inventory.admissions_booth_level")).toBeInTheDocument();
  });

  test("zeigt Eingangskasse-Select nicht an wenn Region keine Booths hat", () => {
    const region = { ...baseRegion, admissionsBooths: [] };
    render(<RegionInventoryCard region={region} inventory={null} onFieldChange={noOp} />);
    expect(screen.queryByText("region.inventory.admissions_booth_level")).not.toBeInTheDocument();
  });

  test("zeigt Gästelounge-Checkbox an wenn Region eine Gästelounge hat", () => {
    render(
      <RegionInventoryCard region={baseRegion} inventory={null} onFieldChange={noOp} />
    );
    expect(screen.getByText("region.inventory.guest_lounge")).toBeInTheDocument();
  });

  test("zeigt Gästelounge-Checkbox nicht an wenn Region keine Gästelounge hat", () => {
    const region = { ...baseRegion, guestLounges: [] };
    render(<RegionInventoryCard region={region} inventory={null} onFieldChange={noOp} />);
    expect(screen.queryByText("region.inventory.guest_lounge")).not.toBeInTheDocument();
  });

  test("Eingangskasse-Select enthält die booth_level-Werte der Region", () => {
    const region = { ...baseRegion, breedingCenterSlots: [] }; // nur Booth-Select bleibt
    render(<RegionInventoryCard region={region} inventory={null} onFieldChange={noOp} />);
    const selects = screen.getAllByRole("combobox");
    const options = Array.from(selects[0].querySelectorAll("option")).map((o) => o.value);
    expect(options).toContain("1");
    expect(options).toContain("2");
  });

  test("ruft onFieldChange mit korrekten Werten auf wenn owned-Checkbox geändert wird", () => {
    const onFieldChange = vi.fn();
    render(
      <RegionInventoryCard region={baseRegion} inventory={null} onFieldChange={onFieldChange} />
    );
    const checkbox = screen.getAllByRole("checkbox")[0];
    checkbox.click();
    expect(onFieldChange).toHaveBeenCalledWith(1, "owned", true);
  });

  test("zeigt Designer Boutique-Checkbox an wenn Region eine Designer Boutique hat", () => {
    render(<RegionInventoryCard region={baseRegion} inventory={null} onFieldChange={noOp} />);
    expect(screen.getByText("region.design_boutique")).toBeInTheDocument();
  });

  test("zeigt Designer Boutique-Checkbox nicht an wenn Region keine Designer Boutique hat", () => {
    const region = { ...baseRegion, desingBoutique: [] };
    render(<RegionInventoryCard region={region} inventory={null} onFieldChange={noOp} />);
    expect(screen.queryByText("region.design_boutique")).not.toBeInTheDocument();
  });

  test("zeigt Clubhaus-Checkbox an wenn Region ein Clubhaus hat", () => {
    render(<RegionInventoryCard region={baseRegion} inventory={null} onFieldChange={noOp} />);
    expect(screen.getByText("region.clubhouse")).toBeInTheDocument();
  });

  test("zeigt Clubhaus-Checkbox nicht an wenn Region kein Clubhaus hat", () => {
    const region = { ...baseRegion, clubHouse: [] };
    render(<RegionInventoryCard region={region} inventory={null} onFieldChange={noOp} />);
    expect(screen.queryByText("region.clubhouse")).not.toBeInTheDocument();
  });
});
