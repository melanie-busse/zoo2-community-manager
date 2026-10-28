"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import * as Styles from "./Navigation.styles";
import { navConfig, NavItem, SubMenuItem } from "@/config/navigationData";
import Chevron from "@/components/ui/icons/Chevron";
import Login from "@/components/page-structure/Header/Login";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

// @ts-expect-error -- Props werden ohne Typ-Definition übergeben
export default function MobileNavigation({ isOpen, onClose }) {
  const t = useTranslations("navigation");
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [openNestedMenu, setOpenNestedMenu] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const resolvedSession = status === "loading" ? null : session;

  const checkAuth = (item: NavItem | SubMenuItem) => {
    if (item.requiresAuth && !resolvedSession) return false;
    if (
      item.minimumRole &&
      !hasMinimumRole(resolvedSession, item.minimumRole) &&
      !isMayor(resolvedSession)
    ) {
      return false;
    }
    return true;
  };

  const toggleSubMenu = (menuId: string) => {
    setOpenSubMenu(openSubMenu === menuId ? null : menuId);
    setOpenNestedMenu(null); // Schließe tiefere Menüs beim Wechsel
  };

  const toggleNestedMenu = (nestedId: string) => {
    setOpenNestedMenu(openNestedMenu === nestedId ? null : nestedId);
  };

  return (
    <Styles.Overlay $isOpen={isOpen}>
      <Styles.MenuContent>
        {navConfig.map((item) => {
          if (!checkAuth(item)) return null;

          if (item.href && !item.subMenu) {
            return (
              <Styles.MobileNavLink key={item.id} href={item.href} onClick={onClose}>
                {t("links." + item.labelKey)}
              </Styles.MobileNavLink>
            );
          }

          const isSubOpen = openSubMenu === item.id;

          return (
            <Styles.MobileMenuWrapper key={item.id}>
              <Styles.MenuHeader onClick={() => toggleSubMenu(item.id)}>
                {t("links." + item.labelKey)}
                <Chevron isOpen={isSubOpen} />
              </Styles.MenuHeader>

              <Styles.SubMenu $isOpen={isSubOpen}>
                {item.subMenu?.map((sub) => {
                  if (!checkAuth(sub)) return null;

                  // FALL A: 3. Ebene (verschachtelte Kategorie im mobilen Menü)
                  if (sub.subMenu && sub.subMenu.length > 0) {
                    const isNestedOpen = openNestedMenu === sub.labelKey;

                    return (
                      <div key={sub.labelKey} style={{ width: "100%" }}>
                        <Styles.MenuHeader
                          onClick={() => toggleNestedMenu(sub.labelKey)}
                          style={{ fontSize: "1.2rem", padding: "10px 20px" }}
                        >
                          {t("links." + sub.labelKey)}
                          <Chevron isOpen={isNestedOpen} />
                        </Styles.MenuHeader>

                        <Styles.SubMenu $isOpen={isNestedOpen}>
                          {sub.subMenu.map((nested) => {
                            if (!checkAuth(nested)) return null;

                            return (
                              <Styles.SubNavLink
                                key={nested.href}
                                href={nested.href!}
                                onClick={onClose}
                                style={{ paddingLeft: "2rem" }}
                              >
                                {t("links." + nested.labelKey)}
                              </Styles.SubNavLink>
                            );
                          })}
                        </Styles.SubMenu>
                      </div>
                    );
                  }

                  // FALL B: Normale 2. Ebene (Direkter Link)
                  return (
                    <Styles.SubNavLink key={sub.href} href={sub.href!} onClick={onClose}>
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
