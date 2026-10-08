import styled from "styled-components";
import React from "react";

interface ColumnProps {
  children: React.ReactNode;
  $fullWidth?: boolean;
}
export default function Column({ children, $fullWidth }: ColumnProps) {
  return <StyledColumn $fullWidth={$fullWidth}>{children}</StyledColumn>;
}

const StyledColumn = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  @media (min-width: 1024px) {
    ${({ $fullWidth }) => $fullWidth && "grid-column: 1 / -1;"}
  }
`;
