import React from "react";
import styled from "styled-components";

interface InputContainerProps {
  children: React.ReactNode;
}
export default function InputContainer({ children }: InputContainerProps) {
  return <StyledInputContainer>{children}</StyledInputContainer>;
}

const StyledInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding-left: 30px;
`;
