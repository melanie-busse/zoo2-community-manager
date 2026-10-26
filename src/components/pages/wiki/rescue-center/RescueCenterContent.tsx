"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  overviewTitle: string;
  overviewBody: string;
  unlockingTitle: string;
  unlockingBody: string;
  animalShopTitle: string;
  animalShopBody: string;
  landTitle: string;
  landBody: string;
  animalCareTitle: string;
  animalCareBody: string;
  careTypesTitle: string;
  careTypeMedication: string;
  careTypeWound: string;
  careTypePetting: string;
  careTypePlaying: string;
  careTypeFeeding: string;
  careTypeCleaning: string;
  workersTitle: string;
  workersBody: string;
  healingTitle: string;
  healingBody: string;
  transferTitle: string;
  transferBody: string;
  exclusivesTitle: string;
  exclusivesBody: string;
  colAnimal: string;
  colNotes: string;
}

type ExclusiveAnimal = { animal: string; notes: string };

const EXCLUSIVE_ANIMALS: ExclusiveAnimal[] = [
  { animal: "Bay Cat", notes: "Quest animal, max level 10" },
  { animal: "Cape Fox", notes: "Quest animal, max level 10" },
  { animal: "Greater Rhea", notes: "Quest animal, max level 10" },
  { animal: "Common Kestrel", notes: "Quest animal, max level 10" },
  { animal: "Leopard Tortoise", notes: "Quest animal, max level 10" },
  { animal: "Lop Rabbit", notes: "Quest animal, max level 10" },
  { animal: "Lop Rabbit (Gray)", notes: "Quest animal, max level 10" },
];

export default function RescueCenterContent({
  intro,
  overviewTitle,
  overviewBody,
  unlockingTitle,
  unlockingBody,
  animalShopTitle,
  animalShopBody,
  landTitle,
  landBody,
  animalCareTitle,
  animalCareBody,
  careTypesTitle,
  careTypeMedication,
  careTypeWound,
  careTypePetting,
  careTypePlaying,
  careTypeFeeding,
  careTypeCleaning,
  workersTitle,
  workersBody,
  healingTitle,
  healingBody,
  transferTitle,
  transferBody,
  exclusivesTitle,
  exclusivesBody,
  colAnimal,
  colNotes,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{overviewTitle}</SectionTitle>
        <p>{overviewBody}</p>
      </Section>

      <Section>
        <SectionTitle>{unlockingTitle}</SectionTitle>
        <p>{unlockingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{animalShopTitle}</SectionTitle>
        <p>{animalShopBody}</p>
      </Section>

      <Section>
        <SectionTitle>{landTitle}</SectionTitle>
        <p>{landBody}</p>
      </Section>

      <Section>
        <SectionTitle>{animalCareTitle}</SectionTitle>
        <p>{animalCareBody}</p>
        <SubSectionTitle>{careTypesTitle}</SubSectionTitle>
        <BulletList>
          <li>{careTypeMedication}</li>
          <li>{careTypeWound}</li>
          <li>{careTypePetting}</li>
          <li>{careTypePlaying}</li>
          <li>{careTypeFeeding}</li>
          <li>{careTypeCleaning}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{workersTitle}</SectionTitle>
        <p>{workersBody}</p>
      </Section>

      <Section>
        <SectionTitle>{healingTitle}</SectionTitle>
        <p>{healingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{transferTitle}</SectionTitle>
        <p>{transferBody}</p>
      </Section>

      <Section>
        <SectionTitle>{exclusivesTitle}</SectionTitle>
        <p>{exclusivesBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colAnimal}</th>
                <th>{colNotes}</th>
              </tr>
            </thead>
            <tbody>
              {EXCLUSIVE_ANIMALS.map((row, i) => (
                <tr key={i}>
                  <td>{row.animal}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
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
