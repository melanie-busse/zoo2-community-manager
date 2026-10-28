# Chest Boosts — Design Spec

**Date:** 2026-10-28
**Feature:** `/game/chests` — Verwaltung von Truhen-Boost-Zeiträumen

---

## Übersicht

Neues Feature zur Verwaltung historischer Truhen-Boost-Daten. Jeder Datensatz beschreibt, welches Tier während eines Zeitraums als Boost-Tier in einer Truhenart (Epic, Retro, Legendary) verfügbar war. Daten kommen aus community-gepflegten Wiki-PDFs und werden manuell durch Direktoren eingepflegt.

Zuerst: Epic Truhen (PDF vorhanden). Retro- und Legendäre-Truhen folgen mit identischer Struktur.

---

## Datenmodell

### Prisma-Schema-Erweiterung

```prisma
enum ChestType {
  EPIC
  RETRO
  LEGENDARY
}

model ChestBoost {
  id        Int       @id @default(autoincrement())
  startDate DateTime
  endDate   DateTime
  chestType ChestType
  isEvent   Boolean   @default(false)
  animalId  Int
  animal    Animal    @relation(fields: [animalId], references: [id])

  @@index([animalId])
  @@map("chestboost")
}
```

**Begründung:**
- Einheitliches Model für alle Truhenarten via `ChestType`-Enum
- `isEvent` kennzeichnet kurze Sonder-Events (1-Tages-Boosts wie im PDF)
- Fremdschlüssel auf `Animal` — kein Freitext, kein `*Text`-Model nötig (Tiername ist bereits mehrsprachig via `AnimalText`)
- Kein `year`-Feld nötig — wird aus `startDate` gefiltert

**Animal-Migration:** `Animal` erhält eine neue Relation `chestBoosts ChestBoost[]`.

---

## Navigation

Unter dem bestehenden `game`-NavItem wird ein neues Submenu-Objekt "Truhen" eingefügt (3. Ebene, analog zu Biome/Regionen unter Zoo):

```typescript
// in src/config/navigationData.ts — game.subMenu:
{
  labelKey: "chests",
  subMenu: [
    { labelKey: "chests_overview", href: "/game/chests", requiresAuth: false },
    {
      labelKey: "chests_create",
      href: "/game/chests/create",
      requiresAuth: true,
      minimumRole: "Director",
    },
  ],
}
```

i18n-Keys: `navigation.chests`, `navigation.chests_overview`, `navigation.chests_create` — in allen 6 Locales (de/en/da/nl/es/fr).

---

## Routing

| Pfad | Komponente | Zweck |
|------|-----------|-------|
| `/game/chests` | `page.tsx` (Server) | Übersichtsseite |
| `/game/chests/create` | `page.tsx` (Server) | Erstellformular |
| `/game/chests/[id]/edit` | `page.tsx` (Server) | Bearbeitungsformular |

---

## Service Layer

**Datei:** `src/service/ChestBoostService.ts` (`"use server only"`)

```typescript
getAllChestBoosts(locale: string): Promise<ChestBoostListItem[]>
  // Lädt alle Einträge inkl. Animal (AnimalText für locale, Biome, BiomesText)
  // Sortierung: startDate DESC

getChestBoostById(id: number, locale: string): Promise<ChestBoostDetail | null>

createChestBoost(data: ChestBoostCreateInput): Promise<ChestBoost>

updateChestBoost(id: number, data: ChestBoostUpdateInput): Promise<ChestBoost>

deleteChestBoost(id: number): Promise<void>
```

**ChestBoostListItem** enthält:
- id, startDate, endDate, chestType, isEvent
- animal: { id, name (locale), biome: { id, name (locale) }, identifier (für Bild-URL) }

---

## API Routes

### `src/app/api/chest-boosts/route.ts`
- `GET` — Liste aller Einträge (query: `locale`)
- `POST` — Neuen Eintrag erstellen (requiresAuth, minimumRole: Director)

### `src/app/api/chest-boosts/[id]/route.ts`
- `PUT` — Eintrag aktualisieren (requiresAuth, minimumRole: Director)
- `DELETE` — Eintrag löschen (requiresAuth, minimumRole: Director)

Auth-Pattern: analog zu bestehenden API-Routen (Mayor-readonly-Check, Role-Check).

---

## Frontend

### Übersichtsseite

**Dateistruktur:**
```
src/app/[locale]/game/chests/
  page.tsx                        ← Server Component
  ChestBoostOverviewClient.tsx    ← Client Wrapper (initialisiert Store)

src/components/pages/chestBoosts/
  ChestBoostOverview/
    ChestBoostOverviewContent.tsx ← "use client", Haupt-UI
    ChestBoostOverviewFilter.tsx  ← Filter-UI
    ChestBoostDesktopTable.tsx    ← Desktop-Tabelle
    ChestBoostMobileCard.tsx      ← Mobile-Karten
```

**Filter:**
- Suchfeld: Tiername (Freitext, filtert `animal.name`)
- Truhenart: Select (Alle / Epic / Retro / Legendary)
- Jahr: Select (Alle / 2018–aktuell, aus startDate extrahiert)

**Tabelle (Desktop):**
| Zeitraum | Tier | Truhenart | Aktionen |
|----------|------|-----------|---------|
| 22.10. – 03.12.2026 | 🖼 Grey-Crowned Crane · Savanne | Epic | Edit · Delete |

- Event-Einträge werden mit einem Badge/Tag "Event" markiert
- Sortierung: startDate DESC (neueste zuerst)

### Formular (Create + Edit)

**Datei:** `src/components/pages/chestBoosts/ChestBoostForm.tsx` (`"use client"`)

Felder:
- **Datum von** (`startDate`) — Date-Input
- **Datum bis** (`endDate`) — Date-Input
- **Truhenart** — Select: Epic / Retro / Legendary
- **Tier** — Searchable Select (lädt alle Tiere, clientseitig filterbar nach Name)
- **Event** — Checkbox "Kurzzeit-Event"

Validierung: startDate < endDate, animalId required, chestType required.

### Zustand-Store

**Datei:** `src/store/useChestBoostStore.ts`

State: `allChestBoosts`, `filteredItems`, `searchTerm`, `selectedChestType`, `selectedYear`, `currentPage`, `itemsPerPage`

Pipeline: filter (searchTerm + chestType + year) → sort (startDate DESC) → paginate

---

## i18n

Neue Namespace-Datei: `messages/{locale}/chestBoosts.json` in allen 6 Locales (de/en/da/nl/es/fr).

**Keys (de):**
```json
{
  "title": "Truhen-Boosts",
  "subtitle": "Boosted-Tier-Zeiträume nach Truhenart",
  "filter_chest_type": "Truhenart",
  "filter_all_chest_types": "Alle Truhenarten",
  "filter_year": "Jahr",
  "filter_all_years": "Alle Jahre",
  "chest_type_epic": "Epic-Truhe",
  "chest_type_retro": "Retro-Truhe",
  "chest_type_legendary": "Legendäre Truhe",
  "column_period": "Zeitraum",
  "column_animal": "Tier",
  "column_chest_type": "Truhenart",
  "column_actions": "Aktionen",
  "event_badge": "Event",
  "form_start_date": "Datum von",
  "form_end_date": "Datum bis",
  "form_chest_type": "Truhenart",
  "form_animal": "Tier",
  "form_is_event": "Kurzzeit-Event",
  "form_animal_search": "Tier suchen...",
  "create_title": "Neuen Boost hinzufügen",
  "edit_title": "Boost bearbeiten",
  "delete_confirm": "Diesen Eintrag wirklich löschen?"
}
```

Navigation-Keys werden in `messages/{locale}/navigation.json` ergänzt.

---

## Spec Self-Review

- ✅ Keine Platzhalter / TODOs
- ✅ Kein Widerspruch zwischen Abschnitten
- ✅ Scope: ein zusammenhängendes Feature, ein Plan
- ✅ `ChestType`-Enum deckt alle 3 geplanten Truhenarten ab
- ✅ `isEvent` ermöglicht Filterung/Badge ohne extra Tabelle
- ✅ Kein `*Text`-Model nötig — Tierdaten kommen via bestehende Relationen
- ✅ Animal-Relation muss in `Animal`-Model ergänzt werden (`chestBoosts ChestBoost[]`)
