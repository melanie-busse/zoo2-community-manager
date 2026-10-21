# Collector Album CRUD — Design Spec

**Date:** 2026-10-20
**Branch:** `feature/collections_cu`

---

## Goal

Add full Create / Update / Delete for `Collection` (Sammelalbum) records to the existing read-only overview at `/animals/collections`. Directors see inline Edit and Delete buttons on each card. Navigation entry for "Sammelalbum anlegen" is configured separately. A modal form handles both create and edit.

---

## Context & Constraints

- Existing Prisma models: `Collection`, `CollectionText`, `CollectionRequirement`, `RequirementType (ANIMAL | DECORATION)`
- Existing service: `getAllCollections(locale)` in `CollectionService.ts` — read-only, returns mapped `Collection[]`
- Existing overview page: `/animals/collections` — `CollectionsOverviewContent` renders cards in a 2-column grid
- Existing inventory API: `/api/zooInventory/collections/[requirementId]` — untouched
- No new npm packages

---

## Data Model Changes

### 1. `Collection` — add `rewardVariant`

```prisma
model Collection {
  // existing fields unchanged
  rewardVariant String? @db.VarChar(100)
}
```

### 2. `RequirementType` enum — add `STATUE`

```prisma
enum RequirementType {
  ANIMAL
  DECORATION
  STATUE
}
```

### 3. `CollectionRequirement` — add `statueId → ContestStatue`

```prisma
model CollectionRequirement {
  // existing fields unchanged
  statueId Int?
  statue   ContestStatue? @relation(fields: [statueId], references: [id])
}
```

### 4. `ContestStatue` — add back-relation

```prisma
model ContestStatue {
  // existing fields unchanged
  collectionRequirements CollectionRequirement[]
}
```

Migration approach: `npx prisma db push` (adds columns without dropping data), then `npx prisma generate`.

---

## File Structure

### New files

| Path | Purpose |
|------|---------|
| `src/app/api/collections/route.ts` | GET all + POST create |
| `src/app/api/collections/[id]/route.ts` | PUT update + DELETE |
| `src/service/frontend/Collection.ts` | Client-side fetch wrappers |
| `src/components/pages/animals/collections/CollectionForm.tsx` | Modal form (create + edit) |

### Modified files

| Path | Change |
|------|--------|
| `prisma/schema.prisma` | Add `rewardVariant`, `STATUE` enum value, `statueId` on requirement |
| `src/service/CollectionService.ts` | Add `createCollection`, `updateCollection`, `deleteCollection`, `getAllCollectionsForAdmin`; extend `getAllCollections` with `statue` include |
| `src/types/collection.ts` | Add `rewardVariant`, `statue` to types |
| `src/components/pages/animals/collections/CollectionsOverviewContent.tsx` | Add admin controls (create button, edit/delete on cards) |
| `src/components/pages/animals/collections/CollectionCard.tsx` | Accept optional `onEdit`/`onDelete` props |
| `src/app/[locale]/animals/collections/page.tsx` | Pass `allAnimals`, `allStatues`, `allRegions`, `isAdmin` to content |
| `messages/{locale}/collections.json` | Add CRUD keys (`form.*`, `type.STATUE`) |

---

## API Routes

### `GET /api/collections`

Returns all collections with full nested data for the admin form (raw DB shape, not the mapped `Collection[]` type). Includes `texts[]`, `region`, `rewardAnimal`, `requirements[]` with `animal`, `statue.animal`.

No auth required (read).

### `POST /api/collections`

Body:
```
{
  regionId: number
  rewardAnimalId: number | null
  rewardVariant: string | null
  stars: number  (1-3)
  texts: { languageCode: string; name: string }[]
  requirements: {
    type: "ANIMAL" | "STATUE"
    animalId: number | null
    statueId: number | null
    requiredLevel: number | null
    sortOrder: number
  }[]
}
```

Creates `Collection` + `CollectionText[]` + `CollectionRequirement[]` in one transaction. Auto-generates `identifier` from the first text entry (slugify: lowercase, spaces → `_`). Returns `{ id }`.

Requires Director role.

### `PUT /api/collections/[id]`

Same body as POST. Updates `Collection` fields, then deletes and recreates all `CollectionText` and `CollectionRequirement` records in one transaction. Returns `{ id }`.

Requires Director role.

### `DELETE /api/collections/[id]`

Deletes `Collection`. `CollectionText` and `CollectionRequirement` cascade automatically. Returns 204.

Requires Director role.

---

## Service Layer

### `CollectionService.ts` — new functions

```
getAllCollectionsForAdmin(): Promise<RawCollection[]>
createCollection(data: CollectionInput): Promise<{ id: number }>
updateCollection(id: number, data: CollectionInput): Promise<void>
deleteCollection(id: number): Promise<void>
```

`CollectionInput` mirrors the POST body. `createCollection` generates `identifier` via slugify of the first text name.

### `CollectionService.ts` — extended existing function

`getAllCollections(locale)`: add `statue: { include: { animal: { include: { animaltext: ... } } } }` to the requirement include, and extend the mapped output with `statue` on `CollectionRequirement`.

### `src/service/frontend/Collection.ts`

```
createCollectionOnClient(data: CollectionInput): Promise<{ id: number }>
updateCollectionOnClient(id: number, data: CollectionInput): Promise<void>
deleteCollectionOnClient(id: number): Promise<void>
```

Standard fetch wrappers to `/api/collections` and `/api/collections/[id]`.

---

## Form Component: `CollectionForm`

A modal (overlay) component — no routing. Receives:
- `collection?: RawCollection` (undefined = create mode)
- `allAnimals: { id: number; identifier: string; name: string }[]`
- `allStatues: { id: number; animalName: string; contestName: string }[]`
- `allRegions: { id: number; identifier: string; name: string }[]`
- `onClose: () => void`
- `onSaved: () => void` (triggers `router.refresh()`)

### Sections (cards stacked vertically, no FormGrid):

**1. Kopfdaten:**
- Region — Selectbox from `allRegions`
- Belohnungs-Tier — Selectbox from `allAnimals`
- Farbvariante — optional text input
- Sterne — Selectbox 1 | 2 | 3

**2. Übersetzungen:**
- `DynamicRowInput` with columns: Sprache (select, flag icons) | Name (text)
- Uses `SUPPORTED_LANGUAGES` + `FLAG_MAP` from `@/constants/languages`
- `allLanguagesUsed` disables add button

**3. Anforderungen (Requirements):**
- `DynamicRowInput` with columns:
  - Typ — select `ANIMAL | STATUE` (`allowDuplicates: true`)
  - Tier/Statue — select based on type (`allAnimals` / `allStatues`)
  - Level — number input, optional
- Row `id` = index; `sortOrder` = row index

**Validation:** at least one text entry with a non-empty name; `regionId` required.

**Submit:** calls `createCollectionOnClient` or `updateCollectionOnClient`, then `onSaved()` + `onClose()`.

---

## Overview Page Integration

### `CollectionsOverviewContent`

New props: `isAdmin: boolean`, `allAnimals`, `allStatues`, `allRegions`.

Director-only additions:
- **Create button** above the grid: `"+ Sammelalbum anlegen"` → opens `CollectionForm` in create mode
- **Edit/Delete icons** on each `CollectionCard` (`ActionGroupBadge` in header row)

`CollectionCard` gets optional `onEdit?: () => void` and `onDelete?: () => void` props.

Delete flow: `confirmDeleteDialog` → `deleteCollectionOnClient` → `router.refresh()`.

### `page.tsx` changes

Fetch in `Promise.all`:
- `getAllAnimals(locale)` — for form animal select
- `getAllContestStatues()` — new function in `CollectionService.ts`, returns `ContestStatue[]` with animal name
- `getAllRegions(locale)` — already used for filters
- `getServerSession` — to derive `isAdmin`

---

## i18n Additions

All 6 locale files get new keys under `collections`:

```json
{
  "type": {
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
}
```

---

## Testing

- `CollectionService` CRUD functions: unit tests for `createCollection` (mocked Prisma), `updateCollection` (verify delete+recreate of texts/requirements), `deleteCollection`
- `CollectionsOverviewContent`: existing tests extended — admin controls visible for Director, hidden for non-admin

---

## Out of Scope

- `rewardSpecialCoatId` form field (existing data preserved, not editable via new form)
- `DECORATION` as a selectable requirement type in the form (kept in DB and displayed in read cards; only `ANIMAL` and `STATUE` selectable when creating/editing)
- Reordering requirements via drag-and-drop (`sortOrder` = insert order)
- `itemName` (denormalized string on `CollectionRequirement`) — kept for read path compatibility, written as animal/statue name on save
