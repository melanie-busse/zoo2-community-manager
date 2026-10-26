"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  howItWorksTitle: string;
  howItWorksBody: string;
  rewardsTitle: string;
  rewardsBody: string;
  rewardsListTitle: string;
  rewardCoinChest: string;
  rewardTickets: string;
  rewardEnergy: string;
  rewardCoinsSmall: string;
  rewardCoinsLarge: string;
  rewardExclusive: string;
  timerTitle: string;
  timerBody: string;
  timerColSpins: string;
  timerColTimer: string;
  resetTitle: string;
  resetBody: string;
  tipsTitle: string;
  tipsBody: string;
}

// Representative milestone rows from the 720-row spin timer table
// Each spin adds 2 minutes; spin 1 = 3 min, spin 2 = 5 min, etc.
const TIMER_MILESTONES: [number, string][] = [
  [1, "3 min"],
  [7, "15 min"],
  [15, "31 min"],
  [21, "43 min"],
  [26, "53 min"],
  [32, "1h 5 min"],
  [37, "1h 15 min"],
  [53, "1h 47 min"],
  [65, "2h 11 min"],
  [100, "3h 21 min"],
  [141, "4h 43 min"],
  [173, "5h 47 min"],
  [207, "6h 55 min"],
  [254, "8h 29 min"],
  [293, "9h 47 min"],
  [360, "12h 1 min"],
  [480, "16h 1 min"],
  [600, "20h 1 min"],
  [660, "22h 1 min"],
  [720, "24h (max)"],
];

export default function PrizeWheelContent({
  intro,
  howItWorksTitle,
  howItWorksBody,
  rewardsTitle,
  rewardsBody,
  rewardsListTitle,
  rewardCoinChest,
  rewardTickets,
  rewardEnergy,
  rewardCoinsSmall,
  rewardCoinsLarge,
  rewardExclusive,
  timerTitle,
  timerBody,
  timerColSpins,
  timerColTimer,
  resetTitle,
  resetBody,
  tipsTitle,
  tipsBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{howItWorksTitle}</SectionTitle>
        <p>{howItWorksBody}</p>
      </Section>

      <Section>
        <SectionTitle>{rewardsTitle}</SectionTitle>
        <p>{rewardsBody}</p>
        <SubSectionTitle>{rewardsListTitle}</SubSectionTitle>
        <BulletList>
          <li>{rewardCoinChest}</li>
          <li>{rewardTickets}</li>
          <li>{rewardEnergy}</li>
          <li>{rewardCoinsSmall}</li>
          <li>{rewardCoinsLarge}</li>
          <li>{rewardExclusive}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{timerTitle}</SectionTitle>
        <p>{timerBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{timerColSpins}</th>
                <th>{timerColTimer}</th>
              </tr>
            </thead>
            <tbody>
              {TIMER_MILESTONES.map(([spins, timer]) => (
                <tr key={spins}>
                  <td>{spins}</td>
                  <td>{timer}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{resetTitle}</SectionTitle>
        <p>{resetBody}</p>
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

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
