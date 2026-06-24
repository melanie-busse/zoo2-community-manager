"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
// 🎯 WICHTIG: Router von next-intl importieren, damit /de/ oder /en/ automatisch mitgenommen wird!
import { useRouter } from "@/i18n/routing";

import ActionBadge from "@/components/ui/badges/ActionBadge";
import { useAnimalStore } from "@/store/useAnimalStore";
import { Animal } from "@/types/animal";

interface ActionGroupIconsProps {
  object: Animal;
}

export default function ActionGroupBadge({ object }: ActionGroupIconsProps) {
  const t = useTranslations();
  const router = useRouter();

  const setEditingAnimal = useAnimalStore((state) => state.setEditingAnimal);
  const deleteAnimal = useAnimalStore((state) => state.deleteAnimal);

  const handleEditClick = () => {
    // 1. Tier im globalen Store für das Formular bereitstellen
    setEditingAnimal(object);

    // 2. 🎯 Jetzt den User auch wirklich auf die Edit-Seite schicken!
    // next-intl macht daraus automatisch z.B. "/de/animals/103/edit"
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
