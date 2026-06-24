import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useAnimalStore } from "@/store/useAnimalStore";
import { toast } from "react-toastify";
import AnimalForm from "./AnimalForm";

vi.mock("@/store/useAnimalStore", () => ({
  useAnimalStore: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    warn: vi.fn(),
  },
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    return (key: string) => `${namespace}.${key}`;
  },
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("./AnimalForms.style", () => ({
  FormGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Column: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FooterSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SectionColumn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ActionRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InputsContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock("./BasicInfoSection", () => ({
  default: ({ formData, setFormData }: any) => (
    <div>
      <label htmlFor="releaseDate">Release Date</label>
      <input
        id="releaseDate"
        type="date"
        value={formData.releaseDate || ""}
        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
      />
    </div>
  ),
}));

vi.mock("./EnclosureTypeSection", () => ({
  default: ({ formData, setFormData }: any) => (
    <div>
      <label htmlFor="biomeId">Gehegetyp</label>
      <select
        id="biomeId"
        value={formData.biomeId || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            biomeId: e.target.value ? parseInt(e.target.value, 10) : null,
          })
        }
      >
        <option value="">Bitte wählen</option>
        <option value="1">Grasland</option>
      </select>
    </div>
  ),
}));

vi.mock("./PriceSection", () => ({ default: () => <div>PriceSection</div> }));
vi.mock("./BreedingSection", () => ({ default: () => <div>BreedingSection</div> }));
vi.mock("./XpActionSection", () => ({ default: () => <div>XpActionSection</div> }));
vi.mock("./EnclosureCapacitySection", () => ({ default: () => <div>CapacitySection</div> }));
vi.mock("./OriginSection", () => ({ default: () => <div>OriginSection</div> }));
vi.mock("@/components/pages/animals/AnimalForms/TranslationSection", () => ({
  default: () => <div>TranslationSection</div>,
}));

vi.mock("@/components/ui/form/SubmitButton", () => ({
  default: ({ label, isSubmitting }: any) => (
    <button type="submit" disabled={isSubmitting}>
      {label}
    </button>
  ),
}));

vi.mock("@/utils/AnimalUtil", () => ({
  mapAnimalToForm: vi.fn((animal) => animal || { biomeId: null, releaseDate: "" }),
}));

const mockLanguages = [{ code: "de", name: "Deutsch" }];
const mockBiomes = [{ id: 1, biomestext: [{ biomeName: "Grasland" }] }] as any;
const mockOrigins = [{ id: 1, name: "Shop" }];
const mockAnimal = { id: 99, biomeId: 1, releaseDate: "2026-03-07" } as any;

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
    render(<AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />);
    expect(mockClearEditingAnimal).toHaveBeenCalledTimes(1);
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

  test("zeigt eine Warnung (Toast), wenn versucht wird ohne Gehege/Biome zu speichern", async () => {
    render(<AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />);

    const submitBtn = screen.getByRole("button", { name: "Animals.form.saveAnimal" });
    fireEvent.click(submitBtn);

    expect(toast.warn).toHaveBeenCalledWith("Bitte wähle ein Gehege aus!");
    expect(mockSaveAnimal).not.toHaveBeenCalled();
  });

  test("ruft saveAnimal auf und leert den Store bei erfolgreichem Submit", async () => {
    mockSaveAnimal.mockResolvedValue(true); // Erfolg simulieren

    render(<AnimalForm languages={mockLanguages} biomes={mockBiomes} originsData={mockOrigins} />);

    const dateInput = screen.getByLabelText("Release Date");
    const biomeSelect = screen.getByLabelText("Gehegetyp");

    fireEvent.change(dateInput, { target: { value: "2026-06-24" } });
    fireEvent.change(biomeSelect, { target: { value: "1" } }); // Biom ID 1 auswählen

    const submitBtn = screen.getByRole("button", { name: "Animals.form.saveAnimal" });
    fireEvent.click(submitBtn);

    expect(mockSaveAnimal).toHaveBeenCalledWith({
      biomeId: 1,
      releaseDate: "2026-06-24",
    });

    await waitFor(() => {
      expect(mockClearEditingAnimal).toHaveBeenCalled();
    });
  });
});
