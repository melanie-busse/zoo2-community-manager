"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  requirementsTitle: string;
  requirementsBody: string;
  howToBreedTitle: string;
  howToBreedBody: string;
  gestationTitle: string;
  gestationBody: string;
  simultaneousTitle: string;
  simultaneousBody: string;
  twinsTitle: string;
  twinsBody: string;
  growingUpTitle: string;
  growingUpBody: string;
  powerGrowthTitle: string;
  powerGrowthBody: string;
  reducingTimeTitle: string;
  reducingTimeBody: string;
  reducingRestTitle: string;
  reducingRestBody: string;
  bonusesTitle: string;
  bonusesBody: string;
  bonusTypesTitle: string;
  bonusClub: string;
  bonusAcademy: string;
  bonusFertility: string;
  bonusFailed: string;
  bonusRegion: string;
  specialCoatsTitle: string;
  specialCoatsBody: string;
  animalLevelsTitle: string;
  animalLevelsBody: string;
  animalXpTitle: string;
  animalXpBody: string;
  regionBonusTitle: string;
  regionBonusBody: string;
  colRegion: string;
  colBiome: string;
  gestationTableTitle: string;
  colSpecies: string;
  colGestation: string;
}

const REGION_BIOMES: string[][] = [
  ["Main Zoo",          "All biomes"],
  ["Fir Grove",         "Forest"],
  ["Kujali Park",       "Plains & Savanna"],
  ["Oceanside Zoo",     "Water"],
  ["Polar Park",        "Ice"],
  ["Rainforest Park",   "Jungle"],
];

const SAMPLE_GESTATION: string[][] = [
  ["Lion",       "4h"],
  ["Elephant",   "8h"],
  ["Penguin",    "2h"],
  ["Giraffe",    "6h"],
  ["Crocodile",  "16h"],
];

export default function BreedingContent({
  intro,
  requirementsTitle,
  requirementsBody,
  howToBreedTitle,
  howToBreedBody,
  gestationTitle,
  gestationBody,
  simultaneousTitle,
  simultaneousBody,
  twinsTitle,
  twinsBody,
  growingUpTitle,
  growingUpBody,
  powerGrowthTitle,
  powerGrowthBody,
  reducingTimeTitle,
  reducingTimeBody,
  reducingRestTitle,
  reducingRestBody,
  bonusesTitle,
  bonusesBody,
  bonusTypesTitle,
  bonusClub,
  bonusAcademy,
  bonusFertility,
  bonusFailed,
  bonusRegion,
  specialCoatsTitle,
  specialCoatsBody,
  animalLevelsTitle,
  animalLevelsBody,
  animalXpTitle,
  animalXpBody,
  regionBonusTitle,
  regionBonusBody,
  colRegion,
  colBiome,
  gestationTableTitle,
  colSpecies,
  colGestation,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{requirementsTitle}</SectionTitle>
        <p>{requirementsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{howToBreedTitle}</SectionTitle>
        <p>{howToBreedBody}</p>
      </Section>

      <Section>
        <SectionTitle>{gestationTitle}</SectionTitle>
        <p>{gestationBody}</p>
        <SubSectionTitle>{gestationTableTitle}</SubSectionTitle>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colSpecies}</th>
                <th>{colGestation}</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_GESTATION.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{simultaneousTitle}</SectionTitle>
        <p>{simultaneousBody}</p>
      </Section>

      <Section>
        <SectionTitle>{twinsTitle}</SectionTitle>
        <p>{twinsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{growingUpTitle}</SectionTitle>
        <p>{growingUpBody}</p>
      </Section>

      <Section>
        <SectionTitle>{powerGrowthTitle}</SectionTitle>
        <p>{powerGrowthBody}</p>
      </Section>

      <Section>
        <SectionTitle>{reducingTimeTitle}</SectionTitle>
        <p>{reducingTimeBody}</p>
        <SubSectionTitle>{reducingRestTitle}</SubSectionTitle>
        <p>{reducingRestBody}</p>
      </Section>

      <Section>
        <SectionTitle>{bonusesTitle}</SectionTitle>
        <p>{bonusesBody}</p>
        <SubSectionTitle>{bonusTypesTitle}</SubSectionTitle>
        <BulletList>
          <li>{bonusClub}</li>
          <li>{bonusAcademy}</li>
          <li>{bonusFertility}</li>
          <li>{bonusFailed}</li>
          <li>{bonusRegion}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{regionBonusTitle}</SectionTitle>
        <p>{regionBonusBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colRegion}</th>
                <th>{colBiome}</th>
              </tr>
            </thead>
            <tbody>
              {REGION_BIOMES.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{specialCoatsTitle}</SectionTitle>
        <p>{specialCoatsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{animalLevelsTitle}</SectionTitle>
        <p>{animalLevelsBody}</p>
        <SubSectionTitle>{animalXpTitle}</SubSectionTitle>
        <p>{animalXpBody}</p>
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

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
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
