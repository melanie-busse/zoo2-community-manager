import styled from "styled-components";
import React from "react";

interface FormGridProps {
  children: React.ReactNode;
}
export default function FormGrid({ children }: FormGridProps) {
  return <StyledFormGrid>{children}</StyledFormGrid>;
}

const StyledFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px 0;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 30px;
  }
`;
