"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import PageHeader from "@/components/page-structure/page/PageHeader";
import ContestForm from "@/components/pages/Contests/ContestCreateForm/ContestCreateForm";
import { Statue } from "@/types/statue";

interface ContestCreateClientProps {
  statues: Statue[];
}

export default function ContestCreateClient({ statues }: ContestCreateClientProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleCreate = async (formData: any) => {
    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(t("Contest.contestForm.successCreated"));
        router.push("/contests");
        router.refresh();
      } else {
        toast.error(t("Contest.contestForm.errorCreating"));
      }
    } catch (error) {
      toast.error(t("Contest.contestForm.errorCreating"));
    }
  };

  return (
    <>
      <PageHeader text={t("Contest.contestForm.createTitle")} />
      <ContestForm statues={statues} onSubmit={handleCreate} />
    </>
  );
}
