import { describe, test, expect } from "vitest";
import {
  getRequirementImageSrc,
  getRequirementLabel,
  getRewardLabel,
  getAnimalImageSrc,
} from "./CollectionUtil";
import { Collection, CollectionRequirement } from "@/types/collection";

const biome = { id: 1, identifier: "grassland", name: "" };

const decoReq: CollectionRequirement = {
  id: 10,
  type: "DECORATION",
  requiredLevel: null,
  itemName: "Snowman",
  sortOrder: 0,
  animal: null,
  specialCoat: null,
  decoration: { id: 1, identifier: "snowman", name: "Snowman", category: { identifier: "winter" } },
};

const animalReq: CollectionRequirement = {
  id: 1,
  type: "ANIMAL",
  requiredLevel: 5,
  itemName: "Rabbit",
  sortOrder: 0,
  animal: { id: 108, identifier: "rabbit", name: "Rabbit", biome },
  specialCoat: null,
  decoration: null,
};

const statueReq: CollectionRequirement = {
  id: 2,
  type: "DECORATION",
  requiredLevel: null,
  itemName: "Rabbit Statue",
  sortOrder: 1,
  animal: { id: 108, identifier: "rabbit", name: "Rabbit", biome },
  specialCoat: null,
  decoration: null,
};

const specialCoatReq: CollectionRequirement = {
  id: 3,
  type: "ANIMAL",
  requiredLevel: null,
  itemName: "rabbit_golden",
  sortOrder: 2,
  animal: null,
  decoration: null,
  specialCoat: {
    id: 10,
    animalId: 108,
    identifier: "rabbit_golden",
    releaseDate: "2024-01-01",
    specialcoatstext: [{ id: 1, specialCoatId: 10, languageCode: "de", name: "Goldener Hase", color: "Gold" }],
    animal: { id: 108, identifier: "rabbit", biome },
  },
};

const decoNoAnimalReq: CollectionRequirement = {
  id: 4,
  type: "DECORATION",
  requiredLevel: null,
  itemName: "Christmas Tree",
  sortOrder: 3,
  animal: null,
  specialCoat: null,
  decoration: null,
};

const baseCollection: Collection = {
  id: 1,
  identifier: "test_collection",
  stars: 2,
  name: "Test Collection",
  region: { id: 1, identifier: "grassland", name: "Grasland" },
  requirements: [animalReq],
  rewardAnimal: null,
  rewardSpecialCoat: null,
};

describe("getRequirementImageSrc", () => {
  test("Tier-Requirement → animal image path", () => {
    expect(getRequirementImageSrc(animalReq)).toBe(
      "/images/animals/grassland/rabbit/image.jpg"
    );
  });

  test("Statue-Requirement → statue image path", () => {
    expect(getRequirementImageSrc(statueReq)).toBe(
      "/images/animals/grassland/rabbit/statue/image.webp"
    );
  });

  test("SpecialCoat-Requirement → specialcoat image path", () => {
    expect(getRequirementImageSrc(specialCoatReq)).toBe(
      "/images/animals/grassland/rabbit/specialcoats/golden/image.jpg"
    );
  });

  test("Decoration → decoration image path", () => {
    expect(getRequirementImageSrc(decoReq)).toBe(
      "/images/decorations/winter/snowman/image.jpg"
    );
  });

  test("Deko ohne Tier und ohne Decoration → null", () => {
    expect(getRequirementImageSrc(decoNoAnimalReq)).toBeNull();
  });
});

describe("getRequirementLabel", () => {
  test("Tier → Tiername", () => {
    expect(getRequirementLabel(animalReq)).toEqual({ name: "Rabbit" });
  });

  test("SpecialCoat → Name und Farbe aus specialcoatstext", () => {
    expect(getRequirementLabel(specialCoatReq)).toEqual({ name: "Goldener Hase", color: "Gold" });
  });

  test("SpecialCoat ohne Text → itemName als Fallback", () => {
    const req: CollectionRequirement = {
      ...specialCoatReq,
      specialCoat: { ...specialCoatReq.specialCoat!, specialcoatstext: [] },
    };
    expect(getRequirementLabel(req)).toEqual({ name: "rabbit_golden" });
  });

  test("Decoration → name aus DecorationText", () => {
    expect(getRequirementLabel(decoReq)).toEqual({ name: "Snowman" });
  });

  test("Deko ohne Tier und ohne Decoration → itemName", () => {
    expect(getRequirementLabel(decoNoAnimalReq)).toEqual({ name: "Christmas Tree" });
  });

  test("Tier ohne name → itemName als Fallback", () => {
    const req: CollectionRequirement = {
      ...animalReq,
      animal: { id: 108, identifier: "rabbit", biome },
    };
    expect(getRequirementLabel(req)).toEqual({ name: "Rabbit" });
  });
});

describe("getRewardLabel", () => {
  test("Kein Reward → Collection-Name", () => {
    expect(getRewardLabel(baseCollection)).toEqual({ name: "Test Collection" });
  });

  test("RewardAnimal → Tiername", () => {
    const c: Collection = {
      ...baseCollection,
      rewardAnimal: { id: 108, identifier: "rabbit", name: "Rabbit", biome },
    };
    expect(getRewardLabel(c)).toEqual({ name: "Rabbit" });
  });

  test("RewardAnimal ohne name → identifier als Fallback", () => {
    const c: Collection = {
      ...baseCollection,
      rewardAnimal: { id: 108, identifier: "rabbit", biome },
    };
    expect(getRewardLabel(c)).toEqual({ name: "rabbit" });
  });

  test("RewardSpecialCoat → Name und Farbe aus specialcoatstext", () => {
    const c: Collection = {
      ...baseCollection,
      rewardSpecialCoat: {
        id: 10,
        animalId: 108,
        identifier: "rabbit_golden",
        releaseDate: "2024-01-01",
        specialcoatstext: [{ id: 1, specialCoatId: 10, languageCode: "de", name: "Goldener Hase", color: "Gold" }],
        animal: { id: 108, identifier: "rabbit", biome },
      },
    };
    expect(getRewardLabel(c)).toEqual({ name: "Goldener Hase", color: "Gold" });
  });
});

describe("getAnimalImageSrc", () => {
  test("RewardSpecialCoat → specialcoat image path", () => {
    const c: Collection = {
      ...baseCollection,
      rewardSpecialCoat: {
        id: 10,
        animalId: 108,
        identifier: "rabbit_golden",
        releaseDate: "2024-01-01",
        specialcoatstext: [],
        animal: { id: 108, identifier: "rabbit", biome },
      },
    };
    expect(getAnimalImageSrc(c)).toBe(
      "/images/animals/grassland/rabbit/specialcoats/golden/image.jpg"
    );
  });

  test("RewardAnimal → animal image path", () => {
    const c: Collection = {
      ...baseCollection,
      rewardAnimal: { id: 108, identifier: "rabbit", name: "Rabbit", biome },
    };
    expect(getAnimalImageSrc(c)).toBe("/images/animals/grassland/rabbit/image.jpg");
  });

  test("Kein Reward → erstes Requirement-Bild", () => {
    expect(getAnimalImageSrc(baseCollection)).toBe(
      "/images/animals/grassland/rabbit/image.jpg"
    );
  });

  test("Kein Reward, keine Requirements → placeholder", () => {
    const c: Collection = { ...baseCollection, requirements: [] };
    expect(getAnimalImageSrc(c)).toBe("/placeholder.png");
  });
});