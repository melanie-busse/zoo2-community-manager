import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("Startseite lädt und leitet auf /de weiter", async ({ page }) => {
    await page.goto("/");

    // next-intl leitet basierend auf Accept-Language weiter (de oder en)
    await expect(page).toHaveURL(/\/(de|en)$/);
  });

  test("Tier-Übersicht lädt und zeigt Hauptinhalt", async ({ page }) => {
    await page.goto("/de/animals");

    await expect(page).toHaveURL("/de/animals");
    await expect(page).not.toHaveTitle("404");
    await expect(page.locator("main")).toBeVisible();
  });

  test("SpecialCoats-Übersicht lädt und zeigt Hauptinhalt", async ({ page }) => {
    await page.goto("/de/specialcoats");

    await expect(page).toHaveURL("/de/specialcoats");
    await expect(page).not.toHaveTitle("404");
    await expect(page.locator("main")).toBeVisible();
  });
});