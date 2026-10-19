# Region Shops Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-region shops with upgrade levels to the Region detail page, with full CRUD for admins via inline modals.

**Architecture:** Two new Prisma models (`RegionShop`, `RegionShopLevel`) backed by a nested API at `/api/regions/[id]/shops` and `/api/regions/[id]/shops/[shopId]`. The detail page receives shops via SSR (`getRegionById`) and renders a new full-width `RegionShopSection` component below the existing building cards; admins manage shops via a modal form within that component.

**Tech Stack:** Next.js 16 App Router, Prisma 6 + MySQL, NextAuth, next-intl, Zustand (not needed here), Styled Components, Vitest + vi.mock

**Spec:** `docs/superpowers/specs/2026-10-19-region-shops-design.md`

## Global Constraints

- Never install new npm packages without explicit user approval.
- All styled components use Styled Components (no Tailwind or atomic CSS).
- i18n keys must be added to all 6 locale files: `messages/{de,en,da,es,fr,nl}/region.json`.
- Auth guard on all write operations: `hasMinimumRole(session, "Director")`. POST/PUT also check `isMayor` → 403 with `{ message: tUser("mayor_readonly_notice"), error: "MayorReadonly" }`.
- All API route handlers wrapped in try/catch returning status 500 on unexpected errors.
- NaN guard on numeric route params: return 400 if `isNaN(id)`.
- Image path convention (no DB column): `/images/regions/{region.identifier.toLowerCase()}/shops/{shop.name}/image.jpg`
- `currency` values: `"COINS"` or `"DIAMONDS"`. Maps to `CurrencyType`: `"COINS"` → `"Zoodollar"`, `"DIAMONDS"` → `"Diamond"`.
- `updateShop` must replace levels inside a Prisma `$transaction` (delete all + createMany).

## Review Focus

1. **Empty shops for non-admins** — a region with no shops must render nothing (no accordion shown) for non-admin users; the accordion only shows when `isAdmin || shops.length > 0`. Tested in Task 5 (component prop logic).
2. **Whitespace-only shop name** — `POST` with `name: "   "` must return 400. Added to Task 3's POST tests.
3. **Non-numeric shopId on PUT/DELETE** — `PUT /api/regions/5/shops/abc` must return 400. Added to Task 4's tests.
4. **Level transaction atomicity** — `updateShop` deletes then re-creates levels in one `$transaction`; if createMany throws, the delete is rolled back. Verified by the service call structure in Task 2 (no unit test — Prisma transaction is a framework guarantee; the route test confirms `updateShop` is called).
5. **`createShopOnClient` URL shape** — must hit `/api/regions/{regionId}/shops`, not `/api/shops`. Verified in Task 4's frontend service tests.

---

## File Structure

**New files:**
- `src/app/api/regions/[id]/shops/route.ts` — GET + POST handlers
- `src/app/api/regions/[id]/shops/route.test.ts` — tests for GET + POST
- `src/app/api/regions/[id]/shops/[shopId]/route.ts` — PUT + DELETE handlers
- `src/app/api/regions/[id]/shops/[shopId]/route.test.ts` — tests for PUT + DELETE
- `src/components/pages/zoo/regions/RegionShopSection.tsx` — display + modal CRUD

**Modified files:**
- `prisma/schema.prisma` — add `RegionShop`, `RegionShopLevel` models + `shops` relation on `Region`
- `src/service/RegionService.ts` — add `getShopsByRegionId`, `createShop`, `updateShop`, `deleteShop`; extend `getRegionById`
- `src/service/frontend/Region.ts` — add `createShopOnClient`, `updateShopOnClient`, `deleteShopOnClient`
- `src/service/frontend/Region.test.ts` — add tests for the 3 new functions
- `messages/{de,en,da,es,fr,nl}/region.json` — add shop i18n keys
- `src/components/pages/zoo/regions/RegionDetailContent.tsx` — add `shops` to Region interface + render `<RegionShopSection>`
- `src/app/[locale]/zoo/regions/[id]/page.tsx` — no change needed (already passes full region object)

---

## Shared Types

These types are produced in Task 1 (Prisma) and consumed in Tasks 2–6. The implementer defines them as TypeScript interfaces where needed — do not create a shared types file, inline them in each component/service.

```ts
interface ShopLevel {
  id: number;
  shopId: number;
  level: number;
  cost: number;
  currency: string; // "COINS" | "DIAMONDS"
  maxCapacity: number;
  buildTime: string;
}

interface ShopWithLevels {
  id: number;
  regionId: number;
  name: string;
  coinsPerClient: number | null;
  levels: ShopLevel[];
}

interface ShopLevelInput {
  level: number;
  cost: number;
  currency: string;
  maxCapacity: number;
  buildTime: string;
}

interface ShopInput {
  name: string;
  coinsPerClient: number | null;
  levels: ShopLevelInput[];
}
```

---

### Task 1: Prisma Schema + Migration

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Consumes: nothing
- Produces: `prisma.regionShop` and `prisma.regionShopLevel` Prisma client accessors; `Region` model gains `shops RegionShop[]` relation.

- [ ] **Step 1: Add `RegionShop` model to `prisma/schema.prisma` after the `Region` model**

```prisma
model RegionShop {
  id             Int              @id @default(autoincrement())
  regionId       Int
  name           String           @db.VarChar(255)
  coinsPerClient Int?
  region         Region           @relation(fields: [regionId], references: [id], onDelete: Cascade)
  levels         RegionShopLevel[]

  @@index([regionId])
  @@map("regionshop")
}

model RegionShopLevel {
  id           Int        @id @default(autoincrement())
  shopId       Int
  level        Int
  cost         Int
  currency     String     @default("COINS") @db.VarChar(20)
  maxCapacity  Int
  buildTime    String     @db.VarChar(50)
  shop         RegionShop @relation(fields: [shopId], references: [id], onDelete: Cascade)

  @@index([shopId])
  @@map("regionshoplevel")
}
```

- [ ] **Step 2: Add `shops RegionShop[]` to the `Region` model relation list** (after `clubHouse ClubHouse[]`)

- [ ] **Step 3: Run migration**

```bash
npx prisma migrate dev --name add_region_shops
```

Expected: `✔ Generated Prisma Client` — no errors.

- [ ] **Step 4: Verify TypeScript types are generated**

Run: `npx prisma generate`
Expected: success, no errors.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add RegionShop and RegionShopLevel prisma models"
```

---

### Task 2: Service Functions

**Files:**
- Modify: `src/service/RegionService.ts`

**Interfaces:**
- Consumes: Task 1 → `prisma.regionShop`, `prisma.regionShopLevel`, `Region` with `shops`
- Produces:
  - `getShopsByRegionId(regionId: number): Promise<ShopWithLevels[]>`
  - `createShop(regionId: number, data: ShopInput): Promise<ShopWithLevels>`
  - `updateShop(shopId: number, data: ShopInput): Promise<ShopWithLevels>`
  - `deleteShop(shopId: number): Promise<void>`
  - `getRegionById` now includes `shops: { include: { levels: { orderBy: { level: "asc" } } } }`

- [ ] **Step 1: Add `getShopsByRegionId` to `src/service/RegionService.ts`**

Signature: `export async function getShopsByRegionId(regionId: number): Promise<any[]>`

Query: `prisma.regionShop.findMany({ where: { regionId }, include: { levels: { orderBy: { level: "asc" } } }, orderBy: { id: "asc" } })`

- [ ] **Step 2: Add `createShop`**

Signature: `export async function createShop(regionId: number, data: ShopInput): Promise<any>`

Create `regionShop` with nested `createMany` for levels:
```ts
prisma.regionShop.create({
  data: {
    regionId,
    name: data.name,
    coinsPerClient: data.coinsPerClient ?? null,
    levels: { createMany: { data: data.levels } },
  },
  include: { levels: { orderBy: { level: "asc" } } },
})
```

- [ ] **Step 3: Add `updateShop` using a Prisma transaction**

Signature: `export async function updateShop(shopId: number, data: ShopInput): Promise<any>`

```ts
return prisma.$transaction(async (tx) => {
  await tx.regionShopLevel.deleteMany({ where: { shopId } });
  return tx.regionShop.update({
    where: { id: shopId },
    data: {
      name: data.name,
      coinsPerClient: data.coinsPerClient ?? null,
      levels: { createMany: { data: data.levels } },
    },
    include: { levels: { orderBy: { level: "asc" } } },
  });
});
```

- [ ] **Step 4: Add `deleteShop`**

Signature: `export async function deleteShop(shopId: number): Promise<void>`

Body: `await prisma.regionShop.delete({ where: { id: shopId } })`

(Levels cascade-delete via `onDelete: Cascade` from Task 1.)

- [ ] **Step 5: Extend `getRegionById` to include shops**

In the `prisma.region.findUnique` call inside `getRegionById`, add to the `include` object:
```ts
shops: { include: { levels: { orderBy: { level: "asc" } } }, orderBy: { id: "asc" } },
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors related to `RegionService.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/service/RegionService.ts
git commit -m "feat: add shop service functions to RegionService"
```

---

### Task 3: API Route — `/api/regions/[id]/shops`

**Files:**
- Create: `src/app/api/regions/[id]/shops/route.ts`
- Create: `src/app/api/regions/[id]/shops/route.test.ts`

**Interfaces:**
- Consumes: Task 2 → `getShopsByRegionId`, `createShop`
- Produces: `GET /api/regions/[id]/shops` → `ShopWithLevels[]`; `POST` → `ShopWithLevels`

- [ ] **Step 1: Write the failing tests in `src/app/api/regions/[id]/shops/route.test.ts`**

```ts
import { describe, test, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { getShopsByRegionId, createShop } from "@/service/RegionService";

vi.mock("@/service/RegionService", () => ({
  getShopsByRegionId: vi.fn(),
  createShop: vi.fn(),
}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { role: "Director", roleId: 2 } }),
}));
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));

const params = Promise.resolve({ id: "5" });

describe("GET /api/regions/[id]/shops", () => {
  beforeEach(() => vi.clearAllMocks());

  test("gibt Shops mit Status 200 zurück", async () => {
    const mockShops = [{ id: 1, name: "Blumenstand", levels: [] }];
    vi.mocked(getShopsByRegionId).mockResolvedValue(mockShops as any);
    const req = new Request("http://localhost/api/regions/5/shops");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockShops);
    expect(getShopsByRegionId).toHaveBeenCalledWith(5);
  });

  test("gibt leeres Array zurück wenn keine Shops vorhanden", async () => {
    vi.mocked(getShopsByRegionId).mockResolvedValue([]);
    const req = new Request("http://localhost/api/regions/5/shops");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test("gibt 400 zurück bei ungültiger Region-ID", async () => {
    const req = new Request("http://localhost/api/regions/abc/shops");
    const res = await GET(req, { params: Promise.resolve({ id: "abc" }) });
    expect(res.status).toBe(400);
    expect(getShopsByRegionId).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück bei Service-Fehler", async () => {
    vi.mocked(getShopsByRegionId).mockRejectedValue(new Error("DB down"));
    const req = new Request("http://localhost/api/regions/5/shops");
    const res = await GET(req, { params });
    expect(res.status).toBe(500);
  });
});

describe("POST /api/regions/[id]/shops", () => {
  beforeEach(() => vi.clearAllMocks());

  const validBody = { name: "Blumenstand", coinsPerClient: 3, levels: [] };

  test("erstellt einen Shop mit Status 201", async () => {
    const created = { id: 10, ...validBody, regionId: 5, levels: [] };
    vi.mocked(createShop).mockResolvedValue(created as any);
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(201);
    expect(createShop).toHaveBeenCalledWith(5, validBody);
  });

  test("gibt 400 zurück wenn name fehlt", async () => {
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify({ coinsPerClient: 3, levels: [] }),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
    expect(createShop).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn name nur Leerzeichen enthält", async () => {
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify({ name: "   ", coinsPerClient: null, levels: [] }),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
    expect(createShop).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück ohne Director-Rolle", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 0 } } as any);
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(403);
    expect(createShop).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/app/api/regions/\\[id\\]/shops/route.test.ts`
Expected: FAIL — route file does not exist.

- [ ] **Step 3: Implement `src/app/api/regions/[id]/shops/route.ts`**

Exports: `GET` and `POST`. Both accept `(request, { params })` where `params: Promise<{ id: string }>`.

`GET`: parse `id`, NaN-guard (400), call `getShopsByRegionId`, return JSON 200.

`POST`: parse `id`, NaN-guard (400), auth check Director+ with isMayor guard (403), parse body, validate `name` is non-empty string after trim (400), call `createShop(regionId, body)`, return JSON 201.

Import `isMayor` from `@/utils/roleUtils`. Import translations via `getTranslations` for error messages using `"api"` namespace consistent with existing routes.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/app/api/regions/\\[id\\]/shops/route.test.ts`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/regions/[id]/shops/
git commit -m "feat: add GET and POST handlers for region shops API"
```

---

### Task 4: API Route — `/api/regions/[id]/shops/[shopId]`

**Files:**
- Create: `src/app/api/regions/[id]/shops/[shopId]/route.ts`
- Create: `src/app/api/regions/[id]/shops/[shopId]/route.test.ts`

**Interfaces:**
- Consumes: Task 2 → `updateShop`, `deleteShop`
- Produces: `PUT /api/regions/[id]/shops/[shopId]` → updated `ShopWithLevels`; `DELETE` → 204

- [ ] **Step 1: Write the failing tests in `src/app/api/regions/[id]/shops/[shopId]/route.test.ts`**

```ts
import { describe, test, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";
import { updateShop, deleteShop } from "@/service/RegionService";

vi.mock("@/service/RegionService", () => ({
  updateShop: vi.fn(),
  deleteShop: vi.fn(),
}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { role: "Director", roleId: 2 } }),
}));
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));

const params = Promise.resolve({ id: "5", shopId: "10" });
const validBody = { name: "Blumenstand", coinsPerClient: 3, levels: [] };

describe("PUT /api/regions/[id]/shops/[shopId]", () => {
  beforeEach(() => vi.clearAllMocks());

  test("aktualisiert einen Shop erfolgreich mit Status 200", async () => {
    const updated = { id: 10, ...validBody, regionId: 5, levels: [] };
    vi.mocked(updateShop).mockResolvedValue(updated as any);
    const req = new Request("http://localhost/api/regions/5/shops/10", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(200);
    expect(updateShop).toHaveBeenCalledWith(10, validBody);
  });

  test("gibt 400 zurück bei ungültiger shopId", async () => {
    const req = new Request("http://localhost/api/regions/5/shops/abc", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "5", shopId: "abc" }) });
    expect(res.status).toBe(400);
    expect(updateShop).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn name fehlt", async () => {
    const req = new Request("http://localhost/api/regions/5/shops/10", {
      method: "PUT",
      body: JSON.stringify({ coinsPerClient: 3, levels: [] }),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(400);
    expect(updateShop).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück ohne Director-Rolle", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 0 } } as any);
    const req = new Request("http://localhost/api/regions/5/shops/10", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/regions/[id]/shops/[shopId]", () => {
  beforeEach(() => vi.clearAllMocks());

  test("löscht einen Shop erfolgreich mit Status 204", async () => {
    vi.mocked(deleteShop).mockResolvedValue(undefined);
    const req = new Request("http://localhost/api/regions/5/shops/10", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(204);
    expect(deleteShop).toHaveBeenCalledWith(10);
  });

  test("gibt 400 zurück bei ungültiger shopId", async () => {
    const req = new Request("http://localhost/api/regions/5/shops/xyz", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "5", shopId: "xyz" }) });
    expect(res.status).toBe(400);
    expect(deleteShop).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück ohne Director-Rolle", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 0 } } as any);
    const req = new Request("http://localhost/api/regions/5/shops/10", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(403);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run "src/app/api/regions/\\[id\\]/shops/\\[shopId\\]/route.test.ts"`
Expected: FAIL — file does not exist.

- [ ] **Step 3: Implement `src/app/api/regions/[id]/shops/[shopId]/route.ts`**

Exports: `PUT` and `DELETE`. Accept `(request, { params })` where `params: Promise<{ id: string; shopId: string }>`.

`PUT`: NaN-guard on `shopId` (400), isMayor guard (403), Director guard (403), parse body, validate `name` non-empty after trim (400), call `updateShop(shopId, body)`, return JSON 200.

`DELETE`: NaN-guard on `shopId` (400), isMayor guard (403), Director guard (403), call `deleteShop(shopId)`, return `new NextResponse(null, { status: 204 })`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run "src/app/api/regions/\\[id\\]/shops/\\[shopId\\]/route.test.ts"`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/api/regions/[id]/shops/[shopId]/"
git commit -m "feat: add PUT and DELETE handlers for region shop API"
```

---

### Task 5: Frontend Service + i18n

**Files:**
- Modify: `src/service/frontend/Region.ts`
- Modify: `src/service/frontend/Region.test.ts`
- Modify: `messages/de/region.json`, `messages/en/region.json`, `messages/da/region.json`, `messages/es/region.json`, `messages/fr/region.json`, `messages/nl/region.json`

**Interfaces:**
- Consumes: Task 3+4 → API endpoint URLs
- Produces:
  - `createShopOnClient(regionId: number, data: ShopInput): Promise<ShopWithLevels>`
  - `updateShopOnClient(regionId: number, shopId: number, data: ShopInput): Promise<ShopWithLevels>`
  - `deleteShopOnClient(regionId: number, shopId: number): Promise<void>`

- [ ] **Step 1: Write failing tests in `src/service/frontend/Region.test.ts`**

Add a new `describe("Shop Frontend Service")` block at the end of the existing test file:

```ts
describe("createShopOnClient", () => {
  const shopInput = { name: "Blumenstand", coinsPerClient: 3, levels: [] };
  const created = { id: 1, regionId: 5, ...shopInput, levels: [] };

  test("sendet POST an /api/regions/5/shops", async () => {
    mockFetch(true, created);
    await createShopOnClient(5, shopInput);
    expect(fetch).toHaveBeenCalledWith("/api/regions/5/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shopInput),
    });
  });

  test("gibt den erstellten Shop zurück bei Erfolg", async () => {
    mockFetch(true, created);
    const result = await createShopOnClient(5, shopInput);
    expect(result).toEqual(created);
  });

  test("wirft Fehler bei fehlgeschlagenem Request", async () => {
    mockFetch(false, { message: "Name ist Pflichtfeld" });
    await expect(createShopOnClient(5, shopInput)).rejects.toThrow("Name ist Pflichtfeld");
  });
});

describe("updateShopOnClient", () => {
  const shopInput = { name: "Blumenstand (neu)", coinsPerClient: 5, levels: [] };

  test("sendet PUT an /api/regions/5/shops/10", async () => {
    mockFetch(true, { id: 10 });
    await updateShopOnClient(5, 10, shopInput);
    expect(fetch).toHaveBeenCalledWith("/api/regions/5/shops/10", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shopInput),
    });
  });

  test("wirft Fehler bei fehlgeschlagenem Request", async () => {
    mockFetch(false, { message: "Shop nicht gefunden" });
    await expect(updateShopOnClient(5, 10, shopInput)).rejects.toThrow("Shop nicht gefunden");
  });
});

describe("deleteShopOnClient", () => {
  test("sendet DELETE an /api/regions/5/shops/10", async () => {
    mockFetch(true, {});
    await deleteShopOnClient(5, 10);
    expect(fetch).toHaveBeenCalledWith("/api/regions/5/shops/10", { method: "DELETE" });
  });

  test("löst ohne Rückgabewert auf bei Erfolg", async () => {
    mockFetch(true, {});
    const result = await deleteShopOnClient(5, 10);
    expect(result).toBeUndefined();
  });

  test("wirft Fehler bei fehlgeschlagenem Request", async () => {
    mockFetch(false, { message: "Shop nicht gefunden" });
    await expect(deleteShopOnClient(5, 10)).rejects.toThrow("Shop nicht gefunden");
  });
});
```

Also add the imports at the top of the test file:
```ts
import { createShopOnClient, updateShopOnClient, deleteShopOnClient } from "@/service/frontend/Region";
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/service/frontend/Region.test.ts`
Expected: FAIL — functions not yet exported.

- [ ] **Step 3: Add three functions to `src/service/frontend/Region.ts`**

```ts
export async function createShopOnClient(regionId: number, data: any): Promise<any> {
  const response = await fetch(`/api/regions/${regionId}/shops`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    throw error;
  }
  return result;
}

export async function updateShopOnClient(regionId: number, shopId: number, data: any): Promise<any> {
  const response = await fetch(`/api/regions/${regionId}/shops/${shopId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    throw error;
  }
  return result;
}

export async function deleteShopOnClient(regionId: number, shopId: number): Promise<void> {
  const response = await fetch(`/api/regions/${regionId}/shops/${shopId}`, { method: "DELETE" });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/service/frontend/Region.test.ts`
Expected: all tests PASS.

- [ ] **Step 5: Add i18n keys to all 6 locale files**

Add the following keys to the **top level** of each `messages/{locale}/region.json`:

| Key | de | en | da | es | fr | nl |
|-----|----|----|----|----|----|----|
| `shops` | `"Shops"` | `"Shops"` | `"Butikker"` | `"Tiendas"` | `"Boutiques"` | `"Winkels"` |
| `coins_per_client` | `"Coins / Kunde"` | `"Coins / Client"` | `"Mønter / Klient"` | `"Monedas / Cliente"` | `"Pièces / Client"` | `"Munten / Klant"` |
| `add_shop` | `"Shop hinzufügen"` | `"Add shop"` | `"Tilføj butik"` | `"Añadir tienda"` | `"Ajouter une boutique"` | `"Winkel toevoegen"` |
| `edit_shop` | `"Shop bearbeiten"` | `"Edit shop"` | `"Rediger butik"` | `"Editar tienda"` | `"Modifier la boutique"` | `"Winkel bewerken"` |
| `save_shop` | `"Speichern"` | `"Save"` | `"Gem"` | `"Guardar"` | `"Enregistrer"` | `"Opslaan"` |
| `build_cost` | `"Baukosten"` | `"Build cost"` | `"Byggeomkostninger"` | `"Costo de construcción"` | `"Coût de construction"` | `"Bouwkosten"` |
| `build_time_label` | `"Bauzeit"` | `"Build time"` | `"Byggetid"` | `"Tiempo de construcción"` | `"Temps de construction"` | `"Bouwtijd"` |
| `delete_shop_confirm` | `"Diesen Shop wirklich löschen?"` | `"Really delete this shop?"` | `"Vil du virkelig slette denne butik?"` | `"¿Realmente eliminar esta tienda?"` | `"Vraiment supprimer cette boutique ?"` | `"Wilt u deze winkel echt verwijderen?"` |

- [ ] **Step 6: Commit**

```bash
git add src/service/frontend/Region.ts src/service/frontend/Region.test.ts messages/
git commit -m "feat: add shop frontend service functions and i18n keys"
```

---

### Task 6: RegionShopSection Component

**Files:**
- Create: `src/components/pages/zoo/regions/RegionShopSection.tsx`

**Interfaces:**
- Consumes:
  - Task 2 → `ShopWithLevels`, `ShopInput` shapes
  - Task 5 → `createShopOnClient(regionId, data)`, `updateShopOnClient(regionId, shopId, data)`, `deleteShopOnClient(regionId, shopId)`
  - Task 5 → i18n keys: `region.shops`, `region.coins_per_client`, `region.add_shop`, `region.edit_shop`, `region.save_shop`, `region.build_cost`, `region.build_time_label`, `region.delete_shop_confirm`, `region.max_capacity`, `region.level_value`
  - Existing: `InfoAccordion`, `CurrencyBadge` (type `"Zoodollar" | "Diamond"`), `confirmDeleteDialog`, `StatBox`
- Produces: `<RegionShopSection regionId={number} regionIdentifier={string} initialShops={ShopWithLevels[]} isAdmin={boolean} />`

- [ ] **Step 1: Write the failing type-check test**

No Vitest unit test for the component — verify via TypeScript compilation in Step 4.

- [ ] **Step 2: Implement `src/components/pages/zoo/regions/RegionShopSection.tsx`**

`"use client"`. Mark file with Styled Components and next-intl.

**Props interface:**
```ts
interface RegionShopSectionProps {
  regionId: number;
  regionIdentifier: string;
  initialShops: ShopWithLevels[];
  isAdmin: boolean;
}
```

**State:**
- `shops: ShopWithLevels[]` — initialized from `initialShops`
- `modalState: { mode: "create" } | { mode: "edit"; shop: ShopWithLevels } | null` — `null` = modal closed

**Layout (outer):**
```
<InfoAccordion title={tRegion("shops")} icon="/images/icons/buildings.png" defaultOpen={false}>
  {isAdmin && <AddButton onClick={() => setModalState({ mode: "create" })}>+ {tRegion("add_shop")}</AddButton>}
  <ShopList>
    {shops.map(shop => <ShopRow key={shop.id} ... />)}
  </ShopList>
</InfoAccordion>
```

**ShopRow layout:**
```
<ShopCard>
  <ShopImage>  ← <img> with onError hide, src=/images/regions/{identifier}/shops/{shop.name}/image.jpg, width=180 height=120
  <ShopInfo>
    <ShopName>{shop.name}</ShopName>
    {shop.coinsPerClient != null && <CoinsLine>{shop.coinsPerClient} {tRegion("coins_per_client")}</CoinsLine>}
    <LevelTable>  ← <table>
      <thead>Level | {tRegion("build_cost")} | {tRegion("max_capacity")} | {tRegion("build_time_label")}</thead>
      <tbody>{shop.levels.map(lvl => <tr>...)}</tbody>
    </LevelTable>
    {isAdmin && <AdminActions><EditBtn /><DeleteBtn /></AdminActions>}
```

**Currency mapping in LevelTable:** `lvl.currency === "DIAMONDS" ? "Diamond" : "Zoodollar"` — pass to `<CurrencyBadge value={lvl.cost} type={...} />`.

**Delete handler:** call `confirmDeleteDialog` with `tRegion("delete_shop_confirm")`, on confirm call `deleteShopOnClient(regionId, shop.id)`, update local `shops` state by filtering out deleted shop. On error: `toast.error(e.message)`.

**ShopModal (inline component in same file):**

Props: `{ mode: "create" | "edit"; shop?: ShopWithLevels; regionId: number; regionIdentifier: string; onClose: () => void; onSaved: (shop: ShopWithLevels) => void }`

State: `name: string`, `coinsPerClient: string`, `levels: LevelRow[]` where `LevelRow = { level: number; cost: string; currency: string; maxCapacity: string; buildTime: string }`, `isSubmitting: boolean`.

Initialize from `shop` prop when `mode === "edit"`.

Level rows: start with one empty row on create; "Add level" button appends next level number. Remove button per row (except if only 1 row).

Submit: validate `name.trim()` non-empty (toast.warn), build `ShopInput`, call `createShopOnClient` or `updateShopOnClient`, call `onSaved(result)`, `onClose()`. Catch → `toast.error`.

Modal overlay: full-screen `position: fixed` semi-transparent backdrop + centered white card, max-width 600px.

**`onSaved` handler in `RegionShopSection`:**
- create mode: append new shop to `shops` state
- edit mode: replace shop in `shops` state by id

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: no errors in `RegionShopSection.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/zoo/regions/RegionShopSection.tsx
git commit -m "feat: add RegionShopSection component with display and CRUD modal"
```

---

### Task 7: Wire Up in RegionDetailContent

**Files:**
- Modify: `src/components/pages/zoo/regions/RegionDetailContent.tsx`

**Interfaces:**
- Consumes:
  - Task 6 → `<RegionShopSection regionId={number} regionIdentifier={string} initialShops={ShopWithLevels[]} isAdmin={boolean} />`
  - Task 2 → `getRegionById` now returns `region.shops`
- Produces: Region detail page shows Shops accordion below the last CardsGrid

- [ ] **Step 1: Update `Region` interface in `RegionDetailContent.tsx`**

Add to the existing `Region` interface:
```ts
shops: Array<{
  id: number;
  regionId: number;
  name: string;
  coinsPerClient: number | null;
  levels: Array<{
    id: number;
    shopId: number;
    level: number;
    cost: number;
    currency: string;
    maxCapacity: number;
    buildTime: string;
  }>;
}>;
```

- [ ] **Step 2: Import and render `RegionShopSection`**

Add import at top of file:
```ts
import RegionShopSection from "./RegionShopSection";
```

Add after the `{(hasDesignBoutique || hasClubHouse) && <CardsGrid>...</CardsGrid>}` block:

```tsx
{(isAdmin || region.shops.length > 0) && (
  <RegionShopSection
    regionId={region.id}
    regionIdentifier={region.identifier}
    initialShops={region.shops}
    isAdmin={isAdmin}
  />
)}
```

- [ ] **Step 3: Run full test suite**

Run: `npx vitest run`
Expected: all existing tests still pass + new route/service tests from Tasks 3–5 pass.

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: build succeeds, no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/zoo/regions/RegionDetailContent.tsx
git commit -m "feat: integrate RegionShopSection into Region detail page"
```
