"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  colSeason: string;
  colStart: string;
  colStandard: string;
  colPremium: string;
  colVip: string;
}

// [season, start, standard, premium, vip]
const SEASON_HISTORY: string[][] = [
  ["Season 10", "2025-10-01", "Snow Leopard", "Arctic Fox", "Polar Bear Cub"],
  ["Season 9",  "2025-07-01", "Zebra",        "Wildebeest", "African Lion Cub"],
  ["Season 8",  "2025-04-01", "Flamingo",     "Pelican",    "Shoebill"],
  ["Season 7",  "2025-01-01", "Red Fox",      "Lynx",       "Snow Owl"],
  ["Season 6",  "2024-10-01", "Komodo Dragon","Monitor Lizard","Iguana"],
  ["Season 5",  "2024-07-01", "Capybara",     "Tapir",      "Giant Anteater"],
  ["Season 4",  "2024-04-01", "Mandrill",     "Drill",      "Gelada"],
  ["Season 3",  "2024-01-01", "Meerkat",      "Dwarf Mongoose","Banded Mongoose"],
  ["Season 2",  "2023-10-01", "Reindeer",     "Moose",      "Caribou"],
  ["Season 1",  "2023-07-01", "Giraffe",      "Okapi",      "Gerenuk"],
];

export default function SeasonPassHistoryContent({
  intro,
  colSeason,
  colStart,
  colStandard,
  colPremium,
  colVip,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>{colSeason}</th>
              <th>{colStart}</th>
              <th>{colStandard}</th>
              <th>{colPremium}</th>
              <th>{colVip}</th>
            </tr>
          </thead>
          <tbody>
            {SEASON_HISTORY.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </>
  );
}

const IntroParagraph = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  line-height: 1.6;
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
