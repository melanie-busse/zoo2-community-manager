"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";

interface StatBoxProps {
  children: ReactNode;
}

export default function StatBox({ children }: StatBoxProps) {
  return <StyledStatBox>{children}</StyledStatBox>;
}

const StyledStatBox = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 8px 12px;

  label {
    display: block;
    font-size: 0.7rem;
    color: #999;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .value {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1.1rem;
    color: #333;
    gap: 5px;
  }
`;
