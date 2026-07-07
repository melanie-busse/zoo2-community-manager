"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import ActionBadge from "@/components/ui/badges/ActionBadge";

interface ActionGroupIconsProps {
  id: number | string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionGroupBadge({ id, onEdit, onDelete }: ActionGroupIconsProps) {
  const t = useTranslations();

  return (
    <ActionGroup onClick={(e) => e.stopPropagation()}>
      <ActionBadge type="edit" onClickAction={onEdit} tooltip={t("Buttons.edit")} />
      <ActionBadge type="delete" onClickAction={onDelete} tooltip={t("Buttons.delete")} />
    </ActionGroup>
  );
}

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
