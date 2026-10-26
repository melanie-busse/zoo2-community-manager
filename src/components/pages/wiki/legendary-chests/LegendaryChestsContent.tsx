"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  obtainingTitle: string;
  obtainingBody: string;
  contentsTitle: string;
  contentsBody: string;
  shopCartsTitle: string;
  shopCartsBody: string;
  dropBonusTitle: string;
  dropBonusBody: string;
  animalsTitle: string;
  animalsBody: string;
  animalsColAnimal: string;
  tipsTitle: string;
  tipsBody: string;
}

const SHOP_CARTS: string[] = [
  "Ice Cream Cart",
  "Drink Cart",
  "Snack Cart",
  "Souvenir Cart",
];

const EXCLUSIVE_ANIMALS: string[] = [
  "Eastern Grass Owl",
  "Angora Rabbit",
  "Ringtail",
  "Silvery Greater Galago",
  "Masai Giraffe",
  "African Golden Cat",
  "Sumatran Rhinoceros",
  "Gaur",
  "Crested Porcupine",
  "Mexican Tree Porcupine",
  "Warthog",
  "Giant Anteater",
  "Clouded Leopard",
  "Kinkajou",
  "Guereza",
  "Western Lowland Gorilla",
  "Asian Elephant",
  "Canadian Lynx",
  "Yakutian Horse",
  "Narwhal",
  "Commerson's Dolphin",
  "Humpback Whale",
];

export default function LegendaryChestsContent({
  intro,
  obtainingTitle,
  obtainingBody,
  contentsTitle,
  contentsBody,
  shopCartsTitle,
  shopCartsBody,
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
        <SubSectionTitle>{shopCartsTitle}</SubSectionTitle>
        <p>{shopCartsBody}</p>
        <BulletList>
          {SHOP_CARTS.map((cart) => (
            <li key={cart}>{cart} (Legendary)</li>
          ))}
        </BulletList>
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
