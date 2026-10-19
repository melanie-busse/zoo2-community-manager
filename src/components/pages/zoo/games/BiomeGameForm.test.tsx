import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

const mockPush = vi.fn();
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUpdateBiomeGameOnClient = vi.fn();
const mockCreateBiomeGameOnClient = vi.fn();
vi.mock("@/service/frontend/BiomeGame", () => ({
  updateBiomeGameOnClient: (...args: any[]) => mockUpdateBiomeGameOnClient(...args),
  createBiomeGameOnClient: (...args: any[]) => mockCreateBiomeGameOnClient(...args),
}));

vi.mock("@/components/page-structure/Elements/InfoAccordion", () => ({
  default: ({ title, children }: any) => (
    <div>
      <span>{title}</span>
      {children}
    </div>
  ),
}));
vi.mock("@/components/ui/form/styling/FormGrid", () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock("@/components/ui/form/styling/Column", () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock("@/components/ui/form/styling/SectionColumn", () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock("@/components/ui/form/styling/FormGroup", () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock("@/components/ui/form/styling/FormRow", () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock("@/components/ui/form/Label", () => ({
  default: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock("@/components/ui/form/InputField", () => ({
  default: ({ id, value, onChange, disabled, type }: any) => (
    <input id={id} type={type ?? "text"} value={value} onChange={onChange} disabled={disabled} />
  ),
}));
vi.mock("@/components/ui/form/Selectbox", () => ({
  default: ({ id, value, onChange, options }: any) => (
    <select id={id} value={value} onChange={onChange}>
      {options?.map((o: any) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  ),
}));
vi.mock("@/components/ui/form/SubmitButton", () => ({
  default: ({ label, isSubmitting }: any) => (
    <button type="submit" disabled={isSubmitting}>{label}</button>
  ),
}));

import { toast } from "react-toastify";
import BiomeGameForm from "./BiomeGameForm";

const mockLanguages = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
];

const mockGame = {
  id: 3,
  identifier: "play_pond",
  biomeIdentifier: "grassland",
  price: 200,
  pricetype: 1,
  repair: 50,
  repairpricetype: 2,
  texts: [
    { languageCode: "de", name: "Teich" },
    { languageCode: "en", name: "Pond" },
  ],
};

describe("BiomeGameForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert den Identifier als disabled Input", () => {
    render(<BiomeGameForm game={mockGame} languages={mockLanguages} biomes={[]} />);
    const identifierInput = screen.getByDisplayValue("play_pond");
    expect(identifierInput).toBeDisabled();
  });

  test("zeigt vorhandene Texte in den Übersetzungsfeldern an", () => {
    render(<BiomeGameForm game={mockGame} languages={mockLanguages} biomes={[]} />);
    expect(screen.getByDisplayValue("Teich")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pond")).toBeInTheDocument();
  });

  test("zeigt leere Felder für Sprachen ohne Text", () => {
    const gameWithoutEn = { ...mockGame, texts: [{ languageCode: "de", name: "Teich" }] };
    render(<BiomeGameForm game={gameWithoutEn} languages={mockLanguages} biomes={[]} />);
    const inputs = screen.getAllByRole("textbox");
    const emptyTextInput = inputs.find((el) => (el as HTMLInputElement).value === "");
    expect(emptyTextInput).toBeInTheDocument();
  });

  test("ruft updateBiomeGameOnClient beim Submit mit korrekten Daten auf", async () => {
    mockUpdateBiomeGameOnClient.mockResolvedValue({ id: 3 });
    render(<BiomeGameForm game={mockGame} languages={mockLanguages} biomes={[]} />);

    fireEvent.submit(screen.getByRole("button", { name: /game\.form\.save_game/i }).closest("form")!);

    await waitFor(() => {
      expect(mockUpdateBiomeGameOnClient).toHaveBeenCalledWith(3, {
        identifier: "play_pond",
        biomeIdentifier: "grassland",
        price: 200,
        pricetype: 1,
        repair: 50,
        repairpricetype: 2,
        texts: [
          { languageCode: "de", name: "Teich" },
          { languageCode: "en", name: "Pond" },
        ],
      });
    });
  });

  test("zeigt Success-Toast und navigiert nach /zoo/games bei Erfolg", async () => {
    mockUpdateBiomeGameOnClient.mockResolvedValue({ id: 3 });
    render(<BiomeGameForm game={mockGame} languages={mockLanguages} biomes={[]} />);

    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("game.form.messages.editSuccess");
      expect(mockPush).toHaveBeenCalledWith("/zoo/games");
    });
  });

  test("zeigt Error-Toast bei fehlgeschlagenem API-Call", async () => {
    mockUpdateBiomeGameOnClient.mockRejectedValue(new Error("Server error"));
    render(<BiomeGameForm game={mockGame} languages={mockLanguages} biomes={[]} />);

    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });

  test("deaktiviert den Submit-Button während des Speicherns", async () => {
    let resolve: (v: any) => void;
    mockUpdateBiomeGameOnClient.mockReturnValue(new Promise((r) => { resolve = r; }));
    render(<BiomeGameForm game={mockGame} languages={mockLanguages} biomes={[]} />);

    const button = screen.getByRole("button");
    fireEvent.submit(button.closest("form")!);

    await waitFor(() => expect(button).toBeDisabled());
    resolve!({ id: 3 });
  });
});

describe("BiomeGameForm — Create-Modus (kein game prop)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendert leere Felder ohne game prop", () => {
    render(<BiomeGameForm languages={mockLanguages} biomes={[]} />);
    const textInputs = screen.getAllByRole("textbox");
    const emptyInputs = textInputs.filter((el) => (el as HTMLInputElement).value === "");
    expect(emptyInputs.length).toBeGreaterThan(0);
  });

  test("zeigt Warn-Toast wenn Identifier leer ist", async () => {
    render(<BiomeGameForm languages={mockLanguages} biomes={[]} />);
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith("game.form.messages.requiredIdentifier");
    });
    expect(mockCreateBiomeGameOnClient).not.toHaveBeenCalled();
  });

  test("ruft createBiomeGameOnClient beim Submit auf", async () => {
    mockCreateBiomeGameOnClient.mockResolvedValue({ id: 99 });
    render(<BiomeGameForm languages={mockLanguages} biomes={[]} />);

    fireEvent.change(screen.getByLabelText("game.identifier"), { target: { value: "play_new" } });
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(mockCreateBiomeGameOnClient).toHaveBeenCalledWith(
        expect.objectContaining({ identifier: "play_new" }),
      );
    });
  });

  test("zeigt Success-Toast und navigiert nach /zoo/games bei Erfolg", async () => {
    mockCreateBiomeGameOnClient.mockResolvedValue({ id: 99 });
    render(<BiomeGameForm languages={mockLanguages} biomes={[]} />);

    fireEvent.change(screen.getByLabelText("game.identifier"), { target: { value: "play_new" } });
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("game.form.messages.createSuccess");
      expect(mockPush).toHaveBeenCalledWith("/zoo/games");
    });
  });
});
