"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as Styles from "@/components/elements/Filter/Filter.styles";

interface StatueCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function StatueCheckbox({ checked, onChange }: StatueCheckboxProps) {
  const t = useTranslations("common");

  return (
    <Styles.CheckboxLabel>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {t("filter.has_statue")}
    </Styles.CheckboxLabel>
  );
}