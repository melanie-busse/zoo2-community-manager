"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  overviewTitle: string;
  overviewBody: string;
  tiersTitle: string;
  tiersBody: string;
  tierOneTitle: string;
  tierOneBody: string;
  tierTwoTitle: string;
  tierTwoBody: string;
  tierThreeTitle: string;
  tierThreeBody: string;
  requirementsTitle: string;
  requirementsBody: string;
  regionsTitle: string;
  regionsBody: string;
  tipsTitle: string;
  tipsRetroactiveTitle: string;
  tipsRetroactiveBody: string;
  tipsPlanningTitle: string;
  tipsPlanningBody: string;
  tipsLevelTitle: string;
  tipsLevelBody: string;
  tipsClubTitle: string;
  tipsClubBody: string;
}

export default function WikiCollectionsContent({
  intro,
  overviewTitle,
  overviewBody,
  tiersTitle,
  tiersBody,
  tierOneTitle,
  tierOneBody,
  tierTwoTitle,
  tierTwoBody,
  tierThreeTitle,
  tierThreeBody,
  requirementsTitle,
  requirementsBody,
  regionsTitle,
  regionsBody,
  tipsTitle,
  tipsRetroactiveTitle,
  tipsRetroactiveBody,
  tipsPlanningTitle,
  tipsPlanningBody,
  tipsLevelTitle,
  tipsLevelBody,
  tipsClubTitle,
  tipsClubBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{overviewTitle}</SectionTitle>
        <p>{overviewBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tiersTitle}</SectionTitle>
        <p>{tiersBody}</p>

        <SubSectionTitle>{tierOneTitle}</SubSectionTitle>
        <p>{tierOneBody}</p>

        <SubSectionTitle>{tierTwoTitle}</SubSectionTitle>
        <p>{tierTwoBody}</p>

        <SubSectionTitle>{tierThreeTitle}</SubSectionTitle>
        <p>{tierThreeBody}</p>
      </Section>

      <Section>
        <SectionTitle>{requirementsTitle}</SectionTitle>
        <p>{requirementsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{regionsTitle}</SectionTitle>
        <p>{regionsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tipsTitle}</SectionTitle>

        <SubSectionTitle>{tipsRetroactiveTitle}</SubSectionTitle>
        <p>{tipsRetroactiveBody}</p>

        <SubSectionTitle>{tipsPlanningTitle}</SubSectionTitle>
        <p>{tipsPlanningBody}</p>

        <SubSectionTitle>{tipsLevelTitle}</SubSectionTitle>
        <p>{tipsLevelBody}</p>

        <SubSectionTitle>{tipsClubTitle}</SubSectionTitle>
        <p>{tipsClubBody}</p>
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
