"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";

interface ContentWrapperProps {
  children: ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  return <StyledContentWrapper>{children}</StyledContentWrapper>;
}

const StyledContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
