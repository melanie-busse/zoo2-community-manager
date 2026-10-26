"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  obtainingTitle: string;
  obtainingBody: string;
  contentsTitle: string;
  contentsBody: string;
  dropBonusTitle: string;
  dropBonusBody: string;
  animalsTitle: string;
  animalsBody: string;
  animalsColAnimal: string;
  tipsTitle: string;
  tipsBody: string;
}

const EXCLUSIVE_ANIMALS: string[] = [
  "Swan",
  "Patas Monkey",
  "Sloth Bear",
  "Indian Rhinoceros",
  "Raccoon",
  "Shoebill",
  "Red-Crowned Crane",
  "Bongo Antelope",
  "Oryx",
  "Aardwolf",
  "American Hog-Nosed Skunk",
  "Ground Pangolin",
  "Galapagos Pink Land Iguana",
  "Red Ruffed Lemur",
  "Sulphur-Crested Cockatoo",
  "Bush Dog",
  "Whiptail Wallaby",
  "Virginia Opossum",
  "Indian Star Tortoise",
  "Ghost Bat",
  "Leopard",
  "Stoat",
  "Bearded Vulture",
  "Wapiti",
  "Dhole",
  "Ethiopian Wolf",
  "African Wild Dog",
  "Northern Red-Billed Hornbill",
  "Spotted Hyena",
  "Banded Mongoose",
  "Giant Eland",
  "Black Rhinoceros",
  "Flying Fox",
  "Sloth",
  "Orangutan",
  "Tamandua",
  "Panamanian White-Faced Capuchin",
  "Bearded Pig",
  "Short-Eared Zorro",
  "Wolverine",
  "Musk Deer",
  "Siberian Tiger",
  "Japanese Serow",
  "Beluga Whale",
  "Puffin",
  "Gharial",
  "Tiger Shark",
  "Hawksbill Sea Turtle",
];

export default function RetroChestsContent({
  intro,
  obtainingTitle,
  obtainingBody,
  contentsTitle,
  contentsBody,
  dropBonusTitle,
  dropBonusBody,
  animalsTitle,
  animalsBody,
  animalsColAnimal,
  tipsTitle,
  tipsBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{obtainingTitle}</SectionTitle>
        <p>{obtainingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{contentsTitle}</SectionTitle>
        <p>{contentsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{dropBonusTitle}</SectionTitle>
        <p>{dropBonusBody}</p>
      </Section>

      <Section>
        <SectionTitle>{animalsTitle}</SectionTitle>
        <p>{animalsBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{animalsColAnimal}</th>
              </tr>
            </thead>
            <tbody>
              {EXCLUSIVE_ANIMALS.map((animal) => (
                <tr key={animal}>
                  <td>{animal}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
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
