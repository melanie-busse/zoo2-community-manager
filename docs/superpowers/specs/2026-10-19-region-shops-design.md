# Region Shops — Design Spec

**Date:** 2026-10-19
**Branch:** feature/shops

---

## Goal

Add a "Shops" section to the Region detail page that displays per-region shops with their upgrade levels. Admins (Director+) can create, edit, and delete shops and their level data via inline modals on the detail page.

---

## Data Model

### `RegionShop`

| Column          | Type     | Constraints                          |
|-----------------|----------|--------------------------------------|
| `id`            | Int      | @id @default(autoincrement())        |
| `regionId`      | Int      | FK → Region                          |
| `name`          | String   | @db.VarChar(255)                     |
| `coinsPerClient`| Int?     | nullable                             |
| `levels`        | relation | RegionShopLevel[]                    |

`@@map("regionshop")`

### `RegionShopLevel`

| Column        | Type   | Constraints                                        |
|---------------|--------|----------------------------------------------------|
| `id`          | Int    | @id @default(autoincrement())                      |
| `shopId`      | Int    | FK → RegionShop (onDelete: Cascade)                |
| `level`       | Int    |                                                    |
| `cost`        | Int    |                                                    |
| `currency`    | String | @default("COINS") — values: "COINS" or "DIAMONDS" |
| `maxCapacity` | Int    |                                                    |
| `buildTime`   | String | @db.VarChar(50) — e.g. "1m", "2h", "9h"           |

`@@map("regionshoplevel")`

**Region model** gets a new relation field: `shops RegionShop[]`

---

## Image Convention

Images are NOT stored in the database. The path is derived at runtime:

```
/images/regions/{region.identifier.toLowerCase()}/shops/{shop.name}/image.jpg
```

The shop `name` is used as-is (the user creates the folder with that exact name). The component uses an `onError` handler to hide the image if it doesn't exist.

---

## Backend

### Service (`src/service/RegionService.ts`)

Four new functions added to the existing service file:

```ts
getShopsByRegionId(regionId: number): Promise<RegionShop & { levels: RegionShopLevel[] }[]>
createShop(regionId: number, data: ShopInput): Promise<RegionShop>
updateShop(shopId: number, data: ShopInput): Promise<RegionShop>
deleteShop(shopId: number): Promise<void>
```

`ShopInput`:
```ts
{ name: string; coinsPerClient: number | null; levels: { level: number; cost: number; currency: string; maxCapacity: number; buildTime: string }[] }
```

`createShop` uses nested `createMany` for levels.
`updateShop` deletes all existing levels for the shop then re-creates them (simplest correct approach for level replacement).

`getRegionById` is extended to include:
```ts
shops: { include: { levels: { orderBy: { level: "asc" } } } }
```

### API Routes

**`/api/regions/[id]/shops/route.ts`** (new file)
- `GET`: calls `getShopsByRegionId(regionId)`, returns JSON
- `POST`: auth check (Director+), body validation (`name` required), calls `createShop`

**`/api/regions/[id]/shops/[shopId]/route.ts`** (new file)
- `PUT`: auth check (Director+), NaN guard on shopId, body validation (`name` required), calls `updateShop`
- `DELETE`: auth check (Director+), NaN guard on shopId, calls `deleteShop`

All handlers wrapped in try/catch returning appropriate status codes.

### Frontend Service (`src/service/frontend/Region.ts`)

Three new client-side fetch functions added to the existing file:
```ts
createShopOnClient(regionId: number, data: ShopInput): Promise<void>
updateShopOnClient(regionId: number, shopId: number, data: ShopInput): Promise<void>
deleteShopOnClient(regionId: number, shopId: number): Promise<void>
```

---

## Frontend

### `RegionShopSection` component

**File:** `src/components/pages/zoo/regions/RegionShopSection.tsx`
`"use client"`

**Props:**
```ts
interface RegionShopSectionProps {
  regionId: number;
  regionIdentifier: string;
  shops: ShopWithLevels[];
  isAdmin: boolean;
}
```

**Rendered structure:**
```
<InfoAccordion title="Shops" icon="/images/icons/buildings.png" defaultOpen={false}>
  [Add Shop button — only if isAdmin]
  {shops.map(shop => <ShopRow />)}
</InfoAccordion>
```

**Per shop (`ShopRow`):**
- Left: `<img>` with `src=/images/regions/{identifier}/shops/{shop.name}/image.jpg` and `onError` → `style.display = "none"`
- Right column:
  - Shop name (bold heading)
  - `{coinsPerClient} Coins / Kunde` (if set)
  - Level table: Level | Kosten (CurrencyBadge) | Max. Kapazität | Bauzeit
- Admin actions: Edit button + Delete button (with confirmation) per shop

**Currency mapping for table:** `currency === "DIAMONDS"` → `CurrencyType = "Diamond"`, else `"Zoodollar"`

**State:** `RegionShopSection` manages `shops` state locally (initialised from props), and `modalState: { mode: "create" | "edit"; shop?: ShopWithLevels } | null`.

**Modal (`ShopModal`)** — inline component within the same file:
- Fields: Name (text), Coins per Client (number, optional)
- Dynamic level rows (add/remove): Level (auto number starting 0), Cost (number), Currency (select: COINS/DIAMONDS), Max Capacity (number), Build Time (text, e.g. "2h")
- Submit calls `createShopOnClient` or `updateShopOnClient`, then updates local `shops` state and closes modal
- Styled with the same `LangCard` / overlay pattern used elsewhere in the project (full-screen semi-transparent overlay + centered card)

### Integration in `RegionDetailContent`

1. Add `shops: ShopWithLevels[]` to the `Region` interface prop
2. Add `<RegionShopSection>` below the last `CardsGrid` (Design Boutique / Clubhouse block), always rendered (even when `shops` is empty — so admins can add the first shop)

### `RegionDetailContent` data flow

```
page.tsx (SSR)
  → getRegionById (now includes shops + levels)
  → RegionDetailContent (receives shops in region prop)
    → RegionShopSection (manages its own CRUD state)
```

---

## i18n

Add keys to all 6 locale files (`messages/{de,en,da,es,fr,nl}/region.json`):

| Key | de example |
|-----|------------|
| `region.shops` | "Shops" |
| `region.coins_per_client` | "Coins / Kunde" |
| `region.shop_name` | "Name" |
| `region.add_shop` | "Shop hinzufügen" |
| `region.edit_shop` | "Shop bearbeiten" |
| `region.save_shop` | "Speichern" |
| `region.level` | "Level" (already exists — reuse) |
| `region.max_capacity` | "Max. Kapazität" |
| `region.build_time` | "Bauzeit" (may already exist — reuse or add) |

---

## Auth

All write operations require `hasMinimumRole(session, "Director")` — same as all other region mutations. `isMayor` check on PUT (read-only notice) consistent with the existing `/api/regions/[id]` PUT handler.

---

## Out of Scope

- Shop ordering / drag-and-drop
- Image upload (images are placed manually in the filesystem)
- Purchase limit column (explicitly excluded per requirements)
- Separate shop list/overview page — shops are always viewed per region

---

## Review Focus

1. **Cascade delete** — deleting a `RegionShop` must cascade to all its `RegionShopLevel` rows; verify the `onDelete: Cascade` migration lands correctly.
2. **Empty shop list for non-admins** — if a region has no shops, non-admins should see nothing (section hidden entirely), not an empty accordion.
3. **Level replacement on update** — deleting + re-creating levels on `updateShop` must be atomic (Prisma transaction) to avoid partial state if the create fails.
4. **Image path with special characters** — shop names with spaces or umlauts produce paths like `/images/regions/savanna/shops/Blumen Stand/image.jpg`; the `<img>` tag handles this fine but the user must name folders accordingly.
5. **Modal form validation** — at least one level row required on save; cost and maxCapacity must be positive integers; buildTime must be non-empty string.
