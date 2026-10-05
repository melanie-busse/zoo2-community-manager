# Region Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Meine Regionen" inventory page under Inventar where users can track which regions they own and which buildings/slots they have unlocked.

**Architecture:** New `ZooInventoryRegion` Prisma model (one row per user+region) stores ownership and building unlock state. A POST API route upserts individual fields on change (same pattern as `/api/zooInventory/animals`). The page renders one card per region with checkboxes and selectboxes that save immediately on change — no save button.

**Tech Stack:** Next.js 16, Prisma 6, MySQL, next-intl, Styled Components, NextAuth, Vitest

**Spec:** Design approved in conversation on 2026-10-05 — see brainstorming session.

## Global Constraints

- No new npm packages without explicit permission
- Functional components + Styled Components only — no Tailwind
- Add i18n keys to all 6 locale files: `de`, `en`, `da`, `nl`, `es`, `fr`
- All locale message files are under `messages/{locale}/`
- API routes follow the pattern in `src/app/api/zooInventory/animals/route.ts`
- Service functions live in `src/service/` (server-only) or `src/service/frontend/` (client fetch wrappers)
- Theme: use `theme.spacing(n)`, colors, and breakpoints from `src/styles/theme.ts`
- Auth: `requiresAuth: true` in `navigationData.ts`; page redirects if no session

## Review Focus

- **Region with no guestLounge:** `guestLounge` checkbox must not render; `guestLounge: false` must not be sent to API. Tested in Task 3 (card rendering).
- **First-ever save (no DB row yet):** Upsert must create the row with correct defaults for all unset fields. Tested in Task 2 (service upsert).
- **Selectbox boundary — 0 slots:** A region with 0 `breedingCenterSlots` should show only option `0`; selecting it sends `breedingCenterSlots: 0`. Tested in Task 3.
- **Optimistic update on API failure:** If the POST fails, the UI state has already been updated optimistically — the user sees stale data. This is accepted behaviour matching other inventory pages (no rollback). Document in code.
- **admissionsBoothLevel options:** The selectbox values must be the actual `booth_level` integers from the region's `admissionsBooths` array (not 0..N indices). Tested in Task 3.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `prisma/schema.prisma` | Modify | Add `ZooInventoryRegion` model |
| `prisma/migrations/…` | Create | Migration for new table |
| `src/service/RegionInventoryService.ts` | Create | Server: load all regions with user inventory; upsert one field |
| `src/service/RegionInventoryService.test.ts` | Create | Unit tests for service |
| `src/app/api/zooInventory/regions/route.ts` | Create | POST endpoint: upsert one field |
| `src/service/frontend/RegionInventory.ts` | Create | Client fetch wrapper |
| `src/service/frontend/RegionInventory.test.ts` | Create | Unit tests for frontend service |
| `src/app/[locale]/zooInventory/regions/page.tsx` | Create | SSR page — fetches data, passes to client |
| `src/components/pages/zooInventory/Regions/RegionInventoryContent.tsx` | Create | Client — grid of cards, local state, handleChange |
| `src/components/pages/zooInventory/Regions/RegionInventoryCard.tsx` | Create | One card per region |
| `src/config/navigationData.ts` | Modify | Add `inventory_regions` menu item |
| `messages/{locale}/navigation.json` (×6) | Modify | Add `inventory_regions` label |
| `messages/{locale}/region.json` (×6) | Modify | Add `inventory.*` keys |

---

## Task 1: DB Model + Migration

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_zoo_inventory_region/migration.sql`

**Interfaces:**
- Produces: Prisma model `ZooInventoryRegion` with fields below; available as `prisma.zooInventoryRegion`

**Model to add to `schema.prisma`:**
```prisma
model ZooInventoryRegion {
  id                   Int     @id @default(autoincrement())
  userid               Int
  regionId             Int
  owned                Boolean @default(false)
  breedingCenterSlots  Int?
  admissionsBoothLevel Int?
  adminBuilding        Boolean @default(false)
  visitorCenter        Boolean @default(false)
  transportStation     Boolean @default(false)
  guestLounge          Boolean @default(false)

  @@unique([userid, regionId])
  @@map("zooinventoryregion")
}
```

- [ ] Add the model above to the end of `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev --name add_zoo_inventory_region`
- [ ] Verify migration succeeds and `prisma.zooInventoryRegion` is available
- [ ] Commit: `git commit -m "feat: add ZooInventoryRegion prisma model and migration"`

---

## Task 2: RegionInventoryService + Tests

**Files:**
- Create: `src/service/RegionInventoryService.ts`
- Create: `src/service/RegionInventoryService.test.ts`

**Interfaces:**
- Consumes: `prisma.zooInventoryRegion` (Task 1), `prisma.region.findMany` (existing)
- Produces:
  - `getRegionsWithInventory(userId: number, locale: string): Promise<RegionWithInventory[]>`
  - `upsertRegionInventory(userId: number, regionId: number, field: RegionInventoryField, value: boolean | number | null): Promise<void>`
  - Type: `RegionInventoryField = "owned" | "breedingCenterSlots" | "admissionsBoothLevel" | "adminBuilding" | "visitorCenter" | "transportStation" | "guestLounge"`

**`getRegionsWithInventory`** fetches all regions (with `regionTexts`, `breedingCenterSlots`, `admissionsBooths`, `guestLounges` included) ordered by `id asc`, then fetches all `ZooInventoryRegion` rows for that user, and returns a merged array. Each element:
```ts
{
  region: { id, identifier, regionTexts, breedingCenterSlots, admissionsBooths, guestLounges },
  inventory: { owned, breedingCenterSlots, admissionsBoothLevel, adminBuilding, visitorCenter, transportStation, guestLounge } | null
}
```

**`upsertRegionInventory`** calls `prisma.zooInventoryRegion.upsert` with `where: { userid_regionId: { userid, regionId } }`. On create, all Boolean fields default to `false`, both Int? fields default to `null`, except the field being set.

- [ ] Write failing tests in `RegionInventoryService.test.ts`:

```ts
// mock: vi.mock("server-only", () => ({}))
// mock: prisma.region.findMany, prisma.zooInventoryRegion.findMany, prisma.zooInventoryRegion.upsert

test("getRegionsWithInventory: merges regions with null inventory when no rows exist")
// prisma.region.findMany returns [{id:1, identifier:"MainZoo", regionTexts:[{name:"Hauptzoo"}], breedingCenterSlots:[], admissionsBooths:[], guestLounges:[]}]
// prisma.zooInventoryRegion.findMany returns []
// expect result[0].inventory to be null

test("getRegionsWithInventory: merges existing inventory row correctly")
// zooInventoryRegion.findMany returns [{userid:1, regionId:1, owned:true, breedingCenterSlots:2, ...}]
// expect result[0].inventory.owned === true

test("upsertRegionInventory: calls upsert with correct where and update payload")
// call upsertRegionInventory(1, 5, "owned", true)
// expect prisma.zooInventoryRegion.upsert called with where:{userid_regionId:{userid:1,regionId:5}}, update:{owned:true}

test("upsertRegionInventory: create payload has all fields with correct defaults")
// call upsertRegionInventory(1, 5, "adminBuilding", true)
// expect create payload: {userid:1, regionId:5, owned:false, breedingCenterSlots:null, admissionsBoothLevel:null, adminBuilding:true, visitorCenter:false, transportStation:false, guestLounge:false}
```

- [ ] Run tests — verify they fail
- [ ] Implement `src/service/RegionInventoryService.ts` with `"use server only"` header
- [ ] Run tests — verify they pass
- [ ] Commit: `git commit -m "feat: add RegionInventoryService"`

---

## Task 3: API Route + Frontend Service + Tests

**Files:**
- Create: `src/app/api/zooInventory/regions/route.ts`
- Create: `src/service/frontend/RegionInventory.ts`
- Create: `src/service/frontend/RegionInventory.test.ts`

**Interfaces:**
- Consumes: `upsertRegionInventory` from Task 2
- Produces:
  - `updateRegionInventoryOnClient(regionId: number, field: RegionInventoryField, value: boolean | number | null): Promise<void>`

**API route** follows `src/app/api/zooInventory/animals/route.ts` exactly. POST body: `{ regionId, field, value }`. Requires session. Calls `upsertRegionInventory(session.user.id, regionId, field, value)`. Returns `{ success: true }` on success, 400 if `regionId` or `field` missing, 401 if no session, 500 on error.

**Frontend service** — single function that POSTs to `/api/zooInventory/regions`. Throws on non-ok response.

- [ ] Write failing tests in `RegionInventory.test.ts`:

```ts
test("updateRegionInventoryOnClient: sends POST with correct body")
// stub fetch ok; call updateRegionInventoryOnClient(3, "owned", true)
// expect fetch("/api/zooInventory/regions", {method:"POST", body: JSON.stringify({regionId:3, field:"owned", value:true})})

test("updateRegionInventoryOnClient: throws on non-ok response")
// stub fetch not ok; expect rejects
```

- [ ] Run tests — verify they fail
- [ ] Implement `src/service/frontend/RegionInventory.ts`
- [ ] Implement `src/app/api/zooInventory/regions/route.ts`
- [ ] Run tests — verify they pass
- [ ] Commit: `git commit -m "feat: add region inventory API route and frontend service"`

---

## Task 4: RegionInventoryCard

**Files:**
- Create: `src/components/pages/zooInventory/Regions/RegionInventoryCard.tsx`

**Interfaces:**
- Consumes: `updateRegionInventoryOnClient` from Task 3; `RegionInventoryField` type from Task 2
- Produces: `RegionInventoryCard` component

**Props:**
```ts
interface RegionInventoryCardProps {
  region: {
    id: number;
    identifier: string;
    regionTexts: { name: string }[];
    breedingCenterSlots: { slot: number }[];
    admissionsBooths: { booth_level: number }[];
    guestLounges: { id: number }[];
  };
  inventory: {
    owned: boolean;
    breedingCenterSlots: number | null;
    admissionsBoothLevel: number | null;
    adminBuilding: boolean;
    visitorCenter: boolean;
    transportStation: boolean;
    guestLounge: boolean;
  } | null;
  onFieldChange: (regionId: number, field: RegionInventoryField, value: boolean | number | null) => void;
}
```

**Card layout:**
- Header row: region name (bold) + checkbox `owned`
- `breedingCenterSlots` selectbox: options `0, 1, …, breedingCenterSlots.length`; value = `inventory.breedingCenterSlots ?? 0`
- `admissionsBoothLevel` selectbox: options are the distinct `booth_level` values from `admissionsBooths` prepended by `0`; value = `inventory.admissionsBoothLevel ?? 0`
- `<hr />` divider (styled)
- Checkbox row for `adminBuilding` (always shown)
- Checkbox row for `visitorCenter` (always shown)
- Checkbox row for `transportStation` (always shown)
- Checkbox row for `guestLounge` (only shown when `region.guestLounges.length > 0`)

All inputs call `onFieldChange(region.id, fieldName, newValue)` on change. Use `e.stopPropagation()` on input wrappers to avoid card click events.

i18n keys needed (from `region` namespace): `inventory.owned`, `inventory.breeding_slots_unlocked`, `inventory.admissions_booth_level`, `inventory.admin_building`, `inventory.visitor_center`, `inventory.transport_station`, `inventory.guest_lounge`

Use `CardContainer`, `CardHeaderRow` from existing card components. Styled Components for layout rows inside card.

- [ ] Implement `RegionInventoryCard.tsx` — no automated test (pure presentational, props-driven)
- [ ] Commit: `git commit -m "feat: add RegionInventoryCard component"`

---

## Task 5: RegionInventoryContent + Page

**Files:**
- Create: `src/components/pages/zooInventory/Regions/RegionInventoryContent.tsx`
- Create: `src/app/[locale]/zooInventory/regions/page.tsx`

**Interfaces:**
- Consumes: `getRegionsWithInventory` (Task 2), `RegionInventoryCard` (Task 4), `updateRegionInventoryOnClient` (Task 3)

**`RegionInventoryContent`** (client component):
- Props: `data: { region: ..., inventory: ... }[]`
- State: `inventoryMap: Map<regionId, inventoryFields>` — initialized from props
- `handleChange(regionId, field, value)`: updates map optimistically, then calls `updateRegionInventoryOnClient` (fire-and-forget, log error on failure — matching other inventory pages)
- Renders a `Grid` (2-column desktop, 1-column mobile) of `RegionInventoryCard`

**`page.tsx`** (server component):
- Requires session — redirect to `/${locale}` if no session
- Fetches `getRegionsWithInventory(userId, locale)` in parallel with `getTranslations({locale, namespace:"region"})`
- Renders `PageWrapper > ContentWrapper > PageHeader + RegionInventoryContent`
- `PageHeader` text: `t("inventory.title")` — add key `"Meine Regionen"` to all locale region files

- [ ] Implement `RegionInventoryContent.tsx`
- [ ] Implement `page.tsx`
- [ ] Commit: `git commit -m "feat: add RegionInventoryContent and page"`

---

## Task 6: Navigation + i18n

**Files:**
- Modify: `src/config/navigationData.ts`
- Modify: `messages/de/navigation.json`, `messages/en/navigation.json`, `messages/da/navigation.json`, `messages/nl/navigation.json`, `messages/es/navigation.json`, `messages/fr/navigation.json`
- Modify: `messages/de/region.json`, `messages/en/region.json`, `messages/da/region.json`, `messages/nl/region.json`, `messages/es/region.json`, `messages/fr/region.json`

**Navigation entry** — add after `inventory_statues` in the `inventory` subMenu:
```ts
{ labelKey: "inventory_regions", href: "/zooInventory/regions", requiresAuth: true }
```

**`navigation.json` key** `"inventory_regions"`:
- de: `"Regionen"`
- en: `"Regions"`
- da: `"Regioner"`
- nl: `"Regio's"`
- es: `"Regiones"`
- fr: `"Régions"`

**`region.json` keys** (add `"inventory"` object):
```json
"inventory": {
  "title": "Meine Regionen",
  "owned": "Habe ich",
  "breeding_slots_unlocked": "Zuchtplätze freigeschaltet",
  "admissions_booth_level": "Eingangskasse Level",
  "admin_building": "Mitarbeitervilla/-zimmer",
  "visitor_center": "Besucherzentrum",
  "transport_station": "Transportstation",
  "guest_lounge": "Gästelounge"
}
```

Translations for other locales (add equivalent `"inventory"` object):
- en: title="My Regions", owned="I have it", breeding_slots_unlocked="Breeding slots unlocked", admissions_booth_level="Admissions booth level", admin_building="Staff villa/room", visitor_center="Visitor center", transport_station="Transport station", guest_lounge="Guest lounge"
- da: title="Mine regioner", owned="Jeg har", breeding_slots_unlocked="Avlspladser låst op", admissions_booth_level="Indgangskasse niveau", admin_building="Personalevilla/-rum", visitor_center="Besøgscenter", transport_station="Transportstation", guest_lounge="Gæstelounge"
- nl: title="Mijn regio's", owned="Ik heb het", breeding_slots_unlocked="Fokplekken ontgrendeld", admissions_booth_level="Kassa niveau", admin_building="Personeelsvilla/-kamer", visitor_center="Bezoekerscentrum", transport_station="Transportstation", guest_lounge="Gastenlounge"
- es: title="Mis regiones", owned="Lo tengo", breeding_slots_unlocked="Plazas de cría desbloqueadas", admissions_booth_level="Nivel de taquilla", admin_building="Villa/habitación del personal", visitor_center="Centro de visitantes", transport_station="Estación de transporte", guest_lounge="Sala de invitados"
- fr: title="Mes régions", owned="Je l'ai", breeding_slots_unlocked="Places d'élevage débloquées", admissions_booth_level="Niveau de caisse d'entrée", admin_building="Villa/chambre du personnel", visitor_center="Centre des visiteurs", transport_station="Station de transport", guest_lounge="Salon des invités"

- [ ] Add nav entry to `navigationData.ts`
- [ ] Add `inventory_regions` key to all 6 `navigation.json` files
- [ ] Add `inventory` object to all 6 `region.json` files
- [ ] Run `npx vitest run` — all tests pass
- [ ] Commit: `git commit -m "feat: add region inventory navigation and i18n"`
