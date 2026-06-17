"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";

interface CardContainerProps {
  children: ReactNode;
}

export default function CardContainer({ children }: CardContainerProps) {
  return <StyledCardContainer>{children}</StyledCardContainer>;
}

const StyledCardContainer = styled.div`
  background: #fdfdfd;
  border: 1.5px solid ${({ theme }) => theme.colors.ui.pageBg};
  border-radius: var(--border-radius);
  padding: 24px;
  display: flex;
  gap: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 15px;
    gap: 15px;
    width: 100%;
    border-radius: var(--border-radius);
  }
`;
