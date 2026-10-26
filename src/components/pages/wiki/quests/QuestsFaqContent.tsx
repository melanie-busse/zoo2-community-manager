"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  typesTitle: string;
  typesBody: string;
  tutorialTitle: string;
  tutorialBody: string;
  levelTitle: string;
  levelBody: string;
  chainTitle: string;
  chainBody: string;
  featureTitle: string;
  featureBody: string;
  regionTitle: string;
  regionBody: string;
  miscTitle: string;
  miscBody: string;
  rewardsTitle: string;
  rewardsBody: string;
  tipsTitle: string;
  tipsTitleRetroactive: string;
  tipsBodyRetroactive: string;
  tipsTitleTimelimited: string;
  tipsBodyTimelimited: string;
  tipsTitleDiamonds: string;
  tipsBodyDiamonds: string;
  tipsTitlePuzzles: string;
  tipsBodyPuzzles: string;
}

export default function QuestsFaqContent({
  intro,
  typesTitle,
  typesBody,
  tutorialTitle,
  tutorialBody,
  levelTitle,
  levelBody,
  chainTitle,
  chainBody,
  featureTitle,
  featureBody,
  regionTitle,
  regionBody,
  miscTitle,
  miscBody,
  rewardsTitle,
  rewardsBody,
  tipsTitle,
  tipsTitleRetroactive,
  tipsBodyRetroactive,
  tipsTitleTimelimited,
  tipsBodyTimelimited,
  tipsTitleDiamonds,
  tipsBodyDiamonds,
  tipsTitlePuzzles,
  tipsBodyPuzzles,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{typesTitle}</SectionTitle>
        <p>{typesBody}</p>

        <SubSectionTitle>{tutorialTitle}</SubSectionTitle>
        <p>{tutorialBody}</p>

        <SubSectionTitle>{levelTitle}</SubSectionTitle>
        <p>{levelBody}</p>

        <SubSectionTitle>{chainTitle}</SubSectionTitle>
        <p>{chainBody}</p>

        <SubSectionTitle>{featureTitle}</SubSectionTitle>
        <p>{featureBody}</p>

        <SubSectionTitle>{regionTitle}</SubSectionTitle>
        <p>{regionBody}</p>

        <SubSectionTitle>{miscTitle}</SubSectionTitle>
        <p>{miscBody}</p>
      </Section>

      <Section>
        <SectionTitle>{rewardsTitle}</SectionTitle>
        <p>{rewardsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tipsTitle}</SectionTitle>

        <SubSectionTitle>{tipsTitleRetroactive}</SubSectionTitle>
        <p>{tipsBodyRetroactive}</p>

        <SubSectionTitle>{tipsTitleTimelimited}</SubSectionTitle>
        <p>{tipsBodyTimelimited}</p>

        <SubSectionTitle>{tipsTitleDiamonds}</SubSectionTitle>
        <p>{tipsBodyDiamonds}</p>

        <SubSectionTitle>{tipsTitlePuzzles}</SubSectionTitle>
        <p>{tipsBodyPuzzles}</p>
      </Section>
    </>
  );
}

const IntroParagraph = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  p {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[500]};
`;

const SubSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
