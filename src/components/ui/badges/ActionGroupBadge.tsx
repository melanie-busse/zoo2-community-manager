"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

import ActionBadge from "@/components/ui/badges/ActionBadge";
import { useAnimalStore } from "@/store/useAnimalStore";

interface ActionGroupIconsProps {
  object: any;
}

export default function ActionGroupBadge({ object }: ActionGroupIconsProps) {
  const t = useTranslations();
  const router = useRouter();

  const setEditingAnimal = useAnimalStore((state) => state.setEditingAnimal);
  const deleteAnimal = useAnimalStore((state) => state.deleteAnimal);

  const handleEditClick = () => {
    setEditingAnimal(object);

    router.push(`/animals/${object.id}/edit`);
  };

  return (
    <ActionGroup onClick={(e) => e.stopPropagation()}>
      <ActionBadge type="edit" onClickAction={handleEditClick} tooltip={t("Buttons.edit")} />
      <ActionBadge
        type="delete"
        onClickAction={() => deleteAnimal(object.id, t)}
        tooltip={t("Buttons.delete")}
      />
    </ActionGroup>
  );
}

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
