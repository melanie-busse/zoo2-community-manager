import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import FashionBoutiqueContent from "@/components/pages/wiki/fashion-boutique/FashionBoutiqueContent";

export default async function FashionBoutiquePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fashionboutique" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <FashionBoutiqueContent
          intro={t("intro")}
          buildingTitle={t("building_title")}
          buildingBody={t("building_body")}
          findingAvatarTitle={t("finding_avatar_title")}
          findingAvatarBody={t("finding_avatar_body")}
          collectingGiftsTitle={t("collecting_gifts_title")}
          collectingGiftsBody={t("collecting_gifts_body")}
          customizingTitle={t("customizing_title")}
          customizingBody={t("customizing_body")}
          clothesTitle={t("clothes_title")}
          clothesBody={t("clothes_body")}
          rewardItemsTitle={t("reward_items_title")}
          rewardItemsBody={t("reward_items_body")}
          colItem={t("col_item")}
          colGender={t("col_gender")}
          colValue={t("col_value")}
          colHow={t("col_how")}
          accessoriesTitle={t("accessories_title")}
          hatsTitle={t("hats_title")}
          topsTitle={t("tops_title")}
          bottomsTitle={t("bottoms_title")}
          shoesTitle={t("shoes_title")}
          outfitsTitle={t("outfits_title")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
