"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  earningTitle: string;
  earningBody: string;
  spendingTitle: string;
  spendingBody: string;
  dealsTitle: string;
  dealsBody: string;
  dealSpecialGuestTitle: string;
  dealSpecialGuestBody: string;
  dealPiggyBankTitle: string;
  dealPiggyBankBody: string;
  dealWelcomeTitle: string;
  dealWelcomeBody: string;
  dealFunFiestaTitle: string;
  dealFunFiestaBody: string;
  dealBunnyBiteTitle: string;
  dealBunnyBiteBody: string;
  dealVoucherTitle: string;
  dealVoucherBody: string;
  dealStarSavingsTitle: string;
  dealStarSavingsBody: string;
  deal55Title: string;
  deal55Body: string;
  deal60Title: string;
  deal60Body: string;
  buyingTitle: string;
  buyingBody: string;
  colDiamonds: string;
  colUsd: string;
  colEur: string;
}

// [diamonds, usd, eur]
const DIAMOND_PACKAGES: [number, number, number][] = [
  [10,    0.99,   0.99],
  [30,    2.99,   2.99],
  [50,    4.99,   4.99],
  [100,   9.99,   9.99],
  [200,  19.99,  19.99],
  [500,  49.99,  49.99],
  [1000, 99.99,  99.99],
  [2500, 249.99, 249.99],
];

export default function DiamondsContent({
  intro,
  earningTitle,
  earningBody,
  spendingTitle,
  spendingBody,
  dealsTitle,
  dealsBody,
  dealSpecialGuestTitle,
  dealSpecialGuestBody,
  dealPiggyBankTitle,
  dealPiggyBankBody,
  dealWelcomeTitle,
  dealWelcomeBody,
  dealFunFiestaTitle,
  dealFunFiestaBody,
  dealBunnyBiteTitle,
  dealBunnyBiteBody,
  dealVoucherTitle,
  dealVoucherBody,
  dealStarSavingsTitle,
  dealStarSavingsBody,
  deal55Title,
  deal55Body,
  deal60Title,
  deal60Body,
  buyingTitle,
  buyingBody,
  colDiamonds,
  colUsd,
  colEur,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{earningTitle}</SectionTitle>
        <p>{earningBody}</p>
      </Section>

      <Section>
        <SectionTitle>{spendingTitle}</SectionTitle>
        <p>{spendingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{dealsTitle}</SectionTitle>
        <p>{dealsBody}</p>
        <SubSectionTitle>{dealSpecialGuestTitle}</SubSectionTitle>
        <p>{dealSpecialGuestBody}</p>
        <SubSectionTitle>{dealPiggyBankTitle}</SubSectionTitle>
        <p>{dealPiggyBankBody}</p>
        <SubSectionTitle>{dealWelcomeTitle}</SubSectionTitle>
        <p>{dealWelcomeBody}</p>
        <SubSectionTitle>{dealFunFiestaTitle}</SubSectionTitle>
        <p>{dealFunFiestaBody}</p>
        <SubSectionTitle>{dealBunnyBiteTitle}</SubSectionTitle>
        <p>{dealBunnyBiteBody}</p>
        <SubSectionTitle>{dealVoucherTitle}</SubSectionTitle>
        <p>{dealVoucherBody}</p>
        <SubSectionTitle>{dealStarSavingsTitle}</SubSectionTitle>
        <p>{dealStarSavingsBody}</p>
        <SubSectionTitle>{deal55Title}</SubSectionTitle>
        <p>{deal55Body}</p>
        <SubSectionTitle>{deal60Title}</SubSectionTitle>
        <p>{deal60Body}</p>
      </Section>

      <Section>
        <SectionTitle>{buyingTitle}</SectionTitle>
        <p>{buyingBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colDiamonds}</th>
                <th>{colUsd}</th>
                <th>{colEur}</th>
              </tr>
            </thead>
            <tbody>
              {DIAMOND_PACKAGES.map(([diamonds, usd, eur], i) => (
                <tr key={i}>
                  <td>{diamonds}</td>
                  <td>${usd.toFixed(2)}</td>
                  <td>€{eur.toFixed(2)}</td>
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
