"use client";

import React from "react";
import NextImage from "next/image";
import * as Styles from "./Badge.styles";
import Tooltip from "@/components/ui/tooltip/Tooltip";

export type ActionBadgeType = "edit" | "delete" | "add" | "view" | "import" | "update" | "sync";

interface ActionBadgeProps {
  type: ActionBadgeType;
  tooltip?: string;
  align?: "left" | "right" | "center";
  altText?: string;
  onClickAction: () => void;
  size?: number;
  disabled?: boolean;
}

const ACTION_CONFIG = {
  edit: { src: "/images/icons/edit.webp", defaultAlt: "Edit" },
  delete: { src: "/images/icons/trash.webp", defaultAlt: "Delete" },
  add: { src: "/images/icons/add.webp", defaultAlt: "Add" },
  view: { src: "/images/icons/view.webp", defaultAlt: "View" },
  import: { src: "/images/icons/database_import.png", defaultAlt: "Import" },
  update: { src: "/images/icons/database_update.png", defaultAlt: "Update" },
  sync: { src: "/images/icons/sync.png", defaultAlt: "Sync" },
};

export default function ActionBadge({
  type,
  tooltip,
  align,
  altText,
  onClickAction,
  size = 24,
  ...props
}: ActionBadgeProps) {
  const config = ACTION_CONFIG[type];

  return (
    <Tooltip text={tooltip} align={align}>
      <Styles.Button onClick={onClickAction} {...props} type="button">
        <NextImage src={config.src} alt={altText || config.defaultAlt} width={size} height={size} />
      </Styles.Button>
    </Tooltip>
  );
}
