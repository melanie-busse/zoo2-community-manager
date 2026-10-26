"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  overviewTitle: string;
  overviewBody: string;
  streakTitle: string;
  streakBody: string;
  chancesTitle: string;
  chancesBody: string;
  colStreak: string;
  colOdds: string;
  colChance: string;
  breedingWithTitle: string;
  breedingWithBody: string;
  donatingTitle: string;
  donatingBody: string;
  glowTitle: string;
  glowBody: string;
}

// [streak, odds, chance]
const SPARKLE_CHANCES: [number, string][] = [
  [0, "0.10%"],
  [1, "0.19%"],
  [2, "0.28%"],
  [3, "0.36%"],
  [4, "0.45%"],
  [5, "0.54%"],
  [6, "0.63%"],
  [7, "0.72%"],
  [8, "0.81%"],
  [9, "0.90%"],
  [10, "1.10%"],
];

export default function SparklingAnimalsContent({
  intro,
  overviewTitle,
  overviewBody,
  streakTitle,
  streakBody,
  chancesTitle,
  chancesBody,
  colStreak,
  colOdds,
  colChance,
  breedingWithTitle,
  breedingWithBody,
  donatingTitle,
  donatingBody,
  glowTitle,
  glowBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{overviewTitle}</SectionTitle>
        <p>{overviewBody}</p>
      </Section>

      <Section>
        <SectionTitle>{streakTitle}</SectionTitle>
        <p>{streakBody}</p>
      </Section>

      <Section>
        <SectionTitle>{chancesTitle}</SectionTitle>
        <p>{chancesBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colStreak}</th>
                <th>{colOdds}</th>
                <th>{colChance}</th>
              </tr>
            </thead>
            <tbody>
              {SPARKLE_CHANCES.map(([streak, chance], i) => (
                <tr key={i}>
                  <td>{streak}</td>
                  <td>{`1 in ${Math.round(100 / parseFloat(chance))}`}</td>
                  <td>{chance}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{breedingWithTitle}</SectionTitle>
        <p>{breedingWithBody}</p>
      </Section>

      <Section>
        <SectionTitle>{donatingTitle}</SectionTitle>
        <p>{donatingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{glowTitle}</SectionTitle>
        <p>{glowBody}</p>
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
