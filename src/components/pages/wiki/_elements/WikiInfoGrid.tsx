import React from "react";
import styled from "styled-components";

export default function WikiInfoGrid({ children }: { children: React.ReactNode }) {
  return <Grid>{children}</Grid>;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 8px 0;
`;
