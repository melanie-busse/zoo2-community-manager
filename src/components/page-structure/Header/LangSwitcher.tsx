"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

import * as Styles from "./LangSwitcher.styles";
import { useClickOutside } from "@/hooks/useClickOutside";
import Chevron from "@/components/ui/icons/Chevron";
import { FLAG_MAP } from "@/constants/languages";

export default function LangSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const flagClass = FLAG_MAP[locale] || "fi-un";

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  useClickOutside(wrapperRef, () => setIsOpen(false));

  return (
    <Styles.LangSwitcherContainer ref={wrapperRef}>
      <Styles.CurrentLanguage onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <span className={`fi ${flagClass}`}></span>
        <Chevron isOpen={isOpen} />
      </Styles.CurrentLanguage>

      <Styles.LangDropdown $show={isOpen}>
        <Styles.LangOption onClick={() => handleLocaleChange("de")}>
          <span className="fi fi-de"></span> DE
        </Styles.LangOption>
        <Styles.LangOption onClick={() => handleLocaleChange("en")}>
          <span className="fi fi-gb"></span> EN
        </Styles.LangOption>
        <Styles.LangOption onClick={() => handleLocaleChange("da")}>
          <span className="fi fi-dk"></span> DA
        </Styles.LangOption>
        <Styles.LangOption onClick={() => handleLocaleChange("fr")}>
          <span className="fi fi-fr"></span> FR
        </Styles.LangOption>
        <Styles.LangOption onClick={() => handleLocaleChange("nl")}>
          <span className="fi fi-nl"></span> NL
        </Styles.LangOption>
        <Styles.LangOption onClick={() => handleLocaleChange("es")}>
          <span className="fi fi-es"></span> ES
        </Styles.LangOption>
      </Styles.LangDropdown>
    </Styles.LangSwitcherContainer>
  );
}
