import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function AcademyTasks() {
  const t = useTranslations("wiki_academy");

  return (
    <WikiAccordeon title={t("tasks_title")} image={"/images/wiki/academy_tasks.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("tasks_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
