import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

interface LinkedRowProps {
  children: React.ReactNode;
  path: string;
}

export default function LinkedRow({ children, path }: LinkedRowProps) {
  const router = useRouter();

  return <StyledLinkedRow onClick={() => router.push(path)}>{children}</StyledLinkedRow>;
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
