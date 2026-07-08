import React from "react";
import styled from "styled-components";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}
export default function Label({ children, ...props }: LabelProps) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

const StyledLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d7a2a;
  margin-left: 2px;
`;
