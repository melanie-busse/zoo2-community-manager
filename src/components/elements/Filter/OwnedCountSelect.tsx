"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

interface OwnedCountSelectProps {
  value: number | null;
  onChange: (count: number | null) => void;
}

export function OwnedCountSelect({ value, onChange }: OwnedCountSelectProps) {
  const tCommon = useTranslations("common");

  const options = [
    { value: "all", label: tCommon("filter.all_owned_counts") },
    { value: "0", label: tCommon("filter.owned_count_0") },
    { value: "1", label: tCommon("filter.owned_count_1") },
    { value: "2", label: tCommon("filter.owned_count_2") },
  ];

  return (
    <Select
      value={value !== null ? String(value) : "all"}
      onChange={(e) => onChange(e.target.value === "all" ? null : Number(e.target.value))}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  padding: 0 16px;
  height: 48px;
  border: 2px solid ${({ theme }) => theme.colors.system.honeydew};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.ui.white};
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.text};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[100]};
  }
`;