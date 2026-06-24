"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";

interface InputGroupProps {
  children: React.ReactNode;
  unit?: string;
  icon?: string;
  iconSize?: string;
}

export default function InputGroup({ children, unit, icon, iconSize = "20px" }: InputGroupProps) {
  const numericSize = parseInt(iconSize, 10) || 20;

  return (
    <GroupWrapper>
      <ChildContainer>{children}</ChildContainer>
      {unit && <Unit>{unit}</Unit>}
      {icon && (
        <IconWrapper $size={iconSize}>
          <NextImage
            src={icon}
            alt=""
            width={numericSize}
            height={numericSize}
            style={{ objectFit: "contain" }}
          />
        </IconWrapper>
      )}
    </GroupWrapper>
  );
}

// --- Styled Components ---
const GroupWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  width: 100%; /* Wichtig, damit die Gruppe im Formular die volle Breite nutzt */
`;

const ChildContainer = styled.div`
  flex: 1;
  width: 100%;
`;

const Unit = styled.strong`
  font-size: 0.9rem;
  color: #88a04d;
  min-width: 15px;
  white-space: nowrap;
`;

const IconWrapper = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  flex-shrink: 0; /* Verhindert, dass das Icon gequetscht wird */
`;
