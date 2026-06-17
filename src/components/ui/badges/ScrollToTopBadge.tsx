"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslations } from "next-intl";

export default function ScrollToTopBadge() {
  const t = useTranslations("Common");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Wir prüfen das Window, aber auch den Body und das Root-Element
      const scrolled =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

      // Falls du in einem div mit overflow scrollst, hilft das hier:
      const manualCheck = document.querySelector("main")?.scrollTop || 0;

      const finalScrollValue = Math.max(scrolled, manualCheck);

      setIsVisible(finalScrollValue > 200);
    };

    // 'true' als dritter Parameter (Capture) sorgt dafür, dass wir
    // den Event auch hören, wenn er in einem Unterelement (wie Main) passiert
    window.addEventListener("scroll", handleScroll, true);

    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const scrollToTop = () => {
    // 1. Standard-Window-Scroll (falls das Fenster scrollt)
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 2. Dokument-Ebene (Sicherheitsnetz für HTML/Body)
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });

    // 3. Main-Element-Scroll (da du es schon im useEffect abfragst!)
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 4. Fallstrick aus dem vorherigen Schritt: Dein äußerer Layout-Wrapper
    // Falls dein Haupt-Container eine Klasse oder ID hat, kannst du ihn hier auch triggern:
    const pageWrapper = document.querySelector("[class*='Wrapper']");
    if (pageWrapper) {
      pageWrapper.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <ScrollButton onClick={scrollToTop} title={t("scroll_to_top")} aria-label={t("scroll_to_top")}>
      🐾
    </ScrollButton>
  );
}

const popIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const ScrollButton = styled.button`
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1000;
  width: 56px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.accent.main};
  color: white;
  border: 3px solid ${({ theme }) => theme.colors.ui.white};
  border-radius: 50%;
  font-size: 1.8rem;
  cursor: pointer;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  animation: ${popIn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1) translateY(-3px);
    background-color: ${({ theme }) => theme.colors.primary[100]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
    bottom: 80px;
    right: 20px;
  }
`;
