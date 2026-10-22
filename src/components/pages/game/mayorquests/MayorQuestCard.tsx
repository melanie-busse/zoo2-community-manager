"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import type { MayorQuestItem } from "@/service/MayorQuestService";
import CardDivider from "@/components/page-structure/Card/CardDevider";

interface MayorQuestCardProps {
  quest: MayorQuestItem;
}

export default function MayorQuestCard({ quest }: MayorQuestCardProps) {
  const t = useTranslations("mayorquest");

  return (
    <OuterCard>
      <QuestTitle>{quest.titleName}</QuestTitle>
      <CardDivider />

      <ObjectivesGrid>
        {quest.objectives.map((obj) => (
          <ObjectiveCard key={obj.id}>
            <ObjectiveText>{obj.text}</ObjectiveText>
          </ObjectiveCard>
        ))}
      </ObjectivesGrid>

      <RewardCard>
        <RewardRow>
          <RewardLabel>{t("col_level")}</RewardLabel>
          <RewardValue>{quest.level}+</RewardValue>
        </RewardRow>
        <RewardRow>
          <RewardLabel>
            <Image
              src="/images/currency/zoodollar.webp"
              alt={t("col_coins")}
              width={18}
              height={18}
            />
          </RewardLabel>
          <RewardValue>{quest.coinReward.toLocaleString()}</RewardValue>
        </RewardRow>
        <RewardRow>
          <RewardLabel>XP</RewardLabel>
          <RewardValue>{quest.xpReward.toLocaleString()}</RewardValue>
        </RewardRow>
        <RewardRow>
          <RewardLabel>{t("col_misc")}</RewardLabel>
          <RewardValue>{quest.miscReward}</RewardValue>
        </RewardRow>
        <RewardRow>
          <RewardLabel>{t("col_quest_name")}</RewardLabel>
          <RewardValue>{quest.questName}</RewardValue>
        </RewardRow>
      </RewardCard>
    </OuterCard>
  );
}

const OuterCard = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

const QuestTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;

const ObjectivesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ObjectiveCard = styled.div`
  background: ${({ theme }) => theme.colors.system.honeydew};
  border: 1px solid ${({ theme }) => theme.colors.system.lime};
  border-radius: 8px;
  padding: 12px 16px;
`;

const ObjectiveText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const RewardCard = styled.div`
  background: ${({ theme }) => theme.colors.ui.whiteFrost};
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #e8e8e8;
`;

const RewardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RewardLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #666;
  min-width: 140px;
  display: flex;
  align-items: center;
`;

const RewardValue = styled.span`
  font-size: 0.9rem;
`;
