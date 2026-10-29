import React from "react";
import styled from "styled-components";

export default function WikiAccordionContentWrapper({ children }: { children: React.ReactNode }) {
  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`;
