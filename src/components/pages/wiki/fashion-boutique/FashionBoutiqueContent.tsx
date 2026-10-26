"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  buildingTitle: string;
  buildingBody: string;
  findingAvatarTitle: string;
  findingAvatarBody: string;
  collectingGiftsTitle: string;
  collectingGiftsBody: string;
  customizingTitle: string;
  customizingBody: string;
  clothesTitle: string;
  clothesBody: string;
  rewardItemsTitle: string;
  rewardItemsBody: string;
  colItem: string;
  colGender: string;
  colValue: string;
  colHow: string;
  accessoriesTitle: string;
  hatsTitle: string;
  topsTitle: string;
  bottomsTitle: string;
  shoesTitle: string;
  outfitsTitle: string;
}

type AccessoryEntry = { item: string; gender: string; value: string; how: string };

const ACCESSORIES: AccessoryEntry[] = [
  { item: "Zookeeper Hat", gender: "All", value: "Common", how: "Login Reward" },
  { item: "Panda Ears Headband", gender: "All", value: "Rare", how: "Season Pass" },
  { item: "Safari Sunglasses", gender: "All", value: "Common", how: "Fashion Boutique" },
  { item: "Flower Crown", gender: "All", value: "Rare", how: "Event Reward" },
  { item: "Butterfly Clip", gender: "All", value: "Common", how: "Fashion Boutique" },
];

export default function FashionBoutiqueContent({
  intro,
  buildingTitle,
  buildingBody,
  findingAvatarTitle,
  findingAvatarBody,
  collectingGiftsTitle,
  collectingGiftsBody,
  customizingTitle,
  customizingBody,
  clothesTitle,
  clothesBody,
  rewardItemsTitle,
  rewardItemsBody,
  colItem,
  colGender,
  colValue,
  colHow,
  accessoriesTitle,
  hatsTitle,
  topsTitle,
  bottomsTitle,
  shoesTitle,
  outfitsTitle,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{buildingTitle}</SectionTitle>
        <p>{buildingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{findingAvatarTitle}</SectionTitle>
        <p>{findingAvatarBody}</p>
      </Section>

      <Section>
        <SectionTitle>{collectingGiftsTitle}</SectionTitle>
        <p>{collectingGiftsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{customizingTitle}</SectionTitle>
        <p>{customizingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{clothesTitle}</SectionTitle>
        <p>{clothesBody}</p>
        <BulletList>
          <li>{hatsTitle}</li>
          <li>{topsTitle}</li>
          <li>{bottomsTitle}</li>
          <li>{shoesTitle}</li>
          <li>{outfitsTitle}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{rewardItemsTitle}</SectionTitle>
        <p>{rewardItemsBody}</p>
        <SubSectionTitle>{accessoriesTitle}</SubSectionTitle>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colItem}</th>
                <th>{colGender}</th>
                <th>{colValue}</th>
                <th>{colHow}</th>
              </tr>
            </thead>
            <tbody>
              {ACCESSORIES.map((row, i) => (
                <tr key={i}>
                  <td>{row.item}</td>
                  <td>{row.gender}</td>
                  <td>{row.value}</td>
                  <td>{row.how}</td>
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
