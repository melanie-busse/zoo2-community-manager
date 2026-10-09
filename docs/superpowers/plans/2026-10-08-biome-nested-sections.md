# Biome Nested Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Trog, Wasserstelle, Stalllevel and Spielgeräte sections to BiomeForm (create & edit), extend the service layer, and show Trog+Wasserstelle as a combined card beside the games card on the detail page.

**Architecture:** Extend `getBiomeByIdForEdit` to load nested data; extend `createBiome`/`updateBiome` to delete-and-recreate nested rows in a transaction. BiomeForm gains four new `DynamicRowInput` sections. The detail page wraps `BiomeTroughWaterCard` and `BiomeGameCard` in a side-by-side row.

**Tech Stack:** Next.js App Router, Prisma, Styled Components, `DynamicRowInput`, next-intl

**Spec:** User request in conversation (2026-10-08)

## Global Constraints
- No new npm packages
- Use functional components + Styled Components only (no Tailwind)
- i18n keys must be added to all locale files in `messages/{locale}/biome.json`
- `DynamicRowInput` at `src/components/ui/form/DynamicRowInput.tsx` is the required component for Spielgeräte
- Currency options: `"1"` = Zoodollar, `"2"` = Diamond

## Review Focus
- Games with no texts: submit must not crash; send empty texts array, backend filters
- Trog/Wasserstelle with zero rows: backend must handle empty arrays (delete all, create none)
- Edit round-trip: existing game texts must pre-populate the correct language column
- New games (no DB id): backend must not pass an `id` to `prisma.biomeGame.create`
- Delete-and-recreate: old game rows not in the new list must be deleted; orphaned `BiomeGameText` rows cascade-deleted

---

## Task 1: Extend BiomeService for nested data

**Files:**
- Modify: `src/service/BiomeService.ts`

**Interfaces:**
- `getBiomeByIdForEdit(id)` now includes `troughs`, `waterHoles`, `shelters`, `games { include: { texts: true } }`
- `createBiome(data)` and `updateBiome(id, data)` accept extended payload (see Task 2 types)
- New payload types added inline (no separate file needed)

- [ ] **Step 1: Extend `getBiomeByIdForEdit`**

Add to the `include`:
```ts
troughs: true,
waterHoles: true,
shelters: { orderBy: { level: 'asc' } },
games: { include: { texts: true }, orderBy: { identifier: 'asc' } },
```

- [ ] **Step 2: Extend `createBiome`**

The function receives additional arrays. Inside `prisma.biome.create`, after `biomestext.createMany`, add nested `createMany` for troughs, waterHoles, shelters, and games. For games, use `prisma.biome.create` nested write or sequential creates inside a transaction that maps `texts` with `BiomeGameText.createMany`.

Signature addition:
```ts
troughs: { price: number; pricetype: number; repair: number }[];
waterHoles: { price: number; pricetype: number; repair: number }[];
shelters: { level: number; cost: number; pricetype: number; buildTime: number | null; unlockLevel: number | null }[];
games: { identifier: string; price: number; pricetype: number; repair: number; repairpricetype: number; texts: { languageCode: string; name: string }[] }[];
```

Use `$transaction`. For each game create: `tx.biomeGame.create({ data: { ...gameFields, biomeId, texts: { createMany: { data: game.texts } } } })`.

- [ ] **Step 3: Extend `updateBiome`**

Inside the existing `$transaction`, after updating biomestext:
1. `tx.biomeTrough.deleteMany({ where: { biomeId: id } })` then `tx.biomeTrough.createMany`
2. Same for `tx.biomeWaterHole`
3. `tx.biomeShelter.deleteMany` then `tx.biomeShelter.createMany`
4. For games: `tx.biomeGame.deleteMany({ where: { biomeId: id } })` (texts cascade), then for each game `tx.biomeGame.create` with nested texts

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**
```
git commit -m "feat: extend BiomeService to handle nested trough/waterhole/shelter/game data"
```

---

## Task 2: BiomeForm — state initialisation and submit payload

**Files:**
- Modify: `src/components/pages/zoo/biomes/BiomeForm.tsx`

**Interfaces:**
- Consumes: extended `biome` prop from Task 1 (new nested arrays)
- Produces: extended `data` object sent to `createBiomeOnClient` / `updateBiomeOnClient`

Row type helpers (inline in BiomeForm):
```ts
type TroughRow    = { id: number|string; price: string; pricetype: string; repair: string };
type WaterRow     = TroughRow;
type ShelterRow   = { id: number|string; level: string; cost: string; pricetype: string; buildTime: string; unlockLevel: string };
type GameRow      = { id: number|string; identifier: string; price: string; pricetype: string; repair: string; repairpricetype: string; [key: `text_${string}`]: string };
```

- [ ] **Step 1: Extend `BiomeFormProps.biome`** to include:
```ts
troughs: { id: number; price: number; pricetype: number; repair: number }[];
waterHoles: { id: number; price: number; pricetype: number; repair: number }[];
shelters: { id: number; level: number; cost: number; pricetype: number; buildTime: number | null; unlockLevel: number | null }[];
games: { id: number; identifier: string; price: number; pricetype: number; repair: number; repairpricetype: number; texts: { languageCode: string; name: string }[] }[];
```

- [ ] **Step 2: Add four `useState` initialisers** after the existing `biomestext` state:

```ts
const [troughs, setTroughs] = useState<TroughRow[]>(() =>
  (biome?.troughs ?? []).map(r => ({ id: r.id, price: String(r.price), pricetype: String(r.pricetype), repair: String(r.repair) }))
);
const [waterHoles, setWaterHoles] = useState<WaterRow[]>(() =>
  (biome?.waterHoles ?? []).map(r => ({ id: r.id, price: String(r.price), pricetype: String(r.pricetype), repair: String(r.repair) }))
);
const [shelters, setShelters] = useState<ShelterRow[]>(() =>
  (biome?.shelters ?? []).map(r => ({ id: r.id, level: String(r.level), cost: String(r.cost), pricetype: String(r.pricetype), buildTime: String(r.buildTime ?? ''), unlockLevel: String(r.unlockLevel ?? '') }))
);
const [games, setGames] = useState<GameRow[]>(() =>
  (biome?.games ?? []).map(r => {
    const textMap = new Map(r.texts.map(t => [t.languageCode, t.name]));
    const textCols = Object.fromEntries(languages.map(l => [`text_${l.code}`, textMap.get(l.code) ?? '']));
    return { id: r.id, identifier: r.identifier, price: String(r.price), pricetype: String(r.pricetype), repair: String(r.repair), repairpricetype: String(r.repairpricetype), ...textCols };
  })
);
```

- [ ] **Step 3: Extend `handleSubmit` payload** inside the `data` object:

```ts
troughs: troughs.map(r => ({ price: parseInt(r.price)||0, pricetype: parseInt(r.pricetype)||1, repair: parseInt(r.repair)||0 })),
waterHoles: waterHoles.map(r => ({ price: parseInt(r.price)||0, pricetype: parseInt(r.pricetype)||1, repair: parseInt(r.repair)||0 })),
shelters: shelters.map(r => ({ level: parseInt(r.level)||0, cost: parseInt(r.cost)||0, pricetype: parseInt(r.pricetype)||1, buildTime: r.buildTime !== '' ? parseInt(r.buildTime)||null : null, unlockLevel: r.unlockLevel !== '' ? parseInt(r.unlockLevel)||null : null })),
games: games.map(r => ({ identifier: r.identifier, price: parseInt(r.price)||0, pricetype: parseInt(r.pricetype)||1, repair: parseInt(r.repair)||0, repairpricetype: parseInt(r.repairpricetype)||1, texts: languages.map(l => ({ languageCode: l.code, name: r[`text_${l.code}`] ?? '' })) })),
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**
```
git commit -m "feat: extend BiomeForm state and submit payload for nested data"
```

---

## Task 3: BiomeForm — four DynamicRowInput sections in the JSX

**Files:**
- Modify: `src/components/pages/zoo/biomes/BiomeForm.tsx`

**Interfaces:**
- Consumes: state + setters from Task 2
- Produces: four new `<InfoAccordion>` sections added after the existing two columns

Helper factory (add once, reuse):
```ts
function makeHandlers<T extends { id: number|string }>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  emptyRow: Omit<T, 'id'>
) {
  return {
    onAdd: () => setter(p => [...p, { id: Date.now(), ...emptyRow } as T]),
    onRemove: (id: number|string) => setter(p => p.filter(r => r.id !== id)),
    onChange: (id: number|string, key: string, val: string) =>
      setter(p => p.map(r => r.id === id ? { ...r, [key]: val } : r)),
  };
}
```

- [ ] **Step 1: Add Trog section** — new `<Column>` below the existing two, inside `<FormGrid>`:

```tsx
<Column>
  <InfoAccordion title={t("form.troughs")} icon="/images/icons/info.png" defaultOpen>
    <DynamicRowInput
      rows={troughs}
      columns={[
        { key: 'price',     label: t('price'),    type: 'number',  $flex: 2 },
        { key: 'pricetype', label: t('price_type'), type: 'select', options: currencyOptions },
        { key: 'repair',    label: t('repair'),   type: 'number',  $flex: 2 },
      ]}
      {...makeHandlers(setTroughs, { price: '', pricetype: '1', repair: '' })}
    />
  </InfoAccordion>
</Column>
```

- [ ] **Step 2: Add Wasserstelle section** — same structure as Trog, use `setWaterHoles`, title `t("form.water_holes")`.

- [ ] **Step 3: Add Stalllevel section**:

Columns: `level` (number), `cost` (number), `pricetype` (select), `buildTime` (number, placeholder `t("upgrade_time")`), `unlockLevel` (number, placeholder `t("unlock_level")`).

EmptyRow: `{ level: '', cost: '', pricetype: '1', buildTime: '', unlockLevel: '' }`

- [ ] **Step 4: Add Spielgeräte section** using `DynamicRowInput` with these columns:

```ts
[
  { key: 'identifier',      label: t('identifier'), type: 'text', $flex: 2 },
  { key: 'price',           label: t('price'),      type: 'number' },
  { key: 'pricetype',       label: t('price_type'), type: 'select', options: currencyOptions },
  { key: 'repair',          label: t('repair'),     type: 'number' },
  { key: 'repairpricetype', label: t('repair_price_type'), type: 'select', options: currencyOptions },
  ...languages.map(l => ({ key: `text_${l.code}`, label: l.name, type: 'text' as const })),
]
```

EmptyRow: `{ identifier: '', price: '', pricetype: '1', repair: '', repairpricetype: '1', ...Object.fromEntries(languages.map(l => [`text_${l.code}`, ''])) }`

- [ ] **Step 5: Add i18n keys** to all locale files (`messages/{de,en,da,es,fr,nl}/biome.json`):
  - `"form.troughs"`: `"Tröge"` / `"Troughs"`
  - `"form.water_holes"`: `"Wasserstellen"` / `"Water Holes"`
  - `"form.shelter_levels"`: `"Stalllevel"` / `"Shelter Levels"`
  - `"form.games"`: `"Spielgeräte"` / `"Enrichment Games"`
  - `"repair_price_type"`: `"Rep. Währung"` / `"Repair Currency"`

- [ ] **Step 6: Run tests and TypeScript**

Run: `npx tsc --noEmit && npx vitest run`

- [ ] **Step 7: Commit**
```
git commit -m "feat: add Trog, Wasserstelle, Stalllevel, Spielgeräte sections to BiomeForm"
```

---

## Task 4: Extend edit page to pass nested data

**Files:**
- Modify: `src/service/BiomeService.ts` — `getBiomeByIdForEdit` already done in Task 1
- Modify: `src/app/[locale]/zoo/biomes/[id]/edit/page.tsx` — no change needed (already passes full `biome` object)

> The edit page already does `JSON.parse(JSON.stringify(biome))` and passes it straight to `BiomeForm`. Since Task 1 extended the service query, no page changes are needed.

- [ ] **Step 1: Verify** by checking that `BiomeFormProps.biome` type (Task 2) matches what `getBiomeByIdForEdit` returns.

Run: `npx tsc --noEmit`
Expected: no errors

---

## Task 5: Detail page — BiomeTroughWaterCard + side-by-side layout

**Files:**
- Create: `src/components/pages/zoo/biomes/BiomeTroughWaterCard.tsx`
- Modify: `src/components/pages/zoo/biomes/BiomeDetailContent.tsx`

**Interfaces:**
- `BiomeTroughWaterCard` props: `troughs: { id, price, pricetype, repair }[]`, `waterHoles: { id, price, pricetype, repair }[]`
- Detail page already loads `troughs` and `waterHoles` via `getBiomeById` (extended in previous session)

- [ ] **Step 1: Create `BiomeTroughWaterCard.tsx`**

Two sections inside one `InfoAccordion` (icon: `/images/icons/info.png`, title: `t("trough_and_water")`).

Show each section as a small table with columns: Preis | Reparatur. Use `CurrencyBadge` for values. If array is empty, show `"—"`.

- [ ] **Step 2: Add i18n key** `"trough_and_water"`: `"Trog & Wasserstelle"` / `"Trough & Water Hole"` to all locales.

- [ ] **Step 3: Update `BiomeDetailContent`**

Wrap `BiomeTroughWaterCard` and `BiomeGameCard` in a `SideBySideRow` styled div (`display: flex; gap: spacing(3); align-items: flex-start;`). Each child gets `flex: 1; min-width: 0`.

Show `SideBySideRow` only if either troughs, waterHoles, or games are non-empty. Individual cards render only if their data exists.

Update interface to include `troughs` and `waterHoles` arrays.

- [ ] **Step 4: Run full check**

Run: `npx tsc --noEmit && npx vitest run`

- [ ] **Step 5: Commit**
```
git commit -m "feat: add BiomeTroughWaterCard and side-by-side layout on biome detail page"
```
