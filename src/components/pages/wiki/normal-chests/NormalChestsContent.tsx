"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  obtainingTitle: string;
  obtainingBody: string;
  costTitle: string;
  costBody: string;
  costColLevel: string;
  costColCost: string;
  contentsTitle: string;
  contentsBody: string;
  specialItemsTitle: string;
  specialItemsBody: string;
  animalsTitle: string;
  animalsBody: string;
  tipsTitle: string;
  tipsBody: string;
}

// Cost = level × 250 coins; representative sample rows
const COST_LEVELS: [number, string][] = [
  [1, "250"],
  [5, "1,250"],
  [10, "2,500"],
  [15, "3,750"],
  [20, "5,000"],
  [25, "6,250"],
  [30, "7,500"],
  [35, "8,750"],
  [40, "10,000"],
  [45, "11,250"],
  [50, "12,500"],
  [55, "13,750"],
  [60, "15,000"],
  [65, "16,250"],
  [70, "17,500"],
];

const SPECIAL_DIAMOND_ITEMS: [string, string][] = [
  ["Rose Arch", "Rare"],
  ["Pink Hibiscus", "Rare"],
  ["Animal Carousel", "Legendary"],
  ["BBQ Place", "Epic"],
];

export default function NormalChestsContent({
  intro,
  obtainingTitle,
  obtainingBody,
  costTitle,
  costBody,
  costColLevel,
  costColCost,
  contentsTitle,
  contentsBody,
  specialItemsTitle,
  specialItemsBody,
  animalsTitle,
  animalsBody,
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
        <SectionTitle>{costTitle}</SectionTitle>
        <p>{costBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{costColLevel}</th>
                <th>{costColCost}</th>
              </tr>
            </thead>
            <tbody>
              {COST_LEVELS.map(([level, cost]) => (
                <tr key={level}>
                  <td>{level}</td>
                  <td>{cost}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{contentsTitle}</SectionTitle>
        <p>{contentsBody}</p>
        <SubSectionTitle>{specialItemsTitle}</SubSectionTitle>
        <p>{specialItemsBody}</p>
        <BulletList>
          {SPECIAL_DIAMOND_ITEMS.map(([item, rarity]) => (
            <li key={item}>
              {item} ({rarity})
            </li>
          ))}
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{animalsTitle}</SectionTitle>
        <p>{animalsBody}</p>
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
