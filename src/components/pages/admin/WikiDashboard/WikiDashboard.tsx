"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./WikiDashboard.styles";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import Table from "@/components/page-structure/Table/Table";
import StatsBar from "@/components/page-structure/Elements/StatsBar";
import ActionBadge from "@/components/ui/badges/ActionBadge";
import { TableCellRight, TableHeaderRight } from "@/components/page-structure/Table/Table.styles";
import WikiDashboardFilterBar from "@/components/elements/Filter/WikiDashboardFilterBar";

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
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [animals, setAnimals] = useState<AnimalStatus[]>([]);
  const [filter, setFilter] = useState<"all" | "missing" | "imported" | "needs_update">("all");
  const [importingMap, setImportingMap] = useState<Record<string, ActionState>>({});
  const [updatingMap, setUpdatingMap] = useState<Record<string, ActionState>>({});
  const [syncedTitles, setSyncedTitles] = useState<Set<string>>(() => getSyncedTitles());

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
        console.error("Error during initial loading:", err);
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
        alert(t("error_import", { title }));
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
        alert(t("error_update", { title }));
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
      return a.status === "imported" && !isSynced;
    }

    if (filter === "imported") {
      return a.status === "imported";
    }

    return true; // "all"
  });

  const data = [
    {
      number: summary?.total ?? 0,
      label: t("stats_total"),
    },
    {
      number: summary?.imported ?? 0,
      label: t("stats_in_db"),
    },
    {
      number: summary?.missing ?? 0,
      label: t("stats_missing"),
    },
  ];

  if (loading)
    return (
      <PageWrapper>
        <p>{t("loading")}</p>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <PageHeader text={t("title")} />

      {summary && <StatsBar data={data} />}

      <WikiDashboardFilterBar filter={filter} onFilterChange={setFilter} />

      <Table>
        <thead>
          <tr>
            <th>{t("table_animal_name")}</th>
            <th>{t("table_status")}</th>
            <TableHeaderRight>{t("table_action")}</TableHeaderRight>
          </tr>
        </thead>
        <tbody>
          {filteredAnimals.map((animal) => {
            const importState = importingMap[animal.title] || "idle";
            const updateState = updatingMap[animal.title] || "idle";
            const isSynced = syncedTitles.has(animal.title);

            return (
              <tr key={animal.title}>
                <td style={{ fontWeight: 600 }}>{animal.title}</td>
                <td>
                  {animal.status === "missing" ? (
                    <Styles.StatusBadge $status="missing">{t("status_missing")}</Styles.StatusBadge>
                  ) : isSynced || updateState === "success" ? (
                    <Styles.StatusBadge2 $status="updated">
                      {t("status_updated")}
                    </Styles.StatusBadge2>
                  ) : (
                    <Styles.StatusBadge $status="imported">{t("status_synced")}</Styles.StatusBadge>
                  )}
                </td>
                <TableCellRight>
                  {animal.status === "missing" ? (
                    <ActionBadge
                      type="import"
                      onClickAction={() => handleSingleImport(animal.title)}
                      tooltip={t("tooltip_import")}
                      disabled={importState === "loading"}
                    />
                  ) : isSynced && updateState === "idle" ? (
                    <ActionBadge
                      type="sync"
                      onClickAction={() => handleSingleUpdate(animal.title)}
                      tooltip={t("tooltip_resync")}
                    />
                  ) : (
                    <ActionBadge
                      type="update"
                      onClickAction={() => handleSingleUpdate(animal.title)}
                      tooltip={t("tooltip_update")}
                      disabled={updateState === "loading" || updateState === "success"}
                    />
                  )}
                </TableCellRight>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </PageWrapper>
  );
}
