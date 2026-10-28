import styled, { css } from "styled-components";
import Link from "next/link";

/* ==========================================================================
   MOBILE NAVIGATION STYLES
   ========================================================================== */

export const Overlay = styled.nav<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary["600"]};
  z-index: 9999;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Animation */
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
`;

export const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100%;
  padding: 80px 20px 40px 20px;
`;

export const MobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const MenuHeader = styled.div`
  font-family: ${({ theme }) => theme.fonts.club};
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.ui.white};
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
`;

export const SubMenu = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? "1000px" : "0")};
  transition: all 0.3s ease-in-out;
  background: rgba(255, 255, 255, 0.05);
  width: 100%;
  padding: ${({ $isOpen }) => ($isOpen ? "10px 0" : "0")};
`;

export const SubNavLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.accent.main};
  text-decoration: none;
  padding: 12px 0;
  font-weight: bold;

  &:active {
    color: ${({ theme }) => theme.colors.ui.white};
  }
`;

export const MobileNavLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.club};
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.ui.white};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 1rem 0;
`;

export const LoginContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
`;

export const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 1rem 0;
`;

/* ==========================================================================
   DESKTOP NAVIGATION STYLES
   ========================================================================== */

export const NavContainer = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 1rem;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  position: relative;

  /* Zeige das 1. Dropdown beim Hovern über den Hauptmenüpunkt */
  &:hover > ul {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover .arrow {
    transform: rotate(180deg);
  }
`;

export const NavElementStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 1.2rem;

  background: ${({ theme }) => theme.colors.ui.glassWhite};
  border: ${({ theme }) => theme.shadows.headerButton};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  box-shadow: ${({ theme }) => theme.shadows.headerButton};

  color: ${({ theme }) => theme.colors.ui.icon};
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.headerButtonHover};
    background: ${({ theme }) => theme.colors.accent.hover};
  }

  .arrow {
    transition: transform 0.3s ease;
  }
`;

export const NavLink = styled(Link)<{ $active: boolean }>`
  ${NavElementStyles};
  color: ${({ $active, theme }) => ($active ? theme.colors.accent.main : theme.colors.ui.icon)};

  &::before {
    content: "🐾";
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    display: ${({ $active }) => ($active ? "block" : "none")};
    filter: drop-shadow(1px 1px 0 ${({ theme }) => theme.colors.ui.overlayDark});
    font-size: 0.8rem;
  }
`;

interface NavButtonProps {
  $active: boolean;
}

export const NavButton = styled.div<NavButtonProps>`
  ${NavElementStyles};

  color: ${({ $active, theme }) => ($active ? theme.colors.accent.main : theme.colors.ui.icon)};
  cursor: pointer;

  &::before {
    content: "🐾";
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    display: ${({ $active }) => ($active ? "block" : "none")};
    filter: drop-shadow(1px 1px 0 ${({ theme }) => theme.colors.ui.overlayDark});
    font-size: 0.8rem;
  }
`;

/* --------------------------------------------------------------------------
   DROPDOWN EBENE 1 (Unter dem Hauptmenüpunkt)
   -------------------------------------------------------------------------- */

export const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;

  background: ${({ theme }) => theme.colors.header.bg};
  backdrop-filter: ${({ theme }) => theme.glass.blur};
  border: ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  list-style: none;
  padding: 0.5rem 0;
  margin-top: 5px;

  z-index: 2002;

  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
`;

export const DropdownItem = styled.li`
  position: relative;

  /* Zeige das Sub-Dropdown (Ebene 2/3) beim Hovern über dieses Item */
  &:hover > ul {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  &:hover .sub-arrow {
    transform: rotate(-90deg);
  }
`;

export const DropdownLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 10px 20px;
  color: ${({ theme }) => theme.colors.primary["500"]};
  text-decoration: none;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.text};

  background: ${({ $active, theme }) =>
    $active ? theme.colors.header.dropdownLink : "transparent"};

  font-weight: ${(props) => (props.$active ? "900" : "400")};

  border-left: 4px solid ${({ $active, theme }) => ($active ? theme.colors.ui.icon : "transparent")};

  &:hover {
    background: ${({ theme }) => theme.colors.ui.glassWhiteRich || "#f5f5f5"};
    color: ${({ theme }) => theme.colors.ui.icon};
    padding-left: 25px;
  }
`;

/* --------------------------------------------------------------------------
   DROPDOWN EBENE 2 / SUB-DROPDOWN (Flyout nach rechts)
   -------------------------------------------------------------------------- */

export const DropdownHeader = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  color: ${({ theme }) => theme.colors.primary["500"]};
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.text};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.ui.glassWhiteRich || "#f5f5f5"};
    color: ${({ theme }) => theme.colors.ui.icon};
    padding-left: 25px;
  }

  .sub-arrow {
    transition: transform 0.3s ease;
    font-size: 0.85rem;
  }
`;

export const SubDropdown = styled.ul`
  position: absolute;
  top: 0;
  left: 100%;
  min-width: 200px;

  background: ${({ theme }) => theme.colors.header.bg};
  backdrop-filter: ${({ theme }) => theme.glass.blur};
  border: ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  list-style: none;
  padding: 0.5rem 0;
  margin-left: 4px;

  z-index: 2003;

  opacity: 0;
  visibility: hidden;
  transform: translateX(-10px);
  transition: all 0.3s ease;
`;
