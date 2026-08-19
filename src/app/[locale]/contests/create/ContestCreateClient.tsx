"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";

import PageHeader from "@/components/page-structure/page/PageHeader";
import ContestForm from "@/components/pages/Contests/ContestCreateForm/ContestCreateForm";
import { useContestStore } from "@/store/useContestStore";
import { Animal } from "@/types/animal";
import { SpecialCoat } from "@/types/specialCoat";

interface ContestCreateClientProps {
  statues: Animal[];
  contestSpecialCoats: SpecialCoat[];
}

export default function ContestCreateClient({ statues, contestSpecialCoats }: ContestCreateClientProps) {
  const t = useTranslations("contest");
  const router = useRouter();
  const { saveContest } = useContestStore();

  const handleCreate = async (formData: any) => {
    const result = await saveContest(formData);
    if (result !== false) {
      toast.success(t("contestForm.successCreated"));
      router.push("/contests");
    } else {
      toast.error(t("contestForm.errorCreating"));
    }
  };

  return (
    <>
      <PageHeader text={t("contestForm.createTitle")} />
      <ContestForm statues={statues} contestSpecialCoats={contestSpecialCoats} onSubmit={handleCreate} />
    </>
  );
}
