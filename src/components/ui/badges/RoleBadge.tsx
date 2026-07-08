"use client";

import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Tooltip from "@/components/ui/tooltip/Tooltip";

const ROLE_IMAGES = {
  Director: "/images/roles/Grandpa.webp",
  Employee: "/images/roles/Lucy.webp",
  Member: "/images/roles/Jenkins.webp",
  Visitor: "/images/roles/Vicky.webp",
};

interface RoleBadgeProps {
  role: "Director" | "Employee" | "Member" | "Visitor" | string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const t = useTranslations("navigation");

  const imageSrc = ROLE_IMAGES[role as keyof typeof ROLE_IMAGES] || ROLE_IMAGES.Visitor;

  return (
    <BadgeContainer>
      <RoleIconWrapper>
        <Tooltip text={role ? t(`Header.Role.role_${role}`) : t("Header.Role.role_")}>
          <Image src={imageSrc} alt={role} width={45} height={45} priority />
        </Tooltip>
      </RoleIconWrapper>
    </BadgeContainer>
  );
}

// --- Animationen ---

const hoverBounce = keyframes`
  0% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.1) translateY(-5px); }
  100% { transform: scale(1.05) translateY(-3px); }
`;

const popIn = keyframes`
  0% { transform: scale(0); rotate: -20deg; }
  70% { transform: scale(1.2); rotate: 10deg; }
  100% { transform: scale(1); rotate: 0deg; }
`;

const RoleIconWrapper = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.ui.icon};

  /* WICHTIG: Kein overflow: hidden! (Für den Tooltip) */
  /* WICHTIG: position: relative, damit der Tooltip darauf referenziert */
  position: relative;

  background-color: ${({ theme }) => theme.colors.accent.warm};
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.primary["500"]};
  cursor: help;

  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.3s ease;

  /* --- HIER KOMMT DER FIX FÜR DAS BILD --- */
  img {
    object-fit: cover; /* WICHTIG: Das Bild wird skaliert und nicht verzerrt */
    width: 100%;
    height: 100%;

    /* NEU: Da der Wrapper das overflow nicht macht, muss das Bild selbst rund sein */
    border-radius: 50%;

    /* NEU: Erzwingt, dass das Bild innerhalb des Wrappers bleibt (Box-Model Fix) */
    display: block;
  }
`;

export const BadgeContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  /* Der Container sollte eine feste Fläche haben, die sich nicht bewegt */
  padding: 5px;

  /* TRIGGER: Wenn der Container gehovert wird, animiere das Icon darin */
  &:hover ${RoleIconWrapper} {
    animation: ${hoverBounce} 0.4s forwards;
    border-color: ${({ theme }) => theme.colors.accent.main};
  }
`;
