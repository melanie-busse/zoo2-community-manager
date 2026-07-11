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
  const tNav = useTranslations("navigation");
  const tUser = useTranslations("user");

  const [showLogout, setShowLogout] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const userRole = user?.role || "";

  useClickOutside(wrapperRef, () => {
    setShowLogout(false);
    setShowLoginDropdown(false);
  });

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
                  {tNav("login.open_menu")} 🐾
                </Styles.AvatarTooltip>
              )}
            </Styles.UserWrapper>

            {showLogout && (
              <Styles.LogoutBadge onClick={() => signOut({ callbackUrl: "/" })}>
                {tNav("login.logout")} 👋
              </Styles.LogoutBadge>
            )}
          </Styles.AvatarContainer>
        ) : (
          <Styles.DropdownContainer>
            <Styles.HeaderButton onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
              {tNav("login.button")}
            </Styles.HeaderButton>

            {showLoginDropdown && (
              <Styles.Menu onMouseLeave={() => setShowLoginDropdown(false)}>
                <Styles.MenuItem onClick={() => signIn("discord")}>
                  {tUser("Auth.loginWithDiscord")} 🎮
                </Styles.MenuItem>
                <Styles.MenuItem onClick={() => signIn("mayor-login")}>
                  {tUser("Auth.loginAsMayor")} 🎩
                </Styles.MenuItem>
              </Styles.Menu>
            )}
          </Styles.DropdownContainer>
        )}
      </Styles.TopRow>

      {session && (
        <Styles.BottomRow>
          <Styles.FlexContainer>
            <RoleBadge role={userRole} />
            <Styles.WelcomeText>
              {tNav("login.welcome")}, {user?.name?.split(" ")[0]}!
            </Styles.WelcomeText>
          </Styles.FlexContainer>
        </Styles.BottomRow>
      )}
    </Styles.LoginWrapper>
  );
}

