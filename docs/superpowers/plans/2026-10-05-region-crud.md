# Region CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add create, edit, and delete functionality for Regions, following the Animal CRUD pattern.

**Architecture:** Server pages load reference data (languages) and pass it to a client-side `RegionForm`; the form calls a frontend service directly (no Zustand store — overview is SSR) that hits REST API routes, which call Prisma service mutations in transactions. Delete is handled in the detail page client wrapper via `confirmDeleteDialog` + `deleteRegionOnClient`.

**Tech Stack:** Next.js 16 App Router, Prisma 6, next-intl, Styled Components, Vitest + React Testing Library

**Spec:** Design presented and approved in conversation on 2026-10-05.

## Global Constraints

- No new npm packages.
- Styled Components for all styling; no Tailwind.
- All UI text must have keys in all 6 locale files: `de`, `en`, `da`, `es`, `fr`, `nl`.
- Auth: `hasMinimumRole(session, "Director") || isMayor(session)` for page access; API routes additionally short-circuit with 403 + `"MayorReadonly"` error for Mayor role.
- `terrainid` is always stored as `0` — excluded from form entirely.
- Building `pricetype` fields are raw ints (1=Zoodollar, 2=Diamond), not FK to PriceType table.
- Form sections live in `src/components/pages/zoo/regions/form/`.
- Follow `AnimalTranslationSection` pattern for DynamicRowInput usage.
- Follow `Animal.test.ts` pattern for frontend service tests (German test descriptions).
- `createRegion` must filter out `regionText` entries where `name === ""` before inserting.

## Review Focus

- **GuestLounge toggle off on update:** When `hasGuestLounge=false` on save, existing GuestLounge row must be deleted. `updateRegion` always `deleteMany` GuestLounge before conditionally creating. Covered by Task 1 step 1 test.
- **Empty regionTexts on create:** All 6 languages sent as empty strings must not create DB rows. `createRegion` filters `name === ""`. Covered by Task 1 step 1 test.
- **Slot row ordering:** Slots recreated in user-defined order (array index), not by slot number. Covered by Task 1 step 1 test for updateRegion.
- **MayorReadonly on form submit:** Form must `toast.info` and not redirect. Covered by Task 7 step 1 handleSubmit logic note.
- **Edit page Date serialization:** `releasedate` is a `Date` object from Prisma — must `JSON.parse(JSON.stringify(...))` before passing to client to avoid serialization error. Covered by Task 8 step 2.

---

### Task 1: Service mutations + RegionUtil

**Files:**
- Modify: `src/service/RegionService.ts`
- Create: `src/utils/RegionUtil.ts`
- Create: `src/utils/RegionUtil.test.ts`

**Interfaces:**
- Produces:
  - `mapRegionToForm(region: any | null, languages: Array<{ code: string; name: string }>): RegionFormData`
  - `createRegion(data: any): Promise<{ id: number }>`
  - `updateRegion(id: number, data: any): Promise<{ id: number }>`
  - `deleteRegion(id: number): Promise<void>`

- [ ] **Step 1: Write failing tests for `mapRegionToForm`**

```typescript
// src/utils/RegionUtil.test.ts
import { describe, test, expect } from "vitest";
import { mapRegionToForm } from "./RegionUtil";

const LANGS = [{ code: "de", name: "Deutsch" }, { code: "en", name: "English" }];

describe("mapRegionToForm", () => {
  test("null region: gibt leeres Formular mit allen Sprachen zurück", () => {
    const result = mapRegionToForm(null, LANGS);
    expect(result.identifier).toBe("");
    expect(result.regionTexts).toHaveLength(2);
    expect(result.regionTexts[0]).toEqual({ languageCode: "de", name: "" });
    expect(result.hasGuestLounge).toBe(false);
    expect(result.priceTypeId).toBe("1");
    expect(result.breedingCenterSlots).toEqual([]);
    expect(result.admissionsBooths).toEqual([]);
  });

  test("existierende Region: mappt alle Felder korrekt", () => {
    const region = {
      id: 1, identifier: "MainZoo",
      releasedate: new Date("2018-03-27"),
      unlocklevel: 0, price: 0, priceTypeId: 1,
      regionTexts: [{ languageCode: "de", name: "Hauptzoo" }],
      breedingCenters: [{ price: 10000, pricetype: 1 }],
      breedingCenterSlots: [{ slot: 1, price: 0, pricetype: 1 }],
      admissionsBooths: [{ booth_level: 0, max_capacity: 2000, upgrade: 0, pricetype: 1 }],
      adminBuildings: [{ price: 20000, pricetype: 1 }],
      visitorCenters: [{ price: 5000, pricetype: 1 }],
      transportStation: [{ price: 3000, pricetype: 1 }],
      guestLounges: [],
    };
    const result = mapRegionToForm(region, LANGS);
    expect(result.id).toBe(1);
    expect(result.identifier).toBe("MainZoo");
    expect(result.releasedate).toBe("2018-03-27");
    expect(result.regionTexts.find(t => t.languageCode === "de")?.name).toBe("Hauptzoo");
    expect(result.regionTexts.find(t => t.languageCode === "en")?.name).toBe("");
    expect(result.breedingCenter.price).toBe("10000");
    expect(result.breedingCenter.pricetype).toBe("1");
    expect(result.breedingCenterSlots).toHaveLength(1);
    expect(result.hasGuestLounge).toBe(false);
  });

  test("Region mit GuestLounge: hasGuestLounge ist true und Preis gemappt", () => {
    const region = {
      id: 2, identifier: "FirGrove", releasedate: new Date(),
      unlocklevel: 30, price: 50, priceTypeId: 2,
      regionTexts: [], breedingCenters: [], breedingCenterSlots: [],
      admissionsBooths: [], adminBuildings: [], visitorCenters: [],
      transportStation: [], guestLounges: [{ price: 100, pricetype: 2 }],
    };
    const result = mapRegionToForm(region, LANGS);
    expect(result.hasGuestLounge).toBe(true);
    expect(result.guestLounge.price).toBe("100");
    expect(result.guestLounge.pricetype).toBe("2");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

  `npx vitest run src/utils/RegionUtil.test.ts`

- [ ] **Step 3: Implement `mapRegionToForm` in `src/utils/RegionUtil.ts`**

  Pure function. All numeric values to strings. `releasedate` → `new Date(v).toISOString().split("T")[0]`. `regionTexts`: one entry per language from `languages`; missing codes get `name: ""`. All building arrays: take `[0]` or default to `{ price: "", pricetype: "1" }`.

  Export type `RegionFormData` with all fields (optional `id?: number`).

- [ ] **Step 4: Run — expect PASS**

  `npx vitest run src/utils/RegionUtil.test.ts`

- [ ] **Step 5: Implement service mutations in `src/service/RegionService.ts`**

  Add after existing functions. All use `prisma.$transaction`.

  **`createRegion(data)`** transaction order:
  1. `tx.region.create({ data: { price: parseInt(data.price), priceTypeId: parseInt(data.priceTypeId), terrainid: 0, releasedate: new Date(data.releasedate), unlocklevel: parseInt(data.unlocklevel), identifier: data.identifier } })`
  2. `tx.regionText.createMany` — filter `data.regionTexts` to only entries where `name !== ""`
  3. `tx.breedingCenter.create({ data: { price: parseInt(data.breedingCenter.price || "0"), pricetype: parseInt(data.breedingCenter.pricetype || "1"), regionId: region.id } })`
  4. `tx.breedingCenterSlot.createMany` — map `data.breedingCenterSlots`
  5. `tx.admissionsBooth.createMany` — map `data.admissionsBooths`
  6. `tx.adminBuilding.create`
  7. `tx.visitorCenter.create`
  8. `tx.transportStation.create`
  9. If `data.hasGuestLounge`: `tx.guestLounge.create`
  10. Return `region`

  **`updateRegion(id, data)`** transaction order:
  1. `tx.region.update`
  2. `deleteMany + createMany` for: `regionText` (filter empty names), `breedingCenter`, `breedingCenterSlot`, `admissionsBooth`, `adminBuilding`, `visitorCenter`, `transportStation`
  3. `tx.guestLounge.deleteMany({ where: { regionId: id } })` — always; then `tx.guestLounge.create` only if `data.hasGuestLounge`

  **`deleteRegion(id)`:** `return prisma.region.delete({ where: { id } })`

- [ ] **Step 6: Run full suite**

  `npx vitest run`

- [ ] **Step 7: Commit**

```bash
git add src/utils/RegionUtil.ts src/utils/RegionUtil.test.ts src/service/RegionService.ts
git commit -m "feat: add region service mutations and mapRegionToForm utility"
```

---

### Task 2: Frontend service

**Files:**
- Create: `src/service/frontend/Region.ts`
- Create: `src/service/frontend/Region.test.ts`

**Interfaces:**
- Produces:
  - `createRegionOnClient(formData: any): Promise<{ id: number }>`
  - `updateRegionOnClient(id: number, formData: any): Promise<{ id: number }>`
  - `deleteRegionOnClient(id: number): Promise<void>`

- [ ] **Step 1: Write failing tests**

  Mirror `Animal.test.ts` exactly. Three describe blocks. Each tests: correct method+URL, returns result on success, throws with server message on failure, throws when no message.

  ```typescript
  // Key assertions:
  // createRegionOnClient: POST "/api/regions"
  // updateRegionOnClient(42, data): PUT "/api/regions/42"
  // deleteRegionOnClient(42): DELETE "/api/regions/42"
  ```

- [ ] **Step 2: Run — expect FAIL**

  `npx vitest run src/service/frontend/Region.test.ts`

- [ ] **Step 3: Implement `src/service/frontend/Region.ts`**

  Mirror `Animal.ts` exactly, replacing `/api/animals` → `/api/regions`.

- [ ] **Step 4: Run — expect PASS**

  `npx vitest run src/service/frontend/Region.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/service/frontend/Region.ts src/service/frontend/Region.test.ts
git commit -m "feat: add region frontend service"
```

---

### Task 3: API routes + i18n api keys

**Files:**
- Create: `src/app/api/regions/route.ts`
- Create: `src/app/api/regions/[id]/route.ts`
- Modify: `messages/de/api.json`, `messages/en/api.json`, `messages/da/api.json`, `messages/es/api.json`, `messages/fr/api.json`, `messages/nl/api.json`

**Interfaces:**
- Consumes: `createRegion`, `updateRegion`, `deleteRegion` from `src/service/RegionService.ts`
- Consumes: `hasMinimumRole`, `isMayor` from `src/utils/roleUtils.ts`

- [ ] **Step 1: Add `region` key block to all 6 `api.json` files**

  Add under key `"region"` (translate per locale):
  ```json
  "region": {
    "required_fields": "Identifier und mindestens ein Name sind Pflichtfelder.",
    "create_error": "Fehler beim Erstellen der Region",
    "update_success": "Region erfolgreich aktualisiert",
    "update_error": "Fehler beim Aktualisieren der Region",
    "delete_error": "Fehler beim Löschen der Region",
    "invalid_id": "Ungültige Region-ID"
  }
  ```

- [ ] **Step 2: Implement `src/app/api/regions/route.ts`**

  `POST` only (no GET needed — regions load via SSR). Mirror `animals/route.ts`:
  - `isMayor` → 403 MayorReadonly
  - `hasMinimumRole(session, "Director")` → 403 unauthorized
  - Validate: `body.identifier` non-empty; at least one `regionText` with non-empty `name`
  - `createRegion(body)` → return `{ id: region.id }`, status 201

- [ ] **Step 3: Implement `src/app/api/regions/[id]/route.ts`**

  `PUT` and `DELETE`. Both require `Director+`. Mirror `animals/[id]/route.ts`:
  - `PUT`: validate `body.identifier`; call `updateRegion(id, body)`; return `{ id, message }` 200
  - `DELETE`: call `deleteRegion(id)`; return 204

- [ ] **Step 4: Run full suite**

  `npx vitest run`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/regions/ messages/de/api.json messages/en/api.json messages/da/api.json messages/es/api.json messages/fr/api.json messages/nl/api.json
git commit -m "feat: add region API routes and api i18n keys"
```

---

### Task 4: Form sections — Basic, Price, Translation + i18n form keys

**Files:**
- Create: `src/components/pages/zoo/regions/form/RegionBasicSection.tsx`
- Create: `src/components/pages/zoo/regions/form/RegionPriceSection.tsx`
- Create: `src/components/pages/zoo/regions/form/RegionTranslationSection.tsx`
- Modify: all 6 `messages/*/region.json`

**Interfaces:**
- `RegionBasicSection`, `RegionPriceSection`: `props: { formData: any; setFormData: Dispatch<SetStateAction<any>> }`
- `RegionTranslationSection`: same props + `dbLanguages: Array<{ code: string; name: string }>`

- [ ] **Step 1: Add `form` key block to all 6 `region.json` files**

  Add under key `"form"` (translate per locale):
  ```json
  "form": {
    "create_region": "Region anlegen",
    "edit_region": "Region bearbeiten",
    "save_region": "Region speichern",
    "basic_info": "Stammdaten",
    "identifier": "Identifier",
    "releasedate": "Release-Datum",
    "unlocklevel": "Freischalt-Level",
    "translations": "Übersetzungen",
    "messages": {
      "createSuccess": "Region erfolgreich angelegt",
      "editSuccess": "Region erfolgreich aktualisiert",
      "confirmDelete": "Möchtest du diese Region wirklich löschen?",
      "deleteErrorTitle": "Region löschen",
      "deleteSuccess": "Region erfolgreich gelöscht",
      "requiredIdentifier": "Identifier ist ein Pflichtfeld."
    }
  }
  ```

- [ ] **Step 2: Implement `RegionBasicSection`**

  `InfoAccordion` icon `"/images/icons/info.png"`, title `tRegion("form.basic_info")`. Three `FormGroup`s:
  - `identifier`: plain `<input type="text">` (same inline style as `BasicInfoSection.tsx`) → `setFormData(prev => ({ ...prev, identifier: e.target.value }))`
  - `releasedate`: `DatePickerField` → sets `formData.releasedate`
  - `unlocklevel`: `InputField type="number"` → sets `formData.unlocklevel`

- [ ] **Step 3: Implement `RegionPriceSection`**

  `InfoAccordion` icon `"/images/currency/diamant.webp"`, title `tCommon("price")`. One `FormGroup` + `FormRow`:
  - `InputField type="number"` for `formData.price`
  - `Selectbox` for `formData.priceTypeId`, options: `[{ value: "1", label: tCommon("currencies.zoodollar") }, { value: "2", label: tCommon("currencies.diamonds") }]`

- [ ] **Step 4: Implement `RegionTranslationSection`**

  Mirror `AnimalTranslationSection` exactly:
  - Replace `formData.animaltext` → `formData.regionTexts`
  - Columns: `languageCode` (select, $flex: 0.5) + `name` (text, $flex: 1) — no description column
  - `id` for each row = `languageCode`
  - `tRegion("form.translations")` as accordion title, icon `"/images/icons/globus.png"`

- [ ] **Step 5: Run full suite**

  `npx vitest run`

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/zoo/regions/form/ messages/
git commit -m "feat: add region basic/price/translation form sections and i18n keys"
```

---

### Task 5: Form sections — BreedingCenter + AdmissionsBooth

**Files:**
- Create: `src/components/pages/zoo/regions/form/RegionBreedingCenterSection.tsx`
- Create: `src/components/pages/zoo/regions/form/RegionAdmissionsBoothSection.tsx`

**Interfaces:**
- Both: `props: { formData: any; setFormData: Dispatch<SetStateAction<any>> }`

- [ ] **Step 1: Implement `RegionBreedingCenterSection`**

  `InfoAccordion` icon `"/images/icons/breeding.png"`, title `tRegion("breeding_center")`, `defaultOpen={true}`.

  **Top `FormRow`** (breedingCenter price + pricetype):
  - `InputField type="number"` for `formData.breedingCenter.price` → `setFormData(p => ({ ...p, breedingCenter: { ...p.breedingCenter, price: e.target.value } }))`
  - `Selectbox` for `formData.breedingCenter.pricetype` with `CURRENCY_OPTIONS`

  **`DynamicRowInput`** for `formData.breedingCenterSlots`:
  - columns: `slot` (number), `price` (number), `pricetype` (select with `CURRENCY_OPTIONS`)
  - `onAdd`: `setFormData(p => ({ ...p, breedingCenterSlots: [...p.breedingCenterSlots, { id: Date.now(), slot: "", price: "", pricetype: "1" }] }))`
  - `onRemove(id)`: filter by id
  - `onChange(id, key, val)`: map over slots, update matching id

  Define `CURRENCY_OPTIONS = [{ value: "1", label: tCommon("currencies.zoodollar") }, { value: "2", label: tCommon("currencies.diamonds") }]` as a local const.

- [ ] **Step 2: Implement `RegionAdmissionsBoothSection`**

  `InfoAccordion` icon `"/images/icons/visitors.jpg"`, title `tRegion("admissions_booth")`, `defaultOpen={true}`.

  **`DynamicRowInput`** for `formData.admissionsBooths`:
  - columns: `booth_level` (number), `max_capacity` (number), `upgrade` (number), `pricetype` (select)
  - `onAdd`: append `{ id: Date.now(), booth_level: "", max_capacity: "", upgrade: "", pricetype: "1" }`

- [ ] **Step 3: Run full suite**

  `npx vitest run`

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/zoo/regions/form/RegionBreedingCenterSection.tsx src/components/pages/zoo/regions/form/RegionAdmissionsBoothSection.tsx
git commit -m "feat: add region breeding center and admissions booth form sections"
```

---

### Task 6: Form sections — BuildingField + GuestLounge

**Files:**
- Create: `src/components/pages/zoo/regions/form/RegionBuildingField.tsx`
- Create: `src/components/pages/zoo/regions/form/RegionGuestLoungeSection.tsx`

**Interfaces:**
- `RegionBuildingField`:
  ```typescript
  interface RegionBuildingFieldProps {
    title: string;
    icon: string;
    formKey: "adminBuilding" | "visitorCenter" | "transportStation";
    formData: any;
    setFormData: Dispatch<SetStateAction<any>>;
  }
  ```
- `RegionGuestLoungeSection`: `{ formData: any; setFormData: Dispatch<SetStateAction<any>> }`

- [ ] **Step 1: Implement `RegionBuildingField`**

  `InfoAccordion` with props `title`, `icon`, `defaultOpen={true}`. One `FormRow`:
  - `InputField type="number"` for `formData[formKey].price` → `setFormData(p => ({ ...p, [formKey]: { ...p[formKey], price: e.target.value } }))`
  - `Selectbox` for `formData[formKey].pricetype`

- [ ] **Step 2: Implement `RegionGuestLoungeSection`**

  `InfoAccordion` title `tRegion("guest_lounge")`, icon `"/images/icons/visitors.jpg"`, `defaultOpen={true}`.

  First element: checkbox toggle for `formData.hasGuestLounge`.

  Below checkbox — wrapped in a `div` with `opacity: formData.hasGuestLounge ? 1 : 0.4` and `pointerEvents: formData.hasGuestLounge ? "auto" : "none"`:
  - Same `FormRow` as `RegionBuildingField` but for `formData.guestLounge`

- [ ] **Step 3: Run full suite**

  `npx vitest run`

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/zoo/regions/form/RegionBuildingField.tsx src/components/pages/zoo/regions/form/RegionGuestLoungeSection.tsx
git commit -m "feat: add region building field and guest lounge form sections"
```

---

### Task 7: RegionForm shell

**Files:**
- Create: `src/components/pages/zoo/regions/RegionForm.tsx`

**Interfaces:**
- Consumes: `createRegionOnClient`, `updateRegionOnClient` from `src/service/frontend/Region.ts`
- Consumes: `mapRegionToForm` from `src/utils/RegionUtil.ts`
- Consumes: all section components from `form/`
- Produces: `<RegionForm region?: any, languages: Array<{ code: string; name: string }> />`

- [ ] **Step 1: Implement `RegionForm`**

  `"use client"`. State: `const [formData, setFormData] = useState(() => mapRegionToForm(region ?? null, languages))`.

  Derive `adminBuildingTitle`:
  ```typescript
  const STAFF_ROOM_REGIONS = new Set(["Aviary", "Aquarium", "Terrarium", "NocturnalHouse"]);
  const adminBuildingTitle = STAFF_ROOM_REGIONS.has(formData.identifier)
    ? tRegion("admin_building_room")
    : tRegion("admin_building");
  ```

  **`handleSubmit`:**
  1. `if (!formData.identifier.trim())` → `toast.warn(tRegion("form.messages.requiredIdentifier"))` + return
  2. `setIsSubmitting(true)`
  3. `try`: call `updateRegionOnClient(formData.id, formData)` if `formData.id` else `createRegionOnClient(formData)`
  4. If `error.data?.error === "MayorReadonly"`: `toast.info(error.data.message)` + return
  5. On success: `toast.success(...)` + `router.push(\`/zoo/regions/${result.id}\`)`
  6. `catch (e: any)`: `toast.error(e.message)`
  7. `finally`: `setIsSubmitting(false)`

  **Layout:**
  ```tsx
  <form onSubmit={handleSubmit}>
    <FormGrid>
      <Column>
        <RegionBasicSection ... />
        <RegionPriceSection ... />
        <RegionTranslationSection dbLanguages={languages} ... />
      </Column>
      <Column>
        <RegionBreedingCenterSection ... />
        <RegionAdmissionsBoothSection ... />
        <RegionBuildingField formKey="adminBuilding" title={adminBuildingTitle} icon="/images/icons/directional_sign.png" ... />
        <RegionBuildingField formKey="visitorCenter" title={tRegion("visitor_center")} icon="/images/icons/visitors.jpg" ... />
        <RegionBuildingField formKey="transportStation" title={tRegion("transport_station")} icon="/images/icons/directional_sign.png" ... />
        <RegionGuestLoungeSection ... />
      </Column>
    </FormGrid>
    <SubmitButton label={isSubmitting ? tCommon("saving") : tRegion("form.save_region")} isSubmitting={isSubmitting} />
  </form>
  ```

- [ ] **Step 2: Run full suite**

  `npx vitest run`

- [ ] **Step 3: Commit**

```bash
git add src/components/pages/zoo/regions/RegionForm.tsx
git commit -m "feat: add RegionForm shell"
```

---

### Task 8: Create + Edit pages

**Files:**
- Create: `src/app/[locale]/zoo/regions/create/page.tsx`
- Create: `src/app/[locale]/zoo/regions/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `getRegionById` from `src/service/RegionService.ts` (already includes all building relations)
- Consumes: `getAllLanguages` from `src/service/LanguageService.ts`
- Consumes: `RegionForm` from `src/components/pages/zoo/regions/RegionForm.tsx`

- [ ] **Step 1: Implement `create/page.tsx`**

  Mirror `animals/create/page.tsx`:
  - `getAllLanguages()` in parallel
  - Auth: `hasMinimumRole(session, "Director") || isMayor(session)` → `redirect(\`/${locale}/zoo/regions\`)`
  - Render `<RegionForm languages={languages} />`
  - `PageHeader` text: `tRegion("form.create_region")`

- [ ] **Step 2: Implement `[id]/edit/page.tsx`**

  Mirror `animals/[id]/edit/page.tsx`:
  - `getRegionById(Number(id), locale)` — `notFound()` if null
  - Auth check → redirect
  - `const serialized = JSON.parse(JSON.stringify(region))` (serializes Date objects)
  - Render `<RegionForm region={serialized} languages={languages} />`
  - `PageHeader` text: `tRegion("form.edit_region")`

- [ ] **Step 3: Build check**

  `npm run build` — confirm `/[locale]/zoo/regions/create` and `/[locale]/zoo/regions/[id]/edit` appear in route table.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/zoo/regions/create/" "src/app/[locale]/zoo/regions/[id]/edit/"
git commit -m "feat: add region create and edit pages"
```

---

### Task 9: Detail page — ActionGroupBadge + delete

**Files:**
- Modify: `src/components/pages/zoo/regions/RegionDetailContent.tsx`

**Interfaces:**
- Consumes: `deleteRegionOnClient` from `src/service/frontend/Region.ts`
- Consumes: `ActionGroupBadge` from `src/components/ui/badges/ActionGroupBadge.tsx`
- Consumes: `confirmDeleteDialog` — find exact import by searching `useAnimalStore.ts` for its import path

- [ ] **Step 1: Update `RegionDetailContent`**

  Add to the `"use client"` component (it already has `region` prop with `id`):
  ```typescript
  const { data: session } = useSession();
  const router = useRouter(); // from "@/i18n/routing"
  const isAdmin = hasMinimumRole(session, "Director") || isMayor(session);
  ```

  Render before `<RegionHeaderCard>`:
  ```tsx
  {isAdmin && (
    <TopBar>
      <ActionGroupBadge
        id={region.id}
        onEdit={() => router.push(`/zoo/regions/${region.id}/edit`)}
        onDelete={async () => {
          const confirmed = await confirmDeleteDialog({
            title: tRegion("form.messages.deleteErrorTitle"),
            text: tRegion("form.messages.confirmDelete"),
            confirmButtonText: tCommon("messages.yes_delete"),
            cancelButtonText: tCommon("messages.cancel"),
          });
          if (!confirmed) return;
          try {
            await deleteRegionOnClient(region.id);
            toast.success(tRegion("form.messages.deleteSuccess"));
            router.push("/zoo/regions");
          } catch (e: any) {
            toast.error(e.message);
          }
        }}
      />
    </TopBar>
  )}
  ```

  Add `TopBar` styled component matching `AnimalDetails.styles.ts` TopBar (or import `* as AnimalStyles` and use `AnimalStyles.TopBar`).

- [ ] **Step 2: Run full suite**

  `npx vitest run` — expect all tests pass

- [ ] **Step 3: Production build**

  `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/zoo/regions/RegionDetailContent.tsx
git commit -m "feat: add edit and delete actions to region detail page"
```
