"use client";

import React, { useState, ReactNode } from "react";
import styled from "styled-components";
import NextImage from "next/image";

interface InfoAccordionProps {
  title: string;
  icon: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function InfoAccordion({
  title,
  icon,
  children,
  defaultOpen = false,
}: InfoAccordionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <AccordionWrapper>
      <AccordionHeader type="button" onClick={() => setIsOpen(!isOpen)}>
        <HeaderIcon>
          <NextImage src={icon} alt={title} width={30} height={30} />
        </HeaderIcon>
        {title}
        <Chevron $isOpen={isOpen}>▼</Chevron>
      </AccordionHeader>
      <AccordionBody $isOpen={isOpen}>{children}</AccordionBody>
    </AccordionWrapper>
  );
}

// --- Styled Components ---
const AccordionWrapper = styled.div`
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  background: white;
  border: 1px solid #e0e0e0;
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  background: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  color: #2d5a27;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`;

const HeaderIcon = styled.span`
  margin-right: 12px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

interface TransientOpenProps {
  $isOpen: boolean;
}

const Chevron = styled.span<TransientOpenProps>`
  margin-left: auto;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  color: #aaa;
`;

const AccordionBody = styled.div<TransientOpenProps>`
  padding: ${(props) => (props.$isOpen ? "16px" : "0 16px")};
  max-height: ${(props) => (props.$isOpen ? "600px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  border-top: ${(props) => (props.$isOpen ? "1px solid #eee" : "none")};
`;
