"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  overviewTitle: string;
  overviewBody: string;
  eventTitle: string;
  eventBody: string;
  energyTitle: string;
  energyBody: string;
}

export default function BulldozerContent({
  intro,
  overviewTitle,
  overviewBody,
  eventTitle,
  eventBody,
  energyTitle,
  energyBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{overviewTitle}</SectionTitle>
        <p>{overviewBody}</p>
      </Section>

      <Section>
        <SectionTitle>{eventTitle}</SectionTitle>
        <p>{eventBody}</p>
      </Section>

      <Section>
        <SectionTitle>{energyTitle}</SectionTitle>
        <p>{energyBody}</p>
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
