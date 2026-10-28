"use client";

import styled from "styled-components";
import { useTranslations } from "next-intl"; // Beispiel für next-intl

export default function ChestsFaqContent() {
  // Lade den Namespace für diese Seite (z.B. "ChestsFaq")
  const t = useTranslations("ChestsFaq");

  return (
    <>
      <IntroParagraph>{t("intro")}</IntroParagraph>

      <Section>
        <SectionTitle>{t("overviewTitle")}</SectionTitle>
        <p>{t("overviewBody")}</p>
      </Section>

      <Section>
        <SectionTitle>{t("chestTypesTitle")}</SectionTitle>
        <BulletList>
          <li>{t("chestFriendship")}</li>
          <li>{t("chestNormal")}</li>
          <li>{t("chestEpic")}</li>
          <li>{t("chestRetro")}</li>
          <li>{t("chestLegendary")}</li>
          <li>{t("chestVideo")}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{t("forecastsTitle")}</SectionTitle>
        <p>{t("forecastsBody")}</p>
      </Section>

      <Section>
        <SectionTitle>{t("limitsTitle")}</SectionTitle>
        <p>{t("limitsBody")}</p>
      </Section>

      <Section>
        <SectionTitle>{t("keysTitle")}</SectionTitle>
        <p>{t("keysBody")}</p>
      </Section>

      <Section>
        <SectionTitle>{t("exceptionsTitle")}</SectionTitle>
        <p>{t("exceptionsBody")}</p>
        <BulletList>
          <li>{t("exceptionExpansions")}</li>
          <li>{t("exceptionUpgrades")}</li>
          <li>{t("exceptionEmployees")}</li>
          <li>{t("exceptionOther")}</li>
        </BulletList>
      </Section>
    </>
  );
}

// Styled Components bleiben unverändert...
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

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
