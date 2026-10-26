import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import GameFaqContent from "@/components/pages/game/gamefaq/GameFaqContent";

export default async function GameFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gamefaq" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <GameFaqContent
          intro={t("intro")}
          summaryTitle={t("summary_title")} summaryBody={t("summary_body")}
          freeStuffTitle={t("free_stuff_title")} freeStuffBody={t("free_stuff_body")}
          levelupTitle={t("levelup_title")} levelupBody={t("levelup_body")}
          focusTitle={t("focus_title")} focusIntro={t("focus_intro")}
          focusTip1={t("focus_tip_1")} focusTip2={t("focus_tip_2")} focusTip3={t("focus_tip_3")}
          focusTip4={t("focus_tip_4")} focusTip5={t("focus_tip_5")}
          coinsTitle={t("coins_title")} coinsBody={t("coins_body")}
          diamondsTitle={t("diamonds_title")} diamondsBody={t("diamonds_body")}
          spendingTitle={t("spending_title")} spendingIntro={t("spending_intro")}
          spendingNoSaleDiamonds={t("spending_no_sale_diamonds")}
          spendingNoSaleCoins={t("spending_no_sale_coins")}
          spendingAvoid={t("spending_avoid")}
          salesTitle={t("sales_title")} salesBody={t("sales_body")}
          landTitle={t("land_title")} landBody={t("land_body")}
          seasonalTitle={t("seasonal_title")} seasonalBody={t("seasonal_body")}
          seasonPassTitle={t("season_pass_title")} seasonPassBody={t("season_pass_body")}
          conservationTitle={t("conservation_title")} conservationBody={t("conservation_body")}
          calendarTitle={t("calendar_title")} calendarBody={t("calendar_body")}
          friendsTitle={t("friends_title")} friendsBody={t("friends_body")}
          animalsTitle={t("animals_title")} animalsBody={t("animals_body")}
          freeMateTitle={t("free_mate_title")} freeMateBody={t("free_mate_body")}
          breedingTitle={t("breeding_title")} breedingBody={t("breeding_body")}
          oceansideTitle={t("oceanside_title")} oceansideBody={t("oceanside_body")}
          pettingTitle={t("petting_title")} pettingBody={t("petting_body")}
          enclosureResizeTitle={t("enclosure_resize_title")} enclosureResizeBody={t("enclosure_resize_body")}
          clubsTitle={t("clubs_title")} clubsBody={t("clubs_body")}
          puzzlesTitle={t("puzzles_title")} puzzlesBody={t("puzzles_body")}
          scrapTitle={t("scrap_title")} scrapBody={t("scrap_body")}
          noScrapTitle={t("no_scrap_title")} noScrapIntro={t("no_scrap_intro")}
          noScrapDecos={t("no_scrap_decos")} noScrapAnimalsIntro={t("no_scrap_animals_intro")}
          noScrapAnimals={t("no_scrap_animals")} noScrapWheel={t("no_scrap_wheel")}
          ticketsTitle={t("tickets_title")} ticketsBody={t("tickets_body")}
          academyTipsTitle={t("academy_tips_title")} academyTipsBody={t("academy_tips_body")}
          hideQuestsTitle={t("hide_quests_title")} hideQuestsBody={t("hide_quests_body")}
          rocksTitle={t("rocks_title")} rocksBody={t("rocks_body")}
          steamTitle={t("steam_title")} steamBody={t("steam_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
