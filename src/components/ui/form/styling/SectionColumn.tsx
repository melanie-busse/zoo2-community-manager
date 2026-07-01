import React from "react";
import styled from "styled-components";

interface SectionColumnProps {
  children: React.ReactNode;
}
export default function SectionColumn({ children }: SectionColumnProps) {
  return <StyledSectionColumn>{children}</StyledSectionColumn>;
}

const StyledSectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
  width: 100%;
`;