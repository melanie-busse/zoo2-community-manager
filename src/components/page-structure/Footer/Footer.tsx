"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import * as Styles from "./Footer.styles";

export default function Footer() {
  const t = useTranslations("page");

  return (
    <Styles.StyledFooter>
      <Styles.FooterContent>
        <p>
          © 2026 - Melanie Busse | <Link href="/imprint">{t("footer.imprint")}</Link>
        </p>
      </Styles.FooterContent>
    </Styles.StyledFooter>
  );
}
