"use client";

import React, { useEffect, useState } from "react";

import * as Styles from "./WikiDashboard.styles";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import Table from "@/components/page-structure/Table/Table";

interface AnimalStatus {
  title: string;
  status: "imported" | "missing";
}

interface Summary {
  total: number;
  imported: number;
  missing: number;
}

export default function WikiDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [animals, setAnimals] = useState<AnimalStatus[]>([]);
  const [filter, setFilter] = useState<"all" | "missing" | "imported">("all");
  const [importingMap, setImportingMap] = useState<Record<string, "idle" | "loading" | "success">>(
    {},
  );

  const loadStatus = async () => {
    try {
      const res = await fetch("../../../api/admin/import-animals/status");
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        setAnimals(data.animals);
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
        body: JSON.stringify({ pageTitle: title, originIdsFromOverview: [] }),
      });

      if (res.ok) {
        setImportingMap((prev) => ({ ...prev, [title]: "success" }));
        setAnimals((prev) =>
          prev.map((a) => (a.title === title ? { ...a, status: "imported" } : a)),
        );

        if (summary) {
          setSummary({
            ...summary,
            imported: summary.imported + 1,
            missing: summary.missing - 1,
          });
        }
      } else {
        setImportingMap((prev) => ({ ...prev, [title]: "idle" }));
        alert(`Fehler beim Import von ${title}`);
      }
    } catch (err) {
      console.error(err);
      setImportingMap((prev) => ({ ...prev, [title]: "idle" }));
    }
  };

  const filteredAnimals = animals.filter((a) => {
    if (filter === "missing") return a.status === "missing";
    if (filter === "imported") return a.status === "imported";
    return true;
  });

  if (loading)
    return (
      <PageWrapper>
        <p>Lade Daten und vergleiche mit MariaDB...</p>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <PageHeader text={"Zoo 2 Fandom Manager"} />
      <Styles.RefreshButton onClick={loadStatus}>Neu laden</Styles.RefreshButton>

      {summary && (
        <Styles.StatsGrid>
          <Styles.StatCard $color="#0070f3">
            <Styles.StatLabel>Im Wiki Gesamt</Styles.StatLabel>
            <Styles.StatValue>{summary.total}</Styles.StatValue>
          </Styles.StatCard>
          <Styles.StatCard $color="#137333">
            <Styles.StatLabel>In deiner DB</Styles.StatLabel>
            <Styles.StatValue>{summary.imported}</Styles.StatValue>
          </Styles.StatCard>
          <Styles.StatCard $color="#c5221f">
            <Styles.StatLabel>Fehlende Tiere</Styles.StatLabel>
            <Styles.StatValue>{summary.missing}</Styles.StatValue>
          </Styles.StatCard>
        </Styles.StatsGrid>
      )}

      <Styles.FilterBar>
        <Styles.FilterButton $active={filter === "all"} onClick={() => setFilter("all")}>
          Alle ({animals.length})
        </Styles.FilterButton>
        <Styles.FilterButton $active={filter === "missing"} onClick={() => setFilter("missing")}>
          Fehlend ({summary?.missing || 0})
        </Styles.FilterButton>
        <Styles.FilterButton $active={filter === "imported"} onClick={() => setFilter("imported")}>
          Importiert ({summary?.imported || 0})
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
            const currentImportStatus = importingMap[animal.title] || "idle";
            return (
              <tr key={animal.title}>
                <Styles.Td style={{ fontWeight: 600 }}>{animal.title}</Styles.Td>
                <Styles.Td>
                  <Styles.StatusBadge $status={animal.status}>
                    {animal.status === "imported" ? "Synchronisiert" : "Fehlt in DB"}
                  </Styles.StatusBadge>
                </Styles.Td>
                <Styles.Td style={{ textAlign: "right" }}>
                  {animal.status === "missing" ? (
                    <Styles.ActionButton
                      onClick={() => handleSingleImport(animal.title)}
                      disabled={currentImportStatus === "loading"}
                    >
                      {currentImportStatus === "loading" ? "Importiert..." : "Importieren"}
                    </Styles.ActionButton>
                  ) : (
                    <Styles.ActionButton $success disabled>
                      ✓ Bereit
                    </Styles.ActionButton>
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
