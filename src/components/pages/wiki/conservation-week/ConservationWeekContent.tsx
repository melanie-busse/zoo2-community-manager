"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  participationTitle: string;
  participationBody: string;
  tiersTitle: string;
  tiersBody: string;
  tiersHelper: string;
  tiersExpert: string;
  pointsTitle: string;
  pointsBody: string;
  tasksTitle: string;
  tasksBody: string;
  taskBreedBiome: string;
  taskReleaseBiome: string;
  taskBreedList: string;
  taskReleaseList: string;
  animalListTitle: string;
  animalListBody: string;
  questsTitle: string;
  questsBody: string;
  communityGoalTitle: string;
  communityGoalBody: string;
  personalRankingTitle: string;
  personalRankingBody: string;
  titlesTitle: string;
  titlesBody: string;
  fertilityFeedTitle: string;
  fertilityFeedBody: string;
  tipsTitle: string;
  tipsBody: string;
}

export default function ConservationWeekContent({
  intro,
  participationTitle,
  participationBody,
  tiersTitle,
  tiersBody,
  tiersHelper,
  tiersExpert,
  pointsTitle,
  pointsBody,
  tasksTitle,
  tasksBody,
  taskBreedBiome,
  taskReleaseBiome,
  taskBreedList,
  taskReleaseList,
  animalListTitle,
  animalListBody,
  questsTitle,
  questsBody,
  communityGoalTitle,
  communityGoalBody,
  personalRankingTitle,
  personalRankingBody,
  titlesTitle,
  titlesBody,
  fertilityFeedTitle,
  fertilityFeedBody,
  tipsTitle,
  tipsBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{participationTitle}</SectionTitle>
        <p>{participationBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tiersTitle}</SectionTitle>
        <p>{tiersBody}</p>
        <BulletList>
          <li>{tiersHelper}</li>
          <li>{tiersExpert}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{pointsTitle}</SectionTitle>
        <p>{pointsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tasksTitle}</SectionTitle>
        <p>{tasksBody}</p>
        <BulletList>
          <li>{taskBreedBiome}</li>
          <li>{taskReleaseBiome}</li>
          <li>{taskBreedList}</li>
          <li>{taskReleaseList}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{animalListTitle}</SectionTitle>
        <p>{animalListBody}</p>
      </Section>

      <Section>
        <SectionTitle>{questsTitle}</SectionTitle>
        <p>{questsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{communityGoalTitle}</SectionTitle>
        <p>{communityGoalBody}</p>
      </Section>

      <Section>
        <SectionTitle>{personalRankingTitle}</SectionTitle>
        <p>{personalRankingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{titlesTitle}</SectionTitle>
        <p>{titlesBody}</p>
      </Section>

      <Section>
        <SectionTitle>{fertilityFeedTitle}</SectionTitle>
        <p>{fertilityFeedBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tipsTitle}</SectionTitle>
        <p>{tipsBody}</p>
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

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
