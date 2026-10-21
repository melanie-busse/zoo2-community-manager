# Collection CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full Create / Update / Delete for `Collection` (Sammelalbum) records, including Prisma schema changes, API routes, a modal form, and admin controls in the existing overview.

**Architecture:** Schema changes via `prisma db push`; new API routes at `/api/collections` and `/api/collections/[id]`; a modal-form component (`CollectionForm`) opened from `CollectionsOverviewContent`; all raw data for the form is fetched server-side and passed as props. Service layer and types extended in-place; frontend fetch wrappers follow the `src/service/frontend/Shop.ts` pattern.

**Tech Stack:** Next.js 16 App Router, Prisma 6 + MySQL, NextAuth.js, next-intl, Vitest, Styled Components, Zustand (not needed for this feature), DynamicRowInput, ActionGroupBadge, InfoAccordion.

**Spec:** `docs/superpowers/specs/2026-10-20-collector-album-crud-design.md`

## Global Constraints

- No new npm packages.
- Locale files: `messages/{de,en,fr,es,da,nl}/collections.json` — all 6 must receive every new key.
- Migration: `npx prisma db push` (shadow DB is broken; never use `prisma migrate dev`).
- Auth guard pattern: `isMayor` check first (403), then `hasMinimumRole(session, "Director")` (403). Match `src/app/api/shops/route.ts`.
- Functional components + Styled Components only (no Tailwind / atomic CSS).
- `itemName` on `CollectionRequirement` is a required `VarChar(255)` — write `""` (empty string) on create/update; it is legacy denormalized data not used by the UI.

## Review Focus

1. **POST with `STATUE` requirement and valid `statueId`** — requirement row is created with `statueId` set and `animalId` null; retrieved via `getAllCollectionsForAdmin()` with `statueId` populated. Covered by Task 3 API route test.
2. **PUT replaces texts/requirements atomically** — no orphan rows remain after update; both deleteMany calls happen inside the transaction before createMany. Covered by Task 2 service unit test.
3. **Unauthorized mutation** — POST/PUT/DELETE without Director role returns 403 and does not modify the DB. Covered by Task 3 API route test.
4. **POST with empty texts array** — validation rejects with 400 before touching DB. Covered by Task 3 API route test.
5. **Admin controls absent for non-Director** — create button and edit/delete icons not rendered when `isAdmin` is false. Covered by Task 6 component test extension.

---

### Task 1: Prisma Schema Changes

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `rewardVariant` on `Collection`, `STATUE` in `RequirementType`, `statueId`/`statue` on `CollectionRequirement`, `collectionRequirements` back-relation on `ContestStatue`. All later tasks depend on `prisma generate` succeeding.

- [ ] **Step 1: Edit `prisma/schema.prisma`**

  Four changes:

  a. In `model Collection` (line ~499), add after `rewardSpecialCoatId Int?`:
  ```
  rewardVariant String? @db.VarChar(100)
  ```

  b. In `enum RequirementType` (line ~494), add `STATUE` after `DECORATION`:
  ```
  enum RequirementType {
    ANIMAL
    DECORATION
    STATUE
  }
  ```

  c. In `model CollectionRequirement` (line ~527), add after the existing `decorationId` line:
  ```
  statueId Int?
  statue   ContestStatue? @relation(fields: [statueId], references: [id])
  ```
  And add to the `@@index` block:
  ```
  @@index([statueId], map: "collectionRequirement_statueId_idx")
  ```

  d. In `model ContestStatue` (line ~232), add the back-relation inside the model:
  ```
  collectionRequirements CollectionRequirement[]
  ```

- [ ] **Step 2: Push schema to DB**

  Run: `npx prisma db push`
  Expected: `Your database is now in sync with your Prisma schema.` (no errors)

- [ ] **Step 3: Regenerate Prisma client**

  Run: `npx prisma generate`
  Expected: `✔ Generated Prisma Client`

- [ ] **Step 4: Run existing tests to verify no regression**

  Run: `npx vitest run`
  Expected: All tests pass (no new failures)

- [ ] **Step 5: Commit**

  ```bash
  git add prisma/schema.prisma
  git commit -m "feat: add rewardVariant, STATUE enum, statueId to collection schema"
  ```

---

### Task 2: Types + CollectionService CRUD

**Files:**
- Modify: `src/types/collection.ts`
- Modify: `src/service/CollectionService.ts`
- Create: `src/service/CollectionService.test.ts`

**Interfaces:**
- Consumes: Prisma client from Task 1 (new fields available)
- Produces:
  - `CollectionInput` — `{ regionId: number; rewardAnimalId: number | null; rewardVariant: string | null; stars: number; texts: { languageCode: string; name: string }[]; requirements: { type: "ANIMAL" | "STATUE"; animalId: number | null; statueId: number | null; requiredLevel: number | null; sortOrder: number }[] }`
  - `RawCollection` — `{ id: number; identifier: string; stars: number; regionId: number; rewardAnimalId: number | null; rewardVariant: string | null; texts: { languageCode: string; name: string }[]; requirements: { id: number; type: "ANIMAL" | "STATUE"; animalId: number | null; statueId: number | null; requiredLevel: number | null; sortOrder: number }[] }`
  - `getAllCollectionsForAdmin(): Promise<RawCollection[]>`
  - `getAllContestStatues(): Promise<{ id: number; animalName: string; contestName: string }[]>`
  - `createCollection(data: CollectionInput): Promise<{ id: number }>`
  - `updateCollection(id: number, data: CollectionInput): Promise<void>`
  - `deleteCollection(id: number): Promise<void>`
  - Extended `CollectionRequirement` type with `statue: { id: number; animalName: string; contestName: string } | null`
  - Extended `Collection` type with `rewardVariant: string | null`

- [ ] **Step 1: Write failing tests in `src/service/CollectionService.test.ts`**

  ```typescript
  import { describe, test, expect, vi, beforeEach } from "vitest";

  vi.mock("server-only", () => ({}));

  const txMock = {
    collection: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    collectionText: { deleteMany: vi.fn(), createMany: vi.fn() },
    collectionRequirement: { deleteMany: vi.fn(), createMany: vi.fn() },
  };

  vi.mock("@/lib/prisma", () => ({
    prisma: {
      $transaction: vi.fn((cb: any) => cb(txMock)),
      collection: { findMany: vi.fn(), delete: vi.fn() },
      collectionText: { deleteMany: vi.fn(), createMany: vi.fn() },
      collectionRequirement: { deleteMany: vi.fn(), createMany: vi.fn() },
      contestStatue: { findMany: vi.fn() },
    },
  }));

  import { prisma } from "@/lib/prisma";
  import {
    createCollection,
    updateCollection,
    deleteCollection,
    getAllContestStatues,
  } from "@/service/CollectionService";

  const prismaMock = prisma as any;

  const baseInput = {
    regionId: 1,
    rewardAnimalId: null,
    rewardVariant: null,
    stars: 2,
    texts: [{ languageCode: "de", name: "Mein Album" }],
    requirements: [{ type: "ANIMAL" as const, animalId: 5, statueId: null, requiredLevel: 3, sortOrder: 0 }],
  };

  describe("CollectionService", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      txMock.collection.create.mockResolvedValue({ id: 42 });
      txMock.collectionText.deleteMany.mockResolvedValue({});
      txMock.collectionRequirement.deleteMany.mockResolvedValue({});
      txMock.collectionText.createMany.mockResolvedValue({});
      txMock.collectionRequirement.createMany.mockResolvedValue({});
      txMock.collection.update.mockResolvedValue({});
      prismaMock.collection.delete.mockResolvedValue({});
    });

    test("createCollection slugifies first text name as identifier", async () => {
      await createCollection(baseInput);
      expect(txMock.collection.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ identifier: "mein_album" }),
        }),
      );
    });

    test("createCollection runs inside a transaction", async () => {
      await createCollection(baseInput);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });

    test("createCollection returns the new collection id", async () => {
      const result = await createCollection(baseInput);
      expect(result).toEqual({ id: 42 });
    });

    test("updateCollection deletes texts and requirements before recreating", async () => {
      await updateCollection(7, baseInput);
      expect(txMock.collectionText.deleteMany).toHaveBeenCalledWith({ where: { collectionId: 7 } });
      expect(txMock.collectionRequirement.deleteMany).toHaveBeenCalledWith({ where: { collectionId: 7 } });
      expect(txMock.collectionText.createMany).toHaveBeenCalled();
      expect(txMock.collectionRequirement.createMany).toHaveBeenCalled();
    });

    test("deleteCollection calls prisma.collection.delete with id", async () => {
      await deleteCollection(9);
      expect(prismaMock.collection.delete).toHaveBeenCalledWith({ where: { id: 9 } });
    });

    test("getAllContestStatues returns array with id, animalName, contestName", async () => {
      prismaMock.contestStatue.findMany.mockResolvedValue([
        {
          id: 1,
          animal: { animaltext: [{ animalName: "Löwe" }], identifier: "lion" },
          contest: { endDate: new Date("2024-03-01") },
        },
      ]);
      const result = await getAllContestStatues();
      expect(result).toEqual([{ id: 1, animalName: "Löwe", contestName: "2024" }]);
    });
  });
  ```

- [ ] **Step 2: Run tests — verify they fail**

  Run: `npx vitest run src/service/CollectionService.test.ts`
  Expected: FAIL — functions not found

- [ ] **Step 3: Extend `src/types/collection.ts`**

  Add `statue: { id: number; animalName: string; contestName: string } | null` to `CollectionRequirement`.
  Add `rewardVariant: string | null` to `Collection`.
  Add exported types `CollectionInput` and `RawCollection` as described in Interfaces above.
  Change `CollectionRequirement.type` to `"ANIMAL" | "DECORATION" | "STATUE"`.

- [ ] **Step 4: Add functions to `src/service/CollectionService.ts`**

  a. `getAllCollectionsForAdmin(): Promise<RawCollection[]>` — `prisma.collection.findMany` with includes: `texts: true`, `requirements: { select: { id, type, animalId, statueId, requiredLevel, sortOrder } }`. Map to `RawCollection`.

  b. `getAllContestStatues(): Promise<{ id: number; animalName: string; contestName: string }[]>` — `prisma.contestStatue.findMany({ include: { animal: { include: { animaltext: { where: { languageCode: "de" } } } }, contest: true }, orderBy: { id: "asc" } })`. Map: `animalName = animal.animaltext[0]?.animalName ?? animal.identifier`, `contestName = contest.endDate.getFullYear().toString()`.

  c. `createCollection(data: CollectionInput): Promise<{ id: number }>` — `prisma.$transaction(async (tx) => { ... })`. Inside: `tx.collection.create({ data: { identifier, stars, regionId, rewardAnimalId, rewardVariant } })`, then `tx.collectionText.createMany(...)`, then `tx.collectionRequirement.createMany(...)` with `itemName: ""`. Slugify: `data.texts[0].name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")`.

  d. `updateCollection(id: number, data: CollectionInput): Promise<void>` — `prisma.$transaction(async (tx) => { tx.collection.update({ where: { id }, data: { stars, regionId, rewardAnimalId, rewardVariant } }); tx.collectionText.deleteMany({ where: { collectionId: id } }); tx.collectionRequirement.deleteMany({ where: { collectionId: id } }); if texts: tx.collectionText.createMany(...); if requirements: tx.collectionRequirement.createMany(...); })`.

  e. `deleteCollection(id: number): Promise<void>` — `prisma.collection.delete({ where: { id } })`.

  f. Extend `getAllCollections`: add `statue: { include: { animal: { include: { animaltext: { where: { languageCode: locale } } } }, contest: true } }` to the requirement include. Extend mapped requirement with `statue: r.statue ? { id: r.statue.id, animalName: r.statue.animal.animaltext[0]?.animalName ?? r.statue.animal.identifier, contestName: r.statue.contest.endDate.getFullYear().toString() } : null`.

- [ ] **Step 5: Run tests — verify they pass**

  Run: `npx vitest run src/service/CollectionService.test.ts`
  Expected: PASS (6/6)

- [ ] **Step 6: Run full suite to check no regression**

  Run: `npx vitest run`
  Expected: All tests pass

- [ ] **Step 7: Commit**

  ```bash
  git add src/types/collection.ts src/service/CollectionService.ts src/service/CollectionService.test.ts
  git commit -m "feat: add Collection CRUD service functions and extend types"
  ```

---

### Task 3: API Routes

**Files:**
- Create: `src/app/api/collections/route.ts`
- Create: `src/app/api/collections/[id]/route.ts`

**Interfaces:**
- Consumes: `getAllCollectionsForAdmin`, `createCollection`, `updateCollection`, `deleteCollection` from Task 2
- Produces: REST endpoints `GET /api/collections`, `POST /api/collections`, `PUT /api/collections/[id]`, `DELETE /api/collections/[id]`

- [ ] **Step 1: Write failing tests**

  Create `src/app/api/collections/route.test.ts`:
  ```typescript
  import { describe, test, expect, vi, beforeEach } from "vitest";

  vi.mock("server-only", () => ({}));
  vi.mock("@/service/CollectionService", () => ({
    getAllCollectionsForAdmin: vi.fn().mockResolvedValue([]),
    createCollection: vi.fn().mockResolvedValue({ id: 1 }),
  }));
  vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
  vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));
  vi.mock("@/utils/roleUtils", () => ({
    hasMinimumRole: vi.fn(),
    isMayor: vi.fn(),
  }));

  import { GET, POST } from "./route";
  import { getServerSession } from "next-auth";
  import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
  import { createCollection } from "@/service/CollectionService";

  const mockSession = {} as any;

  describe("GET /api/collections", () => {
    test("returns 200 with array", async () => {
      const res = await GET();
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/collections", () => {
    beforeEach(() => { vi.clearAllMocks(); });

    test("returns 403 when not Director", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(isMayor).mockReturnValue(false);
      vi.mocked(hasMinimumRole).mockReturnValue(false);
      const req = new Request("http://localhost/api/collections", {
        method: "POST",
        body: JSON.stringify({ regionId: 1, texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });

    test("returns 400 when texts array is empty", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(isMayor).mockReturnValue(false);
      vi.mocked(hasMinimumRole).mockReturnValue(true);
      const req = new Request("http://localhost/api/collections", {
        method: "POST",
        body: JSON.stringify({ regionId: 1, texts: [], stars: 1, requirements: [] }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    test("returns 400 when regionId missing", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(isMayor).mockReturnValue(false);
      vi.mocked(hasMinimumRole).mockReturnValue(true);
      const req = new Request("http://localhost/api/collections", {
        method: "POST",
        body: JSON.stringify({ texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    test("returns 201 with id on success", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(isMayor).mockReturnValue(false);
      vi.mocked(hasMinimumRole).mockReturnValue(true);
      const req = new Request("http://localhost/api/collections", {
        method: "POST",
        body: JSON.stringify({ regionId: 1, texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
    });
  });
  ```

  Create `src/app/api/collections/[id]/route.test.ts`:
  ```typescript
  import { describe, test, expect, vi, beforeEach } from "vitest";

  vi.mock("server-only", () => ({}));
  vi.mock("@/service/CollectionService", () => ({
    updateCollection: vi.fn().mockResolvedValue(undefined),
    deleteCollection: vi.fn().mockResolvedValue(undefined),
  }));
  vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
  vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));
  vi.mock("@/utils/roleUtils", () => ({
    hasMinimumRole: vi.fn(),
    isMayor: vi.fn(),
  }));

  import { PUT, DELETE } from "./route";
  import { getServerSession } from "next-auth";
  import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

  const params = { params: Promise.resolve({ id: "5" }) };

  describe("DELETE /api/collections/[id]", () => {
    beforeEach(() => { vi.clearAllMocks(); });

    test("returns 403 when not Director", async () => {
      vi.mocked(getServerSession).mockResolvedValue({} as any);
      vi.mocked(isMayor).mockReturnValue(false);
      vi.mocked(hasMinimumRole).mockReturnValue(false);
      const res = await DELETE(new Request("http://localhost"), params);
      expect(res.status).toBe(403);
    });

    test("returns 204 on success", async () => {
      vi.mocked(getServerSession).mockResolvedValue({} as any);
      vi.mocked(isMayor).mockReturnValue(false);
      vi.mocked(hasMinimumRole).mockReturnValue(true);
      const res = await DELETE(new Request("http://localhost"), params);
      expect(res.status).toBe(204);
    });
  });
  ```

- [ ] **Step 2: Run tests — verify they fail**

  Run: `npx vitest run src/app/api/collections`
  Expected: FAIL — modules not found

- [ ] **Step 3: Create `src/app/api/collections/route.ts`**

  `GET`: no auth → `getAllCollectionsForAdmin()` → `Response.json(result)`.

  `POST`: auth guard (isMayor → 403, !Director → 403). Parse body. Validate: `!body.regionId` → 400, `!Array.isArray(body.texts) || body.texts.length === 0` → 400. Call `createCollection(body)` → `Response.json({ id }, { status: 201 })`.

- [ ] **Step 4: Create `src/app/api/collections/[id]/route.ts`**

  Both `PUT` and `DELETE`: same auth guard. Parse `id` from params (invalid → 400).

  `PUT`: validate body same as POST. Call `updateCollection(id, body)` → `Response.json({ id })`.

  `DELETE`: `deleteCollection(id)` → `new Response(null, { status: 204 })`.

- [ ] **Step 5: Run tests — verify they pass**

  Run: `npx vitest run src/app/api/collections`
  Expected: PASS (all tests)

- [ ] **Step 6: Run full suite**

  Run: `npx vitest run`
  Expected: All tests pass

- [ ] **Step 7: Commit**

  ```bash
  git add src/app/api/collections
  git commit -m "feat: add Collection CRUD API routes"
  ```

---

### Task 4: Frontend Service + i18n

**Files:**
- Create: `src/service/frontend/Collection.ts`
- Modify: `messages/de/collections.json`, `messages/en/collections.json`, `messages/fr/collections.json`, `messages/es/collections.json`, `messages/da/collections.json`, `messages/nl/collections.json`

**Interfaces:**
- Produces:
  - `createCollectionOnClient(data: object): Promise<{ id: number }>`
  - `updateCollectionOnClient(id: number, data: object): Promise<void>`
  - `deleteCollectionOnClient(id: number): Promise<void>`
  - i18n keys: `type.STATUE`, `form.create_title`, `form.edit_title`, `form.save`, `form.region`, `form.reward_animal`, `form.reward_variant`, `form.stars`, `form.translations`, `form.requirements`, `form.type`, `form.animal`, `form.statue`, `form.level`, `form.messages.createSuccess`, `form.messages.editSuccess`, `form.messages.deleteSuccess`, `form.messages.confirmDelete`, `form.messages.deleteTitle`, `form.messages.requiredName`, `form.messages.requiredRegion`

- [ ] **Step 1: Create `src/service/frontend/Collection.ts`**

  Copy the `handleResponse` helper and three wrappers from `src/service/frontend/Shop.ts`, adapted for `/api/collections` and `/api/collections/[id]`. Exact signatures from Interfaces above. `deleteCollectionOnClient` does not call `handleResponse` — check `res.ok` manually and throw on error (204 has no body).

- [ ] **Step 2: Add i18n keys to all 6 locale files**

  Under the `collections` namespace, add:
  ```json
  "type": {
    "ANIMAL": "<existing>",
    "DECORATION": "<existing>",
    "STATUE": "Statue"
  },
  "form": {
    "create_title": "Sammelalbum anlegen",
    "edit_title": "Sammelalbum bearbeiten",
    "save": "Speichern",
    "region": "Region",
    "reward_animal": "Belohnungs-Tier",
    "reward_variant": "Farbvariante",
    "stars": "Sterne",
    "translations": "Übersetzungen",
    "requirements": "Anforderungen",
    "type": "Typ",
    "animal": "Tier",
    "statue": "Statue",
    "level": "Level",
    "messages": {
      "createSuccess": "Sammelalbum wurde angelegt",
      "editSuccess": "Sammelalbum wurde aktualisiert",
      "deleteSuccess": "Sammelalbum wurde gelöscht",
      "confirmDelete": "Sammelalbum wirklich löschen?",
      "deleteTitle": "Sammelalbum löschen",
      "requiredName": "Mindestens ein Name ist erforderlich",
      "requiredRegion": "Bitte eine Region auswählen"
    }
  }
  ```
  Non-German locale files use the same German strings for now (no translations provided).
  Merge `type.STATUE` into the existing `type` object (preserve `ANIMAL` and `DECORATION`).

- [ ] **Step 3: Run full suite**

  Run: `npx vitest run`
  Expected: All tests pass

- [ ] **Step 4: Commit**

  ```bash
  git add src/service/frontend/Collection.ts messages
  git commit -m "feat: add Collection frontend service and i18n keys"
  ```

---

### Task 5: CollectionForm Modal

**Files:**
- Create: `src/components/pages/animals/collections/CollectionForm.tsx`

**Interfaces:**
- Consumes:
  - `RawCollection` from Task 2 types
  - `createCollectionOnClient`, `updateCollectionOnClient` from Task 4
  - `SUPPORTED_LANGUAGES`, `FLAG_MAP` from `@/constants/languages`
  - `DynamicRowInput` from `@/components/ui/form/DynamicRowInput`
  - `InfoAccordion` from `@/components/page-structure/Elements/InfoAccordion`
  - `SubmitButton` from `@/components/ui/form/SubmitButton`
- Produces: `CollectionForm` component with props:
  ```typescript
  interface CollectionFormProps {
    collection?: RawCollection;
    allAnimals: { id: number; identifier: string; name: string }[];
    allStatues: { id: number; animalName: string; contestName: string }[];
    allRegions: { id: number; identifier: string; name: string }[];
    onClose: () => void;
    onSaved: () => void;
  }
  ```

- [ ] **Step 1: Create `src/components/pages/animals/collections/CollectionForm.tsx`**

  Structure: modal overlay (fixed, full-screen, semi-transparent backdrop). Inner panel: scrollable column of `InfoAccordion` cards, `SubmitButton` at bottom.

  State:
  - `regionId: string` — init from `collection?.regionId ?? ""`
  - `rewardAnimalId: string` — init from `collection?.rewardAnimalId ?? ""`
  - `rewardVariant: string` — init from `collection?.rewardVariant ?? ""`
  - `stars: string` — init from `collection?.stars ?? "1"`
  - `texts: { languageCode: string; name: string }[]` — init from `collection?.texts ?? []`
  - `requirements: { id: number; type: "ANIMAL" | "STATUE"; animalId: string; statueId: string; requiredLevel: string }[]` — init from `collection?.requirements`, mapping each to string fields
  - `isSubmitting: boolean`

  **Section 1 — Kopfdaten (`InfoAccordion`):**
  - Region: `<select>` over `allRegions`, value = `regionId`
  - Belohnungs-Tier: `<select>` over `allAnimals` (with empty "—" option), value = `rewardAnimalId`
  - Farbvariante: `<input type="text">`, value = `rewardVariant`
  - Sterne: `<select>` with options `1 | 2 | 3`, value = `stars`

  **Section 2 — Übersetzungen (`InfoAccordion` + `DynamicRowInput`):**
  - Rows keyed by `languageCode`
  - Columns: `{ key: "languageCode", type: "select", options: languageOptions }`, `{ key: "name", type: "text" }`
  - `disabledAdd={texts.length >= SUPPORTED_LANGUAGES.length}`
  - `onAdd`: pick first unused language code; append row
  - `onRemove`: filter by languageCode
  - `onChange`: update matching row

  **Section 3 — Anforderungen (`InfoAccordion` + `DynamicRowInput`):**
  - Rows keyed by index (use `id` field as row identifier)
  - Columns:
    - `{ key: "type", type: "select", options: [{value:"ANIMAL",label:t("form.animal")},{value:"STATUE",label:t("form.statue")}], allowDuplicates: true }`
    - `{ key: "animalOrStatue", type: "select", allowDuplicates: true }` — dynamic options: when row type = "ANIMAL", use `allAnimals` mapped to `{ value: String(a.id), label: a.name }`; when "STATUE", use `allStatues` mapped to `{ value: String(s.id), label: \`${s.animalName} (${s.contestName})\` }`. Since `DynamicRowInput` uses static column definitions, use separate columns for animal and statue selects and conditionally show — OR simplify by using a single column with `allowDuplicates: true` and computing options per row inside the component (render a custom select per row).

    **Implementation note:** `DynamicRowInput` does not support per-row dynamic options. Instead, do NOT use `DynamicRowInput` for requirements. Build a small custom requirements table directly in the form: map `requirements` to rows, each row has: Typ select, Tier/Statue select (conditioned on type), Level input, remove button. An "Anforderung hinzufügen" button appends a new row.

  - `{ key: "requiredLevel", type: "number" }` (label: `t("form.level")`)
  - `onAdd`: append `{ id: Date.now(), type: "ANIMAL", animalId: "", statueId: "", requiredLevel: "" }`
  - `onRemove(id)`: filter by id
  - `onChange(id, key, value)`: update matching row

  **Validation on submit:**
  - `regionId === ""` → `toast.warn(t("form.messages.requiredRegion"))` + return
  - No text with non-empty name → `toast.warn(t("form.messages.requiredName"))` + return

  **Submit:** build payload matching `CollectionInput`. Call `createCollectionOnClient` or `updateCollectionOnClient`. On success: `toast.success(...)`, `onSaved()`, `onClose()`. On error: `toast.error(e.message)`.

  **Styled components:** `Overlay` (fixed, z-index 1000, backdrop), `Panel` (white card, max-width 720px, max-height 90vh, overflow-y scroll, padding), `CloseButton` (top-right × button), `Fields`/`FieldGroup`/`Label`/`Input`/`Select` same as `ShopForm`.

- [ ] **Step 2: Run full suite**

  Run: `npx vitest run`
  Expected: All tests pass (no test file for CollectionForm — no simple pure logic to unit test; integration covered in Task 6)

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/pages/animals/collections/CollectionForm.tsx
  git commit -m "feat: add CollectionForm modal (create + edit)"
  ```

---

### Task 6: Overview Integration + Tests

**Files:**
- Modify: `src/components/pages/animals/collections/CollectionCard.tsx`
- Modify: `src/components/pages/animals/collections/CollectionsOverviewContent.tsx`
- Modify: `src/app/[locale]/animals/collections/page.tsx`
- Modify: `src/components/pages/animals/collections/CollectionsOverviewContent.test.tsx`

**Interfaces:**
- Consumes: `CollectionForm` from Task 5; `deleteCollectionOnClient` from Task 4; `RawCollection`, `getAllCollectionsForAdmin`, `getAllContestStatues` from Task 2; `getAllAnimals` from AnimalService; `getAllRegions` from RegionService; `getServerSession` from next-auth; `hasMinimumRole` from roleUtils; `ActionGroupBadge`, `confirmDeleteDialog`
- Produces: `CollectionsOverviewContent` with `isAdmin`, `allAnimals`, `allStatues`, `allRegions`, `allRawCollections` props; `CollectionCard` with optional `onEdit`/`onDelete` props

- [ ] **Step 1: Write failing tests**

  Extend `src/components/pages/animals/collections/CollectionsOverviewContent.test.tsx`.

  Add to existing mock of `CollectionCard`:
  ```typescript
  vi.mock("./CollectionCard", () => ({
    default: ({ collection, onEdit, onDelete }: any) => (
      <div data-testid={`card-${collection.id}`}>
        {collection.name}
        {onEdit && <button data-testid={`edit-${collection.id}`} onClick={onEdit}>Edit</button>}
        {onDelete && <button data-testid={`delete-${collection.id}`} onClick={onDelete}>Delete</button>}
      </div>
    ),
  }));
  ```

  Add mock for CollectionForm:
  ```typescript
  vi.mock("./CollectionForm", () => ({
    default: ({ onClose }: any) => (
      <div data-testid="collection-form">
        <button onClick={onClose}>Close</button>
      </div>
    ),
  }));
  ```

  Update existing render calls to include new required props (use defaults: `isAdmin={false}`, `allAnimals={[]}`, `allStatues={[]}`, `allRegions={[]}`, `allRawCollections={[]}`).

  Add new tests:
  ```typescript
  const adminProps = {
    isAdmin: true,
    allAnimals: [],
    allStatues: [],
    allRegions: [],
    allRawCollections: [],
  };

  test("zeigt Create-Button für Admins", () => {
    render(<CollectionsOverviewContent collections={[]} regions={[]} {...adminProps} />);
    expect(screen.getByTestId("create-collection-btn")).toBeInTheDocument();
  });

  test("zeigt keine Admin-Controls für Non-Admins", () => {
    const collections = [makeCollection(1, "Test")];
    render(<CollectionsOverviewContent collections={collections} regions={[]} isAdmin={false} allAnimals={[]} allStatues={[]} allRegions={[]} allRawCollections={[]} />);
    expect(screen.queryByTestId("create-collection-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-1")).not.toBeInTheDocument();
  });

  test("zeigt Edit- und Delete-Buttons auf Cards für Admins", () => {
    const collections = [makeCollection(1, "Test")];
    render(<CollectionsOverviewContent collections={collections} regions={[]} {...adminProps} />);
    expect(screen.getByTestId("edit-1")).toBeInTheDocument();
    expect(screen.getByTestId("delete-1")).toBeInTheDocument();
  });

  test("öffnet CollectionForm beim Klick auf Create-Button", () => {
    render(<CollectionsOverviewContent collections={[]} regions={[]} {...adminProps} />);
    fireEvent.click(screen.getByTestId("create-collection-btn"));
    expect(screen.getByTestId("collection-form")).toBeInTheDocument();
  });

  test("öffnet CollectionForm beim Klick auf Edit-Button", () => {
    const collections = [makeCollection(1, "Test")];
    render(<CollectionsOverviewContent collections={collections} regions={[]} {...adminProps} />);
    fireEvent.click(screen.getByTestId("edit-1"));
    expect(screen.getByTestId("collection-form")).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run tests — verify they fail**

  Run: `npx vitest run src/components/pages/animals/collections/CollectionsOverviewContent.test.tsx`
  Expected: FAIL — new props not accepted, buttons not present

- [ ] **Step 3: Update `CollectionCard.tsx`**

  Add optional props `onEdit?: () => void` and `onDelete?: () => void` to `CollectionCardProps`. When `onEdit || onDelete`, render an `ActionGroupBadge` in the `CardHeaderRow` (right side), passing `id={collection.id}`, `onEdit` and `onDelete`. Import `ActionGroupBadge` from `@/components/ui/badges/ActionGroupBadge`.

- [ ] **Step 4: Update `CollectionsOverviewContent.tsx`**

  New props interface:
  ```typescript
  interface CollectionsOverviewContentProps {
    collections: Collection[];
    regions: Region[];
    isAdmin: boolean;
    allAnimals: { id: number; identifier: string; name: string }[];
    allStatues: { id: number; animalName: string; contestName: string }[];
    allRegions: { id: number; identifier: string; name: string }[];
    allRawCollections: RawCollection[];
  }
  ```

  State additions:
  - `formOpen: boolean` (default false)
  - `editCollection: RawCollection | undefined` (default undefined)

  Add above the grid (only if `isAdmin`):
  ```tsx
  <button data-testid="create-collection-btn" onClick={() => { setEditCollection(undefined); setFormOpen(true); }}>
    + {t("form.create_title")}
  </button>
  ```

  Pass to `CollectionCard`:
  - `onEdit`: only when `isAdmin` → `() => { setEditCollection(allRawCollections.find(r => r.id === c.id)); setFormOpen(true); }`
  - `onDelete`: only when `isAdmin` → inline async handler using `confirmDeleteDialog`, `deleteCollectionOnClient`, `toast`, `router.refresh()`

  Render `CollectionForm` when `formOpen`:
  ```tsx
  {formOpen && (
    <CollectionForm
      collection={editCollection}
      allAnimals={allAnimals}
      allStatues={allStatues}
      allRegions={allRegions}
      onClose={() => setFormOpen(false)}
      onSaved={() => router.refresh()}
    />
  )}
  ```

  Add imports: `CollectionForm`, `deleteCollectionOnClient`, `confirmDeleteDialog`, `toast`, `useRouter`, `RawCollection`.

- [ ] **Step 5: Update `src/app/[locale]/animals/collections/page.tsx`**

  Add to `Promise.all`:
  - `getAllAnimals(locale)` → map to `{ id, identifier, name: animaltext[0]?.animalName ?? identifier }`
  - `getAllContestStatues()`
  - `getAllCollectionsForAdmin()`
  - `getServerSession(authOptions)` → `isAdmin = hasMinimumRole(session, "Director")`

  Pass these as props to `CollectionsOverviewContent`.

- [ ] **Step 6: Run tests — verify they pass**

  Run: `npx vitest run src/components/pages/animals/collections/CollectionsOverviewContent.test.tsx`
  Expected: PASS (all including new tests)

- [ ] **Step 7: Run full suite**

  Run: `npx vitest run`
  Expected: All tests pass

- [ ] **Step 8: Commit**

  ```bash
  git add src/components/pages/animals/collections src/app/[locale]/animals/collections/page.tsx
  git commit -m "feat: add admin CRUD controls to Collections overview"
  ```
