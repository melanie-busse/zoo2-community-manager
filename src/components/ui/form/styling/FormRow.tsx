import React from "react";
import styled from "styled-components";

interface FormRowProps {
  children: React.ReactNode;
}
export default function FormRow({ children }: FormRowProps) {
  return <StyledFormRow>{children}</StyledFormRow>;
}

const StyledFormRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  & > *:first-child {
    flex: 2;
    min-width: 100px;
  }
  & > *:last-child {
    flex: 1;
    max-width: 180px;
    min-width: 130px;
  }
`;
