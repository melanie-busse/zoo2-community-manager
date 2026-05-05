"use client";

import React, { useState } from "react";

import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";

import { Contest } from "@/types/contest";
import { useTheme } from "styled-components";
import ContestOverviewContent from "@/components/pages/Contests/ContestOverview/ContestOverviewContent";

interface ContestOverviewClientProps {
  initialContests: Contest[];
}

export default function ContestOverviewClient({ initialContests }: ContestOverviewClientProps) {
  const theme = useTheme();
  const [contests, setContests] = useState(initialContests || []);
  const router = useRouter();
  const t = useTranslations();

  const handleEdit = (id: string) => {
    const targetPath = `/contests/${id}/edit`;
    router.push(targetPath);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: t("Contest.contestOverview.messages.deleteErrorTitle"),
      text: t("Contest.contestOverview.messages.confirmDelete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.button.confirm,
      cancelButtonColor: theme.button.cancel,
      cancelButtonText: t("Contest.contestOverview.messages.cancelButton"),
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/contests/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success(t("Common.save_changes"));
          // Liste lokal aktualisieren statt neu laden
          setContests((prev) => prev.filter((c) => c.id.toString() !== id));
        }
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Löschen fehlgeschlagen");
      }
    }
  };

  return (
    <ContestOverviewContent
      contests={contests}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}
