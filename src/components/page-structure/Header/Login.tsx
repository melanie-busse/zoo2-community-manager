"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./Login.styles";
import LangSwitcher from "./LangSwitcher";
import RoleBadge from "../../ui/badges/RoleBadge";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function Login() {
  const { data: session } = useSession();
  const t = useTranslations();
  const [showLogout, setShowLogout] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  // @ts-expect-error - Falls die Rolle noch nicht im Standard-Typ von NextAuth ist
  const userRole = user?.role || "";

  useClickOutside(wrapperRef, () => setShowLogout(false));

  return (
    <Styles.LoginWrapper ref={wrapperRef}>
      <Styles.TopRow>
        <LangSwitcher />

        {session ? (
          <Styles.AvatarContainer>
            <Styles.UserWrapper onClick={() => setShowLogout(!showLogout)}>
              <Styles.UserImage src={user?.image || "/images/default-avatar.png"} alt="Profil" />
              {!showLogout && (
                <Styles.AvatarTooltip className="avatar-tooltip">
                  {t("Header.Login.open_menu")} 🐾
                </Styles.AvatarTooltip>
              )}
            </Styles.UserWrapper>

            {showLogout && (
              <Styles.LogoutBadge onClick={() => signOut({ callbackUrl: "/" })}>
                {t("Header.Login.logout")} 👋
              </Styles.LogoutBadge>
            )}
          </Styles.AvatarContainer>
        ) : (
          <Styles.HeaderButton onClick={() => signIn("discord")}>
            {t("Header.Login.button")}
          </Styles.HeaderButton>
        )}
      </Styles.TopRow>

      {session && (
        <Styles.BottomRow>
          <Styles.FlexContainer>
            <RoleBadge role={userRole} />
            <Styles.WelcomeText>
              {t("Header.Login.welcome")}, {user?.name?.split(" ")[0]}!
            </Styles.WelcomeText>
          </Styles.FlexContainer>
        </Styles.BottomRow>
      )}
    </Styles.LoginWrapper>
  );
}
