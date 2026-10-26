"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  contentTitle: string;
  contentNote: string;
  terrariumTitle: string;
  terrariumLeafyTitle: string;
  terrariumRockyTitle: string;
  terrariumBuildingsTitle: string;
  terrariumFlowersTitle: string;
  terrariumTreesTitle: string;
  terrariumBoundariesTitle: string;
  terrariumSpecialTitle: string;
  aquariumTitle: string;
  aquariumFreshwaterTitle: string;
  aquariumSaltwaterTitle: string;
  aquariumBuildingsTitle: string;
  aquariumFlowersTitle: string;
  aquariumTreesTitle: string;
  aquariumBoundariesTitle: string;
  aquariumSpecialTitle: string;
  colItem: string;
  colRarity: string;
  rarityCommon: string;
  rarityRare: string;
  rarityEpic: string;
  rarityLegendary: string;
}

type ChestItem = { item: string; rarity: string };

const TERRARIUM_ITEMS: ChestItem[] = [
  { item: "Gecko Enclosure",          rarity: "Common" },
  { item: "Chameleon Enclosure",      rarity: "Common" },
  { item: "Leafy Seadragon Enclosure",rarity: "Rare" },
  { item: "Rocky Arch Decoration",    rarity: "Rare" },
  { item: "Ancient Ruins Set",        rarity: "Epic" },
  { item: "Giant Tortoise Enclosure", rarity: "Epic" },
  { item: "Komodo Dragon Enclosure",  rarity: "Legendary" },
];

const AQUARIUM_ITEMS: ChestItem[] = [
  { item: "Clownfish Tank",           rarity: "Common" },
  { item: "Tropical Fish Shoal",      rarity: "Common" },
  { item: "Seahorse Enclosure",       rarity: "Rare" },
  { item: "Coral Reef Decoration",    rarity: "Rare" },
  { item: "Manta Ray Enclosure",      rarity: "Epic" },
  { item: "Submarine Wreck",          rarity: "Epic" },
  { item: "Great White Shark Tank",   rarity: "Legendary" },
];

export default function TerraquaChestsContent({
  intro,
  contentTitle,
  contentNote,
  terrariumTitle,
  terrariumLeafyTitle,
  terrariumRockyTitle,
  terrariumBuildingsTitle,
  terrariumFlowersTitle,
  terrariumTreesTitle,
  terrariumBoundariesTitle,
  terrariumSpecialTitle,
  aquariumTitle,
  aquariumFreshwaterTitle,
  aquariumSaltwaterTitle,
  aquariumBuildingsTitle,
  aquariumFlowersTitle,
  aquariumTreesTitle,
  aquariumBoundariesTitle,
  aquariumSpecialTitle,
  colItem,
  colRarity,
}: Props) {
  const renderTable = (items: ChestItem[]) => (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <th>{colItem}</th>
            <th>{colRarity}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i}>
              <td>{row.item}</td>
              <td>{row.rarity}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );

  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{contentTitle}</SectionTitle>
        <p>{contentNote}</p>
      </Section>

      <Section>
        <SectionTitle>{terrariumTitle}</SectionTitle>
        <SubSectionTitle>{terrariumLeafyTitle}</SubSectionTitle>
        <SubSectionTitle>{terrariumRockyTitle}</SubSectionTitle>
        <SubSectionTitle>{terrariumBuildingsTitle}</SubSectionTitle>
        <SubSectionTitle>{terrariumFlowersTitle}</SubSectionTitle>
        <SubSectionTitle>{terrariumTreesTitle}</SubSectionTitle>
        <SubSectionTitle>{terrariumBoundariesTitle}</SubSectionTitle>
        <SubSectionTitle>{terrariumSpecialTitle}</SubSectionTitle>
        {renderTable(TERRARIUM_ITEMS)}
      </Section>

      <Section>
        <SectionTitle>{aquariumTitle}</SectionTitle>
        <SubSectionTitle>{aquariumFreshwaterTitle}</SubSectionTitle>
        <SubSectionTitle>{aquariumSaltwaterTitle}</SubSectionTitle>
        <SubSectionTitle>{aquariumBuildingsTitle}</SubSectionTitle>
        <SubSectionTitle>{aquariumFlowersTitle}</SubSectionTitle>
        <SubSectionTitle>{aquariumTreesTitle}</SubSectionTitle>
        <SubSectionTitle>{aquariumBoundariesTitle}</SubSectionTitle>
        <SubSectionTitle>{aquariumSpecialTitle}</SubSectionTitle>
        {renderTable(AQUARIUM_ITEMS)}
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
