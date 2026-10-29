import React from "react";
import styled from "styled-components";

export default function WikiIntroText({ children }: { children: React.ReactNode }) {
  return <Text>{children}</Text>;
}

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;
