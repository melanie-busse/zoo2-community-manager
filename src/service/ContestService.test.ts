import { describe, test, expect, vi, beforeEach } from "vitest";

import prisma from "@/lib/prisma";
import {
  getContestSpecialCoats,
  getAllContests,
  createContest,
  updateContest,
  deleteContest,
  getAllStatues,
  getContestById,
  getResultsByContestId,
  getMembers,
  getEntriesByContestAndUser,
  createContestEntries,
} from "@/service/ContestService";

vi.mock("@/lib/prisma", () => ({
  default: {
    specialCoat: { findMany: vi.fn() },
    contest: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    animal: { findMany: vi.fn() },
    contestDonation: { findMany: vi.fn(), createMany: vi.fn() },
    user: { findMany: vi.fn() },
  },
}));

const prismaMock = prisma as any;

describe("ContestService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // getContestSpecialCoats
  // ==========================================

  describe("getContestSpecialCoats", () => {
    test("ruft findMany mit isContestSpecialCoat-Filter und Locale auf", async () => {
      prismaMock.specialCoat.findMany.mockResolvedValue([]);

      await getContestSpecialCoats("en");

      expect(prismaMock.specialCoat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isContestSpecialCoat: true },
          include: expect.objectContaining({
            specialcoatstext: { where: { languageCode: "en" } },
          }),
          orderBy: { id: "asc" },
        }),
      );
    });

    test('verwendet "de" als Standard-Locale', async () => {
      prismaMock.specialCoat.findMany.mockResolvedValue([]);

      await getContestSpecialCoats();

      expect(prismaMock.specialCoat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            specialcoatstext: { where: { languageCode: "de" } },
          }),
        }),
      );
    });
  });

  // ==========================================
  // getAllContests
  // ==========================================

  describe("getAllContests", () => {
    test("sortiert aktive Contests vor inaktiven", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-06-15"));

      const mockContests = [
        { id: 1, startDate: "2026-01-01", endDate: "2026-03-31", conteststatue: [], contestspecialcoat: [] },
        { id: 2, startDate: "2026-06-01", endDate: "2026-12-31", conteststatue: [], contestspecialcoat: [] }, // aktiv
      ];
      prismaMock.contest.findMany.mockResolvedValue(mockContests);

      const result = await getAllContests();

      expect(result[0].id).toBe(2); // aktiver zuerst
      expect(result[1].id).toBe(1);

      vi.useRealTimers();
    });

    test("sortiert inaktive Contests nach Startdatum absteigend", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2027-01-01"));

      const mockContests = [
        { id: 1, startDate: "2026-01-01", endDate: "2026-03-31", conteststatue: [], contestspecialcoat: [] },
        { id: 2, startDate: "2026-06-01", endDate: "2026-09-30", conteststatue: [], contestspecialcoat: [] },
      ];
      prismaMock.contest.findMany.mockResolvedValue(mockContests);

      const result = await getAllContests();

      expect(result[0].id).toBe(2); // späterer Startdatum zuerst
      expect(result[1].id).toBe(1);

      vi.useRealTimers();
    });

    test("gibt ein leeres Array zurück, wenn keine Contests vorhanden", async () => {
      prismaMock.contest.findMany.mockResolvedValue([]);

      const result = await getAllContests();

      expect(result).toHaveLength(0);
    });
  });

  // ==========================================
  // createContest
  // ==========================================

  describe("createContest", () => {
    test("erstellt einen Contest mit Statuen und SpecialCoats", async () => {
      prismaMock.animal.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      prismaMock.contest.create.mockResolvedValue({ id: 10 });

      const data = {
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        active: true,
        statuenIds: [1, 2],
        specialCoatIds: [5],
      };

      const result = await createContest(data);

      expect(prismaMock.contest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-12-31"),
            active: 1,
            conteststatue: { create: [{ animalId: 1 }, { animalId: 2 }] },
            contestspecialcoat: { create: [{ specialCoatId: 5 }] },
          }),
        }),
      );
      expect(result).toEqual({ id: 10 });
    });

    test("erstellt Contest ohne SpecialCoats wenn specialCoatIds fehlt", async () => {
      prismaMock.animal.findMany.mockResolvedValue([{ id: 1 }]);
      prismaMock.contest.create.mockResolvedValue({ id: 11 });

      const data = {
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        active: false,
        statuenIds: [1],
      };

      await createContest(data);

      expect(prismaMock.contest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            active: 0,
            contestspecialcoat: { create: [] },
          }),
        }),
      );
    });
  });

  // ==========================================
  // updateContest
  // ==========================================

  describe("updateContest", () => {
    test("aktualisiert Contest und ersetzt Statuen und SpecialCoats", async () => {
      prismaMock.contest.update.mockResolvedValue({ id: 1 });

      const data = {
        startDate: "2026-03-01",
        endDate: "2026-09-30",
        active: true,
        statuenIds: [3],
        specialCoatIds: [7],
      };

      await updateContest(1, data);

      expect(prismaMock.contest.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          startDate: new Date("2026-03-01"),
          endDate: new Date("2026-09-30"),
          active: 1,
          conteststatue: { deleteMany: {}, create: [{ animalId: 3 }] },
          contestspecialcoat: { deleteMany: {}, create: [{ specialCoatId: 7 }] },
        }),
      });
    });
  });

  // ==========================================
  // deleteContest
  // ==========================================

  describe("deleteContest", () => {
    test("löscht Contest anhand der ID", async () => {
      prismaMock.contest.delete.mockResolvedValue({ id: 5 });

      await deleteContest(5);

      expect(prismaMock.contest.delete).toHaveBeenCalledWith({ where: { id: 5 } });
    });
  });

  // ==========================================
  // getAllStatues
  // ==========================================

  describe("getAllStatues", () => {
    test("ruft nur Contest-Tiere mit Locale-Filter ab", async () => {
      prismaMock.animal.findMany.mockResolvedValue([]);

      await getAllStatues("en");

      expect(prismaMock.animal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isContestAnimal: true },
          include: expect.objectContaining({
            animaltext: { where: { languageCode: "en" } },
          }),
          orderBy: { id: "asc" },
        }),
      );
    });
  });

  // ==========================================
  // getContestById
  // ==========================================

  describe("getContestById", () => {
    test("gibt einen Contest zurück wenn er gefunden wird", async () => {
      const mockContest = { id: 42, startDate: "2026-01-01", endDate: "2026-12-31" };
      prismaMock.contest.findUnique.mockResolvedValue(mockContest);

      const result = await getContestById("42", "de");

      expect(prismaMock.contest.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 42 } }),
      );
      expect(result).toEqual(mockContest);
    });

    test("gibt null zurück wenn Contest nicht gefunden wird", async () => {
      prismaMock.contest.findUnique.mockResolvedValue(null);

      const result = await getContestById("99", "de");

      expect(result).toBeNull();
    });

    test("wirft einen Fehler weiter wenn Prisma einen Fehler auslöst", async () => {
      prismaMock.contest.findUnique.mockRejectedValue(new Error("DB-Fehler"));

      await expect(getContestById("1", "de")).rejects.toThrow("DB-Fehler");
    });
  });

  // ==========================================
  // getResultsByContestId
  // ==========================================

  describe("getResultsByContestId", () => {
    test("ruft Ergebnisse für einen Contest ab", async () => {
      prismaMock.contestDonation.findMany.mockResolvedValue([]);

      await getResultsByContestId("7");

      expect(prismaMock.contestDonation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { contestId: 7 } }),
      );
    });
  });

  // ==========================================
  // getMembers
  // ==========================================

  describe("getMembers", () => {
    test("gibt alle Mitglieder sortiert nach upjersname zurück", async () => {
      const mockMembers = [{ id: 1, name: "Alice", upjersname: "Alice99" }];
      prismaMock.user.findMany.mockResolvedValue(mockMembers);

      const result = await getMembers();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: { id: true, name: true, upjersname: true },
          orderBy: [{ upjersname: "asc" }, { name: "asc" }],
        }),
      );
      expect(result).toEqual(mockMembers);
    });
  });

  // ==========================================
  // getEntriesByContestAndUser
  // ==========================================

  describe("getEntriesByContestAndUser", () => {
    test("filtert Einträge nach contestId und userId", async () => {
      prismaMock.contestDonation.findMany.mockResolvedValue([]);

      await getEntriesByContestAndUser(42, 7);

      expect(prismaMock.contestDonation.findMany).toHaveBeenCalledWith({
        where: { contestId: 42, userId: 7 },
        select: { id: true, animalId: true, level: true, count: true },
      });
    });
  });

  // ==========================================
  // createContestEntries
  // ==========================================

  describe("createContestEntries", () => {
    test("erstellt mehrere Einträge mit korrektem Mapping", async () => {
      prismaMock.contestDonation.createMany.mockResolvedValue({ count: 2 });

      const entries = [
        { animalId: 10, level: 5, count: 3 },
        { animalId: 20, level: 8, count: 1 },
      ];

      const result = await createContestEntries(42, 7, entries);

      expect(prismaMock.contestDonation.createMany).toHaveBeenCalledWith({
        data: [
          { contestId: 42, userId: 7, animalId: 10, level: 5, count: 3 },
          { contestId: 42, userId: 7, animalId: 20, level: 8, count: 1 },
        ],
      });
      expect(result).toEqual({ count: 2 });
    });
  });
});