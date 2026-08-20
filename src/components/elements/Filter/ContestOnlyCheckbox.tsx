"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as Styles from "@/components/elements/Filter/Filter.styles";

interface ContestOnlyCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ContestOnlyCheckbox({ checked, onChange }: ContestOnlyCheckboxProps) {
  const t = useTranslations("common");

  return (
    <Styles.CheckboxLabel>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {t("filter.contest_only")}
    </Styles.CheckboxLabel>
  );
}