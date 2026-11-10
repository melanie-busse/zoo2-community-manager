# Premium & VIP Animals – Design Spec

**Date:** 2026-11-10
**Branch:** feature/wiki (extend with animals section work)

---

## Overview

Two new overview pages displaying the historical list of Premium and VIP bonus animals in Zoo 2: Animal Park. Players who buy diamond packages receive bonus animals; this feature makes those historical records searchable and links them to the existing animal detail pages.

Data is sourced from the official Zoo 2 Fandom Wiki PDF (covering 2018–2026) and stored in the database.

---

## Routes & Navigation

| Page | Route |
|---|---|
| Premium Animals | `/animals/premium-animals` |
| VIP Animals | `/animals/vip-animals` |

Both pages are added to the **Animals** nav section (`id: "animals"`) as a new third-level submenu group:

```ts
{
  labelKey: "premium_vip_animals",
  subMenu: [
    { labelKey: "premium_animals", href: "/animals/premium-animals", requiresAuth: false },
    { labelKey: "vip_animals",     href: "/animals/vip-animals",     requiresAuth: false },
  ]
}
```

The existing `wiki_vip_animals` entry in the wiki nav is **not changed** – it refers to something else.

---

## Data Model

### New Prisma Enum

```prisma
enum PremiumVipType {
  PREMIUM
  VIP
}
```

### New Prisma Model

```prisma
model PremiumVipAnimalEntry {
  id         Int            @id @default(autoincrement())
  type       PremiumVipType
  year       Int
  startDate  DateTime?
  endDate    DateTime?
  dateLabel  String         // Raw string from PDF e.g. "November 3rd – November 17th"
  animalId   Int?
  animal     Animal?        @relation(fields: [animalId], references: [id])
  animalName String         // Always set: PDF name (English), including NPCs
  isNpc      Boolean        @default(false)

  @@index([type, year])
  @@index([animalId])
}
```

**One row = one animal in one time period.**
If a period has 3 animals (e.g. "Cotton-Top Tamarin or Fossa or European Mouflon"), it creates 3 rows with the same `dateLabel`, `startDate`, `endDate`, and `year`.

`animalId` is nullable: NPC entries and animals not found in the DB via identifier matching have `null`. `animalName` is always set as a display fallback.

`Animal` model gains a new relation: `premiumVipEntries PremiumVipAnimalEntry[]`.

---

## Seeding

All ~500 entries from the PDF (Premium 2018–2026, VIP 2018–2026) are seeded via `prisma/seed.ts`.

**Matching logic per animal name:**
1. Slugify the English name from PDF (lowercase, replace spaces/apostrophes/hyphens → `-`, strip special chars).
2. Query `Animal` by `identifier = slug`.
3. If found → set `animalId`. Otherwise → `animalId = null`.
4. NPC entries (name contains "NPC") → `isNpc = true`, `animalId = null`.

**Date parsing:**
- Full date ranges (e.g. "November 3rd - November 17th") → parse to `startDate`/`endDate` using the `year` of that section.
- Partial entries (e.g. "October 2018") → `startDate`/`endDate = null`, `dateLabel` holds the raw string.
- Cross-year ranges (e.g. "December 30th - January 13th" in the 2025 section) → `endDate` year = year+1.

The seed is **idempotent**: runs `deleteMany` for each type before inserting, so it can be re-run safely.

---

## Service Layer

**File:** `src/service/premiumVipAnimalService.ts`

```ts
export async function getPremiumVipAnimals(
  type: PremiumVipType,
  options: {
    animalName?: string;
    year?: number;
    page: number;
    pageSize: number;
  }
): Promise<{ entries: PremiumVipAnimalEntryWithAnimal[]; total: number }>
```

Queries `PremiumVipAnimalEntry` with:
- `WHERE type = type`
- Optional: `animalName LIKE %search%` (case-insensitive)
- Optional: `year = year`
- `ORDER BY year DESC, startDate DESC`
- Pagination via `skip` / `take`

Includes related `animal` (for `identifier` → image path and link).

---

## Frontend Architecture

### Pages (Server Components)

```
src/app/[locale]/animals/premium-animals/page.tsx
src/app/[locale]/animals/vip-animals/page.tsx
```

Each page:
1. Reads `searchParams` for initial filter values + page.
2. Calls `getPremiumVipAnimals(type, options)` server-side.
3. Passes data + total to `BonusAnimalsContent` (client component).

### Shared Client Component

**File:** `src/components/pages/animals/bonus-animals/BonusAnimalsContent.tsx`

Props:
```ts
{
  type: "PREMIUM" | "VIP";
  initialEntries: PremiumVipAnimalEntryWithAnimal[];
  initialTotal: number;
  initialPage: number;
  availableYears: number[];  // for year filter dropdown
}
```

Responsibilities:
- Renders filter bar (animal name text input + year dropdown).
- Fetches filtered data via frontend service on filter/page change.
- Renders `BonusAnimalsTable`.
- Renders `Pagination`.

### Table Component

**File:** `src/components/pages/animals/bonus-animals/BonusAnimalsTable.tsx`

Columns:
| Column | Content |
|---|---|
| Zeitraum | `dateLabel` + `year` |
| Tier | Animal image (from `/public/images/animals/{identifier}.webp` if `animalId` set, else placeholder) + `animalName` |
| Aktionen | Link-Button → `/animals/{animalId}` if `animalId` set; disabled/greyed button if NPC or unmatched |

Clicking a row also navigates to `/animals/{animalId}` (if available).

### Frontend Service

**File:** `src/service/frontend/premiumVipAnimalFrontendService.ts`

Thin fetch wrapper calling the API route.

### API Route

**File:** `src/app/api/premium-vip-animals/route.ts`

Accepts query params: `type`, `animalName`, `year`, `page`, `pageSize`.
Calls the service and returns JSON.

### Zustand Store

**File:** `src/store/useBonusAnimalsStore.ts`

Holds: `animalNameFilter`, `yearFilter`, `page`, `pageSize` (default 25), `entries`, `total`, `isLoading`.
Actions: `setAnimalNameFilter`, `setYearFilter`, `setPage`, `fetchEntries`.

---

## i18n

New message file `messages/{locale}/animals_bonus.json` for all 6 locales (de, en, da, es, fr, nl).

Keys:
```json
{
  "premium_title": "...",
  "premium_intro": "...",
  "vip_title": "...",
  "vip_intro": "...",
  "filter_animal_name": "...",
  "filter_year": "...",
  "filter_all_years": "...",
  "col_period": "...",
  "col_animal": "...",
  "col_actions": "...",
  "action_view": "...",
  "npc_badge": "NPC",
  "no_results": "..."
}
```

Navigation keys added to `messages/{locale}/navigation.json`:
- `premium_vip_animals`
- `premium_animals`
- `vip_animals`

---

## Out of Scope

- Creating/editing entries via UI (data is seeded only; updates require re-seeding or direct DB edit).
- Showing animal images for entries where `animalId = null`.
- The existing `/wiki/vip-animals` page – not touched.