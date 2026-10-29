import styled from "styled-components";
import React from "react";

export function WikiBulletList({ children }: { children: React.ReactNode }) {
  return <BulletList>{children}</BulletList>;
}

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
