"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  overviewTitle: string;
  overviewBody: string;
  chestTypesTitle: string;
  chestFriendship: string;
  chestNormal: string;
  chestEpic: string;
  chestRetro: string;
  chestLegendary: string;
  chestVideo: string;
  forecastsTitle: string;
  forecastsBody: string;
  limitsTitle: string;
  limitsBody: string;
  keysTitle: string;
  keysBody: string;
  exceptionsTitle: string;
  exceptionsBody: string;
  exceptionExpansions: string;
  exceptionUpgrades: string;
  exceptionEmployees: string;
  exceptionOther: string;
}

export default function ChestsFaqContent({
  intro,
  overviewTitle,
  overviewBody,
  chestTypesTitle,
  chestFriendship,
  chestNormal,
  chestEpic,
  chestRetro,
  chestLegendary,
  chestVideo,
  forecastsTitle,
  forecastsBody,
  limitsTitle,
  limitsBody,
  keysTitle,
  keysBody,
  exceptionsTitle,
  exceptionsBody,
  exceptionExpansions,
  exceptionUpgrades,
  exceptionEmployees,
  exceptionOther,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{overviewTitle}</SectionTitle>
        <p>{overviewBody}</p>
      </Section>

      <Section>
        <SectionTitle>{chestTypesTitle}</SectionTitle>
        <BulletList>
          <li>{chestFriendship}</li>
          <li>{chestNormal}</li>
          <li>{chestEpic}</li>
          <li>{chestRetro}</li>
          <li>{chestLegendary}</li>
          <li>{chestVideo}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{forecastsTitle}</SectionTitle>
        <p>{forecastsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{limitsTitle}</SectionTitle>
        <p>{limitsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{keysTitle}</SectionTitle>
        <p>{keysBody}</p>
      </Section>

      <Section>
        <SectionTitle>{exceptionsTitle}</SectionTitle>
        <p>{exceptionsBody}</p>
        <BulletList>
          <li>{exceptionExpansions}</li>
          <li>{exceptionUpgrades}</li>
          <li>{exceptionEmployees}</li>
          <li>{exceptionOther}</li>
        </BulletList>
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
