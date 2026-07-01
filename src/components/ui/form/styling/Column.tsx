import styled from "styled-components";
import React from "react";

interface ColumnProps {
  children: React.ReactNode;
}
export default function Column({ children }: ColumnProps) {
  return <StyledColumn>{children}</StyledColumn>;
}

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
