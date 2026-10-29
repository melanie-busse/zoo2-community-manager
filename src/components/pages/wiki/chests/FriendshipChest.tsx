import { useTranslations } from "next-intl";

import WikiAccordeon from "../_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiInfoGrid from "@/components/pages/wiki/_elements/WikiInfoGrid";
import WikiInfoCard from "@/components/pages/wiki/_elements/WikiInfoCard";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import { WikiBadge } from "@/components/pages/wiki/_elements/WikiBadge";

const FRIENDSHIP_ANIMALS: [string, "rare" | "epic" | "legendary", string][] = [
  ["crab-eating-raccoon", "rare", "jungle"],
  ["short-beaked-echidna", "rare", "grasslands"],
  ["sitatunga", "epic", "grasslands"],
  ["dingo", "epic", "plains"],
  ["steenbok", "epic", "plains"],
];

export default function FriendshipChest() {
  const t = useTranslations("chestsfaq.friendship");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/friendship_chest.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>

        <WikiInfoGrid>
          <WikiInfoCard label={tChest("cost")} value={`❤️ 10 ${t("friendship_points")}`} />
          <WikiInfoCard label={tChest("limit")} value={`📦 Max. 5 ${tChest("chests")}`} />
        </WikiInfoGrid>

        <WikiTitelParagraph title={t("contents_title")} paragraph={t("contents_body")} />

        <WikiTitelParagraph title={t("animals_title")} paragraph={t("animals_body")}>
          <WikiTable>
            <thead>
              <tr>
                <th>{tChest("animal")}</th>
                <th>{tChest("rarity")}</th>
                <th>{tChest("biome")}</th>
              </tr>
            </thead>
            <tbody>
              {FRIENDSHIP_ANIMALS.map(([animalKey, rarity, biomeKey]) => (
                <tr key={animalKey}>
                  <td>{t(animalKey)}</td>
                  <td>
                    <WikiBadge rarity={rarity} />
                  </td>
                  <td>{tChest(`biomes.${biomeKey}`)}</td>
                </tr>
              ))}
            </tbody>
          </WikiTable>
        </WikiTitelParagraph>

        <WikiTitelParagraph title={t("enclosures_title")} paragraph={t("enclosures_body")} />
        <WikiTitelParagraph title={t("tips_title")} paragraph={t("tips_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
