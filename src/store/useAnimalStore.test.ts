import { describe, test, expect, vi, beforeEach } from "vitest";
import { useAnimalStore } from "./useAnimalStore"; // Pfad anpassen
import { Animal } from "@/types/animal";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// 1. Externe UI-Bibliotheken mocken
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// 2. Mock-Daten bereitstellen
const mockAnimalsList = [
  {
    id: 1,
    name: "Erdmännchen",
    shelterLevel: 2,
    biome: { name: "Grasland" },
    animaltext: [{ animalName: "Erdmännchen" }],
  },
  {
    id: 2,
    name: "Löwe",
    shelterLevel: 5,
    biome: { name: "Savanne" },
    animaltext: [{ animalName: "Löwe" }],
  },
] as unknown as Animal[];

describe("useAnimalStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 💡 WICHTIG: Store vor jedem Test manuell auf die Initialwerte zurücksetzen
    useAnimalStore.setState({
      allAnimals: [],
      currentItems: [],
      filteredCount: 0,
      searchTerm: "",
      selectedBiome: "all",
      selectedLevel: "all",
      sortBy: "name",
      sortDirection: "asc",
      currentPage: 1,
      selectedAnimal: null,
      editingAnimal: null,
    });
  });

  // ==========================================
  // LISTE & PIPELINE TESTS
  // ==========================================
  test("setInitialAnimals befüllt die Listen und lässt die Pipeline laufen", () => {
    const store = useAnimalStore.getState();

    store.setInitialAnimals(mockAnimalsList);

    const updatedStore = useAnimalStore.getState();
    expect(updatedStore.allAnimals).toHaveLength(2);
    expect(updatedStore.currentItems).toHaveLength(2);
    expect(updatedStore.filteredCount).toBe(2);
  });

  test("setSearchTerm filtert die Liste live über die Pipeline", () => {
    useAnimalStore.getState().setInitialAnimals(mockAnimalsList);

    // Suchbegriff setzen
    useAnimalStore.getState().setSearchTerm("Löwe");

    const updatedStore = useAnimalStore.getState();
    expect(updatedStore.searchTerm).toBe("Löwe");
    expect(updatedStore.currentItems).toHaveLength(1);
    expect(updatedStore.currentItems[0].id).toBe(2); // Nur der Löwe bleibt übrig
    expect(updatedStore.filteredCount).toBe(1);
  });

  test("resetFilters setzt alle Filter-Zustände auf die Standardwerte zurück", () => {
    useAnimalStore.getState().setInitialAnimals(mockAnimalsList);
    useAnimalStore.getState().setSearchTerm("Löwe");

    // Reset ausführen
    useAnimalStore.getState().resetFilters();

    const updatedStore = useAnimalStore.getState();
    expect(updatedStore.searchTerm).toBe("");
    expect(updatedStore.currentItems).toHaveLength(2); // Beide Tiere wieder da
  });

  // ==========================================
  // API / ASYNC ACTION TESTS
  // ==========================================
  test("saveAnimal (POST) fügt ein neues Tier bei erfolgreichem API-Response hinzu", async () => {
    const newAnimal = { id: 3, animaltext: [{ animalName: "Pinguin" }] };

    // Globalen Fetch-Handler mocken für erfolgreiches Erstellen
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => newAnimal,
    });

    const success = await useAnimalStore.getState().saveAnimal({ id: null, name: "Pinguin" });

    expect(success).toBe(true);
    expect(fetch).toHaveBeenCalledWith("/api/animals", expect.any(Object));
    expect(toast.success).toHaveBeenCalledWith("Tier erfolgreich erstellt!");
    expect(useAnimalStore.getState().allAnimals).toContainEqual(newAnimal);
  });

  test("deleteAnimal bricht ab, wenn der User den SweetAlert-Dialog verneint", async () => {
    // Simulieren, dass der User auf "Abbrechen" klickt
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as any);
    const mockT = (key: string) => key;

    const result = await useAnimalStore.getState().deleteAnimal(1, mockT);

    expect(result).toBe(false);
    expect(Swal.fire).toHaveBeenCalled();
    // Es darf kein API-Fetch stattgefunden haben
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("deleteAnimal löscht das Tier aus dem State, wenn die API ok zurückgibt", async () => {
    // 1. Initial-Zustand mit Tieren füllen
    useAnimalStore.getState().setInitialAnimals(mockAnimalsList);

    // 2. User bestätigt das Löschen im Dialog
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);

    // 3. API gibt ein erfolgreiches DELETE zurück
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    const mockT = (key: string) => key;

    const result = await useAnimalStore.getState().deleteAnimal(1, mockT);

    expect(result).toBe(true);
    expect(toast.success).toHaveBeenCalled();
    // Erdmännchen (ID 1) sollte nun aus der Liste verschwunden sein
    expect(useAnimalStore.getState().allAnimals).toHaveLength(1);
    expect(useAnimalStore.getState().allAnimals[0].id).toBe(2);
  });
});
