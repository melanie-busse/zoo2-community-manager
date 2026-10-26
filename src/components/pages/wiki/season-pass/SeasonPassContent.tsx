"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  tiersTitle: string;
  tiersBody: string;
  levelingTitle: string;
  levelingBody: string;
  xpTitle: string;
  xpBody: string;
  quizTitle: string;
  quizBody: string;
  questsTitle: string;
  questsBody: string;
  feathersTitle: string;
  feathersBody: string;
  feathersColBundle: string;
  feathersColFeathers: string;
  feathersColCost: string;
  scheduleTitle: string;
  scheduleBody: string;
  tipsTitle: string;
  tipsBody: string;
}

const FEATHER_BUNDLES: [string, string, string][] = [
  ["Small", "200", "19 ◆"],
  ["Medium", "2,000", "99 ◆"],
  ["Large", "5,000", "199 ◆"],
];

export default function SeasonPassContent({
  intro,
  tiersTitle,
  tiersBody,
  levelingTitle,
  levelingBody,
  xpTitle,
  xpBody,
  quizTitle,
  quizBody,
  questsTitle,
  questsBody,
  feathersTitle,
  feathersBody,
  feathersColBundle,
  feathersColFeathers,
  feathersColCost,
  scheduleTitle,
  scheduleBody,
  tipsTitle,
  tipsBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{tiersTitle}</SectionTitle>
        <p>{tiersBody}</p>
      </Section>

      <Section>
        <SectionTitle>{levelingTitle}</SectionTitle>
        <p>{levelingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{xpTitle}</SectionTitle>
        <p>{xpBody}</p>
        <SubSectionTitle>{quizTitle}</SubSectionTitle>
        <p>{quizBody}</p>
        <SubSectionTitle>{questsTitle}</SubSectionTitle>
        <p>{questsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{feathersTitle}</SectionTitle>
        <p>{feathersBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{feathersColBundle}</th>
                <th>{feathersColFeathers}</th>
                <th>{feathersColCost}</th>
              </tr>
            </thead>
            <tbody>
              {FEATHER_BUNDLES.map(([bundle, feathers, cost]) => (
                <tr key={bundle}>
                  <td>{bundle}</td>
                  <td>{feathers}</td>
                  <td>{cost}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{scheduleTitle}</SectionTitle>
        <p>{scheduleBody}</p>
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

const SubSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9rem;

  th,
  td {
    padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.ui.border};
  }

  th {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: #fff;
    font-weight: 600;
  }

  tr:nth-child(even) td {
    background: rgba(0, 0, 0, 0.03);
  }
`;
