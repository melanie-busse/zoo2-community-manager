import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import ActionBadge from "@/components/ui/badges/ActionBadge";

interface ActionGroupIconsProps {
  object: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
export default function ActionGroupBadge({ object, onEdit, onDelete }: ActionGroupIconsProps) {
  const t = useTranslations();

  return (
    <ActionGroup>
      <ActionBadge
        type="edit"
        onClickAction={() => onEdit(object.id.toString())}
        tooltip={t("Buttons.edit")}
      />
      <ActionBadge
        type="delete"
        onClickAction={() => onDelete(object.id.toString())}
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
