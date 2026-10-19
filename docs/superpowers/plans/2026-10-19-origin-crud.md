# Origin CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full CRUD interface for Herkunft (Origin) records — overview, create, edit, delete — following the BiomeDecoration pattern exactly.

**Architecture:** Server components fetch data via OriginService; a Zustand store handles client-side search + pagination; a shared OriginForm handles both create and edit. Images are served from `/images/origins/{identifier}/image.jpg`.

**Tech Stack:** Next.js 16 App Router, Prisma 6, next-intl (6 locales), Zustand, Styled Components, Vitest + React Testing Library.

**Spec:** Approved in-chat design — form fields: `identifier` (disabled on edit), `originName` per language, `originDescription` per language. Delete cascades via existing Prisma `onDelete: Cascade` on `OriginText`, `AnimalOrigin`, `SpecialCoatOrigin`.

## Global Constraints

- Never install new npm packages.
- Functional components + Styled Components only — no Tailwind.
- All new UI strings must be added to all 6 locale files: `de`, `en`, `da`, `es`, `fr`, `nl`.
- Auth guard: `hasMinimumRole(session, "Director")` for create/edit/delete.
- Follow exact patterns from BiomeDecoration (store → filter → paginate → desktop table + mobile card).
- Image path convention: `/images/origins/{identifier}/image.jpg`.

## Review Focus

- **Empty identifier on create:** form must `toast.warn` and abort if `identifier.trim()` is empty.
- **Edit with no identifier in DB:** `identifier` field must show empty string (not "null") and remain disabled.
- **Delete on an origin used by animals:** cascade is in Prisma schema; verify the API route returns 200, not 500.
- **Locale missing for a language:** `origintext[0]?.originName ?? ""` fallback must not crash overview or form.
- **Unauthenticated PUT/DELETE request:** API route must return 403 before touching the DB.

---

## File Map

**New files:**
- `messages/{de,en,da,es,fr,nl}/origin.json` — all UI strings for the origin feature
- `src/store/useOriginStore.ts` — Zustand store (search + paginate)
- `src/service/frontend/Origin.ts` — client-side fetch wrappers
- `src/app/api/origins/route.ts` — POST
- `src/app/api/origins/[id]/route.ts` — PUT, DELETE
- `src/app/[locale]/zoo/origins/page.tsx` — SSR overview page
- `src/components/pages/zoo/origins/OriginOverviewContent.tsx` — client wrapper
- `src/components/pages/zoo/origins/OriginFilter.tsx` — search field only
- `src/components/pages/zoo/origins/OriginDesktopTable.tsx` — table with edit/delete
- `src/components/pages/zoo/origins/OriginMobileCard.tsx` — mobile card
- `src/components/pages/zoo/origins/OriginPagination.tsx` — pagination
- `src/app/[locale]/zoo/origins/create/page.tsx` — SSR create page
- `src/app/[locale]/zoo/origins/[id]/edit/page.tsx` — SSR edit page
- `src/components/pages/zoo/origins/OriginForm.tsx` — shared form

**Modified files:**
- `prisma/schema.prisma` — add `identifier String? @db.VarChar(255)` to `Origin` model
- `src/service/OriginService.ts` — add `getAllOriginsForOverview`, `getOriginById`, `createOrigin`, `updateOrigin`, `deleteOrigin`
- `src/config/navigationData.ts` — add origins + origin_create entries
- `messages/{de,en,da,es,fr,nl}/navigation.json` — add `origins` + `origin_create` keys

---

### Task 1: DB Migration + Prisma Schema + OriginService CRUD

**Files:**
- Modify: `prisma/schema.prisma` — `Origin` model (~line 60)
- Modify: `src/service/OriginService.ts`

**Interfaces produced:**

```ts
// OriginItem — used by overview, store, table, mobile card
interface OriginItem {
  id: number;
  identifier: string | null;
  origintext: { originName: string }[];
}

// OriginDetail — used by edit page + form
interface OriginDetail {
  id: number;
  identifier: string | null;
  origintext: { languageCode: string; originName: string; originDescription: string | null }[];
}

// CreateUpdatePayload — sent from form to API to service
interface OriginPayload {
  identifier: string;
  texts: { languageCode: string; originName: string; originDescription: string }[];
}
```

- [ ] **Step 1: Add `identifier` to Prisma schema**

In `prisma/schema.prisma`, inside the `Origin` model, add after the `id` line:
```prisma
identifier String? @db.VarChar(255)
```

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add_identifier_to_origin
```
Expected: migration file created, Prisma client regenerated, no errors.

- [ ] **Step 3: Extend `src/service/OriginService.ts`**

Add these five functions after the existing `getAllOrigins` function:

```ts
export async function getAllOriginsForOverview(locale: string = "de"): Promise<OriginItem[]>
// prisma.origin.findMany with origintext: { where: { languageCode: locale } }
// map to OriginItem, sort by origintext[0].originName

export async function getOriginById(id: number): Promise<OriginDetail | null>
// prisma.origin.findUnique({ where: { id }, include: { origintext: true } })

export async function createOrigin(data: OriginPayload): Promise<{ id: number }>
// prisma.origin.create with nested origintext upsert for each text entry
// return { id: created.id }

export async function updateOrigin(id: number, data: OriginPayload): Promise<void>
// prisma.origin.update: set identifier, upsert each text by [originId, languageCode]

export async function deleteOrigin(id: number): Promise<void>
// prisma.origin.delete({ where: { id } })
```

Use `upsert` for texts with `where: { originId_languageCode: { originId: id, languageCode: tx.languageCode } }`.

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ src/service/OriginService.ts
git commit -m "feat: add identifier to origin schema and extend OriginService with CRUD"
```

---

### Task 2: i18n — origin.json + navigation updates

**Files:**
- Create: `messages/de/origin.json`, `messages/en/origin.json`, `messages/da/origin.json`, `messages/es/origin.json`, `messages/fr/origin.json`, `messages/nl/origin.json`
- Modify: `messages/{de,en,da,es,fr,nl}/navigation.json` — add `origins` + `origin_create` keys inside `links`
- Modify: `src/config/navigationData.ts`

**Interfaces consumed:** none
**Interfaces produced:** translation namespace `"origin"` with keys listed below

- [ ] **Step 1: Create `messages/de/origin.json`**

```json
{
  "overview_title": "Herkünfte",
  "overview_unit": "Herkünfte",
  "name": "Name",
  "search_placeholder": "Herkünfte suchen...",
  "identifier": "Identifier",
  "emptyState": { "title": "Keine Herkunft gefunden!" },
  "form": {
    "create_origin": "Herkunft anlegen",
    "edit_origin": "Herkunft bearbeiten",
    "save_origin": "Herkunft speichern",
    "basic_info": "Stammdaten",
    "translations": "Übersetzungen",
    "description": "Beschreibung",
    "messages": {
      "createSuccess": "Herkunft erfolgreich angelegt",
      "editSuccess": "Herkunft erfolgreich aktualisiert",
      "requiredIdentifier": "Identifier ist ein Pflichtfeld.",
      "deleteSuccess": "Herkunft erfolgreich gelöscht",
      "deleteErrorTitle": "Herkunft löschen",
      "confirmDelete": "Möchtest du diese Herkunft wirklich löschen?"
    }
  }
}
```

- [ ] **Step 2: Create the remaining 5 locale files**

Use translations below (same key structure as `de`):

**en:**
```json
{
  "overview_title": "Origins",
  "overview_unit": "Origins",
  "name": "Name",
  "search_placeholder": "Search origins...",
  "identifier": "Identifier",
  "emptyState": { "title": "No origin found!" },
  "form": {
    "create_origin": "Add Origin",
    "edit_origin": "Edit Origin",
    "save_origin": "Save Origin",
    "basic_info": "Basic Info",
    "translations": "Translations",
    "description": "Description",
    "messages": {
      "createSuccess": "Origin successfully created",
      "editSuccess": "Origin successfully updated",
      "requiredIdentifier": "Identifier is required.",
      "deleteSuccess": "Origin successfully deleted",
      "deleteErrorTitle": "Delete Origin",
      "confirmDelete": "Do you really want to delete this origin?"
    }
  }
}
```

**da:**
```json
{
  "overview_title": "Oprindelser",
  "overview_unit": "Oprindelser",
  "name": "Navn",
  "search_placeholder": "Søg oprindelser...",
  "identifier": "Identifier",
  "emptyState": { "title": "Ingen oprindelse fundet!" },
  "form": {
    "create_origin": "Tilføj oprindelse",
    "edit_origin": "Rediger oprindelse",
    "save_origin": "Gem oprindelse",
    "basic_info": "Stamdata",
    "translations": "Oversættelser",
    "description": "Beskrivelse",
    "messages": {
      "createSuccess": "Oprindelse oprettet",
      "editSuccess": "Oprindelse opdateret",
      "requiredIdentifier": "Identifier er påkrævet.",
      "deleteSuccess": "Oprindelse slettet",
      "deleteErrorTitle": "Slet oprindelse",
      "confirmDelete": "Vil du virkelig slette denne oprindelse?"
    }
  }
}
```

**es:**
```json
{
  "overview_title": "Orígenes",
  "overview_unit": "Orígenes",
  "name": "Nombre",
  "search_placeholder": "Buscar orígenes...",
  "identifier": "Identificador",
  "emptyState": { "title": "¡No se encontró ningún origen!" },
  "form": {
    "create_origin": "Añadir origen",
    "edit_origin": "Editar origen",
    "save_origin": "Guardar origen",
    "basic_info": "Datos básicos",
    "translations": "Traducciones",
    "description": "Descripción",
    "messages": {
      "createSuccess": "Origen creado correctamente",
      "editSuccess": "Origen actualizado correctamente",
      "requiredIdentifier": "El identificador es obligatorio.",
      "deleteSuccess": "Origen eliminado correctamente",
      "deleteErrorTitle": "Eliminar origen",
      "confirmDelete": "¿Realmente deseas eliminar este origen?"
    }
  }
}
```

**fr:**
```json
{
  "overview_title": "Origines",
  "overview_unit": "Origines",
  "name": "Nom",
  "search_placeholder": "Rechercher des origines...",
  "identifier": "Identifiant",
  "emptyState": { "title": "Aucune origine trouvée !" },
  "form": {
    "create_origin": "Ajouter une origine",
    "edit_origin": "Modifier l'origine",
    "save_origin": "Enregistrer l'origine",
    "basic_info": "Informations de base",
    "translations": "Traductions",
    "description": "Description",
    "messages": {
      "createSuccess": "Origine créée avec succès",
      "editSuccess": "Origine mise à jour avec succès",
      "requiredIdentifier": "L'identifiant est obligatoire.",
      "deleteSuccess": "Origine supprimée avec succès",
      "deleteErrorTitle": "Supprimer l'origine",
      "confirmDelete": "Voulez-vous vraiment supprimer cette origine ?"
    }
  }
}
```

**nl:**
```json
{
  "overview_title": "Herkómsten",
  "overview_unit": "Herkómsten",
  "name": "Naam",
  "search_placeholder": "Zoek herkómsten...",
  "identifier": "Identifier",
  "emptyState": { "title": "Geen herkomst gevonden!" },
  "form": {
    "create_origin": "Herkomst toevoegen",
    "edit_origin": "Herkomst bewerken",
    "save_origin": "Herkomst opslaan",
    "basic_info": "Basisgegevens",
    "translations": "Vertalingen",
    "description": "Beschrijving",
    "messages": {
      "createSuccess": "Herkomst succesvol aangemaakt",
      "editSuccess": "Herkomst succesvol bijgewerkt",
      "requiredIdentifier": "Identifier is verplicht.",
      "deleteSuccess": "Herkomst succesvol verwijderd",
      "deleteErrorTitle": "Herkomst verwijderen",
      "confirmDelete": "Wil je deze herkomst echt verwijderen?"
    }
  }
}
```

- [ ] **Step 3: Add navigation keys to all 6 `navigation.json` files**

Inside the `links` object, add after `decoration_create`:
```json
"origins": "<locale-specific>",
"origin_create": "<locale-specific>"
```

Translations:
- de: `"origins": "Herkünfte"`, `"origin_create": "Herkunft anlegen"`
- en: `"origins": "Origins"`, `"origin_create": "Add Origin"`
- da: `"origins": "Oprindelser"`, `"origin_create": "Tilføj oprindelse"`
- es: `"origins": "Orígenes"`, `"origin_create": "Añadir origen"`
- fr: `"origins": "Origines"`, `"origin_create": "Ajouter une origine"`
- nl: `"origins": "Herkómsten"`, `"origin_create": "Herkomst toevoegen"`

- [ ] **Step 4: Add origins to `src/config/navigationData.ts`**

Inside the `zoo` nav item's `subMenu` array, add after the `decoration_create` entry:
```ts
{ labelKey: "origins", href: "/zoo/origins", requiresAuth: false },
{
  labelKey: "origin_create",
  href: "/zoo/origins/create",
  requiresAuth: true,
  minimumRole: "Director",
},
```

- [ ] **Step 5: Verify i18n compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add messages/ src/config/navigationData.ts
git commit -m "feat: add origin i18n messages and navigation entries"
```

---

### Task 3: Store + Frontend Service + API Routes

**Files:**
- Create: `src/store/useOriginStore.ts`
- Create: `src/service/frontend/Origin.ts`
- Create: `src/app/api/origins/route.ts`
- Create: `src/app/api/origins/[id]/route.ts`

**Interfaces consumed:**
- `OriginItem` from Task 1
- `OriginPayload` from Task 1
- `createOrigin`, `updateOrigin`, `deleteOrigin` from `OriginService`

**Interfaces produced:**
- `useOriginStore` with `setInitialOrigins(origins: OriginItem[])`, `setSearchTerm(term: string)`, `nextPage()`, `prevPage()`, state: `currentItems: OriginItem[]`, `filteredCount: number`, `currentPage: number`, `itemsPerPage: number`, `searchTerm: string`
- `createOriginOnClient(data: object): Promise<any>`
- `updateOriginOnClient(id: number, data: object): Promise<any>`
- `deleteOriginOnClient(id: number): Promise<any>`

- [ ] **Step 1: Create `src/store/useOriginStore.ts`**

Mirror `useDecorationStore` exactly. Filter function:
```ts
function filterOrigins(origins: OriginItem[], searchTerm: string): OriginItem[] {
  return origins.filter((o) => {
    const name = o.origintext[0]?.originName ?? "";
    return !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase());
  });
}
```

State shape:
```ts
interface OriginState {
  allOrigins: OriginItem[];
  currentItems: OriginItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  setInitialOrigins(origins: OriginItem[]): void;
  setSearchTerm(term: string): void;
  nextPage(): void;
  prevPage(): void;
}
```

`runPipeline(allOrigins, searchTerm, currentPage, itemsPerPage)` calls `filterOrigins` then `paginate` (from `@/utils/AnimalUtil`).

- [ ] **Step 2: Create `src/service/frontend/Origin.ts`**

Mirror `BiomeDecoration.ts` exactly, using `/api/origins` and `/api/origins/${id}`:
```ts
async function handleResponse(res: Response) { ... }
export async function createOriginOnClient(data: object): Promise<any>
export async function updateOriginOnClient(id: number, data: object): Promise<any>
export async function deleteOriginOnClient(id: number): Promise<any>
```

- [ ] **Step 3: Create `src/app/api/origins/route.ts`**

Handle POST: auth check `hasMinimumRole(session, "Director")` → `createOrigin(data)` → `NextResponse.json({ id })`.

- [ ] **Step 4: Create `src/app/api/origins/[id]/route.ts`**

Handle PUT: auth check → `updateOrigin(id, data)` → `NextResponse.json({ id })`.
Handle DELETE: auth check → `deleteOrigin(id)` → `NextResponse.json({ success: true })`.

Mirror `src/app/api/decorations/[id]/route.ts` exactly for the auth + parse pattern.

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/store/useOriginStore.ts src/service/frontend/Origin.ts src/app/api/origins/
git commit -m "feat: add origin store, frontend service, and API routes"
```

---

### Task 4: Overview Page + Components

**Files:**
- Create: `src/app/[locale]/zoo/origins/page.tsx`
- Create: `src/components/pages/zoo/origins/OriginOverviewContent.tsx`
- Create: `src/components/pages/zoo/origins/OriginFilter.tsx`
- Create: `src/components/pages/zoo/origins/OriginDesktopTable.tsx`
- Create: `src/components/pages/zoo/origins/OriginMobileCard.tsx`
- Create: `src/components/pages/zoo/origins/OriginPagination.tsx`

**Interfaces consumed:**
- `getAllOriginsForOverview(locale)` → `OriginItem[]` from OriginService
- `useOriginStore` from Task 3
- `deleteOriginOnClient` from Task 3

**Interfaces produced:**
- `OriginItem` exported from `OriginOverviewContent.tsx` (re-export for table + card)

- [ ] **Step 1: Create `src/app/[locale]/zoo/origins/page.tsx`**

Server component. Mirror `decorations/page.tsx`:
```ts
const [origins, t] = await Promise.all([
  getAllOriginsForOverview(locale),
  getTranslations({ locale, namespace: "origin" }),
]);
// render PageWrapper > ContentWrapper > PageHeader + OriginOverviewContent
// pass origins={JSON.parse(JSON.stringify(origins))}
```

- [ ] **Step 2: Create `src/components/pages/zoo/origins/OriginOverviewContent.tsx`**

`"use client"`. Export `OriginItem` interface. Mirror `BiomeDecorationOverviewContent`:
- `useEffect` calls `setInitialOrigins(origins)`
- renders `<OriginFilter />`, `<ResultsInfo />`, desktop/mobile views, `<OriginPagination />`
- uses `useTranslations("origin")` for `overview_unit` and `emptyState.title`

- [ ] **Step 3: Create `src/components/pages/zoo/origins/OriginFilter.tsx`**

`"use client"`. Search field only (no biome select — origins have no biome).
Uses `useOriginStore`'s `searchTerm` + `setSearchTerm`.
Uses `<SearchInputField>` from `@/components/elements/Filter/SearchInputField`.
Placeholder: `t("search_placeholder")` from `"origin"` namespace.

- [ ] **Step 4: Create `src/components/pages/zoo/origins/OriginDesktopTable.tsx`**

`"use client"`. Columns: image | Name | Identifier | Actions (Director only).

Image: `<img src={`/images/origins/${origin.identifier}/image.jpg`} onError hide />`.
Name: `origin.origintext[0]?.originName ?? origin.identifier ?? "-"`.
Edit: `router.push(\`/zoo/origins/${origin.id}/edit\`)`.
Delete: `confirmDeleteDialog` → `deleteOriginOnClient(id)` → `toast.success` + `router.refresh()`.
Auth guard: `hasMinimumRole(session, "Director")`.

- [ ] **Step 5: Create `src/components/pages/zoo/origins/OriginMobileCard.tsx`**

`"use client"`. Mirror `BiomeDecorationMobileCard`. Show name + identifier. Same delete pattern.

- [ ] **Step 6: Create `src/components/pages/zoo/origins/OriginPagination.tsx`**

`"use client"`. Mirror `BiomeDecorationPagination` — use `useOriginStore`.

- [ ] **Step 7: Verify the page renders (TypeScript + build check)**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/app/\[locale\]/zoo/origins/page.tsx src/components/pages/zoo/origins/
git commit -m "feat: add origin overview page and components"
```

---

### Task 5: Form + Create / Edit Pages

**Files:**
- Create: `src/components/pages/zoo/origins/OriginForm.tsx`
- Create: `src/app/[locale]/zoo/origins/create/page.tsx`
- Create: `src/app/[locale]/zoo/origins/[id]/edit/page.tsx`

**Interfaces consumed:**
- `getOriginById(id)` → `OriginDetail` from OriginService
- `getAllLanguages()` from `@/service/LanguageService`
- `createOriginOnClient`, `updateOriginOnClient` from Task 3
- `Language`: `{ code: string; name: string }` from `getAllLanguages()`

**Interfaces produced:** none (terminal)

- [ ] **Step 1: Create `src/components/pages/zoo/origins/OriginForm.tsx`**

`"use client"`. Props:
```ts
interface OriginFormProps {
  origin?: OriginDetail;      // undefined → create mode
  languages: Language[];
}
```

State:
```ts
const [identifier, setIdentifier] = useState(origin?.identifier ?? "");
const [texts, setTexts] = useState<{ languageCode: string; originName: string; originDescription: string }[]>(() => {
  const map = new Map(origin?.origintext.map(tx => [tx.languageCode, tx]) ?? []);
  return languages.map(l => ({
    languageCode: l.code,
    originName: map.get(l.code)?.originName ?? "",
    originDescription: map.get(l.code)?.originDescription ?? "",
  }));
});
const [isSubmitting, setIsSubmitting] = useState(false);
```

Layout: `FormGrid` with two `Column`s.
- Left `Column`: `InfoAccordion` (`t("form.basic_info")`) containing `identifier` field (disabled when `!!origin`).
- Right `Column`: `InfoAccordion` (`t("form.translations")`) with per-language `originName` + `originDescription` pairs.

`handleSubmit`:
1. Guard: `if (!identifier.trim()) { toast.warn(t("form.messages.requiredIdentifier")); return; }`
2. Build payload: `{ identifier, texts }`.
3. If `origin?.id`: `updateOriginOnClient(origin.id, payload)` → `toast.success(t("form.messages.editSuccess"))`.
4. Else: `createOriginOnClient(payload)` → `toast.success(t("form.messages.createSuccess"))`.
5. `router.push("/zoo/origins")`.

- [ ] **Step 2: Create `src/app/[locale]/zoo/origins/create/page.tsx`**

Server component. Auth redirect to `/zoo/origins` if not Director.
```ts
const [languages, t] = await Promise.all([
  getAllLanguages(),
  getTranslations({ locale, namespace: "origin" }),
]);
// render PageHeader t("form.create_origin") + <OriginForm languages={languages} />
```

- [ ] **Step 3: Create `src/app/[locale]/zoo/origins/[id]/edit/page.tsx`**

Server component. Auth redirect. Parse `id`, call `getOriginById(id)`, `notFound()` if null.
```ts
const [origin, languages, t] = await Promise.all([
  getOriginById(originId),
  getAllLanguages(),
  getTranslations({ locale, namespace: "origin" }),
]);
// render PageHeader t("form.edit_origin") + <OriginForm origin={serialized} languages={languages} />
```

- [ ] **Step 4: Final TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```
Expected: all existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/zoo/origins/OriginForm.tsx src/app/\[locale\]/zoo/origins/create/ src/app/\[locale\]/zoo/origins/\[id\]/
git commit -m "feat: add origin form and create/edit pages"
```
