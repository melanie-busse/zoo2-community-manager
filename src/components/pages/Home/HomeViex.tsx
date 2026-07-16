"use client";

import * as Styles from "./HomeView.styles";
import StatsBar from "@/components/page-structure/Elements/StatsBar";

interface HomeViewProps {
  stats: {
    tierCount: number;
    specialCoatCount: number;
    habitatCount: number;
  };
  t: any;
}

export default function HomeView({ stats, t }: HomeViewProps) {
  const data = [
    {
      number: stats.tierCount,
      label: t.stats_animals,
    },
    {
      number: stats.specialCoatCount,
      label: t.stats_specialCoat,
    },
    {
      number: stats.habitatCount,
      label: t.stats_biomes,
    },
    {
      number: 6,
      label: t.stats_regions,
    },
  ];
  return (
    <Styles.FullPageContainer>
      <Styles.HeroSection>
        <Styles.ContentWrapper>
          <h1>
            Zoo 2: Animal Park <span>Manager</span>
          </h1>

          <StatsBar data={data} />

          <Styles.ActionGrid>
            <Styles.MenuCard href="/AnimalOverview" $color="#4ca64c">
              <Styles.Icon>🐾</Styles.Icon>
              <h3>{t.cards_lexicon_title}</h3>
              <p>{t.cards_lexicon_text}</p>
            </Styles.MenuCard>

            <Styles.MenuCard href="/varianten" $color="#3498db">
              <Styles.Icon>🎨</Styles.Icon>
              <h3>{t.cards_specialCoat_title}</h3>
              <p>{t.cards_specialCoat_text}</p>
            </Styles.MenuCard>

            <Styles.MenuCard href="/klub" $color="#f39c12">
              <Styles.Icon>🏆</Styles.Icon>
              <h3>{t.cards_club_title}</h3>
              <p>{t.cards_club_text}</p>
            </Styles.MenuCard>
          </Styles.ActionGrid>
        </Styles.ContentWrapper>
      </Styles.HeroSection>
    </Styles.FullPageContainer>
  );
}
