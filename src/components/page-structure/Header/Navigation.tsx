"use client";

import { IoChevronDown } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { usePathname, Link } from "@/i18n/routing";

import * as Styles from "./Navigation.styles";
import { navConfig } from "@/config/navigationData";

export default function Navigation() {
  const t = useTranslations();
  const { data: session } = useSession();
  const pathname = usePathname();

  const checkActive = (item: any) => {
    if (!pathname) return false;
    if (item.href) return pathname === item.href;
    if (item.basePath) return pathname.startsWith(item.basePath);
    return false;
  };

  return (
    <Styles.NavContainer>
      <Styles.NavList>
        {navConfig.map((item) => {
          if (item.requiresAuth && !session) return null;

          return (
            <Styles.NavItem key={item.id} data-testid={`nav-item-${item.id}`}>
              {item.href && !item.subMenu ? (
                <Styles.NavLink as={Link} href={item.href} $active={pathname === item.href}>
                  {t("Header.Navigation." + item.labelKey)}
                </Styles.NavLink>
              ) : (
                <>
                  <Styles.NavButton $active={checkActive(item)}>
                    {t("Header.Navigation." + item.labelKey)} <IoChevronDown className="arrow" />
                  </Styles.NavButton>
                  <Styles.Dropdown>
                    {item.subMenu?.map((sub) => {
                      if (sub.requiresAuth && !session) return null;

                      return (
                        <li key={sub.href}>
                          <Styles.DropdownLink
                            as={Link}
                            href={sub.href}
                            $active={pathname === sub.href}
                            data-testid={`nav-sub-${item.id}-${sub.labelKey}`}
                          >
                            {t("Header.Navigation." + sub.labelKey)}
                          </Styles.DropdownLink>
                        </li>
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
