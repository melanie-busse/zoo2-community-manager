import styled from "styled-components";
import React from "react";

export function WikiNumberList({ children }: { children: React.ReactNode }) {
  return <NumberList>{children}</NumberList>;
}

const NumberList = styled.ol`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
