"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as Styles from "@/components/elements/Filter/Filter.styles";

interface GlitterCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function GlitterCheckbox({ checked, onChange }: GlitterCheckboxProps) {
  const t = useTranslations("specialCoat");

  return (
    <Styles.CheckboxLabel>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {t("inventory.glitter_animal")}
    </Styles.CheckboxLabel>
  );
}