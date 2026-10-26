"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  howItWorksTitle: string;
  howItWorksBody: string;
  rewardsTitle: string;
  rewardsBody: string;
  colDay: string;
  colReward: string;
  year2025: string;
  year2024: string;
  year2023: string;
  year2022: string;
  year2021: string;
  year2020: string;
  year2019: string;
  year2018: string;
  summary2025: string;
  summary2024: string;
  summary2023: string;
  summary2022: string;
}

type DayReward = { day: number; reward: string };

const ADVENT_2021: DayReward[] = [
  { day: 1, reward: "Reindeer card piece" },
  { day: 2, reward: "5 diamonds" },
  { day: 3, reward: "Snow Leopard card piece" },
  { day: 4, reward: "Poinsettia decoration" },
  { day: 5, reward: "Reindeer card piece" },
  { day: 6, reward: "Snow Leopard card piece" },
  { day: 7, reward: "5 diamonds" },
  { day: 8, reward: "Reindeer card piece" },
  { day: 9, reward: "Poitou Donkey card piece" },
  { day: 10, reward: "Snow Leopard card piece" },
  { day: 11, reward: "5 diamonds" },
  { day: 12, reward: "Reindeer card piece" },
  { day: 13, reward: "Santa Sculpture piece" },
  { day: 14, reward: "Poitou Donkey card piece" },
  { day: 15, reward: "Snow Leopard card piece" },
  { day: 16, reward: "5 diamonds" },
  { day: 17, reward: "Reindeer card piece" },
  { day: 18, reward: "Ice Swan card piece" },
  { day: 19, reward: "Poitou Donkey card piece" },
  { day: 20, reward: "Snow Leopard card piece" },
  { day: 21, reward: "5 diamonds" },
  { day: 22, reward: "Ice Swan card piece" },
  { day: 23, reward: "Poitou Donkey card piece" },
  { day: 24, reward: "Reindeer card piece" },
  { day: 25, reward: "Retro Chest" },
  { day: 26, reward: "10 diamonds" },
  { day: 27, reward: "Ice Swan card piece" },
  { day: 28, reward: "Legendary Chest" },
  { day: 29, reward: "10 diamonds" },
  { day: 30, reward: "Ice Swan card piece" },
  { day: 31, reward: "Santa Sculpture piece" },
];

const ADVENT_2020: DayReward[] = [
  { day: 1, reward: "Candy Cane decoration" },
  { day: 2, reward: "5 diamonds" },
  { day: 3, reward: "Poinsettia decoration" },
  { day: 4, reward: "Rocky Mountain Goat card piece" },
  { day: 5, reward: "Santa Sculpture piece" },
  { day: 6, reward: "Snow Leopard card piece" },
  { day: 7, reward: "5 diamonds" },
  { day: 8, reward: "Ice Tree decoration" },
  { day: 9, reward: "Rocky Mountain Goat card piece" },
  { day: 10, reward: "Snow Leopard card piece" },
  { day: 11, reward: "5 diamonds" },
  { day: 12, reward: "Reindeer card piece" },
  { day: 13, reward: "Rocky Mountain Goat card piece" },
  { day: 14, reward: "Snow Leopard card piece" },
  { day: 15, reward: "5 diamonds" },
  { day: 16, reward: "Ice Swan card piece" },
  { day: 17, reward: "Rocky Mountain Goat card piece" },
  { day: 18, reward: "Reindeer card piece" },
  { day: 19, reward: "5 diamonds" },
  { day: 20, reward: "Ice Swan card piece" },
  { day: 21, reward: "Rocky Mountain Goat card piece" },
  { day: 22, reward: "Reindeer card piece" },
  { day: 23, reward: "Snow Leopard card piece" },
  { day: 24, reward: "Ice Swan card piece" },
  { day: 25, reward: "Retro Chest" },
  { day: 26, reward: "10 diamonds" },
  { day: 27, reward: "Reindeer card piece" },
  { day: 28, reward: "Legendary Chest" },
  { day: 29, reward: "Rocky Mountain Goat card piece" },
  { day: 30, reward: "10 diamonds" },
  { day: 31, reward: "Rocky Mountain Goat card piece" },
];

const ADVENT_2019: DayReward[] = [
  { day: 1, reward: "Ice Swan card piece" },
  { day: 2, reward: "Icy Path decoration" },
  { day: 3, reward: "Candy Cane decoration" },
  { day: 4, reward: "Rare Chest" },
  { day: 5, reward: "Reindeer card piece" },
  { day: 6, reward: "Ice Swan card piece" },
  { day: 7, reward: "Snowman card piece" },
  { day: 8, reward: "Ice Tree decoration" },
  { day: 9, reward: "Reindeer card piece" },
  { day: 10, reward: "Christmas Sleigh card piece" },
  { day: 11, reward: "Rare Chest" },
  { day: 12, reward: "Ice Swan card piece" },
  { day: 13, reward: "Snowman card piece" },
  { day: 14, reward: "Reindeer card piece" },
  { day: 15, reward: "Rare Chest" },
  { day: 16, reward: "Christmas Sleigh card piece" },
  { day: 17, reward: "Ice Swan card piece" },
  { day: 18, reward: "Snowman card piece" },
  { day: 19, reward: "Reindeer card piece" },
  { day: 20, reward: "Rare Chest" },
  { day: 21, reward: "Christmas Sleigh card piece" },
  { day: 22, reward: "Ice Swan card piece" },
  { day: 23, reward: "Legendary Chest" },
  { day: 24, reward: "Safari Restaurant card piece" },
  { day: 25, reward: "Retro Chest" },
  { day: 26, reward: "Christmas Sleigh card piece" },
  { day: 27, reward: "Retro Chest" },
  { day: 28, reward: "Iced Cream Cart card piece" },
  { day: 29, reward: "Rare Chest" },
  { day: 30, reward: "Christmas Sleigh card piece" },
  { day: 31, reward: "Rare Chest" },
];

const ADVENT_2018: DayReward[] = [
  { day: 1, reward: "Ice Swan card pieces" },
  { day: 2, reward: "Ice Tree card pieces" },
  { day: 3, reward: "Gold pieces" },
  { day: 4, reward: "Gems" },
  { day: 5, reward: "Candy Cane card pieces" },
  { day: 6, reward: "Red Panda card pieces" },
  { day: 7, reward: "Garbageman" },
  { day: 8, reward: "Tickets" },
  { day: 9, reward: "Ice Tree card pieces" },
  { day: 10, reward: "Normal Chest" },
  { day: 11, reward: "Ice Swan card pieces" },
  { day: 12, reward: "Gems" },
  { day: 13, reward: "Healer" },
  { day: 14, reward: "Giraffe card pieces" },
  { day: 15, reward: "Rare Chest" },
  { day: 16, reward: "Ice Swan card pieces" },
  { day: 17, reward: "Gold pieces" },
  { day: 18, reward: "Safari Restaurant card piece" },
  { day: 19, reward: "Giraffe card pieces" },
  { day: 20, reward: "Gems" },
  { day: 21, reward: "Rare Chest" },
  { day: 22, reward: "Red Panda card pieces" },
  { day: 23, reward: "Tickets" },
  { day: 24, reward: "Ice Swan card pieces" },
  { day: 25, reward: "Rare Chest" },
  { day: 26, reward: "Giraffe card pieces" },
  { day: 27, reward: "Gold pieces" },
  { day: 28, reward: "Rare Chest" },
  { day: 29, reward: "Gems" },
  { day: 30, reward: "Ice Swan card pieces" },
  { day: 31, reward: "Normal Chest" },
];

type YearEntry = { year: string; data: DayReward[] };

const DETAILED_YEARS: YearEntry[] = [
  { year: "2021", data: ADVENT_2021 },
  { year: "2020", data: ADVENT_2020 },
  { year: "2019", data: ADVENT_2019 },
  { year: "2018", data: ADVENT_2018 },
];

export default function AdventCalendarContent({
  intro,
  howItWorksTitle,
  howItWorksBody,
  rewardsTitle,
  rewardsBody,
  colDay,
  colReward,
  year2025,
  year2024,
  year2023,
  year2022,
  year2021,
  year2020,
  year2019,
  year2018,
  summary2025,
  summary2024,
  summary2023,
  summary2022,
}: Props) {
  const summaryYears = [
    { label: year2025, summary: summary2025 },
    { label: year2024, summary: summary2024 },
    { label: year2023, summary: summary2023 },
    { label: year2022, summary: summary2022 },
  ];

  const detailedLabels: Record<string, string> = {
    "2021": year2021,
    "2020": year2020,
    "2019": year2019,
    "2018": year2018,
  };

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

        {summaryYears.map(({ label, summary }) => (
          <div key={label}>
            <SubSectionTitle>{label}</SubSectionTitle>
            <p>{summary}</p>
          </div>
        ))}

        {DETAILED_YEARS.map(({ year, data }) => (
          <div key={year}>
            <SubSectionTitle>{detailedLabels[year]}</SubSectionTitle>
            <TableWrapper>
              <StyledTable>
                <thead>
                  <tr>
                    <th>{colDay}</th>
                    <th>{colReward}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.day}>
                      <td>{row.day}</td>
                      <td>{row.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableWrapper>
          </div>
        ))}
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
