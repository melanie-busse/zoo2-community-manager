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
  const t = useTranslations("common");

  return (
    <ActionGroup onClick={(e) => e.stopPropagation()}>
      <ActionBadge type="edit" onClickAction={onEdit} tooltip={t("buttons.edit")} />
      <ActionBadge type="delete" onClickAction={onDelete} tooltip={t("buttons.delete")} />
    </ActionGroup>
  );
}

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
