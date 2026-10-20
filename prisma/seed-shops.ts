import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// currency values: "COINS" | "DIAMONDS" | "EVENT"
type Level = { cost: number; currency: string; maxCapacity: number; buildTime: string };
type ShopData = { name: string; coinsPerClient: number | null; levels: Level[] };

const shops: ShopData[] = [
  // ─── MAIN ZOO SHOPS ──────────────────────────────────────────────────────────
  // (compatible with Main Zoo, Kujali Park, Fir Grove, Oceanside Zoo)
  {
    name: "Ice Cream Cart",
    coinsPerClient: 5,
    levels: [
      { cost: 750,   currency: "COINS", maxCapacity: 120, buildTime: "1m" },
      { cost: 750,   currency: "COINS", maxCapacity: 180, buildTime: "2h" },
      { cost: 1500,  currency: "COINS", maxCapacity: 240, buildTime: "4h" },
      { cost: 3000,  currency: "COINS", maxCapacity: 300, buildTime: "9h" },
    ],
  },
  {
    name: "Drink Cart",
    coinsPerClient: 6,
    levels: [
      { cost: 1250,  currency: "COINS", maxCapacity: 160, buildTime: "1h" },
      { cost: 1250,  currency: "COINS", maxCapacity: 240, buildTime: "2h" },
      { cost: 2500,  currency: "COINS", maxCapacity: 320, buildTime: "4h" },
      { cost: 5000,  currency: "COINS", maxCapacity: 400, buildTime: "9h" },
    ],
  },
  {
    name: "Snack Cart",
    coinsPerClient: 6,
    levels: [
      { cost: 2500,  currency: "COINS", maxCapacity: 200, buildTime: "2h" },
      { cost: 2500,  currency: "COINS", maxCapacity: 300, buildTime: "2h" },
      { cost: 5000,  currency: "COINS", maxCapacity: 400, buildTime: "4h" },
      { cost: 10000, currency: "COINS", maxCapacity: 500, buildTime: "9h" },
    ],
  },
  {
    name: "Souvenir Cart",
    coinsPerClient: 6,
    levels: [
      { cost: 10,  currency: "DIAMONDS", maxCapacity: 240, buildTime: "3h" },
      { cost: 10,  currency: "DIAMONDS", maxCapacity: 360, buildTime: "2h" },
      { cost: 20,  currency: "DIAMONDS", maxCapacity: 480, buildTime: "5h" },
      { cost: 40,  currency: "DIAMONDS", maxCapacity: 600, buildTime: "9h" },
    ],
  },
  {
    name: "Ice Cream Shop",
    coinsPerClient: 3,
    levels: [
      { cost: 4000,  currency: "COINS", maxCapacity: 420,  buildTime: "3h" },
      { cost: 4000,  currency: "COINS", maxCapacity: 630,  buildTime: "2h" },
      { cost: 8000,  currency: "COINS", maxCapacity: 840,  buildTime: "6h" },
      { cost: 16000, currency: "COINS", maxCapacity: 1050, buildTime: "12h" },
    ],
  },
  {
    name: "Drink Shop",
    coinsPerClient: 3,
    levels: [
      { cost: 20,  currency: "DIAMONDS", maxCapacity: 480,  buildTime: "" },
      { cost: 20,  currency: "DIAMONDS", maxCapacity: 720,  buildTime: "3h" },
      { cost: 40,  currency: "DIAMONDS", maxCapacity: 960,  buildTime: "" },
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1200, buildTime: "13h" },
    ],
  },
  {
    name: "Snack Shop",
    coinsPerClient: 3,
    levels: [
      { cost: 6000,  currency: "COINS", maxCapacity: 540,  buildTime: "5h" },
      { cost: 6000,  currency: "COINS", maxCapacity: 810,  buildTime: "3h" },
      { cost: 12000, currency: "COINS", maxCapacity: 1080, buildTime: "7h" },
      { cost: 24000, currency: "COINS", maxCapacity: 1350, buildTime: "14h" },
    ],
  },
  {
    name: "Souvenir Shop",
    coinsPerClient: 3,
    levels: [
      { cost: 30,  currency: "DIAMONDS", maxCapacity: 600,  buildTime: "" },
      { cost: 30,  currency: "DIAMONDS", maxCapacity: 900,  buildTime: "" },
      { cost: 60,  currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1500, buildTime: "15h" },
    ],
  },
  {
    name: "Ice Cream Parlor",
    coinsPerClient: 1,
    levels: [
      { cost: 10000, currency: "COINS", maxCapacity: 880,  buildTime: "5h" },
      { cost: 10000, currency: "COINS", maxCapacity: 1320, buildTime: "4h" },
      { cost: 20000, currency: "COINS", maxCapacity: 1760, buildTime: "8h" },
      { cost: 40000, currency: "COINS", maxCapacity: 2200, buildTime: "16h" },
    ],
  },
  {
    name: "Safari Restaurant",
    coinsPerClient: 1,
    levels: [
      { cost: 60,  currency: "DIAMONDS", maxCapacity: 960,  buildTime: "7h" },
      { cost: 60,  currency: "DIAMONDS", maxCapacity: 1440, buildTime: "4h" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1920, buildTime: "10h" },
      { cost: 240, currency: "DIAMONDS", maxCapacity: 2400, buildTime: "18h" },
    ],
  },
  {
    name: "Zoo Store",
    coinsPerClient: 1,
    levels: [
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1040, buildTime: "" },
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1560, buildTime: "" },
      { cost: 160, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "11h" },
      { cost: 320, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "" },
    ],
  },
  {
    name: "Kiosk",
    coinsPerClient: 1,
    levels: [
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1120, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1680, buildTime: "" },
      { cost: 240, currency: "DIAMONDS", maxCapacity: 2240, buildTime: "12h" },
      { cost: 480, currency: "DIAMONDS", maxCapacity: 2800, buildTime: "" },
    ],
  },

  // ─── KUJALI PARK EXCLUSIVE ────────────────────────────────────────────────────
  {
    name: "Safari Hat Stand",
    coinsPerClient: 8,
    levels: [
      { cost: 35,  currency: "DIAMONDS", maxCapacity: 480,  buildTime: "5h 30m" },
      { cost: 36,  currency: "DIAMONDS", maxCapacity: 720,  buildTime: "" },
      { cost: 72,  currency: "DIAMONDS", maxCapacity: 960,  buildTime: "" },
      { cost: 144, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
    ],
  },

  // ─── OCEANSIDE ZOO SHOPS ─────────────────────────────────────────────────────
  {
    name: "Small Snack Shop (Oceanside)",
    coinsPerClient: 4,
    levels: [
      { cost: 2500,  currency: "COINS", maxCapacity: 160, buildTime: "3h" },
      { cost: 2500,  currency: "COINS", maxCapacity: 240, buildTime: "13h" },
      { cost: 5000,  currency: "COINS", maxCapacity: 320, buildTime: "1d 3h" },
      { cost: 7500,  currency: "COINS", maxCapacity: 400, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Small Drink Shop (Oceanside)",
    coinsPerClient: 5,
    levels: [
      { cost: 5000,  currency: "COINS", maxCapacity: 200, buildTime: "3h" },
      { cost: 5000,  currency: "COINS", maxCapacity: 300, buildTime: "13h" },
      { cost: 10000, currency: "COINS", maxCapacity: 400, buildTime: "1d 3h" },
      { cost: 15000, currency: "COINS", maxCapacity: 500, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Small Souvenir Shop (Oceanside)",
    coinsPerClient: 6,
    levels: [
      { cost: 15, currency: "DIAMONDS", maxCapacity: 240, buildTime: "" },
      { cost: 15, currency: "DIAMONDS", maxCapacity: 360, buildTime: "" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 480, buildTime: "" },
      { cost: 45, currency: "DIAMONDS", maxCapacity: 600, buildTime: "" },
    ],
  },
  {
    name: "Medium Snack Shop (Oceanside)",
    coinsPerClient: 8,
    levels: [
      { cost: 20, currency: "DIAMONDS", maxCapacity: 480,  buildTime: "6h" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 720,  buildTime: "" },
      { cost: 40, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Medium Drink Shop (Oceanside)",
    coinsPerClient: 7,
    levels: [
      { cost: 8500,  currency: "COINS", maxCapacity: 420,  buildTime: "6h" },
      { cost: 8500,  currency: "COINS", maxCapacity: 630,  buildTime: "13h" },
      { cost: 17000, currency: "COINS", maxCapacity: 840,  buildTime: "1d 3h" },
      { cost: 25500, currency: "COINS", maxCapacity: 1050, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Medium Souvenir Shop (Oceanside)",
    coinsPerClient: 9,
    levels: [
      { cost: 30, currency: "DIAMONDS", maxCapacity: 540,  buildTime: "" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 810,  buildTime: "" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1080, buildTime: "1d 3h" },
      { cost: 90, currency: "DIAMONDS", maxCapacity: 1350, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Large Snack Shop (Oceanside)",
    coinsPerClient: 13,
    levels: [
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1040, buildTime: "" },
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1560, buildTime: "" },
      { cost: 160, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "" },
      { cost: 240, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "" },
    ],
  },
  {
    name: "Large Drink Shop (Oceanside)",
    coinsPerClient: 10,
    levels: [
      { cost: 45,  currency: "DIAMONDS", maxCapacity: 800,  buildTime: "" },
      { cost: 45,  currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
      { cost: 90,  currency: "DIAMONDS", maxCapacity: 1600, buildTime: "" },
      { cost: 135, currency: "DIAMONDS", maxCapacity: 2000, buildTime: "" },
    ],
  },
  {
    name: "Large Souvenir Shop (Oceanside)",
    coinsPerClient: 13,
    levels: [
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1040, buildTime: "" },
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1560, buildTime: "" },
      { cost: 160, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "" },
      { cost: 240, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "" },
    ],
  },

  // ─── POLAR PARK SHOPS ────────────────────────────────────────────────────────
  {
    name: "Small Snack Shop (Polar Park)",
    coinsPerClient: 4,
    levels: [
      { cost: 2000, currency: "COINS", maxCapacity: 140, buildTime: "3h" },
      { cost: 2000, currency: "COINS", maxCapacity: 210, buildTime: "9h" },
      { cost: 2000, currency: "COINS", maxCapacity: 280, buildTime: "20h" },
      { cost: 2000, currency: "COINS", maxCapacity: 350, buildTime: "1d 9h" },
    ],
  },
  {
    name: "Small Drink Shop (Polar Park)",
    coinsPerClient: 5,
    levels: [
      { cost: 4000, currency: "COINS", maxCapacity: 180, buildTime: "3h" },
      { cost: 4000, currency: "COINS", maxCapacity: 270, buildTime: "10h" },
      { cost: 4000, currency: "COINS", maxCapacity: 360, buildTime: "20h" },
      { cost: 4000, currency: "COINS", maxCapacity: 450, buildTime: "1d 9h" },
    ],
  },
  {
    name: "Small Souvenir Shop (Polar Park)",
    coinsPerClient: 6,
    levels: [
      { cost: 10, currency: "DIAMONDS", maxCapacity: 210, buildTime: "3h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 315, buildTime: "10h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 420, buildTime: "22h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 525, buildTime: "1d 11h" },
    ],
  },
  {
    name: "Medium Snack Shop (Polar Park)",
    coinsPerClient: 8,
    levels: [
      { cost: 16, currency: "DIAMONDS", maxCapacity: 480,  buildTime: "6h" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 720,  buildTime: "11h" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "23h" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "1d 14h" },
    ],
  },
  {
    name: "Medium Drink Shop (Polar Park)",
    coinsPerClient: 7,
    levels: [
      { cost: 6000, currency: "COINS", maxCapacity: 420,  buildTime: "6h" },
      { cost: 6000, currency: "COINS", maxCapacity: 630,  buildTime: "11h" },
      { cost: 6000, currency: "COINS", maxCapacity: 840,  buildTime: "24h" },
      { cost: 6000, currency: "COINS", maxCapacity: 1050, buildTime: "1d 14h" },
    ],
  },
  {
    name: "Medium Souvenir Shop (Polar Park)",
    coinsPerClient: 9,
    levels: [
      { cost: 20, currency: "DIAMONDS", maxCapacity: 540,  buildTime: "6h" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 810,  buildTime: "12h" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 1080, buildTime: "1d 1h" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 1350, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Large Snack Shop (Polar Park)",
    coinsPerClient: 10,
    levels: [
      { cost: 30, currency: "DIAMONDS", maxCapacity: 800,  buildTime: "8h" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "13h" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 1600, buildTime: "1d 3h" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 2000, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Large Drink Shop (Polar Park)",
    coinsPerClient: 11,
    levels: [
      { cost: 50, currency: "DIAMONDS", maxCapacity: 880,  buildTime: "8h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 1320, buildTime: "14h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 1760, buildTime: "1d 4h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 2200, buildTime: "1d 19h" },
    ],
  },
  {
    name: "Large Souvenir Shop (Polar Park)",
    coinsPerClient: 13,
    levels: [
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1040, buildTime: "8h" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1560, buildTime: "14h" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "1d 5h" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "1d 21h" },
    ],
  },

  // ─── RAINFOREST PARK SHOPS ───────────────────────────────────────────────────
  {
    name: "Small Snack Shop (Rainforest Park)",
    coinsPerClient: 10,
    levels: [
      { cost: 4000, currency: "COINS", maxCapacity: 300, buildTime: "3h" },
      { cost: 4000, currency: "COINS", maxCapacity: 450, buildTime: "15h" },
      { cost: 4000, currency: "COINS", maxCapacity: 600, buildTime: "1d 6h" },
      { cost: 4000, currency: "COINS", maxCapacity: 750, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Small Drink Shop (Rainforest Park)",
    coinsPerClient: 4,
    levels: [
      { cost: 5000, currency: "COINS", maxCapacity: 120, buildTime: "3h" },
      { cost: 5000, currency: "COINS", maxCapacity: 180, buildTime: "15h" },
      { cost: 5000, currency: "COINS", maxCapacity: 240, buildTime: "1d 6h" },
      { cost: 5000, currency: "COINS", maxCapacity: 300, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Small Souvenir Shop (Rainforest Park)",
    coinsPerClient: 6,
    levels: [
      { cost: 10, currency: "DIAMONDS", maxCapacity: 240, buildTime: "3h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 360, buildTime: "15h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 480, buildTime: "1d 6h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 600, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Medium Snack Shop (Rainforest Park)",
    coinsPerClient: 9,
    levels: [
      { cost: 8000, currency: "COINS", maxCapacity: 540,  buildTime: "6h" },
      { cost: 8000, currency: "COINS", maxCapacity: 810,  buildTime: "15h" },
      { cost: 8000, currency: "COINS", maxCapacity: 1080, buildTime: "1d 6h" },
      { cost: 8000, currency: "COINS", maxCapacity: 1350, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Medium Drink Shop (Rainforest Park)",
    coinsPerClient: 8,
    levels: [
      { cost: 15, currency: "DIAMONDS", maxCapacity: 480,  buildTime: "6h" },
      { cost: 15, currency: "DIAMONDS", maxCapacity: 720,  buildTime: "15h" },
      { cost: 15, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "1d 6h" },
      { cost: 15, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Medium Souvenir Shop (Rainforest Park)",
    coinsPerClient: 10,
    levels: [
      { cost: 20, currency: "DIAMONDS", maxCapacity: 600,  buildTime: "6h" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 900,  buildTime: "15h" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "1d 6h" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 1500, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Large Snack Shop (Rainforest Park)",
    coinsPerClient: 12,
    levels: [
      { cost: 40, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "8h" },
      { cost: 40, currency: "DIAMONDS", maxCapacity: 1440, buildTime: "15h" },
      { cost: 40, currency: "DIAMONDS", maxCapacity: 1920, buildTime: "1d 6h" },
      { cost: 40, currency: "DIAMONDS", maxCapacity: 2400, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Large Drink Shop (Rainforest Park)",
    coinsPerClient: 12,
    levels: [
      { cost: 20000, currency: "COINS", maxCapacity: 960,  buildTime: "8h" },
      { cost: 20000, currency: "COINS", maxCapacity: 1440, buildTime: "15h" },
      { cost: 20000, currency: "COINS", maxCapacity: 1920, buildTime: "1d 6h" },
      { cost: 20000, currency: "COINS", maxCapacity: 2400, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Large Souvenir Shop (Rainforest Park)",
    coinsPerClient: 14,
    levels: [
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1120, buildTime: "8h" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1680, buildTime: "15h" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 2240, buildTime: "1d 6h" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 2800, buildTime: "1d 21h" },
    ],
  },

  // ─── SPECIAL EVENT SHOPS ─────────────────────────────────────────────────────
  {
    name: "Salad Bar (Mother's Day 2022)",
    coinsPerClient: 10,
    levels: [
      { cost: 0,  currency: "EVENT",    maxCapacity: 800,  buildTime: "" },
      { cost: 46, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
      { cost: 46, currency: "DIAMONDS", maxCapacity: 1600, buildTime: "" },
      { cost: 46, currency: "DIAMONDS", maxCapacity: 2000, buildTime: "" },
    ],
  },
  {
    name: "Swedish Café (Christmas 2022)",
    coinsPerClient: 10,
    levels: [
      { cost: 0,  currency: "EVENT",    maxCapacity: 800,  buildTime: "7h" },
      { cost: 45, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
      { cost: 45, currency: "DIAMONDS", maxCapacity: 1600, buildTime: "" },
      { cost: 45, currency: "DIAMONDS", maxCapacity: 2000, buildTime: "" },
    ],
  },
  {
    name: "Market Stall (Autumn 2024)",
    coinsPerClient: 4,
    levels: [
      { cost: 0,  currency: "EVENT",    maxCapacity: 160, buildTime: "7h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 240, buildTime: "1h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 320, buildTime: "4h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 400, buildTime: "9h" },
    ],
  },
  {
    name: "Flower Vendor (Valentine's Day 2025)",
    coinsPerClient: 5,
    levels: [
      { cost: 0,  currency: "EVENT",    maxCapacity: 300, buildTime: "7h" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 450, buildTime: "" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 600, buildTime: "" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 750, buildTime: "" },
    ],
  },
  {
    name: "Fall Festival Snack Shop (Autumn 2025)",
    coinsPerClient: 10,
    levels: [
      { cost: 0,  currency: "EVENT",    maxCapacity: 650,  buildTime: "7h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 975,  buildTime: "" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 1300, buildTime: "" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 1625, buildTime: "" },
    ],
  },
  {
    name: "Cloud Café (Valentine's Day 2026)",
    coinsPerClient: 10,
    levels: [
      { cost: 0,  currency: "EVENT",    maxCapacity: 450,  buildTime: "7h" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 675,  buildTime: "" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 900,  buildTime: "" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 1125, buildTime: "" },
    ],
  },
  {
    name: "Anniversary Snack Shop (March 2026)",
    coinsPerClient: 14,
    levels: [
      { cost: 0,   currency: "COINS",    maxCapacity: 800,  buildTime: "7h" },
      { cost: 80,  currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
      { cost: 160, currency: "DIAMONDS", maxCapacity: 1600, buildTime: "" },
      { cost: 320, currency: "DIAMONDS", maxCapacity: 2000, buildTime: "" },
    ],
  },
  {
    name: "upjers Anniversary Souvenir Shop (Summer 2026)",
    coinsPerClient: 10,
    levels: [
      { cost: 0,  currency: "EVENT",    maxCapacity: 720,  buildTime: "7h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 1080, buildTime: "" },
      { cost: 0,  currency: "DIAMONDS", maxCapacity: 1440, buildTime: "" },
      { cost: 0,  currency: "DIAMONDS", maxCapacity: 1800, buildTime: "" },
    ],
  },

  // ─── TERRARIUM SHOPS ─────────────────────────────────────────────────────────
  {
    name: "Chip Vending Machine (Terrarium)",
    coinsPerClient: 5,
    levels: [
      { cost: 8, currency: "DIAMONDS", maxCapacity: 200, buildTime: "" },
      { cost: 8, currency: "DIAMONDS", maxCapacity: 300, buildTime: "" },
      { cost: 8, currency: "DIAMONDS", maxCapacity: 400, buildTime: "" },
      { cost: 8, currency: "DIAMONDS", maxCapacity: 500, buildTime: "" },
    ],
  },
  {
    name: "Coffee Vending Machine (Terrarium)",
    coinsPerClient: 12,
    levels: [
      { cost: 60, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1440, buildTime: "" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 1920, buildTime: "" },
      { cost: 60, currency: "DIAMONDS", maxCapacity: 2400, buildTime: "" },
    ],
  },
  {
    name: "Cookie Vending Machine (Terrarium)",
    coinsPerClient: 10,
    levels: [
      { cost: 1500, currency: "COINS", maxCapacity: 300, buildTime: "3h" },
      { cost: 1500, currency: "COINS", maxCapacity: 450, buildTime: "3h" },
      { cost: 1500, currency: "COINS", maxCapacity: 600, buildTime: "7h" },
      { cost: 1500, currency: "COINS", maxCapacity: 750, buildTime: "13h" },
    ],
  },
  {
    name: "Granola Bar Vending Machine (Terrarium)",
    coinsPerClient: 9,
    levels: [
      { cost: 9000, currency: "COINS", maxCapacity: 540,  buildTime: "3h" },
      { cost: 9000, currency: "COINS", maxCapacity: 810,  buildTime: "3h" },
      { cost: 9000, currency: "COINS", maxCapacity: 1080, buildTime: "7h" },
      { cost: 9000, currency: "COINS", maxCapacity: 1350, buildTime: "13h" },
    ],
  },
  {
    name: "Iced Tea Vending Machine (Terrarium)",
    coinsPerClient: 4,
    levels: [
      { cost: 1900, currency: "COINS", maxCapacity: 160, buildTime: "3h" },
      { cost: 1900, currency: "COINS", maxCapacity: 240, buildTime: "3h" },
      { cost: 1900, currency: "COINS", maxCapacity: 320, buildTime: "7h" },
      { cost: 1900, currency: "COINS", maxCapacity: 400, buildTime: "13h" },
    ],
  },
  {
    name: "Juice Vending Machine (Terrarium)",
    coinsPerClient: 8,
    levels: [
      { cost: 20, currency: "DIAMONDS", maxCapacity: 480,  buildTime: "" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 720,  buildTime: "" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "" },
      { cost: 20, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
    ],
  },
  {
    name: "Soft Serve Vending Machine (Terrarium)",
    coinsPerClient: 13,
    levels: [
      { cost: 80, currency: "DIAMONDS", maxCapacity: 1040, buildTime: "" },
      { cost: 80, currency: "DIAMONDS", maxCapacity: 1560, buildTime: "" },
      { cost: 80, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "" },
      { cost: 80, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "" },
    ],
  },
  {
    name: "Water Vending Machine (Terrarium)",
    coinsPerClient: 4,
    levels: [
      { cost: 1050, currency: "COINS", maxCapacity: 120, buildTime: "3h" },
      { cost: 1050, currency: "COINS", maxCapacity: 180, buildTime: "3h" },
      { cost: 1050, currency: "COINS", maxCapacity: 240, buildTime: "7h" },
      { cost: 1050, currency: "COINS", maxCapacity: 300, buildTime: "13h" },
    ],
  },
  {
    name: "Photo Booth (Terrarium)",
    coinsPerClient: 14,
    levels: [
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1120, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1680, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 2240, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 2800, buildTime: "" },
    ],
  },
  {
    name: "Balloon Shop (Terrarium)",
    coinsPerClient: 6,
    levels: [
      { cost: 10, currency: "DIAMONDS", maxCapacity: 240, buildTime: "" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 360, buildTime: "" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 480, buildTime: "" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 600, buildTime: "" },
    ],
  },
  {
    name: "Claw Machine (Terrarium)",
    coinsPerClient: 10,
    levels: [
      { cost: 24, currency: "DIAMONDS", maxCapacity: 600,  buildTime: "" },
      { cost: 24, currency: "DIAMONDS", maxCapacity: 900,  buildTime: "" },
      { cost: 24, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
      { cost: 24, currency: "DIAMONDS", maxCapacity: 1500, buildTime: "" },
    ],
  },

  // ─── AQUARIUM SHOPS ──────────────────────────────────────────────────────────
  {
    name: "Cookie Vending Machine (Aquarium)",
    coinsPerClient: 10,
    levels: [
      { cost: 2250, currency: "COINS", maxCapacity: 300, buildTime: "3h" },
      { cost: 2250, currency: "COINS", maxCapacity: 450, buildTime: "3h" },
      { cost: 2250, currency: "COINS", maxCapacity: 600, buildTime: "7h" },
      { cost: 2250, currency: "COINS", maxCapacity: 750, buildTime: "13h" },
    ],
  },
  {
    name: "Iced Drinks Vending Machine (Aquarium)",
    coinsPerClient: 4,
    levels: [
      { cost: 2850, currency: "COINS", maxCapacity: 160, buildTime: "3h" },
      { cost: 2850, currency: "COINS", maxCapacity: 240, buildTime: "3h" },
      { cost: 2850, currency: "COINS", maxCapacity: 320, buildTime: "7h" },
      { cost: 2850, currency: "COINS", maxCapacity: 400, buildTime: "13h" },
    ],
  },
  {
    name: "Chocolate Bar Vending Machine (Aquarium)",
    coinsPerClient: 11,
    levels: [
      { cost: 13500, currency: "COINS", maxCapacity: 880,  buildTime: "3h" },
      { cost: 13500, currency: "COINS", maxCapacity: 1320, buildTime: "14h" },
      { cost: 13500, currency: "COINS", maxCapacity: 1760, buildTime: "1d 2h" },
      { cost: 13500, currency: "COINS", maxCapacity: 2200, buildTime: "1d 16h" },
    ],
  },
  {
    name: "Fruit Gummie Vending Machine (Aquarium)",
    coinsPerClient: 5,
    levels: [
      { cost: 12, currency: "DIAMONDS", maxCapacity: 200, buildTime: "" },
      { cost: 12, currency: "DIAMONDS", maxCapacity: 300, buildTime: "" },
      { cost: 12, currency: "DIAMONDS", maxCapacity: 400, buildTime: "" },
      { cost: 12, currency: "DIAMONDS", maxCapacity: 500, buildTime: "" },
    ],
  },
  {
    name: "Water Cooler (Aquarium)",
    coinsPerClient: 4,
    levels: [
      { cost: 1600, currency: "COINS", maxCapacity: 120, buildTime: "3h" },
      { cost: 1600, currency: "COINS", maxCapacity: 180, buildTime: "3h" },
      { cost: 1600, currency: "COINS", maxCapacity: 240, buildTime: "7h" },
      { cost: 1600, currency: "COINS", maxCapacity: 300, buildTime: "13h" },
    ],
  },
  {
    name: "Balloon Shop (Aquarium)",
    coinsPerClient: 6,
    levels: [
      { cost: 16, currency: "DIAMONDS", maxCapacity: 240, buildTime: "" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 360, buildTime: "" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 480, buildTime: "" },
      { cost: 16, currency: "DIAMONDS", maxCapacity: 600, buildTime: "" },
    ],
  },
  {
    name: "Cocktail Bar (Aquarium)",
    coinsPerClient: 8,
    levels: [
      { cost: 30, currency: "DIAMONDS", maxCapacity: 480,  buildTime: "" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 720,  buildTime: "" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "" },
    ],
  },
  {
    name: "Fish Claw Machine (Aquarium)",
    coinsPerClient: 10,
    levels: [
      { cost: 36, currency: "DIAMONDS", maxCapacity: 600,  buildTime: "8h" },
      { cost: 36, currency: "DIAMONDS", maxCapacity: 900,  buildTime: "13h" },
      { cost: 36, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "1d 2h" },
      { cost: 36, currency: "DIAMONDS", maxCapacity: 1500, buildTime: "" },
    ],
  },
  {
    name: "Smoothie Machine (Aquarium)",
    coinsPerClient: 13,
    levels: [
      { cost: 90, currency: "DIAMONDS", maxCapacity: 1040, buildTime: "" },
      { cost: 90, currency: "DIAMONDS", maxCapacity: 1560, buildTime: "" },
      { cost: 90, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "" },
      { cost: 90, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "" },
    ],
  },
  {
    name: "Soft Serve Machine (Aquarium)",
    coinsPerClient: 14,
    levels: [
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1120, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 1680, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 2240, buildTime: "" },
      { cost: 120, currency: "DIAMONDS", maxCapacity: 2800, buildTime: "" },
    ],
  },
  {
    name: 'Photo Booth "Deep Dive" (Aquarium)',
    coinsPerClient: 14,
    levels: [
      { cost: 180, currency: "DIAMONDS", maxCapacity: 1120, buildTime: "" },
      { cost: 180, currency: "DIAMONDS", maxCapacity: 1680, buildTime: "" },
      { cost: 180, currency: "DIAMONDS", maxCapacity: 2240, buildTime: "" },
      { cost: 180, currency: "DIAMONDS", maxCapacity: 2800, buildTime: "" },
    ],
  },

  // ─── NOCTARIUM SHOPS ─────────────────────────────────────────────────────────
  {
    name: "Water Vending Machine (Noctarium)",
    coinsPerClient: 4,
    levels: [
      { cost: 3500, currency: "COINS", maxCapacity: 120, buildTime: "3h" },
      { cost: 3500, currency: "COINS", maxCapacity: 180, buildTime: "13h" },
      { cost: 3500, currency: "COINS", maxCapacity: 240, buildTime: "1d 4h" },
      { cost: 3500, currency: "COINS", maxCapacity: 300, buildTime: "1d 21h" },
    ],
  },
  {
    name: "Pizza Snack Machine (Noctarium)",
    coinsPerClient: 11,
    levels: [
      { cost: 10000, currency: "COINS", maxCapacity: 880,  buildTime: "3h" },
      { cost: 10000, currency: "COINS", maxCapacity: 1320, buildTime: "14h" },
      { cost: 10000, currency: "COINS", maxCapacity: 1760, buildTime: "1d 5h" },
      { cost: 10000, currency: "COINS", maxCapacity: 2200, buildTime: "1d 22h" },
    ],
  },
  {
    name: "Balloon Shop (Noctarium)",
    coinsPerClient: 6,
    levels: [
      { cost: 8, currency: "DIAMONDS", maxCapacity: 240, buildTime: "3h" },
      { cost: 8, currency: "DIAMONDS", maxCapacity: 360, buildTime: "14h" },
      { cost: 8, currency: "DIAMONDS", maxCapacity: 480, buildTime: "1d 5h" },
      { cost: 8, currency: "DIAMONDS", maxCapacity: 600, buildTime: "1d 22h" },
    ],
  },
  {
    name: "Lemonade Vending Machine (Noctarium)",
    coinsPerClient: 13,
    levels: [
      { cost: 50, currency: "DIAMONDS", maxCapacity: 1040, buildTime: "3h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 1560, buildTime: "14h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "1d 5h" },
      { cost: 50, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "1d 23h" },
    ],
  },
  {
    name: "Cracker Snack Vending Machine (Noctarium)",
    coinsPerClient: 10,
    levels: [
      { cost: 24, currency: "DIAMONDS", maxCapacity: 600,  buildTime: "3h" },
      { cost: 24, currency: "DIAMONDS", maxCapacity: 900,  buildTime: "14h" },
      { cost: 24, currency: "DIAMONDS", maxCapacity: 1200, buildTime: "1d 6h" },
      { cost: 24, currency: "DIAMONDS", maxCapacity: 1500, buildTime: "1d 23h" },
    ],
  },

  // ─── AVIARY SHOPS ────────────────────────────────────────────────────────────
  {
    name: "Water Vending Machine (Aviary)",
    coinsPerClient: 5,
    levels: [
      { cost: 7500, currency: "COINS", maxCapacity: 150, buildTime: "3h" },
      { cost: 7500, currency: "COINS", maxCapacity: 225, buildTime: "15h" },
      { cost: 7500, currency: "COINS", maxCapacity: 300, buildTime: "1d 6h" },
      { cost: 7500, currency: "COINS", maxCapacity: 375, buildTime: "1d 22h" },
    ],
  },
  {
    name: "Cake Snack Machine (Aviary)",
    coinsPerClient: 11,
    levels: [
      { cost: 15000, currency: "COINS", maxCapacity: 660,  buildTime: "3h" },
      { cost: 15000, currency: "COINS", maxCapacity: 990,  buildTime: "15h" },
      { cost: 15000, currency: "COINS", maxCapacity: 1320, buildTime: "1d 7h" },
      { cost: 15000, currency: "COINS", maxCapacity: 1650, buildTime: "1d 23h" },
    ],
  },
  {
    name: "Coffee Vending Machine (Aviary)",
    coinsPerClient: 9,
    levels: [
      { cost: 9,  currency: "DIAMONDS", maxCapacity: 450,  buildTime: "3h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 675,  buildTime: "15h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 900,  buildTime: "1d 7h" },
      { cost: 10, currency: "DIAMONDS", maxCapacity: 1125, buildTime: "1d 23h" },
    ],
  },
  {
    name: "Ice Cream Machine (Aviary)",
    coinsPerClient: 12,
    levels: [
      { cost: 29, currency: "DIAMONDS", maxCapacity: 960,  buildTime: "3h" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 1440, buildTime: "16h" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 1920, buildTime: "1d 7h" },
      { cost: 30, currency: "DIAMONDS", maxCapacity: 2400, buildTime: "2d" },
    ],
  },
  {
    name: "Photo Booth (Aviary)",
    coinsPerClient: 13,
    levels: [
      { cost: 55, currency: "DIAMONDS", maxCapacity: 1040, buildTime: "3h" },
      { cost: 56, currency: "DIAMONDS", maxCapacity: 1560, buildTime: "16h" },
      { cost: 56, currency: "DIAMONDS", maxCapacity: 2080, buildTime: "1d 8h" },
      { cost: 56, currency: "DIAMONDS", maxCapacity: 2600, buildTime: "2d" },
    ],
  },
];

async function main() {
  console.log(`Importing ${shops.length} shops...`);

  for (const shop of shops) {
    const created = await prisma.regionShop.create({
      data: {
        name: shop.name,
        identifier: shop.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
        coinsPerClient: shop.coinsPerClient,
        levels: {
          createMany: {
            data: shop.levels.map((l, i) => ({
              level: i,
              cost: l.cost,
              currency: l.currency,
              maxCapacity: l.maxCapacity,
              buildTime: l.buildTime,
            })),
          },
        },
      },
    });
    console.log(`  ✓ ${created.name} (id=${created.id})`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
