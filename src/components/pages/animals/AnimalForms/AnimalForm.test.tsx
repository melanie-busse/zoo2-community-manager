import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useAnimalStore } from "@/store/useAnimalStore";
import AnimalForm from "./AnimalForm";
import { mapAnimalToForm } from "@/utils/AnimalUtil";

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("react-toastify", () => ({
  toast: { warn: vi.fn(), success: vi.fn() },
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { toast } from "react-toastify";

vi.mock("@/components/ui/form/sections/BasicInfoSection", () => ({
  default: () => <div>BasicInfoSection</div>,
}));

vi.mock("@/components/ui/form/sections/EnclosureTypeSection", () => ({
  default: ({ formData, setFormData }: any) => (
    <div>
      <label htmlFor="biomeId">Gehege</label>
      <input
        id="biomeId"
        type="number"
        value={formData.biomeId || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            biomeId: e.target.value ? parseInt(e.target.value, 10) : null,
          })
        }
      />
    </div>
  ),
}));

vi.mock("@/components/ui/form/sections/AnimalTranslationSection", () => ({
  default: () => <div>AnimalTranslationSection</div>,
}));
vi.mock("@/components/ui/form/sections/PriceSection", () => ({
  default: () => <div>PriceSection</div>,
}));
vi.mock("@/components/ui/form/sections/BreedingSection", () => ({
  BreedingSection: () => <div>BreedingSection</div>,
}));
vi.mock("@/components/ui/form/sections/XpActionSection", () => ({
  default: () => <div>XpActionSection</div>,
}));
vi.mock("@/components/ui/form/sections/EnclosureCapacitySection", () => ({
  default: () => <div>EnclosureCapacitySection</div>,
}));
vi.mock("@/components/ui/form/sections/OriginSection", () => ({
  default: () => <div>OriginSection</div>,
}));
vi.mock("@/components/ui/form/sections/FooterSection", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/ui/form/styling/FormGrid", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/ui/form/styling/Column", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/form/SubmitButton", () => ({
  default: ({ label, isSubmitting }: any) => (
    <button type="submit" disabled={isSubmitting}>
      {label}
    </button>
  ),
}));

vi.mock("@/utils/AnimalUtil", () => ({
  mapAnimalToForm: vi.fn((animal) => animal || { biomeId: null, animaltext: [{ languageCode: "de", animalName: "Löwe" }] }),
}));

const mockLanguages = [{ code: "de", name: "Deutsch" }];
const mockBiomes = [{ id: 1, identifier: "savanna", name: "Savanne" }] as any;
const mockOrigins = [{ id: 1, name: "Shop" }];
const mockAnimal = { id: 10, biomeId: 1 } as any;

describe("AnimalForm Integration Tests", () => {
  const mockSetEditingAnimal = vi.fn();
  const mockClearEditingAnimal = vi.fn();
  const mockSaveAnimal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAnimalStore).mockImplementation((selector) =>
      selector({
        editingAnimal: null,
        setEditingAnimal: mockSetEditingAnimal,
        saveAnimal: mockSaveAnimal,
        clearEditingAnimal: mockClearEditingAnimal,
      } as any),
    );
  });

  test("initialisiert den Store ohne Tier mit clearEditingAnimal", () => {
    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    expect(mockClearEditingAnimal).toHaveBeenCalledTimes(1);
    expect(mockSetEditingAnimal).not.toHaveBeenCalled();
  });

  test("initialisiert den Store mit vorhandenem Tier im Edit-Modus", () => {
    render(
      <AnimalForm
        animal={mockAnimal}
        languages={mockLanguages}
        biomes={mockBiomes}
        originsData={mockOrigins}
      />,
    );

    expect(mockSetEditingAnimal).toHaveBeenCalledWith(mockAnimal);
  });

  test("zeigt eine Toast-Warnung und ruft saveAnimal NICHT auf, wenn der deutsche Name fehlt", async () => {
    vi.mocked(mapAnimalToForm).mockReturnValue({ biomeId: null, animaltext: [{ languageCode: "de", animalName: "" }] });

    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith("animal.form.requiredName");
    });

    expect(mockSaveAnimal).not.toHaveBeenCalled();
  });

  test("zeigt eine Toast-Warnung und ruft saveAnimal NICHT auf, wenn biomeId fehlt", async () => {
    vi.mocked(mapAnimalToForm).mockReturnValue({
      biomeId: null,
      animaltext: [{ languageCode: "de", animalName: "Löwe" }],
    });

    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith("animal.form.requiredBiome");
    });

    expect(mockSaveAnimal).not.toHaveBeenCalled();
  });

  test("ruft saveAnimal auf, wenn das Formular mit biomeId abgesendet wird", async () => {
    mockSaveAnimal.mockResolvedValue(99);

    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    fireEvent.change(screen.getByLabelText("Gehege"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(mockSaveAnimal).toHaveBeenCalledTimes(1);
    });
  });

  test("ruft clearEditingAnimal auf, wenn saveAnimal erfolgreich war", async () => {
    mockSaveAnimal.mockResolvedValue(99);

    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    // Init-useEffect hat clearEditingAnimal bereits aufgerufen — Reset vor dem Submit
    vi.clearAllMocks();
    mockSaveAnimal.mockResolvedValue(99);

    fireEvent.change(screen.getByLabelText("Gehege"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(mockClearEditingAnimal).toHaveBeenCalled();
    });
  });

  test("ruft clearEditingAnimal NICHT auf, wenn saveAnimal fehlschlägt", async () => {
    mockSaveAnimal.mockResolvedValue(false);

    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    // Init-useEffect hat clearEditingAnimal bereits aufgerufen — Reset vor dem Submit
    vi.clearAllMocks();
    mockSaveAnimal.mockResolvedValue(false);

    fireEvent.change(screen.getByLabelText("Gehege"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(mockSaveAnimal).toHaveBeenCalled();
    });

    expect(mockClearEditingAnimal).not.toHaveBeenCalled();
  });

  test("navigiert zur Detailseite nach erfolgreichem Speichern (neu)", async () => {
    mockSaveAnimal.mockResolvedValue(99);

    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    fireEvent.change(screen.getByLabelText("Gehege"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/animals/99");
    });
  });

  test("navigiert zur Detailseite nach erfolgreichem Speichern (bearbeiten)", async () => {
    mockSaveAnimal.mockResolvedValue(10);

    render(
      <AnimalForm
        animal={mockAnimal}
        languages={mockLanguages}
        biomes={mockBiomes}
        originsData={mockOrigins}
      />,
    );

    vi.clearAllMocks();
    mockSaveAnimal.mockResolvedValue(10);

    fireEvent.change(screen.getByLabelText("Gehege"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/animals/10");
    });
  });

  test("übergibt die aktuellen Formulardaten an saveAnimal", async () => {
    mockSaveAnimal.mockResolvedValue(99);

    render(
      <AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />,
    );

    fireEvent.change(screen.getByLabelText("Gehege"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "animal.form.saveAnimal" }));

    await waitFor(() => {
      expect(mockSaveAnimal).toHaveBeenCalledWith(
        expect.objectContaining({ biomeId: 3 }),
      );
    });
  });
});