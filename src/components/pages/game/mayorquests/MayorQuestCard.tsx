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

  // Fester Pfad für das Bürgermeister-Bild (muss nicht in die DB)
  const mayorImagePath = "/images/mayorquests/mayor.png";

  return (
    <OuterCard>
      {/* Sektion: Bürgermeister & Sprechblase */}
      {quest.dialogText && (
        <MayorHeaderSection>
          <MayorAvatarWrapper>
            <Image
              src={mayorImagePath}
              alt="Bürgermeister"
              width={70}
              height={85}
              style={{ objectFit: "contain" }}
            />
          </MayorAvatarWrapper>
          <SpeechBubble>
            <SpeechBubbleText>{quest.dialogText}</SpeechBubbleText>
          </SpeechBubble>
        </MayorHeaderSection>
      )}

      <QuestTitle>{quest.titleName}</QuestTitle>
      <CardDivider />

      {/* Sektion: Aufgaben */}
      <SectionHeading>{t("section_objectives", { defaultValue: "Aufgaben" })}</SectionHeading>
      <ObjectivesGrid>
        {quest.objectives.map((obj) => (
          <ObjectiveCard key={obj.id}>
            {obj.imagePath && (
              <ObjectiveIconWrapper>
                <Image
                  src={obj.imagePath}
                  alt=""
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              </ObjectiveIconWrapper>
            )}
            <ObjectiveContent>
              <ObjectiveText>{obj.text}</ObjectiveText>
            </ObjectiveContent>
            <CheckBadge>✓</CheckBadge>
          </ObjectiveCard>
        ))}
      </ObjectivesGrid>

      {/* Sektion: Belohnungen */}
      <SectionHeading>{t("section_rewards", { defaultValue: "Belohnungen" })}</SectionHeading>
      <RewardsContainer>
        {/* Beispielhafte Reward-Items im Spielstil */}
        <RewardItemCard>
          <RewardItemImageWrapper>
            <Image src="/images/rewards/baby_horse.png" alt="Baby Horse" width={50} height={50} />
          </RewardItemImageWrapper>
          <RewardBadgeCount>1x</RewardBadgeCount>
        </RewardItemCard>

        <RewardItemCard>
          <RewardItemImageWrapper>
            <Image src="/images/rewards/chest_rare.png" alt="Chest" width={50} height={50} />
          </RewardItemImageWrapper>
          <RewardBadgeCount>1x</RewardBadgeCount>
        </RewardItemCard>

        <RewardItemCard>
          <RewardItemImageWrapper>
            <Image src="/images/rewards/key.png" alt="Key" width={50} height={50} />
          </RewardItemImageWrapper>
          <RewardBadgeCount>10x</RewardBadgeCount>
        </RewardItemCard>

        <RewardItemCard>
          <RewardItemImageWrapper>
            <Image src="/images/currency/zoodollar.webp" alt="Coins" width={45} height={45} />
          </RewardItemImageWrapper>
          <RewardBadgeCount>{quest.coinReward.toLocaleString()}</RewardBadgeCount>
        </RewardItemCard>

        <RewardItemCard>
          <RewardItemImageWrapper>
            <Image src="/images/currency/xp_star.png" alt="XP" width={45} height={45} />
          </RewardItemImageWrapper>
          <RewardBadgeCount>{quest.xpReward.toLocaleString()}</RewardBadgeCount>
        </RewardItemCard>
      </RewardsContainer>

      {/* Footer mit Level und Questname */}
      <QuestFooter>
        <span>
          {t("col_level")} {quest.level}+
        </span>
        <span>•</span>
        <span>{quest.questName}</span>
      </QuestFooter>
    </OuterCard>
  );
}

// --- Styled Components ---

const OuterCard = styled.div`
  background: linear-gradient(to bottom, #fffdfa, #f7f3ed);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid #e2d3bc;
`;

const MayorHeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MayorAvatarWrapper = styled.div`
  flex-shrink: 0;
  background: #f0e4d0;
  border: 2px solid #c8b090;
  border-radius: 50%;
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const SpeechBubble = styled.div`
  background: #e1f3fd;
  border: 2px solid #82c4f8;
  border-radius: 16px;
  padding: 12px 18px;
  position: relative;
  flex-grow: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &::before {
    content: "";
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 8px 10px 8px 0;
    border-style: solid;
    border-color: transparent #82c4f8 transparent transparent;

    @media (max-width: 600px) {
      display: none;
    }
  }
`;

const SpeechBubbleText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a4a6b;
  line-height: 1.4;
`;

const QuestTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #2c221e;
`;

const SectionHeading = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #5c4a3e;
  margin: 16px 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  background: #fbf6ec;
  border: 2px solid #d4c3a8;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.8);
`;

const ObjectiveIconWrapper = styled.div`
  width: 45px;
  height: 45px;
  background: #fff;
  border: 2px solid #c8b090;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ObjectiveContent = styled.div`
  flex-grow: 1;
`;

const ObjectiveText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #3b2e25;
  line-height: 1.3;
`;

const CheckBadge = styled.div`
  background: #78bc38;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const RewardsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const RewardItemCard = styled.div`
  background: #fbf6ec;
  border: 2px solid #d4c3a8;
  border-radius: 12px;
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const RewardItemImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RewardBadgeCount = styled.span`
  position: absolute;
  bottom: -6px;
  background: #fff;
  border: 1px solid #c8b090;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #3b2e25;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const QuestFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #8c7865;
  font-weight: 500;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px dashed #d4c3a8;
`;
