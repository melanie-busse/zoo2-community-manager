# Permissions & Rules

## Rollenhierarchie

`Mayor (0) > Admin (1) > Director (2) > Employee (3) > Member (4) > Visitor (5)`

*(niedrigere Zahl = mehr Rechte)*

---

## Visitor (nicht eingeloggt oder Rolle "Visitor")

| Bereich | Sehen | Speichern |
|---|---|---|
| Startseite | ✅ | – |
| Zoo-Statistik | ✅ | – |
| Tierübersicht & Detailseite | ✅ | – |
| Farbvariantenübersicht & Detailseite | ✅ | – |
| Wettbewerbsübersicht | ✅ (kein Link zur Detailseite) | – |
| Wettbewerbsdetailseite | ❌ | ❌ |
| Tiere eintragen | ❌ | ❌ |
| Inventar | ❌ | ❌ |
| Admin-Bereich | ❌ | ❌ |

---

## Member

| Bereich | Sehen | Speichern |
|---|---|---|
| Alles vom Visitor | ✅ | – |
| Wettbewerbsdetailseite | ✅ | – |
| Tiere eintragen (Wettbewerb) | ✅ | ✅ |
| Inventar | ✅ | – |
| Tier anlegen / editieren / löschen | ❌ | ❌ |
| Farbvariante anlegen / editieren / löschen | ❌ | ❌ |
| Wettbewerb anlegen / editieren / löschen | ❌ | ❌ |
| Admin-Bereich | ❌ | ❌ |

---

## Employee

| Bereich | Sehen | Speichern |
|---|---|---|
| Alles vom Member | ✅ | ✅ |
| Wettbewerb anlegen | ✅ | ✅ |
| Wettbewerb editieren / löschen | ✅ (Icons sichtbar) | ✅ |
| Tier anlegen / editieren / löschen | ❌ | ❌ |
| Farbvariante anlegen / editieren / löschen | ❌ | ❌ |
| Admin-Bereich | ❌ | ❌ |

---

## Director

| Bereich | Sehen | Speichern |
|---|---|---|
| Alles vom Employee | ✅ | ✅ |
| Tier anlegen | ✅ | ✅ |
| Tier editieren / löschen | ✅ (Icons sichtbar) | ✅ |
| Farbvariante anlegen | ✅ | ✅ |
| Farbvariante editieren / löschen | ✅ (Icons sichtbar) | ✅ |
| Admin-Bereich (Tiere importieren) | ✅ | ✅ |

---

## Mayor *(Demo-Account, read-only)*

| Bereich | Sehen | Speichern |
|---|---|---|
| Alles (Navigation komplett sichtbar) | ✅ | – |
| Admin-Bereich | ✅ | ❌ Toast |
| Tier / Farbvariante anlegen, editieren, löschen | ✅ (Icons sichtbar) | ❌ Toast |
| Wettbewerb anlegen, editieren, löschen | ✅ (Icons sichtbar) | ❌ Toast |
| Tiere eintragen (Wettbewerb) | ✅ | ❌ Toast |
| Tiere importieren (Admin) | ✅ (Tabelle sichtbar) | ❌ Toast |

> Bei allen Schreibversuchen erscheint ein Info-Toast: *"Als Mayor-Account können keine Änderungen gespeichert werden."*
