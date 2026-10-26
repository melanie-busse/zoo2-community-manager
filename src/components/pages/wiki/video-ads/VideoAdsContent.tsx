"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  billboardTitle: string;
  billboardBody: string;
  redeemingTitle: string;
  redeemingBody: string;
  availabilityTitle: string;
  availabilityBody: string;
  ageTitle: string;
  ageBody: string;
  tipsTitle: string;
  tipsIntro: string;
  tipDelay: string;
  tipRestart: string;
  tipInternet: string;
  tipDevice: string;
  tipTracking: string;
  iosTrackingTitle: string;
  iosTrackingBody: string;
  iosResetTitle: string;
  iosResetBody: string;
  androidResetTitle: string;
  androidResetBody: string;
  bonusTitle: string;
  bonusBody: string;
  colType: string;
  colOffer: string;
  colLimit: string;
  colDetails: string;
  bonusNotesTitle: string;
  xpBonusTitle: string;
  xpBonusBody: string;
  xpSourcesTitle: string;
  xpSourcesBody: string;
  fertilityTitle: string;
  fertilityBody: string;
  videoChestsTitle: string;
  videoChestsBody: string;
  limitsTitle: string;
  limitsBody: string;
}

const BONUS_OFFERS = [
  { type: "XP Boost", offer: "10% XP Bonus", limit: "3x / day", details: "Applies to all XP sources for 30 min" },
  { type: "Fertility Bonus", offer: "Fertility +10%", limit: "3x / day", details: "Increases breeding success rate" },
  { type: "Video Chest", offer: "1 Video Chest", limit: "5x / day", details: "Contains random items or animals" },
  { type: "Coin Bonus", offer: "2x Coins", limit: "2x / day", details: "Doubles coin income for 1 hour" },
  { type: "Energy Refill", offer: "50 Energy", limit: "3x / day", details: "Instantly refills energy" },
];

export default function VideoAdsContent({
  intro,
  billboardTitle,
  billboardBody,
  redeemingTitle,
  redeemingBody,
  availabilityTitle,
  availabilityBody,
  ageTitle,
  ageBody,
  tipsTitle,
  tipsIntro,
  tipDelay,
  tipRestart,
  tipInternet,
  tipDevice,
  tipTracking,
  iosTrackingTitle,
  iosTrackingBody,
  iosResetTitle,
  iosResetBody,
  androidResetTitle,
  androidResetBody,
  bonusTitle,
  bonusBody,
  colType,
  colOffer,
  colLimit,
  colDetails,
  bonusNotesTitle,
  xpBonusTitle,
  xpBonusBody,
  xpSourcesTitle,
  xpSourcesBody,
  fertilityTitle,
  fertilityBody,
  videoChestsTitle,
  videoChestsBody,
  limitsTitle,
  limitsBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{billboardTitle}</SectionTitle>
        <p>{billboardBody}</p>
      </Section>

      <Section>
        <SectionTitle>{redeemingTitle}</SectionTitle>
        <p>{redeemingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{availabilityTitle}</SectionTitle>
        <p>{availabilityBody}</p>
      </Section>

      <Section>
        <SectionTitle>{ageTitle}</SectionTitle>
        <p>{ageBody}</p>
      </Section>

      <Section>
        <SectionTitle>{tipsTitle}</SectionTitle>
        <p>{tipsIntro}</p>
        <BulletList>
          <li>{tipDelay}</li>
          <li>{tipRestart}</li>
          <li>{tipInternet}</li>
          <li>{tipDevice}</li>
          <li>{tipTracking}</li>
        </BulletList>
        <SubSectionTitle>{iosTrackingTitle}</SubSectionTitle>
        <p>{iosTrackingBody}</p>
        <SubSectionTitle>{iosResetTitle}</SubSectionTitle>
        <p>{iosResetBody}</p>
        <SubSectionTitle>{androidResetTitle}</SubSectionTitle>
        <p>{androidResetBody}</p>
      </Section>

      <Section>
        <SectionTitle>{bonusTitle}</SectionTitle>
        <p>{bonusBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colType}</th>
                <th>{colOffer}</th>
                <th>{colLimit}</th>
                <th>{colDetails}</th>
              </tr>
            </thead>
            <tbody>
              {BONUS_OFFERS.map((row, i) => (
                <tr key={i}>
                  <td>{row.type}</td>
                  <td>{row.offer}</td>
                  <td>{row.limit}</td>
                  <td>{row.details}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
        <SubSectionTitle>{bonusNotesTitle}</SubSectionTitle>
        <SubSectionTitle>{xpBonusTitle}</SubSectionTitle>
        <p>{xpBonusBody}</p>
        <SubSectionTitle>{xpSourcesTitle}</SubSectionTitle>
        <p>{xpSourcesBody}</p>
        <SubSectionTitle>{fertilityTitle}</SubSectionTitle>
        <p>{fertilityBody}</p>
        <SubSectionTitle>{videoChestsTitle}</SubSectionTitle>
        <p>{videoChestsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{limitsTitle}</SectionTitle>
        <p>{limitsBody}</p>
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
