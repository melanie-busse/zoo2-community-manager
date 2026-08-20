"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as Styles from "@/components/elements/Filter/Filter.styles";

interface Level20CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Level20Checkbox({ checked, onChange }: Level20CheckboxProps) {
  const t = useTranslations("specialCoat");

  return (
    <Styles.CheckboxLabel>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {t("inventory.level20")}
    </Styles.CheckboxLabel>
  );
}