"use client";

import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { usePathname, Link } from "@/i18n/routing";

import * as Styles from "./Navigation.styles";
import { navConfig, NavItem, SubMenuItem } from "@/config/navigationData";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

export default function Navigation() {
  const t = useTranslations("navigation");
  const { data: session, status } = useSession();
  const resolvedSession = status === "loading" ? null : session;
  const pathname = usePathname();

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

  const checkActive = (item: NavItem | SubMenuItem) => {
    if (!pathname) return false;
    if (item.href) return pathname === item.href;
    if ("basePath" in item && item.basePath) return pathname.startsWith(item.basePath);
    return false;
  };

  return (
    <Styles.NavContainer>
      <Styles.NavList>
        {navConfig.map((item) => {
          if (!checkAuth(item)) return null;

          return (
            <Styles.NavItem key={item.id} data-testid={`nav-item-${item.id}`}>
              {item.href && !item.subMenu ? (
                <Styles.NavLink as={Link} href={item.href} $active={pathname === item.href}>
                  {t("links." + item.labelKey)}
                </Styles.NavLink>
              ) : (
                <>
                  <Styles.NavButton $active={checkActive(item)}>
                    {t("links." + item.labelKey)} <IoChevronDown className="arrow" />
                  </Styles.NavButton>

                  <Styles.Dropdown>
                    {item.subMenu?.map((sub) => {
                      if (!checkAuth(sub)) return null;

                      // FALL A: 3. Ebene ist vorhanden (Kategorie mit Untermenü)
                      if (sub.subMenu && sub.subMenu.length > 0) {
                        return (
                          <Styles.DropdownItem key={sub.labelKey}>
                            <Styles.DropdownHeader>
                              {t("links." + sub.labelKey)}
                              <IoChevronForward className="sub-arrow" />
                            </Styles.DropdownHeader>

                            <Styles.SubDropdown>
                              {sub.subMenu.map((nested) => {
                                if (!checkAuth(nested)) return null;

                                return (
                                  <li key={nested.href}>
                                    <Styles.DropdownLink
                                      as={Link}
                                      href={nested.href!}
                                      $active={pathname === nested.href}
                                      data-testid={`nav-sub-${item.id}-${nested.labelKey}`}
                                    >
                                      {t("links." + nested.labelKey)}
                                    </Styles.DropdownLink>
                                  </li>
                                );
                              })}
                            </Styles.SubDropdown>
                          </Styles.DropdownItem>
                        );
                      }

                      // FALL B: Normale 2. Ebene (Direkter Link)
                      return (
                        <Styles.DropdownItem key={sub.href}>
                          <Styles.DropdownLink
                            as={Link}
                            href={sub.href!}
                            $active={pathname === sub.href}
                            data-testid={`nav-sub-${item.id}-${sub.labelKey}`}
                          >
                            {t("links." + sub.labelKey)}
                          </Styles.DropdownLink>
                        </Styles.DropdownItem>
                      );
                    })}
                  </Styles.Dropdown>
                </>
              )}
            </Styles.NavItem>
          );
        })}
      </Styles.NavList>
    </Styles.NavContainer>
  );
}
