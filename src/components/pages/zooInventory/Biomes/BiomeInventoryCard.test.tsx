import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/utils/test-utils";
import BiomeInventoryCard from "./BiomeInventoryCard";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock("@/components/page-structure/Card/CardContainer", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/page-structure/Card/CardHeaderRow", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const baseBiome = {
  id: 1,
  identifier: "grassland",
  biomestext: [{ biomeName: "Grasland" }],
  games: [
    { id: 10, identifier: "play_tree", texts: [{ name: "Kletterbaum" }] },
    { id: 11, identifier: "play_pond", texts: [{ name: "Teich" }] },
  ],
};

const noOp = () => {};

describe("BiomeInventoryCard", () => {
  test("zeigt den Biom-Namen an", () => {
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[0, 1, 2, 3]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    expect(screen.getByText("Grasland")).toBeInTheDocument();
  });

  test("fällt auf biome.identifier zurück wenn kein biomestext vorhanden", () => {
    render(
      <BiomeInventoryCard
        biome={{ ...baseBiome, biomestext: [] }}
        shelterLevels={[]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    expect(screen.getByText("grassland")).toBeInTheDocument();
  });

  test("zeigt Stalllevel-Zeilen nur für übergebene Level an", () => {
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[0, 2]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    expect(screen.getAllByText("biome.inventory.shelter_level")).toHaveLength(2);
    expect(screen.getAllByRole("combobox")).toHaveLength(4); // 2 shelter + 2 games
  });

  test("zeigt keine Stalllevel-Zeilen wenn shelterLevels leer ist", () => {
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    expect(screen.queryByText("biome.inventory.shelter_level")).not.toBeInTheDocument();
  });

  test("zeigt Spielgeräte des Bioms an", () => {
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    expect(screen.getByText("Kletterbaum")).toBeInTheDocument();
    expect(screen.getByText("Teich")).toBeInTheDocument();
  });

  test("zeigt keine Spielgeräte-Sektion wenn Biom keine Spiele hat", () => {
    render(
      <BiomeInventoryCard
        biome={{ ...baseBiome, games: [] }}
        shelterLevels={[]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    expect(screen.queryByText("biome.inventory.games")).not.toBeInTheDocument();
  });

  test("Eingaben sind deaktiviert wenn Gehege nicht angehakt ist", () => {
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[0, 1]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    const selects = screen.getAllByRole("combobox");
    selects.forEach((s) => expect(s).toBeDisabled());
    const checkboxes = screen.getAllByRole("checkbox");
    // first checkbox is enclosure (not disabled), rest are disabled
    expect(checkboxes[1]).toBeDisabled();
    expect(checkboxes[2]).toBeDisabled();
  });

  test("Eingaben sind aktiviert wenn Gehege angehakt ist", () => {
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[0]}
        inventory={{
          enclosure: true,
          trough: false,
          waterHole: false,
          shelterLevel0: 0,
          shelterLevel1: 0,
          shelterLevel2: 0,
          shelterLevel3: 0,
        }}
        gameInventory={new Map()}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    const selects = screen.getAllByRole("combobox");
    selects.forEach((s) => expect(s).not.toBeDisabled());
  });

  test("ruft onFieldChange mit enclosure=true auf wenn Gehege-Checkbox aktiviert wird", () => {
    const onFieldChange = vi.fn();
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[]}
        inventory={null}
        gameInventory={new Map()}
        onFieldChange={onFieldChange}
        onGameChange={noOp}
      />,
    );
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(onFieldChange).toHaveBeenCalledWith(1, "enclosure", true);
  });

  test("ruft onGameChange auf wenn Spielgerät-Select geändert wird", () => {
    const onGameChange = vi.fn();
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[]}
        inventory={{ enclosure: true, trough: false, waterHole: false, shelterLevel0: 0, shelterLevel1: 0, shelterLevel2: 0, shelterLevel3: 0 }}
        gameInventory={new Map([[10, 2]])}
        onFieldChange={noOp}
        onGameChange={onGameChange}
      />,
    );
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "3" } });
    expect(onGameChange).toHaveBeenCalledWith(10, 3);
  });

  test("zeigt gespeicherte Spielgerät-Anzahl aus gameInventory an", () => {
    render(
      <BiomeInventoryCard
        biome={baseBiome}
        shelterLevels={[]}
        inventory={{ enclosure: true, trough: false, waterHole: false, shelterLevel0: 0, shelterLevel1: 0, shelterLevel2: 0, shelterLevel3: 0 }}
        gameInventory={new Map([[10, 5], [11, 3]])}
        onFieldChange={noOp}
        onGameChange={noOp}
      />,
    );
    const selects = screen.getAllByRole("combobox") as HTMLSelectElement[];
    expect(selects[0].value).toBe("5");
    expect(selects[1].value).toBe("3");
  });
});
