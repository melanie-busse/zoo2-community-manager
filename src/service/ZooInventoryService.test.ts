import { vi, describe, test, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

import {
  getZooInventoryForUser,
  updateZooInventory,
  getZooInventoryAnimalsForUser,
  updateZooInventoryAnimal,
} from "./ZooInventoryService";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    zooInventorySpecialCoat: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    zooInventoryAnimal: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

describe("ZooInventoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getZooInventoryForUser", () => {
    test("gibt Inventar für eine numerische userId zurück", async () => {
      const mockInventory = [
        { id: 1, userid: 42, specialCoatId: 10, count: 1, level10: true, level20: false, glitterAnimal: false, regionId: null },
      ];
      vi.mocked(prisma.zooInventorySpecialCoat.findMany).mockResolvedValue(mockInventory as any);

      const result = await getZooInventoryForUser(42);

      expect(prisma.zooInventorySpecialCoat.findMany).toHaveBeenCalledWith({ where: { userid: 42 } });
      expect(result).toEqual(mockInventory);
    });

    test("parst String-userId zu Number", async () => {
      vi.mocked(prisma.zooInventorySpecialCoat.findMany).mockResolvedValue([]);

      await getZooInventoryForUser("7");

      expect(prisma.zooInventorySpecialCoat.findMany).toHaveBeenCalledWith({ where: { userid: 7 } });
    });

    test("gibt leeres Array zurück bei ungültiger userId", async () => {
      const result = await getZooInventoryForUser("ungültig");

      expect(prisma.zooInventorySpecialCoat.findMany).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("updateZooInventory", () => {
    test("aktualisiert das count-Feld", async () => {
      vi.mocked(prisma.zooInventorySpecialCoat.upsert).mockResolvedValue({} as any);

      await updateZooInventory(1, 5, "count", 2);

      expect(prisma.zooInventorySpecialCoat.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { count: 2 },
          create: expect.objectContaining({ count: 2, level10: false, level20: false, glitterAnimal: false, regionId: null }),
        }),
      );
    });

    test("aktualisiert ein Boolean-Feld (level10)", async () => {
      vi.mocked(prisma.zooInventorySpecialCoat.upsert).mockResolvedValue({} as any);

      await updateZooInventory(1, 5, "level10", true);

      expect(prisma.zooInventorySpecialCoat.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { level10: true },
          create: expect.objectContaining({ level10: true, count: 0, regionId: null }),
        }),
      );
    });

    test("aktualisiert regionId mit einer Zahl", async () => {
      vi.mocked(prisma.zooInventorySpecialCoat.upsert).mockResolvedValue({} as any);

      await updateZooInventory(1, 5, "regionId", 3);

      expect(prisma.zooInventorySpecialCoat.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { regionId: 3 },
          create: expect.objectContaining({ regionId: 3 }),
        }),
      );
    });

    test("aktualisiert regionId mit null", async () => {
      vi.mocked(prisma.zooInventorySpecialCoat.upsert).mockResolvedValue({} as any);

      await updateZooInventory(1, 5, "regionId", null);

      expect(prisma.zooInventorySpecialCoat.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { regionId: null },
          create: expect.objectContaining({ regionId: null }),
        }),
      );
    });

    test("wirft Fehler bei ungültiger userId", async () => {
      await expect(updateZooInventory("ungültig", 5, "count", 1)).rejects.toThrow(
        "Invalid ID provided",
      );
    });

    test("wirft Fehler bei ungültiger specialCoatId", async () => {
      await expect(updateZooInventory(1, "ungültig", "count", 1)).rejects.toThrow(
        "Invalid ID provided",
      );
    });
  });

  // ==========================================
  // getZooInventoryAnimalsForUser
  // ==========================================

  describe("getZooInventoryAnimalsForUser", () => {
    test("gibt Inventar für eine numerische userId zurück", async () => {
      const mockInventory = [
        { id: 1, userid: 42, animalId: 10, count: 1, level10: true, level20: false, glitterAnimal: false, regionId: null },
      ];
      vi.mocked(prisma.zooInventoryAnimal.findMany).mockResolvedValue(mockInventory as any);

      const result = await getZooInventoryAnimalsForUser(42);

      expect(prisma.zooInventoryAnimal.findMany).toHaveBeenCalledWith({ where: { userid: 42 } });
      expect(result).toEqual(mockInventory);
    });

    test("parst String-userId zu Number", async () => {
      vi.mocked(prisma.zooInventoryAnimal.findMany).mockResolvedValue([]);

      await getZooInventoryAnimalsForUser("5");

      expect(prisma.zooInventoryAnimal.findMany).toHaveBeenCalledWith({ where: { userid: 5 } });
    });

    test("gibt leeres Array zurück bei ungültiger userId", async () => {
      const result = await getZooInventoryAnimalsForUser("ungültig");

      expect(prisma.zooInventoryAnimal.findMany).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // updateZooInventoryAnimal
  // ==========================================

  describe("updateZooInventoryAnimal", () => {
    test("aktualisiert das count-Feld", async () => {
      vi.mocked(prisma.zooInventoryAnimal.upsert).mockResolvedValue({} as any);

      await updateZooInventoryAnimal(1, 10, "count", 2);

      expect(prisma.zooInventoryAnimal.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userid_animalId: { userid: 1, animalId: 10 } },
          update: { count: 2 },
          create: expect.objectContaining({ count: 2, level10: false, level20: false, glitterAnimal: false, regionId: null }),
        }),
      );
    });

    test("aktualisiert ein Boolean-Feld (level10)", async () => {
      vi.mocked(prisma.zooInventoryAnimal.upsert).mockResolvedValue({} as any);

      await updateZooInventoryAnimal(1, 10, "level10", true);

      expect(prisma.zooInventoryAnimal.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { level10: true },
          create: expect.objectContaining({ level10: true, count: 0 }),
        }),
      );
    });

    test("aktualisiert regionId mit einer Zahl", async () => {
      vi.mocked(prisma.zooInventoryAnimal.upsert).mockResolvedValue({} as any);

      await updateZooInventoryAnimal(1, 10, "regionId", 5);

      expect(prisma.zooInventoryAnimal.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { regionId: 5 },
          create: expect.objectContaining({ regionId: 5 }),
        }),
      );
    });

    test("aktualisiert regionId mit null", async () => {
      vi.mocked(prisma.zooInventoryAnimal.upsert).mockResolvedValue({} as any);

      await updateZooInventoryAnimal(1, 10, "regionId", null);

      expect(prisma.zooInventoryAnimal.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { regionId: null },
          create: expect.objectContaining({ regionId: null }),
        }),
      );
    });

    test("wirft Fehler bei ungültiger userId", async () => {
      await expect(updateZooInventoryAnimal("ungültig", 10, "count", 1)).rejects.toThrow(
        "Invalid ID provided",
      );
    });

    test("wirft Fehler bei ungültiger animalId", async () => {
      await expect(updateZooInventoryAnimal(1, "ungültig", "count", 1)).rejects.toThrow(
        "Invalid ID provided",
      );
    });

    test("akzeptiert userId und animalId als Strings", async () => {
      vi.mocked(prisma.zooInventoryAnimal.upsert).mockResolvedValue({} as any);

      await updateZooInventoryAnimal("3", "15", "level20", true);

      expect(prisma.zooInventoryAnimal.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userid_animalId: { userid: 3, animalId: 15 } },
        }),
      );
    });
  });
});