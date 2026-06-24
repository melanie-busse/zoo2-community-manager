"use client";

import { useEffect, useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";

import * as Styles from "./Header.styles";

import Navigation from "@/components/page-structure/Header/Navigation";
import Logo from "@/components/page-structure/Header/Logo";
import MobileNavigation from "@/components/page-structure/Header/MobileNavigation";
import Login from "@/components/page-structure/Header/Login";

export default function Header() {
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <Styles.StyledHeader>
      <Styles.LogoWrapper>
        <Logo />
      </Styles.LogoWrapper>

      <Styles.TitleSection>
        <Styles.MainTitle>{t("Title")}</Styles.MainTitle>
      </Styles.TitleSection>

      <Styles.MobileMenuButton onClick={toggleMenu} aria-label="Toggle Menu">
        {isMenuOpen ? <IoClose size={32} /> : <IoMenu size={32} />}
      </Styles.MobileMenuButton>

      <MobileNavigation isOpen={isMenuOpen} onClose={toggleMenu} />

      <Styles.NavSection>
        <Navigation />
      </Styles.NavSection>

      <Styles.RightSection>
        <Login />
      </Styles.RightSection>
    </Styles.StyledHeader>
  );
}
