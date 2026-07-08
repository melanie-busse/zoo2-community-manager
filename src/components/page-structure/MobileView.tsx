"use client";

import React from "react";
import styled from "styled-components";

export default function MobileView({ children }: { children: React.ReactNode }) {
  return <StyledMobileView>{children}</StyledMobileView>;
}

const StyledMobileView = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => {
      const mobileBreakpoint = theme.breakpoints?.mobile || 768;
      return typeof mobileBreakpoint === "number" ? `${mobileBreakpoint}px` : mobileBreakpoint;
    }}) {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 10px;
    align-items: center;
  }
`;
