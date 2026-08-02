"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContestEntryForm from "@/components/pages/Contests/ContestentryForm/ContestEntryForm";
import { submitContestEntries, getContestEntriesForUser } from "@/service/frontend/Contest";
import type { getContestById, getMembers } from "@/service/ContestService";
import type { ColumnDefinition } from "@/components/ui/form/DynamicRowInput";
import type { User } from "@/types/user";

type ContestDetail = NonNullable<Awaited<ReturnType<typeof getContestById>>>;
type MemberRow = Awaited<ReturnType<typeof getMembers>>[number];
type EntryRow = Record<string, string | number> & { id: number | string };

interface ContestEntriesClientProps {
  contest: ContestDetail;
  members: MemberRow[];
}

let rowCounter = 0;

export default function ContestEntriesClient({ contest, members }: ContestEntriesClientProps) {
  const router = useRouter();
  const t = useTranslations("contest");

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [entries, setEntries] = useState<Record<number, EntryRow[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadEntries() {
      if (!selectedMemberId) {
        setEntries({});
        return;
      }

      const existing = await getContestEntriesForUser(contest.id, parseInt(selectedMemberId));

      if (existing.length === 0) {
        setEntries({});
        return;
      }

      const grouped: Record<number, EntryRow[]> = {};
      for (const e of existing) {
        if (!grouped[e.animalId]) grouped[e.animalId] = [];
        grouped[e.animalId].push({ id: e.id, level: e.level, count: e.count });
      }
      setEntries(grouped);
    }

    loadEntries();
  }, [selectedMemberId, contest.id]);

  const columns: ColumnDefinition[] = [
    { key: "level", label: t("contestOverview.entry.level"), type: "number", placeholder: "1" },
    { key: "count", label: t("contestOverview.entry.count"), type: "number", placeholder: "0" },
  ];

  const mappedMembers: User[] = members.map((m) => ({
    id: m.id,
    name: m.name ?? "",
    upjersname: m.upjersname ?? undefined,
  }));

  const handlers = {
    addRow: (animalId: number) => {
      setEntries((prev) => ({
        ...prev,
        [animalId]: [...(prev[animalId] ?? []), { id: ++rowCounter, level: "", count: "" }],
      }));
    },
    removeRow: (animalId: number, rowId: number | string) => {
      setEntries((prev) => ({
        ...prev,
        [animalId]: (prev[animalId] ?? []).filter((r) => r.id !== rowId),
      }));
    },
    handleRowChange: (animalId: number, rowId: number | string, key: string, value: string) => {
      setEntries((prev) => ({
        ...prev,
        [animalId]: (prev[animalId] ?? []).map((r) =>
          r.id === rowId ? { ...r, [key]: value } : r,
        ),
      }));
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    const flatEntries = Object.entries(entries).flatMap(([animalId, rows]) =>
      rows
        .filter((r) => r.level !== "" && r.count !== "")
        .map((r) => ({
          animalId: parseInt(animalId),
          level: parseInt(String(r.level)),
          count: parseInt(String(r.count)),
        })),
    );

    if (flatEntries.length === 0) return;

    setIsSubmitting(true);
    try {
      await submitContestEntries(contest.id, parseInt(selectedMemberId), flatEntries);
      router.push(`/contests/${contest.id}`);
    } catch {
      // error is shown implicitly; could add toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <ContestEntryForm
        contest={contest}
        members={mappedMembers}
        selectedMemberId={selectedMemberId}
        onMemberChange={setSelectedMemberId}
        entries={entries}
        columns={columns}
        handlers={handlers}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </PageWrapper>
  );
}