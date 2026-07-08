import { test, expect } from "@playwright/test";

// Diese Tests erfordern einen laufenden Dev-Server mit konfiguriertem NextAuth
// (NEXTAUTH_SECRET in .env.local). Ohne gültigen Secret wirft getServerSession
// einen Fehler und der redirect() wird nicht ausgeführt.
test.describe("Auth Guard – geschützte Routen", () => {
  test("Unauthentifizierter Zugriff auf /animals/create leitet auf /animals um", async ({
    page,
  }) => {
    await page.goto("/de/animals/create");

    await expect(page).toHaveURL("/de/animals", { timeout: 10_000 });
  });

  test("Unauthentifizierter Zugriff auf /specialcoats/create leitet auf /animals um", async ({
    page,
  }) => {
    await page.goto("/de/specialcoats/create");

    await expect(page).toHaveURL("/de/animals", { timeout: 10_000 });
  });
});