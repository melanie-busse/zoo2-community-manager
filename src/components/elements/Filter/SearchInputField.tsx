"use client";

import React from "react";
import styled from "styled-components";
import { useAnimalStore } from "@/store/useAnimalStore";

interface SearchInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInputField({
  value,
  onChange,
  placeholder,
  className,
}: SearchInputFieldProps) {
  return (
    <SearchInput
      type="text"
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

const SearchInput = styled.input`
  flex: 2;
  min-width: 250px;
  padding: 12px 16px;
  border: 2px solid rgba(224, 231, 213, 0.5);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[100]};
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;
