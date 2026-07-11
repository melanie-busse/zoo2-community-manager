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
  Mayor: "/images/roles/Mayor.webp",
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
        <Tooltip text={role ? t(`role.role_${role}`) : t("role.role_")}>
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

  position: relative;

  background-color: ${({ theme }) => theme.colors.accent.warm};
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.primary["500"]};
  cursor: help;

  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.3s ease;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
  }
`;

export const BadgeContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 5px;

  &:hover ${RoleIconWrapper} {
    animation: ${hoverBounce} 0.4s forwards;
    border-color: ${({ theme }) => theme.colors.accent.main};
  }
`;
