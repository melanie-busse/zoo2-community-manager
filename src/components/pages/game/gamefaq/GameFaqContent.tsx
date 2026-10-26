"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  summaryTitle: string; summaryBody: string;
  freeStuffTitle: string; freeStuffBody: string;
  levelupTitle: string; levelupBody: string;
  focusTitle: string; focusIntro: string;
  focusTip1: string; focusTip2: string; focusTip3: string; focusTip4: string; focusTip5: string;
  coinsTitle: string; coinsBody: string;
  diamondsTitle: string; diamondsBody: string;
  spendingTitle: string; spendingIntro: string;
  spendingNoSaleDiamonds: string; spendingNoSaleCoins: string; spendingAvoid: string;
  salesTitle: string; salesBody: string;
  landTitle: string; landBody: string;
  seasonalTitle: string; seasonalBody: string;
  seasonPassTitle: string; seasonPassBody: string;
  conservationTitle: string; conservationBody: string;
  calendarTitle: string; calendarBody: string;
  friendsTitle: string; friendsBody: string;
  animalsTitle: string; animalsBody: string;
  freeMateTitle: string; freeMateBody: string;
  breedingTitle: string; breedingBody: string;
  oceansideTitle: string; oceansideBody: string;
  pettingTitle: string; pettingBody: string;
  enclosureResizeTitle: string; enclosureResizeBody: string;
  clubsTitle: string; clubsBody: string;
  puzzlesTitle: string; puzzlesBody: string;
  scrapTitle: string; scrapBody: string;
  noScrapTitle: string; noScrapIntro: string;
  noScrapDecos: string; noScrapAnimalsIntro: string; noScrapAnimals: string; noScrapWheel: string;
  ticketsTitle: string; ticketsBody: string;
  academyTipsTitle: string; academyTipsBody: string;
  hideQuestsTitle: string; hideQuestsBody: string;
  rocksTitle: string; rocksBody: string;
  steamTitle: string; steamBody: string;
}

export default function GameFaqContent(p: Props) {
  return (
    <>
      <IntroParagraph>{p.intro}</IntroParagraph>

      <Section>
        <SectionTitle>{p.summaryTitle}</SectionTitle>
        <p>{p.summaryBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.freeStuffTitle}</SectionTitle>
        <p>{p.freeStuffBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.levelupTitle}</SectionTitle>
        <p>{p.levelupBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.focusTitle}</SectionTitle>
        <p>{p.focusIntro}</p>
        <TipList>
          <li>{p.focusTip1}</li>
          <li>{p.focusTip2}</li>
          <li>{p.focusTip3}</li>
          <li>{p.focusTip4}</li>
          <li>{p.focusTip5}</li>
        </TipList>
      </Section>

      <Section>
        <SectionTitle>{p.coinsTitle}</SectionTitle>
        <p>{p.coinsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.diamondsTitle}</SectionTitle>
        <p>{p.diamondsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.spendingTitle}</SectionTitle>
        <p>{p.spendingIntro}</p>
        <p>{p.spendingNoSaleDiamonds}</p>
        <p>{p.spendingNoSaleCoins}</p>
        <p>{p.spendingAvoid}</p>
      </Section>

      <Section>
        <SectionTitle>{p.salesTitle}</SectionTitle>
        <p>{p.salesBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.landTitle}</SectionTitle>
        <p>{p.landBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.seasonalTitle}</SectionTitle>
        <p>{p.seasonalBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.seasonPassTitle}</SectionTitle>
        <p>{p.seasonPassBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.conservationTitle}</SectionTitle>
        <p>{p.conservationBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.calendarTitle}</SectionTitle>
        <p>{p.calendarBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.friendsTitle}</SectionTitle>
        <p>{p.friendsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.animalsTitle}</SectionTitle>
        <p>{p.animalsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.freeMateTitle}</SectionTitle>
        <p>{p.freeMateBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.breedingTitle}</SectionTitle>
        <p>{p.breedingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.oceansideTitle}</SectionTitle>
        <p>{p.oceansideBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.pettingTitle}</SectionTitle>
        <p>{p.pettingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.enclosureResizeTitle}</SectionTitle>
        <p>{p.enclosureResizeBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.clubsTitle}</SectionTitle>
        <p>{p.clubsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.puzzlesTitle}</SectionTitle>
        <p>{p.puzzlesBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.scrapTitle}</SectionTitle>
        <p>{p.scrapBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.noScrapTitle}</SectionTitle>
        <p>{p.noScrapIntro}</p>
        <p>{p.noScrapDecos}</p>
        <p>{p.noScrapAnimalsIntro}</p>
        <p>{p.noScrapAnimals}</p>
        <p>{p.noScrapWheel}</p>
      </Section>

      <Section>
        <SectionTitle>{p.ticketsTitle}</SectionTitle>
        <p>{p.ticketsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.academyTipsTitle}</SectionTitle>
        <p>{p.academyTipsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.hideQuestsTitle}</SectionTitle>
        <p>{p.hideQuestsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.rocksTitle}</SectionTitle>
        <p>{p.rocksBody}</p>
      </Section>

      <Section>
        <SectionTitle>{p.steamTitle}</SectionTitle>
        <p>{p.steamBody}</p>
      </Section>
    </>
  );
}

const IntroParagraph = styled.p`
  font-size: 1rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  p {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[500]};
`;

const TipList = styled.ul`
  padding-left: ${({ theme }) => theme.spacing(3)};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;
