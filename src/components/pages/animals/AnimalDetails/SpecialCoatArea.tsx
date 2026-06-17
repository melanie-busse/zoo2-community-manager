"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { Animal, SpecialCoat } from "@/types/animal";
import SpecialCoatCard from "./SpecialCoatCard";

interface SpecialCoatAreaProps {
  animal: Animal | null;
  specialCode: SpecialCoat[];
}

export default function SpecialCoatArea({ animal }: SpecialCoatAreaProps) {
  const tAnimals = useTranslations("Animals");

  const coats = animal?.specialcoat;

  if (!coats || coats.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeadline>
        <span style={{ fontSize: "1.2rem" }}>🌸</span>
        {tAnimals("colorVariants")}
      </SectionHeadline>

      <SpecialCoatGrid>
        {coats.map((coat: SpecialCoat) => (
          <SpecialCoatCard key={coat.id} specialCoat={coat} />
        ))}
      </SpecialCoatGrid>
    </>
  );
}

// --- Styled Components ---
const SpecialCoatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    justify-content: start;
  }
`;

const SectionHeadline = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;

  background: #fdfdfd;
  border: 1.5px solid #d1e2a5;
  border-radius: 30px;
  padding: 8px 24px;
  width: fit-content;

  color: #2d5a27;
  font-size: 1.3rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);

  margin: 25px 0 0 5px;

  &::after {
    @media (min-width: 769px) {
      content: "";
      flex: 1;
      height: 1.5px;
      background-color: #d1e2a5;
      margin-left: 20px;
      opacity: 0.5;
      min-width: 100px;
    }
  }

  @media (max-width: 768px) {
    margin: 30px auto 20px auto;
    font-size: 1.15rem;
    padding: 6px 20px;
    justify-content: center;
  }
`;
