"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  overviewTitle: string;
  overviewBody: string;
  accessTitle: string;
  accessBody: string;
  connectedTitle: string;
  connectedBody: string;
  colTerrain: string;
  colMainZoo: string;
  colFirGrove: string;
  colKujaliPark: string;
  colOceanside: string;
  colPolarPark: string;
  colRainforestPark: string;
  colRescueCenter: string;
  disconnectedTitle: string;
  disconnectedBody: string;
  colTerrarium: string;
  colAquarium: string;
  colNoctarium: string;
  visualsTitle: string;
  visualsBody: string;
}

// [terrain, mainZoo, firGrove, kujali, oceanside, polar, rainforest, rescue]
const TERRAIN_COSTS: string[][] = [
  ["Snow",         "5",  "5",  "—",  "—",  "5",  "—",  "—"],
  ["Sand",         "5",  "—",  "5",  "5",  "—",  "—",  "—"],
  ["Dirt",         "3",  "3",  "3",  "—",  "—",  "3",  "3"],
  ["Grass",        "3",  "3",  "3",  "3",  "—",  "3",  "3"],
  ["Gravel",       "4",  "4",  "4",  "—",  "4",  "4",  "4"],
  ["Stone Tiles",  "5",  "5",  "5",  "5",  "5",  "5",  "5"],
  ["Cobblestone",  "5",  "5",  "5",  "—",  "5",  "5",  "5"],
  ["Wood Planks",  "6",  "6",  "6",  "6",  "—",  "6",  "6"],
];

// [terrain, terrarium, aquarium, noctarium]
const DISCONNECTED_COSTS: string[][] = [
  ["Desert Sand",    "5",  "—",  "—"],
  ["Stone Floor",    "4",  "4",  "4"],
  ["Dark Soil",      "3",  "3",  "3"],
  ["Mossy Stone",    "—",  "—",  "5"],
  ["Shallow Water",  "—",  "5",  "—"],
  ["Gravel",         "4",  "4",  "4"],
];

export default function TerrainEditorContent({
  intro,
  overviewTitle,
  overviewBody,
  accessTitle,
  accessBody,
  connectedTitle,
  connectedBody,
  colTerrain,
  colMainZoo,
  colFirGrove,
  colKujaliPark,
  colOceanside,
  colPolarPark,
  colRainforestPark,
  colRescueCenter,
  disconnectedTitle,
  disconnectedBody,
  colTerrarium,
  colAquarium,
  colNoctarium,
  visualsTitle,
  visualsBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{overviewTitle}</SectionTitle>
        <p>{overviewBody}</p>
      </Section>

      <Section>
        <SectionTitle>{accessTitle}</SectionTitle>
        <p>{accessBody}</p>
      </Section>

      <Section>
        <SectionTitle>{connectedTitle}</SectionTitle>
        <p>{connectedBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colTerrain}</th>
                <th>{colMainZoo}</th>
                <th>{colFirGrove}</th>
                <th>{colKujaliPark}</th>
                <th>{colOceanside}</th>
                <th>{colPolarPark}</th>
                <th>{colRainforestPark}</th>
                <th>{colRescueCenter}</th>
              </tr>
            </thead>
            <tbody>
              {TERRAIN_COSTS.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{disconnectedTitle}</SectionTitle>
        <p>{disconnectedBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colTerrain}</th>
                <th>{colTerrarium}</th>
                <th>{colAquarium}</th>
                <th>{colNoctarium}</th>
              </tr>
            </thead>
            <tbody>
              {DISCONNECTED_COSTS.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{visualsTitle}</SectionTitle>
        <p>{visualsBody}</p>
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
