"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  howItWorksTitle: string;
  howItWorksBody: string;
  typesTitle: string;
  typesBody: string;
  discontinuedTitle: string;
  discontinuedBody: string;
  pricingTitle: string;
  pricingBody: string;
  colAnimal: string;
  colCardPrice: string;
  colRescue: string;
  colShop33: string;
  colIceCream: string;
  colSuperDeal: string;
  colShopPair: string;
  colChest: string;
  colPrizeWheel: string;
}

// [animal, cardPrice, rescueCenter, shop33, iceCream40, superDeal, shopPair33, chest, prizeWheel]
type PricingEntry = {
  animal: string;
  cardPrice: string;
  rescue: string;
  shop33: string;
  iceCream: string;
  superDeal: string;
  shopPair: string;
  chest: string;
  prizeWheel: string;
};

const ANIMAL_PRICING: PricingEntry[] = [
  { animal: "Aardvark", cardPrice: "75", rescue: "50", shop33: "50", iceCream: "45", superDeal: "~30", shopPair: "50", chest: "Epic", prizeWheel: "No" },
  { animal: "African Elephant", cardPrice: "120", rescue: "80", shop33: "80", iceCream: "72", superDeal: "~50", shopPair: "80", chest: "Legendary", prizeWheel: "Yes" },
  { animal: "African Wild Dog", cardPrice: "60", rescue: "40", shop33: "40", iceCream: "36", superDeal: "~25", shopPair: "40", chest: "Epic", prizeWheel: "No" },
  { animal: "Alpaca", cardPrice: "45", rescue: "30", shop33: "30", iceCream: "27", superDeal: "~20", shopPair: "30", chest: "Rare", prizeWheel: "No" },
  { animal: "American Bison", cardPrice: "60", rescue: "40", shop33: "40", iceCream: "36", superDeal: "~25", shopPair: "40", chest: "Epic", prizeWheel: "No" },
  { animal: "Arctic Fox", cardPrice: "45", rescue: "30", shop33: "30", iceCream: "27", superDeal: "~20", shopPair: "30", chest: "Rare", prizeWheel: "No" },
  { animal: "Chimpanzee", cardPrice: "20", rescue: "14", shop33: "14", iceCream: "12", superDeal: "~9", shopPair: "14", chest: "Rare", prizeWheel: "No" },
  { animal: "Giraffe", cardPrice: "90", rescue: "60", shop33: "60", iceCream: "54", superDeal: "~38", shopPair: "60", chest: "Legendary", prizeWheel: "Yes" },
  { animal: "Gorilla", cardPrice: "90", rescue: "60", shop33: "60", iceCream: "54", superDeal: "~38", shopPair: "60", chest: "Legendary", prizeWheel: "Yes" },
  { animal: "Hippopotamus", cardPrice: "75", rescue: "50", shop33: "50", iceCream: "45", superDeal: "~30", shopPair: "50", chest: "Epic", prizeWheel: "No" },
  { animal: "Jaguar", cardPrice: "60", rescue: "40", shop33: "40", iceCream: "36", superDeal: "~25", shopPair: "40", chest: "Epic", prizeWheel: "No" },
  { animal: "Komodo Dragon", cardPrice: "75", rescue: "50", shop33: "50", iceCream: "45", superDeal: "~30", shopPair: "50", chest: "Epic", prizeWheel: "No" },
  { animal: "Lion", cardPrice: "40", rescue: "27", shop33: "27", iceCream: "24", superDeal: "~16", shopPair: "27", chest: "Rare", prizeWheel: "No" },
  { animal: "Moose", cardPrice: "60", rescue: "40", shop33: "40", iceCream: "36", superDeal: "~25", shopPair: "40", chest: "Epic", prizeWheel: "No" },
  { animal: "Polar Bear", cardPrice: "90", rescue: "60", shop33: "60", iceCream: "54", superDeal: "~38", shopPair: "60", chest: "Legendary", prizeWheel: "Yes" },
  { animal: "Snow Leopard", cardPrice: "90", rescue: "60", shop33: "60", iceCream: "54", superDeal: "~38", shopPair: "60", chest: "Legendary", prizeWheel: "Yes" },
  { animal: "Tiger", cardPrice: "75", rescue: "50", shop33: "50", iceCream: "45", superDeal: "~30", shopPair: "50", chest: "Epic", prizeWheel: "No" },
  { animal: "Zebra", cardPrice: "45", rescue: "30", shop33: "30", iceCream: "27", superDeal: "~20", shopPair: "30", chest: "Rare", prizeWheel: "No" },
];

export default function SuperDealsContent({
  intro,
  howItWorksTitle,
  howItWorksBody,
  typesTitle,
  typesBody,
  discontinuedTitle,
  discontinuedBody,
  pricingTitle,
  pricingBody,
  colAnimal,
  colCardPrice,
  colRescue,
  colShop33,
  colIceCream,
  colSuperDeal,
  colShopPair,
  colChest,
  colPrizeWheel,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{howItWorksTitle}</SectionTitle>
        <p>{howItWorksBody}</p>
      </Section>

      <Section>
        <SectionTitle>{typesTitle}</SectionTitle>
        <p>{typesBody}</p>
      </Section>

      <Section>
        <SectionTitle>{discontinuedTitle}</SectionTitle>
        <p>{discontinuedBody}</p>
      </Section>

      <Section>
        <SectionTitle>{pricingTitle}</SectionTitle>
        <p>{pricingBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colAnimal}</th>
                <th>{colCardPrice}</th>
                <th>{colRescue}</th>
                <th>{colShop33}</th>
                <th>{colIceCream}</th>
                <th>{colSuperDeal}</th>
                <th>{colShopPair}</th>
                <th>{colChest}</th>
                <th>{colPrizeWheel}</th>
              </tr>
            </thead>
            <tbody>
              {ANIMAL_PRICING.map((row, i) => (
                <tr key={i}>
                  <td>{row.animal}</td>
                  <td>{row.cardPrice}</td>
                  <td>{row.rescue}</td>
                  <td>{row.shop33}</td>
                  <td>{row.iceCream}</td>
                  <td>{row.superDeal}</td>
                  <td>{row.shopPair}</td>
                  <td>{row.chest}</td>
                  <td>{row.prizeWheel}</td>
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

// SubSectionTitle is defined but only used if future sections need it
void SubSectionTitle;
