"use client";

import React from "react";
import styled from "styled-components";

interface InputFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  id: string;
  $width?: string;
}

export default function InputField({ label, id, $width, ...props }: InputFieldProps) {
  return (
    <Wrapper $width={$width}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} {...props} />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $width?: string }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${(props) => props.$width || "100%"};
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d7a2a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1e2a5;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background-color: #fdfdfd;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #88a04d;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(136, 160, 77, 0.1);
  }

  &[type="number"] {
    text-align: right;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;
