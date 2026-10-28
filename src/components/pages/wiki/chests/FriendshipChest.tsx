import { useTranslations } from "next-intl";

export default function FriendshipChest() {
  const t = useTranslations("chestsfaq");
  return (
    <WikiAccordeon title={t("title_friendship")} image={"/images/wiki/chest.jpg"}>
      <AccordionContentWrapper>
        <IntroText>{t("earning_body")}</IntroText>

        {/* Key Facts / Schnellanzeige */}
        <InfoGrid>
          <InfoCard>
            <InfoLabel>{t("cost")}</InfoLabel>
            <InfoValue>❤️ 10 {t("friendship_points")}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>{t("limit")}</InfoLabel>
            <InfoValue>📦 Max. 5 Truhen</InfoValue>
          </InfoCard>
        </InfoGrid>

        {/* Sektion: Inhalt */}
        <DetailSection>
          <SubTitle>{t("contents_title")}</SubTitle>
          <p>{t("contents_body")}</p>
        </DetailSection>

        {/* Sektion: Exklusive Tiere mit eleganter Tabelle */}
        <DetailSection>
          <SubTitle>{t("animals_title")}</SubTitle>
          <p>{t("animals_body")}</p>

          <StyledTable>
            <thead>
              <tr>
                <th>{t("animal")}</th>
                <th>{t("rarity")}</th>
                <th>{t("biome")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("crab-eating-raccoon")} </td>
                <td>
                  <Badge rarity="rare">Rare</Badge>
                </td>
                <td>{t("jungle")}</td>
              </tr>
              <tr>
                <td>{t("short-beaked-echidna")}</td>
                <td>
                  <Badge rarity="rare">Rare</Badge>
                </td>
                <td>{t("grasslands")}</td>
              </tr>
              <tr>
                <td>{t("sitatunga")}</td>
                <td>
                  <Badge rarity="epic">Epic</Badge>
                </td>
                <td>{t("grasslands")}</td>
              </tr>
              <tr>
                <td>{t("dingo")}</td>
                <td>
                  <Badge rarity="epic">Epic</Badge>
                </td>
                <td>{t("plains")}</td>
              </tr>
              <tr>
                <td>{t("steenbok")}</td>
                <td>
                  <Badge rarity="epic">Epic</Badge>
                </td>
                <td>{t("plains")}</td>
              </tr>
            </tbody>
          </StyledTable>
        </DetailSection>

        <DetailSection>
          <SubTitle>{t("enclosures_title")}</SubTitle>
          <p>{t("enclosures_body")}</p>
        </DetailSection>

        <DetailSection>
          <SubTitle>{t("tips_title")}</SubTitle>
          <p>{t("tips_body")}</p>
        </DetailSection>
      </AccordionContentWrapper>
    </WikiAccordeon>
  );
}

import styled from "styled-components";
import WikiAccordeon from "../_elements/WikiAccordeon";

export const AccordionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

export const IntroText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;

/* Kleine Info-Boxen oben im Akkordeon */
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 8px 0;
`;

export const InfoCard = styled.div`
  background: rgba(45, 90, 39, 0.05);
  border: 1px solid rgba(45, 90, 39, 0.15);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary[600] || "#2d5a27"};
`;

export const InfoValue = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;

/* Sektionen & Titel */
export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

export const SubTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d5a27;
  margin: 12px 0 4px 0;
  padding-bottom: 4px;
  border-bottom: 1.5px solid rgba(45, 90, 39, 0.2);
`;

/* Gestylte Tabelle für exklusive Tiere */
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 8px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(45, 90, 39, 0.2);

  th {
    background-color: #2d5a27;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  td {
    padding: 10px 14px;
    background-color: rgba(255, 255, 255, 0.6);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 0.95rem;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

/* Seltenheits-Badges */
export const Badge = styled.span<{ rarity: "rare" | "epic" | "legendary" }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  background-color: ${({ rarity }) =>
    rarity === "rare" ? "#2b6cb0" : rarity === "epic" ? "#805ad5" : "#d69e2e"};
`;
