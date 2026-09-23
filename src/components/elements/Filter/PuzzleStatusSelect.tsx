"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

interface PuzzleStatusSelectProps {
  value: "complete" | "incomplete" | null;
  onChange: (value: "complete" | "incomplete" | null) => void;
}

export function PuzzleStatusSelect({ value, onChange }: PuzzleStatusSelectProps) {
  const tCommon = useTranslations("common");

  return (
    <Select
      value={value ?? "all"}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "all" ? null : (val as "complete" | "incomplete"));
      }}
    >
      <option value="all">{tCommon("filter.all_puzzle_status")}</option>
      <option value="complete">{tCommon("filter.puzzle_complete")}</option>
      <option value="incomplete">{tCommon("filter.puzzle_incomplete")}</option>
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