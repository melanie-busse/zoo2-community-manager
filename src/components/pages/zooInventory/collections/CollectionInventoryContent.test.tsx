import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/utils/test-utils";
import CollectionInventoryContent from "./CollectionInventoryContent";
import { Collection } from "@/types/collection";

vi.mock("@/utils/CollectionUtil", () => ({
  getRequirementImageSrc: vi.fn((req) => (req.animal ? "/img.jpg" : null)),
  getRequirementLabel: vi.fn(() => ({ name: "Tier", color: null })),
  getRewardLabel: vi.fn(() => ({ name: "Belohnung", color: null })),
  getAnimalImageSrc: vi.fn(() => "/placeholder.png"),
}));

vi.mock("@/components/pages/animals/collections/CollectionsOverviewFilter", () => ({
  default: ({
    onlyCompleted,
    onOnlyCompletedChange,
    onlyOpen,
    onOnlyOpenChange,
    animalSearch,
    onAnimalSearchChange,
    selectedRegionId,
    onRegionChange,
  }: any) => (
    <div>
      <input
        data-testid="only-completed"
        type="checkbox"
        checked={!!onlyCompleted}
        onChange={(e) => onOnlyCompletedChange(e.target.checked)}
      />
      <input
        data-testid="only-open"
        type="checkbox"
        checked={!!onlyOpen}
        onChange={(e) => onOnlyOpenChange(e.target.checked)}
      />
      <input
        data-testid="animal-search"
        value={animalSearch}
        onChange={(e) => onAnimalSearchChange(e.target.value)}
      />
      <select
        data-testid="region-select"
        value={selectedRegionId ?? ""}
        onChange={(e) => onRegionChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Alle</option>
        <option value="1">Region 1</option>
        <option value="2">Region 2</option>
      </select>
    </div>
  ),
}));

vi.mock("./CollectionInventoryCard", () => ({
  default: ({ collection }: any) => (
    <div data-testid={`card-${collection.id}`}>{collection.name}</div>
  ),
}));

const makeAnimal = (id: number, name: string) => ({
  id,
  name,
  identifier: name.toLowerCase(),
  biome: { id: 1, identifier: "grassland", name: "" },
  animaltext: [{ animalName: name }],
});

const makeRequirement = (id: number, withAnimal = true) => ({
  id,
  type: "ANIMAL" as const,
  requiredLevel: null,
  itemName: "",
  sortOrder: 0,
  animal: withAnimal ? makeAnimal(id * 10, `Tier ${id}`) : null,
  specialCoat: null,
  decoration: null,
});

const makeCollection = (id: number, name: string, regionId = 1, stars = 1): Collection => ({
  id,
  identifier: `col-${id}`,
  name,
  stars,
  region: { id: regionId, identifier: "grassland", name: "Grasland" },
  requirements: [makeRequirement(id * 100), makeRequirement(id * 100 + 1)],
  rewardAnimal: null,
  rewardSpecialCoat: null,
});

const regions = [{ id: 1, identifier: "grassland", name: "Grasland" }];

// collection 1: requirements 100, 101 — both completed
const col1 = makeCollection(1, "Kollektion A");
const col1CompletedIds = new Set([100, 101]);

// collection 2: requirements 200, 201 — none completed
const col2 = makeCollection(2, "Kollektion B");
const col2CompletedIds = new Set<number>();

const defaultData = [
  { collection: col1, completedRequirementIds: col1CompletedIds },
  { collection: col2, completedRequirementIds: col2CompletedIds },
];

describe("CollectionInventoryContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("zeigt alle Collections standardmäßig an", () => {
    render(<CollectionInventoryContent data={defaultData} regions={regions} />);

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
  });

  test("Filter 'Abgeschlossene' zeigt nur abgeschlossene Collections", () => {
    render(<CollectionInventoryContent data={defaultData} regions={regions} />);

    fireEvent.click(screen.getByTestId("only-completed"));

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Filter 'Offene' zeigt nur offene Collections", () => {
    render(<CollectionInventoryContent data={defaultData} regions={regions} />);

    fireEvent.click(screen.getByTestId("only-open"));

    expect(screen.queryByTestId("card-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
  });

  test("Filter 'Abgeschlossene' und 'Offene' zusammen zeigen nichts an", () => {
    render(<CollectionInventoryContent data={defaultData} regions={regions} />);

    fireEvent.click(screen.getByTestId("only-completed"));
    fireEvent.click(screen.getByTestId("only-open"));

    expect(screen.queryByTestId("card-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Tiersuche filtert nach Collection-Name des Reward-Tiers", () => {
    const colWithReward: Collection = {
      ...makeCollection(3, "Kollektion C"),
      rewardAnimal: makeAnimal(99, "Löwe"),
    };
    const data = [
      ...defaultData,
      { collection: colWithReward, completedRequirementIds: new Set<number>() },
    ];

    render(<CollectionInventoryContent data={data} regions={regions} />);
    fireEvent.change(screen.getByTestId("animal-search"), { target: { value: "löwe" } });

    expect(screen.queryByTestId("card-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  test("Region-Filter zeigt nur Collections der ausgewählten Region", () => {
    const col3 = makeCollection(3, "Kollektion C", 2);
    const data = [
      ...defaultData,
      { collection: col3, completedRequirementIds: new Set<number>() },
    ];

    render(<CollectionInventoryContent data={data} regions={regions} />);
    fireEvent.change(screen.getByTestId("region-select"), { target: { value: "2" } });

    expect(screen.queryByTestId("card-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-3")).toBeInTheDocument();
  });

  test("zeigt EmptyState wenn keine Collections dem Filter entsprechen", () => {
    render(<CollectionInventoryContent data={defaultData} regions={regions} />);

    fireEvent.click(screen.getByTestId("only-completed"));
    fireEvent.click(screen.getByTestId("only-open"));

    expect(screen.getByText("collections.card.empty")).toBeInTheDocument();
  });
});
