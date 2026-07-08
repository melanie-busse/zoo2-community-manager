import { describe, test, expect } from "vitest";
import { getSpecialCoatImage } from "./SpecialCoatUtil"; // Passe den Pfad an dein Projekt an
import { SpecialCoat } from "@/types/specialCoat";

describe("getSpecialCoatImage", () => {
  test("sollte das korrekte Image-Objekt zurückgeben, wenn ein Bild und Text vorhanden sind", () => {
    const mockSpecialCoat = {
      image: "polar-fox.png",
      specialcoatstext: [
        {
          name: "Polarfuchs",
        },
      ],
    } as SpecialCoat;

    const result = getSpecialCoatImage(mockSpecialCoat);

    expect(result).toEqual({
      name: "polar-fox.png",
      path: "/images/specialCoat/polar-fox.png",
      alt: "Polarfuchs",
    });
  });

  test("sollte auf Fallbacks zurückgreifen, wenn image und specialcoatstext fehlen", () => {
    const mockSpecialCoat = {
      image: null,
      specialcoatstext: [],
    } as unknown as SpecialCoat;

    const result = getSpecialCoatImage(mockSpecialCoat);

    expect(result).toEqual({
      name: "placeholder.png",
      path: "/images/specialCoat/null", // Da template literal: specialCoat.image ist null
      alt: "Tierbild",
    });
  });

  test("sollte den Fallback-Alt-Text nutzen, wenn specialcoatstext zwar existiert, aber leer ist", () => {
    const mockSpecialCoat = {
      image: "zebra.png",
      specialcoatstext: [
        {
          name: "", // Leerer Name
        },
      ],
    } as SpecialCoat;

    const result = getSpecialCoatImage(mockSpecialCoat);

    expect(result.alt).toBe("Tierbild");
  });
});
