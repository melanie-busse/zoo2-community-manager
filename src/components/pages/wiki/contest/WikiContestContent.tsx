"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  descriptionTitle: string;
  descriptionP1: string;
  descriptionP2: string;
  descriptionP3: string;
  descriptionP4: string;
  newMembersTitle: string;
  newMembersBody: string;
  donationTitle: string;
  donationIntro: string;
  contestPointsTitle: string;
  contestPointsBody: string;
  memberPointsTitle: string;
  memberPointsBody: string;
  rankBonusTitle: string;
  rankBonusIntro: string;
  rewardsTitle: string;
  rewardsBody: string;
  statueRewardsTitle: string;
  specialCoatRewardsTitle: string;
  colRank: string;
  colMultiplier: string;
  colGuildExp: string;
  colPuzzlePct: string;
  colAnimalPurchases: string;
}

const STATUE_REWARDS: [string, number, number][] = [
  ["1", 10000, 100],
  ["2", 9000, 99],
  ["3", 8000, 98],
  ["4", 5500, 97],
  ["5", 5000, 96],
  ["6", 4500, 95],
  ["7", 4000, 94],
  ["8", 3500, 93],
  ["9", 3000, 92],
  ["10", 2500, 91],
  ["11–25", 1500, 80],
  ["26–50", 1500, 65],
  ["51–75", 1500, 50],
  ["76–100", 1500, 20],
  ["101–500", 1250, 1],
  ["501–1000", 1000, 1],
  ["1001–1500", 750, 1],
  ["1501+", 500, 1],
];

const SPECIAL_COAT_REWARDS: [string, number, number][] = [
  ["1", 10000, 200],
  ["2", 9000, 190],
  ["3", 8000, 180],
  ["4", 5500, 170],
  ["5", 5000, 160],
  ["6", 4500, 150],
  ["7", 4000, 140],
  ["8", 3500, 130],
  ["9", 3000, 120],
  ["10", 2500, 110],
  ["11–25", 1500, 100],
  ["26–50", 1500, 90],
  ["51–75", 1500, 80],
  ["76–100", 1500, 70],
  ["101–200", 1250, 60],
  ["201–300", 1200, 50],
  ["301–400", 1150, 40],
  ["401–500", 1100, 30],
  ["501–600", 1050, 20],
  ["601–700", 1000, 10],
  ["701–800", 950, 9],
  ["801–900", 900, 8],
  ["901–1000", 850, 7],
  ["1001–1100", 800, 6],
  ["1101–1200", 750, 5],
  ["1201–1300", 700, 4],
  ["1301–1400", 650, 3],
  ["1401–1500", 600, 2],
  ["1501+", 550, 1],
];

export default function ContestFaqContent({
  intro,
  descriptionTitle,
  descriptionP1,
  descriptionP2,
  descriptionP3,
  descriptionP4,
  newMembersTitle,
  newMembersBody,
  donationTitle,
  donationIntro,
  contestPointsTitle,
  contestPointsBody,
  memberPointsTitle,
  memberPointsBody,
  rankBonusTitle,
  rankBonusIntro,
  rewardsTitle,
  rewardsBody,
  statueRewardsTitle,
  specialCoatRewardsTitle,
  colRank,
  colMultiplier,
  colGuildExp,
  colPuzzlePct,
  colAnimalPurchases,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{descriptionTitle}</SectionTitle>
        <p>{descriptionP1}</p>
        <p>{descriptionP2}</p>
        <p>{descriptionP3}</p>
        <p>{descriptionP4}</p>
      </Section>

      <Section>
        <SectionTitle>{newMembersTitle}</SectionTitle>
        <p>{newMembersBody}</p>
      </Section>

      <Section>
        <SectionTitle>{donationTitle}</SectionTitle>
        <p>{donationIntro}</p>
        <SubSectionTitle>{contestPointsTitle}</SubSectionTitle>
        <p>{contestPointsBody}</p>
        <SubSectionTitle>{memberPointsTitle}</SubSectionTitle>
        <p>{memberPointsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{rankBonusTitle}</SectionTitle>
        <p>{rankBonusIntro}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colRank}</th>
                <th>{colMultiplier}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>×4</td></tr>
              <tr><td>2</td><td>×3</td></tr>
              <tr><td>3</td><td>×2</td></tr>
              <tr><td>4+</td><td>×1</td></tr>
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{rewardsTitle}</SectionTitle>
        <p>{rewardsBody}</p>

        <SubSectionTitle>{statueRewardsTitle}</SubSectionTitle>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colRank}</th>
                <th>{colGuildExp}</th>
                <th>{colPuzzlePct}</th>
              </tr>
            </thead>
            <tbody>
              {STATUE_REWARDS.map(([rank, exp, puzzle]) => (
                <tr key={rank}>
                  <td>{rank}</td>
                  <td>{exp.toLocaleString()}</td>
                  <td>{puzzle}%</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>

        <SubSectionTitle>{specialCoatRewardsTitle}</SubSectionTitle>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colRank}</th>
                <th>{colGuildExp}</th>
                <th>{colAnimalPurchases}</th>
              </tr>
            </thead>
            <tbody>
              {SPECIAL_COAT_REWARDS.map(([rank, exp, purchases]) => (
                <tr key={rank}>
                  <td>{rank}</td>
                  <td>{exp.toLocaleString()}</td>
                  <td>{purchases}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
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
  max-width: 500px;
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
