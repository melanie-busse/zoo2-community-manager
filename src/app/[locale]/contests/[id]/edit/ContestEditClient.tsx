"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";

import PageHeader from "@/components/page-structure/page/PageHeader";
import ContestForm from "@/components/pages/contests/ContestCreateForm/ContestCreateForm";
import { useContestStore } from "@/store/useContestStore";
import { Contest } from "@/types/contest";
import { Animal } from "@/types/animal";
import { SpecialCoat } from "@/types/specialCoat";

interface ContestEditClientProps {
  contest: Contest;
  statues: Animal[];
  contestSpecialCoats: SpecialCoat[];
}

export default function ContestEditClient({ contest, statues, contestSpecialCoats }: ContestEditClientProps) {
  const t = useTranslations("contest");
  const router = useRouter();
  const { saveContest } = useContestStore();

  const handleUpdate = async (formData: any) => {
    const result = await saveContest({ ...formData, id: contest.id });
    if (result !== false) {
      toast.success(t("contestForm.successUpdated"));
      router.push("/contests");
    } else {
      toast.error(t("contestForm.errorUpdating"));
    }
  };

  const handleCancel = () => {
    router.push("/contests");
  };

  return (
    <>
      <PageHeader text={t("contestForm.editTitle")} />
      <ContestForm
        statues={statues}
        contestSpecialCoats={contestSpecialCoats}
        initialData={contest}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </>
  );
}
