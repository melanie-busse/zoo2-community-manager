"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  membershipTitle: string;
  membershipBody: string;
  stampsTitle: string;
  stampsBody: string;
  masteryTitle: string;
  masteryBody: string;
  tasksTitle: string;
  tasksBody: string;
  tipsTitle: string;
  tipsIntro: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
  tip5: string;
  colMembership: string;
  colDuration: string;
  colStartup: string;
  colExtend: string;
  colStamps: string;
  colCostPerStamp: string;
}

const MEMBERSHIP_COSTS: {
  tier: string;
  duration: string;
  startup: string;
  extend: string;
  stamps: string;
  costPerStamp: string;
}[] = [
  { tier: "Bronze", duration: "1 day",   startup: "0 💎",   extend: "8 💎",   stamps: "—",  costPerStamp: "—" },
  { tier: "Bronze", duration: "7 days",  startup: "0 💎",   extend: "32 💎",  stamps: "—",  costPerStamp: "—" },
  { tier: "Bronze", duration: "30 days", startup: "79 💎",  extend: "55 💎",  stamps: "1",  costPerStamp: "55 💎" },
  { tier: "Silver", duration: "1 day",   startup: "0 💎",   extend: "22 💎",  stamps: "—",  costPerStamp: "—" },
  { tier: "Silver", duration: "7 days",  startup: "0 💎",   extend: "90 💎",  stamps: "1",  costPerStamp: "90 💎" },
  { tier: "Silver", duration: "30 days", startup: "224 💎", extend: "171 💎", stamps: "3",  costPerStamp: "57 💎" },
  { tier: "Gold",   duration: "1 day",   startup: "0 💎",   extend: "33 💎",  stamps: "—",  costPerStamp: "—" },
  { tier: "Gold",   duration: "7 days",  startup: "0 💎",   extend: "147 💎", stamps: "3",  costPerStamp: "49 💎" },
  { tier: "Gold",   duration: "30 days", startup: "336 💎", extend: "287 💎", stamps: "5",  costPerStamp: "57 💎" },
  { tier: "Platinum", duration: "1 day",   startup: "0 💎",   extend: "49 💎",  stamps: "1",  costPerStamp: "49 💎" },
  { tier: "Platinum", duration: "7 days",  startup: "0 💎",   extend: "209 💎", stamps: "4",  costPerStamp: "52 💎" },
  { tier: "Platinum", duration: "30 days", startup: "499 💎", extend: "367 💎", stamps: "7",  costPerStamp: "52 💎" },
];

export default function AcademyFaqContent({
  intro,
  membershipTitle,
  membershipBody,
  stampsTitle,
  stampsBody,
  masteryTitle,
  masteryBody,
  tasksTitle,
  tasksBody,
  tipsTitle,
  tipsIntro,
  tip1,
  tip2,
  tip3,
  tip4,
  tip5,
  colMembership,
  colDuration,
  colStartup,
  colExtend,
  colStamps,
  colCostPerStamp,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{membershipTitle}</SectionTitle>
        <p>{membershipBody}</p>
      </Section>

      <Section>
        <SectionTitle>{stampsTitle}</SectionTitle>
        <p>{stampsBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colMembership}</th>
                <th>{colDuration}</th>
                <th>{colStartup}</th>
                <th>{colExtend}</th>
                <th>{colStamps}</th>
                <th>{colCostPerStamp}</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERSHIP_COSTS.map((row, i) => (
                <tr key={i}>
                  <td>{row.tier}</td>
                  <td>{row.duration}</td>
                  <td>{row.startup}</td>
                  <td>{row.extend}</td>
                  <td>{row.stamps}</td>
                  <td>{row.costPerStamp}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{masteryTitle}</SectionTitle>
        <p>{masteryBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tasksTitle}</SectionTitle>
        <p>{tasksBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tipsTitle}</SectionTitle>
        <p>{tipsIntro}</p>
        <TipList>
          <li>{tip1}</li>
          <li>{tip2}</li>
          <li>{tip3}</li>
          <li>{tip4}</li>
          <li>{tip5}</li>
        </TipList>
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

const TipList = styled.ul`
  padding-left: ${({ theme }) => theme.spacing(3)};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
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
    white-space: nowrap;
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
