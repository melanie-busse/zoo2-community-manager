import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import HomeView from "@/components/pages/Home/HomeView";
import { getCountAnimals } from "@/service/AnimalService";
import { getHabitatCount } from "@/service/BiomeService";
import { getCountSpecialCoats } from "@/service/SpecialCoatsService";

export default async function IndexPage() {
  const t = await getTranslations("page");

  const stats = {
    tierCount: await getCountAnimals(),
    specialCoatCount: await getCountSpecialCoats(),
    habitatCount: await getHabitatCount(),
  };

  const trans = {
    stats_animals: t("home.stats.animals"),
    stats_specialCoat: t("home.stats.specialCoat"),
    stats_biomes: t("home.stats.biomes"),
    stats_regions: t("home.stats.regions"),
    cards_lexicon_title: t("home.cards.lexicon.title"),
    cards_lexicon_text: t("home.cards.lexicon.text"),
    cards_specialCoat_title: t("home.cards.specialCoat.title"),
    cards_specialCoat_text: t("home.cards.specialCoat.text"),
    cards_club_title: t("home.cards.club.title"),
    cards_club_text: t("home.cards.club.text"),
  };

  return (
    <PageWrapper>
      <HomeView stats={stats} t={trans} />
    </PageWrapper>
  );
}
