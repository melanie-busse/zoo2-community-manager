import styled from "styled-components";

export default function CardHeaderRow({ children }: { children: React.ReactNode }) {
  return <HeaderRow>{children}</HeaderRow>;
}

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;
