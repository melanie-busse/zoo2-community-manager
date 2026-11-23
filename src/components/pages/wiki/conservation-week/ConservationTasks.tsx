import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";

export default function ConservationTasks() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon title={t("tasks_title")} image={"/images/wiki/conservation_tasks.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("tasks_body")}</WikiIntroText>
        <WikiBulletList>
          <li>{t("task_breed_biome")}</li>
          <li>{t("task_release_biome")}</li>
          <li>{t("task_breed_list")}</li>
          <li>{t("task_release_list")}</li>
        </WikiBulletList>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
