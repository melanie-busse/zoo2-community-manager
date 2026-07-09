import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatForm from "./SpecialCoatsForm";

vi.mock("@/store/useSpecialCoatStore", () => ({
  useSpecialCoatStore: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/components/ui/form/sections/BasicInfoSection", () => ({
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

vi.mock("@/components/ui/form/sections/AnimalSelectSection", () => ({
  default: ({ formData, setFormData }: any) => (
    <div>
      <label htmlFor="animalId">Tier auswählen</label>
      <input
        id="animalId"
        type="number"
        value={formData.animalId || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            animalId: e.target.value ? parseInt(e.target.value, 10) : null,
          })
        }
      />
    </div>
  ),
}));

vi.mock("@/components/ui/form/sections/SpecialCoatTranslationSection", () => ({
  default: () => <div>TranslationSection</div>,
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

vi.mock("@/utils/SpecialCoatUtil", () => ({
  mapSpecialCoatToForm: vi.fn((coat) => coat || { animalId: null, releaseDate: "" }),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockLanguages = [{ code: "de", name: "Deutsch" }];
const mockAnimalData = [{ id: 5, animaltext: [{ animalName: "Löwe" }] }];
const mockOrigins = [{ id: 1, name: "Shop" }];
const mockSpecialCoat = { id: 42, animalId: 5, releaseDate: "2026-03-07" } as any;

describe("SpecialCoatForm Integration Tests", () => {
  const mockSetEditingSpecialCoat = vi.fn();
  const mockClearEditingSpecialCoat = vi.fn();
  const mockSaveSpecialCoat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSpecialCoatStore).mockImplementation((selector) =>
      selector({
        editingSpecialCoat: null,
        setEditingSpecialCoat: mockSetEditingSpecialCoat,
        saveSpecialCoat: mockSaveSpecialCoat,
        clearEditingSpecialCoat: mockClearEditingSpecialCoat,
      } as any),
    );
  });

  test("initialisiert den Store ohne SpecialCoat mit clearEditingSpecialCoat", () => {
    render(
      <SpecialCoatForm
        animalData={mockAnimalData}
        languages={mockLanguages}
        originsData={mockOrigins}
      />,
    );

    expect(mockClearEditingSpecialCoat).toHaveBeenCalledTimes(1);
    expect(mockSetEditingSpecialCoat).not.toHaveBeenCalled();
  });

  test("initialisiert den Store mit vorhandenem SpecialCoat im Edit-Modus", () => {
    render(
      <SpecialCoatForm
        specialCoat={mockSpecialCoat}
        animalData={mockAnimalData}
        languages={mockLanguages}
        originsData={mockOrigins}
      />,
    );

    expect(mockSetEditingSpecialCoat).toHaveBeenCalledWith(mockSpecialCoat);
  });

  test("ruft saveSpecialCoat auf, wenn das Formular abgesendet wird", async () => {
    mockSaveSpecialCoat.mockResolvedValue(42);

    render(
      <SpecialCoatForm
        animalData={mockAnimalData}
        languages={mockLanguages}
        originsData={mockOrigins}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "specialCoat.form.saveSpecialCoat" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSaveSpecialCoat).toHaveBeenCalledTimes(1);
    });
  });

  test("ruft clearEditingSpecialCoat auf, wenn saveSpecialCoat erfolgreich war", async () => {
    mockSaveSpecialCoat.mockResolvedValue(42);

    render(
      <SpecialCoatForm
        animalData={mockAnimalData}
        languages={mockLanguages}
        originsData={mockOrigins}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "specialCoat.form.saveSpecialCoat" }));

    await waitFor(() => {
      expect(mockClearEditingSpecialCoat).toHaveBeenCalled();
    });
  });

  test("navigiert zur SpecialCoat-Übersicht nach erfolgreichem Speichern", async () => {
    mockSaveSpecialCoat.mockResolvedValue(42);

    render(
      <SpecialCoatForm
        animalData={mockAnimalData}
        languages={mockLanguages}
        originsData={mockOrigins}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "specialCoat.form.saveSpecialCoat" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/specialcoats");
    });
  });

  test("ruft clearEditingSpecialCoat NICHT auf, wenn saveSpecialCoat fehlschlägt", async () => {
    mockSaveSpecialCoat.mockResolvedValue(false);

    render(
      <SpecialCoatForm
        animalData={mockAnimalData}
        languages={mockLanguages}
        originsData={mockOrigins}
      />,
    );

    // Init-useEffect hat clearEditingSpecialCoat bereits aufgerufen — Reset vor dem Submit
    vi.clearAllMocks();
    mockSaveSpecialCoat.mockResolvedValue(false);

    fireEvent.click(screen.getByRole("button", { name: "specialCoat.form.saveSpecialCoat" }));

    await waitFor(() => {
      expect(mockSaveSpecialCoat).toHaveBeenCalled();
    });

    expect(mockClearEditingSpecialCoat).not.toHaveBeenCalled();
  });

  test("übergibt die aktuellen Formulardaten an saveSpecialCoat", async () => {
    mockSaveSpecialCoat.mockResolvedValue(42);

    render(
      <SpecialCoatForm
        animalData={mockAnimalData}
        languages={mockLanguages}
        originsData={mockOrigins}
      />,
    );

    const dateInput = screen.getByLabelText("Release Date");
    const animalInput = screen.getByLabelText("Tier auswählen");

    fireEvent.change(dateInput, { target: { value: "2026-08-01" } });
    fireEvent.change(animalInput, { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: "specialCoat.form.saveSpecialCoat" }));

    await waitFor(() => {
      expect(mockSaveSpecialCoat).toHaveBeenCalledWith(
        expect.objectContaining({ releaseDate: "2026-08-01", animalId: 5 }),
      );
    });
  });
});