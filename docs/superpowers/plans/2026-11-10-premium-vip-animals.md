# Premium & VIP Animals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two filterable, paginated overview pages under the Animals nav section listing all historical Premium and VIP bonus animals (2018–2026) stored in the database, with links to individual animal detail pages.

**Architecture:** New `PremiumVipAnimalEntry` Prisma model (one row per animal per time period); server-side filtered/paginated API; shared `BonusAnimalsContent` client component used by both pages with a `type` prop.

**Tech Stack:** Next.js 16 App Router, Prisma 6 + MySQL, next-intl, Zustand, Styled Components, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-10-premium-vip-animals-design.md`

## Global Constraints

- Never install new npm packages without explicit user approval.
- All Prisma queries live in `src/service/` only — never in components or routes.
- Use functional components + Styled Components; no Tailwind.
- Add i18n keys to all 6 locale files (de, en, da, es, fr, nl) simultaneously.
- Animal detail route pattern: `/animals/{animalId}` (numeric ID).
- Page size: 25 entries per page.
- `export const dynamic = "force-dynamic"` on API routes.

## Review Focus

- **Cross-year date ranges** (e.g. "December 30th – January 13th" in year 2025 → `endDate` must be Jan 13 **2026**, not 2025): verify `endDate.year = year + 1` when `endDate.month < startDate.month`.
- **NPC entries with `animalId = null`** must render a disabled/greyed action button without crashing the row click handler.
- **Fuzzy 2018 dates** (e.g. "October", "September – October") with `startDate = null` must render `dateLabel` only and not break date-sort ordering.
- **Animal name matching during seed**: slugification must handle apostrophes (Fea's Muntjac → `feas-muntjac`) and accented characters (Galápagos → `galapagos`); unmatched names must silently leave `animalId = null`.
- **Year filter dropdown**: must include all years present in DB for the given `type`; a year with entries only in December (cross-year) must appear under the year the period *starts* in.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `prisma/schema.prisma` | Add `PremiumVipType` enum + `PremiumVipAnimalEntry` model + relation on `Animal` |
| Create | `prisma/seed-data/premium-vip-animals.ts` | Full typed dataset from PDF (2018–2026) |
| Modify | `prisma/seed.ts` | Import dataset, slugify-match animals, upsert entries |
| Create | `src/service/PremiumVipAnimalService.ts` | Server-side filtered/paginated query + `getAvailableYears` |
| Create | `src/app/api/premium-vip-animals/route.ts` | GET handler; delegates to service |
| Create | `src/service/frontend/PremiumVipAnimal.ts` | Thin `fetch` wrapper for client components |
| Create | `src/store/useBonusAnimalsStore.ts` | Filter + pagination state + fetch action |
| Create | `messages/{de,en,da,es,fr,nl}/animals_bonus.json` | UI strings for both pages |
| Modify | `messages/{de,en,da,es,fr,nl}/navigation.json` | Add `premium_vip_animals`, `premium_animals`, `vip_animals` keys |
| Modify | `src/i18n/request.ts` | Register `animals_bonus` namespace |
| Create | `src/components/pages/animals/bonus-animals/BonusAnimalsTable.tsx` | Styled table: Zeitraum / Tier / Aktionen |
| Create | `src/components/pages/animals/bonus-animals/BonusAnimalsContent.tsx` | Filter bar + table + pagination; `"use client"` |
| Create | `src/app/[locale]/animals/premium-animals/page.tsx` | Server page; initial SSR data fetch |
| Create | `src/app/[locale]/animals/vip-animals/page.tsx` | Server page; initial SSR data fetch |
| Modify | `src/config/navigationData.ts` | Add `premium_vip_animals` submenu to `animals` section |
| Create | `src/service/PremiumVipAnimalService.test.ts` | Vitest unit tests for service |

---

## Task 1: Prisma Schema + Migration

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `PremiumVipType` enum (`PREMIUM`, `VIP`); `PremiumVipAnimalEntry` model; `premiumVipEntries` relation on `Animal`

- [ ] **Step 1: Add enum and model to `prisma/schema.prisma`**

  Add after existing enums:
  ```prisma
  enum PremiumVipType {
    PREMIUM
    VIP
  }
  ```

  Add new model:
  ```prisma
  model PremiumVipAnimalEntry {
    id         Int            @id @default(autoincrement())
    type       PremiumVipType
    year       Int
    startDate  DateTime?
    endDate    DateTime?
    dateLabel  String
    animalId   Int?
    animal     Animal?        @relation(fields: [animalId], references: [id])
    animalName String
    isNpc      Boolean        @default(false)

    @@index([type, year])
    @@index([animalId])
  }
  ```

  Add to `Animal` model:
  ```prisma
  premiumVipEntries PremiumVipAnimalEntry[]
  ```

- [ ] **Step 2: Run migration**
  ```bash
  npx prisma migrate dev --name add_premium_vip_animal_entries
  ```
  Expected: migration created and applied; Prisma client regenerated.

- [ ] **Step 3: Commit**
  ```bash
  git add prisma/schema.prisma prisma/migrations/
  git commit -m "feat: add PremiumVipAnimalEntry model and enum"
  ```

---

## Task 2: Seed Data File

**Files:**
- Create: `prisma/seed-data/premium-vip-animals.ts`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Consumes: `PremiumVipType` enum from `@prisma/client`; `Animal.identifier` for slug matching
- Produces: populated `PremiumVipAnimalEntry` table (≈500 rows)

**Seed entry shape:**
```ts
type RawEntry = {
  type: "PREMIUM" | "VIP";
  year: number;
  dateLabel: string;
  // ISO strings or null for fuzzy dates
  startDate: string | null;
  endDate: string | null;
  animals: Array<{ name: string; isNpc: boolean }>;
};
```

- [ ] **Step 1: Create `prisma/seed-data/premium-vip-animals.ts`**

  Export a `const rawEntries: RawEntry[]` containing **all entries from the PDF** (2018–2026, both PREMIUM and VIP).

  Cross-year rule: when a December period ends in January, `endDate` year = `year + 1`.
  Fuzzy dates (2018 entries like "October"): `startDate = null`, `endDate = null`.
  NPC detection: `isNpc = name.includes("NPC")`.

  Sample (first few PREMIUM 2026 entries):
  ```ts
  { type: "PREMIUM", year: 2026, dateLabel: "November 3rd – November 17th",
    startDate: "2026-11-03", endDate: "2026-11-17",
    animals: [{ name: "Cotton-Top Tamarin", isNpc: false }, { name: "Fossa", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "October 20th – November 3rd",
    startDate: "2026-10-20", endDate: "2026-11-03",
    animals: [{ name: "Cotton-Top Tamarin", isNpc: false }, { name: "European Mouflon", isNpc: false }] },
  // ... all entries through 2018
  ```

  Sample VIP entries:
  ```ts
  { type: "VIP", year: 2026, dateLabel: "September 22nd – November 17th",
    startDate: "2026-09-22", endDate: "2026-11-17",
    animals: [{ name: "Giant Squid", isNpc: false }, { name: "Gilbert Grump NPC", isNpc: true }] },
  ```

- [ ] **Step 2: Add seeding logic to `prisma/seed.ts`**

  Add a `seedPremiumVipAnimals()` async function:
  1. `await prisma.premiumVipAnimalEntry.deleteMany({})` (idempotent reset).
  2. Fetch all animals: `const animals = await prisma.animal.findMany({ select: { id: true, identifier: true } })`.
  3. Build slug map: `Map<string, number>` from `identifier → id`.
  4. Slugify helper: lowercase, replace `'` and spaces with `-`, normalize accents (`normalize("NFD").replace(/[\u0300-\u036f]/g, "")`), replace non-alphanumeric with `-`, collapse multiple dashes.
  5. For each `rawEntry`, for each animal in `entry.animals`: create one `PremiumVipAnimalEntry` row with `animalId = slugMap.get(slugify(animal.name)) ?? null`.

  Call `seedPremiumVipAnimals()` from the main `main()` function.

- [ ] **Step 3: Run seed to verify**
  ```bash
  npx prisma db seed
  ```
  Expected: no errors; check row count in Prisma Studio.

- [ ] **Step 4: Commit**
  ```bash
  git add prisma/seed-data/premium-vip-animals.ts prisma/seed.ts
  git commit -m "feat: seed premium and vip animal entries from PDF data"
  ```

---

## Task 3: Service Layer

**Files:**
- Create: `src/service/PremiumVipAnimalService.ts`
- Create: `src/service/PremiumVipAnimalService.test.ts`

**Interfaces:**
- Consumes: `PrismaClient`, `PremiumVipType` from `@prisma/client`
- Produces:
  ```ts
  export type PremiumVipAnimalEntryWithAnimal = PremiumVipAnimalEntry & {
    animal: { id: number; identifier: string } | null;
  };

  export async function getPremiumVipAnimals(
    type: PremiumVipType,
    options: { animalName?: string; year?: number; page: number; pageSize: number }
  ): Promise<{ entries: PremiumVipAnimalEntryWithAnimal[]; total: number }>

  export async function getAvailableYears(type: PremiumVipType): Promise<number[]>
  ```

- [ ] **Step 1: Write failing tests in `src/service/PremiumVipAnimalService.test.ts`**

  ```ts
  import { describe, test, expect, vi, beforeEach } from "vitest";
  import { getPremiumVipAnimals, getAvailableYears } from "./PremiumVipAnimalService";

  vi.mock("@/lib/prisma", () => ({
    default: {
      premiumVipAnimalEntry: {
        findMany: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
        groupBy: vi.fn(),
      },
    },
  }));

  import prisma from "@/lib/prisma";

  describe("getPremiumVipAnimals", () => {
    test("returns paginated entries for PREMIUM type", async () => {
      (prisma.premiumVipAnimalEntry.findMany as any).mockResolvedValue([
        { id: 1, type: "PREMIUM", year: 2026, dateLabel: "Nov 3–17", animal: null, animalName: "Fossa", isNpc: false },
      ]);
      (prisma.premiumVipAnimalEntry.count as any).mockResolvedValue(1);

      const result = await getPremiumVipAnimals("PREMIUM", { page: 1, pageSize: 25 });

      expect(result.entries).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(prisma.premiumVipAnimalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { type: "PREMIUM" }, take: 25, skip: 0 })
      );
    });

    test("filters by animalName (case-insensitive LIKE)", async () => {
      (prisma.premiumVipAnimalEntry.findMany as any).mockResolvedValue([]);
      (prisma.premiumVipAnimalEntry.count as any).mockResolvedValue(0);

      await getPremiumVipAnimals("PREMIUM", { animalName: "Fox", page: 1, pageSize: 25 });

      expect(prisma.premiumVipAnimalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            animalName: { contains: "Fox", mode: "insensitive" },
          }),
        })
      );
    });

    test("filters by year when provided", async () => {
      (prisma.premiumVipAnimalEntry.findMany as any).mockResolvedValue([]);
      (prisma.premiumVipAnimalEntry.count as any).mockResolvedValue(0);

      await getPremiumVipAnimals("VIP", { year: 2024, page: 1, pageSize: 25 });

      expect(prisma.premiumVipAnimalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ year: 2024 }) })
      );
    });

    test("calculates skip from page number", async () => {
      (prisma.premiumVipAnimalEntry.findMany as any).mockResolvedValue([]);
      (prisma.premiumVipAnimalEntry.count as any).mockResolvedValue(0);

      await getPremiumVipAnimals("PREMIUM", { page: 3, pageSize: 25 });

      expect(prisma.premiumVipAnimalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 50, take: 25 })
      );
    });
  });

  describe("getAvailableYears", () => {
    test("returns distinct years descending for given type", async () => {
      (prisma.premiumVipAnimalEntry.groupBy as any).mockResolvedValue([
        { year: 2026 }, { year: 2025 }, { year: 2024 },
      ]);

      const years = await getAvailableYears("PREMIUM");
      expect(years).toEqual([2026, 2025, 2024]);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify they fail**
  ```bash
  npx vitest run src/service/PremiumVipAnimalService.test.ts
  ```
  Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/service/PremiumVipAnimalService.ts`**

  `getPremiumVipAnimals`: build `where` clause with `type`, optional `animalName: { contains, mode: "insensitive" }`, optional `year`; run `findMany` and `count` in parallel (`Promise.all`); `orderBy: [{ year: "desc" }, { startDate: "desc" }]`; `include: { animal: { select: { id: true, identifier: true } } }`.

  `getAvailableYears`: `groupBy({ by: ["year"], where: { type }, orderBy: { year: "desc" } })` → extract `.year` values.

- [ ] **Step 4: Run tests to verify they pass**
  ```bash
  npx vitest run src/service/PremiumVipAnimalService.test.ts
  ```
  Expected: PASS (all 5 tests).

- [ ] **Step 5: Commit**
  ```bash
  git add src/service/PremiumVipAnimalService.ts src/service/PremiumVipAnimalService.test.ts
  git commit -m "feat: add PremiumVipAnimalService with filtering and pagination"
  ```

---

## Task 4: API Route

**Files:**
- Create: `src/app/api/premium-vip-animals/route.ts`

**Interfaces:**
- Consumes: `getPremiumVipAnimals`, `getAvailableYears` from `PremiumVipAnimalService`
- Produces: `GET /api/premium-vip-animals?type=PREMIUM&animalName=Fox&year=2025&page=1&pageSize=25`
  Response: `{ entries: PremiumVipAnimalEntryWithAnimal[]; total: number; availableYears: number[] }`

- [ ] **Step 1: Create `src/app/api/premium-vip-animals/route.ts`**

  ```ts
  export const dynamic = "force-dynamic";
  ```

  `GET` handler:
  - Read `type` from searchParams; validate it's `"PREMIUM"` or `"VIP"`, return 400 otherwise.
  - Read optional `animalName`, `year` (parseInt), `page` (parseInt, default 1), `pageSize` (parseInt, default 25).
  - `const [result, availableYears] = await Promise.all([getPremiumVipAnimals(...), getAvailableYears(type)])`.
  - Return `NextResponse.json({ ...result, availableYears })`.
  - Catch → 500.

- [ ] **Step 2: Verify manually** (or check with curl after `npm run dev`):
  ```
  GET /api/premium-vip-animals?type=PREMIUM&page=1&pageSize=25
  ```
  Expected: JSON with `entries`, `total`, `availableYears`.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/api/premium-vip-animals/route.ts
  git commit -m "feat: add GET /api/premium-vip-animals route"
  ```

---

## Task 5: i18n

**Files:**
- Create: `messages/de/animals_bonus.json` (and en, da, es, fr, nl)
- Modify: `messages/de/navigation.json` (and en, da, es, fr, nl)
- Modify: `src/i18n/request.ts`

**Interfaces:**
- Produces: namespace `animals_bonus` with keys used by Task 7 components

- [ ] **Step 1: Create `messages/de/animals_bonus.json`**

  ```json
  {
    "premium_title": "Premium-Tiere",
    "premium_intro": "Premium-Bonustiere werden beim Kauf von Diamantpaketen ab 100 Diamanten vergeben. Das Bonustier wechselt jeden zweiten Dienstag.",
    "vip_title": "VIP-Tiere",
    "vip_intro": "VIP-Bonustiere werden mit den meisten Diamantpaketen ab 1000 Diamanten vergeben. Das VIP-Tier wechselt alle 8 Wochen dienstags.",
    "filter_animal_name": "Tiername",
    "filter_year": "Jahr",
    "filter_all_years": "Alle Jahre",
    "col_period": "Zeitraum",
    "col_animal": "Tier",
    "col_actions": "Aktionen",
    "action_view": "Zum Tier",
    "npc_badge": "NPC",
    "no_results": "Keine Einträge gefunden."
  }
  ```

  Create equivalent files for `en`, `da`, `es`, `fr`, `nl` with translated values.

- [ ] **Step 2: Add navigation keys to `messages/de/navigation.json`** (and all other locales)

  Add:
  ```json
  "premium_vip_animals": "Premium- & VIP-Tiere",
  "premium_animals": "Premium-Tiere",
  "vip_animals": "VIP-Tiere"
  ```

- [ ] **Step 3: Register namespace in `src/i18n/request.ts`**

  Add `"animals_bonus"` to the list of loaded namespaces (follow the existing pattern for how namespaces are registered).

- [ ] **Step 4: Commit**
  ```bash
  git add messages/ src/i18n/request.ts
  git commit -m "feat: add animals_bonus i18n namespace and navigation keys"
  ```

---

## Task 6: Frontend Service + Zustand Store

**Files:**
- Create: `src/service/frontend/PremiumVipAnimal.ts`
- Create: `src/store/useBonusAnimalsStore.ts`

**Interfaces:**
- Produces:
  ```ts
  // PremiumVipAnimal.ts
  export async function fetchBonusAnimals(
    type: "PREMIUM" | "VIP",
    params: { animalName?: string; year?: number; page: number; pageSize: number }
  ): Promise<{ entries: PremiumVipAnimalEntryWithAnimal[]; total: number; availableYears: number[] }>

  // useBonusAnimalsStore.ts
  export const useBonusAnimalsStore: StateCreator producing {
    type: "PREMIUM" | "VIP";
    entries: PremiumVipAnimalEntryWithAnimal[];
    total: number;
    availableYears: number[];
    animalNameFilter: string;
    yearFilter: number | null;
    page: number;
    pageSize: 25;
    isLoading: boolean;
    setType: (type) => void;
    setAnimalNameFilter: (name: string) => void;
    setYearFilter: (year: number | null) => void;
    setPage: (page: number) => void;
    fetchEntries: () => Promise<void>;
    initializeFromSSR: (data: { entries, total, availableYears, type }) => void;
  }
  ```

- [ ] **Step 1: Create `src/service/frontend/PremiumVipAnimal.ts`**

  Single `fetchBonusAnimals` function: build `URLSearchParams` from params, fetch `/api/premium-vip-animals?${params}`, throw on `!response.ok`, return parsed JSON.

- [ ] **Step 2: Create `src/store/useBonusAnimalsStore.ts`**

  Zustand store (follow the pattern of existing stores in `src/store/`).
  - `fetchEntries` calls `fetchBonusAnimals(type, { animalNameFilter, yearFilter, page, pageSize })`, sets `isLoading` before/after.
  - `setAnimalNameFilter` and `setYearFilter` reset `page` to 1 and call `fetchEntries`.
  - `initializeFromSSR` sets initial data without triggering a fetch.

- [ ] **Step 3: Commit**
  ```bash
  git add src/service/frontend/PremiumVipAnimal.ts src/store/useBonusAnimalsStore.ts
  git commit -m "feat: add bonus animals frontend service and Zustand store"
  ```

---

## Task 7: Table + Content Components

**Files:**
- Create: `src/components/pages/animals/bonus-animals/BonusAnimalsTable.tsx`
- Create: `src/components/pages/animals/bonus-animals/BonusAnimalsContent.tsx`

**Interfaces:**
- Consumes: `useBonusAnimalsStore`, `useTranslations("animals_bonus")`, `useRouter` from `next/navigation`
- Consumes: `PremiumVipAnimalEntryWithAnimal` type from service

- [ ] **Step 1: Create `BonusAnimalsTable.tsx`**

  Styled table component (Styled Components, no Tailwind).

  Props:
  ```ts
  { entries: PremiumVipAnimalEntryWithAnimal[]; onRowClick: (entry) => void }
  ```

  Columns:
  - **Zeitraum**: `entry.dateLabel` + ` ${entry.year}` (omit year suffix if already in label — check `entry.dateLabel.includes(String(entry.year))`).
  - **Tier**: `<img>` from `/images/animals/${entry.animal?.identifier}.webp` with 40×40 fallback placeholder div when `animalId` is null; `entry.animalName`; `isNpc` → show `<NpcBadge>` (small styled span using `npc_badge` translation).
  - **Aktionen**: Link-button to `/animals/${entry.animalId}` when `animalId != null`; disabled styled button otherwise.

  Row `onClick` → `onRowClick(entry)` only when `entry.animalId != null`.
  Row cursor: `pointer` when `animalId != null`, `default` otherwise.

- [ ] **Step 2: Create `BonusAnimalsContent.tsx`** (`"use client"`)

  Props: `{ type: "PREMIUM" | "VIP"; initialData: { entries, total, availableYears } }`

  On mount: call `store.initializeFromSSR({ ...initialData, type })`.

  Renders:
  1. Two Styled Components inputs side by side:
     - Text input bound to `animalNameFilter` → `setAnimalNameFilter` with 300ms debounce.
     - `<select>` bound to `yearFilter`: first option = `filter_all_years` (value `""`), then `availableYears.map(y => <option>{y}</option>)`.
  2. `<BonusAnimalsTable entries={entries} onRowClick={(e) => router.push(`/animals/${e.animalId}`)} />`
  3. Pagination component (follow existing pagination pattern from other overview pages).
  4. Loading state: show spinner or skeleton when `isLoading`.

- [ ] **Step 3: Commit**
  ```bash
  git add src/components/pages/animals/bonus-animals/
  git commit -m "feat: add BonusAnimalsTable and BonusAnimalsContent components"
  ```

---

## Task 8: Pages + Navigation

**Files:**
- Create: `src/app/[locale]/animals/premium-animals/page.tsx`
- Create: `src/app/[locale]/animals/vip-animals/page.tsx`
- Modify: `src/config/navigationData.ts`

**Interfaces:**
- Consumes: `getPremiumVipAnimals`, `getAvailableYears` from service; `BonusAnimalsContent`; `PageWrapper`, `ContentWrapper`

- [ ] **Step 1: Create `src/app/[locale]/animals/premium-animals/page.tsx`**

  Async server component:
  ```ts
  export default async function PremiumAnimalsPage() {
    const [result, availableYears] = await Promise.all([
      getPremiumVipAnimals("PREMIUM", { page: 1, pageSize: 25 }),
      getAvailableYears("PREMIUM"),
    ]);
    return (
      <PageWrapper>
        <ContentWrapper>
          <BonusAnimalsContent type="PREMIUM" initialData={{ ...result, availableYears }} />
        </ContentWrapper>
      </PageWrapper>
    );
  }
  ```

- [ ] **Step 2: Create `src/app/[locale]/animals/vip-animals/page.tsx`**

  Same structure as Step 1 but with `"VIP"`.

- [ ] **Step 3: Add navigation entries to `src/config/navigationData.ts`**

  In the `animals` NavItem (id: `"animals"`), add a new submenu item after the `collections` group:
  ```ts
  {
    labelKey: "premium_vip_animals",
    subMenu: [
      { labelKey: "premium_animals", href: "/animals/premium-animals", requiresAuth: false },
      { labelKey: "vip_animals",     href: "/animals/vip-animals",     requiresAuth: false },
    ],
  },
  ```

- [ ] **Step 4: Smoke test**

  Start dev server (`npm run dev`) and verify:
  - `/de/animals/premium-animals` renders table with entries.
  - `/de/animals/vip-animals` renders table with entries.
  - Year filter changes visible rows.
  - Animal name filter narrows results.
  - Clicking a row with `animalId` navigates to `/animals/{id}`.
  - NPC rows show disabled button and no navigation on click.
  - Navigation menu shows "Premium- & VIP-Tiere" under "Tiere".

- [ ] **Step 5: Commit**
  ```bash
  git add src/app/[locale]/animals/premium-animals/ \
          src/app/[locale]/animals/vip-animals/ \
          src/config/navigationData.ts
  git commit -m "feat: add premium and vip animals pages with navigation"
  ```
