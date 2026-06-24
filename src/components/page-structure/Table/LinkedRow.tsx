"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

interface LinkedRowProps {
  children: React.ReactNode;
  path: string;
  onClick?: () => void; // 💡 Optionales onClick-Prop hinzufügen
}

export default function LinkedRow({ children, path, onClick }: LinkedRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    // 1. Falls eine zusätzliche Aktion übergeben wurde (z.B. Store setzen), führ sie aus
    if (onClick) {
      onClick();
    }
    // 2. Danach ganz normal navigieren
    router.push(path);
  };

  return <StyledLinkedRow onClick={handleRowClick}>{children}</StyledLinkedRow>;
}

const StyledLinkedRow = styled.tr`
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background: #f0fff0;
  }

  td {
    padding: 12px 15px;
  }
`;
