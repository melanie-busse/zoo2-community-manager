"use client";

import React from "react";
import styled from "styled-components";

interface DatePickerFieldProps {
  id: string;
  value: string | null;
  onChange: (dateString: string | null) => void;
  $width?: string;
}

export default function DatePickerField({ id, value, onChange, $width }: DatePickerFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value || null);
  };

  return (
    <StyledInput
      id={id}
      type="date"
      value={value ?? ""}
      onChange={handleChange}
      $width={$width}
    />
  );
}

const StyledInput = styled.input<{ $width?: string }>`
  width: ${(props) => props.$width || "100%"};
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
`;