import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import WikiList from "@/components/pages/wiki/_elements/WikiList";

export default function CurrencyDiamonds() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("diamonds_title")} image={"/images/wiki/diamond.webp"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("diamonds_body")}</WikiIntroText>

        <WikiTitelParagraph title={t("free_diamonds_title")} paragraph="" />
        <WikiList
          title={t("free_diamonds_gameplay_title")}
          paragraph={t("free_diamonds_gameplay_body")}
        />
        <WikiList
          title={t("free_diamonds_level_up_title")}
          paragraph={t("free_diamonds_level_up_body")}
        />
        <WikiList
          title={t("free_diamonds_calendar_title")}
          paragraph={t("free_diamonds_calendar_body")}
        />
        <WikiList
          title={t("free_diamonds_season_pass_title")}
          paragraph={t("free_diamonds_season_pass_body")}
        />
        <WikiList
          title={t("free_diamonds_quest_title")}
          paragraph={t("free_diamonds_quest_body")}
        />
        <WikiList title={t("watching_ads_title")} paragraph={t("watching_ads_body")} />
        <WikiList title={t("news_subscriptions_title")} paragraph={t("news_subscriptions_body")} />
        <WikiList title={t("social_media_title")} paragraph={t("social_media_body")} />
        <WikiList title={t("upjers_portal_title")} paragraph={t("upjers_portal_body")} />

        <WikiTitelParagraph
          title={t("buying_diamonds_title")}
          paragraph={t("buying_diamonds_body")}
        />
        <WikiList title={t("deal_special_guest_title")} paragraph={t("deal_special_guest_body")} />
        <WikiList title={t("deal_piggy_bank_title")} paragraph={t("deal_piggy_bank_body")} />
        <WikiList title={t("deal_welcome_title")} paragraph={t("deal_welcome_body")} />
        <WikiList title={t("deal_fun_fiesta_title")} paragraph={t("deal_fun_fiesta_body")} />
        <WikiList title={t("deal_bunny_bite_title")} paragraph={t("deal_bunny_bite_body")} />
        <WikiList title={t("deal_voucher_title")} paragraph={t("deal_voucher_body")} />
        <WikiList title={t("deal_star_savings_title")} paragraph={t("deal_star_savings_body")} />
        <WikiList title={t("deal_55_title")} paragraph={t("deal_55_body")} />
        <WikiList title={t("deal_60_title")} paragraph={t("deal_60_body")} />

        <WikiTitelParagraph title={t("spending_title")} paragraph={t("spending_body")} />
        <WikiTitelParagraph
          title={t("spending_no_sale_diamonds_title")}
          paragraph={t("spending_no_sale_diamonds")}
        />
        <p>{t("spending_avoid")}</p>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
