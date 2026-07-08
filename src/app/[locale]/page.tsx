import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import HomeView from "@/components/pages/Home/HomeViex";
import { getCountAnimals } from "@/service/AnimalService";
import { getHabitatCount } from "@/service/BiomeService";
import { getCountSpecialCoats } from "@/service/SpecialCoatsService";

export default async function IndexPage() {
  const t = await getTranslations("Home");

  // Daten auf dem Server holen
  const stats = {
    tierCount: await getCountAnimals(),
    specialCoatCount: await getCountSpecialCoats(),
    habitatCount: await getHabitatCount(),
  };

  const trans = {
    stats_animals: t("Stats.animals"),
    stats_specialCoat: t("Stats.specialCoat"),
    stats_biomes: t("Stats.biomes"),
    stats_regions: t("Stats.regions"),
    cards_lexicon_title: t("Cards.lexicon.title"),
    cards_lexicon_text: t("Cards.lexicon.text"),
    cards_specialCoat_title: t("Cards.specialCoat.title"),
    cards_specialCoat_text: t("Cards.specialCoat.text"),
    cards_club_title: t("Cards.club.title"),
    cards_club_text: t("Cards.club.text"),
  };

  return (
    <PageWrapper>
      <HomeView stats={stats} t={trans} />
    </PageWrapper>
  );
}
