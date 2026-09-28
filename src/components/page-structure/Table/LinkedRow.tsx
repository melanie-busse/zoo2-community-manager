"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

interface LinkedRowProps {
  children: React.ReactNode;
  path: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function LinkedRow({ children, path, onClick, disabled }: LinkedRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    }
    router.push(path);
  };

  return <StyledLinkedRow onClick={handleRowClick} $disabled={disabled}>{children}</StyledLinkedRow>;
}

const StyledLinkedRow = styled.tr<{ $disabled?: boolean }>`
  border-bottom: 1px solid #eee;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "transparent" : "#f0fff0")};
  }

  td {
    padding: 12px 15px;
  }
`;
