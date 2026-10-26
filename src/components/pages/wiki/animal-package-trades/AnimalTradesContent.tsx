"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  bonusTitle: string;
  bonusBody: string;
  howTitle: string;
  howStep1: string;
  howStep2: string;
  howStep3: string;
  howStep4: string;
  exclusionsTitle: string;
  exclusionsBody: string;
  exclusionsRulesTitle: string;
  exclusionPremium: string;
  exclusionPairs: string;
  exclusionList: string;
  exclusionEnclosure: string;
  tradelistTitle: string;
  tradelistBody: string;
  tradelistTip: string;
}

export default function AnimalTradesContent({
  intro,
  bonusTitle,
  bonusBody,
  howTitle,
  howStep1,
  howStep2,
  howStep3,
  howStep4,
  exclusionsTitle,
  exclusionsBody,
  exclusionsRulesTitle,
  exclusionPremium,
  exclusionPairs,
  exclusionList,
  exclusionEnclosure,
  tradelistTitle,
  tradelistBody,
  tradelistTip,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{bonusTitle}</SectionTitle>
        <p>{bonusBody}</p>
      </Section>

      <Section>
        <SectionTitle>{howTitle}</SectionTitle>
        <OrderedList>
          <li>{howStep1}</li>
          <li>{howStep2}</li>
          <li>{howStep3}</li>
          <li>{howStep4}</li>
        </OrderedList>
      </Section>

      <Section>
        <SectionTitle>{exclusionsTitle}</SectionTitle>
        <p>{exclusionsBody}</p>
        <SubSectionTitle>{exclusionsRulesTitle}</SubSectionTitle>
        <BulletList>
          <li>{exclusionPremium}</li>
          <li>{exclusionPairs}</li>
          <li>{exclusionList}</li>
          <li>{exclusionEnclosure}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{tradelistTitle}</SectionTitle>
        <p>{tradelistBody}</p>
        <p>{tradelistTip}</p>
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

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;

const OrderedList = styled.ol`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
