import styled from "styled-components";
import React from "react";

export default function FilterCard({ children }: { children: React.ReactNode }) {
  return <FilterBar>{children}</FilterBar>;
}

export const FilterRow = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 100;

  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  padding: 20px;
  margin-bottom: 25px;

  border: 2px solid ${({ theme }) => theme.colors.primary["600"]};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
`;
