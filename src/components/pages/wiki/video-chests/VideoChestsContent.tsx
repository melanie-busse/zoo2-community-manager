"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  contentTitle: string;
  contentBody: string;
  availabilityTitle: string;
  availabilityBody: string;
  limitTitle: string;
  limitBody: string;
  platformTitle: string;
  platformBody: string;
}

export default function VideoChestsContent({
  intro,
  contentTitle,
  contentBody,
  availabilityTitle,
  availabilityBody,
  limitTitle,
  limitBody,
  platformTitle,
  platformBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{contentTitle}</SectionTitle>
        <p>{contentBody}</p>
      </Section>

      <Section>
        <SectionTitle>{availabilityTitle}</SectionTitle>
        <p>{availabilityBody}</p>
      </Section>

      <Section>
        <SectionTitle>{limitTitle}</SectionTitle>
        <p>{limitBody}</p>
      </Section>

      <Section>
        <SectionTitle>{platformTitle}</SectionTitle>
        <p>{platformBody}</p>
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
