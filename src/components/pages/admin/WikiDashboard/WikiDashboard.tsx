"use client";

import React, { useEffect, useState } from "react";

import * as Styles from "./WikiDashboard.styles";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import Table from "@/components/page-structure/Table/Table";
import StatsBar from "@/components/page-structure/Elements/StatsBar";
import ActionBadge from "@/components/ui/badges/ActionBadge";

const LS_KEY = "wiki_synced_animals";

function getSyncedTitles(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function addSyncedTitle(title: string) {
  try {
    const current = getSyncedTitles();
    current.add(title);
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(current)));
  } catch {}
}

function clearSyncedTitles() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}

interface AnimalStatus {
  title: string;
  status: "imported" | "missing";
}

interface Summary {
  total: number;
  imported: number;
  missing: number;
}

type ActionState = "idle" | "loading" | "success" | "error";

export default function WikiDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [animals, setAnimals] = useState<AnimalStatus[]>([]);
  const [filter, setFilter] = useState<"all" | "missing" | "imported" | "needs_update">("all");
  const [importingMap, setImportingMap] = useState<Record<string, ActionState>>({});
  const [updatingMap, setUpdatingMap] = useState<Record<string, ActionState>>({});
  const [syncedTitles, setSyncedTitles] = useState<Set<string>>(() => getSyncedTitles());

  const loadStatus = async () => {
    setLoading(true);
    clearSyncedTitles();
    setSyncedTitles(new Set());
    try {
      const res = await fetch("/api/admin/import-animals/status");
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        setAnimals(data.animals);
        setImportingMap({});
        setUpdatingMap({});
      }
    } catch (err) {
      console.error("Fehler beim Laden des Status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/admin/import-animals/status");
        const data = await res.json();
        if (res.ok && isMounted) {
          setSummary(data.summary);
          setAnimals(data.animals);
        }
      } catch (err) {
        console.error("Fehler beim initialen Laden:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSingleImport = async (title: string) => {
    setImportingMap((prev) => ({ ...prev, [title]: "loading" }));
    try {
      const res = await fetch("/api/admin/import-animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageTitle: title }),
      });

      if (res.ok) {
        setImportingMap((prev) => ({ ...prev, [title]: "success" }));
        setAnimals((prev) =>
          prev.map((a) => (a.title === title ? { ...a, status: "imported" } : a)),
        );
        if (summary) {
          setSummary({ ...summary, imported: summary.imported + 1, missing: summary.missing - 1 });
        }
      } else {
        setImportingMap((prev) => ({ ...prev, [title]: "error" }));
        alert(`Fehler beim Import von ${title}`);
      }
    } catch (err) {
      console.error(err);
      setImportingMap((prev) => ({ ...prev, [title]: "error" }));
    }
  };

  const handleSingleUpdate = async (title: string) => {
    setUpdatingMap((prev) => ({ ...prev, [title]: "loading" }));
    try {
      const res = await fetch("/api/admin/import-animals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageTitle: title }),
      });

      if (res.ok) {
        setUpdatingMap((prev) => ({ ...prev, [title]: "success" }));
        addSyncedTitle(title);
        setSyncedTitles((prev) => new Set([...prev, title]));
      } else {
        setUpdatingMap((prev) => ({ ...prev, [title]: "error" }));
        alert(`Fehler beim Aktualisieren von ${title}`);
      }
    } catch (err) {
      console.error(err);
      setUpdatingMap((prev) => ({ ...prev, [title]: "error" }));
    }
  };

  const filteredAnimals = animals.filter((a) => {
    if (filter === "missing") return a.status === "missing";

    const isSynced = syncedTitles.has(a.title) || updatingMap[a.title] === "success";

    if (filter === "needs_update") {
      // Nur importierte Tiere, die noch NICHT aktualisiert wurden
      return a.status === "imported" && !isSynced;
    }

    if (filter === "imported") {
      // "In DB" zeigt weiterhin stur alle importierten Tiere an (egal ob aktualisiert oder nicht)
      return a.status === "imported";
    }

    return true; // "all"
  });

  const data = [
    {
      number: summary?.total ?? 0,
      label: "Im Wiki Gesamt",
    },
    {
      number: summary?.imported ?? 0,
      label: "In deiner DB",
    },
    {
      number: summary?.missing ?? 0,
      label: "Fehlende Tiere",
    },
  ];

  if (loading)
    return (
      <PageWrapper>
        <p>Lade Daten und vergleiche mit MariaDB...</p>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <PageHeader text={"Zoo 2 Fandom Manager"} />

      {summary && <StatsBar data={data} />}

      <Styles.FilterBar>
        <Styles.FilterButton $active={filter === "all"} onClick={() => setFilter("all")}>
          Alle
        </Styles.FilterButton>

        <Styles.FilterButton $active={filter === "missing"} onClick={() => setFilter("missing")}>
          Fehlend
        </Styles.FilterButton>

        <Styles.FilterButton $active={filter === "imported"} onClick={() => setFilter("imported")}>
          In DB
        </Styles.FilterButton>

        <Styles.FilterButton
          $active={filter === "needs_update"}
          onClick={() => setFilter("needs_update")}
        >
          Update ausstehend
        </Styles.FilterButton>
      </Styles.FilterBar>

      <Table>
        <thead>
          <tr>
            <Styles.Th>Tiername (Wiki)</Styles.Th>
            <Styles.Th>Status</Styles.Th>
            <Styles.Th style={{ textAlign: "right" }}>Aktion</Styles.Th>
          </tr>
        </thead>
        <tbody>
          {filteredAnimals.map((animal) => {
            const importState = importingMap[animal.title] || "idle";
            const updateState = updatingMap[animal.title] || "idle";
            const isSynced = syncedTitles.has(animal.title);

            return (
              <tr key={animal.title}>
                <Styles.Td style={{ fontWeight: 600 }}>{animal.title}</Styles.Td>
                <Styles.Td>
                  {animal.status === "missing" ? (
                    <Styles.StatusBadge $status="missing">Fehlt in DB</Styles.StatusBadge>
                  ) : isSynced || updateState === "success" ? (
                    <Styles.StatusBadge2 $status="updated">Aktualisiert</Styles.StatusBadge2>
                  ) : (
                    <Styles.StatusBadge $status="imported">Synchronisiert</Styles.StatusBadge>
                  )}
                </Styles.Td>
                <Styles.Td style={{ textAlign: "right" }}>
                  {animal.status === "missing" ? (
                    <ActionBadge
                      type="import"
                      onClickAction={() => handleSingleImport(animal.title)}
                      tooltip="Importieren"
                      disabled={importState === "loading"}
                    />
                  ) : isSynced && updateState === "idle" ? (
                    <ActionBadge
                      type="sync"
                      onClickAction={() => handleSingleUpdate(animal.title)}
                      tooltip="Erneut synchronisieren"
                    />
                  ) : (
                    <ActionBadge
                      type="update"
                      onClickAction={() => handleSingleUpdate(animal.title)}
                      tooltip="Aktualisieren"
                      disabled={updateState === "loading" || updateState === "success"}
                    />
                  )}
                </Styles.Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </PageWrapper>
  );
}
