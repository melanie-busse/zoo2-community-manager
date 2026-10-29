import React from "react";
import styled from "styled-components";

export function WikiTable({ children }: { children: React.ReactNode }) {
  return <Table>{children}</Table>;
}

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 8px;
  border-radius: 10px;
  overflow: hidden;
  border: ${({ theme }) => theme.border.subtitle};

  th {
    background-color: ${({ theme }) => theme.colors.primary[900]};
    color: ${({ theme }) => theme.colors.ui.white};
    font-weight: 600;
    text-align: left;
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  td {
    padding: 10px 14px;
    background-color: ${({ theme }) => theme.colors.ui.glassWhiteRicher};
    border-bottom: 1px solid ${({ theme }) => theme.colors.ui.overlayLight};
    font-size: 0.95rem;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;
