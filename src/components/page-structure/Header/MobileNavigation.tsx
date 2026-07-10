"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import * as Styles from "./Navigation.styles";
import { navConfig } from "@/config/navigationData";
import Login from "@/components/page-structure/Header/Login";
import Chevron from "@/components/ui/icons/Chevron";

// @ts-expect-error -- Props werden ohne Typ-Definition übergeben
export default function MobileNavigation({ isOpen, onClose }) {
  const t = useTranslations("navigation");
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { data: session } = useSession();

  const toggleSubMenu = (menuId: string) => {
    setOpenSubMenu(openSubMenu === menuId ? null : menuId);
  };

  return (
    <Styles.Overlay $isOpen={isOpen}>
      <Styles.MenuContent>
        {navConfig.map((item) => {
          // Falls der Hauptpunkt Auth braucht und wir nicht eingeloggt sind: überspringen
          if (item.requiresAuth && !session) return null;

          // Fall A: Einfacher Link (z.B. Home)
          if (item.href && !item.subMenu) {
            return (
              <Styles.MobileNavLink key={item.id} href={item.href} onClick={onClose}>
                {t("links." + item.labelKey)}
              </Styles.MobileNavLink>
            );
          }

          // Fall B: Dropdown / Menügruppe
          return (
            <Styles.MobileMenuWrapper key={item.id}>
              <Styles.MenuHeader onClick={() => toggleSubMenu(item.id)}>
                {t("links." + item.labelKey)}
                <Chevron isOpen={isOpen} />
              </Styles.MenuHeader>

              <Styles.SubMenu $isOpen={openSubMenu === item.id}>
                {item.subMenu?.map((sub) => {
                  // Prüfe Auth für Untermenüpunkte
                  if (sub.requiresAuth && !session) return null;

                  return (
                    <Styles.SubNavLink key={sub.href} href={sub.href} onClick={onClose}>
                      {t("links." + sub.labelKey)}
                    </Styles.SubNavLink>
                  );
                })}
              </Styles.SubMenu>
            </Styles.MobileMenuWrapper>
          );
        })}

        <Styles.Divider />

        <Styles.LoginContainer>
          <Login />
        </Styles.LoginContainer>
      </Styles.MenuContent>
    </Styles.Overlay>
  );
}
