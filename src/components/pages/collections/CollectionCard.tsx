"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { Collection } from "@/types/collection";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";

const CollectionName = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
`;

const StarsRow = styled.div`
  display: flex;
  gap: 2px;
  font-size: 1.1rem;
`;

const Star = styled.span<{ $filled: boolean }>`
  color: ${({ $filled }) => ($filled ? "#f6c90e" : "rgba(0,0,0,0.15)")};
`;

const AreaBadge = styled.span<{ $area: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $area }) => {
    switch ($area) {
      case "MAIN_ZOO":
        return "rgba(76, 175, 80, 0.15)";
      case "TERRARIUM":
        return "rgba(121, 85, 72, 0.15)";
      case "AQUARIUM":
        return "rgba(33, 150, 243, 0.15)";
      case "NOCTARIUM":
        return "rgba(103, 58, 183, 0.15)";
      case "AVIARY":
        return "rgba(255, 152, 0, 0.15)";
      default:
        return "rgba(0,0,0,0.08)";
    }
  }};
  color: ${({ $area }) => {
    switch ($area) {
      case "MAIN_ZOO":
        return "#2e7d32";
      case "TERRARIUM":
        return "#5d4037";
      case "AQUARIUM":
        return "#1565c0";
      case "NOCTARIUM":
        return "#4527a0";
      case "AVIARY":
        return "#e65100";
      default:
        return "#333";
    }
  }};
`;

const RequirementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RequirementItem = styled.li`
  font-size: 0.82rem;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LevelBadge = styled.strong`
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.7;
  white-space: nowrap;
`;

const MoreLabel = styled.span`
  font-size: 0.8rem;
  opacity: 0.5;
  font-style: italic;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const ReqCount = styled.span`
  font-size: 0.8rem;
  opacity: 0.55;
`;

const ReqSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
  width: 100%;
`;

interface CollectionCardProps {
  collection: Collection;
}

const PREVIEW_COUNT = 5;

export default function CollectionCard({ collection }: CollectionCardProps) {
  const t = useTranslations("collections");
  const previewItems = collection.requirements.slice(0, PREVIEW_COUNT);
  const remaining = collection.requirements.length - PREVIEW_COUNT;

  return (
    <CardContainer>
      <CardHeaderRow>
        <CollectionName>{collection.name}</CollectionName>
        <StarsRow>
          {[1, 2, 3].map((s) => (
            <Star key={s} $filled={s <= collection.stars}>
              ★
            </Star>
          ))}
        </StarsRow>
      </CardHeaderRow>

      <MetaRow>
        <AreaBadge $area={collection.area}>{t(`area.${collection.area}`)}</AreaBadge>
        <ReqCount>{t("card.requirements", { count: collection.requirements.length })}</ReqCount>
      </MetaRow>

      <CardDivider />

      <ReqSection>
        <RequirementList>
          {previewItems.map((req) => (
            <RequirementItem key={req.id}>
              {req.type === "ANIMAL" ? "🐾" : "🏺"}
              {req.type === "ANIMAL" && req.requiredLevel != null && (
                <LevelBadge>{t("card.level", { level: req.requiredLevel })}</LevelBadge>
              )}
              {req.itemName}
            </RequirementItem>
          ))}
          {remaining > 0 && <MoreLabel>{t("card.more", { count: remaining })}</MoreLabel>}
        </RequirementList>
      </ReqSection>
    </CardContainer>
  );
}
