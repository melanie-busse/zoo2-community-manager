import { useTranslations } from "next-intl";
import styled from "styled-components";

import WikiAccordeon from "../_elements/WikiAccordeon";

const COST_LEVELS: [number, string][] = [
  [1, "250"],
  [5, "1.250"],
  [10, "2.500"],
  [15, "3.750"],
  [20, "5.000"],
  [25, "6.250"],
  [30, "7.500"],
  [35, "8.750"],
  [40, "10.000"],
  [45, "11.250"],
  [50, "12.500"],
  [55, "13.750"],
  [60, "15.000"],
  [65, "16.250"],
  [70, "17.500"],
];

export default function NormalChest() {
  const t = useTranslations("chestsfaq.normal");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/normal_chest.jpg"}>
      <AccordionContentWrapper>
        <IntroText>{t("intro")}</IntroText>

        <InfoGrid>
          <InfoCard>
            <InfoLabel>{tChest("limit")}</InfoLabel>
            <InfoValue>📦 Max. 100 {tChest("chests")}</InfoValue>
          </InfoCard>
        </InfoGrid>

        <DetailSection>
          <SubTitle>{t("cost_title")}</SubTitle>
          <p>{t("cost_body")}</p>

          <StyledTable>
            <thead>
              <tr>
                <th>{t("cost_col_level")}</th>
                <th>{t("cost_col_cost")}</th>
              </tr>
            </thead>
            <tbody>
              {COST_LEVELS.map(([level, cost]) => (
                <tr key={level}>
                  <td>{level}</td>
                  <td>{cost} Coins</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </DetailSection>

        <DetailSection>
          <SubTitle>{t("contents_title")}</SubTitle>
          <p>{t("contents_body")}</p>
        </DetailSection>

        <DetailSection>
          <SubTitle>{t("tips_title")}</SubTitle>
          <p>{t("tips_body")}</p>
        </DetailSection>
      </AccordionContentWrapper>
    </WikiAccordeon>
  );
}

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
