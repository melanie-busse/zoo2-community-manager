import { describe, test, expect } from "vitest";
import { mapRegionToForm } from "./RegionUtil";

const LANGS = [{ code: "de", name: "Deutsch" }, { code: "en", name: "English" }];

describe("mapRegionToForm", () => {
  test("null region: gibt leeres Formular mit allen Sprachen zurück", () => {
    const result = mapRegionToForm(null, LANGS);
    expect(result.identifier).toBe("");
    expect(result.regionTexts).toHaveLength(2);
    expect(result.regionTexts[0]).toEqual({ languageCode: "de", name: "" });
    expect(result.hasGuestLounge).toBe(false);
    expect(result.priceTypeId).toBe("1");
    expect(result.breedingCenterSlots).toEqual([]);
    expect(result.admissionsBooths).toEqual([]);
  });

  test("existierende Region: mappt alle Felder korrekt", () => {
    const region = {
      id: 1, identifier: "MainZoo",
      releasedate: new Date("2018-03-27"),
      unlocklevel: 0, price: 0, priceTypeId: 1,
      regionTexts: [{ languageCode: "de", name: "Hauptzoo" }],
      breedingCenters: [{ price: 10000, pricetype: 1 }],
      breedingCenterSlots: [{ slot: 1, price: 0, pricetype: 1 }],
      admissionsBooths: [{ booth_level: 0, max_capacity: 2000, upgrade: 0, pricetype: 1 }],
      adminBuildings: [{ price: 20000, pricetype: 1 }],
      visitorCenters: [{ price: 5000, pricetype: 1 }],
      transportStation: [{ price: 3000, pricetype: 1 }],
      guestLounges: [],
    };
    const result = mapRegionToForm(region, LANGS);
    expect(result.id).toBe(1);
    expect(result.identifier).toBe("MainZoo");
    expect(result.releasedate).toBe("2018-03-27");
    expect(result.regionTexts.find(t => t.languageCode === "de")?.name).toBe("Hauptzoo");
    expect(result.regionTexts.find(t => t.languageCode === "en")?.name).toBe("");
    expect(result.breedingCenter.price).toBe("10000");
    expect(result.breedingCenter.pricetype).toBe("1");
    expect(result.breedingCenterSlots).toHaveLength(1);
    expect(result.hasGuestLounge).toBe(false);
  });

  test("Region mit GuestLounge: hasGuestLounge ist true und Preis gemappt", () => {
    const region = {
      id: 2, identifier: "FirGrove", releasedate: new Date(),
      unlocklevel: 30, price: 50, priceTypeId: 2,
      regionTexts: [], breedingCenters: [], breedingCenterSlots: [],
      admissionsBooths: [], adminBuildings: [], visitorCenters: [],
      transportStation: [], guestLounges: [{ price: 100, pricetype: 2 }],
    };
    const result = mapRegionToForm(region, LANGS);
    expect(result.hasGuestLounge).toBe(true);
    expect(result.guestLounge.price).toBe("100");
    expect(result.guestLounge.pricetype).toBe("2");
  });
});
