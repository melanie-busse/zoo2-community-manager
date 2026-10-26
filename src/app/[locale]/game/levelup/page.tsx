import React from "react";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLevelRewards, getAllAnimalsForLevelFilter } from "@/service/LevelService";
import LevelUpOverviewContent from "@/components/pages/game/levelup/LevelUpOverviewContent";
import Image from "next/image";
import styled from "styled-components";

export default async function LevelUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [levels, allAnimals, t] = await Promise.all([
    getAllLevelRewards(locale),
    getAllAnimalsForLevelFilter(locale),
    getTranslations({ locale, namespace: "levelup" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <IntroBanner>
          <WestieWrapper>
            <Image
              src="/images/mayorquests/westie_mayor.png"
              alt="Bürgermeister Westie"
              width={80}
              height={90}
              style={{ objectFit: "contain" }}
            />
          </WestieWrapper>

          <IntroSpeechBubble>
            <SpeechBubbleText>{t("description")}</SpeechBubbleText>
          </IntroSpeechBubble>
        </IntroBanner>
        <LevelUpOverviewContent levels={levels} allAnimals={allAnimals} />
      </ContentWrapper>
    </PageWrapper>
  );
}

const IntroBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const WestieWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
`;

const IntroSpeechBubble = styled.div`
  background: #e1f3fd;
  border: 2px solid #82c4f8;
  border-radius: 16px;
  padding: 12px 18px;
  position: relative;
  flex-grow: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  /* Pfeil zeigt nach links zum Westie */
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
  line-height: 1.5;
`;
