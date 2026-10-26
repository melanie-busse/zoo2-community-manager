"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  contentTitle: string;
  contentNote: string;
  noctariumTitle: string;
  noctariumEnclosuresTitle: string;
  noctariumBuildingsTitle: string;
  noctariumFlowersTitle: string;
  noctariumBoundariesTitle: string;
  noctariumSpecialTitle: string;
  aviaryTitle: string;
  aviaryEnclosuresTitle: string;
  aviaryBuildingsTitle: string;
  aviaryFlowersTitle: string;
  aviaryBoundariesTitle: string;
  aviarySpecialTitle: string;
  colItem: string;
  colRarity: string;
  rarityCommon: string;
  rarityRare: string;
  rarityEpic: string;
  rarityLegendary: string;
  rarityUnconfirmed: string;
}

type ChestItem = { item: string; rarity: string };

const NOCTARIUM_ITEMS: ChestItem[] = [
  { item: "Bat Enclosure",         rarity: "Common" },
  { item: "Owl Enclosure",         rarity: "Common" },
  { item: "Slow Loris Enclosure",  rarity: "Rare" },
  { item: "Night Building Set",    rarity: "Rare" },
  { item: "Glowing Mushroom",      rarity: "Epic" },
  { item: "Bioluminescent Path",   rarity: "Epic" },
  { item: "Aye-aye Enclosure",     rarity: "Legendary" },
  { item: "Noctarium Trophy",      rarity: "Unconfirmed" },
];

const AVIARY_ITEMS: ChestItem[] = [
  { item: "Parrot Enclosure",      rarity: "Common" },
  { item: "Toucan Enclosure",      rarity: "Common" },
  { item: "Peacock Enclosure",     rarity: "Rare" },
  { item: "Aviary Building Set",   rarity: "Rare" },
  { item: "Tropical Flower Arch",  rarity: "Epic" },
  { item: "Bird of Paradise Plant",rarity: "Epic" },
  { item: "Hornbill Enclosure",    rarity: "Legendary" },
  { item: "Aviary Trophy",         rarity: "Unconfirmed" },
];

export default function NoctaviaChestsContent({
  intro,
  contentTitle,
  contentNote,
  noctariumTitle,
  noctariumEnclosuresTitle,
  noctariumBuildingsTitle,
  noctariumFlowersTitle,
  noctariumBoundariesTitle,
  noctariumSpecialTitle,
  aviaryTitle,
  aviaryEnclosuresTitle,
  aviaryBuildingsTitle,
  aviaryFlowersTitle,
  aviaryBoundariesTitle,
  aviarySpecialTitle,
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
        <SectionTitle>{noctariumTitle}</SectionTitle>
        <SubSectionTitle>{noctariumEnclosuresTitle}</SubSectionTitle>
        <SubSectionTitle>{noctariumBuildingsTitle}</SubSectionTitle>
        <SubSectionTitle>{noctariumFlowersTitle}</SubSectionTitle>
        <SubSectionTitle>{noctariumBoundariesTitle}</SubSectionTitle>
        <SubSectionTitle>{noctariumSpecialTitle}</SubSectionTitle>
        {renderTable(NOCTARIUM_ITEMS)}
      </Section>

      <Section>
        <SectionTitle>{aviaryTitle}</SectionTitle>
        <SubSectionTitle>{aviaryEnclosuresTitle}</SubSectionTitle>
        <SubSectionTitle>{aviaryBuildingsTitle}</SubSectionTitle>
        <SubSectionTitle>{aviaryFlowersTitle}</SubSectionTitle>
        <SubSectionTitle>{aviaryBoundariesTitle}</SubSectionTitle>
        <SubSectionTitle>{aviarySpecialTitle}</SubSectionTitle>
        {renderTable(AVIARY_ITEMS)}
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
