import styled from "styled-components";
import React from "react";

export default function CardStatsRow({ children }: { children: React.ReactNode }) {
  return <StatsRow>{children}</StatsRow>;
}

export const StatsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
