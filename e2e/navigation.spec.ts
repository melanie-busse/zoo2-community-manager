import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("Klick auf das Logo navigiert zur Startseite", async ({ page }) => {
    await page.goto("/de/animals");

    // Logo-Link hat href="/de" (next-intl fügt Locale-Prefix hinzu)
    await page.locator('img[alt="Klub der tollen Tiere Logo"]').click();

    await expect(page).toHaveURL(/\/de(\/)?$/);
  });

  test("Tier-Übersicht Nav-Link existiert und navigiert korrekt", async ({ page }) => {
    await page.goto("/de");

    // Dropdown ist CSS-hover-basiert (visibility: hidden → :hover → visible).
    // element.click() via evaluate() löst native Browser-Navigation aus, unabhängig
    // von CSS-Sichtbarkeit oder pointer-events.
    await page.evaluate(() => {
      const link = document.querySelector(
        '[data-testid="nav-sub-animals-animal_overview"]',
      ) as HTMLAnchorElement;
      link.click();
    });

    await expect(page).toHaveURL(/\/de\/animals$/);
  });

  test("SpecialCoats-Übersicht Nav-Link existiert und navigiert korrekt", async ({ page }) => {
    await page.goto("/de");

    await page.evaluate(() => {
      const link = document.querySelector(
        '[data-testid="nav-sub-animals-specialcoats_overview"]',
      ) as HTMLAnchorElement;
      link.click();
    });

    await expect(page).toHaveURL(/\/de\/specialcoats$/);
  });

  test("Tier-Detailseite ist von der Übersicht erreichbar", async ({ page }) => {
    await page.goto("/de/animals");

    // LinkedRow rendert <tr onClick={() => router.push(...)}> — kein <a>-Tag.
    // waitForURL wartet auf die async Client-Navigation.
    const firstRow = page.locator("tbody tr").first();
    await firstRow.waitFor({ state: "visible" });

    await Promise.all([
      page.waitForURL(/\/de\/animals\/\d+/, { timeout: 10_000 }),
      firstRow.click(),
    ]);
  });
});