import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import WikiList from "@/components/pages/wiki/_elements/WikiList";

export default function CurrencyCoins() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("coins_title")} image={"/images/wiki/dollar.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("coins_body")}</WikiIntroText>

        <WikiTitelParagraph
          title={t("generating_coins_title")}
          paragraph={t("generating_coins_intro")}
        />
        <WikiList title={t("coin_point_1")} paragraph={t("coin_body_1")} />
        <WikiList title={t("coin_point_2")} paragraph={t("coin_body_2")} />
        <WikiList title={t("coin_point_3")} paragraph={t("coin_body_3")} />
        <WikiList title={t("coin_point_4")} paragraph={t("coin_body_4")} />
        <WikiList title={t("coin_point_5")} paragraph={t("coin_body_5")} />
        <WikiList title={t("coin_point_6")} paragraph={t("coin_body_6")} />
        <WikiList title={t("coin_point_7")} paragraph={t("coin_body_7")} />
        <WikiList title={t("coin_point_8")} paragraph={t("coin_body_8")} />
        <WikiList title={t("coin_point_9")} paragraph={t("coin_body_9")} />
        <WikiList title={t("coin_point_10")} paragraph={t("coin_body_10")} />

        <WikiTitelParagraph
          title={t("spending_coins_title")}
          paragraph={t("spending_coins_body")}
        />

        <WikiTitelParagraph title={t("coins_tip_title")} paragraph={t("coins_tip_body")} />
        <p>{t("spending_no_sale_coins")}</p>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
