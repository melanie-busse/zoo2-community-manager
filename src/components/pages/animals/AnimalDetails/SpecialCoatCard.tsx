"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import SpecialCoatBadge from "@/components/ui/badges/SpecialCoatBadge";
import { SpecialCoat } from "@/types/animal";
import { formatLocaleDate } from "@/utils/DateUtil";

interface SpecialCoatCardProps {
  specialCoat: SpecialCoat;
}

export default function SpecialCoatCard({ specialCoat }: SpecialCoatCardProps) {
  const tCommon = useTranslations("Common");
  const origin = specialCoat.origin;

  // Single source of truth from filtered server locale array
  const displayName = specialCoat.specialCoatText?.[0]?.name || specialCoat.name;
  const releaseDate = specialCoat.releaseDate
    ? String(formatLocaleDate(specialCoat.releaseDate))
    : "---";

  return (
    <StyledSpecialCoatCard title={displayName}>
      <SpecialCoatBadge image={specialCoat.image} displayName={displayName} />

      <SpecialCoatName>{displayName}</SpecialCoatName>

      <ReleaseDate>
        📅 {tCommon("release")}: {releaseDate}
      </ReleaseDate>

      {origin && (
        <OriginRow title={origin.name}>
          <NextImage
            src={`/images/origins/${origin.image}`}
            alt={origin.name}
            width={20}
            height={20}
          />
        </OriginRow>
      )}
    </StyledSpecialCoatCard>
  );
}

// --- Styled Components ---
const StyledSpecialCoatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  max-width: none;
  margin: 0 auto;

  height: auto;
  min-height: 260px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    width: 230px;
    margin: 0;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: #4a7c2a;
    background: #ffffff;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SpecialCoatName = styled.span`
  margin-top: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  display: block;
  width: 100%;
  word-wrap: break-word;
`;

const ReleaseDate = styled.div`
  font-size: 0.8rem;
  margin-top: 5px;
`;

const OriginRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  background: #f1f8e9;
  padding: 6px 12px;
  border-radius: 20px;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  width: fit-content;

  span {
    font-weight: 600;
  }
`;
