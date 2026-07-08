import styled from "styled-components";
import React from "react";

interface FooterSectionProps {
  children: React.ReactNode;
}

export default function FooterSection({ children }: FooterSectionProps) {
  return <StyledFooterSection>{children}</StyledFooterSection>;
}

export const StyledFooterSection = styled.div`
  margin-top: 30px;
  padding: 20px 0;
  border-top: 1px solid #e0ecd0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
