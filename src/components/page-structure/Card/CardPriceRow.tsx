import styled from "styled-components";

export default function CardPriceRow({ children }: { children: React.ReactNode }) {
  return <PriceRow>{children}</PriceRow>;
}

export const PriceRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 4px;
`;
