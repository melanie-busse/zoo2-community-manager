import styled from "styled-components";

export const DesktopView = styled.div`
  display: block;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const TableFrame = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  border: 2px solid ${({ theme }) => theme.colors.primary["600"]};
  border-radius: ${({ theme }) => theme.borderRadius.main};

  margin-top: 10px;
  overflow-y: visible;
  position: relative;
  z-index: 1;
`;

export const Table = styled.table`
  width: 98%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;

  th {
    background: ${({ theme }) => theme.colors.ui.white};
    padding: 15px;
    text-align: left;
    color: ${({ theme }) => theme.colors.system.success};
    border-bottom: 2px solid ${({ theme }) => theme.colors.ui.white};
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.ui.white};
  }

  tr:hover td {
    background: ${({ theme }) => theme.colors.ui.white};
  }

  /* Abrundung der Ecken */
  th:first-child {
    border-top-left-radius: calc(${({ theme }) => theme.borderRadius.main} - 2px);
  }
  th:last-child {
    border-top-right-radius: calc(${({ theme }) => theme.borderRadius.main} - 2px);
  }
  tr:last-child td:first-child {
    border-bottom-left-radius: calc(${({ theme }) => theme.borderRadius.main} - 2px);
  }
  tr:last-child td:last-child {
    border-bottom-right-radius: calc(${({ theme }) => theme.borderRadius.main} - 2px);
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: auto;
`;

export const TableCellRight = styled.td`
  text-align: right;
  padding-right: 20px;
`;

export const TableThumbnail = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TableEmptyState = styled.td`
  text-align: center;
  padding: 40px;
`;
