import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/utils/test-utils";
import CollectionsOverviewContent from "./CollectionsOverviewContent";
import { Collection } from "@/types/collection";

vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

vi.mock("@/service/frontend/Collection", () => ({
  deleteCollectionOnClient: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/utils/alerts", () => ({
  confirmDeleteDialog: vi.fn().mockResolvedValue(true),
}));

vi.mock("./CollectionsOverviewFilter", () => ({
  default: ({
    selectedRegionId,
    onRegionChange,
    selectedStars,
    onStarsChange,
    animalSearch,
    onAnimalSearchChange,
    onlyWithStatue,
    onOnlyWithStatueChange,
    onlyWithDecoration,
    onOnlyWithDecorationChange,
  }: any) => (
    <div>
      <select
        data-testid="region-select"
        value={selectedRegionId ?? ""}
        onChange={(e) => onRegionChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Alle</option>
        <option value="1">Region 1</option>
        <option value="2">Region 2</option>
      </select>
      <select
        data-testid="stars-select"
        value={selectedStars ?? ""}
        onChange={(e) => onStarsChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Alle</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <input
        data-testid="animal-search"
        value={animalSearch}
        onChange={(e) => onAnimalSearchChange(e.target.value)}
      />
      <input
        data-testid="only-statue"
        type="checkbox"
        checked={!!onlyWithStatue}
        onChange={(e) => onOnlyWithStatueChange(e.target.checked)}
      />
      <input
        data-testid="only-decoration"
        type="checkbox"
        checked={!!onlyWithDecoration}
        onChange={(e) => onOnlyWithDecorationChange(e.target.checked)}
      />
    </div>
  ),
}));

vi.mock("./CollectionCard", () => ({
  default: ({ collection, onEdit, onDelete }: any) => (
    <div data-testid={`card-${collection.id}`}>
      {collection.name}
      {onEdit && <button data-testid={`edit-${collection.id}`} onClick={onEdit}>Edit</button>}
      {onDelete && <button data-testid={`delete-${collection.id}`} onClick={onDelete}>Delete</button>}
    </div>
  ),
}));

vi.mock("./CollectionForm", () => ({
  default: ({ onClose }: any) => (
    <div data-testid="collection-form">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const makeAnimal = (id: number, name: string) => ({
  id,
  name,
  identifier: name.toLowerCase(),
  biome: { id: 1, identifier: "grassland", name: "" },
  animaltext: [{ animalName: name }],
});

const makeRequirement = (
  id: number,
  overrides: Partial<Collection["requirements"][number]> = {},
): Collection["requirements"][number] => ({
  id,
  type: "ANIMAL",
  requiredLevel: null,
  itemName: "",
  sortOrder: 0,
  animal: makeAnimal(id * 10, `Tier ${id}`),
  specialCoat: null,
  decoration: null,
  statue: null,
  ...overrides,
});

const makeCollection = (
  id: number,
  name: string,
  overrides: Partial<Collection> = {},
): Collection => ({
  id,
  identifier: `col-${id}`,
  name,
  stars: 1,
  rewardVariant: null,
  region: { id: 1, identifier: "grassland", name: "Grasland" },
  requirements: [makeRequirement(id * 100)],
  rewardAnimal: null,
  rewardSpecialCoat: null,
  ...overrides,
});

const regions = [
  { id: 1, identifier: "grassland", name: "Grasland" },
  { id: 2, identifier: "savanna", name: "Savanne" },
];

const defaultProps = {
  isAdmin: false,
  allAnimals: [],
  allStatues: [],
  allRegions: [],
  allRawCollections: [],
};

const adminProps = {
  isAdmin: true,
  allAnimals: [],
  allStatues: [],
  allRegions: [],
  allRawCollections: [],
};

describe("CollectionsOverviewContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("zeigt alle Collections standardmäßig an", () => {
    const collections = [makeCollection(1, "Kollektion A"), makeCollection(2, "Kollektion B")];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
  });

  test("Region-Filter zeigt nur Collections der gewählten Region", () => {
    const collections = [
      makeCollection(1, "Kollektion A", { region: { id: 1, identifier: "grassland", name: "Grasland" } }),
      makeCollection(2, "Kollektion B", { region: { id: 2, identifier: "savanna", name: "Savanne" } }),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("region-select"), { target: { value: "1" } });

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Sterne-Filter zeigt nur Collections mit der gewählten Anzahl Sterne", () => {
    const collections = [
      makeCollection(1, "Kollektion A", { stars: 1 }),
      makeCollection(2, "Kollektion B", { stars: 2 }),
      makeCollection(3, "Kollektion C", { stars: 3 }),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("stars-select"), { target: { value: "2" } });

    expect(screen.queryByTestId("card-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
    expect(screen.queryByTestId("card-3")).not.toBeInTheDocument();
  });

  test("Tiersuche filtert nach Belohnungs-Tier", () => {
    const collections = [
      makeCollection(1, "Kollektion A", { rewardAnimal: makeAnimal(99, "Löwe") }),
      makeCollection(2, "Kollektion B"),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("animal-search"), { target: { value: "löwe" } });

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Tiersuche filtert nach Belohnungs-Farbvariante", () => {
    const collections = [
      makeCollection(1, "Kollektion A", {
        rewardSpecialCoat: {
          id: 5,
          name: "Silberlöwe",
          specialcoatstext: [{ name: "Silberlöwe", color: "Silber" }],
        } as any,
      }),
      makeCollection(2, "Kollektion B"),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("animal-search"), { target: { value: "silber" } });

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Tiersuche filtert nach Requirement-Tier", () => {
    const collections = [
      makeCollection(1, "Kollektion A", {
        requirements: [makeRequirement(10, { animal: makeAnimal(99, "Zebra") })],
      }),
      makeCollection(2, "Kollektion B", {
        requirements: [makeRequirement(20, { animal: makeAnimal(88, "Giraffe") })],
      }),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("animal-search"), { target: { value: "zebra" } });

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Tiersuche filtert nach Requirement-Farbvariante", () => {
    const collections = [
      makeCollection(1, "Kollektion A", {
        requirements: [
          makeRequirement(10, {
            animal: null,
            specialCoat: {
              id: 3,
              specialcoatstext: [{ name: "Goldlöwe", color: "Gold" }],
            } as any,
          }),
        ],
      }),
      makeCollection(2, "Kollektion B"),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("animal-search"), { target: { value: "gold" } });

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Statue-Filter zeigt nur Collections mit Statue-Requirement", () => {
    const collections = [
      makeCollection(1, "Kollektion A", {
        requirements: [makeRequirement(10, { type: "DECORATION", animal: makeAnimal(99, "Löwe") })],
      }),
      makeCollection(2, "Kollektion B", {
        requirements: [makeRequirement(20)],
      }),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.click(screen.getByTestId("only-statue"));

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("Dekoration-Filter zeigt nur Collections mit Dekoration-Requirement", () => {
    const decoration = { id: 1, identifier: "winter-lamp", name: "Winterlampe", category: { identifier: "winter" } };
    const collections = [
      makeCollection(1, "Kollektion A", {
        requirements: [makeRequirement(10, { decoration })],
      }),
      makeCollection(2, "Kollektion B"),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.click(screen.getByTestId("only-decoration"));

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
  });

  test("zeigt EmptyState wenn keine Collection dem Filter entspricht", () => {
    const collections = [makeCollection(1, "Kollektion A", { stars: 1 })];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("stars-select"), { target: { value: "3" } });

    expect(screen.queryByTestId("card-1")).not.toBeInTheDocument();
    expect(screen.getByText("collections.card.empty")).toBeInTheDocument();
  });

  test("mehrere Filter kombiniert", () => {
    const collections = [
      makeCollection(1, "Kollektion A", {
        stars: 2,
        region: { id: 1, identifier: "grassland", name: "Grasland" },
        rewardAnimal: makeAnimal(99, "Löwe"),
      }),
      makeCollection(2, "Kollektion B", {
        stars: 2,
        region: { id: 1, identifier: "grassland", name: "Grasland" },
      }),
      makeCollection(3, "Kollektion C", {
        stars: 1,
        region: { id: 1, identifier: "grassland", name: "Grasland" },
        rewardAnimal: makeAnimal(98, "Löwe"),
      }),
    ];

    render(<CollectionsOverviewContent collections={collections} regions={regions} {...defaultProps} />);
    fireEvent.change(screen.getByTestId("stars-select"), { target: { value: "2" } });
    fireEvent.change(screen.getByTestId("animal-search"), { target: { value: "löwe" } });

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-2")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-3")).not.toBeInTheDocument();
  });

  // Admin controls
  test("zeigt Create-Button für Admins", () => {
    render(<CollectionsOverviewContent collections={[]} regions={[]} {...adminProps} />);
    expect(screen.getByTestId("create-collection-btn")).toBeInTheDocument();
  });

  test("zeigt keine Admin-Controls für Non-Admins", () => {
    const collections = [makeCollection(1, "Test")];
    render(<CollectionsOverviewContent collections={collections} regions={[]} {...defaultProps} />);
    expect(screen.queryByTestId("create-collection-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-1")).not.toBeInTheDocument();
  });

  test("zeigt Edit- und Delete-Buttons auf Cards für Admins", () => {
    const collections = [makeCollection(1, "Test")];
    render(<CollectionsOverviewContent collections={collections} regions={[]} {...adminProps} />);
    expect(screen.getByTestId("edit-1")).toBeInTheDocument();
    expect(screen.getByTestId("delete-1")).toBeInTheDocument();
  });

  test("öffnet CollectionForm beim Klick auf Create-Button", () => {
    render(<CollectionsOverviewContent collections={[]} regions={[]} {...adminProps} />);
    fireEvent.click(screen.getByTestId("create-collection-btn"));
    expect(screen.getByTestId("collection-form")).toBeInTheDocument();
  });

  test("öffnet CollectionForm beim Klick auf Edit-Button", () => {
    const collections = [makeCollection(1, "Test")];
    render(<CollectionsOverviewContent collections={collections} regions={[]} {...adminProps} />);
    fireEvent.click(screen.getByTestId("edit-1"));
    expect(screen.getByTestId("collection-form")).toBeInTheDocument();
  });
});
