import React from "react";
import styled from "styled-components";

interface ActionRowProps {
  children: React.ReactNode;
}
export default function ActionRow({ children }: ActionRowProps) {
  return <StyledActionRow>{children}</StyledActionRow>;
}

const StyledActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f4e8;
  &:last-child {
    border-bottom: none;
  }
`;
