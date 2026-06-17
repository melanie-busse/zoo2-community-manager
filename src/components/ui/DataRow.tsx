"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";

interface DataRowProps {
  label?: string;
  children: ReactNode;
  border?: boolean;
}

export default function DataRow({ label, children, border = true }: DataRowProps) {
  return (
    <StyledRow $hasBorder={border}>
      {label && <Label>{label}</Label>}
      <Content $hasLabel={!!label}>{children}</Content>
    </StyledRow>
  );
}

// --- Styled Components ---
interface StyledRowProps {
  $hasBorder: boolean;
}

const StyledRow = styled.div<StyledRowProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  gap: 12px;
  border-bottom: ${(props) => (props.$hasBorder ? "1px solid #f5f5f5" : "none")};

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
`;

interface ContentProps {
  $hasLabel: boolean;
}

const Content = styled.div<ContentProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$hasLabel ? "flex-end" : "flex-start")};
  flex-grow: 1;
  gap: 8px;
`;
