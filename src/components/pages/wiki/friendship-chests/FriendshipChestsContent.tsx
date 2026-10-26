"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  earningTitle: string;
  earningBody: string;
  contentsTitle: string;
  contentsBody: string;
  animalsTitle: string;
  animalsBody: string;
  animalsColAnimal: string;
  animalsColRarity: string;
  animalsColBiome: string;
  enclosuresTitle: string;
  enclosuresBody: string;
  tipsTitle: string;
  tipsBody: string;
}

const FRIENDSHIP_ANIMALS: [string, string, string][] = [
  ["Crab-Eating Raccoon", "Rare", "Jungle"],
  ["Short-Beaked Echidna", "Rare", "Grasslands"],
  ["Sitatunga", "Epic", "Grasslands"],
  ["Dingo", "Epic", "Plains"],
  ["Steenbok", "Epic", "Plains"],
];

export default function FriendshipChestsContent({
  intro,
  earningTitle,
  earningBody,
  contentsTitle,
  contentsBody,
  animalsTitle,
  animalsBody,
  animalsColAnimal,
  animalsColRarity,
  animalsColBiome,
  enclosuresTitle,
  enclosuresBody,
  tipsTitle,
  tipsBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{earningTitle}</SectionTitle>
        <p>{earningBody}</p>
      </Section>

      <Section>
        <SectionTitle>{contentsTitle}</SectionTitle>
        <p>{contentsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{animalsTitle}</SectionTitle>
        <p>{animalsBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{animalsColAnimal}</th>
                <th>{animalsColRarity}</th>
                <th>{animalsColBiome}</th>
              </tr>
            </thead>
            <tbody>
              {FRIENDSHIP_ANIMALS.map(([animal, rarity, biome]) => (
                <tr key={animal}>
                  <td>{animal}</td>
                  <td>{rarity}</td>
                  <td>{biome}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{enclosuresTitle}</SectionTitle>
        <p>{enclosuresBody}</p>
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
