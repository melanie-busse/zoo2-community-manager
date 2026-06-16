import { describe, test, expect, vi, beforeEach } from "vitest";

// 1. Prisma mocken
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// 2. Die Umgebungsvariablen setzen, BEVOR wir die Route dynamisch laden
process.env.DISCORD_CLIENT_ID = "mock-client-id";
process.env.DISCORD_CLIENT_SECRET = "mock-client-secret";
process.env.NEXTAUTH_SECRET = "mock-secret";

// Dynamischer Import der authOptions, damit der Error-Check in der route.ts nicht vorab knallt
const { authOptions } = await import("./route");
import prisma from "@/lib/prisma";

describe("NextAuth Route Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // SZENARIO 1: SIGN IN CALLBACK (DB-SYNC)
  // ==========================================
  describe("signIn Callback", () => {
    test("macht ein upsert in der Datenbank und gibt true zurück", async () => {
      const mockUser = {
        id: "discord-123",
        name: "GamerZ",
        email: "gamer@zoo2.de",
        image: "avatar.png",
      };

      vi.mocked(prisma.user.upsert).mockResolvedValue({} as any);

      const result = await authOptions.callbacks.signIn({ user: mockUser });

      expect(prisma.user.upsert).toHaveBeenCalledWith({
        where: { id: "discord-123" },
        update: { name: "GamerZ", image: "avatar.png" },
        create: {
          id: "discord-123",
          name: "GamerZ",
          email: "gamer@zoo2.de",
          image: "avatar.png",
          roleId: 1,
        },
      });
      expect(result).toBe(true);
    });

    test("gibt trotz Datenbank-Fehler true zurück (kein Login-Crash)", async () => {
      vi.mocked(prisma.user.upsert).mockRejectedValue(new Error("DB Down"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await authOptions.callbacks.signIn({ user: { id: "1" } });

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  // ==========================================
  // SZENARIO 2: SESSION CALLBACK (ROLLEN-INJEKTION)
  // ==========================================
  describe("session Callback", () => {
    test("erweitert die Session um ID und Rolle, wenn der User in der DB existiert", async () => {
      const mockSession = {
        user: { name: "Melanie", email: "melanie@zoo2.de" },
      };

      const mockDbUser = {
        id: "db-user-999",
        roleId: 2,
        role: {
          name: "Admin",
          rolestext: [],
        },
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockDbUser as any);

      const updatedSession = await authOptions.callbacks.session({ session: mockSession });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "melanie@zoo2.de" },
        include: { role: { include: { rolestext: true } } },
      });

      expect(updatedSession.user.id).toBe("db-user-999");
      expect(updatedSession.user.roleId).toBe(2);
      expect(updatedSession.user.role).toBe("Admin");
    });

    test("bricht nicht ab und gibt die normale Session zurück, wenn keine E-Mail existiert", async () => {
      const mockSessionWithoutEmail = { user: { name: "Anonymus" } };

      const result = await authOptions.callbacks.session({ session: mockSessionWithoutEmail });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual(mockSessionWithoutEmail);
    });
  });
});
