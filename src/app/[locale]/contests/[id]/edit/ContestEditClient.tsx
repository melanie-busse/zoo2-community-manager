"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ContestForm from "@/components/pages/Contests/ContestCreateForm/ContestCreateForm";

export default function ContestEditClient({ contest, statues }: any) {
  const t = useTranslations("Contest.contestForm");
  const router = useRouter();

  const handleUpdate = async (formData: any) => {
    try {
      const res = await fetch(`/api/contests/${contest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(t("successUpdated"));
        router.push("/contests");
        router.refresh(); // Wichtig, damit die Tabelle die neuen Daten lädt
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || t("errorUpdating"));
      }
    } catch (err) {
      toast.error(t("networkError"));
    }
  };

  return (
    <>
      <PageHeader text={t("editTitle")} />
      <ContestForm statues={statues} initialData={contest} onSubmit={handleUpdate} />
    </>
  );
}
