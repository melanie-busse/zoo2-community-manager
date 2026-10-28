import styled from "styled-components";
import React from "react";

export default function WikiContainer({ children }: { children: React.ReactNode }) {
  return <Wrapper>{children}</Wrapper>;
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
    padding-left: 8px;
    padding-right: 8px;
  }

  @media (min-width: 1024px) {
    padding: 0;
  }
`;
