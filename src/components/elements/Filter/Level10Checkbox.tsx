"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as Styles from "@/components/elements/Filter/Filter.styles";

interface Level10CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Level10Checkbox({ checked, onChange }: Level10CheckboxProps) {
  const t = useTranslations("specialCoat");

  return (
    <Styles.CheckboxLabel>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {t("inventory.level10")}
    </Styles.CheckboxLabel>
  );
}