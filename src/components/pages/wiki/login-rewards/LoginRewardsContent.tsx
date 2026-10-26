"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  howItWorksTitle: string;
  howItWorksBody: string;
  monthlyRewardsTitle: string;
  monthlyRewardsBody: string;
  colMonth: string;
  colAnimal1: string;
  colAnimal2: string;
  colChests: string;
  adventTitle: string;
  adventBody: string;
}

type LoginRewardEntry = { year: number; month: string; animal1: string; animal2: string; chests: string };

const LOGIN_REWARDS: LoginRewardEntry[] = [
  { year: 2026, month: "October", animal1: "Reticulated Python", animal2: "Jungle Cat", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "September", animal1: "Southern Cassowary", animal2: "Spotted Skunk", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2026, month: "August", animal1: "Indian Cobra", animal2: "Serval", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "July", animal1: "Komodo Dragon", animal2: "Komodo Dragon (variant)", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "June", animal1: "Golden-Bellied Mangabey", animal2: "Wild Boar", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "May", animal1: "Mountain Nyala", animal2: "Flamingo", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "April", animal1: "Japanese Macaque", animal2: "Red Panda", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "March", animal1: "Shetland Pony", animal2: "Spotted Skunk", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "February", animal1: "Alligator Snapping Turtle", animal2: "Common Ostrich", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2026, month: "January", animal1: "Capybara", animal2: "African Elephant", chests: "1 Legendary Chest, 1 Epic Chest" },
  { year: 2025, month: "November", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "October", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "September", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "August", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "July", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "June", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "May", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "April", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "March", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "February", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2025, month: "January", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "November", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "October", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "September", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "August", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "July", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "June", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "May", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "April", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "March", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "February", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2024, month: "January", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "November", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "October", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "September", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "August", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "July", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "June", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "May", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "April", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "March", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "February", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2023, month: "January", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "November", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "October", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "September", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "August", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "July", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "June", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "May", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "April", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "March", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "February", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2022, month: "January", animal1: "—", animal2: "—", chests: "1 Retro Chest, 1 Epic Chest" },
  { year: 2021, month: "November", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "October", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "September", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "August", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "July", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "June", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "May", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "April", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "March", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "February", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2021, month: "January", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "November", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "October", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "September", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "August", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "July", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "June", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "May", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "April", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "March", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "February", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
  { year: 2020, month: "January", animal1: "—", animal2: "—", chests: "1 Retro Chest" },
];

const YEARS = [...new Set(LOGIN_REWARDS.map((r) => r.year))].sort((a, b) => b - a);

export default function LoginRewardsContent({
  intro,
  howItWorksTitle,
  howItWorksBody,
  monthlyRewardsTitle,
  monthlyRewardsBody,
  colMonth,
  colAnimal1,
  colAnimal2,
  colChests,
  adventTitle,
  adventBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{howItWorksTitle}</SectionTitle>
        <p>{howItWorksBody}</p>
      </Section>

      <Section>
        <SectionTitle>{monthlyRewardsTitle}</SectionTitle>
        <p>{monthlyRewardsBody}</p>
        {YEARS.map((year) => (
          <div key={year}>
            <SubSectionTitle>{year}</SubSectionTitle>
            <TableWrapper>
              <StyledTable>
                <thead>
                  <tr>
                    <th>{colMonth}</th>
                    <th>{colAnimal1}</th>
                    <th>{colAnimal2}</th>
                    <th>{colChests}</th>
                  </tr>
                </thead>
                <tbody>
                  {LOGIN_REWARDS.filter((r) => r.year === year).map((row, i) => (
                    <tr key={i}>
                      <td>{row.month}</td>
                      <td>{row.animal1}</td>
                      <td>{row.animal2}</td>
                      <td>{row.chests}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableWrapper>
          </div>
        ))}
      </Section>

      <Section>
        <SectionTitle>{adventTitle}</SectionTitle>
        <p>{adventBody}</p>
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
