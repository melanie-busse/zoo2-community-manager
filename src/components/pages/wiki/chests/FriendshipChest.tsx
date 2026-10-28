import { useTranslations } from "next-intl";
import styled from "styled-components";

import WikiAccordeon from "../_elements/WikiAccordeon";

const FRIENDSHIP_ANIMALS: [string, "rare" | "epic" | "legendary", string][] = [
  ["crab-eating-raccoon", "rare", "jungle"],
  ["short-beaked-echidna", "rare", "grasslands"],
  ["sitatunga", "epic", "grasslands"],
  ["dingo", "epic", "plains"],
  ["steenbok", "epic", "plains"],
];

export default function FriendshipChest() {
  const t = useTranslations("chestsfaq.friendship");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/friendship_chest.jpg"}>
      <AccordionContentWrapper>
        <IntroText>{t("intro")}</IntroText>

        <InfoGrid>
          <InfoCard>
            <InfoLabel>{tChest("cost")}</InfoLabel>
            <InfoValue>❤️ 10 {t("friendship_points")}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>{tChest("limit")}</InfoLabel>
            <InfoValue>📦 Max. 5 {tChest("chests")}</InfoValue>
          </InfoCard>
        </InfoGrid>

        <DetailSection>
          <SubTitle>{t("contents_title")}</SubTitle>
          <p>{t("contents_body")}</p>
        </DetailSection>

        <DetailSection>
          <SubTitle>{t("animals_title")}</SubTitle>
          <p>{t("animals_body")}</p>

          <StyledTable>
            <thead>
              <tr>
                <th>{tChest("animal")}</th>
                <th>{tChest("rarity")}</th>
                <th>{tChest("biome")}</th>
              </tr>
            </thead>
            <tbody>
              {FRIENDSHIP_ANIMALS.map(([animalKey, rarity, biomeKey]) => (
                <tr key={animalKey}>
                  <td>{t(animalKey)}</td>
                  <td>
                    <Badge rarity={rarity}>
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </Badge>
                  </td>
                  <td>{tChest(`biomes.${biomeKey}`)}</td>
                </tr>
              ))}
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

// Styled Components bleiben unverändert
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
