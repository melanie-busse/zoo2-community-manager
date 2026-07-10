"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

import * as Styles from "./LangSwitcher.styles";
import { useClickOutside } from "@/hooks/useClickOutside";
import Chevron from "@/components/ui/icons/Chevron";
import { FLAG_MAP, SUPPORTED_LANGUAGES } from "@/constants/languages";

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
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Styles.LangOption key={lang.code} onClick={() => handleLocaleChange(lang.code)}>
            <span className={`fi ${lang.flag}`}></span> {lang.name}
          </Styles.LangOption>
        ))}
      </Styles.LangDropdown>
    </Styles.LangSwitcherContainer>
  );
}
