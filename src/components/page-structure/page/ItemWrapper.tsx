import { ReactNode } from "react";
import styled from "styled-components";

interface ItemWrapperProps {
  children: ReactNode;
}
export default function ItemWrapper({ children }: ItemWrapperProps) {
  return <StyledItemWrapper>{children}</StyledItemWrapper>;
}

const StyledItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  font-weight: bold;
  width: 100%;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;
