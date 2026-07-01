import styled from "styled-components";
import React from "react";

interface FormGroupProps {
  children: React.ReactNode;
}
export default function FormGroup({ children }: FormGroupProps) {
  return <StyledFormGroup>{children}</StyledFormGroup>;
}

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
