"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";

interface CardContainerProps {
  children: ReactNode;
  onClick?: () => void; // 💡 Macht den onClick-Handler als Prop verfügbar
}

export default function CardContainer({ children, onClick }: CardContainerProps) {
  return (
    <StyledCardContainer onClick={onClick} $isClickable={!!onClick}>
      {children}
    </StyledCardContainer>
  );
}

const StyledCardContainer = styled.div<{ $isClickable: boolean }>`
  background: ${({ theme }) => theme.colors.ui.white};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  width: 80vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;

  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    ${({ $isClickable }) =>
      $isClickable && "transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);"}
  }
`;
