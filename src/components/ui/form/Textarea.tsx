"use client";

import React from "react";
import styled from "styled-components";

interface FormTextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  id: string;
  $minHeight?: string;
}

export default function FormTextarea({ label, id, $minHeight, ...props }: FormTextareaProps) {
  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledTextarea id={id} $minHeight={$minHeight} {...props} />
    </Wrapper>
  );
}

// --- Styled Components ---
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 0;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d7a2a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StyledTextarea = styled.textarea<{ $minHeight?: string }>`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1e2a5;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  min-height: ${(props) => props.$minHeight || "120px"};
  background-color: #fdfdfd;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #88a04d;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(136, 160, 77, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
