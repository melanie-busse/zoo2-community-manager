import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import FriendshipChestsContent from "@/components/pages/wiki/friendship-chests/FriendshipChestsContent";

export default async function FriendshipChestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "friendshipchests" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <FriendshipChestsContent
          intro={t("intro")}
          earningTitle={t("earning_title")}
          earningBody={t("earning_body")}
          contentsTitle={t("contents_title")}
          contentsBody={t("contents_body")}
          animalsTitle={t("animals_title")}
          animalsBody={t("animals_body")}
          animalsColAnimal={t("animals_col_animal")}
          animalsColRarity={t("animals_col_rarity")}
          animalsColBiome={t("animals_col_biome")}
          enclosuresTitle={t("enclosures_title")}
          enclosuresBody={t("enclosures_body")}
          tipsTitle={t("tips_title")}
          tipsBody={t("tips_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
