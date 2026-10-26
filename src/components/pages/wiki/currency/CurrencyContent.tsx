"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  coinsTitle: string;
  coinsBody: string;
  generatingCoinsTitle: string;
  generatingCoinsBody: string;
  spendingCoinsTitle: string;
  spendingCoinsBody: string;
  diamondsTitle: string;
  diamondsBody: string;
  freeDiamondsTitle: string;
  freeDiamondsGameplayTitle: string;
  freeDiamondsGameplayBody: string;
  watchingAdsTitle: string;
  watchingAdsBody: string;
  newsSubscriptionsTitle: string;
  newsSubscriptionsBody: string;
  socialMediaTitle: string;
  socialMediaBody: string;
  upjersPortalTitle: string;
  upjersPortalBody: string;
  buyingDiamondsTitle: string;
  buyingDiamondsBody: string;
  ticketsTitle: string;
  ticketsBody: string;
  keysTitle: string;
  keysBody: string;
  energyTitle: string;
  energyBody: string;
  feathersTitle: string;
  feathersBody: string;
  eventCurrencyTitle: string;
  eventCurrencyBody: string;
}

export default function CurrencyContent({
  intro,
  coinsTitle,
  coinsBody,
  generatingCoinsTitle,
  generatingCoinsBody,
  spendingCoinsTitle,
  spendingCoinsBody,
  diamondsTitle,
  diamondsBody,
  freeDiamondsTitle,
  freeDiamondsGameplayTitle,
  freeDiamondsGameplayBody,
  watchingAdsTitle,
  watchingAdsBody,
  newsSubscriptionsTitle,
  newsSubscriptionsBody,
  socialMediaTitle,
  socialMediaBody,
  upjersPortalTitle,
  upjersPortalBody,
  buyingDiamondsTitle,
  buyingDiamondsBody,
  ticketsTitle,
  ticketsBody,
  keysTitle,
  keysBody,
  energyTitle,
  energyBody,
  feathersTitle,
  feathersBody,
  eventCurrencyTitle,
  eventCurrencyBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{coinsTitle}</SectionTitle>
        <p>{coinsBody}</p>
        <SubSectionTitle>{generatingCoinsTitle}</SubSectionTitle>
        <p>{generatingCoinsBody}</p>
        <SubSectionTitle>{spendingCoinsTitle}</SubSectionTitle>
        <p>{spendingCoinsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{diamondsTitle}</SectionTitle>
        <p>{diamondsBody}</p>
        <SubSectionTitle>{freeDiamondsTitle}</SubSectionTitle>
        <SubSectionTitle>{freeDiamondsGameplayTitle}</SubSectionTitle>
        <p>{freeDiamondsGameplayBody}</p>
        <SubSectionTitle>{watchingAdsTitle}</SubSectionTitle>
        <p>{watchingAdsBody}</p>
        <SubSectionTitle>{newsSubscriptionsTitle}</SubSectionTitle>
        <p>{newsSubscriptionsBody}</p>
        <SubSectionTitle>{socialMediaTitle}</SubSectionTitle>
        <p>{socialMediaBody}</p>
        <SubSectionTitle>{upjersPortalTitle}</SubSectionTitle>
        <p>{upjersPortalBody}</p>
        <SubSectionTitle>{buyingDiamondsTitle}</SubSectionTitle>
        <p>{buyingDiamondsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{ticketsTitle}</SectionTitle>
        <p>{ticketsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{keysTitle}</SectionTitle>
        <p>{keysBody}</p>
      </Section>

      <Section>
        <SectionTitle>{energyTitle}</SectionTitle>
        <p>{energyBody}</p>
      </Section>

      <Section>
        <SectionTitle>{feathersTitle}</SectionTitle>
        <p>{feathersBody}</p>
      </Section>

      <Section>
        <SectionTitle>{eventCurrencyTitle}</SectionTitle>
        <p>{eventCurrencyBody}</p>
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
