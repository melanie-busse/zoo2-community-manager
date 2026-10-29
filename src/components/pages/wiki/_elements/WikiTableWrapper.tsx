import styled from "styled-components";

export default function WikiTableWrapper({ children }: { children: React.ReactNode }) {
  return <TableWrapper>{children}</TableWrapper>;
}

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  max-width: 500px;
`;
